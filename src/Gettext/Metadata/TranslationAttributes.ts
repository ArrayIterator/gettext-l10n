import GettextFlagsInterface from '../Interfaces/Metadata/Attributes/GettextFlagsInterface';
import GettextCommentsInterface from '../Interfaces/Metadata/Attributes/GettextCommentsInterface';
import Flags from './Attributes/Flags';
import Comments from './Attributes/Comments';
import References from './Attributes/References';
import GettextReferencesInterface from '../Interfaces/Metadata/Attributes/GettextReferencesInterface';
import GettextTranslationAttributesInterface from '../Interfaces/Metadata/GettextTranslationAttributesInterface';
import GettextExtractedCommentsInterface from '../Interfaces/Metadata/Attributes/GettextExtractedCommentsInterface';
import ExtractedComments from './Attributes/ExtractedComments';

/**
 * Class to handle translation attributes
 */
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
    public constructor(
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
    public getFlags(): GettextFlagsInterface {
        return this._flags;
    }

    /**
     * @inheritDoc
     */
    public get flags(): GettextFlagsInterface {
        return this.getFlags();
    }

    /**
     * @inheritDoc
     */
    public getComments(): GettextCommentsInterface {
        return this._comments;
    }

    /**
     * @inheritDoc
     */
    public get comments(): GettextCommentsInterface {
        return this.getComments();
    }

    /**
     * @inheritDoc
     */
    public getExtractedComments(): GettextExtractedCommentsInterface {
        return this._extractedComments;
    }

    /**
     * @inheritDoc
     */
    public get extractedComments(): GettextExtractedCommentsInterface {
        return this.getExtractedComments();
    }

    /**
     * @inheritDoc
     */
    public getReferences(): GettextReferencesInterface {
        return this._references;
    }

    /**
     * @inheritDoc
     */
    public get references(): GettextReferencesInterface {
        return this.getReferences();
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
