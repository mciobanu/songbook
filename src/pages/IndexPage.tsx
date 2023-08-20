import React from 'react';

import '../legacy.css';
import {NonNavigatingRootMenuWidget} from '../widgets/NonNavigatingRootMenu';
import {SortType} from '../Common';
import {getSortedSongs, SortedSong} from '../SongCollections';


function render(sortedSongs: SortedSong[]) {
    return sortedSongs.map((song) => {
        //return (<div key={song.index}>{song.index}. {song.sortString} - {getFullTitle(song.song)} </div>);
        return (<div key={song.index}>{song.index}. {song.displayString}</div>);
    });
    //return (<div>aaa</div>);
}

export const IndexPage = ({sortType}: {sortType: SortType}) => {
    const songs = getSortedSongs(sortType);
    return (
        <div>
            <NonNavigatingRootMenuWidget />
            <span className="songTitle">IndexPage, by {sortType}</span>
            {render(songs)}
        </div>
    );
};
