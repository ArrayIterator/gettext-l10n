// noinspection JSUnusedGlobalSymbols

import {NegativeInteger, PositiveInteger} from "./Type";

/**
 * @template TValue
 * @template U
 * @param {any} TValue
 * @param {any} U
 */
export default class IterableArray<TValue extends any> {

    /**
     * Items
     *
     * @protected
     */
    protected items: Array<TValue> = [];

    /**
     * Current index
     *
     * @protected
     */
    protected _current: PositiveInteger | NegativeInteger = 0;

    /**
     * Constructor
     * @param {Array<TValue>} items the items
     */
    constructor(items: Array<TValue>) {
        this.items = Array.from(items);
    }

    /**
     * Get length of the array
     *
     * @return {number} the length of the array
     */
    get length(): number {
        return this.items.length;
    }

    /**
     * Check if the current index is valid
     *
     * @return {boolean} true if the current index is valid, false otherwise
     */
    public valid(): boolean {
        return this._current >= 0 && this._current < this.length;
    }

    /**
     * Get the current item
     *
     * @return {false | TValue} the current item or false if the current index is invalid
     */
    public current(): false | TValue {
        if (!this.valid) {
            return false;
        }
        return this.items[this._current];
    }

    /**
     * Get the first item and point to it
     *
     * @return {false | TValue} the first item or false if the array is empty
     */
    public reset(): false | TValue {
        this._current = 0;
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
        this._current = this.length - 1 as PositiveInteger;
        return this.current();
    }

    /**
     * Get the key of the current item
     *
     * @return {PositiveInteger | false} the key of the current item or false if the current index is invalid
     */
    public key(): PositiveInteger | false {
        if (this.valid()) {
            return this._current;
        }
        return this._current;
    }

    /**
     * Get the previous item and point to it
     *
     * @return {false | TValue} the next item or false if the current index is invalid
     */
    public prev(): TValue | false {
        if (this._current >= 0) {
            this._current--;
        }
        return this.current();
    }

    /**
     * Get the next item and point to it
     *
     * @return {false | TValue} the next item or false if the current index is invalid
     */
    public next(): TValue | false {
        if (this._current < this.length) {
            this._current++;
        }
        return this.current();
    }

    /**
     * Seek to a specific index
     *
     * @param {PositiveInteger} index
     */
    public seek(index: PositiveInteger): TValue | false {
        this._current = index;
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
        return Array.from(this.items);
    }

    /**
     * Get copy of the iterable array
     *
     * @return {IterableArray<TValue>} the copy of the iterable array
     */
    public clone(): IterableArray<TValue> {
        return new IterableArray(this.items);
    }

    /**
     * @inheritDoc
     */
    public [Symbol.iterator](): Iterator<TValue> {
        return this.items[Symbol.iterator]();
    }

    /**
     * Implement the forEach method
     *
     * @param {(value: TValue, index: number, array: TValue[]) => void} callback
     * @param {any} thisArg
     */
    public forEach(callback: (value: TValue, index: number, array: TValue[]) => void, thisArg?: any): void {
        this.items.forEach(callback, thisArg);
    }

    /**
     * Implement the map method
     *
     * @param {(value: TValue, index: number, array: TValue[]) => U} callback
     * @param {any} thisArg
     */
    public map<U>(callback: (value: TValue, index: number, array: TValue[]) => U, thisArg?: any): U[] {
        return this.items.map(callback, thisArg);
    }

    /**
     * Implement the filter method
     *
     * @param {(value: TValue, index: number, array: TValue[]) => boolean} callback
     * @param {any} thisArg
     */
    public filter(callback: (value: TValue, index: number, array: TValue[]) => boolean, thisArg?: any): TValue[] {
        return this.items.filter(callback, thisArg);
    }

    /**
     * Clear the array
     *
     * @return {void}
     */
    public clear(): void {
        this.items = [];
        this._current = 0;
    }
}
