import React from 'react';

import {useParams} from 'react-router-dom';

import '../legacy.css';
import {NavigatingRootMenuWidget} from '../widgets/NavigatingRootMenu';
import {ReactSetter2, SortType} from '../Common';
import {SongWidget} from '../widgets/Song';
import {SongRenderConfig} from '../SongRenderConfig';
import {getSortedSongs} from '../SongCollections';
import {persistLastPath} from '../Persistence';
import {getFullTitle} from '../Song';
import {MiscConfig} from '../MiscConfig';

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
    optionallyHideMenu,
    miscConfig,
    fontSize,
    setFontSize,
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
    optionallyHideMenu: () => void,
    miscConfig: MiscConfig,
    fontSize: number,
    setFontSize: ReactSetter2<number>,
}) => {

    persistLastPath(window.location.pathname);

    const {songPos} = useParams<SongParams>();
    let numSngPos = Number(songPos);
    const sortedSongs = getSortedSongs(sortType);
    if (!Number.isFinite(numSngPos) || numSngPos <= 0) {
        numSngPos = 1; //ttt2 perhaps adjust URL
    } else if (numSngPos > sortedSongs.length) {
        numSngPos = sortedSongs.length;
    }
    const sortedSong = sortedSongs[numSngPos - 1]; // Subtract 1 so the URLs are friendlier to manual change

    React.useEffect(() => {
        setSongNumber(numSngPos);
    }, [numSngPos, setSongNumber]);

    const getTitle = () => {
        //return `${numSngPos}. ${getFullTitle(sortedSong.song)}`;
        return sortType === SortType.position
            ? `${sortedSong.song.index}. ${getFullTitle(sortedSong.song)}`
            : `${getFullTitle(sortedSong.song)} (${sortedSong.song.index})`;
    };

    return (
        <div className='mainDiv' onClick={optionallyHideMenu}>
            <NavigatingRootMenuWidget songNumber={songNumber} sortType={sortType}
                expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}
                songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig} fontSize={fontSize}
                setFontSize={setFontSize}/>
            <p className="songTitle">{getTitle()}</p>
            <SongWidget song={sortedSong.song} songRenderConfig={songRenderConfig} capoCbBVal={capoCbBVal}
                setCapoCbBVal={setCapoCbBVal} miscConfig={miscConfig} fontSize={fontSize}/>
            <div className='bottomDiv'/>
        </div>
    );
};
