import GettextTranslationsInterface from './Interfaces/GettextTranslationsInterface';
import GettextHeadersInterface from './Interfaces/Metadata/GettextHeadersInterface';
import GettextTranslationInterface from './Interfaces/GettextTranslationInterface';
import {
    is_object,
    is_string
} from '../Utils/Helper';
import GettextTranslationFactoryInterface from './Interfaces/Factory/GettextTranslationFactoryInterface';
import GettextTranslationFactory from './Factory/GettextTranslationFactory';
import GettextPluralFormInterface from './Interfaces/Metadata/GettextPluralFormInterface';
import GettextTranslation from './GettextTranslation';
import TranslationEntryInterface from 'src/Translations/Interfaces/TranslationEntryInterface';
import GettextTranslationAttributesInterface from './Interfaces/Metadata/GettextTranslationAttributesInterface';
import TranslationEntries from '../Translations/TranslationEntries';

/**
 * Gettext translations contain collection of translation objects
 */
export default class GettextTranslations extends TranslationEntries implements GettextTranslationsInterface {

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
     * @param {GettextTranslationAttributesInterface} attributes the attributes
     * @param {GettextTranslationInterface[]} translations the translations
     */
    public constructor(
        revision?: number,
        translationFactory?: GettextTranslationFactoryInterface,
        headers?: GettextHeadersInterface,
        attributes?: GettextTranslationAttributesInterface,
        ...translations: GettextTranslationInterface[]
    ) {
        super(revision, headers, attributes, ...translations);
        this._translationFactory = translationFactory instanceof GettextTranslationFactory ? translationFactory : new GettextTranslationFactory();
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
    public getTranslations(): Record<string, GettextTranslationInterface> {
        return Object.assign({}, this._translations as Record<string, GettextTranslationInterface>);
    }

    /**
     * @inheritDoc
     */
    public get translations(): Record<string, GettextTranslationInterface> {
        return this.getTranslations();
    }

    /**
     * @inheritDoc
     */
    public createTranslation(context: string|undefined, original: string, plural?: string, translation?: string, ...pluralTranslations: string[]): GettextTranslationInterface {
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
        return this._translations[id as string] as GettextTranslationInterface;
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
    public getEntries(): [string, GettextTranslationInterface][] {
        return Object.entries(this._translations) as [string, GettextTranslationInterface][];
    }

    /**
     * @inheritDoc
     */
    public get entries(): [string, GettextTranslationInterface][] {
        return this.getEntries();
    }

    /**
     * @inheritDoc
     */
    public setEntriesPluralForm(pluralForm: GettextPluralFormInterface) : void {
        this.headers.pluralForm = pluralForm;
        this.getEntries().forEach(([_id, entry]) => entry.setPluralForm(pluralForm));
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
    public clone(): GettextTranslationsInterface {
        return new (this.constructor as any)(
            this.revision,
            this.translationFactory,
            this.headers.clone(),
            this.attributes.clone(),
            ...Object.values(this.translations).map((translation) => translation.clone() as GettextTranslationInterface)
        );
    }
}
