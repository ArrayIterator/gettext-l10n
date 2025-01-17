import PluralForm, {DefaultPluralForm} from './PluralForm';
import {
    is_numeric,
    is_object,
    is_scalar,
    is_string,
    is_undefined,
    normalizeHeaderName,
    normalizeHeaderValue
} from '../../Utils/Helper';
import Locale, {
    getLocaleInfo,
    LocaleItem,
    normalizeLocale
} from '../../Utils/Locale';
import {parsePluralForm} from '../Utils/PluralParser';
import {Scalar} from '../../Utils/Type';
import GettextHeadersInterface from '../Interfaces/Metadata/GettextHeadersInterface';
import {
    DEFAULT_HEADERS,
    HEADER_CONTENT_TRANSFER_ENCODING_KEY,
    HEADER_DOMAIN_KEY,
    HEADER_GENERATOR_KEY,
    HEADER_LANGUAGE_KEY,
    HEADER_LANGUAGE_NAME_KEY,
    HEADER_PLURAL_KEY,
    HEADER_PROJECT_ID_VERSION_KEY,
    HeaderRecords
} from '../Definitions/HeaderDefinitions';
import {
    DEFAULT_PLURAL_COUNT,
    DEFAULT_PLURAL_EXPRESSION
} from '../Definitions/FormDefinitions';

/**
 * The gettext headers
 */
export default class Headers implements GettextHeadersInterface {

    /**
     * List of headers
     *
     * @private
     */
    readonly #headers: HeaderRecords = DEFAULT_HEADERS;

    /**
     * Plural form
     *
     * @private
     */
    #pluralForm?: PluralForm;

    /**
     * The fallback language
     *
     * @private
     */
    #fallbackLanguage: string = 'en';

    /**
     * Headers constructor.
     */
    public constructor(headers?: HeaderRecords) {
        this.#headers = {};
        headers = !headers || typeof headers !== 'object' ? {} : headers;
        if (is_object(headers)) {
            for (let key in headers) {
                this.set(key, headers[key]);
            }
        }
    }

    /**
     * @inheritDoc
     */
    public getFallbackLanguage(): string {
        return this.#fallbackLanguage;
    }

    /**
     * @inheritDoc
     */
    public get fallbackLanguage(): string {
        return this.getFallbackLanguage();
    }

    /**
     * @inheritDoc
     */
    public setFallbackLanguage(language: string): void {
        let info = getLocaleInfo(language);
        if (info) {
            this.#fallbackLanguage = info.id;
        }
    }

    /**
     * @inheritDoc
     */
    public set fallbackLanguage(language: string) {
        this.setFallbackLanguage(language);
    }

