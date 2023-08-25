import React from 'react';

import {getGoodRangeClass, getSuggestionOrDefault, Suggestion} from '../../Suggestions';
import {getShiftedRange} from '../../ChordUtils';

/**
 * The position of the capo. (Nothing is shown if there is no capo.)
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
        <p className={getGoodRangeClass(s)}>
            Interval: {getShiftedRange(range, s.rangeShift)}
        </p>);
};
