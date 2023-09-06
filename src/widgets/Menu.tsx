import React from 'react';

import '../css/Menu.css';
import {FontConfiguratorWidget} from './FontConfigurator';
import {SearchControlsWidget} from './SearchControls';
import {GoToWidget} from './GoTo';
import {IndexSelectorWidget} from './IndexSelector';
import {ChordConfigWidget} from './ChordConfig';
import {SongRenderConfig} from '../SongRenderConfig';
import {ReactSetter2, SortType} from '../Common';


const MenuWidget1 = () => {
    return (<div>
        <hr className="menuHr" />
        <FontConfiguratorWidget />
        <hr className="menuHr" />
    </div>);
};

const MenuWidget2 = ({
    songRenderConfig,
    setSongRenderConfig,
    sortType,
} : {
    songRenderConfig: SongRenderConfig,
    setSongRenderConfig: ReactSetter2<SongRenderConfig>,
    sortType: SortType | undefined,
}) => {
    return (<div>
        <SearchControlsWidget />
        <hr className="menuHr" />
        <IndexSelectorWidget sortType={sortType}/>
        <hr className="menuHr" />
        <ChordConfigWidget songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}/>
    </div>);
};

export const NavigatingMenuWidget = ({
    songRenderConfig,
    setSongRenderConfig,
    sortType,
    setExpandedMenu,
} : {
    songRenderConfig: SongRenderConfig,
    setSongRenderConfig: ReactSetter2<SongRenderConfig>,
    sortType: SortType,
    setExpandedMenu: ReactSetter2<boolean>,
}) => {
    return (<div>
        <MenuWidget1/>
        <GoToWidget setExpandedMenu={setExpandedMenu}/>
        <hr className="menuHr" />
        <MenuWidget2 songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig} sortType={sortType}/>
    </div>);
};

export const NonNavigatingMenuWidget = ({
    songRenderConfig,
    setSongRenderConfig,
    sortType,
} : {
    songRenderConfig: SongRenderConfig,
    setSongRenderConfig: ReactSetter2<SongRenderConfig>,
    sortType: SortType | undefined,  //!!! Needed so the menu can match the current index. However, the help and search pages don't need it
}) => {
    return (<div>
        <MenuWidget1/>
        <MenuWidget2 songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}
            sortType={sortType}/>
    </div>);
};
