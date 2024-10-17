import {is_string} from './Helper';
import Locales from './locales.json';

Object.freeze(Locales); // Prevent modification of locales

export type LocaleItem = {
    id: string;
    name: string;
    count: number;
    expression: string;
};

export type LocaleItems = {
    [key: string]: LocaleItem;
};

const LocaleIdentifierById: {
    [p: string]: string
} = {};

let setup = false;

export const DEFAULT_DOMAIN = 'default';
export const DEFAULT_LANGUAGE = 'en';

// @link {https://tools.ietf.org/html/rfc5646}
export const RFC5646_REGEX = /^(?:(?:en-GB-oed|i-(?:ami|bnn|default|enochian|hak|klingon|lux|mingo|navajo|pwn|tao|tay|tsu)|sgn-(?:BE-FR|BE-NL|CH-DE))|(?:art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang)|(?:(?:(?:[a-zA-Z]{2,3}(-([A-Za-z]{3}(-[A-Za-z]{3}){0,2}))?)|[a-zA-Z]{5,8})(?:-[A-Za-z]{4})?(?:-(?:[A-Za-z]{2}|\d{3}))?(?:-(?:[A-Za-z0-9]{5,8}|\d[A-Z-a-z0-9]{3}))*(?:-(?:\d|[A-W]|[Y-Z]|[a-w]|[y-z])(-[A-Za-z0-9]{2,8})+)*)?)$/;

/**
 * Normalize the locale
 *
 * @param {string} locale the locale language
 * @return {string|null} string if it was exists in locale json
 */
export const normalizeLocaleName = (locale: string): string | null => {
    if (!is_string(locale)) {
        return null;
    }
    locale = locale.trim();
    if ('' === locale || '.' === locale[0]) {
        return null;
    }
    const length = locale.length;
    if (length < 2 || length > 10) {
        return null;
    }

    if (!setup) {
        setup = true;
        Object.entries((Locales as LocaleItems))
            .forEach(([key, value]) => {
                LocaleIdentifierById[value.id.toLowerCase()] = key;
            });
    }
    locale = locale.replace(/[-_]+/g, '_').toLowerCase();
    if (Locales.hasOwnProperty(locale)) {
        return locale;
    }
    if (LocaleIdentifierById.hasOwnProperty(locale)) {
        return LocaleIdentifierById[locale];
    }

    let match = locale.match(/^([a-z]{2})(?:[-_]([a-z]{2}))?(?:([a-z]{2})(?:[-_]([a-z]{2}))?)?(?:\..*)?$/i);
    if (!match) {
        return null;
    }

    let currentLocale;
    if (match[4]) {
        currentLocale = (match[1] + '_' + match[2] + match[3] + '_' + match[4]).toLowerCase();
        if (LocaleIdentifierById.hasOwnProperty(currentLocale)) {
            return LocaleIdentifierById[currentLocale];
        }
    }
    if (match[3]) {
        currentLocale = (match[1] + '_' + match[2] + match[3]);
        if (LocaleIdentifierById.hasOwnProperty(currentLocale)) {
            return (Locales as LocaleItems)[LocaleIdentifierById[currentLocale]] ? LocaleIdentifierById[currentLocale] : null;
        }
    }
    if (match[2]) {
        currentLocale = (match[1] + '_' + match[2]).toLowerCase();
        if (LocaleIdentifierById.hasOwnProperty(currentLocale)) {
            return (Locales as LocaleItems)[LocaleIdentifierById[currentLocale]] ? LocaleIdentifierById[currentLocale] : null;
        }
    }
    currentLocale = match[1].toLowerCase();
    return (Locales as LocaleItems)[currentLocale] ? currentLocale : (
        LocaleIdentifierById[currentLocale] || null
    );
}

/**
 * Normalize the locale
 * @param {string} locale
 * @return {string|null}
 */
export const normalizeLocale = (locale: string): string|null => {
    if (!is_string(locale) || locale.trim() === '') {
        return null;
    }
    let localeInfo = getLocaleInfo(locale);
    if (localeInfo) {
        return localeInfo.id;
    }
    locale = locale.trim().replace(/[-_]+/g, '-').toLowerCase().replace(/(^-|-$)/g, '');
    let match = locale.match(RFC5646_REGEX);
    if (!match) {
        return null;
    }
    let locales = locale.split('-');
    let first : string = locales.shift() as string;
    locales = locales.map((locale) => locale.toUpperCase());
    locales.unshift(first);
    return locales.join('_');
}

/**
 * Get the locale information
 */
export const getLocaleInfo = (locale?: string): LocaleItem | null => {
    let normalizedLocale = normalizeLocaleName(locale || '');
    if (!normalizedLocale) {
        return null;
    }
    return (Locales as LocaleItems)[normalizedLocale] || null;
}

export default Locales as LocaleItems;
