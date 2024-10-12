import ArrayStringInterface from "../../../ArrayStringInterface";
import CloneableInterface from "../../../CloneableInterface";

export default interface GettextCommentsInterface extends ArrayStringInterface, CloneableInterface {
    /**
     * List of comments
     *
     * @return {Array<string>} list of comments
     */
    get comments(): Array<string>;

    /**
     * Clone the comments
     *
     * @return {GettextCommentsInterface} the cloned comments
     */
    clone(): GettextCommentsInterface;
}
