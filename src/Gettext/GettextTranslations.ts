import GettextTranslationsInterface from './Interfaces/GettextTranslationsInterface';
import GettextHeadersInterface from './Interfaces/Metadata/GettextHeadersInterface';
import GettextFlagsInterface from './Interfaces/Metadata/Attributes/GettextFlagsInterface';
import GettextTranslationInterface from './Interfaces/GettextTranslationInterface';
import Headers from './Metadata/Headers';
import Flags from './Metadata/Attributes/Flags';
import {
    is_numeric_integer,
    is_object,
    is_string
} from '../Utils/Helper';
import GettextTranslationFactoryInterface from './Interfaces/Factory/GettextTranslationFactoryInterface';
import GettextTranslationFactory from './Factory/GettextTranslationFactory';
import GettextPluralFormInterface from './Interfaces/Metadata/GettextPluralFormInterface';
import GettextTranslation from './GettextTranslation';
import TranslationEntryInterface from 'src/Translations/Interfaces/TranslationEntryInterface';

/**
 * Gettext translations contain collection of translation objects
 */
export default class GettextTranslations implements GettextTranslationsInterface {

    /**
     * The revision
     *
     * @private
     */
    private _revision: number;

    /**
     * The header
     *
     * @private
     */
    private readonly _headers: GettextHeadersInterface;

    /**
     * The flags
     *
     * @private
     */
    private readonly _flags: GettextFlagsInterface;

    /**
     * Translations
     *
     * @private
     */
    private _translations: Record<string, GettextTranslationInterface>;

    /**
     * Translation factory
     *
     * @private
     */
    private _translationFactory: GettextTranslationFactoryInterface;

    /**
     * Constructor
     *
     * @param {number} revision the revision
     * @param {GettextTranslationFactoryInterface} translationFactory the translation factory
     * @param {GettextHeadersInterface} headers the headers
     * @param {GettextFlagsInterface} flags the flags
     * @param {GettextTranslationInterface[]} translations the translations
     */
    public constructor(
        revision?: number,
        translationFactory?: GettextTranslationFactoryInterface,
        headers?: GettextHeadersInterface,
        flags?: GettextFlagsInterface,
        ...translations: GettextTranslationInterface[]
    ) {
        this._revision = !is_numeric_integer(revision) ? 0 : parseInt(revision + '');
        this._headers = headers || new Headers();
        this._flags = flags || new Flags();
        this._translations = {} as Record<string, GettextTranslationInterface>;
        this._translationFactory = translationFactory || new GettextTranslationFactory();
        translations.forEach((translation) => {
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
    public get translationFactory(): GettextTranslationFactoryInterface {
        return this._translationFactory;
    }

    /**
     * @inheritDoc
     */
    public set translationFactory(factory: GettextTranslationFactoryInterface) {
        this._translationFactory = factory;
    }

    /**
     * @inheritDoc
     */
    public get headers(): GettextHeadersInterface {
        return this._headers;
    }

    /**
     * @inheritDoc
     */
    public get flags(): GettextFlagsInterface {
        return this._flags;
    }

    /**
     * @inheritDoc
     */
    public get language(): string {
        return this.headers.language as string;
    }

    /**
     * @inheritDoc
     */
    public set language(language: string) {
        this.headers.language = language;
    }

    /**
     * @inheritDoc
     */
    public getEntries(): Record<string, GettextTranslationInterface> {
        return Object.assign({}, this._translations);
    }

    /**
     * @inheritDoc
     */
    public get entries(): Record<string, GettextTranslationInterface> {
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
    public createTranslation(context: string, original: string, plural?: string, translation?: string, ...pluralTranslations: string[]): GettextTranslationInterface {
        return this.translationFactory.createTranslation(
            context,
            original,
            plural,
            translation,
            this.headers.pluralForm,
            ...pluralTranslations
        );
    }

    /**
     * @inheritDoc
     */
    public merge(...translations: GettextTranslationInterface[]): number {
        let pluralForm = this.headers.pluralForm;
        let number = 0;
        translations.forEach((translation) => {
            if (this.add(translation.withPluralForm(pluralForm))) {
                number++;
            }
        });
        return number;
    }

    /**
     * @inheritDoc
     */
    public add(translation: GettextTranslationInterface): boolean {
        if (translation instanceof GettextTranslation) {
            this._translations[translation.id] = translation;
            return true;
        }
        return false;
    }

    /**
     * @inheritDoc
     */
    public entry(entry: GettextTranslationInterface | string): TranslationEntryInterface | undefined {
        return this.get(entry);
    }

    /**
     * @inheritDoc
     */
    public get(id: string | GettextTranslationInterface): GettextTranslationInterface | undefined {
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
    public has(id: string | GettextTranslationInterface): boolean {
        return this.get(id) !== undefined;
    }

    /**
     * @inheritDoc
     */
    public remove(id: string | GettextTranslationInterface): boolean {
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
        Object.values(this.entries).forEach((translation) => {
            translation.pluralForm = pluralForm;
        });
    }

    /**
     * @inheritDoc
     */
    public clone(): GettextTranslationsInterface {
        return new (this.constructor as any)(
            this.revision,
            this.translationFactory,
            this.headers.clone(),
            this.flags.clone(),
            ...Object.values(this.entries).map((translation) => translation.clone())
        );
    }
}
