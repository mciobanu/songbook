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
    fontSize,
    setFontSize,
} : {
    expandedMenu: boolean,
    setExpandedMenu: ReactSetter2<boolean>,
    songRenderConfig: SongRenderConfig,
    setSongRenderConfig: ReactSetter2<SongRenderConfig>,
    optionallyHideMenu: () => void,
    fontSize: number,
    setFontSize: ReactSetter2<number>,
}) => {
    return (
        <div className='mainDiv' onClick={optionallyHideMenu}>
            <NonNavigatingRootMenuWidget expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}
                songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig} sortType={undefined}
                fontSize={fontSize} setFontSize={setFontSize}/>
            <p className="songTitle genericTitle">HelpPage</p>
            <div className='bottomDiv'/>
        </div>
    );
};
