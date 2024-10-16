import GettextTranslationsInterface from './Interfaces/GettextTranslationsInterface';
import GettextHeadersInterface from './Interfaces/Metadata/GettextHeadersInterface';
import GettextTranslationInterface from './Interfaces/GettextTranslationInterface';
import GettextTranslationFactoryInterface from './Interfaces/Factory/GettextTranslationFactoryInterface';
import GettextTranslationFactory from './Factory/GettextTranslationFactory';
import GettextTranslationAttributesInterface from './Interfaces/Metadata/GettextTranslationAttributesInterface';
import TranslationEntries from '../Translations/TranslationEntries';

/**
 * Gettext translations contain collection of translation objects
 */
export default class GettextTranslations<
    Translation extends GettextTranslationInterface,
    Translations extends GettextTranslations<Translation, Translations>
> extends TranslationEntries<Translation, Translations> implements GettextTranslationsInterface<Translation, Translations> {

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
        ...translations: Translation[]
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
    public createTranslation(context: string|undefined, original: string, plural?: string, translation?: string, ...pluralTranslations: string[]): Translation {
        return this.translationFactory.createTranslation(
            context,
            original,
            plural,
            translation,
            this.headers.pluralForm,
            ...pluralTranslations
        ) as Translation;
    }

    /**
     * @inheritDoc
     */
    public clone(): this {
        return new (this.constructor as any)(
            this.revision,
            this.translationFactory,
            this.headers.clone(),
            this.attributes.clone(),
            ...Object.values(this.translations).map((translation) => translation.clone() as Translation)
        );
    }
}
