import {describe, expect, test} from '@jest/globals';

import {forTestCreateFirstChordOptions} from '../FirstChordDropdown';
import {AUTO, NOTES} from '../../../ChordUtils';



describe('createFirstChordOptions', () => {

    describe('simple', () => {
        function buildExpected1(quality: string): string[] {
            const res = [AUTO];
            for (let i = 0; i < 12; i++) {
                res.push(NOTES[i] + quality);
            }
            return res;
        }

        function hlp1(chords: string[], expectedQuality: string) {
            const expected = buildExpected1(expectedQuality);
            test(`createFirstChordOptions('${chords}') should return '${expected}'`, () => {
                const result = forTestCreateFirstChordOptions(chords);
                expect(result).toStrictEqual(expected);
            });
        }

        hlp1(['Am', 'E'], 'm');
        hlp1(['A♯', 'G'], '');
    });

    describe('with alternatives', () => {
        function hlp2(chords: string[], expected: string[]) {
            test(`createFirstChordOptions('${chords}') should return '${expected}'`, () => {
                const result = forTestCreateFirstChordOptions(chords);
                expect(result).toStrictEqual(expected);
            });
        }

        hlp2(['Am(C)', 'E'], [
            'auto',
            'Cm(D♯)',
            'C♯m(E)',
            'Dm(F)',
            'D♯m(F♯)',
            'Em(G)',
            'Fm(G♯)',
            'F♯m(A)',
            'Gm(A♯)',
            'G♯m(B)',
            'Am(C)',
            'A♯m(C♯)',
            'Bm(D)',
        ]);

        hlp2(['Cm(D♯)', 'E'], [
            'auto',
            'Cm(D♯)',
            'C♯m(E)',
            'Dm(F)',
            'D♯m(F♯)',
            'Em(G)',
            'Fm(G♯)',
            'F♯m(A)',
            'Gm(A♯)',
            'G♯m(B)',
            'Am(C)',
            'A♯m(C♯)',
            'Bm(D)',
        ]);

        hlp2(['Bm(D)', 'E'], [
            'auto',
            'Cm(D♯)',
            'C♯m(E)',
            'Dm(F)',
            'D♯m(F♯)',
            'Em(G)',
            'Fm(G♯)',
            'F♯m(A)',
            'Gm(A♯)',
            'G♯m(B)',
            'Am(C)',
            'A♯m(C♯)',
            'Bm(D)',
        ]);

        hlp2(['C♯m(E)', 'E'], [
            'auto',
            'Cm(D♯)',
            'C♯m(E)',
            'Dm(F)',
            'D♯m(F♯)',
            'Em(G)',
            'Fm(G♯)',
            'F♯m(A)',
            'Gm(A♯)',
            'G♯m(B)',
            'Am(C)',
            'A♯m(C♯)',
            'Bm(D)',
        ]);
    });
});
