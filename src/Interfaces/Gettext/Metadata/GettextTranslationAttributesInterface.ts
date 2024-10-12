import GettextCommentsInterface from "./Attributes/GettextCommentsInterface";
import GettextReferencesInterface from "./Attributes/GettextReferencesInterface";
import GettextExtractedCommentsInterface from "./Attributes/GettextExtractedCommentsInterface";
import GettextFlagsInterface from "./Attributes/GettextFlagsInterface";
import CloneableInterface from "../../CloneableInterface";

export default interface GettextTranslationAttributesInterface extends CloneableInterface {

    /**
     * Gettext flags
     *
     * @return {GettextFlagsInterface} Gettext flags
     */
    get flags(): GettextFlagsInterface;

    /**
     * Gettext comments
     *
     * @return {GettextCommentsInterface} Gettext comments
     */
    get comments(): GettextCommentsInterface;


    /**
     * Extracted comments
     *
     * @return {GettextExtractedCommentsInterface} Extracted comments
     */
    get extractedComments(): GettextExtractedCommentsInterface;

    /**
     * Gettext references
     *
     * @return {GettextReferencesInterface} Gettext references
     */
    get references(): GettextReferencesInterface;

    /**
     * Clone the attributes
     *
     * @return {GettextTranslationAttributesInterface} the cloned attributes
     */
    clone(): GettextTranslationAttributesInterface;
}
