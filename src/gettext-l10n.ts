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
    }
});
