import GettextGeneratorInterface from '../Interfaces/Generator/GettextGeneratorInterface';
import StreamBuffer from '../../Utils/StreamBuffer';
import TranslationEntries from '../../Translations/TranslationEntries';
import InvalidArgumentException from '../../Exceptions/InvalidArgumentException';
import GettextTranslationAttributesInterface from '../Interfaces/Metadata/GettextTranslationAttributesInterface';
import {is_string} from '../../Utils/Helper';
import {
    DEFAULT_HEADERS,
    HEADER_CONTENT_TYPE_KEY
} from '../Definitions/HeaderDefinitions';
import {
    ATTRIBUTE_MESSAGE_ID,
    ATTRIBUTE_MESSAGE_ID_PLURAL,
    ATTRIBUTE_MESSAGE_STR
} from '../Definitions/AttributeDefinitions';
import {TranslationsType} from '../../Utils/Type';

/**
 * The translation generator for JSON files
 */
export default class JSONGenerator implements GettextGeneratorInterface {
    /**
     * Generate the JSON translation file content
     * @inheritDoc
     * @throws {InvalidArgumentException} if the translations are not an instance of TranslationEntries
     */
    public generate(translations: TranslationsType): StreamBuffer {
        // noinspection SuspiciousTypeOfGuard
        if (!(translations instanceof TranslationEntries)) {
            throw new InvalidArgumentException(
                `The translations must be an instance of ${TranslationEntries.name}, ${typeof translations} given`
            );
        }
        type TranslationJSON = {
            revision: number,
            flags?: Array<string>,
            references?: Array<[string, Array<number>]>,
            comments?: Array<string>,
            headers: {[key: string]: string};
            translations: {[key: string]: any}
        }
        let headerLowerCaseKey : {
            [key: string]: string
        } = {};
        for (let key in DEFAULT_HEADERS) {
            headerLowerCaseKey[key.toLowerCase()] = key;
        }
        const json : TranslationJSON = {
            revision: translations.getRevision(),
            flags: undefined,
            references: undefined,
            comments: undefined,
            headers: headerLowerCaseKey,
            translations: {
                '': {
                    '': {
                        'msgid': '',
                        'msgstr': ''
                    }
                }
            }
        } as TranslationJSON;

        /**
         * Appending the attributes
         */
        const append_to_json = (obj: {
            [key: string]: any
        }, attribute: GettextTranslationAttributesInterface) : void => {
            const flags = attribute.getFlags().flags;
            if (flags.length > 0) {
                obj['flags'] = flags;
            } else {
                delete obj['flags'];
            }
            const references = attribute.getReferences();
            if (references.length > 0) {
                obj['references'] = [];
                references.forEach(([file, lines]) => {
                    if (lines.length === 0) {
                        obj['references'].push(file);
                        return;
                    }
                    lines.forEach((line) => {
                        obj['references'].push(`${file}:${line}`);
                    });
                });
            } else {
                delete obj['references'];
            }
            const comments = attribute.getComments();
            if (comments.length > 0) {
                obj['comments'] = comments.length > 0 ? comments : comments.all[0];
                if (!is_string(obj['comments'])) {
                    delete obj['comments'];
                }
            } else {
                delete obj['comments'];
            }
            const extractedComments = attribute.getExtractedComments();
            if (extractedComments.length > 0) {
                obj['extracted-comments'] = extractedComments.length > 0 ? extractedComments : extractedComments.all[0];
                if (!is_string(obj['extracted-comments'])) {
                    delete obj['extracted-comments'];
                }
            } else {
                delete obj['extracted-comments'];
            }
        }
        // append json attributes
        append_to_json(json, translations.getAttributes());
        const headers = translations.getHeaders().clone();
        if (!headers.has(HEADER_CONTENT_TYPE_KEY)) {
            headers.set(HEADER_CONTENT_TYPE_KEY, DEFAULT_HEADERS[HEADER_CONTENT_TYPE_KEY]);
        }
        headers.forEach((header, key) => {
            switch (key.toLowerCase()) {
                case HEADER_CONTENT_TYPE_KEY.toLowerCase():
                    if (!is_string(header) || header === '') {
                        header = DEFAULT_HEADERS[HEADER_CONTENT_TYPE_KEY];
                    }
                    // get charset
                    let matchCharset = header.match(/charset=\s*([a-zA-Z0-9-]+)\s*/i);
                    header = `text/plain; charset=${matchCharset ? matchCharset[1] : 'UTF-8'}`;
                    break;
                case 'pot-creation-date':
                    key = 'creation-date';
                    break;
                case 'po-revision-date':
                    key = 'revision-date';
                    break;
            }
            // make key lowercase
            key = key.toLowerCase();
            json.headers[key] = header;
        });
        // add translations
        translations.getEntries().forEach(([_key, entry]) => {
            const context = entry.getContext() || '';
            const attributes = entry.getAttributes();
            const original = entry.getOriginal();
            const translation = entry.getTranslation() || '';
            const plural = entry.getPlural();
            const pluralTranslations = Array.from(entry.getPluralTranslations());
            if (!json.translations[context]) {
                json.translations[context] = [];
            }
            let content : {
                [key: string]: any
            } = {
                [ATTRIBUTE_MESSAGE_ID]: original,
            };
            if (context === '' && original === '') {
                // empty translation for the context
                content[ATTRIBUTE_MESSAGE_STR] = '';
            } else {
                if (plural) {
                    content[ATTRIBUTE_MESSAGE_ID_PLURAL] = plural;
                }
                if (pluralTranslations.length > 0) {
                    pluralTranslations.unshift(translation);
                    content[ATTRIBUTE_MESSAGE_STR] = pluralTranslations;
                } else {
                    content[ATTRIBUTE_MESSAGE_STR] = translation;
                }
                if (!entry.isEnabled()) {
                    // disable the translation
                    content['enable'] = false;
                }
            }
            append_to_json(content, attributes);
            if (Array.isArray(content[ATTRIBUTE_MESSAGE_STR])) {
                json.translations[context].push(content);
            } else {
                json.translations[context][original] = content;
            }
        });
        return new StreamBuffer(JSON.stringify(json, null, 4));
    }
}
