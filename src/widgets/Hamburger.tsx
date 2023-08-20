import React from 'react';

import '../legacy.css';

export const HamburgerWidget = () => {
    // onClick="toggleMenu();"    //ttt0: make this work
    return (<span className="menuNormal hamburgerAlign">
        <input id="menuBtn" type="button" className="toolBtnNormal" value="&equiv;" />
    </span>);
};
