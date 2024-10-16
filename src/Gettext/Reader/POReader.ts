// noinspection JSUnusedGlobalSymbols

import GettextReaderInterface from '../Interfaces/Reader/GettextReaderInterface';
import GettextTranslationsInterface from '../Interfaces/GettextTranslationsInterface';
import GettextTranslations from '../GettextTranslations';
import InvalidArgumentException from '../../Exceptions/InvalidArgumentException';
import IterableArray from '../../Utils/IterableArray';
import {
    ATTRIBUTE_COMMENTED_TRANSLATIONS,
    ATTRIBUTE_COMMENT,
    ATTRIBUTE_EXTRACTED_COMMENT,
    ATTRIBUTE_FLAGS,
    ATTRIBUTE_MESSAGE_CONTEXT,
    ATTRIBUTE_MESSAGE_ID,
    ATTRIBUTE_MESSAGE_ID_PLURAL,
    ATTRIBUTE_MESSAGE_STR,
    ATTRIBUTE_REFERENCES
} from '../Definitions/AttributeDefinitions';
import StreamBuffer from '../../Utils/StreamBuffer';
import GettextTranslationInterface from '../Interfaces/GettextTranslationInterface';

/**
 * The gettext po reader
 */
export default class POReader<
    Translation extends GettextTranslationInterface,
    Translations extends GettextTranslationsInterface<Translation, Translations>
> implements GettextReaderInterface<Translation, Translations> {

    /**
     * @inheritDoc
     */
    public read(content: string | ArrayBufferLike): Translations {
        content = (new StreamBuffer(content))
            .toString()
            .trim()
            .replace(/\r\n/g, '\n'); // trim and normalize line endings
        const translations = new GettextTranslations() as unknown as Translations;
        const lines = new IterableArray(content.split('\n'));
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
            // Multiline
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
            if (key === ATTRIBUTE_COMMENTED_TRANSLATIONS) {
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
                case ATTRIBUTE_COMMENT:
                    if (msgidCount === 0) {
                        translations.attributes.comments.add(trans);
                    } else {
                        translation.attributes.comments.add(trans);
                    }
                    break;
                case ATTRIBUTE_EXTRACTED_COMMENT:
                    if (msgidCount === 0) {
                        translations.attributes.extractedComments.add(trans);
                    } else {
                        translation.attributes.extractedComments.add(trans);
                    }
                    break;
                case ATTRIBUTE_FLAGS:
                    for (let value of trans.split(',').map((v) => v.trim())) {
                        if (msgidCount === 0) {
                            translations.attributes.flags.add(value);
                        } else {
                            translation.attributes.flags.add(value);
                        }
                    }
                    break;
                case ATTRIBUTE_REFERENCES:
                    for (let value of trans.split(/\s+/)) {
                        let matches = value.match(/^(.+)(:(\d*))?$/);
                        if (matches) {
                            let line = matches && matches[3] ? parseInt(matches[3]) : null;
                            translation.attributes.references.add(matches[1], line as number);
                        }
                    }
                    break;
                case ATTRIBUTE_MESSAGE_ID_PLURAL:
                    translation.plural = POReader.normalizeValue(trans);
                    break;
                case ATTRIBUTE_MESSAGE_STR + '[0]':
                    translation.translation = POReader.normalizeValue(trans);
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
                    translation = translation.withContext(POReader.normalizeValue(trans));
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
                    translation = translation.withOriginal(POReader.normalizeValue(trans));
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
                    translation.translation = POReader.normalizeValue(trans);
                    break;
                case ATTRIBUTE_COMMENTED_TRANSLATIONS:
                    // skip commented translations
                    // this commented translation already handled with set enabled = false
                    // so we can ignore it
                    break;
                default:
                    if (key.startsWith(ATTRIBUTE_MESSAGE_STR + '[')) {
                        let p = translation.pluralTranslations;
                        p.push(POReader.normalizeValue(trans));
                        translation.pluralTranslations = p;
                        stillMeta = false;
                        break;
                    }
                    // everything before msgid "" is header
                    if (msgidCount === 1) { // determine is header
                        let headers = line.split(':', 2).map((v) => v.trim());
                        if (headers.length === 2) {
                            headers[0] = headers[0].trim();
                            if (!headers[0] || !headers[0].match(/^[a-zA-Z0-9_-]+$/)) {
                                break;
                            }
                            lastHeaderKey = headers[0];
                            translations.headers.set(headers[0], headers[1]);
                        } else if (lastHeaderKey) {
                            let value = translations.headers.get(lastHeaderKey);
                            translations.headers.set(lastHeaderKey, value + '\n' + headers[0]);
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
    public static normalizeValue(value: string): string {
        if (!value) {
            return '';
        }

        if (value[0] === '"') {
            value = value.substring(1, -1);
        }

        let replacer = {
            '\\t': '\t', // horizontal tab (HT or 0x09 (9) in ASCII) = \t
            '\\r': '\r', // carriage return (CR or 0x0D (13) in ASCII) = \r
            '\\n': '\n', // linefeed (LF or 0x0A (10) in ASCII) = \n
            '\\v': '\v', // vertical tab (VT or 0x0B (11) in ASCII) = \v
            '\\f': '\f', // form feed (FF or 0x0C (12) in ASCII) = \f
            '\\e': '\x1B', // escape (ESC or 0x1B (27) in ASCII)
            '\\a': '\x07', // bell (BEL or 0x07 (7) in ASCII)
            '\\b': '\x08', // backspace (BS or 0x08 (8) in ASCII)
            '\\\\': '\\', // backslash
            '\\"': '"', // double quote
        };
        for (let [key, val] of Object.entries(replacer)) {
            value = value.replaceAll(key, val);
        }
        return value;
    }

    /**
     * Escape value for po file
     *
     * @param {string} value
     */
    public static escapeValue(value: string): string {
        let replacer = {
            '\t': '\\t', // horizontal tab (HT or 0x09 (9) in ASCII) = \t
            '\r': '\\r', // carriage return (CR or 0x0D (13) in ASCII) = \r
            '\n': '\\n', // linefeed (LF or 0x0A (10) in ASCII) = \n
            '\v': '\\v', // vertical tab (VT or 0x0B (11) in ASCII) = \v
            '\f': '\\f', // form feed (FF or 0x0C (12) in ASCII) = \f
            '\x1B': '\\e', // escape (ESC or 0x1B (27) in ASCII)
            '\x07': '\\a', // bell (BEL or 0x07 (7) in ASCII)
            '\x08': '\\b', // backspace (BS or 0x08 (8) in ASCII)
            '\\': '\\\\', // backslash
            '"': '\\"', // double quote
        };
        for (let [key, val] of Object.entries(replacer)) {
            value = value.replaceAll(key, val);
        }
        return value;
    }
}
