import React from 'react';

import '../css/Menu.css';
import {FontConfiguratorWidget} from './FontConfigurator';
import {SearchWidget} from './Search';
import {GoToWidget} from './GoTo';
import {IndexSelectorWidget} from './IndexSelector';
import {ChordConfigWidget} from './ChordConfig';
import {SongRenderConfig} from '../SongRenderConfig';
import {ReactSetter2} from '../Common';

export const MenuWidget = ({
    songRenderConfig, setSongRenderConfig,
} : {
    songRenderConfig: SongRenderConfig, setSongRenderConfig: ReactSetter2<SongRenderConfig>,
}) => {
    return (<div>
        <hr className="menuHr" />
        <FontConfiguratorWidget />
        <hr className="menuHr" />
        <GoToWidget />
        <hr className="menuHr" />
        <SearchWidget />
        <hr className="menuHr" />
        <IndexSelectorWidget />
        <hr className="menuHr" />
        <ChordConfigWidget songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig}/>
    </div>);
};
