import GettextPluralFormInterface from 'src/Gettext/Interfaces/Metadata/GettextPluralFormInterface';
import GettextTranslationFactoryInterface from '../Interfaces/Factory/GettextTranslationFactoryInterface';
import GettextTranslation from '../GettextTranslation';
import {GettextTranslationType} from '../../Utils/Type';

/**
 * Factory to create GettextTranslation
 */
export default class GettextTranslationFactory implements GettextTranslationFactoryInterface {
    /**
     * @inheritDoc
     */
    public createTranslation(
        context: string|undefined,
        original: string,
        plural?: string,
        translation?: string,
        pluralForm?: GettextPluralFormInterface,
        ...pluralTranslations: string[]
    ): GettextTranslationType {
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
