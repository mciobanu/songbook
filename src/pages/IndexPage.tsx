import React from 'react';

import '../legacy.css';
import {NonNavigatingRootMenuWidget} from '../widgets/NonNavigatingRootMenu';
import {ReactSetter2, SortType} from '../Common';
import {getSortedSongs, SortedSong} from '../SongCollections';
import {SongRenderConfig} from '../SongRenderConfig';
import {persistLastPath} from '../Persistence';


function render(sortedSongs: SortedSong[]) {
    return sortedSongs.map((song) => {
        //return (<div key={song.index}>{song.index}. {song.sortString} - {getFullTitle(song.song)} </div>);
        return (<div key={song.index}>{song.index}. {song.displayString}</div>);
    });
    //return (<div>aaa</div>);
}

export const IndexPage = ({
    sortType,
    expandedMenu,
    setExpandedMenu,
    songRenderConfig,
    setSongRenderConfig,
    //setLastPath,
} : {
    sortType: SortType,
    expandedMenu: boolean,
    setExpandedMenu: ReactSetter2<boolean>,
    songRenderConfig: SongRenderConfig,
    setSongRenderConfig: ReactSetter2<SongRenderConfig>,
    //setLastPath: ReactSetter2<string>,
}) => {
    //setLastPath(window.location.pathname);
    persistLastPath(window.location.pathname);
    const songs = getSortedSongs(sortType);
    return (
        <div onClick={() => { setExpandedMenu(false); }}>
            <NonNavigatingRootMenuWidget expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}
                songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}/>
            <p className="songTitle">IndexPage, by {sortType}</p> {/*ttt0 review className*/}
            {render(songs)}
        </div>
    );
};
