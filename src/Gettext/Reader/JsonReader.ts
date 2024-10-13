import GettextReaderInterface from '../Interfaces/Reader/GettextReaderInterface';
import GettextTranslationsInterface from '../Interfaces/GettextTranslationsInterface';
import {
    is_array_buffer_like_or_view,
    is_numeric_integer,
    is_object,
    is_string,
    normalize_number
} from '../../Utils/Helper';
import InvalidArgumentException from '../../Exceptions/InvalidArgumentException';
import GettextTranslations from '../GettextTranslations';
import GettextTranslationInterface from '../Interfaces/GettextTranslationInterface';

/**
 * Json Reader:
 * {
 *     "title": "The translation file for the English language.",
 *     "description": "This is an example translation file for the English language.",
 *     "type": "object",
 *     "revision": 1,
 *     "flags": ["fuzzy", "c-format"],
 *     "references": ["src/file.js:10"],
 *     "comments": "This is a comment about the translation file.",
 *     "headers": {
 *         "project-id-version": "My Project 1.0",
 *         "pot-creation-date": "2023-10-01 12:00+0000",
 *         "po-revision-date": "2023-10-01 12:00+0000",
 *         "last-translator": "John Doe <john.doe@example.com>",
 *         "language-team": "English <en@example.com>",
 *         "language": "en",
 *         "mime-version": "1.0",
 *         "content-type": "text/plain; charset=UTF-8",
 *         "content-transfer-encoding": "8bit",
 *         "plural-forms": "nplurals=2; plural=(n != 1);"
 *     },
 *     "translations": {
 *         "": {
 *             "": {
 *                 "msgid": "",
 *                 "msgstr": [
 *                     "Content-Type: text/plain; charset=UTF-8\n"
 *                 ],
 *                 "comments": "This is a comment for the translator as a string."
 *             }
 *         },
 *         "context1": [
 *             {
 *                 "msgid": "Hello, world!",
 *                 "msgstr": ["Hello, world!"],
 *                 "comments": "This is a comment for the translator as a string.",
 *                 "references": ["src/file.js:10"],
 *                 "flags": ["fuzzy"]
 *             }
 *         ],
 *         "context2withObject": {
 *             "Hello world!": {
 *                 "msgid": "Hello, world!",
 *                 "msgstr": ["Hello, world!"],
 *                 "comments": [
 *                     "the key is the msgid",
 *                     "the key will ignore or just be as a key reference"
 *                 ],
 *                 "references": ["src/file.js:10"],
 *                 "flags": ["fuzzy"]
 *             }
 *         }
 *     }
 * }
 */
