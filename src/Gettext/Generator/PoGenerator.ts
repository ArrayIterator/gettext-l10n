import GettextGeneratorInterface from '../Interfaces/Generator/GettextGeneratorInterface';
import InvalidArgumentException from '../../Exceptions/InvalidArgumentException';
import {
    ATTRIBUTE_COMMENT,
    ATTRIBUTE_COMMENTED_TRANSLATIONS,
    ATTRIBUTE_EXTRACTED_COMMENT,
    ATTRIBUTE_FLAGS,
    ATTRIBUTE_MESSAGE_CONTEXT,
    ATTRIBUTE_MESSAGE_ID,
    ATTRIBUTE_MESSAGE_ID_PLURAL,
    ATTRIBUTE_MESSAGE_STR,
    ATTRIBUTE_REFERENCES
} from '../Definitions/AttributeDefinitions';
import TranslationEntriesInterface from '../../Translations/Interfaces/TranslationEntriesInterface';
import TranslationEntries from '../../Translations/TranslationEntries';
import GettextTranslationAttributesInterface from '../Interfaces/Metadata/GettextTranslationAttributesInterface';
import PoReader from '../Reader/PoReader';
import {is_string} from '../../Utils/Helper';
import StreamBuffer from '../../Utils/StreamBuffer';

/**
 * The translation generator for PO files
 */
export default class PoGenerator implements GettextGeneratorInterface {
    /**
     * Generate the PO file content
     *
     * @param {TranslationEntriesInterface} translations the translations
     * @return {StreamBuffer} the generated content
     */
    public generate(translations: TranslationEntriesInterface): StreamBuffer {
        if (!(translations instanceof TranslationEntries)) {
            throw new InvalidArgumentException(
                `The translations must be an instance of ${TranslationEntries.name}, ${typeof translations} given`
            );
        }

        /**
         * The contents of the PO file
         */
        const contents : string[] = [];

        /**
         * Appending the attributes
         * @param attributes
         */
        const append_attributes= (attributes: GettextTranslationAttributesInterface) : void => {

            // add the comments attribute
            attributes.getComments().forEach((comment) => {
                contents.push(`${ATTRIBUTE_COMMENT} ${comment}`);
            });

            // add extracted comments
            attributes.getExtractedComments().forEach((comment) => {
                contents.push(`${ATTRIBUTE_EXTRACTED_COMMENT} ${comment}`);
            });

            // add flags
            const flags = attributes.getFlags().flags;
            if (flags.length > 0) {
                contents.push(`${ATTRIBUTE_FLAGS} ${flags.join(',')}`);
            }

            // add the references
            attributes.references.forEach(([file, lines]) => {
                if (lines.length === 0) {
                    contents.push(`${ATTRIBUTE_REFERENCES} ${file}`);
                    return;
                }
                lines.forEach((line) => {
                    contents.push(`${ATTRIBUTE_REFERENCES} ${file}:${line}`);
                });
            });
        }

        // append attributes
        append_attributes(translations.getAttributes());

        // add headers
        translations.getHeaders().forEach((header, key) => {
            contents.push(`${key}: ${header}\\n`); // add \\n to escape new line
        });

        // add new line after headers
        contents.push('');

        // add the translations
        translations.getEntries().forEach(([_key, entry]) => {
            // append attributes
            append_attributes(entry.getAttributes());

            const prefix = entry.enabled ? '' : `${ATTRIBUTE_COMMENTED_TRANSLATIONS} `;
            const context = entry.getContext();
            if (is_string(context)) {
                contents.push(`${prefix}${ATTRIBUTE_MESSAGE_CONTEXT} "${PoReader.escapeValue(context)}"`);
            }

            // add comment if exists
            contents.push(`${prefix}${ATTRIBUTE_MESSAGE_ID} "${PoReader.escapeValue(entry.original)}"`);
            const plural = entry.getPlural();
            if (is_string(plural)) {
                contents.push(`${prefix}${ATTRIBUTE_MESSAGE_ID_PLURAL} "${PoReader.escapeValue(plural)}"`);
            }
            const translation = entry.getTranslation();
            const translations = entry.getPluralTranslations();
            if (translations.length > 0) {
                contents.push(`${prefix}${ATTRIBUTE_MESSAGE_STR}[0] "${PoReader.escapeValue(translation === undefined ? '' : translation)}"`);
                translations.forEach((translation, index) => {
                    contents.push(`${prefix}${ATTRIBUTE_MESSAGE_STR}[${index + 1}] "${PoReader.escapeValue(translation)}"`);
                });
            } else {
                contents.push(`${prefix}${ATTRIBUTE_MESSAGE_STR} "${PoReader.escapeValue(translation === undefined ? '' : translation)}"`);
            }

            // add new line after each entry
            contents.push('');
        });

        return new StreamBuffer(contents.join('\n'));
    }
}
