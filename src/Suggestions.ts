import {
    AUTO,
    CAPO_AUTO,
    getNumericRange,
    substituteChords,
} from './ChordUtils';

import {debugFmt} from './Common';

export type SuggestionDebug = {
    rangeDiff: number,
    songNumRange: string,
    adjSongRange: string,
    voiceNumRange: string,
    midSong: number,
    midVoice: number,
    shiftedChords: string,
};

/**
 * How suggestions work: There is a fixed list of all the combinations of rangeShift and capo between 0 and 11. Each of
 * these suggestions is evaluated, computing the score (as well as outsideRange and voiceOut), then they are sorted by
 * score, and we take the best ones.     //ttt1: Perhaps adjust count based on maxCapo
 */
export type Suggestion = {
    rangeShift: number, // 0..11
    capo: number, // 0..11
    index: number,
    score: number,
    outsideRange: boolean,
    voiceOut: number,    // "how many semitones the suggestion exceeds the voice, up or down"; not really used for anything, just to help debugging
    dbg?: SuggestionDebug,
};


/**
 * Updates most fields in the suggestion (score, outsideRange, voiceOut, dbg) to reflect how easy the given chords
 * are to play given the first chord and how well the voice fits the current choices based on voice and song ranges and
 * capo position.
 *
 * The values of suggestion.capo and suggestion.rangeShift must be between 0 and 11, not some AUTO.
 *
 * We see how good a match the capo and rangeShift of the suggestion is to the range of the song and the voice, as well
 * as the chord difficulty, computing a score (really a penalty). This happens for all 144 combinations of capo and
 * rangeShift. What can be AUTO are the current capo and first chord, which the user chooses. When these are not AUTO,
 * we must get an exact match, otherwise a huge score gets assigned.
 *
 * @param suggestion
 * @param chords originals, extracted from the song
 * @param capo user's choice
 * @param maxCapo user's choice, from settings
 * @param firstChord user's choice
 * @param songNumRange a song's attribute
 * @param voiceNumRange user's choice, from settings
 */
function computeScore(suggestion: Suggestion, chords: string[], capo: number, maxCapo: number,
    firstChord: string, songNumRange: number[], voiceNumRange: number[]) {

    if (suggestion.capo < 0 || suggestion.capo > 11) {
        throw Error(`Invalid capo in computeScore: ${suggestion.capo}`);
    }
    if (suggestion.rangeShift < 0 || suggestion.rangeShift > 11) {
        throw Error(`Invalid rangeShift in computeScore: ${suggestion.rangeShift}`);
    }

    const suggestion1 = suggestion; // this is to avoid ESLint's no-param-reassign, as the whole purpose
    // of this function is to change its argument
    suggestion1.outsideRange = false;
    let score = 0;
    if ((capo === CAPO_AUTO && suggestion.capo > maxCapo) || (capo !== CAPO_AUTO && suggestion.capo !== capo)) {
        score = 1000000;
        suggestion1.outsideRange = true;
    } else if (firstChord !== AUTO) {
        const shiftedChord = substituteChords(chords[0], suggestion.rangeShift, suggestion.capo, false);
        if (shiftedChord !== firstChord) {
            score = 1000000;
            suggestion1.outsideRange = true;
        }
    }
    let rangeDiff = -1;
    let midSong = -1;
    let midVoice = -1;
    let adjSongRange: number[] = [];
    let shiftedChords = '';   //ttt3 debug only
    if (score === 0) {
        adjSongRange = [songNumRange[0] + suggestion.rangeShift, songNumRange[1] + suggestion.rangeShift];
        midSong = (adjSongRange[0] + adjSongRange[1]) / 2;
        midVoice = (voiceNumRange[0] + voiceNumRange[1]) / 2;
        rangeDiff = midSong - midVoice;
        while (rangeDiff > 6) {
            rangeDiff -= 12;
            adjSongRange = [adjSongRange[0] - 12, adjSongRange[1] - 12];
            midSong -= 12; //!!! debug only
        }
        while (rangeDiff < -6) {
            rangeDiff += 12;
            adjSongRange = [adjSongRange[0] + 12, adjSongRange[1] + 12];
            midSong += 12; //!!! debug only
        }
        score = Math.abs(rangeDiff);
        suggestion1.voiceOut = 0;
        if (adjSongRange[0] < voiceNumRange[0]) {
            const d = voiceNumRange[0] - adjSongRange[0];
            suggestion1.voiceOut = d;
            score += 100 * d * (1.2 ** d); //!!! exponential, so we prefer to go one tone outside voice range at both upper and lower end rather than 2 tones at one end and 0 at the other
            suggestion1.outsideRange = true;
        }
        if (adjSongRange[1] > voiceNumRange[1]) {
            const d = adjSongRange[1] - voiceNumRange[1];
            if (suggestion1.voiceOut < d) {
                suggestion1.voiceOut = d;
            }
            score += 100 * d * (1.2 ** d);
            suggestion1.outsideRange = true;
        }
        for (let i = 0; i < chords.length; ++i) {
            const shiftedChord = substituteChords(chords[i], suggestion.rangeShift, suggestion.capo, false);
            score += getDifficulty(removeAlternatives(shiftedChord));
            shiftedChords += `;${shiftedChord}`;
        }
    }
    suggestion1.score = score;
    suggestion1.dbg = { //ttt3 debug only
        rangeDiff,
        songNumRange: `${songNumRange[0]}-${songNumRange[1]}`,
        adjSongRange: adjSongRange.length ? `${adjSongRange[0]}-${adjSongRange[1]}` : '',
        voiceNumRange: `${voiceNumRange[0]}-${voiceNumRange[1]}`,
        midSong,
        midVoice,
        shiftedChords: shiftedChords ? shiftedChords.substring(1) : shiftedChords,
    };
}

