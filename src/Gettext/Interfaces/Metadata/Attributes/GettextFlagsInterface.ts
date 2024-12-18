import ArrayStringInterface from '../../../../Interfaces/ArrayStringInterface';
import CloneableInterface from '../../../../Interfaces/CloneableInterface';

export default interface GettextFlagsInterface extends ArrayStringInterface, CloneableInterface {

    /**
     * @inheritDoc
     *
     * @return {true} determine flags are unique
     */
    get unique(): true;

    /**
     * List of flags
     *
     * @return {Array<string>} list of flags
     */
    get flags(): Array<string>;

    /**
     * Clone the flags
     *
     * @return {GettextFlagsInterface} Cloned flags
     */
    clone(): GettextFlagsInterface;
}
