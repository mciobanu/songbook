import React from 'react';

import '../legacy.css';
import {NonNavigatingRootMenuWidget} from '../widgets/NonNavigatingRootMenu';
import {ReactSetter2, SortType} from '../Common';
import {getSortedSongs, SortedSong} from '../SongCollections';
import {SongRenderConfig} from '../SongRenderConfig';


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
}: {
    sortType: SortType,
    expandedMenu: boolean,
    setExpandedMenu: ReactSetter2<boolean>,
    songRenderConfig: SongRenderConfig,
    setSongRenderConfig: ReactSetter2<SongRenderConfig>,
}) => {
    const songs = getSortedSongs(sortType);
    return (
        <div>
            <NonNavigatingRootMenuWidget expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}
                songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}/>
            <span className="songTitle">IndexPage, by {sortType}</span>
            {render(songs)}
        </div>
    );
};
