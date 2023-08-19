import React from 'react';

import {Route, Routes} from 'react-router-dom';
import {HelpPage} from "./pages/HelpPage";
import {LoaderPage} from "./pages/LoaderPage";
import {SongPage} from "./pages/SongPage";
import {ReactSetter2, SortType} from "./Common";
import {IndexPage} from "./pages/IndexPage";
import {SearchPage} from "./pages/SearchPage";

const RouteDefinition = ({songNumber, setSongNumber} : {songNumber: number, setSongNumber: ReactSetter2<number>}) => {

    /*
    Routes:
    / - main page, normally same as /index-by-position, except the first time  //ttt0: implement "except"
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
                    {/*<Route path='/' element={<LoaderPage/>}/>*/}
                    <Route path='/' element={<IndexPage sortType={SortType.position} />}/>

                    <Route path='/help' element={<HelpPage/>}/>

                    <Route path='/index-by-position' element={<IndexPage sortType={SortType.position} />}/>
                    <Route path='/index-by-title' element={<IndexPage sortType={SortType.title} />}/>
                    <Route path='/index-by-singer' element={<IndexPage sortType={SortType.singer} />}/>
                    <Route path='/index-by-writer' element={<IndexPage sortType={SortType.writer} />}/>
                    <Route path='/index-by-verse' element={<IndexPage sortType={SortType.verse} />}/>

                    <Route path='/song-by-position/:songPos' element={<SongPage sortType={SortType.position} songNumber={songNumber} setSongNumber={setSongNumber} />}/>
                    <Route path='/song-by-title/:songPos' element={<SongPage sortType={SortType.title} songNumber={songNumber} setSongNumber={setSongNumber} />}/>
                    <Route path='/song-by-singer/:songPos' element={<SongPage sortType={SortType.singer} songNumber={songNumber} setSongNumber={setSongNumber} />}/>
                    <Route path='/song-by-writer/:songPos' element={<SongPage sortType={SortType.writer} songNumber={songNumber} setSongNumber={setSongNumber} />}/>
                    <Route path='/song-by-verse/:songPos' element={<SongPage sortType={SortType.verse} songNumber={songNumber} setSongNumber={setSongNumber} />}/>

                    <Route path='/search' element={<SearchPage />}/>
                </Routes>
            </React.Suspense>
    );
}
export default RouteDefinition;
