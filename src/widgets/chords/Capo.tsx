import React from 'react';

import {Suggestion} from '../../Suggestions';

import '../../legacy.css';

/**
 * The position of the capo. (Nothing is shown if there is no capo.)
 */
export const CapoWidget = ({
    suggestion,
    additionalClass,
} : {
    suggestion: Suggestion | undefined,
    additionalClass: string,
}) => {
    if (!suggestion || suggestion.capo === 0) {
        return null;
    }
    return (
        <p className={[additionalClass, 'songNormalVerse'].join(' ')}>
            |{suggestion.capo}
        </p>);
};
