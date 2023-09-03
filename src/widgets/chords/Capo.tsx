import React from 'react';

import {getGoodRangeClass, Suggestion} from '../../Suggestions';

import '../../legacy.css';

/**
 * The position of the capo. (Nothing is shown if there is no capo.)
 */
export const CapoWidget = ({
    suggestion,
} : {
    suggestion: Suggestion | undefined,
}) => {
    if (!suggestion || suggestion.capo === 0) {
        return null;
    }
    return (
        <p className={[getGoodRangeClass(suggestion), 'songNormalVerse'].join(' ')}>
            |{suggestion.capo}
        </p>);
};
