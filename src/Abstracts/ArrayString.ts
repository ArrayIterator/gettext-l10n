import ArrayStringInterface from '../Interfaces/ArrayStringInterface';
import {is_string} from '../Utils/Helper';
import InvalidArgumentException from '../Exceptions/InvalidArgumentException';

/**
 * Abstract ArrayString class to handle array of string
 */
export default abstract class ArrayString implements ArrayStringInterface {

    /**
     * List of string data
     *
     * @private
     */
    private _strings: Array<string> = [];

    /**
     * constructor.
     */
    public constructor(...string: string[]) {
        for (const str of string) {
            if (!is_string(str)) {
                throw new InvalidArgumentException(
                    `The content must be a string, ${typeof str} given`
                )
            }
            this.add(str);
        }
    }

    /**
     * @inheritDoc
     */
    public get unique(): boolean {
        return false;
    }

    /**
     * @inheritDoc
     */
    public add(string: string): void {
        if (!this.unique || this.has(string)) {
            this._strings.push(string);
        }
    }

    /**
     * @inheritDoc
     */
    public remove(string: string): void {
        this._strings = this._strings.filter(f => f !== string);
    }

    /**
     * @inheritDoc
     */
    public has(string: string): boolean {
        return this._strings.includes(string);
    }

    /**
     * @inheritDoc
     */
    public entries(): IteratorObject<[number, string]> {
        return this._strings.entries();
    }

    /**
     * @inheritDoc
     */
    public mergeWith(instance: ArrayString): ArrayString {
        if (!(instance instanceof this.constructor)) {
            throw new InvalidArgumentException(
                `Invalid argument type. Expected object class of "${this.constructor.name}", but got ${typeof instance}`
            );
        }
        let newObject = new (this.constructor as any)(...this.all);
        for (const string of instance) {
            newObject.add(string);
        }
        return newObject;
    }

    /**
     * @inheritDoc
     */
    public forEach(callback: (value: string, index: number, array: Array<string>) => void) : void {
        this._strings.forEach(callback);
    }

    /**
     * @inheritDoc
     */
    public [Symbol.iterator](): Iterator<string> {
        return this._strings[Symbol.iterator]();
    }

    /**
     * @inheritDoc
     */
    public get all(): Array<string> {
        return this._strings.slice();
    }

    /**
     * @inheritDoc
     */
    public get length(): number {
        return this.all.length;
    }
}
