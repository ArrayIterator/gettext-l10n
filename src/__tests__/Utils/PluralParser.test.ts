import Locales from '../../Utils/locales.json';
import {
    parseExpression,
    parsePluralForm,
    PLURAL_VALUE,
    PLURAL_VAR
} from '../../Gettext/Utils/PluralParser';
import InvalidArgumentException from '../../Exceptions/InvalidArgumentException';
import RuntimeException from '../../Exceptions/RuntimeException';

describe('parsePluralForm', () => {
    /**
     * Test to check if parsePluralForm throws an error for non-string input.
     */
    test('should throw an error for non-string input', () => {
        expect(() => parsePluralForm(123 as any)).toThrow(InvalidArgumentException);
        expect(() => parsePluralForm(null as any)).toThrow(InvalidArgumentException);
        expect(() => parsePluralForm(undefined as any)).toThrow(InvalidArgumentException);
        expect(() => parsePluralForm({} as any)).toThrow(InvalidArgumentException);
        expect(() => parsePluralForm([] as any)).toThrow(InvalidArgumentException);
    });

    /**
     * Test to check if parsePluralForm returns null for invalid plural strings.
     */
    test('should return null for invalid plural strings', () => {
        expect(parsePluralForm('')).toBeNull();
        expect(parsePluralForm('.invalid')).toBeNull();
        expect(parsePluralForm('a')).toBeNull();
        expect(parsePluralForm('thisisaverylongpluralname')).toBeNull();
    });

    /**
     * Test to check if parsePluralForm returns the correct parsed plural for valid plural strings.
     */
    test('should return the correct parsed plural for valid plural strings', () => {
        expect(parsePluralForm('nplurals=2;plural=n != 1')).toEqual({
            count: 2,
            expression: 'n != 1'
        });
        expect(parsePluralForm('nplurals=2;plural=n == 1 ? 0 : 1')).toEqual({
            count: 2,
            expression: 'n == 1 ? 0 : 1'
        });
        // test all locales
        for (let id in Locales) {
            const {
                count, expression 
            } = Locales[id as keyof typeof Locales];
            // plural form should: nplurals=n; plural=form;
            expect(parsePluralForm(`${count} ${expression}`)).toBeNull(); // invalid to be null
            expect(parsePluralForm(`nplurals=${count};plural=${expression}`)).toEqual({
                count,
                expression
            });
        }
    });

    /**
     * Test to check if parsePluralForm returns null for non-existent plural strings.
     */
    test('should return null for non-existent plural strings', () => {
        expect(parsePluralForm('nonexistent')).toBeNull();
    });
});

describe('parseExpression', () => {
    /**
     * Test to check if parseExpression throws an error for non-string input.
     */
    test('should throw an error for non-string input', () => {
        expect(() => parseExpression(123 as any)).toThrow(InvalidArgumentException);
        expect(() => parseExpression(null as any)).toThrow(InvalidArgumentException);
        expect(() => parseExpression(undefined as any)).toThrow(InvalidArgumentException);
        expect(() => parseExpression({} as any)).toThrow(InvalidArgumentException);
        expect(() => parseExpression([] as any)).toThrow(InvalidArgumentException);
        expect(() => parseExpression('')).toThrow(InvalidArgumentException);
    });

    /**
     * Test to check if parseExpression does not throw an error for valid plural expressions.
     */
    test('should not throw an error for valid plural expressions', () => {
        expect(() => parseExpression('nplurals=2;plural=n != 1')).not.toThrow();
        expect(() => parseExpression('nplurals=2;plural=n == 1')).not.toThrow();
        expect(parseExpression('nplurals=2;plural=n != 1')).toEqual([
            [PLURAL_VAR], // n = variable
            [PLURAL_VALUE, 1] // 1 = value
        ]);
        expect(parseExpression('nplurals=2;plural=n == 1')).toEqual([
            [PLURAL_VAR], // n = variable
            [PLURAL_VALUE, 1] // 1 = value
        ]);
        expect(parseExpression('nplurals=2;plural=n 1 2')).toEqual([
            [PLURAL_VAR], // n = variable
            [PLURAL_VALUE, 1], // 1 = value
            [PLURAL_VALUE, 2] // 2 = value
        ]);
    });

    /**
     * Test to check if parseExpression throws an error for invalid plural expressions.
     */
    test('should throw an error for invalid plural expressions', () => {
        // RuntimeException as it is a runtime error
        expect(() => parseExpression('nplurals=2;plural=n = 1')).toThrow(RuntimeException);
        expect(() => parseExpression('nplurals=2;plural=n ! 1')).toThrow(RuntimeException);
        expect(() => parseExpression('nplurals=2;plural=n = 1 2 3 4')).toThrow(RuntimeException);
        expect(() => parseExpression('nplurals=2;plural=n = 1 2 3 4 5')).toThrow(RuntimeException);
    });
});
