import React from 'react';

import {Suggestion} from '../../Suggestions';
import {getShiftedRange} from '../../ChordUtils';

/**
 * The note interval. (Nothing is shown if there are no suggestions.)
 */
export const IntervalWidget = ({
    suggestion,
    range,
    additionalClass,
} : {
    suggestion: Suggestion | undefined,
    range: string,
    additionalClass: string,
}) => {
    if (!suggestion || !range) {
        return null;
    }
    return (
        <p className={[additionalClass, 'songNormalVerse'].join(' ')}>
            Interval: {getShiftedRange(range, suggestion.rangeShift)}
        </p>);
};
