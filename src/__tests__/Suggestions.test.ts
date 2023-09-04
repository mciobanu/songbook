import {describe, expect, test} from '@jest/globals';

import {AUTO, CAPO_AUTO} from '../ChordUtils';
import {forTestComputeScore, Suggestion} from '../Suggestions';



describe('computeScore', () => {
    function hlp(suggestionCapo: number, suggestionRangeShift: number,
        chords: string[], capo: number, maxCapo: number, firstChord: string,
        songNumRange: number[], voiceNumRange: number[], expected: number) {

        const suggestion: Suggestion = {
            rangeShift: -1, //!!! rangeShift and capo cannot be AUTO or -1, but will be changed in the test. A suggestion's rangeShift and capo must be between 0 and 11
            capo: -1,
            outsideRange: false,
            voiceOut: -1,
            score: -1,
            index: -1,
        };

        const suggestion1 = suggestion; // to avoid warnings about changing the params
        suggestion1.capo = suggestionCapo;
        suggestion1.rangeShift = suggestionRangeShift;

        test(`computeScore('${suggestion}, ${chords}, ${capo}, ${maxCapo}, ${firstChord}, ${songNumRange}, `
                + `${voiceNumRange}') should return '${expected}'`, () => {
            forTestComputeScore(suggestion, chords, capo, maxCapo, firstChord, songNumRange, voiceNumRange);
            expect(suggestion.score).toBe(expected);
            console.log(`actual chords for [chords:[${chords}], capo:${capo}, maxCapo:${maxCapo}, `
                + `firstChord:${firstChord}, songNumRange:${songNumRange}, voiceNumRange:${voiceNumRange}`
                + `] and [suggestionCapo:${suggestionCapo}, suggestionRangeShift:${suggestionRangeShift}`
                + `] => score:${suggestion.score} outsideRange:${suggestion.outsideRange}`
                + `, voiceOut:${suggestion.voiceOut}, chords:[${suggestion.dbg?.shiftedChords}]`);
        });
    }

    hlp(0, 0, ['Am', 'Dm', 'E'], CAPO_AUTO, 5, AUTO, [2, 14], [1, 16], 0.5);
    hlp(0, 0, ['Am', 'Dm', 'E'], 0, 5, AUTO, [2, 14], [1, 16], 0.5);
    hlp(0, 0, ['Am', 'Dm', 'E'], 2, 5, AUTO, [2, 14], [1, 16], 1_000_000);
    hlp(0, 0, ['Am(C)', 'Dm', 'E'], CAPO_AUTO, 5, AUTO, [2, 14], [1, 16], 0.5);
    hlp(2, 2, ['Am', 'Dm', 'E'], CAPO_AUTO, 5, AUTO, [2, 14], [1, 16], 1.5);
    hlp(5, 3, ['Am', 'Dm', 'E'], CAPO_AUTO, 5, AUTO, [2, 14], [0, 18], 17);
    //ttt1: Add more tests
});
