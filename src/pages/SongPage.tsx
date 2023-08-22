import React from 'react';

import {useParams} from 'react-router-dom';

import '../legacy.css';
import {NavigatingRootMenuWidget} from '../widgets/NavigatingRootMenu';
import {ReactSetter2, SortType} from '../Common';
import {SongWidget} from '../widgets/Song';
import {SongRenderConfig} from '../SongRenderConfig';
import {getSortedSongs} from '../SongCollections';
import {persistLastPath} from '../Persistence';

type SongParams = {
    songPos: string;
};


export const SongPage = ({
    sortType,
    songNumber,
    setSongNumber,
    songRenderConfig,
    setSongRenderConfig,
    expandedMenu,
    setExpandedMenu,
    capoCbBVal,
    setCapoCbBVal,
} : {
    sortType: SortType,
    songNumber: number,
    setSongNumber: ReactSetter2<number>,
    songRenderConfig: SongRenderConfig,
    setSongRenderConfig: ReactSetter2<SongRenderConfig>,
    expandedMenu: boolean,
    setExpandedMenu: ReactSetter2<boolean>,
    capoCbBVal: string,
    setCapoCbBVal: ReactSetter2<string>,
}) => {

    persistLastPath(window.location.pathname);

    const {songPos} = useParams<SongParams>();
    const numSngPos = Number(songPos); //ttt0 adjust URL if this is invalid (123000, -10, abc, ...)
    const sortedSongs = getSortedSongs(sortType);
    const sortedSong = sortedSongs[numSngPos - 1]; // Subtract 1 so the URLs are friendlier to manual change

    React.useEffect(() => {
        setSongNumber(numSngPos);
    }, [numSngPos, setSongNumber]);

    return (
        <div>
            <NavigatingRootMenuWidget songNumber={songNumber} sortType={sortType}
                expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}
                songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}/>
            <span className="songTitle">SongPage: {numSngPos}, by {sortType}</span>
            <SongWidget song={sortedSong.song} songRenderConfig={songRenderConfig} capoCbBVal={capoCbBVal}
                setCapoCbBVal={setCapoCbBVal}/>
        </div>
    );
};
