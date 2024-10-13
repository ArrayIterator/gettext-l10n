import IndexOutOfRangeException from '../../Exceptions/IndexOutOfRangeException';
import L10nException from '../../Exceptions/L10nException';

describe('IndexOutOfRangeException', () => {
    /**
     * Test to check if an instance of IndexOutOfRangeException is created with the correct message, name,
     * index, and length, and if it is an instance of L10nException.
     */
    test('should create an instance of IndexOutOfRangeException with the correct message', () => {
        const index = 5;
        const length = 3;
        const exception = new IndexOutOfRangeException(index, length);

        expect(exception).toBeInstanceOf(IndexOutOfRangeException);
        expect(exception).toBeInstanceOf(L10nException);
        expect(exception.message).toBe(`Index out of range. Index: ${index}, length: ${length}`);
        expect(exception.name).toBe('IndexOutOfRangeException');
        expect(exception.index).toBe(index);
        expect(exception.length).toBe(length);
    });

    /**
     * Test to check if an instance of IndexOutOfRangeException is created with undefined values for invalid
     * index and length, and if it is an instance of L10nException.
     */
    test('should create an instance of IndexOutOfRangeException with undefined for invalid index and length', () => {
        const invalidIndex = -1;
        const invalidLength = -1;
        const exception = new IndexOutOfRangeException(invalidIndex, invalidLength);

        expect(exception).toBeInstanceOf(IndexOutOfRangeException);
        expect(exception).toBeInstanceOf(L10nException);
        expect(exception.message).toBe(`Index out of range. Index: ${invalidIndex}, length: ${invalidLength}`);
        expect(exception.name).toBe('IndexOutOfRangeException');
        expect(exception.index).toBeUndefined();
        expect(exception.length).toBeUndefined();
    });

    /**
     * Test to verify that the exception is thrown with the correct message and is an instance of both
     * IndexOutOfRangeException and L10nException.
     */
    test('should throw IndexOutOfRangeException with the correct message', () => {
        const index = 5;
        const length = 3;

        /**
         * Function that throws IndexOutOfRangeException
         * @throws {IndexOutOfRangeException}
         */
        const throwError = (): void => {
            throw new IndexOutOfRangeException(index, length);
        };

        expect(throwError).toThrow(IndexOutOfRangeException);
        expect(throwError).toThrow(L10nException);
        expect(throwError).toThrow(`Index out of range. Index: ${index}, length: ${length}`);
    });
});
