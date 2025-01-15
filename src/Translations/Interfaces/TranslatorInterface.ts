import TranslationEntryInterface from './TranslationEntryInterface';
import TranslationEntriesInterface from './TranslationEntriesInterface';
import ClearableInterface from '../../Interfaces/ClearableInterface';

export default interface TranslatorInterface<
    Translation extends TranslationEntryInterface = TranslationEntryInterface,
    Translations extends TranslationEntriesInterface<Translation, Translations> = TranslationEntriesInterface<Translation, any>
> extends ClearableInterface {
    /**
     * Set original language, this will identify to disable translation when current language same with original language
     *
     * @param {string} language the language code
     *
     * @return {string|undefined} string normalized locale, otherwise undefined if not set / failed
     */
    setOriginalLanguage(language: string) : string|undefined;

    /**
     * Set original language, this will identify to disable translation when current language same with original language
     *
     * @param {string} language the language code
     */
    set originalLanguage(language: string);

    /**
     * Get original language, this will identify to disable translation when current language same with original language
     *
     * @return {string} string normalized locale of the original language
     */
    getOriginalLanguage() : string;

    /**
     * Get original language, this will identify to disable translation when current language same with original language
     *
     * @return {string} string normalized locale of the original language
     */
    get originalLanguage() : string;

    /**
     * Set language
     *
     * @param {string} language the language code
     *
     * @return {string|undefined} string normalized locale, otherwise undefined if not set / failed
     */
    setLanguage(language: string) : string|undefined;

    /**
     * Set language
     *
     * @param {string} language the language code
     */
    set language(language: string);

    /**
     * Get current language
     *
     * @return {string} language
     */
    getLanguage() : string;

    /**
     * Get current language
     *
     * @return {string} language
     */
    get language() : string;

    /**
     * Add the translations
     *
     * @param {TranslationEntriesInterface} translations the translations object
     * @param {string} domain - the translation domain
     * @param {string} language - the language code, if not set param will automatically detect by translation headers
     *
     * @return {boolean} true if added
     */
    add(translations: Translations, domain: string, language?: string) : boolean;

    /**
     * Remove the translation by domain or and language
     *
     * @param {string} domain - the translation domain
     * @param {string} language - the language code, if not set param will automatically detect by translation headers
     *
     * @return {boolean} true if removed
     */
    remove(domain: string, language?: string) : boolean;

    /**
     * Check if current translator has language within domain
     *
     * @param {string} domain - the translation domain
     * @param {string} language - the language code, if not set param will automatically detect by translation headers
     *
     * @return {boolean} true if exists
     */
    has(domain: string, language?: string) : boolean;

    /**
     * Translate single
     *
     * @param {string} singular - the original language
     * @param {string} domain - the translation domain
     * @param {?string} context - the translation context
     *
     * @return {string} the translated message, otherwise return original singular if not found
     */
    translate<Singular extends string, Translated extends string>(
        singular: Singular,
        domain: string,
        context?: string
    ) : Translated|Singular;

    /**
     * Translate with context
     *
     * @param {string} singular - the original language
     * @param {string} context - the translation context
     * @param {string} domain - the translation domain
     *
     * @return {string} the translated message, otherwise return original singular if not found
     */
    translateContext<Singular extends string, Translated extends string>(
        singular: Singular,
        context: string,
        domain: string,
    ) : Singular|Translated;

    /**
     * Translate plural
     * @param {string} singular - the original language
     * @param {string} plural - the plural translation
     * @param {number} number - the number that identify the plural
     * @param {string} domain - the translation domain
     * @param {?string} context - the translation context
     *
     * @return {string} the translated message, otherwise return original singular if not found
     */
    translatePlural<Singular extends string, Plural extends string, Translated extends string>(
        singular: Singular,
        plural: Plural,
        number: number,
        domain: string,
        context?: string
    ) : Singular|Plural|Translated;

    /**
     * Translate plural
     * @param {string} singular - the original language
     * @param {string} plural - the plural translation
     * @param {number} number - the number that identify the plural
     * @param {string} domain - the translation domain
     * @param {string} context - the translation context
     *
     * @return {string} the translated message, otherwise return original singular if not found
     */
    translatePluralContext<Singular extends string, Plural extends string, Translated extends string>(
        singular: Singular,
        plural: Plural,
        number: number,
        context: string,
        domain: string
    ) : Singular|Plural|Translated;

    /**
     * Find the translation
     *
     * @param {string} singular - the original language
     * @param {string} context - the translation context
     * @param {string} domain - the translation domain
     *
     * @return {TranslationEntryInterface|undefined} the translation entry
     */
    find<Singular extends string>(
        singular: Singular,
        domain: string,
        context?: string
    ): Translation|undefined;

    /**
     * Find the translation
     *
     * @param {string} domain - the translation domain
     * @param {string} language - the translation language
     *
     * @return {TranslationEntryInterface|undefined} the translation entry
     */
    findByLanguage(
        language: string,
        domain: string
    ) : Translations|undefined;

    /**
     * Clear the stored translations
     */
    clear() : void;

    /**
     * Get available languages within domain
     * @param {string} domain - the translation domain
     */
    getAvailableLanguages(domain: string): string[];
}
