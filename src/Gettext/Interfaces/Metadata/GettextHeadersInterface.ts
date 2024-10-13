import GettextPluralFormInterface from './GettextPluralFormInterface';
import {Scalar} from '../../../Utils/Type';
import {HeaderRecords} from '../../Definitions/HeaderDefinitions';
import CloneableInterface from '../../../Interfaces/CloneableInterface';

export default interface GettextHeadersInterface extends CloneableInterface {

    /**
     * Get the fallback language
     *
     * @return {string} the fallback language
     */
    getFallbackLanguage(): string;

    /**
     * Get the fallback language
     *
     * @return {string} the fallback language
     */
    get fallbackLanguage(): string;

    /**
     * Set the fallback language
     *
     * @param {string} language - the fallback language
     */
    setFallbackLanguage(language: string): void;

    /**
     * Set the fallback language
     *
     * @param {string} language - the fallback language
     */
    set fallbackLanguage(language: string);

    /**
     * Get headers
     *
     * @return {HeaderRecords} the headers
     */
    getHeaders(): HeaderRecords;

    /**
     * Get all headers
     *
     * @return {HeaderRecords} the headers
     */
    get headers(): HeaderRecords;

    /**
     * Get plural form
     *
     * @return {GettextPluralFormInterface} the plural form
     */
    getPluralForm(): GettextPluralFormInterface;

    /**
     * Get plural form
     *
     * @return {GettextPluralFormInterface} the plural form
     */
    get pluralForm(): GettextPluralFormInterface;

    /**
     * Set plural form
     *
     * @param {GettextPluralFormInterface} pluralForm - the plural form
     */
    setPluralForm(pluralForm: GettextPluralFormInterface): void;

    /**
     * Set plural form
     *
     * @param {PluralForm} pluralForm - the plural form
     */
    set pluralForm(pluralForm: GettextPluralFormInterface);

    /**
     * Get language
     *
     * @return {string} the language if undefined, return the fallback language
     */
    getLanguage(): string;

    /**
     * Get language
     *
     * @return {string | undefined} the language
     */
    get language(): string;

    /**
     * Set language
     *
     * @param {string} language - the language
     */
    setLanguage(language: string): void;

    /**
     * Set language
     *
     * @param {string | undefined | null} language - the language - undefined or null will remove the language
     */
    set language(language: string | undefined | null);

    /**
     * Get domain
     *
     * @return {string} the domain
     */
    getDomain(): string | undefined;

    /**
     * Get domain
     *
     * @return {string | undefined} the domain
     */
    get domain(): string | undefined;

    /**
     * Set domain
     *
     * @param {string} domain - the domain
     */
    setDomain(domain: string): void

    /**
     * Set domain
     *
     * @param {string | undefined | null} domain - the domain - undefined or null will remove the domain
     */
    set domain(domain: string | undefined | null);

    /**
     * Get project id version
     *
     * @return {string} the project id version
     */
    getVersion(): string | undefined;

    /**
     * Get project id version
     *
     * @return {string} the project id version
     */
    get version(): string | undefined;

    /**
     * Set project id version
     *
     * @param {string} version - the project id version
     */
    setVersion(version: string): void;

    /**
     * Set project id version
     *
     * @param {string} version - the project id version - undefined or null will remove the version
     */
    set version(version: string | undefined | null);

    /**
     * Get generator
     *
     * @return {string} the generator
     */
    getGenerator(): string | undefined;

    /**
     * Get generator
     *
     * @return {string} the generator
     */
    get generator(): string | undefined;

    /**
     * Set generator
     *
     * @param {string} generator - the generator
     */
    setGenerator(generator: string): void;

    /**
     * Set generator
     *
     * @param {string|undefined|null} generator - the generator - undefined or null will remove the generator
     */
    set generator(generator: string | undefined | null);

    /**
     * Get header
     *
     * @return {string} the header
     */
    getHeader(): string;

    /**
     * Get printed headers
     *
     * @return {string} the printed header
     */
    get header(): string;

    /**
     * Set header
     *
     * @param {string} name - header name
     * @param {Scalar<string|number|boolean>} value - header value
     *
     * @return {this} the current instance
     */
    set(name: string, value: Scalar<any>): this;

    /**
     * Get header
     *
     * @param {string} name - header name
     *
     * @return {string|undefined} the header value, undefined if not found
     */
    get(name: string): string | undefined;

    /**
     * Check if header exists
     *
     * @param {string} name - header name
     */
    has(name: string): boolean;

    /**
     * Remove header
     *
     * @param {string} name - header name
     *
     * @return {this} the current instance
     */
    remove(name: string): this;

    /**
     * For each header call the callback
     *
     * @param {(value: string, key: string, headers: HeaderRecords) => void} callback - the callback
     */
    forEach(callback: (value: string, key: string, headers: HeaderRecords) => void): void;

    /**
     * Clone headers
     *
     * @return {GettextHeadersInterface} the cloned instance
     */
    clone(): GettextHeadersInterface;
}
