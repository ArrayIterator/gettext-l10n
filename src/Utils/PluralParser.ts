import RuntimeException from "../Exceptions/RuntimeException";
import {is_string, strspn} from "./Helper";
import InvalidArgumentException from "../Exceptions/InvalidArgumentException";
import {PLURAL_HEADER_REGEX} from "./GettextDefinitions/Form";

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
    while (pos < len) {
        let next = expression[pos] || '';
        switch (next) {
            // Ignore whitespace.
            case ' ':
            case "\t":
                pos++;
                break;
            // Variable (n).
            case 'n':
                output.push([PLURAL_VAR]);
                pos++;
                break;
            // Parentheses.
            case '(':
                stacks.push(next);
                pos++;
                break;
            case ')':
                let found_parent: boolean = false;
                while (stacks.length > 0) {
                    let stack = stacks[stacks.length - 1];
                    if ('(' !== stack) {
                        let val = stacks.pop();
                        if (!is_string(val)) {
                            throw new RuntimeException('Mismatched parentheses');
                        }
                        output.push([PLURAL_OPERATOR, val]);
                        continue;
                    }

                    // Discard open paren.
                    stacks.pop();
                    found_parent = true;
                    break;
                }
                if (!found_parent) {
                    throw new RuntimeException('Mismatched parentheses');
                }
                pos++;
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
                let operator = expression.substring(pos, end_operator);
                if (!OP_PRECEDENCE.hasOwnProperty(operator)) {
                    throw new RuntimeException(
                        `Unknown operator "${operator}"`
                    );
                }
                let isAssociative = '?:' === operator || '?' === operator;
                while (stacks.length > 0) {
                    let stack = stacks[stacks.length - 1];
                    let precedenceOp = OP_PRECEDENCE[operator as keyof typeof OP_PRECEDENCE];
                    let precedenceStack = OP_PRECEDENCE[stack as keyof typeof OP_PRECEDENCE];
                    // Ternary is right-associative in C.
                    if ((isAssociative && precedenceOp >= precedenceStack)
                        || (!isAssociative && precedenceOp > precedenceStack)
                    ) {
                        break;
                    }
                    let val = stacks.pop();
                    if (!is_string(val)) {
                        throw new RuntimeException(
                            'Mismatched parentheses'
                        );
                    }
                    output.push([PLURAL_OPERATOR, val]);
                }

                stacks.push(operator);
                pos += end_operator;
                break;
            // Ternary "else".
            case ':':
                let found = false;
                let s_pos: number = stacks.length - 1;
                while (s_pos >= 0) {
                    let stack = stacks[s_pos];
                    if ('?' !== stack) {
                        let val = stacks.pop();
                        if (!is_string(val)) {
                            throw new RuntimeException(
                                'Mismatched parentheses'
                            );
                        }
                        output.push([PLURAL_OPERATOR, val]);
                        s_pos--;
                        continue;
                    }

                    // Replace.
                    stacks[s_pos] = '?:';
                    found = true;
                    break;
                }

                if (!found) {
                    throw new RuntimeException(
                        'Missing starting "?" ternary operator'
                    );
                }
                pos++;
                break;
            // Default - number or invalid.
            default:
                let nextInt = parseInt(next + '');
                if (nextInt >= 0 && nextInt <= 9) {
                    let span = strspn(expression, NUMERIC_CHARS, pos);
                    output.push([PLURAL_VALUE, parseInt(expression.substring(pos, span))]);
                    pos += span;
                    break;
                }
                throw new RuntimeException(
                    `Unknown symbol "${next}"`
                );
        }
    }

    while (stacks.length > 0) {
        let stack = stacks.pop();
        if ('(' === stack || ')' === stack) {
            throw new RuntimeException(
                'Mismatched parentheses'
            );
        }
        if (!is_string(stack)) {
            throw new RuntimeException(
                'Mismatched parentheses'
            );
        }
        output.push([PLURAL_OPERATOR, stack]);
    }

    return output;
}

