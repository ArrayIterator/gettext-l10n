import IterableArray from '../../Utils/IterableArray';

describe('IterableArray', () => {
    let iterableArray: IterableArray<number>;

    beforeEach(() => {
        iterableArray = new IterableArray<number>([1, 2, 3, 4, 5]);
    });

    /**
     * Test to check if the IterableArray initializes with the given array.
     */
    test('should initialize with the given array', () => {
        expect(iterableArray.getArrayCopy()).toEqual([1, 2, 3, 4, 5]);
    });

    /**
     * Test to check if the IterableArray iterates over the elements correctly.
     */
    test('should iterate over the elements', () => {
        const result: number[] = [];
        for (const item of iterableArray) {
            result.push(item);
        }
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    /**
     * Test to check if the map method works correctly.
     */
    test('should support the map method', () => {
        const mapped = iterableArray.map(x => x * 2);
        expect(mapped).toEqual([2, 4, 6, 8, 10]);
    });

    /**
     * Test to check if the filter method works correctly.
     */
    test('should support the filter method', () => {
        const filtered = iterableArray.filter(x => x % 2 === 0);
        expect(filtered).toEqual([2, 4]);
    });

    /**
     * Test to check if the reduce method works correctly.
     */
    test('should support the reduce method', () => {
        const sum = iterableArray.reduce((acc, x) => acc + x, 0);
        expect(sum).toBe(15);
    });

    /**
     * Test to check if the find method works correctly.
     */
    test('should support the find method', () => {
        const found = iterableArray.find(x => x > 3);
        expect(found).toBe(4);
    });

    /**
     * Test to check if the some method works correctly.
     */
    test('should support the some method', () => {
        const hasEven = iterableArray.some(x => x % 2 === 0);
        expect(hasEven).toBe(true);
    });

    /**
     * Test to check if the every method works correctly.
     */
    test('should support the every method', () => {
        const allPositive = iterableArray.every(x => x > 0);
        expect(allPositive).toBe(true);
    });

    /**
     * Test to check if the clear method works correctly.
     */
    test('should clear the array', () => {
        iterableArray.clear();
        expect(iterableArray.getArrayCopy()).toEqual([]);
    });

    /**
     * Test to check if the length property returns the correct length.
     */
    test('should return the correct length', () => {
        expect(iterableArray.length).toBe(5);
    });

    /**
     * Test to check if the current method returns the current item.
     */
    test('should return the current item', () => {
        expect(iterableArray.current()).toBe(1);
    });

    /**
     * Test to check if the reset method returns the first item.
     */
    test('should return the first item on reset', () => {
        iterableArray.next();
        expect(iterableArray.reset()).toBe(1);
    });

    /**
     * Test to check if the end method returns the last item.
     */
    test('should return the last item on end', () => {
        expect(iterableArray.end()).toBe(5);
    });

    /**
     * Test to check if the key method returns the key of the current item.
     */
    test('should return the key of the current item', () => {
        expect(iterableArray.key()).toBe(0);
    });

    /**
     * Test to check if the prev method returns the previous item.
     */
    test('should return the previous item', () => {
        iterableArray.next();
        expect(iterableArray.prev()).toBe(1);
    });

    /**
     * Test to check if the next method returns the next item.
     */
    test('should return the next item', () => {
        expect(iterableArray.next()).toBe(2);
    });

    /**
     * Test to check if the seek method seeks to a specific index.
     */
    test('should seek to a specific index', () => {
        expect(iterableArray.seek(3)).toBe(4);
    });

    /**
     * Test to check if the clone method clones the iterable array.
     */
    test('should clone the iterable array', () => {
        const clone = iterableArray.clone();
        expect(clone.getArrayCopy()).toEqual([1, 2, 3, 4, 5]);
    });
});
