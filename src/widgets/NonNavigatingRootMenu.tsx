import React from 'react';

import '../css/Menu.css';
import {NonNavigatingMenuWidget} from './Menu';
import {HamburgerWidget} from './Hamburger';
import {ReactSetter2} from '../Common';
import {SongRenderConfig} from '../SongRenderConfig';

export const NonNavigatingRootMenuWidget = ({
    expandedMenu,
    setExpandedMenu,
    songRenderConfig,
    setSongRenderConfig,
} : {
    expandedMenu: boolean,
    setExpandedMenu: ReactSetter2<boolean>,
    songRenderConfig: SongRenderConfig,
    setSongRenderConfig: ReactSetter2<SongRenderConfig>,
}) => {
    return (<div className="menuDiv menuDivRight menuP">
        <div className="nonNavRootMenuContainer">
            <HamburgerWidget expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}/>
        </div>
        {expandedMenu && <NonNavigatingMenuWidget songRenderConfig={songRenderConfig}
            setSongRenderConfig={setSongRenderConfig}/>}
    </div>);
};
