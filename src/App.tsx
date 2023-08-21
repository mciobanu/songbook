import React from 'react';
//import logo from './logo.svg';
import './App.css';
import RouteDefinition from './RouteDefinition';
import {SortType} from './Common';
import {SongRenderConfig} from './SongRenderConfig';
import {initAsciiForAccidentals} from './RangeProcessor';

function App() {
    const defaultSongRenderConfig: SongRenderConfig = {
        fontSize: 10,
        showChords: true,
        inlineChords: false,
        useSuggestions: true,
        minNoteInternal: 'C',
        maxNoteInternal: 'D',
        minNoteDisplay: 'C',
        maxNoteDisplay: 'D',
        noteRange: 14,
        maxSuggestions: 6,
        maxCapo: 5,
    };
    const [songNumber, setSongNumber] = React.useState<number>(20);
    const [sortType, setSortType] = React.useState<SortType>(SortType.position);
    const [songRenderConfig, setSongRenderConfig] = React.useState<SongRenderConfig>(defaultSongRenderConfig);
    const [expandedMenu, setExpandedMenu] = React.useState<boolean>(false);

    /*React.useEffect(() => { //ttt0: Use local storage to persist all settings
        persist(songNumber);
    }, [songNumber]);*/

    return (
        <RouteDefinition songNumber={songNumber} setSongNumber={setSongNumber} songRenderConfig={songRenderConfig}
            expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} setSongRenderConfig={setSongRenderConfig}/>
    );
}

initAsciiForAccidentals();  //ttt0: Review using this approach. We don't want to keep calling this function

export default App;
