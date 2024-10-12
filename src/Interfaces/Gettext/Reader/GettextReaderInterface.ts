import GettextTranslationsInterface from "../GettextTranslationsInterface";


export default interface GettextReaderInterface {

    /**
     * Read the content and return the translations
     *
     * @param {string|ArrayBufferLike} content the content to read
     */
    read(content: string | ArrayBufferLike): GettextTranslationsInterface;
}
