import React from 'react';

import '../css/Menu.css';
import {MenuWidget} from './Menu';
import {HamburgerWidget} from './Hamburger';
import {ReactSetter2} from '../Common';

export const NonNavigatingRootMenuWidget = ({
    expandedMenu, setExpandedMenu,
} : {
    expandedMenu: boolean, setExpandedMenu: ReactSetter2<boolean>,
}) => {
    return (<div className="menuDiv menuDivRight menuP">
        <div className="nonNavRootMenuContainer">
            <HamburgerWidget expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}/>
        </div>
        {expandedMenu && <MenuWidget/>}
    </div>);
};
