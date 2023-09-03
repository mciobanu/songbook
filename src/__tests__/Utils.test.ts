import {describe, expect, test} from '@jest/globals';

import {arraysAreEqual} from '../Utils';


describe('arraysAreEqual', () => {
    describe('eq 1', () => {
        test('arraysAreEqual([1, 2], [1, 2]) should return true', () => {
            const result = arraysAreEqual([1, 2], [1, 2]);
            expect(result).toBe(true);
        });

        test('arraysAreEqual([1, 2], [2, 1]) should return false', () => {
            const result = arraysAreEqual([1, 2], [2, 1]);
            expect(result).toBe(false);
        });

        test('arraysAreEqual([1, 2], [2]) should return false', () => {
            const result = arraysAreEqual([1, 2], [2]);
            expect(result).toBe(false);
        });

        test('arraysAreEqual([1, 2], [1]) should return false', () => {
            const result = arraysAreEqual([1, 2], [1]);
            expect(result).toBe(false);
        });

        test('arraysAreEqual([1], [1]) should return true', () => {
            const result = arraysAreEqual([1], [1]);
            expect(result).toBe(true);
        });

        test('arraysAreEqual([], []) should return true', () => {
            const result = arraysAreEqual([], []);
            expect(result).toBe(true);
        });

        test('arraysAreEqual([undefined], [2, 1]) should return false', () => {
            const result = arraysAreEqual(undefined, [2, 1]);
            expect(result).toBe(false);
        });

        test('arraysAreEqual(undefined, undefined) should return false', () => {
            const result = arraysAreEqual(undefined, undefined);
            expect(result).toBe(false);
        });
    });
});
