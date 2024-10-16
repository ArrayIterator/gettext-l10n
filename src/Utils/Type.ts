import TranslationEntryInterface from '../Translations/Interfaces/TranslationEntryInterface';
import TranslationEntriesInterface from '../Translations/Interfaces/TranslationEntriesInterface';
import GettextTranslationInterface from '../Gettext/Interfaces/GettextTranslationInterface';
import GettextTranslationsInterface from '../Gettext/Interfaces/GettextTranslationsInterface';

export type Scalar<T extends string | number | boolean | bigint> = T extends string | number | boolean | bigint ? T : never;
export type TranslationType = TranslationEntryInterface;
export type TranslationsType = TranslationEntriesInterface<TranslationType, TranslationsType>;
export type GettextTranslationType = GettextTranslationInterface;
export type GettextTranslationsType = GettextTranslationsInterface<GettextTranslationType, GettextTranslationsType>;
