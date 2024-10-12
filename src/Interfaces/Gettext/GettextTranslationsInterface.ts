import GettextHeadersInterface from "./Metadata/GettextHeadersInterface";
import GettextFlagsInterface from "./Metadata/Attributes/GettextFlagsInterface";
import GettextTranslationInterface from "./GettextTranslationInterface";
import LengthInterface from "../LengthInterface";
import GettextTranslationFactoryInterface from "./Factory/GettextTranslationFactoryInterface";
import CloneableInterface from "../CloneableInterface";
import GettextPluralFormInterface from "./Metadata/GettextPluralFormInterface";

export default interface GettextTranslationsInterface extends CloneableInterface, LengthInterface {

    /**
     * The revision
     *
     * @return {number} Revision
     */
    get revision(): number;

    /**
     * Set the revision
     *
     * @param {number} revision Revision
     */
    set revision(revision: number);

    /**
     * Get the translation factory
     *
     * @return {GettextTranslationFactoryInterface} Translation factory
     */
    get translationFactory(): GettextTranslationFactoryInterface;

    /**
     * Set the translation factory
     *
     * @param {GettextTranslationFactoryInterface} factory Translation factory
     */
    set translationFactory(factory: GettextTranslationFactoryInterface);

    /**
     * Get the translation headers
     *
     * @returns {GettextHeadersInterface} Headers
     */
    get headers(): GettextHeadersInterface;

    /**
     * Get the translation flags
     *
     * @return {GettextFlagsInterface} Flags
     */
    get flags(): GettextFlagsInterface;

    /**
     * Get the translation language
     *
     * @return {string} Language code
     */
    get language(): string;

    /**
     * Set the translation language
     *
     * @param {string} language Language code
     */
    set language(language: string);

    /**
     * Get the translation translations
     *
     * @return {Record<string, GettextTranslationInterface} Translations
     */
    get translations(): Record<string, GettextTranslationInterface>;

    /**
     * Get translation count
     *
     * @return {number} Translation count
     */
    get length(): number;

    /**
     * Create a new translation
     *
     * @param {string} context
     * @param {string} original
     * @param {string|undefined} plural
     * @param {string|undefined} translation
     * @param {string[]} pluralTranslations
     */
    createTranslation(
        context: string,
        original: string,
        plural?: string,
        translation?: string,
        ...pluralTranslations: string[]
    ): GettextTranslationInterface;

    /**
     * Merge translations
     *
     * @param {GettextTranslationInterface<string, TFile, NonNegativeInteger[]} translations Translations
     */
    merge(...translations: GettextTranslationInterface[]): void;

    /**
     * Add a translation
     *
     * @param {GettextTranslationInterface} translation Translation
     */
    add(translation: GettextTranslationInterface): void;

    /**
     * Find a translation
     *
     * @param {string} id Translation identifier
     *
     * @return {GettextTranslationInterface|undefined} Translation
     */
    get(id: string | GettextTranslationInterface): GettextTranslationInterface | undefined;

    /**
     * Check if a translation exists
     *
     * @param {string} id Translation identifier
     */
    has(id: string | GettextTranslationInterface): boolean;

    /**
     * Remove a translation
     *
     * @param {string} id Translation identifier
     */
    remove(id: string | GettextTranslationInterface): void;

    /**
     * Set translations plural form - update all translations
     *
     * @param {GettextPluralFormInterface} pluralForm Plural form
     */
    setTranslationsPluralForm(pluralForm: GettextPluralFormInterface): void;

    /**
     * Create deep clone of translations
     *
     * @return {GettextTranslationsInterface} Cloned translations
     */
    clone(): GettextTranslationsInterface;
}
