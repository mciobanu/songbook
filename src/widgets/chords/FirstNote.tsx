import React from 'react';

import {Suggestion} from '../../Suggestions';
import {accidentalsToDisplay, substituteChords} from '../../ChordUtils';

import '../../legacy.css';

/**
 * The first note of the song. (Nothing is shown if a first note isn't defined or is empty.)
 */
export const FirstNoteWidget = ({
    suggestion,
    firstNote,
    lastInList,
} : {
    suggestion: Suggestion | undefined,
    firstNote: string | undefined,
    lastInList: boolean,  //ttt0: do something about this hack: get rid of songNormalVerse in ChordsArea and add some space after whatever happens to be the last
}) => {
    const shiftedFirstNote = React.useMemo(() => {
        //return accidentalsToDisplay(substituteChords(firstNote ?? 'C', s.rangeShift, s.capo, false)); //!!! "??" Works for undefined and null, but not for ''. True, this shouldn't happen, but it may
        return accidentalsToDisplay(substituteChords(firstNote || 'C', suggestion?.rangeShift || 0,
                suggestion?.capo || 0, false));
        //ttt0: substituteChords() is like in JS, but perhaps substituteChord() is good enough. Is it for things like "Am(C)" in "Om bun"? (It doesn't work in that case, and here we have a single note anyway)
    }, [firstNote, suggestion]);
    if (!suggestion || !firstNote) {
        return null;
    }
    return (
        <p className={lastInList ? 'songLastVerse' : 'songNormalVerse'}>
            Prima notă: {shiftedFirstNote}
        </p>);
};
