// noinspection JSUnusedGlobalSymbols

import GettextReaderInterface from "../../Interfaces/Gettext/Reader/GettextReaderInterface";
import GettextTranslationsInterface from "../../Interfaces/Gettext/GettextTranslationsInterface";
import {is_array_buffer_like, is_string} from "../../Utils/Helper";
import InvalidArgumentException from "../../Exceptions/InvalidArgumentException";
import GettextTranslations from "../GettextTranslations";
import StreamBuffer from "../../Utils/StreamBuffer";

/**
 * low endian
 */
const MAGIC1 = 0x950412de;
/**
 * big endian
 */
const MAGIC2 = 0xde120495;

export default class MoReader implements GettextReaderInterface {
    /**
     * Read the content and return the translations
     *
     * @param {string|ArrayBufferLike} content the content to read
     */
    public read(content: string | ArrayBufferLike): GettextTranslationsInterface {
        if (!is_string(content) && !is_array_buffer_like(content)) {
            throw new InvalidArgumentException(
                `The content must be a string or an ArrayBufferLike, ${typeof content} given`
            );
        }
        let stream: StreamBuffer = new StreamBuffer(content);

        const magic = this.readInt(stream);
        let format: "V" | "N";
        if (magic === MAGIC1 || magic === (MAGIC1 & 0xffffffff)) {
            // low endian
            format = "V";
        } else if (magic === (MAGIC2 & 0xffffffff)) {
            // big endian
            format = "N";
        } else {
            throw new InvalidArgumentException(
                `The stream is not gettext mo data`
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
        const translations = new GettextTranslations();

        translations.revision = revision;
        let pluralForms = translations.headers.pluralForm;
        for (let i = 0; i < total; ++i) {
            let next = i * 2;
            stream.seek(originalTable[next + 2]);
            let original = originalTable[next + 1] === 0
                ? ''
                : stream.read(originalTable[next + 1]);
            stream.seek(translationTable[next + 2]);
            let translated = stream.read(translationTable[next + 1]);

            if (original === '') {
                for (let header of translated.split("\n")) {
                    if (header.trim() === '') {
                        continue;
                    }
                    let [key, ...value] = header.split(':');
                    translations.headers.set(key.trim(), value.join(':').trim());
                }
                continue;
            }
            let context = null;
            let plural = null;
            let chunks = original.split("\x04");
            if (chunks.length > 1) {
                original = chunks[1];
                context = chunks[0];
            }
            chunks = original.split("\0");
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
            translation.pluralForm = pluralForms;
            translation.translation = translated;
            translations.add(translation);
            if (translated === '' || plural === null) {
                continue;
            }
            let v = translated.split("\0");
            v.shift();
            translation.pluralTranslations = v.filter((value) => value.trim() !== '');
        }
        translations.setTranslationsPluralForm(translations.headers.pluralForm);
        return translations;
    }

    private readInt(buffer: StreamBuffer, mode: "V" | "N" = 'V'): number {
        return buffer.readUint32(mode === "V");
    }

    private readIntArray(buffer: StreamBuffer, mode: "V" | "N", count: number): Array<number> {
        const data: Array<number> = [];
        for (let i = 0; i < count; i++) {
            data.push(this.readInt(buffer, mode));
        }
        return data;
    }
}