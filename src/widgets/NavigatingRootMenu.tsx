import React from 'react';

import '../css/Menu.css';
import {MenuWidget} from './Menu';
import {NavigationWidget} from './Navigation';
import {HamburgerWidget} from './Hamburger';
import {SortType} from '../Common';

export const NavigatingRootMenuWidget = ({songNumber, sortType} :
            {songNumber: number, sortType: SortType}) => {
    return (<div className="menuDiv menuDivRight menuP">
        <div className="navRootMenuContainer">
            <NavigationWidget songNumber={songNumber} sortType={sortType}/>
            <HamburgerWidget />
        </div>
        <MenuWidget />
    </div>);
    /* ttt0 review why there are both menuDivRight and menuDivLeft */
};
