import GettextTranslationsInterface from '../GettextTranslationsInterface';
import GettextTranslationInterface from '../GettextTranslationInterface';

export default interface GettextReaderInterface<
    Translation extends GettextTranslationInterface,
    Translations extends GettextTranslationsInterface<Translation, Translations>
> {

    /**
     * Read the content and return the translations
     *
     * @param {string|ArrayBufferLike} content the content to read
     *
     * @return {GettextTranslationsInterface} the translations
     */
    read(content: string | ArrayBufferLike): Translations;
}
