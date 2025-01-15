import GettextReaderInterface from '../Interfaces/Reader/GettextReaderInterface';
import {
    is_numeric_integer,
    is_object,
    is_string,
    normalize_number
} from '../../Utils/Helper';
import InvalidArgumentException from '../../Exceptions/InvalidArgumentException';
import GettextTranslations from '../GettextTranslations';
import GettextTranslationInterface from '../Interfaces/GettextTranslationInterface';
import StreamBuffer from '../../Utils/StreamBuffer';
import {
    define_comments,
    define_flags,
    define_references
} from '../Utils/ReaderUtil';
import RuntimeException from '../../Exceptions/RuntimeException';
import {
    GettextTranslationsType,
    GettextTranslationType
} from '../../Utils/Type';

/**
 * Json Reader (example) :
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
 *         "creation-date": "2023-10-01 12:00+0000",
 *         "revision-date": "2023-10-01 12:00+0000",
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
export default class JSONReader implements GettextReaderInterface {
    /**
     * @inheritDoc
     */
    public read(content: string | ArrayBufferLike): GettextTranslationsType {
        content = new StreamBuffer(content).toString();
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
        const translations = new GettextTranslations<GettextTranslationType, GettextTranslationsType>(revision);
        const headers: {
            [key: string]: string;
        } = object.headers;
        if (is_object(headers)) {
            for (let key in headers) {
                if (!headers.hasOwnProperty(key)) {
                    continue;
                }
                // normalize key
                switch (key) {
                    case 'creation-date':
                        key = 'pot-creation-date';
                        break;
                    case 'revision-date':
                        key = 'po-revision-date';
                        break;
                }
                const value = headers[key];
                key = key.trim();
                if (!key.match(/^[a-zA-Z0-9_-]+$/)) {
                    continue;
                }
                translations.headers.set(key, value);
            }
        }
        type TranslationObject = {
            msgid: string;
            msgid_plural?: string;
            msgstr: string[];
            reference?: Array<string>;
            'extracted-comments'?: Array<string>;
            comments?: Array<string> | string;
            flags?: Array<string>;
            enable?: boolean;
        };
        type MetaTranslationObject = {
            '': {
                msgid: '';
                msgstr: string[];
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
            const translationObject = meta[''];
            const msgid = translationObject.msgid;
            const msgstr = translationObject.msgstr;
            // the msgid is empty and msgstr is an array of strings
            if (msgid === '' && Array.isArray(msgstr)) {
                if (!msgstr.every(is_string)) {
                    throw new RuntimeException(
                        `The meta header of context translation must be an array of strings, ${typeof msgstr} given`
                    );
                }
                for (let header of msgstr) {
                    header = header.trim();
                    if (header === '') {
                        continue;
                    }
                    // should start with a letter and can contain letters, numbers, and hyphens
                    // and end with a letter or number
                    let match = header.match(/^([a-zA-Z0-9_-]+)\s*:(.+)$/i);
                    if (!match) {
                        continue;
                    }
                    let key = match[1].trim();
                    let value = match[2].trim();
                    if (key === '' || value === '') {
                        continue;
                    }
                    translations.headers.set(key, value);
                }
            }
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
            } catch (e) {
                throw new RuntimeException(
                    `The translation is not valid, ${(e as Error).message}`
                );
            }
            define_comments(translationObject.comments).forEach((comment: string) => {
                gettextTranslation.attributes.comments.add(comment);
            });
            define_flags(translationObject.flags).forEach((flag: string) => {
                gettextTranslation.attributes.flags.add(flag);
            });
            define_comments(translationObject['extracted-comments']).forEach((comment: string) => {
                gettextTranslation.attributes.extractedComments.add(comment);
            });
            define_references(translationObject.reference).forEach((ref: {
                file: string;
                line?: number;
            }) => {
                gettextTranslation.attributes.references.add(ref.file, ref.line);
            });
        }
        // add meta
        define_flags(object.flags).forEach((flag: string) => {
            translations.attributes.flags.add(flag);
        });
        define_comments(object.comments).forEach((comment: string) => {
            translations.attributes.comments.add(comment);
        });
        define_references(object.references).forEach((ref: {
            file: string;
            line?: number;
        }) => {
            translations.attributes.references.add(ref.file, ref.line);
        });
        translations.setEntriesPluralForm(translations.headers.pluralForm);
        return translations;
    }
}
