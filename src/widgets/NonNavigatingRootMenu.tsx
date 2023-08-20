import React from 'react';

import '../css/Menu.css';
import {MenuWidget} from './Menu';
import {HamburgerWidget} from './Hamburger';

export const NonNavigatingRootMenuWidget = () => {
    return (<div className="menuDiv menuDivRight menuP">
        <div className="nonNavRootMenuContainer">
            <HamburgerWidget />
        </div>
        <MenuWidget />
    </div>);
};
