import React from 'react';

import {getGoodRangeClass, getSuggestionOrDefault, Suggestion} from '../../Suggestions';

import '../../legacy.css';

/**
 * The position of the capo. (Nothing is shown if there is no capo.)
 */
export const CapoWidget = ({
    suggestions,
    currentSuggestion,
} : {
    suggestions: Suggestion[],
    currentSuggestion: number,
}) => {
    const s = React.useMemo(() => {
        return getSuggestionOrDefault(suggestions, currentSuggestion);
    }, [currentSuggestion, suggestions]);
    if (!suggestions.length || s.capo === 0) {
        return null;
    }
    return (
        <p className={[getGoodRangeClass(s), 'songNormalVerse'].join(' ')}>
            |{s.capo}
        </p>);
};
