import React from 'react';

import {Route, Routes} from 'react-router-dom';
import {HelpPage} from './pages/HelpPage';
import {LoaderPage} from './pages/LoaderPage';
import {SongPage} from './pages/SongPage';
import {ReactSetter2, SortType} from './Common';
import {IndexPage} from './pages/IndexPage';
import {SearchPage} from './pages/SearchPage';
import {SongRenderConfig} from './SongRenderConfig';
import {Paths} from './Paths';

const RouteDefinition = ({
    songNumber,
    setSongNumber,
    songRenderConfig,
    setSongRenderConfig,
    expandedMenu,
    setExpandedMenu,
    //setLastPath,
    capoCbBVal,
    setCapoCbBVal,
    optionallyHideMenu,
} : {
    songNumber: number,
    setSongNumber: ReactSetter2<number>,
    songRenderConfig: SongRenderConfig,
    setSongRenderConfig: ReactSetter2<SongRenderConfig>,
    expandedMenu: boolean,
    setExpandedMenu: ReactSetter2<boolean>,
    //setLastPath: ReactSetter2<string>,
    capoCbBVal: string,
    setCapoCbBVal: ReactSetter2<string>,
    optionallyHideMenu: () => void,
}) => {

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
    TBD, see comment in Paths: /song-by-search
    /search

     */


    /* eslint max-len: off */
    // ttt0 Make sure React.Suspense works fine here - https://blog.devgenius.io/implementing-react-router-v6-with-code-splitting-in-a-react-typescript-project-14d98e2cab79
    return (
        <React.Suspense fallback={<LoaderPage/>}>
            <Routes>
                {/*<Route path='/' element={<LoaderPage/>}/>*/}
                <Route path='/' element={<IndexPage sortType={SortType.position}
                    expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} /*setLastPath={setLastPath}*/
                    songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}
                    optionallyHideMenu={optionallyHideMenu}/>}/>

                <Route path={Paths.help} element={<HelpPage
                    expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}
                    songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}
                    optionallyHideMenu={optionallyHideMenu}/>}/>

                <Route path={Paths.indexByPosition} element={<IndexPage sortType={SortType.position}
                    expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} /*setLastPath={setLastPath}*/
                    songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}
                    optionallyHideMenu={optionallyHideMenu}/>}/>
                <Route path={Paths.indexByTitle} element={<IndexPage sortType={SortType.title}
                    expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} /*setLastPath={setLastPath}*/
                    songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}
                    optionallyHideMenu={optionallyHideMenu}/>}/>
                <Route path={Paths.indexByPerformer} element={<IndexPage sortType={SortType.performer}
                    expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} /*setLastPath={setLastPath}*/
                    songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}
                    optionallyHideMenu={optionallyHideMenu}/>}/>
                <Route path={Paths.indexByLyricist} element={<IndexPage sortType={SortType.lyricist}
                    expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} /*setLastPath={setLastPath}*/
                    songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}
                    optionallyHideMenu={optionallyHideMenu}/>}/>
                <Route path={Paths.indexByVerse} element={<IndexPage sortType={SortType.verse}
                    expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} /*setLastPath={setLastPath}*/
                    songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}
                    optionallyHideMenu={optionallyHideMenu}/>}/>

                <Route path={`${Paths.songByPosition}/:songPos`} element={<SongPage sortType={SortType.position}
                    songNumber={songNumber} setSongNumber={setSongNumber} songRenderConfig={songRenderConfig}
                    expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} capoCbBVal={capoCbBVal}
                    setSongRenderConfig={setSongRenderConfig} setCapoCbBVal={setCapoCbBVal}
                    optionallyHideMenu={optionallyHideMenu}/>}/>
                <Route path={`${Paths.songByTitle}/:songPos`} element={<SongPage sortType={SortType.title}
                    songNumber={songNumber} setSongNumber={setSongNumber} songRenderConfig={songRenderConfig}
                    expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} capoCbBVal={capoCbBVal}
                    setSongRenderConfig={setSongRenderConfig} setCapoCbBVal={setCapoCbBVal}
                    optionallyHideMenu={optionallyHideMenu}/>}/>
                <Route path={`${Paths.songByPerformer}/:songPos`} element={<SongPage sortType={SortType.performer}
                    songNumber={songNumber} setSongNumber={setSongNumber} songRenderConfig={songRenderConfig}
                    expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} capoCbBVal={capoCbBVal}
                    setSongRenderConfig={setSongRenderConfig} setCapoCbBVal={setCapoCbBVal}
                    optionallyHideMenu={optionallyHideMenu}/>}/>
                <Route path={`${Paths.songByLyricist}/:songPos`} element={<SongPage sortType={SortType.lyricist}
                    songNumber={songNumber} setSongNumber={setSongNumber} songRenderConfig={songRenderConfig}
                    expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} capoCbBVal={capoCbBVal}
                    setSongRenderConfig={setSongRenderConfig} setCapoCbBVal={setCapoCbBVal}
                    optionallyHideMenu={optionallyHideMenu}/>}/>
                <Route path={`${Paths.songByVerse}/:songPos`} element={<SongPage sortType={SortType.verse}
                    songNumber={songNumber} setSongNumber={setSongNumber} songRenderConfig={songRenderConfig}
                    expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} capoCbBVal={capoCbBVal}
                    setSongRenderConfig={setSongRenderConfig} setCapoCbBVal={setCapoCbBVal}
                    optionallyHideMenu={optionallyHideMenu}/>}/>

                <Route path={Paths.search} element={<SearchPage
                    expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}
                    songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}
                    optionallyHideMenu={optionallyHideMenu}/>}/>
            </Routes>
        </React.Suspense>
    );
    //ttt0: Have some "page not found"
};

export default RouteDefinition;
