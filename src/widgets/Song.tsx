import React from 'react';

import '../legacy.css';
import {SongRenderConfig, voiceRange} from '../SongRenderConfig';
import {getAllChords, Song} from '../Song';
import {ReactSetter2} from '../Common';
import {ChordsAreaWidget} from './chords/ChordsArea';
import {SongBodyWidget} from './SongBody';
import {getChordSuggestions} from '../Suggestions';
import {capoStrToNum} from '../ChordUtils';
import {MiscConfig} from '../MiscConfig';


// Paths like "/song-by-position/14"


export const SongWidget = ({
    song,
    songRenderConfig,
    capoCbBVal,
    setCapoCbBVal,
    miscConfig,
} : {
    song: Song,
    songRenderConfig: SongRenderConfig,
    capoCbBVal: string,
    setCapoCbBVal: ReactSetter2<string>,
    miscConfig: MiscConfig,
}) => {
    /*const [chords, setChords] = React.useState(getAllChords(song)); //ttt1: Review situations like this,
    // where it probably makes more sense to use a dummy chord list, as this function call will be replaced in the useEffect() below
    React.useEffect(() => {
        setChords(getAllChords(song));
    }, [song]);*/

    const [firstChordCbBVal, setFirstChordCbBVal] = React.useState<string>(/*computeInitialFirstChord()*/'');

    const chords = React.useMemo(() => {
        return getAllChords(song);
    }, [song]);

    const suggestions = React.useMemo(() => {
        return getChordSuggestions(chords, song.r || '', voiceRange(songRenderConfig),
                songRenderConfig.maxSuggestions, capoStrToNum(capoCbBVal), songRenderConfig.maxCapo, firstChordCbBVal);
    }, [capoCbBVal, chords, firstChordCbBVal, song.r, songRenderConfig]);

    const [currentSuggestion, setCurrentSuggestion] = React.useState(0);
    React.useEffect(() => {
        setCurrentSuggestion(0);
    }, [song]);

    const [capo, rangeShift] = React.useMemo(() => {
        return suggestions.length
            ? [suggestions[currentSuggestion].capo, suggestions[currentSuggestion].rangeShift]
            : [0, 0];
    }, [currentSuggestion, suggestions]);

    return <>
        <ChordsAreaWidget chords={chords} songRenderConfig={songRenderConfig} capoCbBVal={capoCbBVal}
            setCapoCbBVal={setCapoCbBVal} song={song} firstChordCbBVal={firstChordCbBVal}
            setFirstChordCbBVal={setFirstChordCbBVal} suggestions={suggestions} currentSuggestion={currentSuggestion}
            setCurrentSuggestion={setCurrentSuggestion} miscConfig={miscConfig}/>
        <SongBodyWidget song={song} songRenderConfig={songRenderConfig} capo={capo} rangeShift={rangeShift}/>
    </>;
};

// Note: At a time there was this warning:
// Warning: Cannot update a component (`CreateChordWidget`) while rendering a different component (`CreateFirstChordCbB`).
//
// Most advice on the net is about making a call in the body of the function to a setXyz() that was
// defined in a parent component, rather than in a hook, and the advice is to use a hook.
// The situation here was different, as we were in a hook. However, tried tmpFirstChordCbBVal and it
// leads to a stack overflow. Still, despite the warning, things seemed OK. Also, the warning was only seen
// initially, when the page loads, and not at navigation between songs.
//
// The thing is, the warning made sense: The code was in a hook which was called from inside the return statement,
// which renders the current widget. An idea was to have an useEffect that depends on the current song (and
// this is the only reason the song was passed as a parameter), but it didn't work.
//
// The solution was to properly understand the dependencies and add several useEffect hooks that took care of updating
// dependent components when their dependencies changed.
