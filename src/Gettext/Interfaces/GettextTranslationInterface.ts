import GettextPluralFormInterface from './Metadata/GettextPluralFormInterface';
import GettextTranslationAttributesInterface from './Metadata/GettextTranslationAttributesInterface';
import TranslationEntryInterface from '../../Translations/Interfaces/TranslationEntryInterface';

export default interface GettextTranslationInterface extends TranslationEntryInterface {

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
