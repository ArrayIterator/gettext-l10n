import GettextPluralFormInterface from "src/Interfaces/Gettext/Metadata/GettextPluralFormInterface";
import GettextTranslationInterface from "src/Interfaces/Gettext/GettextTranslationInterface";
import GettextTranslationFactoryInterface from "../../Interfaces/Gettext/Factory/GettextTranslationFactoryInterface";
import GettextTranslation from "../GettextTranslation";

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
