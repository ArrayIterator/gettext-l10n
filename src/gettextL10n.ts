import {deep_freeze} from './Utils/Helper';
import GettextTranslation from './Gettext/GettextTranslation';
import GettextTranslations from './Gettext/GettextTranslations';
import TranslationEntry from './Translations/TranslationEntry';
import TranslationEntries from './Translations/TranslationEntries';
import Translator from './Translations/Translator';
import Reader, {
    POReader,
    MOReader,
    XMLReader,
    JSONReader
} from './Reader';
import Generator, {
    POGenerator,
    MOGenerator,
    XMLGenerator,
    JSONGenerator
} from './Generator';

// export default and prevent any modification
// noinspection JSUnusedGlobalSymbols
export default deep_freeze({
    Translator,
    TranslationEntry,
    TranslationEntries,
    GettextTranslations,
    GettextTranslation,
    POReader,
    MOReader,
    XMLReader,
    JSONReader,
    POGenerator,
    MOGenerator,
    XMLGenerator,
    JSONGenerator,
    Reader,
    Generator,
});
