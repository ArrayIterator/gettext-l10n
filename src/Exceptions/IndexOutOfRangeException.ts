import L10nException from "./L10nException";

export default class IndexOutOfRangeException extends L10nException {
    public constructor(index: number, length: number) {
        super(`Index out of range. Index: ${index}, length: ${length}`);
    }
}
