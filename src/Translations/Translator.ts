import TranslatorInterface from './Interfaces/TranslatorInterface';
import TranslationEntriesInterface from './Interfaces/TranslationEntriesInterface';
import {
    DEFAULT_DOMAIN,
    DEFAULT_LANGUAGE,
    getLocaleInfo,
    normalizeLocale
} from '../Utils/Locale';
import {
    is_numeric,
    is_string,
    is_undefined,
    normalize_number
} from '../Utils/Helper';
import TranslationEntryInterface from './Interfaces/TranslationEntryInterface';
import TranslationEntries from './TranslationEntries';
import GettextTranslationInterface from '../Gettext/Interfaces/GettextTranslationInterface';

/**
 * Filter the language
 *
 * @param language
 */
export const filter_language = (language: string): string | null => {
    if (!is_string(language)) {
        return null;
    }
    let info = getLocaleInfo(language);
    if (info) {
        return info.id;
    }
    let locale = normalizeLocale(language);
    if (locale) {
        return locale;
    }
    return null;
}

/**
 * The translator
 */
export default class Translator<
    Translation extends TranslationEntryInterface|GettextTranslationInterface,
    Translations extends TranslationEntriesInterface<Translation, Translations>
> implements TranslatorInterface<Translation, Translations> {

    /**
     * The translation entries
     *
     * @private
     */
    #translatorEntries: {
        [domain: string]: {
            [language: string]: Translations
        }
    } = {};

    /**
     * The original language for untranslated translation
     *
     * @private
     */
    #originalLanguage = DEFAULT_LANGUAGE;

    /**
     * The current set language
     *
     * @private
     */
    #language: string = DEFAULT_LANGUAGE;

    /**
     * Translator constructor
     */
    public constructor(
        language: string = DEFAULT_LANGUAGE
    ) {
        this.setLanguage(language);
    }

    /**
     * @inheritDoc
     */
    public setOriginalLanguage(language: string): string | undefined {
        let locale = filter_language(language);
        if (!locale) {
            return undefined;
        }
        this.#originalLanguage = locale;
        return locale;
    }

    /**
     * @inheritDoc
     */
    public set originalLanguage(language:string) {
        this.setOriginalLanguage(language);
    }

    /**
     * @inheritDoc
     */
    public getOriginalLanguage(): string {
        return this.#originalLanguage;
    }

    /**
     * @inheritDoc
     */
    public get originalLanguage() : string {
        return this.getOriginalLanguage();
    }

    /**
     * @inheritDoc
     */
    public setLanguage(language: string) : string|undefined {
        let locale = filter_language(language);
        if (!locale) {
            return undefined;
        }
        this.#language = locale;
        return locale;
    }

    /**
     * @inheritDoc
     */
    public set language(language:string) {
        this.setLanguage(language);
    }

    /**
     * @inheritDoc
     */
    public getLanguage(): string {
        return this.#language;
    }

    /**
     * @inheritDoc
     */
    public get language() : string {
        return this.getLanguage();
    }

    /**
     * @inheritDoc
     */
    public add(translations: Translations, domain: string, language?: string): boolean {
        if (!(translations instanceof TranslationEntries)) {
            return false;
        }
        if (!is_string(domain)) {
            return false;
        }
        if (!is_string(language)) {
            if (language) {
                return false;
            }
            language = undefined;
        }
        if (!language) {
            language = translations.headers.language;
        }
        let locale = filter_language(language);
        if (!locale) { // empty skipped
            return false;
        }
        // exists skipped
        if (this.#translatorEntries[domain]
            && this.#translatorEntries[domain][locale]
        ) {
            return false;
        }
        if (!this.#translatorEntries[domain]) {
            this.#translatorEntries[domain] = {};
        }
        if (!this.#translatorEntries[domain][locale]) {
            this.#translatorEntries[domain][locale] = new TranslationEntries() as unknown as Translations;
        }
        this.#translatorEntries[domain][locale].mergeWith(translations);
        return true;
    }

    /**
     * @inheritDoc
     */
    public remove(domain: string, language?: string): boolean {
        if (!is_string(domain)) {
            return false;
        }
        let result : boolean = (this.#translatorEntries[domain] && Object.keys(this.#translatorEntries).length > 0);
        if (!is_string(language)) {
            if (language) {
                return false;
            }
            delete this.#translatorEntries[domain];
            return result;
        }
        if (!result) {
            return result;
        }
        language = normalizeLocale(language) as string;
        if (!language) {
            return false;
        }
        result = this.#translatorEntries[domain] ? !!(this.#translatorEntries[domain][language]) : false;
        if (result) {
            delete this.#translatorEntries[domain][language];
            if (Object.keys(this.#translatorEntries[domain]).length === 0) {
                delete this.#translatorEntries[domain];
            }
        }
        return result;
    }

    /**
     * @inheritDoc
     */
    public has(domain: string, language?: string): boolean {
        if (!is_string(domain)) {
            return false;
        }
        let result : boolean = (this.#translatorEntries[domain] && Object.keys(this.#translatorEntries).length > 0);
        if (!is_string(language)) {
            if (language) {
                return false;
            }
            return result;
        }
        if (!language) {
            return result;
        }
        language = normalizeLocale(language) as string;
        if (!language) {
            return false;
        }
        result = this.#translatorEntries[domain] ? !!(this.#translatorEntries[domain][language]) : false;
        if (result && Object.keys(this.#translatorEntries[domain]).length === 0) {
            delete this.#translatorEntries[domain];
        }
        return result;
    }

    /**
     * @inheritDoc
     */
    public translate<Singular extends string, Translated extends string>(singular: Singular, domain: string = DEFAULT_DOMAIN, context?: string): Translated | Singular {
        const translation = this.find(singular, domain, context);
        if (!translation) {
            return singular;
        }
        const translated = translation.translation;
        return is_string(translated) ? translated as Translated : singular;
    }

    /**
     * @inheritDoc
     */
    public translateContext<Singular extends string, Translated extends string>(singular: Singular, context: string, domain: string = DEFAULT_DOMAIN): Singular | Translated {
        return this.translate(singular, domain, context);
    }

    /**
     * @inheritDoc
     */
    public translatePlural<Singular extends string, Plural extends string, Translated extends string>(
        singular: Singular,
        plural: Plural,
        number: number,
        domain: string = DEFAULT_DOMAIN,
        context?: string
    ): Singular | Plural | Translated {
        const translation = this.find(singular, domain, context);
        if (!translation) {
            if (!is_numeric(number)) {
                return singular;
            }
            number = normalize_number(number) as number;
            return number === 1 ? singular : plural;
        }

        if (is_numeric(number)) {
            let index: number;
            try {
                index = translation.pluralForm.index(number);
            } catch (_e) {
                if (!is_numeric(number)) {
                    return singular;
                }
                number = normalize_number(number) as number;
                return number === 1 ? singular : plural;
            }
            if (index < 1) {
                const translated = translation.translation;
                return is_string(translated) ? translated as Translated : singular;
            }
            index -= 1;
            const translated = translation.getPluralTranslationIndex(index);
            return is_string(translated) ? translated as Translated : plural;
        }
        const translated = translation.translation;
        return is_string(translated) ? translated as Translated : singular;
    }

    /**
     * @inheritDoc
     */
    public translatePluralContext<Singular extends string, Plural extends string, Translated extends string>(
        singular: Singular,
        plural: Plural,
        number: number,
        context: string,
        domain: string = DEFAULT_DOMAIN
    ): Singular | Plural | Translated {
        return this.translatePlural(singular, plural, number, domain, context);
    }

    /**
     * @inheritDoc
     */
    public find<Singular extends string>(singular: Singular, domain: string = DEFAULT_DOMAIN, context?: string): Translation | undefined {
        if (!is_string(context) && !is_undefined(context)) {
            return undefined;
        }
        let translations = this.findByLanguage(this.language, domain);
        if (!translations) {
            return undefined;
        }
        return translations.getTranslation(singular, context)
    }

    /**
     * @inheritDoc
     */
    public findByLanguage(language: string, domain: string): Translations | undefined {
        if (!is_string(domain) || !is_string(language)) {
            return undefined;
        }
        return this.#translatorEntries[domain] && this.#translatorEntries[domain][language]
            ? this.#translatorEntries[domain][language]
            : undefined;
    }

    /**
     * @inheritDoc
     */
    public clear(): void {
        // emptying
        this.#translatorEntries = {};
    }
}
