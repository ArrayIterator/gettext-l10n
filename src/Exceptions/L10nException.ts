/**
 * Base exception for all localization exceptions.
 */
export default class L10nException extends Error {

    /**
     * Constructor
     * @param {string} message
     */
    public constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}
