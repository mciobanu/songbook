import React from 'react';

import {Route, Routes} from 'react-router-dom';
import {HelpPage} from './pages/HelpPage';
import {LoaderPage} from './pages/LoaderPage';
import {SongPage} from './pages/SongPage';
import {ReactSetter2, SortType} from './Common';
import {IndexPage} from './pages/IndexPage';
import {SearchPage} from './pages/SearchPage';
import {SongRenderConfig} from './SongRenderConfig';
import {Paths} from "./Paths";

const RouteDefinition = ({songNumber, setSongNumber, songRenderConfig} :
        {songNumber: number, setSongNumber: ReactSetter2<number>, songRenderConfig: SongRenderConfig}) => {

    /*
    Routes:
    / - main page, normally same as /index-by-position, except the first time  //ttt0: implement "except"
    /help
    /index-by-position
    /index-by-title
    /index-by-performer
    /index-by-lyricist
    /index-by-verse
    /song-by-position
    /song-by-title
    /song-by-performer
    /song-by-lyricist
    /song-by-verse
    /search

     */


    /* eslint max-len: off */

    // ttt0 Make sure React.Suspense works fine here - https://blog.devgenius.io/implementing-react-router-v6-with-code-splitting-in-a-react-typescript-project-14d98e2cab79
    return (
        <React.Suspense fallback={<LoaderPage/>}>
            <Routes>
                {/*<Route path='/' element={<LoaderPage/>}/>*/}
                <Route path='/' element={<IndexPage sortType={SortType.position} />}/>

                <Route path='/help' element={<HelpPage/>}/>

                <Route path={Paths.indexByPosition} element={<IndexPage sortType={SortType.position} />}/>
                <Route path={Paths.indexByTitle} element={<IndexPage sortType={SortType.title} />}/>
                <Route path={Paths.indexByPerformer} element={<IndexPage sortType={SortType.performer} />}/>
                <Route path={Paths.indexByLyricist} element={<IndexPage sortType={SortType.lyricist} />}/>
                <Route path={Paths.indexByVerse} element={<IndexPage sortType={SortType.verse} />}/>

                <Route path={`${Paths.songByPosition}/:songPos`} element={<SongPage sortType={SortType.position}
                    songNumber={songNumber} setSongNumber={setSongNumber} songRenderConfig={songRenderConfig}/>}/>
                <Route path={`${Paths.songByTitle}/:songPos`} element={<SongPage sortType={SortType.title}
                    songNumber={songNumber} setSongNumber={setSongNumber} songRenderConfig={songRenderConfig}/>}/>
                <Route path={`${Paths.songByPerformer}/:songPos`} element={<SongPage sortType={SortType.performer}
                    songNumber={songNumber} setSongNumber={setSongNumber} songRenderConfig={songRenderConfig}/>}/>
                <Route path={`${Paths.songByLyricist}/:songPos`} element={<SongPage sortType={SortType.lyricist}
                    songNumber={songNumber} setSongNumber={setSongNumber} songRenderConfig={songRenderConfig}/>}/>
                <Route path={`${Paths.songByVerse}/:songPos`} element={<SongPage sortType={SortType.verse}
                    songNumber={songNumber} setSongNumber={setSongNumber} songRenderConfig={songRenderConfig}/>}/>

                <Route path='/search' element={<SearchPage />}/>
            </Routes>
        </React.Suspense>
    );
};
export default RouteDefinition;