export const forTestComputeScore = computeScore;

/**
 * Removes the alternative from a chord, meaning everything from the first '(' on. To be used only by getDifficulty(),
 * as in the other places we need the full entry for comparison
 *
 * @param chord
 */
function removeAlternatives(chord: string): string {
    const k = chord.indexOf('(');
    return k === -1 ? chord : chord.substring(0, k).trimEnd();
}

export const forTestRemoveAlternatives = removeAlternatives;

const EASY_CHORDS: Map<string, number> = new Map<string, number>([
    ['C', 0],
    ['C7', 0],
    ['D', 0],
    ['D7', 0],
    ['Dm', 0],
    ['Dm7', 0],
    ['E', 0],
    ['E7', 0],
    ['Em', 0],
    ['Em7', 0],
    ['F', 0],
    ['G', 0],
    ['G7', 0],
    ['A', 0],
    ['A7', 0],
    ['Am', 0],
    ['Am7', 0],
    ['B7', 0],
    ['Am6', 0],
    ['Asus', 0],

    ['Gm', 5], //ttt3 improve
    ['B', 5],
    ['F7', 5],
]);


function getDifficulty(chord: string) {
    const k = EASY_CHORDS.get(chord);
    return k || k === 0 ? k : 10;
}

const suggestionList = (() => {
    const res: Suggestion[] = [];
    for (let rangeShift = 0; rangeShift < 12; ++rangeShift) {
        for (let capo = 0; capo <= 11; ++capo) {
            res.push({
                rangeShift,
                capo,
                index: res.length,
                score: -1,
                voiceOut: -1,
                outsideRange: false,
            }); //index is only used to have a consistent order for equal scores
        }
    }
    return res;
})();

/*
chords: string[], capo: number, maxCapo: number,
    firstChord: string, songNumRange: number[], voiceNumRange: number[]
 */


//
/**
 * Returns a list of suggestions (of which the important fields are rangeShift and capo) that try to balance
 * voice range and chord difficulty; looks at both capoCbBVal and firstChordCbBVal to limit results
 *
 * @param chords
 * @param songRange
 * @param voiceRange
 * @param maxSuggestions
 * @param capo
 * @param maxCapo
 * @param firstChord - as selected by the user; could be 'auto'
 */
export function getChordSuggestions(chords: string[], songRange: string, voiceRange: string,
    maxSuggestions: number, capo: number, maxCapo: number, firstChord: string): Suggestion[] {

    //debugger
    const songNumRange = getNumericRange(songRange);

    //const voiceRange = `${rangeMin}-${rangeMax}`;
    const voiceNumRange = getNumericRange(voiceRange);
    const res: Suggestion[] = [];
    if (!songNumRange || !voiceNumRange) {
        return res;
    }

    for (let i = 0; i < suggestionList.length; ++i) {
        const suggestion = suggestionList[i];
        computeScore(suggestion, chords, capo, maxCapo, firstChord, songNumRange, voiceNumRange);
    }
    suggestionList.sort((suggestion1, suggestion2) => {
        const d = suggestion1.score - suggestion2.score;
        return d || suggestion1.index - suggestion2.index;
    }); //ttt3 no need to sort the whole thing to get the best maxSuggestionsVal
    /*for (var i = 0; i < suggestionList.length; ++i) { // debug only
        //console.log('' + JSON.stringify(suggestionList[i]));
        var s = suggestionList[i];
        //console.log(s.rangeShift + ',' + s.capo + ',' + s.voiceOut + ',' + s.score + ',' + s.rangeDiff + ',' + s.songNumRange + ','
        //+ s.adjSongRange + ',' + s.midSong + ',' + s.voiceNumRange + ',' + s.midVoice);

        console.log(s.index + ',' + s.rangeShift + ',' + s.capo + ',' + s.voiceOut + ',' + s.score + ',' + s.rangeDiff + ','
        + s.songNumRange + ',' + s.adjSongRange + ',' + s.midSong + ',' + s.voiceNumRange + ',' + s.midVoice + ',' + s.shiftedChords);

        //console.log(s.rangeShift + ',' + s.capo + ',' + s.voiceOut + ',' + s.score + ',' + s.rangeDiff + ',' + s.songNumRange[0] + '-'
        //+ s.songNumRange[1] + ',' + s.adjSongRange[0] + '-' + s.adjSongRange[1] + ',' + s.midSong + ',' + s.voiceNumRange[0] + '-'
        //+ s.voiceNumRange[1] + ',' + s.midVoice);
    }*/
    for (let i = 0; i < maxSuggestions && i < suggestionList.length; ++i) {
        const suggestion = suggestionList[i];
        if (suggestion.score >= 1000000) {
            break;
        }
        res.push(suggestion);
    }
    /*console.log(`chords:${chords}, songRange:${songRange}, voiceRange:${voiceRange}, `
        + `maxSuggestions:${maxSuggestions}, capo:${capo}, maxCapo:${maxCapo}, firstChord:${firstChord}`);
    console.log(`computed suggestions: ${debugFmt(res)}`);*/
    return res;
}


export function getGoodRangeClass(suggestion: Suggestion) {
    return suggestion.outsideRange ? 'outsideRange' : 'insideRange';
}
