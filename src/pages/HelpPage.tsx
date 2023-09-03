import React from 'react';

import '../legacy.css';
import {NonNavigatingRootMenuWidget} from '../widgets/NonNavigatingRootMenu';
import {ReactSetter2} from '../Common';
import {SongRenderConfig} from '../SongRenderConfig';


export const HelpPage = ({
    expandedMenu,
    setExpandedMenu,
    songRenderConfig,
    setSongRenderConfig,
    optionallyHideMenu,
} : {
    expandedMenu: boolean,
    setExpandedMenu: ReactSetter2<boolean>,
    songRenderConfig: SongRenderConfig,
    setSongRenderConfig: ReactSetter2<SongRenderConfig>,
    optionallyHideMenu: () => void,
}) => {
    return (
        <div onClick={optionallyHideMenu}>
            <NonNavigatingRootMenuWidget expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}
                songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig} sortType={undefined}/>
            <p className="songTitle">HelpPage</p> {/*ttt0 probably wrong className*/}
        </div>
    );
};
