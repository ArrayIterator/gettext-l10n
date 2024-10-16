import GettextPluralFormInterface from 'src/Gettext/Interfaces/Metadata/GettextPluralFormInterface';
import GettextTranslationInterface from './Interfaces/GettextTranslationInterface';
import { is_undefined } from '../Utils/Helper';
import TranslationEntry from '../Translations/TranslationEntry';

/**
 * Translation storage class to handle translation for gettext
 */
export default class GettextTranslation extends TranslationEntry implements GettextTranslationInterface {

    /**
     * @inheritDoc
     */
    public with(context: string|undefined, original?: string, plural?: string, pluralForm?: GettextPluralFormInterface): this {
        return new (this.constructor as any)(
            context,
            is_undefined(original) ? this.original : original,
            plural === null ? this.plural : plural,
            this.translation,
            is_undefined(pluralForm) ? this.pluralForm : pluralForm,
            ...this.pluralTranslations
        );
    }

    /**
     * @inheritDoc
     */
    public withPluralForm(pluralForm: GettextPluralFormInterface): this {
        return this.with(this.context, this.original, this.plural, pluralForm);
    }

    /**
     * @inheritDoc
     */
    public withContext(context: string|undefined): this {
        return this.with(context, this.original, this.plural, this.pluralForm);
    }

    /**
     * @inheritDoc
     */
    public withOriginal(original: string, plural: string | undefined | null = null): this {
        return this.with(this.context, original, plural === null ? this.plural : plural, this.pluralForm);
    }

    /**
     * @inheritDoc
     */
    public clone(): this {
        return this.with(this.context, this.original, this.plural, this.pluralForm?.clone());
    }
}
