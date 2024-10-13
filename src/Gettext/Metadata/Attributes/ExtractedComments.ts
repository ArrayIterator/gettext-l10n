import GettextExtractedCommentsInterface from '../../Interfaces/Metadata/Attributes/GettextExtractedCommentsInterface';
import Comments from './Comments';
import GettextCommentsInterface from '../../Interfaces/Metadata/Attributes/GettextCommentsInterface';

/**
 * Extracted comments storage class to handle extracted comments data, extracted comments is a special comments that
 */
export default class ExtractedComments extends Comments implements GettextExtractedCommentsInterface {

    /**
     * @inheritDoc
     */
    public clone(): GettextCommentsInterface {
        return new (this.constructor as any)(...this.all);
    }
}
