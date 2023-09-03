import React from 'react';

import {Suggestion} from '../../Suggestions';
import {accidentalsToDisplay, substituteChords} from '../../ChordUtils';

import '../../legacy.css';

/**
 * The chord list. (Nothing is shown if there are no suggestions.)
 */
export const ChordListWidget = ({
    suggestion,
    chords,
} : {
    suggestion: Suggestion | undefined,
    chords: string[],
}) => {
    const shiftedChords = React.useMemo(() => {
        return chords.map((chord) => {
            return accidentalsToDisplay(substituteChords(chord, suggestion?.rangeShift || 0, suggestion?.capo || 0,
                    false));
            //ttt1: substituteChords() is like in JS, but perhaps substituteChord() is good enough. Is it for things like "Am(C)" in "Om bun"? (It doesn't work in that case anyway)  //ttt0: So check "Am(C)" in "Om bun"
        });
    }, [chords, suggestion]);
    if (!suggestion) {
        return null;
    }
    return (
        <p className={'songNormalVerse'}>
            Acorduri: {shiftedChords.join(', ')}
        </p>);
};