export default class JsonReader implements GettextReaderInterface {
    /**
     * @inheritDoc
     */
    public read(content: string | ArrayBufferLike): GettextTranslationsInterface {
        if (!is_string(content) && !is_array_buffer_like_or_view(content)) {
            throw new InvalidArgumentException(
                `The content must be a string or an ArrayBufferLike, ${typeof content} given`
            );
        }
        content = is_string(content) ? content : new TextDecoder().decode(content);
        let object: {
            [key: string]: any;
        };
        try {
            object = JSON.parse(content);
        } catch (e) {
            throw new InvalidArgumentException(
                `The content is not a valid JSON with error: ${(e as Error)?.message ?? 'unknown'}`
            );
        }
        if (!is_object(object)) {
            throw new InvalidArgumentException(
                'The content is not a valid JSON'
            );
        }
        let revision = is_numeric_integer(object.revision) ? normalize_number(object.revision) as number : 0;
        const translations = new GettextTranslations(revision);
        const headers : {
            [key: string]: string;
        } = object.headers;
        if (is_object(headers)) {
            for (let key in headers) {
                if (!headers.hasOwnProperty(key)) {
                    continue;
                }
                const value = headers[key];
                translations.headers.set(key, value);
            }
        }
        type TranslationObject = {
            msgid: string;
            msgid_plural?: string;
            msgstr: string[];
            reference?: Array<string>;
            comments?: Array<string>|string;
            flags?: Array<string>;
            enable?: boolean;
        };
        type MetaTranslationObject = {
            '': {
                '': {
                    msgid: '';
                    msgstr: string[];
                };
            };
        }
        type TranslationObjects = {
            [context: string]: TranslationObject;
        };
        const translationsObject: TranslationObjects = object.translations || {};
        if (!is_object(translationsObject)) {
            throw new InvalidArgumentException(
                'The translations object is not valid'
            );
        }
        // process meta
        const meta = translationsObject[''] as unknown as MetaTranslationObject;
        delete translationsObject['']; // delete meta
        if (is_object(meta) && is_object(meta[''])) {
            const translationObject = meta[''][''];
            const msgid = translationObject.msgid;
            const msgstr = translationObject.msgstr;
            // the msgid is empty and msgstr is an array of strings
            if (msgid === '' && Array.isArray(msgstr) && msgstr.every(is_string)) {
                for (let header of msgstr) {
                    if (header.trim() === '') {
                        continue;
                    }
                    let [key, value] = header.split(':', 2);
                    key = key.trim();
                    value = value.trim();
                    if (key === '' || value === '') {
                        continue;
                    }
                    translations.headers.set(key, value);
                }
            }
        }
        /**
         * Parse flags
         * @param {any} flags
         */
        const parse_flags = (flags: any): Array<string> => {
            if (is_string(flags)) {
                flags = [flags];
            }
            flags = Array.isArray(flags) ? flags : [];
            // filter valid flags : /^([a-z]+([a-z-]*[a-z]+)?|range:[0-9]+-[0-9]+)$/i
            return flags
                .filter((flag: string) => is_string(flag) && flag.trim() !== '' && /^([a-z]+([a-z-]*[a-z]+)?|range:[0-9]+-[0-9]+)$$/i.test(flag));
        }
        /**
         * Parse comments
         * @param {any} comments
         */
        const parse_comments = (comments: any): Array<string> => {
            if (is_string(comments)) {
                comments = [comments];
            }
            comments = Array.isArray(comments) ? comments : [];
            comments = comments.filter((comment: string) => is_string(comment) && comment.trim() !== '');
            return comments;
        }
        /**
         * Parse references
         * @param {any} references
         * @returns {Array<{file: string, line?: number}>}
         */
        const parse_references = (references: any): Array<{
            file: string;
            line?: number;
        }> => {
            if (is_string(references)) {
                references = [references];
            }
            references = Array.isArray(references) ? references : [];
            references = references.filter((ref: string) => is_string(ref) && ref.trim() !== '');
            references = references.map((ref: string) => {
                ref = ref.trim();
                if (ref === '') {
                    return false;
                }
                let matches;
                let definitions: {
                    file: string;
                    line?: number;
                } = {
                    file: ref,
                    line: undefined
                };
                if (ref.includes(':')) {
                    matches = ref.match(/^(.+):([0-9]+)$/);
                    if (!matches) {
                        return false;
                    }
                    definitions.file = matches[1];
                    definitions.line = parseInt(matches[2]);
                } else {
                    definitions.file = ref;
                }
                return {
                    file: definitions.file,
                    line: definitions.line
                }
            });
            return references.filter((ref: {
                file: string;
                line?: number;
            }) => is_object(ref) && is_string(ref.file) && ref.file.trim() !== '');
        }
        for (let context in translationsObject) {
            if (!translationsObject.hasOwnProperty(context)) {
                continue;
            }
            const translationObject = translationsObject[context];
            const msgid = translationObject.msgid; // as original
            const msgstr = translationObject.msgstr;
            if (!is_string(msgid) || !Array.isArray(msgstr)) {
                continue;
            }
            const plural = translationObject.msgid_plural;
            let translation = msgstr.shift();
            let gettextTranslation: GettextTranslationInterface;
            try {
                gettextTranslation = translations.createTranslation(
                    context === '' ? undefined : context, // if context is empty, set undefined
                    msgid,
                    is_string(plural) ? plural : undefined,
                    is_string(translation) ? translation : undefined,
                    ...msgstr
                );
                translations.add(gettextTranslation);
                if (translationObject.enable === false) {
                    gettextTranslation.enabled = false;
                }
            } catch (_e) {
                // ignore
                continue;
            }
            parse_comments(translationObject.comments).forEach((comment: string) => {
                gettextTranslation.attributes.comments.add(comment);
            });
            parse_flags(translationObject.flags).forEach((flag: string) => {
                gettextTranslation.attributes.flags.add(flag);
            });
            parse_references(translationObject.reference).forEach((ref: {
                file: string;
                line?: number;
            }) => {
                gettextTranslation.attributes.references.add(ref.file, ref.line);
            });
        }
        // add meta
        parse_flags(object.flags).forEach((flag: string) => {
            translations.attributes.flags.add(flag);
        });
        parse_comments(object.comments).forEach((comment: string) => {
            translations.attributes.comments.add(comment);
        });
        parse_references(object.references).forEach((ref: {
            file: string;
            line?: number;
        }) => {
            translations.attributes.references.add(ref.file, ref.line);
        });
        translations.setEntriesPluralForm(translations.headers.pluralForm);
        return translations;
    }
}
