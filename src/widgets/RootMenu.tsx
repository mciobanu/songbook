import React from "react";

import '../legacy.css';
import {MenuWidget} from "./Menu";
import {NavigationWidget} from "./Navigation";
import {HamburgerWidget} from "./Hamburger";

export const RootMenuWidget = () => {
    return (<div className="menuDiv menuDivRight">
        <div>
            <NavigationWidget />
            <HamburgerWidget />
        </div>
        <MenuWidget />
    </div>);
    /* ttt0 review why there are both menuDivRight and menuDivLeft */
}
