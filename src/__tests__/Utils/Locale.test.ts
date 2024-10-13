import {
    getLocaleInfo,
    normalizeLocale,
    LocaleItem
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

describe('normalizeLocale', () => {
    /**
     * Test to check if normalizeLocale returns null for non-string input.
     */
    test('should return null for non-string input', () => {
        expect(normalizeLocale(123 as any)).toBeNull();
        expect(normalizeLocale(null as any)).toBeNull();
        expect(normalizeLocale(undefined as any)).toBeNull();
    });

    /**
     * Test to check if normalizeLocale returns null for invalid locale strings.
     */
    test('should return null for invalid locale strings', () => {
        expect(normalizeLocale('')).toBeNull();
        expect(normalizeLocale('.invalid')).toBeNull();
        expect(normalizeLocale('a')).toBeNull();
        expect(normalizeLocale('thisisaverylonglocalename')).toBeNull();
    });

    /**
     * Test to check if normalizeLocale returns the correct normalized locale for valid locale strings.
     */
    test('should return the correct normalized locale for valid locale strings', () => {
        const localeKey = Object.keys(Locales)[0];
        expect(normalizeLocale(localeKey)).toEqual(localeKey);
    });

    /**
     * Test to check if normalizeLocale returns null for non-existent locale strings.
     */
    test('should return null for non-existent locale strings', () => {
        expect(normalizeLocale('nonexistent')).toBeNull();
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
