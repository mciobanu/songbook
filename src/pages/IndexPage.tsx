import React from 'react';

import '../legacy.css';
import {NonNavigatingRootMenuWidget} from '../widgets/NonNavigatingRootMenu';
import {ReactSetter2, SortType} from '../Common';
import {getSortedSongs, SortedSong} from '../SongCollections';
import {SongRenderConfig} from '../SongRenderConfig';
import {persistLastPath} from '../Persistence';
import {createSongPath, getIndexPageTitle} from '../Paths';


function formatIndexEntry(index: number, title: string, sortType: SortType) {
    return sortType === SortType.position ? `${index}. ${title}` : `${title} (${index})`;
}

function render(sortedSongs: SortedSong[], sortType: SortType) {
    return sortedSongs.map((song, index) => {
        //return (<div key={song.index}>{song.index}. {song.sortString} - {getFullTitle(song.song)} </div>);
        return (
            <p className='indexParagraph' key={song.displayString}>
                <a className='indexEntry' href={createSongPath(sortType, index + 1)}>
                    {formatIndexEntry(song.song?.index || 0, song.displayString, sortType)}
                </a>
            </p>);
    });
}

export const IndexPage = ({
    sortType,
    expandedMenu,
    setExpandedMenu,
    songRenderConfig,
    setSongRenderConfig,
    //setLastPath,
    optionallyHideMenu,
} : {
    sortType: SortType,
    expandedMenu: boolean,
    setExpandedMenu: ReactSetter2<boolean>,
    songRenderConfig: SongRenderConfig,
    setSongRenderConfig: ReactSetter2<SongRenderConfig>,
    //setLastPath: ReactSetter2<string>,
    optionallyHideMenu: () => void,
}) => {
    //setLastPath(window.location.pathname);
    persistLastPath(window.location.pathname);
    const songs = getSortedSongs(sortType);
    return (
        <div onClick={optionallyHideMenu}>
            <NonNavigatingRootMenuWidget expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}
                songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig} sortType={sortType}/>
            <p className="songTitle">{getIndexPageTitle(sortType)}</p> {/*ttt0 review className*/}
            {render(songs, sortType)}
        </div>
    );
};
