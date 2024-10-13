import GettextPluralFormInterface from 'src/Gettext/Interfaces/Metadata/GettextPluralFormInterface';
import GettextTranslationInterface from './Interfaces/GettextTranslationInterface';
import {PositiveInteger} from '../Utils/Type';
import {
    is_string,
    is_undefined
} from '../Utils/Helper';
import GettextTranslationAttributesInterface from './Interfaces/Metadata/GettextTranslationAttributesInterface';
import TranslationAttributes from './Metadata/TranslationAttributes';

/**
 * Translation storage class to handle translation for gettext
 */
export default class GettextTranslation implements GettextTranslationInterface {

    /**
     * Determines whether the translation is enabled
     *
     * @private
     */
    private _enabled: boolean = true;

    /**
     * Translation identifier
     * @private
     */
    private readonly _id: string;

    /**
     * Plural form
     * @private
     */
    private _pluralForm?: GettextPluralFormInterface;

    /**
     * Translation Attributes
     *
     * @private
     */
    private readonly _attributes: GettextTranslationAttributesInterface;

    /**
     * Translation context
     * @private
     */
    private readonly _context: string;

    /**
     * Original translation
     * @private
     */
    private readonly _original: string;

    /**
     * Plural translation
     * @private
     */
    private _plural?: string;

    /**
     * Singular translation
     * @private
     */
    private _translation?: string;

    /**
     * Plural translations
     * @private
     */
    private _pluralTranslations: string[] = [];

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
        context: string,
        original: string,
        plural?: string,
        translation?: string,
        pluralForm?: GettextPluralFormInterface,
        ...pluralTranslations: string[]
    ) {
        this._context = context;
        this._original = original;
        this._id = `${context}\x04${original}` as string;
        this.pluralTranslation = plural;
        this.translation = translation;
        this.pluralTranslations = pluralTranslations;
        this.pluralForm = pluralForm;
        this._attributes = new TranslationAttributes();
    }

    /**
     * @inheritDoc
     */
    public get enabled(): boolean {
        return this._enabled;
    }

    /**
     * @inheritDoc
     */
    public set enabled(enabled: boolean) {
        this._enabled = enabled;
    }

    /**
     * @inheritDoc
     */
    public getId(): string {
        return this._id;
    }

    /**
     * @inheritDoc
     */
    public get id(): string {
        return this._id;
    }

    /**
     * @inheritDoc
     */
    public get attributes(): GettextTranslationAttributesInterface {
        return this._attributes;
    }

    /**
     * @inheritDoc
     */
    public getContext(): string {
        return this._context;
    }

    /**
     * @inheritDoc
     */
    public get context(): string {
        return this._context;
    }

    /**
     * @inheritDoc
     */
    public getOriginal(): string {
        return this._original;
    }

    /**
     * @inheritDoc
     */
    public get original(): string {
        return this._original;
    }

    /**
     * @inheritDoc
     */
    public getPluralTranslation(): string | undefined {
        return this._plural;
    }

    /**
     * @inheritDoc
     */
    public get pluralTranslation(): string | undefined {
        return this._plural;
    }

    /**
     * @inheritDoc
     */
    public setPluralTranslation(plural: string | undefined) : void {
        if (is_undefined(plural) || is_string(plural)) {
            this._plural = plural;
        }
    }

    /**
     * @inheritDoc
     */
    public set pluralTranslation(plural: string | undefined) {
        this.setPluralTranslation(plural);
    }

    /**
     * @inheritDoc
     */
    public getTranslation(): string | undefined {
        return this._translation;
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
            this._translation = translation;
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
        return [...this._pluralTranslations];
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
            this._pluralTranslations = Array.from(pluralTranslations);
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
    public getPluralForm(): GettextPluralFormInterface | undefined {
        return this._pluralForm;
    }

    /**
     * @inheritDoc
     */
    public get pluralForm(): GettextPluralFormInterface | undefined {
        return this.getPluralForm();
    }
    /**
     * @inheritDoc
     */
    public setPluralForm(pluralForm: GettextPluralFormInterface | undefined) : void {
        this._pluralForm = pluralForm;
    }

    /**
     * @inheritDoc
     */
    public set pluralForm(pluralForm: GettextPluralFormInterface | undefined) {
        this.setPluralForm(pluralForm);
    }

    /**
     * @inheritDoc
     */
    public getPluralTranslationIndex(index: PositiveInteger): string | undefined {
        return this._pluralTranslations[index];
    }

    /**
     * @inheritDoc
     */
    public get translationIndex(): (n: number) => string | undefined
    {
        return (n: number) => this._pluralTranslations[n];
    }

    /**
     * @inheritDoc
     */
    public with(context: string, original?: string, plural?: string, pluralForm?: GettextPluralFormInterface): GettextTranslationInterface {
        return new (this.constructor as any)(
            context,
            is_undefined(original) ? this.original : original,
            plural === null ? this.pluralTranslation : plural,
            this.translation,
            is_undefined(pluralForm) ? this.pluralForm : pluralForm,
            ...this.pluralTranslations
        );
    }

    /**
     * @inheritDoc
     */
    public withPluralForm(pluralForm: GettextPluralFormInterface): GettextTranslationInterface {
        return this.with(this.context, this.original, this.pluralTranslation, pluralForm);
    }

    /**
     * @inheritDoc
     */
    public withContext(context: string): GettextTranslationInterface {
        return this.with(context, this.original, this.pluralTranslation, this.pluralForm);
    }

    /**
     * @inheritDoc
     */
    public withOriginal(original: string, plural: string | undefined | null = null): GettextTranslationInterface {
        return this.with(this.context, original, plural === null ? this.pluralTranslation : plural, this.pluralForm);
    }

    /**
     * @inheritDoc
     */
    public clone(): GettextTranslationInterface {
        return this.with(this.context, this.original, this.pluralTranslation, this.pluralForm?.clone());
    }
}
