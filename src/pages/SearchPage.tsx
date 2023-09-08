import React from 'react';
import {useParams} from 'react-router-dom';

import '../legacy.css';
import {NonNavigatingRootMenuWidget} from '../widgets/NonNavigatingRootMenu';
import {ReactSetter2} from '../Common';
import {SongRenderConfig} from '../SongRenderConfig';
import {persistLastPath} from '../Persistence';
import {SearchControlsWidget} from '../widgets/SearchControls';
import {SearchResultsWidget} from '../widgets/SearchResults';
import {searchTermsAndMerge} from '../search/Search';


type SearchParams = {
    searchTerms: string;
};

export const SearchPage = ({
    expandedMenu,
    setExpandedMenu,
    songRenderConfig,
    setSongRenderConfig,
    optionallyHideMenu,
    fontSize,
    setFontSize,
} : {
    expandedMenu: boolean,
    setExpandedMenu: ReactSetter2<boolean>,
    songRenderConfig: SongRenderConfig,
    setSongRenderConfig: ReactSetter2<SongRenderConfig>,
    optionallyHideMenu: () => void,
    fontSize: number,
    setFontSize: ReactSetter2<number>,
}) => {
    persistLastPath(window.location.pathname);

    const {searchTerms} = useParams<SearchParams>();

    //console.log(`search by "${searchTerms}"`);

    const searchResult = React.useMemo(() => {
        return searchTermsAndMerge(searchTerms || '');
    }, [searchTerms]);

    return (
        <div className='mainDiv' onClick={optionallyHideMenu}>
            <NonNavigatingRootMenuWidget expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu}
                songRenderConfig={songRenderConfig} setSongRenderConfig={setSongRenderConfig} sortType={undefined}
                fontSize={fontSize} setFontSize={setFontSize}/>
            <p className="songTitle genericTitle">Căutare</p>  {/*ttt1: same as edit placeholder */}
            <SearchControlsWidget initialSearchTerms={searchTerms || ''} setExpandedMenu={setExpandedMenu}/>
            <hr className='searchSeparator'/>
            <SearchResultsWidget searchResult={searchResult} searchTerms={searchTerms || ''}/>
            <div className='bottomDiv'/>
        </div>
    );
};

//!!!: When going to "http://suse-main2:3000/search" (no search term), it gets redirected to the home page, most
// likely because there is a parameter in `${Paths.search}/:searchTerms`
