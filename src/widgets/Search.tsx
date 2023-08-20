import React from 'react';

import '../legacy.css';

export const SearchWidget = () => {
    // onKeyDown="if (event.keyCode == 13) document.getElementById('searchBtn').click();"   //ttt0: make this work
    // onClick="search('searchInput');"  //ttt0: make this work
    return (<div>
        <input id="searchInput" className="editSearch" placeholder="Căutare" autoCapitalize="off" /> {/*ttt1 see about autocorrect="off"*/}
        {/*ttt1 the fact that there is this comment here causes whitespace to be added to the DOM, as can be seen
        at inspection, causing the button not to be right next to the edit. In GoToWidget space is added
        explicitly, with the same effect. Review implications*/}
        <input id="searchBtn" type="button" className="toolBtnNormal" value="&#x1f50d;" />
    </div>);
};
