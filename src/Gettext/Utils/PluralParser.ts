import RuntimeException from '../../Exceptions/RuntimeException';
import {
    is_string,
    strspn,
    substr
} from '../../Utils/Helper';
import InvalidArgumentException from '../../Exceptions/InvalidArgumentException';
import {PLURAL_HEADER_REGEX} from '../Definitions/FormDefinitions';

export type PluralExpressions = Array<[typeof PLURAL_VAR] | [typeof PLURAL_OPERATOR, string] | [typeof PLURAL_VALUE, number]>;

/**
 * The plural operator
 */
export const PLURAL_OPERATOR = 1;

/**
 * Plural value
 */
export const PLURAL_VALUE = 2;

/**
 * Plural var
 */
export const PLURAL_VAR = 3;

/**
 * Operation characters
 */
export const OP_CHARS = '|&><!=%?:';

/**
 * Numeric characters
 */
export const NUMERIC_CHARS = '0123456789';

/**
 * Operator Precedences
 */
export const OP_PRECEDENCE = {
    '%': 6, // module operator
    '<': 5, // less than
    '<=': 5, // less or equal
    '>': 5, // greater than
    '>=': 5, // greater or equal
    '==': 4, // equal
    '!=': 4, // no equal
    '&&': 3, // and
    '||': 2, // or
    '?:': 1, // exist neither then
    '?': 1, // if
    '(': 0, // wrap
    ')': 0 // end wrap
};
Object.freeze(OP_PRECEDENCE);

/**
 * Parse the plural form
 *
 * @param {string} pluralForm
 *
 * @returns {{count: number, expression: string} | null}
 * @throws {InvalidArgumentException} If the plural form is not a string
 */
export const parsePluralForm = (pluralForm: string): {
    count: number;
    expression: string
} | null => {
    if (!is_string(pluralForm)) {
        throw new InvalidArgumentException(
            `Plural form must be a string, ${typeof pluralForm} given`
        );
    }
    const match: RegExpMatchArray | null = pluralForm.match(PLURAL_HEADER_REGEX);
    if (match === null) {
        return null;
    }
    let [_, count, form] = match;
    return {
        count: parseInt(count),
        expression: form.trim()
    }
}

/**
 * Parse the expression
 *
 * @param {string} pluralExpression
 * @return {PluralExpressions} The parsed expression
 * @throws {InvalidArgumentException} If the expression is empty
 */
export const parseExpression = (pluralExpression: string): PluralExpressions => {
    let expression = parsePluralForm(pluralExpression)?.expression ?? pluralExpression.trim();
    if (expression === '') {
        throw new InvalidArgumentException('Empty expression');
    }
    let pos: number = 0;
    const len: number = expression.length;
    // Convert infix operators to postfix using the shunting-yard algorithm.
    const output: PluralExpressions = [];
    const stacks: Array<number | string> = [];
    let found: boolean;
    while (pos < len) {
        let next = substr(expression, pos, 1);
        switch (next) {
            // Ignore whitespace.
            case ' ':
            case '\t':
                ++pos;
                break;
            // Variable (n).
            case 'n':
                output.push([PLURAL_VAR]);
                ++pos;
                break;
            // Parentheses.
            case '(':
                stacks.push(next);
                ++pos;
                break;
            case ')':
                found = false;
                while (stacks.length > 0) {
                    let stack = stacks.pop();
                    if ('(' !== stack) {
                        output.push([PLURAL_OPERATOR, stack as string]);
                        continue;
                    }
                    // Discard open parent.
                    found = true;
                    break;
                }

                if (!found) {
                    throw new RuntimeException('Mismatched parentheses');
                }

                ++pos;
                break;
            // Operators.
            case '|':
            case '&':
            case '>':
            case '<':
            case '!':
            case '=':
            case '%':
            case '?':
                let end_operator = strspn(expression, OP_CHARS, pos);
                let operator = substr(expression, pos, end_operator) as keyof typeof OP_PRECEDENCE;
                if (!OP_PRECEDENCE.hasOwnProperty(operator)) {
                    throw new RuntimeException(`Unknown operator "${operator}"`);
                }
                while (stacks.length > 0) {
                    let o2 = stacks[stacks.length - 1] as keyof typeof OP_PRECEDENCE;
                    if ('?' === operator || '?:' === operator) {
                        if (OP_PRECEDENCE[operator] >= OP_PRECEDENCE[o2]) {
                            break;
                        }
                    } else if (OP_PRECEDENCE[operator] > OP_PRECEDENCE[o2]) {
                        break;
                    }
                    output.push([PLURAL_OPERATOR, stacks.pop() as string]);
                }
                stacks.push(operator);
                pos += end_operator;
                break;
            // Ternary "else".
            case ':':
                found = false;
                let s_pos = stacks.length - 1;
                while (s_pos >= 0) {
                    let o2 = stacks[s_pos];
                    if ('?' !== o2) {
                        output.push([PLURAL_OPERATOR, stacks.pop() as string]);
                        --s_pos;
                        continue;
                    }
                    // Replace.
                    stacks[s_pos] = '?:';
                    found = true;
                    break;
                }
                if (!found) {
                    throw new RuntimeException('Missing starting "?" ternary operator');
                }
                ++pos;
                break;
            // Default - number or invalid.
            default:
                let nextInt = parseInt(next);
                if (nextInt >= 0 && nextInt <= 9) {
                    let span = strspn(expression, NUMERIC_CHARS, pos);
                    output.push([PLURAL_VALUE, parseInt(expression.substring(pos, span + pos))]);
                    pos += span;
                    break;
                }
                throw new RuntimeException(`Unknown symbol "${next}"`);
        }
    }

    return output;
}
