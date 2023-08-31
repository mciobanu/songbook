import React from 'react';

import '../legacy.css';
import {NonNavigatingRootMenuWidget} from '../widgets/NonNavigatingRootMenu';
import {ReactSetter2} from '../Common';
import {SongRenderConfig} from '../SongRenderConfig';


export const SearchPage = ({
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
    return (
        <div>
            <NonNavigatingRootMenuWidget expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}
                songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}/>
            <p className="songTitle">SearchPage</p> {/*ttt0 review className*/}
        </div>
    );
};
