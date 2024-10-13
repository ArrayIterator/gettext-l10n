import GettextPluralFormInterface from 'src/Gettext/Interfaces/Metadata/GettextPluralFormInterface';
import GettextTranslationInterface from 'src/Gettext/Interfaces/GettextTranslationInterface';
import GettextTranslationFactoryInterface from '../Interfaces/Factory/GettextTranslationFactoryInterface';
import GettextTranslation from '../GettextTranslation';

/**
 * Factory to create GettextTranslation
 */
export default class GettextTranslationFactory implements GettextTranslationFactoryInterface {
    /**
     * @inheritDoc
     */
    public createTranslation(
        context: string,
        original: string,
        plural?: string,
        translation?: string,
        pluralForm?: GettextPluralFormInterface,
        ...pluralTranslations: string[]
    ): GettextTranslationInterface {
        return new GettextTranslation(
            context,
            original,
            plural,
            translation,
            pluralForm,
            ...pluralTranslations
        )
    }
}
