import TranslationEntriesInterface from './Interfaces/TranslationEntriesInterface';
import GettextHeadersInterface from '../Gettext/Interfaces/Metadata/GettextHeadersInterface';
import GettextTranslationAttributesInterface from '../Gettext/Interfaces/Metadata/GettextTranslationAttributesInterface';
import TranslationEntryInterface from './Interfaces/TranslationEntryInterface';
import {
    generateTranslationId,
    is_numeric_integer,
    is_object,
    is_string,
    is_undefined
} from '../Utils/Helper';
import TranslationAttributes from '../Gettext/Metadata/TranslationAttributes';
import Headers from '../Gettext/Metadata/Headers';
import TranslationEntry from './TranslationEntry';
import GettextPluralFormInterface from '../Gettext/Interfaces/Metadata/GettextPluralFormInterface';

/**
 * Translation entries
 */
export default class TranslationEntries<
    Translation extends TranslationEntryInterface,
    Translations extends TranslationEntriesInterface<Translation, Translations>
> implements TranslationEntriesInterface<Translation, Translations> {

    /**
     * The revision
     *
     * @private
     */
    #revision: number;

    /**
     * The header
     *
     * @private
     */
    readonly #headers: GettextHeadersInterface;

    /**
     * The attributes
     *
     * @private
     */
    readonly #attributes: GettextTranslationAttributesInterface;

    /**
     * Translations
     *
     * @private
     */
    #translations: Record<string, Translation> = {};

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
        ...translations: Translation[]
    ) {
        this.#revision = !is_numeric_integer(revision) ? 0 : parseInt(revision + '');
        this.#headers = headers instanceof Headers ? headers : new Headers();
        this.#attributes = attributes instanceof TranslationAttributes ? attributes : new TranslationAttributes();
        translations.forEach((translation) : void => {
            this.add(translation);
        });
    }

    /**
     * @inheritDoc
     */
    public generateId(original:string, context?:string) : string {
        return generateTranslationId(original, context);
    }

    /**
     * @inheritDoc
     */
    public getRevision(): number {
        return this.#revision;
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
        this.#revision = is_numeric_integer(revision) ? parseInt(revision + '') : this.#revision;
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
        return this.#headers;
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
        return this.#attributes;
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
    public getTranslations(): Record<string, Translation> {
        return Object.assign({}, this.#translations);
    }

    /**
     * @inheritDoc
     */
    public get translations(): Record<string, Translation> {
        return this.getTranslations();
    }

    /**
     * @inheritDoc
     */
    public getEntries(): [string, Translation][] {
        return Object.entries(this.getTranslations());
    }

    /**
     * @inheritDoc
     */
    public get entries(): [string, Translation][] {
        return this.getEntries();
    }

    /**
     * @inheritDoc
     */
    public getTranslation(original: string, context?: string) : Translation|undefined
    {
        if (!is_string(original)) {
            return undefined;
        }
        if (!is_string(context) && !is_undefined(context)) {
            return undefined;
        }
        const id = this.generateId(original, context);
        return this.#translations[id] || undefined;
    }

    /**
     * @inheritDoc
     */
    public get length(): number {
        return Object.keys(this.#translations).length;
    }

    /**
     * @inheritDoc
     */
    public clear(): void {
        this.#translations = {};
    }

    /**
     * @inheritDoc
     */
    public merge(...translations: Translation[]): number {
        let number = 0;
        translations.forEach((translation) => {
            if (this.add(translation.withPluralForm(this.headers.pluralForm))) {
                number++;
            }
        });
        return number;
    }

    /**
     * @inheritDoc
     */
    public mergeWith(translations: Translations): number {
        // noinspection SuspiciousTypeOfGuard
        if (!(translations instanceof TranslationEntries)) {
            return 0;
        }
        return this.merge(...Object.values(translations.translations));
    }

    /**
     * @inheritDoc
     */
    public add(translation: Translation): boolean {
        if (translation instanceof TranslationEntry) {
            const id = this.generateId(translation.original, translation.context);
            this.#translations[id] = translation;
            return true;
        }
        return false;
    }

    /**
     * @inheritDoc
     */
    public entry(entry: Translation | string): Translation | undefined {
        return this.get(entry);
    }

    /**
     * @inheritDoc
     */
    public get(id: string | Translation): Translation | undefined {
        if (is_object(id)) {
            if (!is_string(id.original)) {
                return undefined;
            }
            const context = id.context;
            if (!is_string(context) && !is_undefined(context)) {
                return undefined;
            }
            id = this.generateId(id.original, context);
        }
        if (!is_string(id)) {
            return;
        }
        return this.#translations[id as string];
    }

    /**
     * @inheritDoc
     */
    public has(id: string | Translation): boolean {
        return this.get(id) !== undefined;
    }

    /**
     * @inheritDoc
     */
    public remove(id: string | Translation): boolean {
        let translation = this.get(id);
        if (!translation) {
            return false;
        }
        id = this.generateId(translation.original, translation.context);
        delete this.#translations[id];
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
    public clone(): this {
        return new (this.constructor as any)(
            this.revision,
            this.headers.clone(),
            this.attributes.clone(),
            ...Object.values(this.translations).map((translation) => translation.clone())
        );
    }
}
