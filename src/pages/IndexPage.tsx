import React from "react";

import '../legacy.css';
import {RootMenuWidget} from "../widgets/RootMenu";
import {SortType} from "../Common";

export const IndexPage = ({sortType}: {sortType: SortType}) => {
    return (
            <div>
                <RootMenuWidget />
                <span className="songTitle">IndexPage, by {sortType}</span>
            </div>
    );
}
