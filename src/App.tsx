import React from 'react';
import {useNavigate} from 'react-router-dom';

//import logo from './logo.svg';
import './App.css';
import RouteDefinition from './RouteDefinition';
import {debugFmt} from './Common';
import {SongRenderConfig} from './SongRenderConfig';
import {initAsciiForAccidentals} from './RangeProcessor';
import * as Persistence from './Persistence';

let ranPathRestoreAtStart = false;

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

    const navigate = useNavigate();

    /*
    This code, together with calls to persistLastPath() in some pages, achieve this: If you go to the root path,
    you get redirected to whatever you were doing before. Kind of messy, as it mixes React with plain functions and
    variables, but it seems OK and attempting for 1 hour to use a pure React approach led nowhere (details below).

    //ttt2: When time allows, a pure React approach should be tried again.
     */
    React.useEffect(() => {
        if (!ranPathRestoreAtStart) {
            ranPathRestoreAtStart = true;
            console.log('initializing page; will try to go to the last path');
            try {
                const currentPath = window.location.pathname;
                console.log(`currentPath at start: ${currentPath}`);
                const retrievedLastPath = Persistence.retrieveLastPath();
                console.log(`retrievedLastPath at start: ${retrievedLastPath}`);
                if (currentPath === '/' && retrievedLastPath) {
                    console.log(`navigating to: ${retrievedLastPath}`);
                    navigate(retrievedLastPath);
                } else {
                    console.log('won\'t navigate elsewhere');
                }
            } catch (e) {
                //!!! Nothing
            }
        } else {
            console.log('already initialized, won\'t try to go to the last path');
        }
    }, [navigate]);

    //ttt0: Use local storage to persist all settings
    React.useEffect(() => {
        //Persistence.persist(songNumberKey, songNumber);
        Persistence.persist(songRenderConfigKey, songRenderConfig);
        console.log(`persisted ${debugFmt(songRenderConfig)}`);
    }, [songRenderConfig]);

    return (
        <RouteDefinition songNumber={songNumber} setSongNumber={setSongNumber} songRenderConfig={songRenderConfig}
            expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} setSongRenderConfig={setSongRenderConfig}
            /*setLastPath={setLastPath}*/
        />
    );
}


//const [lastPath, setLastPath] = React.useState<string>(Paths.indexByPosition);
//ttt0 See if lastPath can be made to work with React. As attempted, it led to this warning:
//      Cannot update a component (`App`) while rendering a different component (`IndexPage`).
// The workaround was to use plain functions

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

// React.useEffect(() => {
//     try {
//         const persistedLastPath = window.location.pathname;
//         console.log(`persistedLastPath at start: ${persistedLastPath}`);
//         /*const persistedLastPath = Persistence.retrieve<string>(lastPathKey);
//         if (persistedLastPath) {
//             //navigate(persistedLastPath);
//         }*/
//     } catch (e) {
//         //!!! Nothing
//     }
// }, [navigate]);

/*const persistedLastPath = Persistence.retrieve<string>(lastPathKey);
if (persistedLastPath) {
    //navigate(persistedLastPath);
}*/


initAsciiForAccidentals();  //ttt0: Review using this approach. We don't want to keep calling this function

export default App;

