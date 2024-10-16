import {deep_freeze} from './Utils/Helper';
import MOReader from './Gettext/Reader/MOReader';
import POReader from './Gettext/Reader/POReader';
import GettextTranslation from './Gettext/GettextTranslation';
import GettextTranslations from './Gettext/GettextTranslations';
import JSONReader from './Gettext/Reader/JSONReader';
import POGenerator from './Gettext/Generator/POGenerator';
import XMLReader from './Gettext/Reader/XMLReader';
import JSONGenerator from './Gettext/Generator/JSONGenerator';
import MOGenerator from './Gettext/Generator/MOGenerator';
import XMLGenerator from './Gettext/Generator/XMLGenerator';
import TranslationEntry from './Translations/TranslationEntry';
import TranslationEntries from './Translations/TranslationEntries';
import Translator from './Translations/Translator';

// export default and prevent any modification
// noinspection JSUnusedGlobalSymbols
export default deep_freeze({
    Gettext: {
        translation: GettextTranslation,
        translations: GettextTranslations,
        reader: {
            mo: MOReader,
            po: POReader,
            json: JSONReader,
            xml: XMLReader
        },
        generator: {
            po: POGenerator,
            json: JSONGenerator,
            mo: MOGenerator,
            xml: XMLGenerator
        }
    },
    Translations: {
        translator: Translator,
        translation: TranslationEntry,
        translations: TranslationEntries
    },
    Translator: new Translator()
});
