import InvalidArgumentException from '../../Exceptions/InvalidArgumentException';
import L10nException from '../../Exceptions/L10nException';

describe('InvalidArgumentException', (): void => {
    /**
     * Test to check if an instance of InvalidArgumentException is created with the correct message and name,
     * and if it is an instance of L10nException.
     */
    test('should create an instance of InvalidArgumentException with the correct message', (): void => {
        const message = 'Invalid argument';
        const exception = new InvalidArgumentException(message);

        expect(exception).toBeInstanceOf(InvalidArgumentException);
        expect(exception).toBeInstanceOf(L10nException);
        expect(exception.message).toBe(message);
        expect(exception.name).toBe('InvalidArgumentException');
    });

    /**
     * Test to verify that the exception is thrown with the correct message and is an instance of both
     * InvalidArgumentException and L10nException.
     */
    test('should throw InvalidArgumentException with the correct message', (): void => {
        const message = 'Invalid argument';

        /**
         * Function that throws InvalidArgumentException
         * @returns {void}
         */
        const throwError = (): void => {
            throw new InvalidArgumentException(message);
        };

        expect(throwError).toThrow(InvalidArgumentException);
        expect(throwError).toThrow(L10nException);
        expect(throwError).toThrow(message);
    });
});
