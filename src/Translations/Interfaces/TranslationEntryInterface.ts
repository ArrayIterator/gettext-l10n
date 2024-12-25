import GettextPluralFormInterface from '../../Gettext/Interfaces/Metadata/GettextPluralFormInterface';
import CloneableInterface from '../../Interfaces/CloneableInterface';
import GettextTranslationAttributesInterface from '../../Gettext/Interfaces/Metadata/GettextTranslationAttributesInterface';

/**
 * Interface representing a translation entry.
 */
export default interface TranslationEntryInterface extends CloneableInterface {

    /**
     * Gettext attributes
     *
     * @return {GettextTranslationAttributesInterface} Gettext attributes
     */
    getAttributes(): GettextTranslationAttributesInterface;

    /**
     * Get Attributes
     *
     * @return {GettextTranslationAttributesInterface} the attributes
     */
    get attributes(): GettextTranslationAttributesInterface;

    /**
     * Get translation enabled
     *
     * @return {boolean} the translation enabled
     */
    isEnabled(): boolean;

    /**
     * Get translation enabled
     *
     * @return {boolean} the translation enabled
     */
    get enabled(): boolean;

    /**
     * Set translation enabled
     *
     * @param {boolean} enabled the translation enabled
     */
    setEnabled(enabled: boolean): void;

    /**
     * Set translation enabled, this mean is commented translation
     *
     * @param {boolean} enabled the translation enabled
     */
    set enabled(enabled: boolean);

    /**
     * Gets the context of the translation entry.
     * @return {string | undefined} The context of the translation entry.
     */
    getContext(): string | undefined;

    /**
     * Gets the context of the translation entry
     *
     * @return {string | undefined} The context of the translation entry.
     */
    get context(): string | undefined;

    /**
     * Gets the original string of the translation entry.
     * @return {string} The original string.
     */
    getOriginal(): string;

    /**
     * Gets the original string of the translation entry.
     * @return {string} The original string.
     */
    get original(): string;

    /**
     * Get singular translation
     *
     * @return {string} returning undefined if entry does not have translation
     */
    getTranslation(): string | undefined;

    /**
     * Get singular translation
     *
     * @return {string} returning undefined if entry does not have translation
     */
    get translation(): string | undefined;

    /**
     * Set singular translation
     *
     * @param {?string} translation the the translation, undefined - don't want to be translated / empty
     */
    setTranslation(translation: string | undefined) : void;

    /**
     * Set singular translation
     *
     * @param {?string} translation the the translation, undefined - don't want to be translated / empty
     */
    set translation(translation: string | undefined);

    /**
     * Gets the plural form of the original string, if any.
     *
     * @return {string | undefined} The plural form of the original string.
     */
    getPlural(): string | undefined;

    /**
     * Get plural translation
     *
     * @return {string|undefined} the plural, returning undefined if the object does not have translation
     */
    get plural(): string | undefined;

    /**
     * Set plural translation
     *
     * @param {string|undefined} plural
     */
    setPlural(plural: string | undefined) : void;

    /**
     * Set plural translation
     *
     * @param {string|undefined} plural
     */
    set plural(plural: string | undefined);

    /**
     * Set plural translations
     *
     * @param {Array<string>} pluralTranslations the plural translations
     */
    setPluralTranslations(pluralTranslations: Array<string>) : void;

    /**
     * Set plural translations
     *
     * @param {Array<string>} pluralTranslations the plural translations
     */
    set pluralTranslations(pluralTranslations: Array<string>);

    /**
     * Get plural the translations for the entry.
     *
     * @return {Array<string>} An array containing the translations.
     */
    getPluralTranslations(): Array<string>;

    /**
     * Get plural the translations for the entry.
     *
     * @return {Array<string>} An array containing the translations.
     */
    get pluralTranslations(): Array<string>;

    /**
     * Gets the translation at the specified index.
     *
     * @param {number} n - The index of the translation.
     *
     * @return {string | null} The translation at the specified index.
     */
    getPluralTranslationIndex(n: number): string | undefined;

    /**
     * Gets or sets the translation at the specified index.
     */
    get translationIndex(): (n: number) => string | undefined;

    /**
     * Get translation id, use context + \x04 + original
     *
     * @return {string} the translation identifier
     */
    getId(): string;

    /**
     * Get translation id, use context + \x04 + original
     *
     * @return {string} the translation identifier
     */
    get id(): string;

    /**
     * Gets the plural form metadata.
     *
     * @return {GettextPluralFormInterface} The plural form metadata.
     */
    getPluralForm(): GettextPluralFormInterface;

    /**
     * Gets or sets the plural form metadata.
     */
    get pluralForm(): GettextPluralFormInterface;

    /**
     * Sets the plural form metadata.
     *
     * @param {GettextPluralFormInterface | undefined} pluralForm - The plural form metadata.
     */
    setPluralForm(pluralForm: GettextPluralFormInterface): void;

    /**
     * Sets the plural form metadata.
     *
     * @param {GettextPluralFormInterface | undefined} pluralForm - The plural form metadata.
     */
    set pluralForm(pluralForm: GettextPluralFormInterface);

    /**
     * Create new translation with plural form
     *
     * @param {GettextPluralFormInterface} pluralForm - the plural form
     *
     * @return {this} new translation (cloned) with plural form
     */
    withPluralForm(pluralForm: GettextPluralFormInterface): this;

    /**
     * Create new translation with original
     *
     * @return {this} new translation (cloned) with original
     */
    clone(): this;
}
