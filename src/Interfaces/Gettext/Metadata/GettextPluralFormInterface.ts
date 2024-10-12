import {PluralExpressions} from "../../../Utils/PluralParser";
import CloneableInterface from "../../CloneableInterface";

export default interface GettextPluralFormInterface extends CloneableInterface {
    /**
     * Get error of parsed tokens
     * Get the error if the tokens are invalid
     *
     * @return {Error|null} null if no error
     */
    get error(): Error | null;

    /**
     * Get the tokens of the expression
     *
     * @return {PluralExpressions|null} null if the expression is invalid
     */
    get tokens(): PluralExpressions | null;

    /**
     * Get the plural expression
     *
     * @return {string}
     */
    get expression(): string;

    /**
     * Get the plural count
     *
     * @return {number}
     */
    get pluralCount(): number;

    /**
     * Check if parsed tokens are valid
     *
     * @return {boolean} true if valid, false otherwise
     */
    get valid(): boolean;

    /**
     * Get the plural form of the number
     *
     * @return {string} the plural form : nplurals={count};plural={expression};
     */
    get header(): string;

    /**
     * Get the plural form of the number
     * Gettext plural formula index
     *
     * @param {number} number the index number of the plural form
     */
    index(number: number): number;

    /**
     * Clone the plural form
     *
     * @return {GettextPluralFormInterface} the cloned plural form
     */
    clone(): GettextPluralFormInterface;
}
