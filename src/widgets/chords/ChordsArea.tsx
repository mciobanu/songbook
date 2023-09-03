import React from 'react';

import {SongRenderConfig} from '../../SongRenderConfig';
import {ReactSetter2} from '../../Common';
import {DropdownsWidget} from './Dropdowns';
import {getGoodRangeClass, Suggestion} from '../../Suggestions';
import {Song} from '../../Song';
import {CapoWidget} from './Capo';
import {IntervalWidget} from './Interval';
import {ChordListWidget} from './ChordList';
import {FirstNoteWidget} from './FirstNote';
import {OriginalSuggestionWidget} from './OriginalSuggestion';
import {SuggestionListWidget} from './SuggestionList';
import {NotesWidget} from './Notes';
import {MiscConfig} from '../../MiscConfig';

/**
 * Creates the part above the actual song, with chord, capo, suggestions, etc.
 */
export const ChordsAreaWidget = ({
    song,
    chords,
    songRenderConfig,
    capoCbBVal,
    setCapoCbBVal,
    firstChordCbBVal,
    setFirstChordCbBVal,
    suggestions,
    currentSuggestion,
    setCurrentSuggestion,
    miscConfig,
} : {
    song: Song,
    chords: string[],
    songRenderConfig: SongRenderConfig,
    capoCbBVal: string,
    setCapoCbBVal: ReactSetter2<string>,
    firstChordCbBVal: string,
    setFirstChordCbBVal: ReactSetter2<string>,
    suggestions: Suggestion[],
    currentSuggestion: number,
    setCurrentSuggestion: ReactSetter2<number>,
    miscConfig: MiscConfig,
}) => {

    const suggestion = React.useMemo(() => {
        return suggestions.length ? suggestions[currentSuggestion] : undefined;
        //return suggestions[currentSuggestion];  //ttt1: Review what's going on: The type of suggestion should really
        // be "Suggestion|undefined", as you get undefined when the index is out of bounds. Still, to get TypeScript
        // to acknowledge this, the more verbose version above should be used. Perhaps use getAtIndex(), below
    }, [currentSuggestion, suggestions]);

    const rangeFitClass = React.useMemo(() => {
        return suggestion && songRenderConfig.useSuggestions ? getGoodRangeClass(suggestion) : '';
    }, [songRenderConfig.useSuggestions, suggestion]);

    if (!songRenderConfig.showChords || !chords.length) {
        return null;
    }

    return (<>
        <DropdownsWidget chords={chords} songRenderConfig={songRenderConfig} capoCbBVal={capoCbBVal}
            setCapoCbBVal={setCapoCbBVal} firstChordCbBVal={firstChordCbBVal}
            setFirstChordCbBVal={setFirstChordCbBVal} setCurrentSuggestion={setCurrentSuggestion}/>
        <CapoWidget suggestion={suggestion} additionalClass={rangeFitClass}/>
        {song.r && <IntervalWidget suggestion={suggestion} range={song.r}
            additionalClass={rangeFitClass}/>}
        <ChordListWidget suggestion={suggestion} chords={chords}/>
        <FirstNoteWidget suggestion={suggestion} firstNote={song.f} lastInList={!miscConfig.useOriginalSuggestion}/>
        {miscConfig.useOriginalSuggestion && <OriginalSuggestionWidget song={song} chords={chords}/>}
        {song.r && suggestions.length
            && <SuggestionListWidget suggestions={suggestions} currentSuggestion={currentSuggestion}
                setCurrentSuggestion={setCurrentSuggestion} chords={chords} range={song.r}
                debugEnabled={miscConfig.debugEnabled}
            />}
        {song.n && <NotesWidget notes={song.n}/>}
    </>);
};

/* *
 * Returns the element at position "index" in the array. Unlike the normal array lookup, if the array is empty, it
 * returns "undefined". However, if the array is not empty and the index is outside the bounds, it
 * @param arr
 * @param index
 */
/*export function getAtIndex<T>(arr: T[], index: number): T | undefined {
    return arr.length ? arr[index] : undefined;
}*/
