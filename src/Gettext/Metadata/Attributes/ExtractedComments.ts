import GettextExtractedCommentsInterface
    from "../../../Interfaces/Gettext/Metadata/Attributes/GettextExtractedCommentsInterface";
import Comments from "./Comments";
import GettextCommentsInterface from "../../../Interfaces/Gettext/Metadata/Attributes/GettextCommentsInterface";

export default class ExtractedComments extends Comments implements GettextExtractedCommentsInterface {

    /**
     * @inheritDoc
     */
    clone(): GettextCommentsInterface {
        return new (this.constructor as any)(...this.all);
    }
}
