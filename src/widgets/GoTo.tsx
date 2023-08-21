import React from 'react';

import '../legacy.css';
import {SortType} from '../Common';

export const GoToWidget = ({
    sortType,
} : {
    sortType: SortType,
}) => {
    // onKeyDown="if (event.keyCode == 13) document.getElementById('gotoBtn').click();"  //ttt0: make this work
    //  onClick="gotoSong();"  //ttt0: make this work
    return (<div>
        <input id="gotoInput" type="number" className="editGoto" placeholder="Număr"/>
        &nbsp;
        <input id="gotoBtn" type="button" className="toolBtnNormal" value="&#10148;"/>
    </div>);
};
