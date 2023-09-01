/* eslint-disable max-len */  //ttt9: remove
import React from 'react';

import '../legacy.css';
import {SongRenderConfig} from '../SongRenderConfig';
import {getAllChords, Song} from '../Song';
import {ReactSetter2} from '../Common';
import {ChordsAreaWidget} from './chords/ChordsArea';
import {SongBodyWidget} from './SongBody';


//ttt0 check when same person is lyricist / performer / composer ... and keep one instance of each name, separate by comma



export const SongWidget = ({
    song,
    songRenderConfig,
    capoCbBVal,
    setCapoCbBVal,
} : {
    song: Song,
    songRenderConfig: SongRenderConfig,
    capoCbBVal: string,
    setCapoCbBVal: ReactSetter2<string>,
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

    const [capo, setCapo] = React.useState(0);   //ttt9: link to dropdown
    const [rangeShift, setRangeShift] = React.useState(0);

    return <>
        <ChordsAreaWidget chords={chords} songRenderConfig={songRenderConfig} capoCbBVal={capoCbBVal}
            setCapoCbBVal={setCapoCbBVal} song={song} firstChordCbBVal={firstChordCbBVal}
            setFirstChordCbBVal={setFirstChordCbBVal}/>
        <SongBodyWidget song={song} songRenderConfig={songRenderConfig} capo={capo} rangeShift={rangeShift}/>
    </>;
};

//ttt0: Show the index in the original list regardless of the current sort order, so people can reference them.
// Also, this avoids situations like songs having 0 or multiple entries

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
