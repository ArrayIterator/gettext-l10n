// noinspection JSUnusedGlobalSymbols

import ClearableInterface from '../Interfaces/ClearableInterface';

/**
 * @template TValue
 * @template U
 * @param {any} TValue
 * @param {any} U
 */
export default class IterableArray<TValue extends any> implements ClearableInterface {

    /**
     * Items
     *
     * @private
     */
    #items: Array<TValue> = [];

    /**
     * Current index
     *
     * @private
     */
    #current: number = 0;

    /**
     * Constructor
     * @param {Array<TValue>} items the items
     */
    public constructor(items: Array<TValue>) {
        this.#items = Array.from(items);
    }

    /**
     * Get length of the array
     *
     * @return {number} the length of the array
     */
    public get length(): number {
        return this.#items.length;
    }

    /**
     * Check if the current index is valid
     *
     * @return {boolean} true if the current index is valid, false otherwise
     */
    public valid(): boolean {
        return this.#current >= 0 && this.#current < this.length && this.length > 0;
    }

    /**
     * Get the current item
     *
     * @return {false | TValue} the current item or false if the current index is invalid
     */
    public current(): false | TValue {
        if (!this.valid()) {
            return false;
        }
        return this.#items[this.#current];
    }

    /**
     * Get the first item and point to it
     *
     * @return {false | TValue} the first item or false if the array is empty
     */
    public reset(): false | TValue {
        this.#current = 0;
        return this.current();
    }

    /**
     * Get the last item and point to it
     *
     * @return {false | TValue} the last item or false if the array is empty
     */
    public end(): false | TValue {
        if (this.length === 0) {
            return false;
        }
        this.#current = this.length - 1;
        return this.current();
    }

    /**
     * Get the key of the current item
     *
     * @return {number | false} the key of the current item or false if the current index is invalid
     */
    public key(): number | false {
        if (this.valid()) {
            return this.#current;
        }
        return this.#current;
    }

    /**
     * Get the previous item and point to it
     *
     * @return {false | TValue} the next item or false if the current index is invalid
     */
    public prev(): TValue | false {
        if (this.#current >= 0) {
            this.#current--;
        }
        return this.current();
    }

    /**
     * Get the next item and point to it
     *
     * @return {false | TValue} the next item or false if the current index is invalid
     */
    public next(): TValue | false {
        if (this.#current < this.length) {
            this.#current++;
        }
        return this.current();
    }

    /**
     * Seek to a specific index
     *
     * @param {number} index
     */
    public seek(index: number): TValue | false {
        this.#current = index;
        if (this.valid()) {
            return this.current();
        }
        return false;
    }

    /**
     * Get copy of the iterable array
     *
     * @return {Array<TValue>} the copy of the array
     */
    public getArrayCopy(): Array<TValue> {
        return Array.from(this.#items);
    }

    /**
     * Get copy of the iterable array
     *
     * @return {IterableArray<TValue>} the copy of the iterable array
     */
    public clone(): IterableArray<TValue> {
        return new IterableArray(this.#items);
    }

    /**
     * @inheritDoc
     */
    public [Symbol.iterator](): Iterator<TValue> {
        return this.#items[Symbol.iterator]();
    }

    /**
     * Implement the forEach method
     *
     * @param {(value: TValue, index: number, array: TValue[]) => void} callback
     * @param {any} thisArg
     */
    public forEach(callback: (value: TValue, index: number, array: TValue[]) => void, thisArg?: any): void {
        this.#items.forEach(callback, thisArg);
    }

    /**
     * Implement the map method
     *
     * @param {(value: TValue, index: number, array: TValue[]) => U} callback
     * @param {any} thisArg
     */
    public map<U>(callback: (value: TValue, index: number, array: TValue[]) => U, thisArg?: any): U[] {
        return this.#items.map(callback, thisArg);
    }

    /**
     * Implement the filter method
     *
     * @param {(value: TValue, index: number, array: TValue[]) => boolean} callback
     * @param {any} thisArg
     */
    public filter(callback: (value: TValue, index: number, array: TValue[]) => boolean, thisArg?: any): TValue[] {
        return this.#items.filter(callback, thisArg);
    }

    /**
     * Implement the find method
     *
     * @param {(value: TValue, index: number, array: TValue[]) => boolean} callback
     * @param {TValue} initialValue
     */
    public reduce(callback: (previousValue: TValue, currentValue: TValue, currentIndex: number, array: TValue[]) => TValue, initialValue: TValue): TValue {
        return this.#items.reduce(callback, initialValue);
    }

    /**
     * Implement the find method
     *
     * @param {(value: TValue, index: number, array: TValue[]) => boolean} callback
     * @param {any} thisArg
     *
     * @return {TValue}
     */
    public find(callback: (value: TValue, index: number, array: TValue[]) => boolean, thisArg?: any): TValue {
        return this.#items.find(callback, thisArg) as TValue;
    }

    /**
     * Implement the every method
     *
     * @param {(value: TValue, index: number, array: TValue[]) => boolean} callback
     * @param {any} thisArg
     *
     * @return {boolean}
     */
    public some(callback: (value: TValue, index: number, array: TValue[]) => boolean, thisArg?: any): boolean {
        return this.#items.some(callback, thisArg);
    }

    /**
     * Implement the every method
     *
     * @param {(value: TValue, index: number, array: TValue[]) => boolean} callback
     * @param {any} thisArg
     *
     * @return {boolean}
     */
    public every(callback: (value: TValue, index: number, array: TValue[]) => boolean, thisArg?: any): boolean {
        return this.#items.every(callback, thisArg);
    }

    /**
     * Clear the array
     *
     * @return {void}
     */
    public clear(): void {
        this.#items = [];
        this.#current = 0;
    }
}
