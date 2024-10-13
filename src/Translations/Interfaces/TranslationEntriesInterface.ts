import LengthInterface from '../../Interfaces/LengthInterface';
import TranslationEntryInterface from './TranslationEntryInterface';
import CloneableInterface from '../../Interfaces/CloneableInterface';
import ClearableInterface from '../../Interfaces/ClearableInterface';
import GettextPluralFormInterface from '../../Gettext/Interfaces/Metadata/GettextPluralFormInterface';

/**
 * Interface representing a collection of translation entries.
 */
export default interface TranslationEntriesInterface extends CloneableInterface, LengthInterface, ClearableInterface {
    /**
     * The revision
     *
     * @return {number} Revision
     */
    getRevision(): number;

    /**
     * Set the revision
     *
     * @param {number} revision Revision
     */
    setRevision(revision: number) : void;

    /**
     * Adds a translation entry to the collection.
     *
     * @param {TranslationEntryInterface} entry - The translation entry to add.
     * @return {boolean} True if the entry was added successfully, false otherwise.
     */
    add(entry: TranslationEntryInterface): boolean;

    /**
     * Checks if a translation entry exists in the collection.
     *
     * @param {TranslationEntryInterface | string} entry - The translation entry or its ID.
     * @return {boolean} True if the entry exists, false otherwise.
     */
    has(entry: TranslationEntryInterface | string): boolean;

    /**
     * Removes a translation entry from the collection.
     *
     * @param {TranslationEntryInterface | string} entry - The translation entry or its ID.
     * @return {boolean} True if the entry was removed successfully, false otherwise.
     */
    remove(entry: TranslationEntryInterface | string): boolean;

    /**
     * Merges multiple translation entries into the collection.
     *
     * @param {...TranslationEntryInterface} entries - The translation entries to merge.
     * @return {number} The number of entries added successfully.
     */
    merge(...entries: TranslationEntryInterface[]): number;

    /**
     * Retrieves a translation entry from the collection.
     *
     * @param {TranslationEntryInterface | string} entry - The translation entry or its ID.
     * @return {TranslationEntryInterface | undefined} The translation entry, or null if not found.
     */
    entry(entry: TranslationEntryInterface | string): TranslationEntryInterface | undefined;

    /**
     * Gets all translation entries in the collection.
     *
     * @return {Record<string, TranslationEntryInterface>} An array of all translation entries.
     */
    getEntries(): Record<string, TranslationEntryInterface>;

    /**
     * Set translations plural form - update all translations
     *
     * @param {GettextPluralFormInterface} pluralForm Plural form
     */
    setEntriesPluralForm(pluralForm: GettextPluralFormInterface): void;

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
