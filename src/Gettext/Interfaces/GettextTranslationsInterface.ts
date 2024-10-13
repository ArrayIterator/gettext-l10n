import GettextTranslationInterface from './GettextTranslationInterface';
import GettextTranslationFactoryInterface from './Factory/GettextTranslationFactoryInterface';
import TranslationEntriesInterface from '../../Translations/Interfaces/TranslationEntriesInterface';

export default interface GettextTranslationsInterface extends TranslationEntriesInterface {
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
     * @inheritDoc
     */
    getEntries(): [string, GettextTranslationInterface][];

    /**
     * @inheritDoc
     */
    get entries(): [string, GettextTranslationInterface][];

    /**
     * Create a new translation
     *
     * @param {string|undefined} context Context the undefined means no context
     * @param {string} original
     * @param {string|undefined} plural
     * @param {string|undefined} translation
     * @param {string[]} pluralTranslations
     */
    createTranslation(
        context: string|undefined,
        original: string,
        plural?: string,
        translation?: string,
        ...pluralTranslations: string[]
    ): GettextTranslationInterface;

    /**
     * Merge translations
     *
     * @param {GettextTranslationInterface<string, TFile, NonNegativeInteger[]} translations Translations
     * @return {number} total translations added
     */
    merge(...translations: GettextTranslationInterface[]): number;

    /**
     * Add a translation
     *
     * @param {GettextTranslationInterface} translation Translation
     */
    add(translation: GettextTranslationInterface): boolean;

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
     * @return {boolean} true if success
     */
    remove(id: string | GettextTranslationInterface): boolean;

    /**
     * Create deep clone of translations
     *
     * @return {GettextTranslationsInterface} Cloned translations
     */
    clone(): GettextTranslationsInterface;
}
