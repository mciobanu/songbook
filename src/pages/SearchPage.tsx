import React from 'react';

import '../legacy.css';
import {NonNavigatingRootMenuWidget} from '../widgets/NonNavigatingRootMenu';
import {ReactSetter2} from '../Common';

export const SearchPage = ({
    expandedMenu, setExpandedMenu,
} : {
    expandedMenu: boolean, setExpandedMenu: ReactSetter2<boolean>,
}) => {
    return (
        <div>
            <NonNavigatingRootMenuWidget expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}/>
            <span className="songTitle">SearchPage</span>
        </div>
    );
};
