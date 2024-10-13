import GettextPluralFormInterface from './Metadata/GettextPluralFormInterface';
import TranslationEntryInterface from '../../Translations/Interfaces/TranslationEntryInterface';

export default interface GettextTranslationInterface extends TranslationEntryInterface {

    /**
     * Create new translation with context
     *
     * @param {string|undefined} context - the context
     * @param {?string} original - the original form
     * @param {?string} plural - the plural form
     * @param {?GettextPluralFormInterface} pluralForm - the plural form
     *
     * @return {GettextTranslationInterface} new translation (cloned) with context
     */
    with(context: string|undefined, original?: string, plural?: string, pluralForm?: GettextPluralFormInterface): GettextTranslationInterface;

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
     * @param {string|undefined} context - the context
     *
     * @return {GettextTranslationInterface} new translation (cloned) with context
     */
    withContext(context: string|undefined): GettextTranslationInterface;

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
