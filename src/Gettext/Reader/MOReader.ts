import GettextReaderInterface from '../Interfaces/Reader/GettextReaderInterface';
import InvalidArgumentException from '../../Exceptions/InvalidArgumentException';
import GettextTranslations from '../GettextTranslations';
import StreamBuffer from '../../Utils/StreamBuffer';
import {
    GettextTranslationsType,
    GettextTranslationType
} from '../../Utils/Type';

/**
 * low endian
 */
const MAGIC1 = 0x950412de;
/**
 * big endian
 */
const MAGIC2 = 0xde120495;

/**
 * The gettext mo reader
 */
export default class MOReader implements GettextReaderInterface{
    /**
     * @inheritDoc
     */
    public read(content: string | ArrayBufferLike): GettextTranslationsType {
        let stream: StreamBuffer = new StreamBuffer(content);
        const magic = this.readInt(stream);
        let format: 'V' | 'N';
        if (magic === MAGIC1 || magic === (MAGIC1 & 0xffffffff)) {
            // low endian
            format = 'V';
        } else if (magic === (MAGIC2 & 0xffffffff)) {
            // big endian
            format = 'N';
        } else {
            throw new InvalidArgumentException(
                'The stream is not gettext mo data'
            );
        }

        let revision = this.readInt(stream, format);
        let total = this.readInt(stream, format); //total string count
        let originalOffset = this.readInt(stream, format); //offset of original table
        let translationOffset = this.readInt(stream, format); //offset of translation table

        stream.seek(originalOffset); //skip the rest of header
        let originalTable = this.readIntArray(stream, format, total * 2);
        stream.seek(translationOffset);
        let translationTable = this.readIntArray(stream, format, total * 2);
        const translations = new GettextTranslations<GettextTranslationType, GettextTranslationsType>();

        translations.revision = revision;
        let pluralForm = translations.headers.pluralForm;
        for (let i = 0; i < total; ++i) {
            let next = i * 2;
            stream.seek(originalTable[next + 2]);
            let original = originalTable[next + 1] === 0
                ? ''
                : stream.read(originalTable[next + 1]);
            stream.seek(translationTable[next + 2]);
            let translated = stream.read(translationTable[next + 1]);

            if (original === '') {
                for (let header of translated.split('\n')) {
                    if (header.trim() === '') {
                        continue;
                    }
                    let [key, ...value] = header.split(':');
                    translations.headers.set(key.trim(), value.join(':').trim());
                }
                continue;
            }
            let context : string|null = null;
            let plural : string|null = null;
            let chunks = original.split('\x04');
            if (chunks.length > 1) {
                original = chunks[1];
                context = chunks[0];
            }
            chunks = original.split('\0');
            original = chunks[0];
            if (chunks.length > 1) {
                plural = chunks[1];
            }
            if (translated === '' && original !== '') {
                continue;
            }
            let translation = translations.createTranslation(
                context ?? '',
                original,
                plural ?? undefined
            );
            translation.pluralForm = pluralForm;
            translation.translation = translated;
            translations.add(translation);
            if (translated === '' || plural === null) {
                continue;
            }
            let v = translated.split('\0');
            v.shift();
            translation.pluralTranslations = v.filter((value) => value.trim() !== '');
        }
        translations.setEntriesPluralForm(translations.headers.pluralForm);
        return translations;
    }

    /**
     * Read integer from buffer
     *
     * @param {StreamBuffer} buffer
     * @param {'V' | 'N'} mode
     *
     * @return {number} the integer
     * @private
     */
    private readInt(buffer: StreamBuffer, mode: 'V' | 'N' = 'V'): number {
        return buffer.readUint32(mode === 'V');
    }

    /**
     * Read integer array from buffer
     *
     * @param {StreamBuffer} buffer - the buffer to read
     * @param {'V' | 'N'} mode - the mode of read format
     * @param {number} count - the count of read format
     *
     * @private
     */
    private readIntArray(buffer: StreamBuffer, mode: 'V' | 'N', count: number): Array<number> {
        const data: Array<number> = [];
        for (let i = 0; i < count; i++) {
            data.push(this.readInt(buffer, mode));
        }
        return data;
    }
}
