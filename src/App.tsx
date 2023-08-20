import React from 'react';
//import logo from './logo.svg';
import './App.css';
import RouteDefinition from './RouteDefinition';
import {SortType} from './Common';
import {SongRenderConfig} from './SongRenderConfig';
//import {TestWidget} from "./widgets/Test";

function App() {
    const defaultSongRenderConfig: SongRenderConfig = {  //ttt0: Use local storage
        fontSize: 10,
        inlineChords: true,
        maxCapo: 5,
        maxSuggestions: 6,
        minNote: 'C',
        maxNote: 'D',
        showChords: false,
    };
    const [songNumber, setSongNumber] = React.useState<number>(20);
    const [sortType, setSortType] = React.useState<SortType>(SortType.position);
    const [songRenderConfig, setSongRenderConfig] = React.useState<SongRenderConfig>(defaultSongRenderConfig);
    const [expandedMenu, setExpandedMenu] = React.useState<boolean>(false);
    return (
        /*<div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                >
                    Learn React  2
                </a>
            </header>
        </div>*/
        // <div id="mainContent" > {/*onClick="onMainClick();"*/}
        //     {/*ttt1 close button is over the scroll bar on desktop*/}
        //     <LoaderWidget />
        //     <HelpWidget />
        //     <RootMenuWidget />
        // </div>
        <RouteDefinition songNumber={songNumber} setSongNumber={setSongNumber} songRenderConfig={songRenderConfig}
            expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}/>
    );
}

export default App;
