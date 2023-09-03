import React from 'react';

import '../css/Menu.css';
import {NavigatingMenuWidget} from './Menu';
import {NavigationWidget} from './Navigation';
import {HamburgerWidget} from './Hamburger';
import {ReactSetter2, SortType} from '../Common';
import {SongRenderConfig} from '../SongRenderConfig';

import '../legacy.css';


export const NavigatingRootMenuWidget = ({
    songNumber,
    sortType,
    expandedMenu,
    setExpandedMenu,
    songRenderConfig,
    setSongRenderConfig,
} : {
    songNumber: number,
    sortType: SortType,
    expandedMenu: boolean,
    setExpandedMenu: ReactSetter2<boolean>,
    songRenderConfig: SongRenderConfig,
    setSongRenderConfig: ReactSetter2<SongRenderConfig>,
}) => {

    // used to prevent clicking on the menu to close the menu
    const onClick = React.useCallback((event:  React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    }, []);

    return <>
        <p className={'crtAnchor'}/>
        <div className="menuDiv menuDivRight menuP" onClick={onClick}>
            <div className="navRootMenuContainer">
                <NavigationWidget songNumber={songNumber} sortType={sortType}/>
                <HamburgerWidget expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}/>
            </div>
            {expandedMenu && <NavigatingMenuWidget songRenderConfig={songRenderConfig}
                setSongRenderConfig={setSongRenderConfig} sortType={sortType} setExpandedMenu={setExpandedMenu}/>}
        </div>
    </>;
    /* ttt0 review why there are both menuDivRight and menuDivLeft */
};
