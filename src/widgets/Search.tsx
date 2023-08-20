import React from 'react';

import '../legacy.css';

export const SearchWidget = () => {
    // onKeyDown="if (event.keyCode == 13) document.getElementById('searchBtn').click();"   //ttt0: make this work
    // onClick="search('searchInput');"  //ttt0: make this work
    return (<div>
        <input id="searchInput" className="editSearch" placeholder="Căutare" autoCapitalize="off"  /> {/*ttt1 see about autocorrect="off"*/}
        <input id="searchBtn" type="button" className="toolBtnNormal" value="&#x1f50d;" />
    </div>);
};
