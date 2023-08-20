import React from 'react';

import '../css/Menu.css';
import {MenuWidget} from './Menu';
import {NavigationWidget} from './Navigation';
import {HamburgerWidget} from './Hamburger';
import {ReactSetter2, SortType} from '../Common';

export const NavigatingRootMenuWidget = ({
    songNumber, sortType, expandedMenu, setExpandedMenu,
} : {
    songNumber: number, sortType: SortType, expandedMenu: boolean, setExpandedMenu: ReactSetter2<boolean>,
}) => {
    return (<div className="menuDiv menuDivRight menuP">
        <div className="navRootMenuContainer">
            <NavigationWidget songNumber={songNumber} sortType={sortType}/>
            <HamburgerWidget expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}/>
        </div>
        {expandedMenu && <MenuWidget/>}
    </div>);
    /* ttt0 review why there are both menuDivRight and menuDivLeft */
};
