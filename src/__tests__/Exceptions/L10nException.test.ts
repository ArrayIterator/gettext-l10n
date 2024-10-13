import L10nException from '../../Exceptions/L10nException';

describe('L10nException', () => {
    /**
     * Test to check if an instance of L10nException is created with the correct message and name.
     */
    test('should create an instance of L10nException', () => {
        const exception = new L10nException('Localization error');

        expect(exception).toBeInstanceOf(L10nException);
        expect(exception.message).toBe('Localization error');
        expect(exception.name).toBe(L10nException.name);
    });

    /**
     * Test to verify that the exception is thrown with the correct message and is an instance of L10nException.
     */
    test('should throw L10nException', () => {
        /**
         * Function that throws L10nException
         * @throws {L10nException}
         */
        const throwError = (): void => {
            throw new L10nException('Localization error');
        };

        expect(throwError).toThrow(L10nException);
        expect(throwError).toThrow('Localization error');
    });
});
