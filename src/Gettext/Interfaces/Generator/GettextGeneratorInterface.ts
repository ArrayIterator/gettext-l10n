import StreamBuffer from '../../../Utils/StreamBuffer';
import TranslationEntryInterface from '../../../Translations/Interfaces/TranslationEntryInterface';

export default interface GettextGeneratorInterface<Translations extends TranslationEntryInterface>  {

    /**
     * Generate the content from translations
     *
     * @param {TranslationEntriesInterface} translations the translations
     *
     * @return {StreamBuffer} the generated content
     * @throws {InvalidArgumentException} if the translations are not an instance of TranslationEntries
     */
    generate(translations: Translations): StreamBuffer;
}
