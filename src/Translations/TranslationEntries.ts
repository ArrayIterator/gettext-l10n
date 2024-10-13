import TranslationEntriesInterface from './Interfaces/TranslationEntriesInterface';
import GettextHeadersInterface from '../Gettext/Interfaces/Metadata/GettextHeadersInterface';
import GettextTranslationAttributesInterface from '../Gettext/Interfaces/Metadata/GettextTranslationAttributesInterface';
import TranslationEntryInterface from './Interfaces/TranslationEntryInterface';
import {
    is_numeric_integer,
    is_object,
    is_string
} from '../Utils/Helper';
import TranslationAttributes from '../Gettext/Metadata/TranslationAttributes';
import Headers from '../Gettext/Metadata/Headers';
import TranslationEntry from './TranslationEntry';
import GettextPluralFormInterface from '../Gettext/Interfaces/Metadata/GettextPluralFormInterface';

/**
 * Translation entries
 */
export default class TranslationEntries implements TranslationEntriesInterface {

    /**
     * The revision
     *
     * @private
     */
    protected _revision: number;

    /**
     * The header
     *
     * @private
     */
    protected readonly _headers: GettextHeadersInterface;

    /**
     * The attributes
     *
     * @private
     */
    protected readonly _attributes: GettextTranslationAttributesInterface;

    /**
     * Translations
     *
     * @private
     */
    protected _translations: Record<string, TranslationEntryInterface> = {};

    /**
     * Constructor
     *
     * @param {number} revision the revision
     * @param {GettextHeadersInterface} headers the headers
     * @param {GettextTranslationAttributesInterface} attributes the attributes
     * @param {TranslationEntryInterface[]} translations the translations
     */
    public constructor(
        revision?: number,
        headers?: GettextHeadersInterface,
        attributes?: GettextTranslationAttributesInterface,
        ...translations: TranslationEntryInterface[]
    ) {
        this._revision = !is_numeric_integer(revision) ? 0 : parseInt(revision + '');
        this._headers = headers instanceof Headers ? headers : new Headers();
        this._attributes = attributes instanceof TranslationAttributes ? attributes : new TranslationAttributes();
        translations.forEach((translation) : void => {
            this.add(translation);
        });
    }

    /**
     * @inheritDoc
     */
    public getRevision(): number {
        return this._revision;
    }

    /**
     * @inheritDoc
     */
    public get revision(): number {
        return this.getRevision();
    }

    /**
     * @inheritDoc
     */
    public setRevision(revision: number) : void {
        this._revision = is_numeric_integer(revision) ? parseInt(revision + '') : this._revision;
    }

    /**
     * @inheritDoc
     */
    public set revision(revision: number) {
        this.setRevision(revision);
    }

    /**
     * @inheritDoc
     */
    public getHeaders(): GettextHeadersInterface {
        return this._headers;
    }

    /**
     * @inheritDoc
     */
    public get headers(): GettextHeadersInterface {
        return this.getHeaders();
    }

    /**
     * @inheritDoc
     */
    public getAttributes(): GettextTranslationAttributesInterface {
        return this._attributes;
    }

    /**
     * @inheritDoc
     */
    public get attributes(): GettextTranslationAttributesInterface {
        return this.getAttributes();
    }

    /**
     * @inheritDoc
     */
    public getLanguage(): string {
        return this.headers.language;
    }

    /**
     * @inheritDoc
     */
    public get language(): string {
        return this.headers.language;
    }

    /**
     * @inheritDoc
     */
    public setLanguage(language: string) : void {
        this.headers.language = language
    }

    /**
     * @inheritDoc
     */
    public set language(language: string) {
        this.setLanguage(language);
    }

    /**
     * @inheritDoc
     */
    public getTranslations(): Record<string, TranslationEntryInterface> {
        return Object.assign({}, this._translations);
    }

    /**
     * @inheritDoc
     */
    public get translations(): Record<string, TranslationEntryInterface> {
        return this.getTranslations();
    }

    /**
     * @inheritDoc
     */
    public getEntries(): [string, TranslationEntryInterface][] {
        return Object.entries(this.getTranslations());
    }

    /**
     * @inheritDoc
     */
    public get entries(): [string, TranslationEntryInterface][] {
        return this.getEntries();
    }

    /**
     * @inheritDoc
     */
    public get length(): number {
        return Object.keys(this._translations).length;
    }

    /**
     * @inheritDoc
     */
    public clear(): void {
        this._translations = {};
    }

    /**
     * @inheritDoc
     */
    public merge(...translations: TranslationEntryInterface[]): number {
        let number = 0;
        translations.forEach((translation) => {
            translation = translation.clone();
            if (this.add(translation)) {
                translation.setPluralForm(this.headers.pluralForm);
                number++;
            }
        });
        return number;
    }

    /**
     * @inheritDoc
     */
    public add(translation: TranslationEntryInterface): boolean {
        if (translation instanceof TranslationEntry) {
            this._translations[translation.id] = translation;
            return true;
        }
        return false;
    }

    /**
     * @inheritDoc
     */
    public entry(entry: TranslationEntryInterface | string): TranslationEntryInterface | undefined {
        return this.get(entry);
    }

    /**
     * @inheritDoc
     */
    public get(id: string | TranslationEntryInterface): TranslationEntryInterface | undefined {
        if (is_object(id)) {
            id = id.id as string;
        }
        if (!is_string(id)) {
            return;
        }
        return this._translations[id as string];
    }

    /**
     * @inheritDoc
     */
    public has(id: string | TranslationEntryInterface): boolean {
        return this.get(id) !== undefined;
    }

    /**
     * @inheritDoc
     */
    public remove(id: string | TranslationEntryInterface): boolean {
        let translation = this.get(id);
        if (!translation) {
            return false;
        }
        delete this._translations[translation.id];
        return true;
    }

    /**
     * @inheritDoc
     */
    public setEntriesPluralForm(pluralForm: GettextPluralFormInterface) : void {
        this.headers.pluralForm = pluralForm;
        this.getEntries().forEach(([_id, translation]) => translation.setPluralForm(pluralForm));
    }

    /**
     * @inheritDoc
     */
    public set entriesPluralForm(pluralForm: GettextPluralFormInterface) {
        this.setEntriesPluralForm(pluralForm);
    }

    /**
     * @inheritDoc
     */
    public clone(): TranslationEntriesInterface {
        return new (this.constructor as any)(
            this.revision,
            this.headers.clone(),
            this.attributes.clone(),
            ...Object.values(this.translations).map((translation) => translation.clone())
        );
    }
}
