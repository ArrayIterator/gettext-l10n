import {deep_freeze} from './Utils/Helper';
import MoReader from './Gettext/Reader/MoReader';
import PoReader from './Gettext/Reader/PoReader';
import GettextTranslation from './Gettext/GettextTranslation';
import GettextTranslations from './Gettext/GettextTranslations';
import JsonReader from './Gettext/Reader/JsonReader';
import PoGenerator from './Gettext/Generator/PoGenerator';

// export default and prevent any modification
export default deep_freeze({
    Gettext: {
        translation: GettextTranslation,
        translations: GettextTranslations,
        reader: {
            mo: MoReader,
            po: PoReader,
            json: JsonReader
        },
        generator: {
            po: PoGenerator
        }
    }
});
