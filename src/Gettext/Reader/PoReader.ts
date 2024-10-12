// noinspection JSUnusedGlobalSymbols

import GettextReaderInterface from "../../Interfaces/Gettext/Reader/GettextReaderInterface";
import GettextTranslationsInterface from "../../Interfaces/Gettext/GettextTranslationsInterface";
import GettextTranslations from "../GettextTranslations";
import {is_array_buffer_like, is_string} from "../../Utils/Helper";
import InvalidArgumentException from "../../Exceptions/InvalidArgumentException";
import IterableArray from "../../Utils/IterableArray";
import {PositiveInteger} from "../../Utils/Type";
import {
    ATTRIBUTE_COMMENTED_TRANSLATIONS,
    ATTRIBUTE_COMMENTS,
    ATTRIBUTE_EXTRACTED_COMMENTS,
    ATTRIBUTE_FLAGS,
    ATTRIBUTE_MESSAGE_CONTEXT,
    ATTRIBUTE_MESSAGE_ID,
    ATTRIBUTE_MESSAGE_ID_PLURAL,
    ATTRIBUTE_MESSAGE_STR,
    ATTRIBUTE_REFERENCES
} from "../../Utils/GettextDefinitions/Attributes";

export default class PoReader implements GettextReaderInterface {

    /**
     * @inheritDoc
     */
    public read(content: string | ArrayBufferLike): GettextTranslationsInterface {
        if (!is_string(content) && !is_array_buffer_like(content)) {
            throw new InvalidArgumentException(
                `The content must be a string or an ArrayBufferLike, ${typeof content} given`
            );
        }
        content = is_string(content) ? content : new TextDecoder().decode(content);
        content = content.trim().replace(/\r\n/g, "\n"); // trim and normalize line endings

        const translations = new GettextTranslations();
        const lines = new IterableArray(content.split("\n"));
        let line = lines.current();
        let translation = translations.createTranslation('', '');
        let lastHeaderKey = '';
        // po always start with msgid "" and msgstr ""
        let msgidCount = 0;
        let stillMeta = true;
        let hasMsgstr = false;
        while (line !== false) {
            line = line.trim();
            let nextLine: string | false = lines.next();
            nextLine = nextLine === false ? false : nextLine.trim();
            const originalLine: string = line;
            //Multiline
            while (line.endsWith('"')
                && nextLine !== false
                && nextLine !== ''
                && (nextLine.startsWith('"') || nextLine.startsWith('#~ "'))
                ) {
                if (nextLine.startsWith('"')) {
                    line = line.slice(0, -1) + nextLine.slice(1);
                } else if (nextLine.startsWith('#~ "')) {
                    line = line.slice(0, -1) + nextLine.slice(4);
                }
                nextLine = lines.next();
            }
            if (line === '') {
                line = nextLine;
                if (translation.original && translation.translation) {
                    translations.add(translation);
                    translation = translations.createTranslation('', '');
                }
                line = nextLine;
                continue;
            }
            let splitLine = line.split(/\s+/, 2);
            let key = splitLine[0];
            let trans = (splitLine[1] || '').trim();
            if (key === '#~') {
                translation.enabled = false;
                splitLine = trans.split(/\s+/, 2);
                key = splitLine[0];
                trans = (splitLine[1] || '').trim();
            }
            if (trans === '') {
                line = nextLine;
                continue;
            }
            stillMeta = stillMeta || ['msgid', 'msgstr'].includes(key);
            switch (key) {
                case ATTRIBUTE_COMMENTS:
                    translation.attributes.comments.add(trans);
                    break;
                case ATTRIBUTE_EXTRACTED_COMMENTS:
                    translation.attributes.extractedComments.add(trans);
                    break;
                case ATTRIBUTE_FLAGS:
                    for (let value of trans.split(',').map((v) => v.trim())) {
                        translation.attributes.flags.add(value);
                    }
                    break;
                case ATTRIBUTE_REFERENCES:
                    for (let value of trans.split(/\s+/)) {
                        let matches = value.match(/^(.+)(:(\d*))?$/);
                        if (matches) {
                            let line = matches && matches[3] ? parseInt(matches[3]) : null;
                            translation.attributes.references.add(matches[1], line as PositiveInteger);
                        }
                    }
                    break;
                case ATTRIBUTE_MESSAGE_ID_PLURAL:
                    translation.plural = this.normalize(trans);
                    break;
                case ATTRIBUTE_MESSAGE_STR + '[0]':
                    translation.translation = this.normalize(trans);
                    break;
                case ATTRIBUTE_MESSAGE_CONTEXT:
                    // only allow this
                    // msgctxt ""
                    // msgid ""
                    // msgstr ""
                    // or
                    // msgid ""
                    // msgstr ""
                    // msgctx ""
                    if (originalLine !== '""' && (msgidCount === 0 || hasMsgstr && msgidCount === 1)) {
                        throw new InvalidArgumentException(
                            `Po file should start with msgid "" and msgstr "", ${originalLine} given`
                        );
                    }
                    translation = translation.withContext(this.normalize(trans));
                    break;
                case ATTRIBUTE_MESSAGE_ID:
                    msgidCount++;
                    stillMeta = stillMeta || msgidCount === 1;
                    // .po file should start with:
                    // msgid ""
                    // msgstr ""
                    // only allow comment & meta before msgid ""
                    if (msgidCount === 1 && (!stillMeta || originalLine !== '""')) {
                        throw new InvalidArgumentException(
                            `Po file should start with msgid "" and msgstr "", ${originalLine} given`
                        );
                    }
                    translation = translation.withOriginal(this.normalize(trans));
                    break;
                case ATTRIBUTE_MESSAGE_STR:
                    // .po file should start with:
                    // msgid ""
                    // msgstr ""
                    if (msgidCount === 0) {
                        throw new InvalidArgumentException(
                            `Po file should start with msgid "" and msgstr "", ${originalLine} given`
                        );
                    }
                    hasMsgstr = true;
                    translation.translation = this.normalize(trans);
                    break;
                case ATTRIBUTE_COMMENTED_TRANSLATIONS:
                    // skip commented translations
                    break;
                default:
                    if (key.startsWith(ATTRIBUTE_MESSAGE_STR + '[')) {
                        let p = translation.pluralTranslations;
                        p.push(this.normalize(trans));
                        translation.pluralTranslations = p;
                        stillMeta = false;
                        break;
                    }
                    // everything before msgid "" is header
                    if (msgidCount === 1) { // determine is header
                        let headers = line.split(':', 2).map((v) => v.trim());
                        if (headers.length === 2) {
                            lastHeaderKey = headers[0];
                            translations.headers.set(headers[0], headers[1]);
                        } else if (lastHeaderKey) {
                            let value = translations.headers.get(lastHeaderKey);
                            translations.headers.set(lastHeaderKey, value + "\n" + headers[0]);
                        }
                        break;
                    }
                    break;
            }
            line = nextLine;
        }
        lines.clear();
        return translations;
    }

    /**
     * Normalize string
     *
     * @param {string} value - the value to normalize
     * @private
     */
    private normalize(value: string): string {
        if (!value) {
            return '';
        }

        if (value[0] === '"') {
            value = value.substring(1, -1);
        }
        let replacer = {
            '\\t': "\t",
            '\\r': "\r",
            '\\n': "\n",
            '\\v': "\v",
            '\\f': "\f",
            '\\e': "\e",
            '\\a': "\x07",
            "\\b": "\x08",
            '\\\\': "\\",
            '\\"': '"',
        };
        for (let [key, val] of Object.entries(replacer)) {
            value = value.replaceAll(key, val);
        }
        return value;
    }
}
