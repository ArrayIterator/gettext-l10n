import GettextReferencesInterface from '../../Interfaces/Metadata/Attributes/GettextReferencesInterface';
import {
    is_bigint,
    is_numeric_integer,
    normalize_number
} from '../../../Utils/Helper';
import InvalidArgumentException from '../../../Exceptions/InvalidArgumentException';

/**
 * Reference storage class to handle references data
 */
export default class References implements GettextReferencesInterface {

    /**
     * Reference data
     *
     * @type {Map<string, number[]>}
     *
     * @protected
     */
    protected _references: Map<string, number[]> = new Map<string, number[]>();

    /**
     * @inheritDoc
     */
    public get all(): Record<string, number[]> {
        const object: Record<string, number[]> = {} as Record<string, number[]>;
        this.entries().forEach(([file, numbers]) => {
            object[file] = numbers;
        })
        return object;
    }

    /**
     * @inheritDoc
     */
    public add(file: string, line: number | undefined | null = undefined): void {
        if (line === null || line === undefined) {
            if (!this._references.has(file)) {
                this._references.set(file, []);
            }
            return;
        }
        if (!is_numeric_integer(line)) {
            throw new Error('Line number must be an integer.');
        }
        line = normalize_number(line) as number;
        if (is_bigint(line) || line < 1) {
            return; // ignore invalid line number
        }
        const reference: Array<number> = this._references.has(file)
            ? (this._references.get(file) || [])
            : [];
        reference.push(line);
        this._references.set(file, reference);
    }

    /**
     * @inheritDoc
     */
    public remove(file: string): void {
        this._references.delete(file);
    }

    /**
     * @inheritDoc
     */
    public has(file: string): boolean {
        return this._references.has(file);
    }

    /**
     * @inheritDoc
     */
    public entries(): MapIterator<[string, number[]]> {
        return this._references.entries();
    }

    /**
     * @inheritDoc
     */
    public mergeWith(references: References): References {
        if (!(references instanceof this.constructor)) {
            throw new InvalidArgumentException(
                `Invalid argument type. Expected object class of "${this.constructor.name}", but got ${typeof references}`
            );
        }
        let newReference = new References();
        for (const [file, lines] of this.entries()) {
            newReference.add(file, ...lines);
        }
        for (const [file, lines] of references.entries()) {
            newReference.add(file, ...lines);
        }
        return newReference;
    }

    /**
     * @inheritDoc
     */
    public forEach(callback: (value: [string, number[]], index: number, array: [string, number[]][]) => void): void {
        let index = 0;
        for (const [file, lines] of this.entries()) {
            callback([file, lines], index, Array.from(this.entries()));
            index++;
        }
    }

    /**
     * @inheritDoc
     */
    public [Symbol.iterator](): Iterator<[string, number[]]> {
        return this._references[Symbol.iterator]() as Iterator<[string, number[]]>;
    }

    /**
     * @inheritDoc
     */
    public get length(): number {
        return this._references.size as number;
    }

    /**
     * @inheritDoc
     */
    public clone(): GettextReferencesInterface {
        let ref: GettextReferencesInterface = new (this.constructor as any)();
        for (const [file, lines] of this.entries()) {
            ref.add(file, ...lines);
        }
        return ref;
    }
}
