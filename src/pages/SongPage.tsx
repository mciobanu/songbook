import React from 'react';

import {useParams} from 'react-router-dom';

import '../legacy.css';
import {NavigatingRootMenuWidget} from '../widgets/NavigatingRootMenu';
import {ReactSetter2, SortType} from '../Common';
import {SongWidget} from '../widgets/Song';
import {SongRenderConfig} from '../SongRenderConfig';
import {getSortedSongs} from '../SongCollections';

/*export const SongPage = ({pos}: {pos: number}) => {
    return (
            <span className="songTitle">SongPage: {pos}</span>
    );
}*/

type SongParams = {
    songPos: string;
};


export const SongPage = ({
    sortType, songNumber, setSongNumber, songRenderConfig,
} : {
        sortType: SortType,
        songNumber: number,
        setSongNumber: ReactSetter2<number>,
        songRenderConfig: SongRenderConfig
    }) => {

    const {songPos} = useParams<SongParams>();
    const numSngPos = Number(songPos);
    const sortedSongs = getSortedSongs(sortType);
    const sortedSong = sortedSongs[numSngPos];

    return (
        <div>
            <NavigatingRootMenuWidget songNumber={songNumber} setSongNumber={setSongNumber}/>
            <span className="songTitle">SongPage: {numSngPos}, by {sortType}</span>
            <SongWidget song={sortedSong.song} songRenderConfig={songRenderConfig}/>
        </div>
    );
};
