import PluralForm from './PluralForm';
import {
    is_numeric,
    is_object,
    is_scalar,
    is_string,
    is_undefined,
    normalizeHeaderName,
    normalizeHeaderValue
} from '../../Utils/Helper';
import {
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
    private readonly _headers: HeaderRecords = DEFAULT_HEADERS;

    /**
     * Plural form
     *
     * @private
     */
    private _pluralForm?: PluralForm;

    /**
     * The fallback language
     *
     * @protected
     */
    protected _fallbackLanguage: string = 'en';

    /**
     * Headers constructor.
     */
    public constructor(headers?: HeaderRecords) {
        this._headers = {};
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
        return this._fallbackLanguage;
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
        let locale = normalizeLocale(language);
        if (locale) {
            this._fallbackLanguage = language;
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
        return Object.assign({}, this._headers);
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
        if (!is_undefined(this._pluralForm)) {
            return this._pluralForm;
        }
        let locale: LocaleItem | null = getLocaleInfo(this.language);
        this._pluralForm = locale ? new PluralForm(
            locale.count,
            locale.expression
        ) : new PluralForm();
        return this._pluralForm;
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
        this._pluralForm = pluralForm instanceof PluralForm ? pluralForm : this._pluralForm;
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
        for (let key in this._headers) {
            header += `"${key}: ${this._headers[key]}"\n`;
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
            case HEADER_LANGUAGE_KEY:
                let pluralParser = parsePluralForm(value);
                let language = this.language;
                if (!pluralParser?.expression && language) {
                    let info = getLocaleInfo(language);
                    if (info) {
                        this.pluralForm = new PluralForm(info.count, info.expression);
                    } else {
                        this.pluralForm = new PluralForm(
                            DEFAULT_PLURAL_COUNT,
                            DEFAULT_PLURAL_EXPRESSION
                        );
                    }
                } else {
                    this.pluralForm = new PluralForm(
                        pluralParser?.count ?? DEFAULT_PLURAL_COUNT,
                        pluralParser?.expression ?? DEFAULT_PLURAL_EXPRESSION
                    );
                }
                this._headers[normalizedName] = this.pluralForm.header;
                break;
            case HEADER_CONTENT_TRANSFER_ENCODING_KEY:
                value = value.trim().toLowerCase();
                const transferEncodings = ['7bit', '8bit', 'binary', 'quoted-printable', 'base64'];
                if (transferEncodings.includes(value)) {
                    this._headers[normalizedName] = value;
                }
                break;
            // case 'Creation-Date':
            //     // normalize
            //     this._headers['POT-Creation-Date'] = value;
            //     break;
            // case 'Revision-Date':
            //     // normalize
            //     this._headers['PO-Revision-Date'] = value;
            //     break;
            default:
                this._headers[normalizedName] = value;
        }
        return this;
    }

    /**
     * @inheritDoc
     */
    public get(name: string): string | undefined {
        name = normalizeHeaderName(name);
        return this._headers.hasOwnProperty(name) ? this._headers[name] : undefined;
    }

    /**
     * @inheritDoc
     */
    public has(name: string): boolean {
        return this._headers.hasOwnProperty(normalizeHeaderName(name));
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
        delete this._headers[name];
        if (name === HEADER_PLURAL_KEY) {
            this._pluralForm = undefined;
        }
        return this;
    }

    /**
     * @inheritDoc
     */
    public forEach(callback: (value: string, key: string, headers: HeaderRecords) => void): void {
        for (let key in this._headers) {
            callback(this._headers[key], key, this._headers);
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
