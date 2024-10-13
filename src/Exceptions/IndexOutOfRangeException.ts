import L10nException from './L10nException';

/**
 * Exception thrown when an index is out of range
 */
export default class IndexOutOfRangeException extends L10nException {
    /**
     * The index
     */
    public readonly index: number|undefined;

    /**
     * The length
     */
    public readonly length: number|undefined;

    /**
     * IndexOutOfRangeException constructor
     *
     * @param {number} index the index
     * @param {number} length the length
     */
    public constructor(index?: number, length?: number) {
        super(`Index out of range. Index: ${index}, length: ${length}`);
        this.index = typeof index === 'number' && index >= 0 ? index : undefined;
        this.length = typeof length === 'number' && length >= 0 ? length : undefined;
    }
}
