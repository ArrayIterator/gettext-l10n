import LengthInterface from "./LengthInterface";

export default interface ArrayStringInterface extends LengthInterface, Iterable<string> {

    /**
     * Use unique string data
     * Represented by getter of the data is unique
     *
     * @return {boolean} true if unique
     */
    get unique(): boolean;

    /**
     * Add string data
     *
     * @param {string} string - the string data
     */
    add(string: string): void;

    /**
     * Remove string data
     *
     * @param {string} string - the string data
     */
    remove(string: string): void;

    /**
     * Check if string data exists
     *
     * @param {string} string - the string data
     *
     * @return {boolean} true if exists
     */
    has(string: string): boolean;

    /**
     * Get entries of string data
     *
     * @see Array.entries
     *
     * @return {IteratorObject<[number, string]>}
     */
    entries(): IteratorObject<[number, string]>;

    /**
     * Merge with another instance
     *
     * @param {ArrayStringInterface} array - another instance
     */
    mergeWith(array: ArrayStringInterface): ArrayStringInterface;

    /**
     * Implement Iterable, return iterator of string data
     *
     * @return {Iterator<string>}
     */
    [Symbol.iterator](): Iterator<string>;

    /**
     * Get list of string data
     *
     * @return {Array<string>} list of string data
     */
    get all(): Array<string>;

    /**
     * Get length of string data
     *
     * @return {number} length of data
     */
    get length(): number;
}
