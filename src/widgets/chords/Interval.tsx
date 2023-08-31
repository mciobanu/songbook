import React from 'react';

import {getGoodRangeClass, getSuggestionOrDefault, Suggestion} from '../../Suggestions';
import {getShiftedRange} from '../../ChordUtils';

/**
 * The note interval. (Nothing is shown if there are no suggestions.)
 */
export const IntervalWidget = ({
    suggestions,
    currentSuggestion,
    range,
} : {
    suggestions: Suggestion[],
    currentSuggestion: number,
    range: string,
}) => {
    const s = React.useMemo(() => {
        return getSuggestionOrDefault(suggestions, currentSuggestion);
    }, [currentSuggestion, suggestions]);
    if (!suggestions.length || !range) {
        return null;
    }
    return (
        <p className={[getGoodRangeClass(s), 'songNormalVerse'].join(' ')}>
            Interval: {getShiftedRange(range, s.rangeShift)}
        </p>);
};
