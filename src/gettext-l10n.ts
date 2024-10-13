import MoReader from './Gettext/Reader/MoReader';
import PoReader from './Gettext/Reader/PoReader';
import GettextTranslation from './Gettext/GettextTranslation';
import GettextTranslations from './Gettext/GettextTranslations';
import {deep_freeze} from './Utils/Helper';

// export default and prevent any modification
export default deep_freeze({
    Gettext: {
        translation: GettextTranslation,
        translations: GettextTranslations,
        reader: {
            mo: MoReader,
            po: PoReader
        },
        generator: {}
    }
});
