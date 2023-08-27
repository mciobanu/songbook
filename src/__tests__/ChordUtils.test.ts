import {describe, expect, test} from '@jest/globals';

import {getShiftedRange} from '../ChordUtils';


describe('getShiftedRange', () => {
    describe('positive 1', () => {
        test('getShiftedRange(\'A-F\', 2) should return B-G', () => {
            const result = getShiftedRange('A-F', 2);
            expect(result).toBe('B-G');
        });
    });

    describe('positive 2', () => {
        test('getShiftedRange(\'G-D♯\', 2) should return A-F', () => {
            const result = getShiftedRange('G-D♯', 2);
            expect(result).toBe('A-F');
        });
    });

    describe('positive 3', () => {
        test('getShiftedRange(\'G-D♯+\', 2) should return A-F+', () => {
            const result = getShiftedRange('G-D♯+', 2);
            expect(result).toBe('A-F+');
        });
    });

    describe('negative 1', () => {
        test('getShiftedRange(\'A-F\', -2) should return G-D♯', () => {
            const result = getShiftedRange('A-F', -2);
            expect(result).toBe('G-D♯');
        });
    });

    describe('negative 2', () => {
        test('getShiftedRange(\'F-D♯+\', -5) should return C-A♯+', () => {
            const result = getShiftedRange('F-D♯+', -5);
            expect(result).toBe('C-A♯+');
        });
    });
});
