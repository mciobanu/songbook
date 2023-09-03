import React from 'react';

import {SongRenderConfig} from '../../SongRenderConfig';
import {ReactSetter2} from '../../Common';
import {DropdownsWidget} from './Dropdowns';
import {Suggestion} from '../../Suggestions';
import {Song} from '../../Song';
import {CapoWidget} from './Capo';
import {IntervalWidget} from './Interval';
import {ChordListWidget} from './ChordList';
import {FirstNoteWidget} from './FirstNote';
import {OriginalSuggestionWidget} from './OriginalSuggestion';
import {SuggestionListWidget} from './SuggestionList';
import {NotesWidget} from './Notes';

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
}) => {

    const suggestion = React.useMemo(() => {
        return suggestions.length ? suggestions[currentSuggestion] : undefined;
        //return suggestions[currentSuggestion];  //ttt1: Review what's going on: The type of suggestion should really
        // be "Suggestion|undefined", as you get undefined when the index is out of bounds. Still, to get TypeScript
        // to acknowledge this, the more verbose version above should be used
    }, [currentSuggestion, suggestions]);

    if (!songRenderConfig.showChords || !chords.length) {
        return null;
    }

    //ttt0: put these in config
    const useOriginalSuggestion = true;
    const debugEnabled = false;
    const showNotes = true;

    return (<>
        <DropdownsWidget chords={chords} songRenderConfig={songRenderConfig} capoCbBVal={capoCbBVal}
            setCapoCbBVal={setCapoCbBVal} firstChordCbBVal={firstChordCbBVal}
            setFirstChordCbBVal={setFirstChordCbBVal} setCurrentSuggestion={setCurrentSuggestion}/>
        <CapoWidget suggestion={suggestion}/>
        {song.r && <IntervalWidget suggestion={suggestion} currentSuggestion={currentSuggestion} range={song.r}/>}
        <ChordListWidget suggestion={suggestion} chords={chords}/>
        <FirstNoteWidget suggestion={suggestion} firstNote={song.f} lastInList={!useOriginalSuggestion}/>
        {useOriginalSuggestion && <OriginalSuggestionWidget song={song} chords={chords}/>}
        {song.r && suggestions.length
            && <SuggestionListWidget suggestions={suggestions} currentSuggestion={currentSuggestion}
                setCurrentSuggestion={setCurrentSuggestion} chords={chords} range={song.r} debugEnabled={debugEnabled}
            />}
        {song.n && <NotesWidget notes={song.n}/>}
    </>);
};
