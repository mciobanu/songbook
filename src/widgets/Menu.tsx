import React from 'react';

import '../legacy.css';
import {FontConfiguratorWidget} from './FontConfigurator';
import {SearchWidget} from './Search';
import {GoToWidget} from './GoTo';
import {IndexSelectorWidget} from './IndexSelector';
import {ChordConfigWidget} from './ChordConfig';

export const MenuWidget = () => {
    return (<div>
        <FontConfiguratorWidget></FontConfiguratorWidget>
        <GoToWidget></GoToWidget>
        <SearchWidget></SearchWidget>
        <IndexSelectorWidget></IndexSelectorWidget>
        <ChordConfigWidget></ChordConfigWidget>
    </div>);
};
