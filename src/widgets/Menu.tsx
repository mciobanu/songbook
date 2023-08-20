import React from 'react';

import '../css/Menu.css';
import {FontConfiguratorWidget} from './FontConfigurator';
import {SearchWidget} from './Search';
import {GoToWidget} from './GoTo';
import {IndexSelectorWidget} from './IndexSelector';
import {ChordConfigWidget} from './ChordConfig';

export const MenuWidget = () => {
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
        <ChordConfigWidget />
    </div>);
};
