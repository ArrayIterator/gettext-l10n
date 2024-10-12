import GettextTranslationsInterface from "../GettextTranslationsInterface";

export default interface GettextGeneratorInterface {

    /**
     * Generate the content from translations
     *
     * @param {GettextTranslationsInterface} translations the translations
     */
    generate(translations: GettextTranslationsInterface): string;
}
