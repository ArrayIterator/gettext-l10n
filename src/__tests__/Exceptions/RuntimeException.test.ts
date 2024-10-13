import RuntimeException from '../../Exceptions/RuntimeException';
import L10nException from '../../Exceptions/L10nException';

describe('RuntimeException', () => {
    /**
     * Test to check if an instance of RuntimeException is created with the correct message and name,
     * and if it is an instance of L10nException.
     */
    test('should create an instance of RuntimeException with the correct message', () => {
        const message = 'Runtime error occurred';
        const exception = new RuntimeException(message);

        expect(exception).toBeInstanceOf(RuntimeException);
        expect(exception).toBeInstanceOf(L10nException);
        expect(exception.message).toBe(message);
        expect(exception.name).toBe('RuntimeException');
    });

    /**
     * Test to verify that the exception is thrown with the correct message and is an instance of both
     * RuntimeException and L10nException.
     */
    test('should throw RuntimeException with the correct message', () => {
        const message = 'Runtime error occurred';

        /**
         * Function that throws RuntimeException
         * @returns {void}
         */
        const throwError = (): void => {
            throw new RuntimeException(message);
        };

        expect(throwError).toThrow(RuntimeException);
        expect(throwError).toThrow(L10nException);
        expect(throwError).toThrow(message);
    });

    /**
     * Test to check if RuntimeException captures stack trace.
     */
    test('should capture stack trace', () => {
        const exception = new RuntimeException('Runtime error occurred');
        expect(exception.stack).toContain('RuntimeException: Runtime error occurred');
    });
});
