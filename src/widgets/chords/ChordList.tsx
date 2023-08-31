import React from 'react';

import {getGoodRangeClass, getSuggestionOrDefault, Suggestion} from '../../Suggestions';
import {accidentalsToDisplay, getShiftedRange, substituteChords} from '../../ChordUtils';

import '../../legacy.css';

/**
 * The chord list. (Nothing is shown if there are no suggestions.)
 */
export const ChordListWidget = ({
    suggestions,
    currentSuggestion,
    chords,
} : {
    suggestions: Suggestion[],
    currentSuggestion: number,
    chords: string[],
}) => {
    const s = React.useMemo(() => {
        return getSuggestionOrDefault(suggestions, currentSuggestion);
    }, [currentSuggestion, suggestions]);
    const shiftedChords = React.useMemo(() => {
        return chords.map((chord) => {
            return accidentalsToDisplay(substituteChords(chord, s.rangeShift, s.capo, false));
            //ttt0: substituteChords() is like in JS, but perhaps substituteChord() is good enough. Is it for things like "Am(C)" in "Om bun"? (It doesn't work in that case anyway)
        });
    }, [chords, s.capo, s.rangeShift]);
    if (!suggestions.length) {
        return null;
    }
    return (
        <p className={[getGoodRangeClass(s), 'songNormalVerse'].join(' ')}>
            Acorduri: {shiftedChords.join(', ')}
        </p>);
};
