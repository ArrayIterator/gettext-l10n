import {
    getLocaleInfo,
    normalizeLocale,
    LocaleItem,
    normalizeLocaleName
} from '../../Utils/Locale';
import Locales from '../../Utils/locales.json'

describe('locales.json', () => {
    /**
     * Test to check the structure and validity of the data in locales.json.
     */
    test('test for locales.json data', () => {
        // key should be lowercase
        for (let key in Locales) {
            const locale = Locales[key as keyof typeof Locales];
            expect(/^[a-z]+(?:_([a-z]+|[0-9]+))?$/.test(key)).toBe(true); // ar_001
            expect(locale !== null && typeof locale === 'object').toBe(true);
            expect(Object.keys(locale)).toEqual([
                'id',
                'name',
                'count',
                'expression'
            ]);
            expect(typeof locale.id).toBe('string');
            expect(typeof locale.count).toBe('number');
            expect(/^[0-9]+$/.test(locale.count + '')).toBe(true);
            expect(typeof locale.expression).toBe('string');
        }
    });
});

describe('normalizeLocaleName', () => {
    /**
     * Test to check if normalizeLocale returns null for non-string input.
     */
    test('should return null for non-string input', () => {
        expect(normalizeLocale(123 as any)).toBeNull();
        expect(normalizeLocale(null as any)).toBeNull();
        expect(normalizeLocale(undefined as any)).toBeNull();
    });

    /**
     * Test to check if normalizeLocaleName returns null for non-string input.
     */
    test('should return null for non-string input', () => {
        expect(normalizeLocaleName(123 as any)).toBeNull();
        expect(normalizeLocaleName(null as any)).toBeNull();
        expect(normalizeLocaleName(undefined as any)).toBeNull();
    });

    /**
     * Test to check normalizeLocale returns null for invalid locale strings.
     */
    test('should return null for invalid locale strings', () => {
        /**
         * @see https://tools.ietf.org/html/rfc5646
         */
        expect(normalizeLocale('    ')).toBeNull(); // whitespace should be trimmed and not allowed
        expect(normalizeLocale('.invalid')).toBeNull(); // invalid characters
        expect(normalizeLocale('a')).toBeNull(); // too short
        expect(normalizeLocale('thisisaverylonglocalename')).toBeNull() // invalid length
        expect(normalizeLocale('en')).toEqual('en');
        expect(normalizeLocale('en_')).toEqual('en');
        expect(normalizeLocale('en-US')).toEqual('en_US');
        expect(normalizeLocale('de-CH-1996')).toEqual('de_CH_1996');
        expect(normalizeLocale('de-AB-ab')).toBeNull(); // invalid variant
        expect(normalizeLocale('de-ABC-ab')).toEqual('de_ABC_AB');
        expect(normalizeLocale('de-AB-abc')).toBeNull(); // invalid variant
        expect(normalizeLocale('de-ABC-abc')).toEqual('de_ABC_ABC');
        expect(normalizeLocale('de-AB-ab1')).toBeNull(); // invalid variant
    });

    /**
     * Test to check if normalizeLocaleName returns null for invalid locale strings.
     */
    test('should return null for invalid locale strings', () => {
        expect(normalizeLocaleName('')).toBeNull();
        expect(normalizeLocaleName('.invalid')).toBeNull();
        expect(normalizeLocaleName('a')).toBeNull();
        expect(normalizeLocaleName('thisisaverylonglocalename')).toBeNull();
    });

    /**
     * Test to check if normalizeLocaleName returns the correct normalized locale for valid locale strings.
     */
    test('should return the correct normalized locale for valid locale strings', () => {
        const localeKey = Object.keys(Locales)[0];
        expect(normalizeLocaleName(localeKey)).toEqual(localeKey);
    });

    /**
     * Test to check if normalizeLocaleName returns null for non-existent locale strings.
     */
    test('should return null for non-existent locale strings', () => {
        expect(normalizeLocaleName('nonexistent')).toBeNull();
    });
});

describe('getLocaleInfo', () => {
    /**
     * Test to check if getLocaleInfo returns null for non-string input.
     */
    test('should return null for non-string input', () => {
        expect(getLocaleInfo(123 as any)).toBeNull();
        expect(getLocaleInfo(null as any)).toBeNull();
        expect(getLocaleInfo(undefined as any)).toBeNull();
    });

    /**
     * Test to check if getLocaleInfo returns null for invalid locale strings.
     */
    test('should return null for invalid locale strings', () => {
        expect(getLocaleInfo('')).toBeNull();
        expect(getLocaleInfo('.invalid')).toBeNull();
        expect(getLocaleInfo('a')).toBeNull();
        expect(getLocaleInfo('thisisaverylonglocalename')).toBeNull();
    });

    /**
     * Test to check if getLocaleInfo returns the correct locale item for valid locale strings.
     */
    test('should return the correct locale item for valid locale strings', () => {
        const localeKey = Object.keys(Locales)[0];
        const localeItem = (Locales as { [key: string]: LocaleItem })[localeKey];
        expect(getLocaleInfo(localeKey)).toEqual(localeItem);
    });

    /**
     * Test to check if getLocaleInfo returns the correct locale item for locale id.
     */
    test('should return the correct locale item for locale id', () => {
        const localeKey = Object.keys(Locales)[0];
        const localeItem = (Locales as { [key: string]: LocaleItem })[localeKey];
        expect(getLocaleInfo(localeItem.id)).toEqual(localeItem);
    });

    /**
     * Test to check if getLocaleInfo returns null for non-existent locale strings.
     */
    test('should return null for non-existent locale strings', () => {
        expect(getLocaleInfo('nonexistent')).toBeNull();
    });
});
