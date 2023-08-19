import React from 'react';

import {Routes, Route} from 'react-router-dom';
import {HelpPage} from "./pages/HelpPage";
import {LoaderPage} from "./pages/LoaderPage";
import {SongPage} from "./pages/SongPage";

const RouteDefinition = () => {

    /*
    Routes:
    / - main page, normally same as /index-by-position, except the first time
    /help
    /index-by-position
    /index-by-title
    /index-by-singer
    /index-by-writer
    /index-by-verse
    /song-by-position
    /song-by-title
    /song-by-singer
    /song-by-writer
    /song-by-verse
    /search

     */


    // ttt0 Make sure React.Suspense works fine here - https://blog.devgenius.io/implementing-react-router-v6-with-code-splitting-in-a-react-typescript-project-14d98e2cab79
    return (
            <React.Suspense fallback={<LoaderPage/>}>
                <Routes>
                    <Route path='/' element={<LoaderPage/>}/>
                    <Route path='/help' element={<HelpPage/>}/>
                    <Route path='/song/:songPos' element={<SongPage />}/>
                </Routes>
            </React.Suspense>
    );
}
export default RouteDefinition;
