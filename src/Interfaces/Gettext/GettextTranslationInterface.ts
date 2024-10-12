import {PositiveInteger} from "../../Utils/Type";
import GettextPluralFormInterface from "./Metadata/GettextPluralFormInterface";
import GettextTranslationAttributesInterface from "./Metadata/GettextTranslationAttributesInterface";
import CloneableInterface from "../CloneableInterface";

export default interface GettextTranslationInterface extends CloneableInterface {

    /**
     * Get translation id, use context + \x04 + original
     *
     * @return {string} the translation identifier
     */
    get id(): string;

    /**
     * Get plural form
     *
     * @return {GettextPluralFormInterface} the plural form
     */
    get pluralForm(): GettextPluralFormInterface | undefined;

    /**
     * Set the plural form for translation
     *
     * @param {GettextPluralFormInterface} pluralForm the plural form for translation
     */
    set pluralForm(pluralForm: GettextPluralFormInterface | undefined);

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
    get enabled(): boolean;

    /**
     * Set translation enabled
     *
     * @param {boolean} enabled the translation enabled
     */
    set enabled(enabled: boolean);

    /**
     * The translation context
     *
     * @return {string} the context translation
     */
    get context(): string;

    /**
     * Get original translation
     *
     * @return {string} the original translation
     */
    get original(): string;

    /**
     * Get plural translation
     *
     * @return {string} the plural, returning undefined if the object does not have translation
     */
    get plural(): string | undefined;

    /**
     * Set plural translation
     *
     * @param {string|undefined} plural
     */
    set plural(plural: string | undefined);

    /**
     * Get singular translation
     *
     * @return {string} returning undefined if does not have translation
     */
    get translation(): string | undefined;

    /**
     * Set singular translation
     *
     * @param {?string} translation the the translation, undefined - don't want to be translated / empty
     */
    set translation(translation: string | undefined);

    /**
     * Get plural translation lists
     *
     * @return {Array<string>} the list of plural translations
     */
    get pluralTranslations(): Array<string>;

    /**
     * Set plural translations
     *
     * @param {Array<string>} pluralTranslations the plural translations
     */
    set pluralTranslations(pluralTranslations: Array<string>);

    /**
     * Get plural from index
     *
     * @param {PositiveInteger} index
     *
     * @return {string} string plural translation by index, otherwise undefined
     */
    getPluralTranslation(index: PositiveInteger): string | undefined;

    /**
     * Get plural translations by size
     *
     * @param {PositiveInteger} pluralSize the plural size (0 based)
     *
     * @return {Array<string>} list of plural translations
     */
    getPluralTranslations(pluralSize: PositiveInteger): Array<string>;

    /**
     * Create new translation with context
     *
     * @param {string} context - the context
     * @param {?string} original - the original form
     * @param {?string} plural - the plural form
     * @param {?GettextPluralFormInterface} pluralForm - the plural form
     *
     * @return {GettextTranslationInterface} new translation (cloned) with context
     */
    with(context: string, original?: string, plural?: string, pluralForm?: GettextPluralFormInterface): GettextTranslationInterface;

    /**
     * Create new translation with plural form
     *
     * @param {GettextPluralFormInterface} pluralForm - the plural form
     *
     * @return {GettextTranslationInterface} new translation (cloned) with plural form
     */
    withPluralForm(pluralForm: GettextPluralFormInterface): GettextTranslationInterface;

    /**
     * Create new translation with context
     *
     * @param {string} context - the context
     *
     * @return {GettextTranslationInterface} new translation (cloned) with context
     */
    withContext(context: string): GettextTranslationInterface;

    /**
     * Create new translation with original and plural
     *
     * @param {string} original - the original translation
     * @param {string|undefined} plural - the plural translation
     */
    withOriginal(original: string, plural?: string | undefined): GettextTranslationInterface;

    /**
     * Create new translation with original
     *
     * @return {GettextTranslationInterface} new translation (cloned) with original
     */
    clone(): GettextTranslationInterface;
}
