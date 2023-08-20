import React from 'react';

import '../legacy.css';
import {ReactSetter2} from '../Common';

export const NavigationWidget = ({songNumber, setSongNumber} :
            {songNumber: number, setSongNumber: ReactSetter2<number>}) => {

    const onPrevious = React.useCallback(() => {
        //console.log(`songNumber=${songNumber}`)
        setSongNumber(songNumber - 1);
    }, [songNumber, setSongNumber]);

    const onNext = React.useCallback(() => {
        //console.log(`songNumber=${songNumber}`)
        setSongNumber(songNumber + 1);
    }, [songNumber, setSongNumber]);

    console.log(`songNumberEntry=${songNumber}`);

    return (<div>
        navigation {songNumber}
        <input id="prevBtn" type="button" className="toolBtnNormal" value="&larr;" onClick={onPrevious} />
        <input id="nextBtn" type="button" className="toolBtnNormal" value="&rarr;" onClick={onNext} />
    </div>);
};
