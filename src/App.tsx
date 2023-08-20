import React from 'react';
import logo from './logo.svg';
import './App.css';
import RouteDefinition from "./RouteDefinition";
import {SortType} from "./Common";
//import {TestWidget} from "./widgets/Test";

function App() {
    const [songNumber, setSongNumber] = React.useState<number>(20);
    const [sortType, setSortType] = React.useState<SortType>(SortType.position);
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
            <RouteDefinition songNumber={songNumber} setSongNumber={setSongNumber} />
    );
}

export default App;
