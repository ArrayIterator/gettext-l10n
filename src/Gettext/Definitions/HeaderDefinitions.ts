import {
    DEFAULT_PLURAL_FORM,
    PLURAL_HEADER_KEY
} from './FormDefinitions';
import {DEFAULT_LANGUAGE} from '../../Utils/Locale';

export type HeaderRecords = {
    [HEADER_PROJECT_ID_VERSION_KEY]: string;
    [HEADER_LAST_TRANSLATOR_KEY]: string;
    [HEADER_LANGUAGE_TEAM_KEY]: string;
    [HEADER_LANGUAGE_KEY]: string;
    [HEADER_PLURAL_KEY]: string;
    [HEADER_MIME_VERSION_KEY]: string;
    [HEADER_CONTENT_TRANSFER_ENCODING_KEY]: string;
    [HEADER_CONTENT_TYPE_KEY]: string;
    [HEADER_DOMAIN_KEY]: string;
    [HEADER_GENERATOR_KEY]: string;
    [key: string]: string;
} | {
    [key: string]: string;
};

export const HEADER_LANGUAGE_KEY = 'Language';
export const HEADER_PLURAL_KEY = PLURAL_HEADER_KEY;
export const HEADER_DOMAIN_KEY = 'X-Domain';
export const HEADER_PROJECT_ID_VERSION_KEY = 'Project-Id-Version';
export const HEADER_LAST_TRANSLATOR_KEY = 'Last-Translator';
export const HEADER_LANGUAGE_TEAM_KEY = 'Language-Team';
export const HEADER_MIME_VERSION_KEY = 'MIME-Version';
export const HEADER_CONTENT_TYPE_KEY = 'Content-Type';
export const HEADER_CONTENT_TRANSFER_ENCODING_KEY = 'Content-Transfer-Encoding';
export const HEADER_GENERATOR_KEY = 'X-Generator';

/**
 * Default headers
 */
export const DEFAULT_HEADERS: {
    [HEADER_PROJECT_ID_VERSION_KEY]: string;
    [HEADER_LAST_TRANSLATOR_KEY]: string;
    [HEADER_LANGUAGE_TEAM_KEY]: string;
    [HEADER_LANGUAGE_KEY]: string;
    [HEADER_PLURAL_KEY]: string;
    [HEADER_MIME_VERSION_KEY]: string;
    [HEADER_CONTENT_TRANSFER_ENCODING_KEY]: string;
    [HEADER_CONTENT_TYPE_KEY]: string;
} = {
    [HEADER_PROJECT_ID_VERSION_KEY]: '',
    [HEADER_LAST_TRANSLATOR_KEY]: '',
    [HEADER_LANGUAGE_TEAM_KEY]: '',
    [HEADER_LANGUAGE_KEY]: DEFAULT_LANGUAGE,
    [HEADER_PLURAL_KEY]: DEFAULT_PLURAL_FORM,
    [HEADER_MIME_VERSION_KEY]: '1.0',
    [HEADER_CONTENT_TRANSFER_ENCODING_KEY]: '8bit',
    [HEADER_CONTENT_TYPE_KEY]: 'text/plain; charset=UTF-8',
};

Object.freeze(DEFAULT_HEADERS); // freeze
