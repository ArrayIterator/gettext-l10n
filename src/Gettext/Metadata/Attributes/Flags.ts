import ArrayString from '../../../Abstracts/ArrayString';
import GettextFlagsInterface from '../../Interfaces/Metadata/Attributes/GettextFlagsInterface';

/**
 * Flags storage class to handle flags data
 * Flags is a special comments that is used to store flags data
 */
export default class Flags extends ArrayString implements GettextFlagsInterface {

    /**
     * @inheritDoc
     */
    public get unique(): true {
        return true;
    }

    /**
     * @inheritDoc
     */
    public get flags(): Array<string> {
        return this.all;
    }

    /**
     * @inheritDoc
     */
    public clone(): GettextFlagsInterface {
        return new (this.constructor as any)(...this.all);
    }
}
