import React from 'react';
//import {useNavigate} from 'react-router-dom';

//import logo from './logo.svg';
import './App.css';
import RouteDefinition from './RouteDefinition';
import {debugFmt, SortType} from './Common';
import {SongRenderConfig} from './SongRenderConfig';
import {initAsciiForAccidentals} from './RangeProcessor';
import * as Persistence from './Persistence';
import {Paths} from './Paths';

/*type CurrentView = {
    sortType: SortType,
    songNumber: number,
}*/

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
    const songRenderConfigKey = 'songRenderConfig';
    //const lastPathKey = 'lastPath';

    const [songNumber, setSongNumber] = React.useState<number>(20);
    const [sortType, setSortType] = React.useState<SortType>(SortType.position);
    const [songRenderConfig, setSongRenderConfig] = React.useState<SongRenderConfig>(() => {
        try {
            const persistedSongRenderConfig = Persistence.retrieve<SongRenderConfig>(songRenderConfigKey);
            console.log(`retrieved ${debugFmt(persistedSongRenderConfig)}`);
            return persistedSongRenderConfig;
        } catch (e) {
            return defaultSongRenderConfig;
        }
    });
    const [expandedMenu, setExpandedMenu] = React.useState<boolean>(false);
    const [lastPath, setLastPath] = React.useState<string>(Paths.indexByPosition);

    //const navigate = useNavigate();


    /*React.useEffect(() => {
        persist(songNumber);
    }, [songNumber]);*/

    //const songNumberKey = 'songNumber';

    /*React.useEffect(() => {
        // try {
        //     const number = Persistence.retrieve<number>(songNumberKey);
        //     setSongNumber((number));
        // } catch (e) {
        //     setSongNumber(1);
        // }
        try {
            const persistedSongRenderConfig = Persistence.retrieve<SongRenderConfig>(songRenderConfigKey);
            console.log(`retrieved ${debugFmt(persistedSongRenderConfig)}`);
            setSongRenderConfig(persistedSongRenderConfig);
        } catch (e) {
            //setSongRenderConfig(defaultSongRenderConfig); //!!! No need for this, as it's already set as the default
        }
    }, []);*/

    /*
    Restore state at startup:
    - If there is any path in the start URL, it makes no sense: use that path
    - If there is no path, retrieve last from local storage and navigate to it
     */

    /*React.useEffect(() => {
        try {
            const persistedLastPath = Persistence.retrieve<string>(lastPathKey);
            if (persistedLastPath) {
                //navigate(persistedLastPath);  //ttt0: Try to make this work
            }
        } catch (e) {
            //!!! Nothing
        }
    }, [navigate]);*/

    //ttt0: Use local storage to persist all settings
    React.useEffect(() => { //ttt0: Use local storage to persist all settings
        //Persistence.persist(songNumberKey, songNumber);
        Persistence.persist(songRenderConfigKey, songRenderConfig);
        console.log(`persisted ${debugFmt(songRenderConfig)}`);
    }, [songRenderConfig]);

    /*React.useEffect(() => { //ttt0: Use local storage to persist all settings
        //Persistence.persist(songNumberKey, songNumber);
        Persistence.persist(lastPathKey, lastPath);
    }, [lastPath]);*/

    return (
        <RouteDefinition songNumber={songNumber} setSongNumber={setSongNumber} songRenderConfig={songRenderConfig}
            expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} setSongRenderConfig={setSongRenderConfig}/>
    );
}

initAsciiForAccidentals();  //ttt0: Review using this approach. We don't want to keep calling this function

export default App;
