import React from 'react';

import {useNavigate} from 'react-router-dom';
import {SortType} from '../Common';
import {getSortedSongs} from '../SongCollections';

export const NavigationWidget = ({songNumber, sortType} :
        {songNumber: number, sortType: SortType}) => {

    const songCount = getSortedSongs(sortType).length;

    const navigate = useNavigate();

    const fullPath = window.location.pathname;
    const k = fullPath.lastIndexOf('/');
    const extraPath = fullPath.substring(0, k + 1);

    const onPrevious = React.useCallback(() => {
        navigate(`${extraPath}${songNumber - 1}`);
    }, [extraPath, navigate, songNumber]);

    const onNext = React.useCallback(() => {
        navigate(`${extraPath}${songNumber + 1}`);
    }, [extraPath, navigate, songNumber]);

    return (<span className="menuNormal navAlign">
        {/*navigation {songNumber}*/}
        <input id="prevBtn" type="button" className="toolBtnNormal"
            disabled={songNumber <= 1} value="&larr;" onClick={onPrevious} />
        &nbsp; {/*ttt1 perhaps use margin*/}
        <input id="nextBtn" type="button" className="toolBtnNormal"
            disabled={songNumber >= songCount} value="&rarr;" onClick={onNext} />
        &nbsp;
    </span>);
};
