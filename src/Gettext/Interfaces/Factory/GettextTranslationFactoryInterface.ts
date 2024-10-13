import GettextTranslationInterface from '../GettextTranslationInterface';
import GettextPluralFormInterface from '../Metadata/GettextPluralFormInterface';

export default interface GettextTranslationFactoryInterface {

    /**
     * Create a new translation
     * @param {string|undefined} context
     * @param {string} original
     * @param {string|undefined} plural
     * @param {string|undefined} translation
     * @param {GettextPluralFormInterface|undefined} pluralForm
     * @param {string[]} pluralTranslations
     */
    createTranslation(
        context: string|undefined,
        original: string,
        plural?: string,
        translation?: string,
        pluralForm?: GettextPluralFormInterface,
        ...pluralTranslations: string[]
    ): GettextTranslationInterface;
}
