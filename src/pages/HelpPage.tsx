import React from "react";

import '../legacy.css';
import {NonNavigatingRootMenuWidget} from "../widgets/NonNavigatingRootMenu";

export const HelpPage = () => {
    return (
            <div>
                <NonNavigatingRootMenuWidget />
                <span className="songTitle">HelpPage</span>
            </div>
    );
}
