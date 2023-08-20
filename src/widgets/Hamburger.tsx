import React from 'react';

import '../legacy.css';
import {ReactSetter2} from '../Common';

export const HamburgerWidget = ({
    expandedMenu, setExpandedMenu,
} : {
    expandedMenu: boolean, setExpandedMenu: ReactSetter2<boolean>,
}) => {
    const onToggle = React.useCallback(() => {
        setExpandedMenu(!expandedMenu);
    }, [expandedMenu, setExpandedMenu]);

    // onClick="toggleMenu();"    //ttt0: make this work
    return (<span className="menuNormal hamburgerAlign">
        <input id="menuBtn" type="button" className="toolBtnNormal" value="&equiv;" onClick={onToggle}/>
    </span>);
};
