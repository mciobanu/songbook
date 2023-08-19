import React from "react";

import '../legacy.css';
import {MenuWidget} from "./Menu";
import {HamburgerWidget} from "./Hamburger";

export const NonNavigatingRootMenuWidget = () => {
    return (<div className="menuDiv menuDivRight">
        <HamburgerWidget />
        <MenuWidget />
    </div>);
}
