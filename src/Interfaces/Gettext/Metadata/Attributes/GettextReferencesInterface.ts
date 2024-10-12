import LengthInterface from "../../../LengthInterface";
import {PositiveInteger} from "../../../../Utils/Type";
import CloneableInterface from "../../../CloneableInterface";

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