    /**
     * @inheritDoc
     */
    public getHeaders(): HeaderRecords {
        // clone to prevent modification
        return Object.assign({}, this.#headers);
    }

    /**
     * @inheritDoc
     */
    public get headers(): HeaderRecords {
        return this.getHeaders();
    }

    /**
     * @inheritDoc
     */
    public getPluralForm(): PluralForm {
        if (!is_undefined(this.#pluralForm)) {
            return this.#pluralForm;
        }
        let locale: LocaleItem | null = getLocaleInfo(this.language);
        this.#pluralForm = locale ? new PluralForm(
            locale.count,
            locale.expression
        ) : DefaultPluralForm;
        this.#headers[HEADER_PLURAL_KEY] = this.#pluralForm.header;
        if (locale && !this.has(HEADER_LANGUAGE_KEY)) {
            this.set(HEADER_LANGUAGE_KEY, locale.id);
        }
        return this.#pluralForm;
    }

    /**
     * @inheritDoc
     */
    public get pluralForm(): PluralForm {
        return this.getPluralForm();
    }

    /**
     * @inheritDoc
     */
    public setPluralForm(pluralForm: PluralForm | any): void {
        this.#pluralForm = pluralForm instanceof PluralForm ? pluralForm : this.#pluralForm;
    }

    /**
     * @inheritDoc
     */
    public set pluralForm(pluralForm: PluralForm | any) {
        this.setPluralForm(pluralForm);
    }

    /**
     * @inheritDoc
     */
    public getLanguage(): string {
        return this.get(HEADER_LANGUAGE_KEY) || this.getFallbackLanguage();
    }

    /**
     * @inheritDoc
     */
    public get language(): string {
        return this.getLanguage();
    }

    /**
     * @inheritDoc
     */
    public setLanguage(language: string | undefined | null): void {
        this.set(HEADER_LANGUAGE_KEY, language);
    }

    /**
     * @inheritDoc
     */
    public set language(language: string | undefined | null) {
        this.setLanguage(language);
    }

    /**
     * @inheritDoc
     */
    public getDomain(): string | undefined {
        return this.get(HEADER_DOMAIN_KEY);
    }

    /**
     * @inheritDoc
     */
    public get domain(): string | undefined {
        return this.getDomain();
    }

    /**
     * @inheritDoc
     */
    public setDomain(domain: string | undefined | null): void {
        this.set(HEADER_DOMAIN_KEY, domain);
    }

    /**
     * @inheritDoc
     */
    public set domain(domain: string | undefined | null) {
        this.setDomain(domain);
    }

    /**
     * @inheritDoc
     */
    public getVersion(): string | undefined {
        return this.get(HEADER_PROJECT_ID_VERSION_KEY);
    }

    /**
     * @inheritDoc
     */
    public get version(): string | undefined {
        return this.getVersion();
    }

    /**
     * @inheritDoc
     */
    public setVersion(version: string | undefined | null): void {
        this.set(HEADER_PROJECT_ID_VERSION_KEY, version);
    }

    /**
     * @inheritDoc
     */
    public set version(version: string | undefined | null) {
        this.setVersion(version);
    }

    /**
     * @inheritDoc
     */
    public getGenerator(): string | undefined {
        return this.get(HEADER_GENERATOR_KEY);
    }

    /**
     * @inheritDoc
     */
    public get generator(): string | undefined {
        return this.getGenerator();
    }

    /**
     * @inheritDoc
     */
    public setGenerator(generator: string | undefined | null): void {
        this.set(HEADER_GENERATOR_KEY, generator);
    }

    /**
     * @inheritDoc
     */
    public set generator(generator: string | undefined | null) {
        this.setGenerator(generator);
    }

    /**
     * @inheritDoc
     */
    public getHeader(): string {
        let header: string = '';
        for (let key in this.#headers) {
            header += `"${key}: ${this.#headers[key]}"\n`;
        }
        return header;
    }

    /**
     * @inheritDoc
     */
    public get header(): string {
        return this.getHeader();
    }

    /**
     * @inheritDoc
     */
    public set(name: string, value: Scalar<any>): this {
        if (!is_string(name)) {
            return this;
        }
        name = name.trim();
        if (name === '' || is_numeric(name)) { // header does not accept numeric only
            return this;
        }
        if (value === undefined || value === null) {
            this.remove(name);
            return this;
        }
        if (!is_scalar(value)) {
            return this;
        }
        const normalizedName = normalizeHeaderName(name);
        value = normalizeHeaderValue(value);
        switch (normalizedName) {
            case HEADER_PLURAL_KEY:
                let pluralParser = parsePluralForm(value);
                if (!pluralParser) {
                    return this;
                }
                let language     = this.language;
                let info: LocaleItem | null;
                if (language && !pluralParser.expression && (info = getLocaleInfo(language))) {
                    this.pluralForm = new PluralForm(info.count, info.expression);
                } else {
                    this.pluralForm = new PluralForm(
                        pluralParser.count ?? DEFAULT_PLURAL_COUNT,
                        pluralParser.expression ?? DEFAULT_PLURAL_EXPRESSION
                    );
                }
                this.#headers[normalizedName] = this.pluralForm.header;
                break;
            case HEADER_LANGUAGE_KEY:
                let localeInfo = getLocaleInfo(value);
                if (localeInfo) {
                    this.#headers[normalizedName] = localeInfo.id;
                    this.#headers[HEADER_LANGUAGE_NAME_KEY] = localeInfo.name;
                } else {
                    let language = normalizeLocale(value);
                    if (language) {
                        this.#headers[normalizedName] = language;
                    }
                }
                break;
            case HEADER_LANGUAGE_NAME_KEY:
                // normalize
                this.#headers[HEADER_LANGUAGE_NAME_KEY] = value;
                let lowerValue = value.toLowerCase();
                for (let locale in Locale) {
                    let item = Locale[locale];
                    if (item.name.toLowerCase() === lowerValue) {
                        this.#headers[HEADER_LANGUAGE_KEY] = item.id;
                        this.#headers[HEADER_LANGUAGE_NAME_KEY] = item.name;
                        break;
                    }
                }
                break;
            case HEADER_CONTENT_TRANSFER_ENCODING_KEY:
                value = value.trim().toLowerCase();
                const transferEncodings = ['7bit', '8bit', 'binary', 'quoted-printable', 'base64'];
                if (transferEncodings.includes(value)) {
                    this.#headers[normalizedName] = value;
                }
                break;
            case 'Creation-Date':
                // normalize
                this.#headers['POT-Creation-Date'] = value;
                break;
            case 'Revision-Date':
                // normalize
                this.#headers['PO-Revision-Date'] = value;
                break;
            default:
                this.#headers[normalizedName] = value.trim();
        }
        return this;
    }

    /**
     * @inheritDoc
     */
    public get(name: string): string | undefined {
        name = normalizeHeaderName(name);
        return this.#headers.hasOwnProperty(name) ? this.#headers[name] : undefined;
    }

    /**
     * @inheritDoc
     */
    public has(name: string): boolean {
        return this.#headers.hasOwnProperty(normalizeHeaderName(name));
    }

    /**
     * @inheritDoc
     */
    public remove(name: string): this {
        if (!is_string(name)) {
            return this;
        }
        name = normalizeHeaderName(name);
        if (name === '') {
            return this;
        }
        delete this.#headers[name];
        if (name === HEADER_PLURAL_KEY) {
            this.#pluralForm = undefined;
        }
        return this;
    }

    /**
     * @inheritDoc
     */
    public forEach(callback: (value: string, key: string, headers: HeaderRecords) => void): void {
        for (let key in this.#headers) {
            callback(this.#headers[key], key, this.#headers);
        }
    }

    /**
     * Get printed headers
     */
    public toString(): string {
        return this.header;
    }

    /**
     * @inheritDoc
     */
    public clone(): GettextHeadersInterface {
        return new (this.constructor as any)(this.headers);
    }
}
