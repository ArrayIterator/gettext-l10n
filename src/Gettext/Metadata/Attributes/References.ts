import GettextReferencesInterface from '../../Interfaces/Metadata/Attributes/GettextReferencesInterface';
import {
    is_bigint,
    is_numeric_integer,
    normalize_number
} from '../../../Utils/Helper';
import {PositiveInteger} from '../../../Utils/Type';
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
    protected _references: Map<string, PositiveInteger[]> = new Map<string, PositiveInteger[]>();

    /**
     * @inheritDoc
     */
    public get all(): Record<string, PositiveInteger[]> {
        const object: Record<string, PositiveInteger[]> = {} as Record<string, PositiveInteger[]>;
        this.entries().forEach(([file, numbers]) => {
            object[file] = numbers;
        })
        return object;
    }

    /**
     * @inheritDoc
     */
    public add(file: string, line: PositiveInteger | undefined | null = undefined): void {
        if (line === null || line === undefined) {
            if (!this._references.has(file)) {
                this._references.set(file, []);
            }
            return;
        }
        if (!is_numeric_integer(line)) {
            throw new Error('Line number must be an integer.');
        }
        line = normalize_number(line) as PositiveInteger;
        if (is_bigint(line) || line < 1) {
            return; // ignore invalid line number
        }
        const reference: Array<PositiveInteger> = this._references.has(file)
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
    public entries(): MapIterator<[string, PositiveInteger[]]> {
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
    public [Symbol.iterator](): Iterator<[string, PositiveInteger[]]> {
        return this._references[Symbol.iterator]() as Iterator<[string, PositiveInteger[]]>;
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
