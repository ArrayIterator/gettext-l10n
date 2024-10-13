import {
    normalizeHeaderName,
    normalizeHeaderValue,
    strspn,
    substr,
    is_bigint,
    is_bigint_number,
    is_numeric,
    is_number,
    is_numeric_integer,
    is_integer,
    is_string,
    is_scalar,
    normalize_number,
    is_undefined,
    is_object,
    string_scalar_value,
    is_array_buffer_like_or_view,
    deep_freeze
} from '../../Utils/Helper';

describe('Helper functions', () => {
    describe('normalizeHeaderName', () => {
        /**
         * Test to check if header names are normalized correctly.
         */
        test('should normalize header names correctly', () => {
            expect(normalizeHeaderName(' content-type ')).toBe('Content-Type');
            expect(normalizeHeaderName('X-Custom-Header')).toBe('X-Custom-Header');
            expect(normalizeHeaderName('x-a-heAder')).toBe('X-A-Header');
            expect(normalizeHeaderName('mime-type')).toBe('MIME-Type'); // mime is a common abbreviation
            expect(normalizeHeaderName('')).toBe('');
            expect(normalizeHeaderName(123 as any)).toBe('');
        });
    });

    describe('normalizeHeaderValue', () => {
        /**
         * Test to check if header values are normalized correctly.
         */
        test('should normalize header values correctly', () => {
            expect(normalizeHeaderValue('value\twith\tspecial\r\ncharacters')).toBe('value with special characters');
            expect(normalizeHeaderValue('')).toBe('');
            expect(normalizeHeaderValue(123)).toBe('123');
        });
    });

    describe('strspn', () => {
        /**
         * Test to check if the length of the initial segment containing only characters from the mask is returned correctly.
         */
        test('should return the length of the initial segment containing only characters from the mask', () => {
            expect(strspn('123abc', '123')).toBe(3);
            expect(strspn('abc123', 'abc')).toBe(3);
            expect(strspn('abc123', 'xyz')).toBe(0);
        });
    });

    describe('substr', () => {
        /**
         * Test to check if the correct substring is returned.
         */
        test('should return the correct substring', () => {
            expect(substr('abcdef', 2, 3)).toBe('cde');
            expect(substr('abcdef', -2)).toBe('ef');
            expect(substr('abcdef', 2)).toBe('cdef');
            expect(substr('abcdef', 2, -1)).toBe('cde');
        });
    });

    describe('is_bigint', () => {
        /**
         * Test to check if bigints are correctly identified.
         */
        test('should correctly identify bigints', () => {
            expect(is_bigint(BigInt(123))).toBe(true);
            expect(is_bigint(123)).toBe(false);
        });
    });

    describe('is_bigint_number', () => {
        /**
         * Test to check if bigints and big numbers are correctly identified.
         */
        test('should correctly identify bigints and big numbers', () => {
            expect(is_bigint_number(BigInt(123))).toBe(true);
            expect(is_bigint_number(Number.MAX_SAFE_INTEGER + 1)).toBe(true);
            expect(is_bigint_number(123)).toBe(false);
        });
    });

    describe('is_numeric', () => {
        /**
         * Test to check if numeric values are correctly identified.
         */
        test('should correctly identify numeric values', () => {
            expect(is_numeric(123)).toBe(true);
            expect(is_numeric('123')).toBe(true);
            expect(is_numeric('123.45')).toBe(true);
            expect(is_numeric('abc')).toBe(false);
        });
    });

    describe('is_number', () => {
        /**
         * Test to check if numbers are correctly identified.
         */
        test('should correctly identify numbers', () => {
            expect(is_number(123)).toBe(true);
            expect(is_number('123')).toBe(false);
        });
    });

    describe('is_numeric_integer', () => {
        /**
         * Test to check if numeric integers are correctly identified.
         */
        test('should correctly identify numeric integers', () => {
            expect(is_numeric_integer(123)).toBe(true);
            expect(is_numeric_integer('123')).toBe(true);
            expect(is_numeric_integer('123.45')).toBe(false);
        });
    });

    describe('is_integer', () => {
        /**
         * Test to check if integers are correctly identified.
         */
        test('should correctly identify integers', () => {
            expect(is_integer(123)).toBe(true);
            expect(is_integer(123.45)).toBe(false);
        });
    });

    describe('is_string', () => {
        /**
         * Test to check if strings are correctly identified.
         */
        test('should correctly identify strings', () => {
            expect(is_string('abc')).toBe(true);
            expect(is_string(123)).toBe(false);
        });
    });

    describe('is_scalar', () => {
        /**
         * Test to check if scalar values are correctly identified.
         */
        test('should correctly identify scalar values', () => {
            expect(is_scalar('abc')).toBe(true);
            expect(is_scalar(123)).toBe(true);
            expect(is_scalar(true)).toBe(true);
            expect(is_scalar({})).toBe(false);
        });
    });

    describe('normalize_number', () => {
        /**
         * Test to check if numbers are normalized correctly.
         */
        test('should normalize numbers correctly', () => {
            expect(normalize_number('123')).toBe(123);
            expect(normalize_number(BigInt(123))).toBe(123);
            expect(normalize_number('abc')).toBe(0);
        });
    });

    describe('is_undefined', () => {
        /**
         * Test to check if undefined values are correctly identified.
         */
        test('should correctly identify undefined values', () => {
            expect(is_undefined(undefined)).toBe(true);
            expect(is_undefined(null)).toBe(false);
        });
    });

    describe('is_object', () => {
        /**
         * Test to check if objects are correctly identified.
         */
        test('should correctly identify objects', () => {
            expect(is_object({})).toBe(true);
            expect(is_object(null)).toBe(false);
        });
    });

    describe('string_scalar_value', () => {
        /**
         * Test to check if scalar values are converted to strings correctly.
         */
        test('should convert scalar values to strings correctly', () => {
            expect(string_scalar_value('abc')).toBe('abc');
            expect(string_scalar_value(123)).toBe('123');
            expect(string_scalar_value(true)).toBe('1');
            expect(string_scalar_value(false)).toBe('0');
        });
    });

    describe('is_array_buffer_like_or_view', () => {
        /**
         * Test to check if ArrayBuffer is correctly identified.
         */
        test('should return true for ArrayBuffer', () => {
            const buffer = new ArrayBuffer(8);
            expect(is_array_buffer_like_or_view(buffer)).toBe(true);
        });

        /**
         * Test to check if SharedArrayBuffer is correctly identified.
         */
        test('should return true for SharedArrayBuffer', () => {
            const buffer = new SharedArrayBuffer(8);
            expect(is_array_buffer_like_or_view(buffer)).toBe(true);
        });

        /**
         * Test to check if ArrayBuffer view is correctly identified.
         */
        test('should return true for ArrayBuffer view', () => {
            const buffer = new Uint8Array(8);
            expect(is_array_buffer_like_or_view(buffer)).toBe(true);
        });

        /**
         * Test to check if non-ArrayBuffer values are correctly identified.
         */
        test('should return false for non-ArrayBuffer values', () => {
            expect(is_array_buffer_like_or_view(42)).toBe(false);
            expect(is_array_buffer_like_or_view('string')).toBe(false);
            expect(is_array_buffer_like_or_view({})).toBe(false);
        });
    });

    describe('deep_freeze', () => {
        /**
         * Test to check if an object is deeply frozen.
         */
        test('should deeply freeze an object', () => {
            const obj = {
                a: 1, b: {
                    c: 2
                }
            };
            const frozenObj = deep_freeze(obj);

            expect(Object.isFrozen(frozenObj)).toBe(true);
            expect(Object.isFrozen(frozenObj.b)).toBe(true);

            // Ensure properties cannot be modified
            expect(() => { frozenObj.a = 2 }).toThrow();
            expect(() => { frozenObj.b.c = 3 }).toThrow();
        });

        /**
         * Test to check if non-object values are returned as is.
         */
        test('should return non-object values as is', () => {
            expect(deep_freeze(42)).toBe(42);
            expect(deep_freeze('string')).toBe('string');
        });
    });
});
