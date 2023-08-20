import React from 'react';

import {useParams} from 'react-router-dom';

import '../legacy.css';
import {NavigatingRootMenuWidget} from '../widgets/NavigatingRootMenu';
import {ReactSetter2, SortType} from '../Common';

/*export const SongPage = ({pos}: {pos: number}) => {
    return (
            <span className="songTitle">SongPage: {pos}</span>
    );
}*/

type SongParams = {
    songPos: string;
};


export const SongPage = ({sortType, songNumber, setSongNumber} :
            {sortType: SortType, songNumber: number, setSongNumber: ReactSetter2<number>}) => {

    const {songPos} = useParams<SongParams>();
    const numSngPos = Number(songPos);

    return (
        <div>
            <NavigatingRootMenuWidget songNumber={songNumber} setSongNumber={setSongNumber}/>
            <span className="songTitle">SongPage: {numSngPos}, by {sortType}</span>
        </div>
    );
};
