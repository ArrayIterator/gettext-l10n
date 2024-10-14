import TranslationEntriesInterface from '../../../Translations/Interfaces/TranslationEntriesInterface';
import StreamBuffer from '../../../Utils/StreamBuffer';

export default interface GettextGeneratorInterface {

    /**
     * Generate the content from translations
     *
     * @param {TranslationEntriesInterface} translations the translations
     *
     * @return {StreamBuffer} the generated content
     * @throws {InvalidArgumentException} if the translations are not an instance of TranslationEntries
     */
    generate(translations: TranslationEntriesInterface): StreamBuffer;
}
