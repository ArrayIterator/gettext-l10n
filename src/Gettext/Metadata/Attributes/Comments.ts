import GettextCommentsInterface from "../../../Interfaces/Gettext/Metadata/Attributes/GettextCommentsInterface";
import ArrayString from "../../../Abstracts/ArrayString";

export default class Comments extends ArrayString implements GettextCommentsInterface {
    /**
     * List of comments
     *
     * @return {Array<string>} list of comments
     */
    public get comments(): Array<string> {
        return this.all;
    }

    /**
     * @inheritDoc
     */
    public clone(): GettextCommentsInterface {
        return new (this.constructor as any)(...this.all);
    }
}
