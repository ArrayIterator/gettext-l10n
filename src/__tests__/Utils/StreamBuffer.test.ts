import InvalidArgumentException from '../../Exceptions/InvalidArgumentException';
import StreamBuffer from '../../Utils/StreamBuffer';

describe('StreamBuffer', () => {
    /**
     * Test to check if StreamBuffer initializes with a string.
     */
    test('should initialize with a string', () => {
        const buffer = new StreamBuffer('hello');
        expect(buffer.size).toBe(5);
        expect(buffer.toString()).toBe('hello');
    });

    /**
     * Test to check if StreamBuffer initializes with an ArrayBuffer.
     */
    test('should initialize with an ArrayBuffer', () => {
        const arrayBuffer = new TextEncoder().encode('hello').buffer;
        const buffer = new StreamBuffer(arrayBuffer);
        expect(buffer.size).toBe(5);
        expect(buffer.toString()).toBe('hello');
    });

    /**
     * Test to check if StreamBuffer throws an error for invalid content.
     */
    test('should throw an error for invalid content', () => {
        expect(() => new StreamBuffer(123 as unknown as string)).toThrow(InvalidArgumentException);
    });

    /**
     * Test to check if StreamBuffer seeks to a specific offset.
     */
    test('should seek to a specific offset', () => {
        const buffer = new StreamBuffer('hello');
        expect(buffer.seek(2)).toBe(true);
        expect(buffer.read(3)).toBe('llo');
    });

    /**
     * Test to check if StreamBuffer does not seek beyond the buffer size.
     */
    test('should not seek beyond the buffer size', () => {
        const buffer = new StreamBuffer('hello');
        expect(buffer.seek(10)).toBe(false);
        expect(buffer.read(1)).toBe('');
    });

    /**
     * Test to check if StreamBuffer reads a string of specific bytes.
     */
    test('should read a string of specific bytes', () => {
        const buffer = new StreamBuffer('hello');
        expect(buffer.read(2)).toBe('he');
        expect(buffer.read(3)).toBe('llo');
    });

    /**
     * Test to check if StreamBuffer reads an 8-bit unsigned integer.
     */
    test('should read an 8-bit unsigned integer', () => {
        const buffer = new StreamBuffer(new Uint8Array([1, 2, 3]));
        expect(buffer.readUint8()).toBe(1);
        expect(buffer.readUint8()).toBe(2);
        expect(buffer.readUint8()).toBe(3);
    });

    /**
     * Test to check if StreamBuffer reads a 16-bit unsigned integer.
     */
    test('should read a 16-bit unsigned integer', () => {
        const buffer = new StreamBuffer(new Uint8Array([1, 0, 2, 0]));
        expect(buffer.readUint16(true)).toBe(1);
        expect(buffer.readUint16(true)).toBe(2);
    });

    /**
     * Test to check if StreamBuffer reads a 32-bit unsigned integer.
     */
    test('should read a 32-bit unsigned integer', () => {
        const buffer = new StreamBuffer(new Uint8Array([1, 0, 0, 0, 2, 0, 0, 0]));
        expect(buffer.readUint32(true)).toBe(1);
        expect(buffer.readUint32(true)).toBe(2);
    });

    /**
     * Test to check if StreamBuffer reads a 64-bit unsigned integer.
     */
    test('should read a 64-bit unsigned integer', () => {
        const buffer = new StreamBuffer(new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0]));
        expect(buffer.readUint64()).toBe(1);
        expect(buffer.readUint64()).toBe(2);
    });

    /**
     * Test to check if StreamBuffer clears the buffer.
     */
    test('should clear the buffer', () => {
        const buffer = new StreamBuffer('hello');
        buffer.clear();
        expect(buffer.size).toBe(0);
        expect(buffer.toString()).toBe('');
    });
});
