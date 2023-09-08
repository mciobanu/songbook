import React from 'react';

import '../css/Menu.css';
import {NonNavigatingMenuWidget} from './Menu';
import {HamburgerWidget} from './Hamburger';
import {ReactSetter2, SortType} from '../Common';
import {SongRenderConfig} from '../SongRenderConfig';

export const NonNavigatingRootMenuWidget = ({
    expandedMenu,
    setExpandedMenu,
    songRenderConfig,
    setSongRenderConfig,
    sortType,
    fontSize,
    setFontSize,
} : {
    expandedMenu: boolean,
    setExpandedMenu: ReactSetter2<boolean>,
    songRenderConfig: SongRenderConfig,
    setSongRenderConfig: ReactSetter2<SongRenderConfig>,
    sortType: SortType | undefined,
    fontSize: number,
    setFontSize: ReactSetter2<number>,
}) => {

    // used to prevent clicking on the menu to close the menu
    const onClick = React.useCallback((event:  React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    }, []);

    return (<div className="menuDiv menuDivRight menuP" onClick={onClick}>
        <div className="nonNavRootMenuContainer">
            <HamburgerWidget expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}/>
        </div>
        {expandedMenu && <NonNavigatingMenuWidget songRenderConfig={songRenderConfig}
            setSongRenderConfig={setSongRenderConfig} sortType={sortType} fontSize={fontSize}
            setFontSize={setFontSize} setExpandedMenu={setExpandedMenu}/>}
    </div>);
};
