import React from 'react';
import {useNavigate} from 'react-router-dom';

//import logo from './logo.svg';
import './App.css';
import RouteDefinition from './RouteDefinition';
//import {debugFmt} from './Common';
import {SongRenderConfig, upgradeSongRenderConfig} from './SongRenderConfig';
import {initAsciiForAccidentals, AUTO} from './ChordUtils';
import * as Persistence from './Persistence';
import {MiscConfig} from './MiscConfig';
import {Paths} from './Paths';

let ranPathRestoreAtStart = 0;

const defaultSongRenderConfig: SongRenderConfig = {
    fontSize: 10,
    showChords: true,
    inlineChords: false,
    useSuggestions: true,
    minVoiceInternal: 'C',
    maxVoiceInternal: 'D',
    minVoiceDisplay: 'C',
    maxVoiceDisplay: 'D',
    voiceRange: 14,
    maxSuggestions: 6,
    maxCapo: 5,
};

const defaultMiscConfig: MiscConfig = {
    autoHideMenu: true,
    useOriginalSuggestion: true,
    debugEnabled: false,
    showNotes: true,
};


function App() {
    const songRenderConfigKey = 'songRenderConfig';
    const miscConfigKey = 'miscConfig';
    //const lastPathKey = 'lastPath';

    const [songNumber, setSongNumber] = React.useState<number>(20);
    const [songRenderConfig, setSongRenderConfig] = React.useState<SongRenderConfig>(() => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const persistedSongRenderConfig = Persistence.retrieve<SongRenderConfig>(songRenderConfigKey);
            upgradeSongRenderConfig(persistedSongRenderConfig, defaultSongRenderConfig);
            //console.log(`retrieved ${debugFmt(persistedSongRenderConfig)}`);
            return persistedSongRenderConfig;
        } catch (e) {
            return defaultSongRenderConfig;
        }
    });
    const [miscConfig, setMiscConfig] = React.useState<MiscConfig>(() => {
        try {
            // noinspection UnnecessaryLocalVariableJS
            const persistedMiscConfig = Persistence.retrieve<MiscConfig>(miscConfigKey);
            //console.log(`retrieved ${debugFmt(persistedMiscConfig)}`);
            return persistedMiscConfig;
        } catch (e) {
            return defaultMiscConfig;
        }
    });
    const [expandedMenu, setExpandedMenu] = React.useState<boolean>(false);

    const [capoCbBVal, setCapoCbBVal] = React.useState<string>(AUTO);

    const navigate = useNavigate();


    React.useEffect(() => {
        //let c: Element;
        //const a = document.body.parentNode;
        const domRoot = document.querySelector(':root');
        if (domRoot) {
            //domRoot as ElementCSSInlineStyle
            const domRoot1 = domRoot as HTMLElement;
            domRoot1.style.fontSize = `${fontSize}px`;
        }
    }, [fontSize]);
    /*
    This code, together with calls to persistLastPath() in some pages, achieve this: If you go to the root path,
    you get redirected to whatever you were doing before. Kind of messy, as it mixes React with plain functions and
    variables, but it seems OK and attempting for 1 hour to use a pure React approach led nowhere (details below).

    //ttt2: When time allows, a pure React approach should be tried again.
     */
    React.useEffect(() => {
        if (ranPathRestoreAtStart < 2) {  //ttt1: Review this hack with using 2 for what is supposed to be a boolean. A short test seems to indicate useStrict
            // as the culprit. Well, we're not supposed to use non-react variables ...
            ranPathRestoreAtStart += 1;
            //console.log('initializing page; will try to go to the last path');
            try {
                const currentPath = window.location.pathname;
                //console.log(`currentPath at start: ${currentPath}`);
                const retrievedLastPath = Persistence.retrieveLastPath();
                //console.log(`retrievedLastPath at start: ${retrievedLastPath}`);
                if (currentPath === Paths.defaultPath && retrievedLastPath) {
                    console.log(`navigating to: ${retrievedLastPath}`);
                    navigate(retrievedLastPath);
                } /*else {
                    console.log('won\'t navigate elsewhere');
                }*/
            } catch (e) {
                console.log(`Error initializing path: ${e}`);
            }
        } /*else {
            console.log('already initialized, won\'t try to go to the last path');
        }*/
    }, [navigate]);

    React.useEffect(() => {
        //Persistence.persist(songNumberKey, songNumber);
        Persistence.persist(songRenderConfigKey, songRenderConfig);
        //console.log(`persisted ${debugFmt(songRenderConfig)}`);
        Persistence.persist(miscConfigKey, miscConfig);
    }, [miscConfig, songRenderConfig]);

    const optionallyHideMenu = React.useCallback(() => {
        if (miscConfig.autoHideMenu) {
            setExpandedMenu(false);
        }
    }, [miscConfig.autoHideMenu]);


    return (
        <RouteDefinition songNumber={songNumber} setSongNumber={setSongNumber} songRenderConfig={songRenderConfig}
            expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} setSongRenderConfig={setSongRenderConfig}
            capoCbBVal={capoCbBVal} setCapoCbBVal={setCapoCbBVal} optionallyHideMenu={optionallyHideMenu}
            miscConfig={miscConfig} fontSize={fontSize} setFontSize={setFontSize}
            /*setLastPath={setLastPath}*/
        />
    );
}


//const [lastPath, setLastPath] = React.useState<string>(Paths.indexByPosition);
//ttt2 See if lastPath can be made to work with React. As attempted, it led to this warning:
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
// }, [navigate]); // as long as there's the dependency on "navigate", this useEffect() gets called for all URL changes

/*const persistedLastPath = Persistence.retrieve<string>(lastPathKey);
if (persistedLastPath) {
    //navigate(persistedLastPath);
}*/


initAsciiForAccidentals();  //ttt1: Review using this approach. We don't want to keep calling this function

export default App;
