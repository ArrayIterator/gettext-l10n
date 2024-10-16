import GettextGeneratorInterface from '../Interfaces/Generator/GettextGeneratorInterface';
import StreamBuffer from '../../Utils/StreamBuffer';
import TranslationEntries from '../../Translations/TranslationEntries';
import InvalidArgumentException from '../../Exceptions/InvalidArgumentException';
import TranslationEntryInterface from '../../Translations/Interfaces/TranslationEntryInterface';
import {is_string} from '../../Utils/Helper';

/**
 * The translation generator for MO files
 */
export default class MOGenerator<Translations extends TranslationEntryInterface> implements GettextGeneratorInterface<Translations> {
    /**
     * Generate the MO file content
     * @inheritDoc
     * @throws {InvalidArgumentException} if the translations are not an instance of TranslationEntries
     */
    public generate(translations: Translations): StreamBuffer {
        // noinspection SuspiciousTypeOfGuard
        if (!(translations instanceof TranslationEntries)) {
            throw new InvalidArgumentException(
                `The translations must be an instance of ${TranslationEntries.name}, ${typeof translations} given`
            );
        }
        // pack('L', );
        const stream = new StreamBuffer();
        // write revision
        stream.writeUint32(translations.revision);
        let messages: {
            [key: string]: TranslationEntryInterface | string
        } = {};
        let lines: string[] = [];
        translations.headers.forEach((value, key) => {
            lines.push(`"${key}": "${value}"`);
        });
        messages[''] = lines.join('\n');
        translations.entries.forEach(([_, translation]) => {
            const context = translation.context;
            const key: string = context ? `${context}\x04${translation.original}` : translation.original;
            messages[key] = translation;
        });
        const numEntries = Object.keys(messages).length;
        let originalsTable = '';
        let translationsTable = '';
        let originalsIndex = [];
        let translationsIndex = [];
        let pluralSize = Math.max(translations.headers.pluralForm.pluralCount - 1, 1);
        for (let [originalString, translation] of Object.entries(messages)) {
            let translationString: string;
            if (is_string(translation)) {
                translationString = translation;
            } else if (is_string(translation.plural)) {
                originalString += `\x00${translation.plural}`;
                translationString = `${translation.translation}\x00`;
                let pluralTranslations = translation.pluralTranslations;
                translationString += pluralTranslations.slice(0, pluralSize).join('\x00');
            } else {
                translationString = translation.translation || '';
            }
            originalsTable += originalString + '\x00';
            translationsTable += translationString + '\x00';
            originalsIndex.push({
                relativeOffset: originalsTable.length,
                length: originalString.length
            });
            translationsIndex.push({
                relativeOffset: translationsTable.length,
                length: translationString.length
            });
        }

        let originalsIndexOffset: number = 7 * 4;
        let originalsIndexSize: number = numEntries * (4 + 4);
        let translationsIndexOffset: number = originalsIndexOffset + originalsIndexSize;
        let translationsIndexSize: number = numEntries * (4 + 4);
        let originalsStringsOffset: number = translationsIndexOffset + translationsIndexSize;
        let translationsStringsOffset = originalsStringsOffset + originalsTable.length;
        stream.writeUint32(0x950412de);
        stream.writeUint32(0);
        stream.writeUint32(numEntries);
        stream.writeUint32(originalsIndexOffset);
        stream.writeUint32(translationsIndexOffset);
        stream.writeUint32(0);
        stream.writeUint32(translationsIndexOffset + translationsIndexSize);
        while (originalsIndex.length > 0) {
            let info = originalsIndex.shift();
            if (!info) {
                break;
            }
            stream.writeUint32(info.length);
            stream.writeUint32(originalsStringsOffset + info.relativeOffset);
        }
        while (translationsIndex.length > 0) {
            let info = translationsIndex.shift();
            if (!info) {
                break;
            }
            stream.writeUint32(info.length);
            stream.writeUint32(translationsStringsOffset + info.relativeOffset);
        }
        stream.write(originalsTable);
        stream.write(translationsTable);
        return stream;
    }
}
