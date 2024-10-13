import LengthInterface from '../../../../Interfaces/LengthInterface';
import {PositiveInteger} from '../../../../Utils/Type';
import CloneableInterface from '../../../../Interfaces/CloneableInterface';

export default interface GettextReferencesInterface extends LengthInterface, CloneableInterface, Iterable<[string, PositiveInteger[]]> {

    /**
     * Add reference by string
     *
     * @param {string} file - the reference string of file
     * @param {?PositiveInteger} line - line number
     */
    add(file: string, line?: PositiveInteger | undefined | null): void;

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
     * @return {IteratorObject<[string, PositiveInteger[]]>}
     */
    entries(): IteratorObject<[string, PositiveInteger[]]>;

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
     * @return {Iterator<[string, PositiveInteger[]]>}
     */
    [Symbol.iterator](): Iterator<[string, PositiveInteger[]]>;

    /**
     * Get list of string data
     *
     * @return {Record<string, PositiveInteger[]>} list of string data
     */
    get all(): Record<string, PositiveInteger[]>;

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
