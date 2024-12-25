import ArrayString from '../../Abstracts/ArrayString';
import InvalidArgumentException from '../../Exceptions/InvalidArgumentException';

/**
 * Test class extending ArrayString for testing purposes.
 */
class TestArrayString extends ArrayString {
    // Implement any abstract methods if necessary
}

describe('ArrayString', () => {
    let arrayString: TestArrayString;

    beforeEach(() => {
        arrayString = new TestArrayString();
    });

    /**
     * Test to check if ArrayString initializes with an empty array.
     */
    test('should initialize with an empty array', () => {
        expect(arrayString.all).toEqual([]);
    });

    /**
     * Test to check if ArrayString adds a string to the array.
     */
    test('should add a string to the array', () => {
        arrayString.add('test');
        expect(arrayString.all).toContain('test');
    });

    /**
     * Test to check if ArrayString removes a string from the array.
     */
    test('should remove a string from the array', () => {
        arrayString.add('test');
        arrayString.remove('test');
        expect(arrayString.all).not.toContain('test');
    });

    /**
     * Test to check if ArrayString does not remove a string that does not exist.
     */
    test('should not remove a string that does not exist', () => {
        arrayString.add('test');
        arrayString.remove('nonexistent');
        expect(arrayString.all).toContain('test');
    });

    /**
     * Test to check if ArrayString returns true if the string exists in the array.
     */
    test('should return true if the string exists in the array', () => {
        arrayString.add('test');
        expect(arrayString.has('test')).toBe(true);
    });

    /**
     * Test to check if ArrayString returns false if the string does not exist in the array.
     */
    test('should return false if the string does not exist in the array', () => {
        expect(arrayString.has('nonexistent')).toBe(false);
    });

    /**
     * Test to check if ArrayString returns all strings in the array.
     */
    test('should return all strings in the array', () => {
        arrayString.add('test1');
        arrayString.add('test2');
        expect(arrayString.all).toEqual(['test1', 'test2']);
    });

    /**
     * Test to check if ArrayString returns the length of the array.
     */
    test('should return the length of the array', () => {
        arrayString.add('test1');
        arrayString.add('test2');
        expect(arrayString.length).toBe(2);
    });

    /**
     * Test to check if ArrayString iterates over the strings in the array.
     */
    test('should iterate over the strings in the array', () => {
        arrayString.add('test1');
        arrayString.add('test2');
        const iterator = arrayString[Symbol.iterator]();
        expect(iterator.next().value).toBe('test1');
        expect(iterator.next().value).toBe('test2');
    });

    /**
     * Test to check if ArrayString merges with another ArrayString instance.
     */
    test('should merge with another ArrayString instance', () => {
        const anotherArrayString = new TestArrayString();
        anotherArrayString.add('test3');
        arrayString.add('test1');
        arrayString.add('test2');
        const mergedArrayString = arrayString.mergeWith(anotherArrayString);
        expect(mergedArrayString.all).toEqual(['test1', 'test2', 'test3']);
        expect(arrayString.all).toEqual(['test1', 'test2']);
        expect(anotherArrayString.all).toEqual(['test3']);
        expect(anotherArrayString).not.toBe(arrayString);
        expect(mergedArrayString).not.toBe(arrayString);
        expect(mergedArrayString).not.toBe(anotherArrayString);
    });

    /**
     * Test to check if ArrayString throws an error when merging with an invalid instance.
     */
    test('should throw an error when merging with an invalid instance', () => {
        const invalidInstance = {} as ArrayString;
        expect(() => arrayString.mergeWith(invalidInstance)).toThrow(InvalidArgumentException);
    });

    /**
     * Test to check if ArrayString is iterable.
     */
    test('should be iterable', () => {
        arrayString.add('test1');
        arrayString.add('test2');
        const elements : Array<string> = [];
        for (const element of arrayString) {
            elements.push(element);
        }
        expect(elements).toEqual(arrayString.all);
    });
});
