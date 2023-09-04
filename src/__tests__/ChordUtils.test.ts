import {describe, expect, test} from '@jest/globals';

import {getShiftedRange, substituteChords} from '../ChordUtils';


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


describe('substituteChords', () => {
    function hlp(chordList: string, rangeShift: number, capo: number, showCapo: boolean, expected: string) {
        test(`substituteChords('${chordList}', ${rangeShift}, ${capo}, ${showCapo}) should return '${expected}'`,
                () => {
                    const result = substituteChords(chordList, rangeShift, capo, showCapo);
                    expect(result).toBe(expected);
                });
    }

    hlp('Am', 1, 3, false, 'Gm');
    hlp('Am', 1, 3, true, 'Gm|3');
    hlp('Am', 0, 2, true, 'Gm|2');

    hlp('Am abc[Gm]', 1, 3, true, 'Gm|3 abc[Fm|3]');
    hlp('Am(C) E(Gadd7)', 1, 3, true, 'Gm|3(A♯)|3 D|3(Fadd7)|3');
    hlp('Am(C) E(Gadd7)', 1, 3, false, 'Gm(A♯) D(Fadd7)');

    hlp('Cadd7', 2, 3, false, 'Badd7');
});
