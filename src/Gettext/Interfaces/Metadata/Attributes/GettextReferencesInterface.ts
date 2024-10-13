import LengthInterface from '../../../../Interfaces/LengthInterface';
import CloneableInterface from '../../../../Interfaces/CloneableInterface';

export default interface GettextReferencesInterface extends LengthInterface, CloneableInterface, Iterable<[string, number[]]> {

    /**
     * Add reference by string
     *
     * @param {string} file - the reference string of file
     * @param {?number} line - line number
     */
    add(file: string, line?: number | undefined | null): void;

    /**
     * Remove reference by string
     *
     * @param {string} file - the reference string of file
     */
    remove(file: string): void;

    /**
     * Check if reference exists
     *
     * @param {string} file - the reference string of file
     */
    has(file: string): boolean;

    /**
     * Get entries of string data
     *
     * @see Array.entries
     *
     * @return {IteratorObject<[string, number[]]>}
     */
    entries(): IteratorObject<[string, number[]]>;

    /**
     * Merge with another instance
     *
     * @param {GettextReferencesInterface} references - another instance
     *
     * @return {GettextReferencesInterface} new instance of ReferenceInterface
     * @throws {InvalidArgumentException} if the instance is not self class or sub
     */
    mergeWith(references: GettextReferencesInterface): GettextReferencesInterface;

    /**
     * Implement Iterable, return iterator of string data
     *
     * @return {Iterator<[string, number[]]>}
     */
    [Symbol.iterator](): Iterator<[string, number[]]>;

    /**
     * For each string data
     *
     * @param {(value: [string, number[]], index: number, array: [string, number[]][]) => void} callback - the callback function
     */
    forEach(callback: (value: [string, number[]], index: number, array: [string, number[]][]) => void): void;

    /**
     * Get list of string data
     *
     * @return {Record<string, number[]>} list of string data
     */
    get all(): Record<string, number[]>;

    /**
     * Get length of string data
     *
     * @return {number} length of data
     */
    get length(): number;

    /**
     * Clone the references
     *
     * @return {GettextReferencesInterface} the cloned references
     */
    clone(): GettextReferencesInterface;
}
