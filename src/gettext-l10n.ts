import {deep_freeze} from './Utils/Helper';
import MOReader from './Gettext/Reader/MOReader';
import PoReader from './Gettext/Reader/PoReader';
import GettextTranslation from './Gettext/GettextTranslation';
import GettextTranslations from './Gettext/GettextTranslations';
import JSONReader from './Gettext/Reader/JSONReader';
import POGenerator from './Gettext/Generator/POGenerator';
import XMLReader from './Gettext/Reader/XMLReader';
import JSONGenerator from './Gettext/Generator/JSONGenerator';

// export default and prevent any modification
// noinspection JSUnusedGlobalSymbols
export default deep_freeze({
    Gettext: {
        translation: GettextTranslation,
        translations: GettextTranslations,
        reader: {
            mo: MOReader,
            po: PoReader,
            json: JSONReader,
            xml: XMLReader
        },
        generator: {
            po: POGenerator,
            json: JSONGenerator
        }
    }
});
