import TranslationEntriesInterface from '../../../Translations/Interfaces/TranslationEntriesInterface';
import StreamBuffer from '../../../Utils/StreamBuffer';

export default interface GettextGeneratorInterface {

    /**
     * Generate the content from translations
     *
     * @param {TranslationEntriesInterface} translations the translations
     *
     * @return {StreamBuffer} the generated content
     */
    generate(translations: TranslationEntriesInterface): StreamBuffer;
}
