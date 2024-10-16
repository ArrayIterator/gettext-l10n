import LengthInterface from './LengthInterface';

export default interface ArrayStringInterface extends LengthInterface, Iterable<string> {

    /**
     * Use unique string data
     * Represented by current storage item & the data are unique values
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
     * @param {ArrayStringInterface} instance - another instance
     *
     * @return {ArrayStringInterface} new instance of merged data
     * @throws {InvalidArgumentException} if data is not valid
     */
    mergeWith(instance: ArrayStringInterface): ArrayStringInterface;

    /**
     * Implement Iterable, return iterator of string data
     *
     * @return {Iterator<string>}
     */
    [Symbol.iterator](): Iterator<string>;

    /**
     * Implement Iterable, return iterator of string data
     */
    forEach(callback: (value: string, index: number, array: Array<string>) => void): void;

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
