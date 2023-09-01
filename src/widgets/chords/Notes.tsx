import React from 'react';

import '../../legacy.css';

/**
 * Comments / notes about the song, usually about tempo
 */
export const NotesWidget = ({
    notes,
} : {
    notes: string[],
}) => {
    return (
        <p className='songLastVerse'>
            {notes.join('; ')}
        </p>);
};
