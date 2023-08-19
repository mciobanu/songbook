import React from "react";

import { useParams } from 'react-router-dom';

import '../legacy.css';
import {RootMenuWidget} from "../widgets/RootMenu";
import {SortType} from "../Common";

/*export const SongPage = ({pos}: {pos: number}) => {
    return (
            <span className="songTitle">SongPage: {pos}</span>
    );
}*/

type SongParams = {
    songPos: string;
};


export const SongPage = ({sortType}: {sortType: SortType}) => {

    const { songPos } = useParams<SongParams>();
    const numSngPos = Number(songPos);

    return (
            <div>
                <RootMenuWidget />
                <span className="songTitle">SongPage: {numSngPos}, by {sortType}</span>
            </div>
    );
}