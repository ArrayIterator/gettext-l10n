import {is_string} from "./Helper";
import Locales from "./locales.json";

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
export const getLocaleInfo = (locale?: string): LocaleItem | null => {
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
    if (Locales.hasOwnProperty(locale)) {
        return (Locales as LocaleItems)[locale];
    }

    if (!setup) {
        setup = true;
        Object.entries((Locales as LocaleItems))
            .forEach(([key, value]) => {
                LocaleIdentifierById[value.id] = key;
            });
    }

    locale = LocaleIdentifierById[locale];
    if (locale) {
        return (Locales as LocaleItems)[locale];
    }
    let match = locale.match(/^([a-z]{2})(?:[-_]([a-z]{2}))?(?:([a-z]{2})(?:[-_]([a-z]{2}))?)?(?:\..*)?$/i);
    if (!match) {
        return null;
    }
    let currentLocale;
    if (match[4]) {
        currentLocale = (match[1] + '_' + match[2] + match[3] + '_' + match[4]).toLowerCase();
        if (LocaleIdentifierById.hasOwnProperty(currentLocale)) {
            return (Locales as LocaleItems)[LocaleIdentifierById[currentLocale]];
        }
    }
    if (match[3]) {
        currentLocale = (match[1] + '_' + match[2] + match[3]);
        if (LocaleIdentifierById.hasOwnProperty(currentLocale)) {
            return (Locales as LocaleItems)[LocaleIdentifierById[currentLocale]];
        }
    }
    if (match[2]) {
        currentLocale = (match[1] + '_' + match[2]).toLowerCase();
        if (LocaleIdentifierById.hasOwnProperty(currentLocale)) {
            return (Locales as LocaleItems)[LocaleIdentifierById[currentLocale]];
        }
    }
    currentLocale = match[1].toLowerCase();
    return (Locales as LocaleItems)[currentLocale] || null;
}

export default Locales as LocaleItems;
