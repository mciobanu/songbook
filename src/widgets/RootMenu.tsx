import React from "react";

import '../legacy.css';
import {MenuWidget} from "./Menu";
import {NavigationWidget} from "./Navigation";

export const RootMenuWidget = () => {
    return (<div className="menuDiv menuDivRight">
        <NavigationWidget></NavigationWidget>
        <MenuWidget></MenuWidget>
    </div>);
    /* ttt0 review why there are both menuDivRight and menuDivLeft */
}
