import React from 'react';

import '../legacy.css';
import {MenuWidget} from './Menu';
import {NavigationWidget} from './Navigation';
import {HamburgerWidget} from './Hamburger';
import {ReactSetter2} from '../Common';

export const NavigatingRootMenuWidget = ({songNumber, setSongNumber} :
            {songNumber: number, setSongNumber: ReactSetter2<number>}) => {
    return (<div className="menuDiv menuDivRight">
        <div>
            <NavigationWidget songNumber={songNumber} setSongNumber={setSongNumber}/>
            <HamburgerWidget />
        </div>
        <MenuWidget />
    </div>);
    /* ttt0 review why there are both menuDivRight and menuDivLeft */
};
