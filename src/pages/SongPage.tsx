import React from "react";

import { useParams } from 'react-router-dom';

import '../legacy.css';

/*export const SongPage = ({pos}: {pos: number}) => {
    return (
            <span className="songTitle">SongPage: {pos}</span>
    );
}*/

type SongParams = {
    songPos: string;
};

export const SongPage = () => {

    const { songPos } = useParams<SongParams>();
    const numSngPos = Number(songPos);

    return (
            <span className="songTitle">SongPage: {numSngPos}</span>
    );
}