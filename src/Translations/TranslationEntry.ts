import TranslationEntryInterface from './Interfaces/TranslationEntryInterface';
import GettextPluralFormInterface from '../Gettext/Interfaces/Metadata/GettextPluralFormInterface';
import GettextTranslationAttributesInterface from '../Gettext/Interfaces/Metadata/GettextTranslationAttributesInterface';
import {
    generateTranslationId,
    is_string,
    is_undefined
} from '../Utils/Helper';
import InvalidArgumentException from '../Exceptions/InvalidArgumentException';
import TranslationAttributes from '../Gettext/Metadata/TranslationAttributes';
import PluralForm, {DefaultPluralForm} from '../Gettext/Metadata/PluralForm';

/**
 * The TranslationEntry class
 */
export default class TranslationEntry implements TranslationEntryInterface {

    /**
     * Determines whether the translation is enabled
     * The disabled translation is a comment, default is true or as translation enabled
     *
     * @private
     */
    #enabled: boolean = true;

    /**
     * @inheritDoc
     */
    public readonly id: string;

    /**
     * Plural form
     *
     * @private
     */
    #pluralForm: GettextPluralFormInterface = DefaultPluralForm;

    /**
     * Translation Attributes
     *
     * @private
     */
    readonly #attributes: GettextTranslationAttributesInterface;

    /**
     * Translation context
     *
     * @private
     */
    readonly #context: string|undefined;

    /**
     * Original translation
     *
     * @private
     */
    readonly #original: string;

    /**
     * Plural translation
     *
     * @private
     */
    #plural?: string;

    /**
     * Singular translation
     *
     * @private
     */
    #translation?: string;

    /**
     * Plural translations
     *
     * @private
     */
    #pluralTranslations: string[] = [];

    /**
     * Translation constructor
     *
     * @param {string} context
     * @param {string} original
     * @param {?string} plural
     * @param {?string} translation
     * @param {?GettextPluralFormInterface} pluralForm
     * @param {string[]} pluralTranslations
     */
    public constructor(
        context: string|undefined,
        original: string,
        plural?: string,
        translation?: string,
        pluralForm: GettextPluralFormInterface = DefaultPluralForm,
        ...pluralTranslations: string[]
    ) {
        // the context must be a string
        if (!is_string(context)) {
            throw new InvalidArgumentException(
                `The context must be a string, ${typeof context} given`
            );
        }
        // the original must be a string
        if (!is_string(original)) {
            throw new InvalidArgumentException(
                `The original must be a string, ${typeof original} given`
            );
        }
        // the plural translations must be string at all
        for (let translation of pluralTranslations) {
            if (!is_string(translation)) {
                throw new InvalidArgumentException(
                    `The translation must be a string, ${typeof translation} given in offset ${pluralTranslations.indexOf(translation)}`
                );
            }
        }
        this.#context = context;
        this.#original = original;
        this.id = generateTranslationId(original, context);
        this.#attributes = new TranslationAttributes();
        this.setPlural(plural);
        this.setTranslation(translation);
        this.setPluralForm(pluralForm);
    }

    /**
     * @inheritDoc
     */
    public isEnabled(): boolean {
        return this.#enabled;
    }

    /**
     * @inheritDoc
     */
    public get enabled(): boolean {
        return this.isEnabled();
    }

    /**
     * @inheritDoc
     */
    public setEnabled(enabled: boolean) : void {
        this.#enabled = enabled;
    }

    /**
     * @inheritDoc
     */
    public set enabled(enabled: boolean) {
        this.setEnabled(enabled);
    }

    /**
     * @inheritDoc
     */
    public getId(): string {
        return this.id;
    }

    /**
     * @inheritDoc
     */
    public getAttributes(): GettextTranslationAttributesInterface {
        return this.#attributes;
    }

    /**
     * @inheritDoc
     */
    public get attributes(): GettextTranslationAttributesInterface {
        return this.#attributes;
    }

    /**
     * @inheritDoc
     */
    public getContext(): string | undefined {
        return this.#context;
    }

    /**
     * @inheritDoc
     */
    public get context(): string | undefined {
        return this.#context;
    }

    /**
     * @inheritDoc
     */
    public getOriginal(): string {
        return this.#original;
    }

    /**
     * @inheritDoc
     */
    public get original(): string {
        return this.#original;
    }

    /**
     * @inheritDoc
     */
    public getPlural(): string | undefined {
        return this.#plural;
    }

    /**
     * @inheritDoc
     */
    public get plural(): string | undefined {
        return this.#plural;
    }

    /**
     * @inheritDoc
     */
    public setPlural(plural: string | undefined) : void {
        // convert null to undefined
        plural = typeof plural === null ? undefined : plural;
        if (is_undefined(plural) || is_string(plural)) {
            this.#plural = plural;
        }
    }

    /**
     * @inheritDoc
     */
    public set plural(plural: string | undefined) {
        this.setPlural(plural);
    }

    /**
     * @inheritDoc
     */
    public getTranslation(): string | undefined {
        return this.#translation;
    }

    /**
     * @inheritDoc
     */
    public get translation(): string | undefined {
        return this.getTranslation();
    }

    /**
     * @inheritDoc
     */
    public setTranslation(translation: string | undefined) : void {
        if (is_undefined(translation) || is_string(translation)) {
            this.#translation = translation;
        }
    }

    /**
     * @inheritDoc
     */
    public set translation(translation: string | undefined) {
        this.setTranslation(translation);
    }

    /**
     * @inheritDoc
     */
    public getPluralTranslations(): Array<string> {
        return [...this.#pluralTranslations];
    }

    /**
     * @inheritDoc
     */
    public get pluralTranslations(): Array<string> {
        return this.getPluralTranslations();
    }

    /**
     * @inheritDoc
     */
    public setPluralTranslations(pluralTranslations: string[]) : void {
        if (Array.isArray(pluralTranslations)) {
            this.#pluralTranslations = Array.from(pluralTranslations);
        }
    }

    /**
     * @inheritDoc
     */
    public set pluralTranslations(pluralTranslations: string[]) {
        this.setPluralTranslations(pluralTranslations);
    }

    /**
     * @inheritDoc
     */
    public getPluralForm(): GettextPluralFormInterface {
        return this.#pluralForm;
    }

    /**
     * @inheritDoc
     */
    public get pluralForm(): GettextPluralFormInterface {
        return this.getPluralForm();
    }

    /**
     * @inheritDoc
     */
    public setPluralForm(pluralForm: GettextPluralFormInterface) : void {
        if (pluralForm instanceof PluralForm) {
            this.#pluralForm = pluralForm;
        }
    }

    /**
     * @inheritDoc
     */
    public set pluralForm(pluralForm: GettextPluralFormInterface) {
        this.setPluralForm(pluralForm);
    }

    /**
     * @inheritDoc
     */
    public getPluralTranslationIndex(index: number): string | undefined {
        return this.#pluralTranslations[index];
    }

    /**
     * @inheritDoc
     */
    public get translationIndex(): (n: number) => string | undefined
    {
        return (n: number) => this.#pluralTranslations[n];
    }

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
     * Create new translation with plural form
     *
     * @param {GettextPluralFormInterface} pluralForm - the plural form
     *
     * @return {GettextTranslationInterface} new translation (cloned) with plural form
     */
    public withPluralForm(pluralForm: GettextPluralFormInterface): this
    {
        return this.with(this.context, this.original, this.plural, pluralForm);
    }

    /**
     * @inheritDoc
     */
    public clone(): this {
        return this.with(this.context, this.original, this.plural, this.pluralForm?.clone());
    }
}
