// noinspection JSUnusedGlobalSymbols

import {
    is_array_buffer_like_or_view,
    is_integer,
    is_object,
    is_string
} from './Helper';
import InvalidArgumentException from '../Exceptions/InvalidArgumentException';
import ClearableInterface from '../Interfaces/ClearableInterface';

/**
 * StreamBuffer - a buffer for reading streams
 */
export default class StreamBuffer implements ClearableInterface {
    /**
     * The buffer
     *
     * @private
     */
    #buffer: Uint8Array;

    /**
     * The offset
     *
     * @private
     */
    #offset: number = 0;

    /**
     * StreamBuffer constructor
     *
     * @param {string|ArrayBufferLike|{
     *     buffer: ArrayBufferLike
     * }} content the content
     */
    public constructor(content: string | ArrayBufferLike | StreamBuffer | Uint8Array = '') {
        if (!(content instanceof StreamBuffer)) {
            if (is_object(content)
                && 'buffer' in content
                && is_array_buffer_like_or_view(content.buffer)
            ) {
                content = content.buffer as ArrayBufferLike;
            }
            if (!is_string(content) && !is_array_buffer_like_or_view(content)) {
                throw new InvalidArgumentException(
                    `The content must be a string or an ArrayBufferLike, ${typeof content} given`
                );
            }
            if (is_string(content)) {
                this.#buffer = new TextEncoder().encode(content);
            } else if (content instanceof Uint8Array) {
                this.#buffer = new Uint8Array(content.slice());
            } else {
                this.#buffer = new Uint8Array(content);
            }
        } else {
            this.#buffer = new Uint8Array(content.buffer); // copy
        }
    }

    /**
     * Append a string
     *
     * @param {string|ArrayBuffer} string the string to append
     * @return {StreamBuffer} the buffer
     */
    public write(string: string|ArrayBuffer|Uint8Array): this {
        const buffer = is_string(string)
            ? new TextEncoder().encode(string)
            : (string instanceof ArrayBuffer ? new Uint8Array(string) : string);
        this.#buffer = new Uint8Array([...this.#buffer, ...buffer]);
        return this;
    }

    /**
     * Write an 8-bit unsigned integer
     *
     * @param {number} value the unsigned integer
     *
     * @return {StreamBuffer} the buffer
     */
    public writeUint8(value: number): this {
        if (!is_integer(value) || value < 0 || value > 255) {
            throw new InvalidArgumentException(
                `The value must be an integer between 0 and 255, ${typeof value} given`
            );
        }
        return this.write(new Uint8Array([value]));
    }

    /**
     * Write a 16-bit unsigned integer
     *
     * @param {number} value the unsigned integer
     * @param {boolean} littleEndian true if the integer is little endian, false if big endian
     *
     * @return {StreamBuffer} the buffer
     */
    public writeUint16(value: number, littleEndian: boolean = true): this {
        if (!is_integer(value) || value < 0 || value > 65535) {
            throw new InvalidArgumentException(
                `The value must be an integer between 0 and 65535, ${typeof value} given`
            );
        }
        const buffer = new ArrayBuffer(2);
        new DataView(buffer).setUint16(0, value, littleEndian);
        return this.write(new Uint8Array(buffer));
    }

    /**
     * Write a 32-bit unsigned integer
     *
     * @param {number} value the unsigned integer
     * @param {boolean} littleEndian true if the integer is little endian, false if big endian
     *
     * @return {StreamBuffer} the buffer
     */
    public writeUint32(value: number, littleEndian: boolean = true): this {
        if (!is_integer(value) || value < 0 || value > 4294967295) {
            throw new InvalidArgumentException(
                `The value must be an integer between 0 and 4294967295, ${typeof value} given`
            );
        }
        const buffer = new ArrayBuffer(4);
        new DataView(buffer).setUint32(0, value, littleEndian);
        return this.write(new Uint8Array(buffer));
    }

    /**
     * Write a 64-bit unsigned integer
     *
     * @param {number} value the unsigned integer
     *
     * @return {StreamBuffer} the buffer
     */
    public writeUint64(value: number): this {
        if (!is_integer(value) || value < 0) {
            throw new InvalidArgumentException(
                `The value must be an integer between 0 and 18446744073709551615, ${typeof value} given`
            );
        }
        const low = value & 0xffffffff;
        const high = (value >> 0) & 0xffffffff;
        this.writeUint32(low);
        return this.writeUint32(high);
    }

    /**
     * Write a 64-bit unsigned integer
     *
     * @param {number} value the unsigned integer
     *
     * @return {StreamBuffer} the buffer
     */
    public writeUint64LE(value: number): this {
        return this.writeUint64(value);
    }

