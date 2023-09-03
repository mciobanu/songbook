import React from 'react';

import {getGoodRangeClass, Suggestion} from '../../Suggestions';
import {getShiftedRange} from '../../ChordUtils';

/**
 * The note interval. (Nothing is shown if there are no suggestions.)
 */
export const IntervalWidget = ({
    suggestion,
    range,
} : {
    suggestion: Suggestion | undefined,
    currentSuggestion: number,
    range: string,
}) => {
    if (!suggestion || !range) {
        return null;
    }
    return (
        <p className={[getGoodRangeClass(suggestion), 'songNormalVerse'].join(' ')}>
            Interval: {getShiftedRange(range, suggestion.rangeShift)}
        </p>);
};
