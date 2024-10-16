import {GettextTranslationsType} from '../../../Utils/Type';

export default interface GettextReaderInterface {

    /**
     * Read the content and return the translations
     *
     * @return {GettextTranslationsType} the translations
     */
    read(content: string | ArrayBufferLike): GettextTranslationsType;
}