    /**
     * Write a 64-bit unsigned integer
     *
     * @param {number} value the unsigned integer
     *
     * @return {StreamBuffer} the buffer
     */
    public writeUint64BE(value: number): this {
        if (!is_integer(value) || value < 0) {
            throw new InvalidArgumentException(
                `The value must be an integer between 0 and 18446744073709551615, ${typeof value} given`
            );
        }
        const low = value & 0xffffffff;
        const high = (value >> 0) & 0xffffffff;
        this.writeUint32(high);
        return this.writeUint32(low);
    }

    /**
     * Write a 32-bit unsigned integer
     *
     * @param {number} value the unsigned integer
     *
     * @return {StreamBuffer} the buffer
     */
    public writeUint32LE(value: number): this {
        return this.writeUint32(value);
    }

    /**
     * Write a 32-bit unsigned integer
     *
     * @param {number} value the unsigned integer
     *
     * @return {StreamBuffer} the buffer
     */
    public writeUint32BE(value: number): this {
        if (!is_integer(value) || value < 0 || value > 4294967295) {
            throw new InvalidArgumentException(
                `The value must be an integer between 0 and 4294967295, ${typeof value} given`
            );
        }
        const buffer = new ArrayBuffer(4);
        new DataView(buffer).setUint32(0, value, false);
        return this.write(new Uint8Array(buffer));
    }

    /**
     * Write a 16-bit unsigned integer
     *
     * @param {number} value the unsigned integer
     */
    public writeUint16LE(value: number): this {
        return this.writeUint16(value);
    }

    /**
     * Write a 16-bit unsigned integer
     *
     * @param {number} value the unsigned integer
     * @return {StreamBuffer} the buffer
     */
    public writeUint16BE(value: number): this {
        if (!is_integer(value) || value < 0 || value > 65535) {
            throw new InvalidArgumentException(
                `The value must be an integer between 0 and 65535, ${typeof value} given`
            );
        }
        const buffer = new ArrayBuffer(2);
        new DataView(buffer).setUint16(0, value, false);
        return this.write(new Uint8Array(buffer));
    }

    /**
     * Get the size of the buffer
     *
     * @return {number} the size of the buffer
     */
    public get size(): number {
        return this.#buffer.byteLength;
    }

    /**
     * Seek to a specific offset
     *
     * @param {number} offset the offset
     */
    public seek(offset: number): boolean {
        this.#offset = offset;
        if (this.#offset > this.size) {
            this.#offset = this.size;
            return false;
        }
        return true;
    }

    /**
     * Read a string
     *
     * @param {number} bytes the number of bytes to read
     */
    public read(bytes: number): string {
        const buffer = this.#buffer.slice(this.#offset, this.#offset + bytes);
        this.#offset += bytes;
        return new TextDecoder().decode(buffer);
    }

    /**
     * Read an 8-bit unsigned integer
     *
     * @return {number} the 8-bit unsigned integer
     */
    public readUint8(): number {
        return this.#buffer[this.#offset++];
    }

    /**
     * Read a 16-bit unsigned integer
     *
     * @param {boolean} littleEndian true if the integer is little endian, false if big endian
     */
    public readUint16(littleEndian: boolean = true): number {
        const value = new DataView(this.#buffer.buffer, this.#offset, 2).getUint16(0, littleEndian);
        this.#offset += 2;
        return value;
    }

    /**
     * Read a 32-bit unsigned integer
     *
     * @param {boolean} littleEndian true if the integer is little endian, false if big endian
     */
    public readUint32(littleEndian: boolean = true): number {
        const value = new DataView(this.#buffer.buffer, this.#offset, 4).getUint32(0, littleEndian);
        this.#offset += 4;
        return value;
    }

    /**
     * Read a 64-bit unsigned integer
     *
     * @return {number} the 64-bit unsigned integer
     */
    public readUint64(): number {
        const low = this.readUint32();
        const high = this.readUint32();
        return (high << 0) | low;
    }

    /**
     * Read all the content
     *
     * @return {string} the content
     */
    public toString(): string {
        return new TextDecoder().decode(this.#buffer);
    }

    /**
     * Get the buffer
     *
     * @return {Uint8Array} the buffer
     */
    public get buffer(): Uint8Array {
        return this.#buffer;
    }

    /**
     * Get the offset
     *
     * @return {number} the offset
     */
    public get offset(): number {
        return this.#offset;
    }

    /**
     * Clear the buffer
     *
     * @return {void}
     */
    public clear(): void {
        this.#buffer = new Uint8Array();
        this.#offset = 0;
    }
}
