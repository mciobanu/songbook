import React from 'react';

import {Suggestion} from '../../Suggestions';

import '../../legacy.css';
import {accidentalsToDisplay, getShiftedRange, substituteChords} from '../../ChordUtils';
import {ReactSetter2} from '../../Common';

/**
 * Suggestion buttons. (Nothing is shown if there are no suggestions.)
 */
export const SuggestionListWidget = ({
    chords,
    suggestions,
    range,
    debugEnabled,
    currentSuggestion,
    setCurrentSuggestion,
} : {
    chords: string[],
    suggestions: Suggestion[],
    range: string,
    debugEnabled: boolean,
    currentSuggestion: number,
    setCurrentSuggestion: ReactSetter2<number>,
}) => {
    const onButtonClick = React.useCallback((index: number) => {
        setCurrentSuggestion(index);
        // buildSuggestionCallback(rangeShift2, capo2, s.outsideRange, hash);   //ttt0: JS has something about event.cancelBubble. Review
    }, [setCurrentSuggestion]);

    const buttons = React.useMemo(() => {
        return suggestions.map((crtSuggestion, index) => {
            const rangeShift2 = crtSuggestion.rangeShift;
            const capo2 = crtSuggestion.capo;
            let currentInfo = '';
            currentInfo += substituteChords(chords[0], rangeShift2, capo2, false);
            if (capo2 !== 0) {
                currentInfo += `|${capo2}`;
            }
            currentInfo += ` ${getShiftedRange(range, rangeShift2)}`;
            if (debugEnabled) {
                currentInfo += ` ${crtSuggestion.score}`;
            }
            return <button className='btnNormal' onClick={() => onButtonClick(index)}
                disabled={index === currentSuggestion} key={index}>
                {accidentalsToDisplay(currentInfo)}
            </button>;
        });
    }, [chords, currentSuggestion, debugEnabled, onButtonClick, range, suggestions]);
    if (!suggestions.length) {
        return null;
    }
    return (
        <p className={'suggestion'}>
            {buttons}
        </p>);
};
