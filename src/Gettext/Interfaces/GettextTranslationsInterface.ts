import GettextTranslationInterface from './GettextTranslationInterface';
import GettextTranslationFactoryInterface from './Factory/GettextTranslationFactoryInterface';
import TranslationEntriesInterface from '../../Translations/Interfaces/TranslationEntriesInterface';

export default interface GettextTranslationsInterface<
    Translation extends GettextTranslationInterface,
    Translations extends GettextTranslationsInterface<Translation, Translations>,
> extends TranslationEntriesInterface<Translation, Translations> {
    /**
     * Get the translation factory
     *
     * @return {GettextTranslationFactoryInterface} Translation factory
     */
    get translationFactory(): GettextTranslationFactoryInterface;

    /**
     * Set the translation factory
     *
     * @param {GettextTranslationFactoryInterface} factory Translation factory
     */
    set translationFactory(factory: GettextTranslationFactoryInterface);

    /**
     * Create a new translation
     *
     * @param {string|undefined} context Context the undefined means no context
     * @param {string} original
     * @param {string|undefined} plural
     * @param {string|undefined} translation
     * @param {string[]} pluralTranslations
     */
    createTranslation(
        context: string|undefined,
        original: string,
        plural?: string,
        translation?: string,
        ...pluralTranslations: string[]
    ): Translation;
}
