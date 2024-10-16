import StreamBuffer from '../../../Utils/StreamBuffer';
import {TranslationsType} from '../../../Utils/Type';

export default interface GettextGeneratorInterface  {

    /**
     * Generate the content from translations
     *
     * @param {TranslationsType} translations the translations
     *
     * @return {StreamBuffer} the generated content
     * @throws {InvalidArgumentException} if the translations are not an instance of TranslationEntries
     */
    generate(translations: TranslationsType): StreamBuffer;
}
