import React from 'react';

import {useNavigate} from 'react-router-dom';
import {SortType} from '../Common';
import {getSortedSongs} from '../SongCollections';
import {createSongPath} from '../Paths';

export const NavigationWidget = ({songNumber, sortType} :
        {songNumber: number, sortType: SortType}) => {

    const songCount = getSortedSongs(sortType).length;

    const navigate = useNavigate();

    const onPrevious = React.useCallback(() => {
        navigate(createSongPath(sortType, songNumber - 1));
    }, [navigate, songNumber, sortType]);

    const onNext = React.useCallback(() => {
        navigate(createSongPath(sortType, songNumber + 1));
    }, [navigate, songNumber, sortType]);

    return (<span className="menuNormal navAlign">
        <input id="prevBtn" type="button" className="toolBtnNormal"
            disabled={songNumber <= 1} value="&larr;" onClick={onPrevious} />
        <input id="nextBtn" type="button" className="toolBtnNormal nextToolBtn"
            disabled={songNumber >= songCount} value="&rarr;" onClick={onNext} />
    </span>);
};
