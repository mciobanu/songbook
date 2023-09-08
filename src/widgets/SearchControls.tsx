import React from 'react';

import {useNavigate} from 'react-router-dom';
import {Paths} from '../Paths';

import '../legacy.css';
import {ReactSetter2} from '../Common';


/**
 * Used both in the menu and in the search page
 *
 * @constructor
 */
export const SearchControlsWidget = ({
    initialSearchTerms,
    setExpandedMenu,
} : {
    initialSearchTerms: string,
    setExpandedMenu: ReactSetter2<boolean>,
}) => {
    const [searchTerms, setSearchTerms] = React.useState(initialSearchTerms);
    /*
    //ttt2 See if this can be made to work: The idea is that you could skip useState if you only care about getting the
    // value when the button is pressed. However, it's not clear how to set the initial value of the edit box
    const searchInput2 = React.useRef<HTMLInputElement>(null);
     <input id="searchInput2" className="editSearch2" placeholder="Căutare" autoCapitalize="off" ref={searchInput2}/>
    */

    React.useEffect(() => {
        setSearchTerms(initialSearchTerms);
    }, [initialSearchTerms]);

    function onChange(event: React.FormEvent<HTMLInputElement>) {
        setSearchTerms(event.currentTarget.value);
    }

    const navigate = useNavigate();

    const onSearch = React.useCallback(() => {
        navigate(`${Paths.search}/${searchTerms}`);
        setExpandedMenu(false);
    }, [navigate, searchTerms, setExpandedMenu]);

    // https://felixgerschau.com/react-typescript-onkeydown-event-type/
    const onKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {   //ttt1: Review this, at least use some official constant
            onSearch();
        }
    }, [onSearch]);

    return (<div>
        <input id="searchInput2" className="editSearch2" placeholder="Căutare" value={searchTerms}
            autoCapitalize="off" onChange={onChange} onKeyDown={onKeyDown}/> {/*ttt1 see about autocorrect="off"*/}
        {/*ttt1 the fact that there is this comment here causes whitespace to be added to the DOM, as can be seen
        at inspection, causing the button not to be right next to the edit. In GoToWidget, space is added
        explicitly, with the same effect. Review implications*/}
        <input id="searchBtn" type="button" className="toolBtnNormal" value="&#x1f50d;" disabled={!searchTerms}
            onClick={onSearch}/>
    </div>);
};
