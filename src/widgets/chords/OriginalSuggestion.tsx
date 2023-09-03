import React from 'react';

//import {getGoodRangeClass, getSuggestionOrDefault, Suggestion} from '../../Suggestions';

import '../../legacy.css';
import {Song} from '../../Song';

/**
 * The original suggestion. (Shown if specifically requested, which was done as a special search word in JS.)
 */
export const OriginalSuggestionWidget = ({
    song,
    chords,
} : {
    song: Song,
    chords: string[],
}) => {
    return (
        <p className={['songLastVerse'].join(' ')}> {/*ttt1 review if we want className to use getGoodRangeClass() */}
            Sugestie originală: {(song.r ? `${song.r} ; ` : '') + chords + (song.f ? ` ; ${song.f}` : '')
                + (song.s ? ` ; (${song.s})` : '')}
        </p>);
};
