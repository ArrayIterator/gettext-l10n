import GettextFlagsInterface from "../../Interfaces/Gettext/Metadata/Attributes/GettextFlagsInterface";
import GettextCommentsInterface from "../../Interfaces/Gettext/Metadata/Attributes/GettextCommentsInterface";
import Flags from "./Attributes/Flags";
import Comments from "./Attributes/Comments";
import References from "./Attributes/References";
import GettextReferencesInterface from "../../Interfaces/Gettext/Metadata/Attributes/GettextReferencesInterface";
import GettextTranslationAttributesInterface
    from "../../Interfaces/Gettext/Metadata/GettextTranslationAttributesInterface";
import GettextExtractedCommentsInterface
    from "../../Interfaces/Gettext/Metadata/Attributes/GettextExtractedCommentsInterface";
import ExtractedComments from "./Attributes/ExtractedComments";

export default class TranslationAttributes implements GettextTranslationAttributesInterface {

    /**
     * Gettext flags
     *
     * @protected
     */
    protected _flags: GettextFlagsInterface;

    /**
     * Comments
     *
     * @protected
     */
    protected _comments: GettextCommentsInterface;

    /**
     * Extracted comments
     *
     * @protected
     */
    protected _extractedComments: GettextExtractedCommentsInterface;

    /**
     * References
     *
     * @protected
     */
    protected _references: GettextReferencesInterface;

    /**
     * Constructor
     *
     * @param {GettextFlagsInterface} flags
     * @param {GettextCommentsInterface} comments
     * @param {GettextExtractedCommentsInterface} extractedComments
     * @param {GettextReferencesInterface} references
     */
    constructor(
        flags?: GettextFlagsInterface,
        comments?: GettextCommentsInterface,
        extractedComments?: GettextExtractedCommentsInterface,
        references?: GettextReferencesInterface
    ) {
        this._flags = flags || new Flags();
        this._comments = comments || new Comments();
        this._extractedComments = extractedComments || new ExtractedComments();
        this._references = references || new References();
    }

    /**
     * @inheritDoc
     */
    public get flags(): GettextFlagsInterface {
        return this._flags;
    }

    /**
     * @inheritDoc
     */
    public get comments(): GettextCommentsInterface {
        return this._comments;
    }

    /**
     * @inheritDoc
     */
    public get extractedComments(): GettextExtractedCommentsInterface {
        return this._extractedComments;
    }

    /**
     * @inheritDoc
     */
    public get references(): GettextReferencesInterface {
        return this._references;
    }

    /**
     * @inheritDoc
     */
    public clone(): GettextTranslationAttributesInterface {
        return new (this.constructor as any)(
            this.flags.clone() as GettextFlagsInterface,
            this.comments.clone() as GettextCommentsInterface,
            this.extractedComments.clone() as GettextExtractedCommentsInterface,
            this.references.clone() as GettextReferencesInterface
        );
    }
}
