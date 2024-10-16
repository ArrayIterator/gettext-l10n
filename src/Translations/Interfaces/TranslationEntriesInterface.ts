import LengthInterface from '../../Interfaces/LengthInterface';
import CloneableInterface from '../../Interfaces/CloneableInterface';
import ClearableInterface from '../../Interfaces/ClearableInterface';
import GettextPluralFormInterface from '../../Gettext/Interfaces/Metadata/GettextPluralFormInterface';
import GettextHeadersInterface from '../../Gettext/Interfaces/Metadata/GettextHeadersInterface';
import GettextTranslationAttributesInterface from '../../Gettext/Interfaces/Metadata/GettextTranslationAttributesInterface';
import TranslationEntryInterface from './TranslationEntryInterface';

/**
 * Interface representing a collection of translation entries.
 */
export default interface TranslationEntriesInterface<
    Translation extends TranslationEntryInterface,
    Translations extends TranslationEntriesInterface<Translation, Translations>
> extends CloneableInterface, LengthInterface, ClearableInterface {

    /**
     * Generate id
     *
     * @param {string} original
     * @param {?string} context
     */
    generateId(original:string, context?:string) : string;

    /**
     * The revision
     *
     * @return {number} Revision
     */
    getRevision(): number;

    /**
     * The revision
     *
     * @return {number} Revision
     */
    get revision(): number;

    /**
     * Set the revision
     *
     * @param {number} revision Revision
     */
    setRevision(revision: number) : void;

    /**
     * Set the revision
     *
     * @param {number} revision Revision
     */
    set revision(revision: number);

    /**
     * The headers
     *
     * @return {GettextHeadersInterface} Headers
     */
    getHeaders(): GettextHeadersInterface;

    /**
     * The headers
     *
     * @return {GettextHeadersInterface} Headers
     */
    get headers(): GettextHeadersInterface;

    /**
     * The attributes
     *
     * @return {GettextTranslationAttributesInterface} Attributes
     */
    getAttributes(): GettextTranslationAttributesInterface;

    /**
     * The attributes
     *
     * @return {GettextTranslationAttributesInterface} Attributes
     */
    get attributes(): GettextTranslationAttributesInterface;

    /**
     * The language of the translation entries.
     *
     * @return {string} The language code.
     */
    getLanguage(): string | undefined;

    /**
     * The language of the translation entries.
     *
     * @return {string} The language code.
     */
    get language(): string | undefined;

    /**
     * Sets the language of the translation entries.
     *
     * @param {string} language - The language code.
     */
    setLanguage(language: string): void;

    /**
     * Sets the language of the translation entries.
     *
     * @param {string} language - The language code.
     */
    set language(language: string);

    /**
     * Adds a translation entry to the collection.
     *
     * @param {TranslationEntryInterface} entry - The translation entry to add.
     * @return {boolean} True if the entry was added successfully, false otherwise.
     */
    add(entry: Translation): boolean;

    /**
     * Checks if a translation entry exists in the collection.
     *
     * @param {TranslationEntryInterface | string} entry - The translation entry or its ID.
     * @return {boolean} True if the entry exists, false otherwise.
     */
    has(entry: Translation | string): boolean;

    /**
     * Removes a translation entry from the collection.
     *
     * @param {TranslationEntryInterface | string} entry - The translation entry or its ID.
     * @return {boolean} True if the entry was removed successfully, false otherwise.
     */
    remove(entry: Translation | string): boolean;

    /**
     * Merges multiple translation entries into the collection.
     *
     * @param {...TranslationEntryInterface} entries - The translation entries to merge.
     * @return {number} The number of entries added successfully.
     */
    merge(...entries: Translation[]): number;

    /**
     * Merge with translation entries
     *
     * @param {TranslationEntriesInterface} translations the translations to be merged
     *
     * @return {number} The number of entries added successfully.
     */
    mergeWith(translations: Translations): number;

    /**
     * Retrieves a translation entry from the collection.
     *
     * @param {TranslationEntryInterface | string} entry - The translation entry or its ID.
     * @return {TranslationEntryInterface | undefined} The translation entry, or null if not found.
     */
    entry(entry: Translation | string): Translation | undefined;

    /**
     * Gets all translation entries in the collection.
     *
     * @return {Record<string, TranslationEntryInterface>} An array of all translation entries.
     */
    getTranslations(): Record<string, Translation>;

    /**
     * Gets all translation entries in the collection.
     *
     * @return {Record<string, TranslationEntryInterface>} An array of all translation entries.
     */
    get translations(): Record<string, Translation>;

    /**
     * Get all entries
     * Implementations Object.values(this._translations).getEntries()
     *
     * @return {[string, TranslationEntryInterface][]} All entries
     */
    getEntries(): [string, Translation][];

    /**
     * Get all entries
     * Implementations Object.values(this._translations).getEntries()
     *
     * @return {[string, TranslationEntryInterface][]} All entries
     */
    get entries(): [string, Translation][];

    /**
     * Get translation
     *
     * @param {string} original
     * @param {?context} context
     *
     * @return {TranslationEntryInterface|undefined} the translation entry if found, otherwise undefined
     */
    getTranslation(original: string, context?: string) : Translation|undefined;

    /**
     * Set translations plural form - update all translations
     *
     * @param {GettextPluralFormInterface} pluralForm Plural form
     */
    setEntriesPluralForm(pluralForm: GettextPluralFormInterface): void;

    /**
     * Set translations plural form - update all translations
     *
     * @param {GettextPluralFormInterface} pluralForm Plural form
     */
    set entriesPluralForm(pluralForm: GettextPluralFormInterface);

    /**
     * Get length / total of entries
     *
     * @return {number} total entries
     */
    get length() : number;

    /**
     * @inheritDoc
     * Clears all translation entries from the collection.
     */
    clear(): void;
}
