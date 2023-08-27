import {describe, expect, test} from '@jest/globals';

const sum = (a: number, b: number) => {
    return a + b;
};

describe('sum module', () => {
    test('adds 1 + 2 to equal 3', () => {
        const c = sum(1, 2);
        expect(c).toBe(3);
    });
});
