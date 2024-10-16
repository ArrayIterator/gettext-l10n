import RuntimeException from '../../Exceptions/RuntimeException';
import {
    parseExpression,
    PLURAL_OPERATOR,
    PLURAL_VALUE,
    PLURAL_VAR,
    PluralExpressions
} from '../Utils/PluralParser';
import {
    is_bigint,
    is_integer,
    is_numeric,
    is_numeric_integer,
    is_string,
    normalize_number
} from '../../Utils/Helper';
import IndexOutOfRangeException from '../../Exceptions/IndexOutOfRangeException';
import InvalidArgumentException from '../../Exceptions/InvalidArgumentException';
import GettextPluralFormInterface from '../Interfaces/Metadata/GettextPluralFormInterface';
import {
    DEFAULT_PLURAL_COUNT,
    DEFAULT_PLURAL_EXPRESSION
} from '../Definitions/FormDefinitions';

/**
 * The plural form object definition
 */
export default class PluralForm implements GettextPluralFormInterface {

    /**
     * The plural count
     *
     * @private
     */
    private readonly _pluralCount: number;
    /**
     * The plural expression
     *
     * @private
     */
    private readonly _expression: string;

    /**
     * PluralForm constructor.
     *
     * @param {number} pluralCount the plural count, determine the number of plurals index
     * @param {string} expression the plural expression, plural form function to get the plural form index
     */
    public constructor(
        pluralCount: number = DEFAULT_PLURAL_COUNT,
        expression: string = DEFAULT_PLURAL_EXPRESSION
    ) {
        if (!is_numeric_integer(pluralCount)) {
            throw new InvalidArgumentException(`Plural count must be an integer, ${typeof pluralCount} given`);
        }
        if (!is_string(expression)) {
            throw new InvalidArgumentException(`Plural expression must be a string, ${typeof expression} given`);
        }

        this._pluralCount = is_integer(pluralCount) ? pluralCount : parseInt(pluralCount + '');
        this._expression = expression;
    }

    /**
     * The error of the expression
     *
     * @type {Error|undefined}
     * @private
     */
    private _error?: Error | null;

    /**
     * The tokens of the expression
     *
     * @type {PluralExpressions|null} null if the expression is invalid
     */
    private _tokens?: PluralExpressions | null = undefined;

    /**
     * @inheritDoc
     */
    public get error(): Error | null {
        // call the token first to parse the expression
        if (undefined === this._tokens) {
            this.tokens; // ignore the return value
        }
        return this._error || null;
    }

    /**
     * @inheritDoc
     */
    public get tokens(): PluralExpressions | null {
        if (this._tokens === undefined) {
            try {
                this._tokens = parseExpression(this.expression);
                this._error = null;
            } catch (e) {
                this._error = e as Error;
                this._tokens = null;
            }
        }
        // return copy of array to prevent modification
        return this._tokens ? this._tokens.slice() : this._tokens;
    }

    /**
     * @inheritDoc
     */
    public get expression(): string {
        return this._expression;
    }

    /**
     * @inheritDoc
     */
    public get pluralCount(): number {
        return this._pluralCount;
    }

    /**
     * @inheritDoc
     */
    public get valid(): boolean {
        return !!this.tokens;
    }

    /**
     * @inheritDoc
     */
    public get header(): string {
        return `nplurals=${this.pluralCount};plural=${this.expression};`
    }

    /**
     * @inheritDoc
     */
    public index(number: number): number {
        if (!is_numeric(number)) {
            throw new InvalidArgumentException(`Number must be a numeric value, ${typeof number} given`);
        }
        number = normalize_number(number) as number;
        const _is_bigint = is_bigint(number);
        let tokens = this.tokens;
        if (!tokens) {
            throw this.error;
        }
        let i: number = 0;
        let total: number = tokens.length;
        let stack: any[] = [];
        while (i < total) {
            let next = tokens[i];
            i++;
            const token = next[0];
            switch (token) {
                case PLURAL_VAR:
                    stack.push(number);
                    break;
                case PLURAL_VALUE:
                    let value = next[1];
                    if (!is_integer(value)) {
                        throw new RuntimeException(`Invalid value at position ${i}`);
                    }
                    stack.push(next[1]);
                    break;
                case PLURAL_OPERATOR:
                    let rightComparator = stack.pop();
                    let leftComparator = stack.pop();
                    let operator = next[1];
                    if (operator === undefined) {
                        throw new RuntimeException(`Missing operator at position ${i}`);
                    }
                    // make safe comparison
                    if (_is_bigint && operator !== '?:') {
                        rightComparator = BigInt(rightComparator);
                        leftComparator = BigInt(leftComparator);
                    }
                    switch (operator) {
                        case '?:':
                            let elvisComparator = stack.pop();
                            stack.push(elvisComparator ? leftComparator : rightComparator);
                            break;
                        case '%':
                            stack.push(leftComparator % rightComparator);
                            break;
                        case '||':
                            stack.push(leftComparator || rightComparator);
                            break;
                        case '&&':
                            stack.push(leftComparator && rightComparator);
                            break;
                        case '<':
                            stack.push(leftComparator < rightComparator);
                            break;
                        case '<=':
                            stack.push(leftComparator <= rightComparator);
                            break;
                        case '>':
                            stack.push(leftComparator > rightComparator);
                            break;
                        case '>=':
                            stack.push(leftComparator >= rightComparator);
                            break;
                        case '!=':
                            stack.push(leftComparator !== rightComparator);
                            break;
                        case '==':
                            stack.push(leftComparator === rightComparator);
                            break;
                        default:
                            throw new RuntimeException(`Unknown operator "${operator}"`);
                    }
                    break;
                default:
                    throw new RuntimeException(`Unknown token type: "${token}"`);
            }
        }

        const index: number = normalize_number(stack[0]) as number;
        // dont allow bigint index
        if (is_bigint(index)) {
            throw new RuntimeException(`Invalid index value, expected integer, ${typeof index} encountered`);
        }
        if (index < 0 || index >= this.pluralCount) {
            throw new IndexOutOfRangeException(index, this.pluralCount);
        }
        return index;
    }

    /**
     * Get the string representation of the object
     * returning header
     *
     * @return {string} the header
     * @see header
     */
    public toString(): string {
        return this.header;
    }

    /**
     * @inheritDoc
     */
    public clone(): GettextPluralFormInterface {
        return new (this.constructor as any)(this.pluralCount, this.expression);
    }
}

export const DefaultPluralForm : PluralForm = new PluralForm(
    DEFAULT_PLURAL_COUNT,
    DEFAULT_PLURAL_EXPRESSION
);
