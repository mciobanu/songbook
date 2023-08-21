import React from 'react';

import '../css/Menu.css';
import {FontConfiguratorWidget} from './FontConfigurator';
import {SearchWidget} from './Search';
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
} : {
    songRenderConfig: SongRenderConfig,
    setSongRenderConfig: ReactSetter2<SongRenderConfig>,
}) => {
    return (<div>
        <SearchWidget />
        <hr className="menuHr" />
        <IndexSelectorWidget />
        <hr className="menuHr" />
        <ChordConfigWidget songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}/>
    </div>);
};

export const NavigatingMenuWidget = ({
    songRenderConfig,
    setSongRenderConfig,
    sortType,
} : {
    songRenderConfig: SongRenderConfig,
    setSongRenderConfig: ReactSetter2<SongRenderConfig>,
    sortType: SortType,
}) => {
    return (<div>
        <MenuWidget1/>
        <GoToWidget sortType={sortType}/>
        <hr className="menuHr" />
        <MenuWidget2 songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}/>
    </div>);
};

export const NonNavigatingMenuWidget = ({
    songRenderConfig,
    setSongRenderConfig,
} : {
    songRenderConfig: SongRenderConfig,
    setSongRenderConfig: ReactSetter2<SongRenderConfig>,
}) => {
    return (<div>
        <MenuWidget1/>
        <MenuWidget2 songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}/>
    </div>);
};
