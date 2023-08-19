import React from "react";

import '../legacy.css';
import {NonNavigatingRootMenuWidget} from "../widgets/NonNavigatingRootMenu";
import {SortType} from "../Common";

export const IndexPage = ({sortType}: {sortType: SortType}) => {
    return (
            <div>
                <NonNavigatingRootMenuWidget />
                <span className="songTitle">IndexPage, by {sortType}</span>
            </div>
    );
}
