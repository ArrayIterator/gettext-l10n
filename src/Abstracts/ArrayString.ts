import ArrayStringInterface from "../Interfaces/ArrayStringInterface";
import {ArrayPositiveInteger} from "../Utils/Type";

export default abstract class ArrayString implements ArrayStringInterface {

    /**
     * List of string data
     *
     * @private
     */
    private _strings: ArrayPositiveInteger<string> = [];

    /**
     * constructor.
     */
    public constructor(...string: string[]) {
        for (const str of string) {
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
        this._strings = this._strings.filter(f => f !== string) as ArrayPositiveInteger<string>;
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
            throw new Error(
                `Invalid argument type. Expected object class of "${this.constructor.name}", but got ${typeof instance}`
            );
        }
        let newObject = new (this.constructor as any)(...this.all);
        for (const string of instance) {
            this.add(string);
        }
        return newObject;
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
