import React from 'react';

import '../legacy.css';
import {Link} from 'react-router-dom';
import {Paths} from '../Paths';
import {SortType} from '../Common';

export const IndexSelectorWidget = ({
    sortType,
} : {
    sortType: SortType | undefined,
}) => {

    function getClass(currentSortType: SortType) {
        return sortType === currentSortType ? 'menuCurrent' : 'menuNormal';
    }

    return (<div>
        Ordonare după: <br/>
        <Link to={Paths.indexByPosition}><span className={getClass(SortType.position)}>Număr</span></Link> <br/>
        <Link to={Paths.indexByTitle}><span className={getClass(SortType.title)}>Titlu</span></Link> <br/>
        <Link to={Paths.indexByPerformer}><span className={getClass(SortType.performer)}>Interpret</span></Link> <br/>
        <Link to={Paths.indexByLyricist}><span className={getClass(SortType.lyricist)}>Textier</span></Link> <br/>
        <Link to={Paths.indexByVerse}><span className={getClass(SortType.verse)}>Versuri</span></Link>
        {/*<a id="list_unsorted" className="menuNormal" href="#list_unsorted"> Număr </a> <br/>
        <a id="list_by_title" className="menuNormal" href="#list_by_title"> Titlu </a> <br/>
        <a id="list_by_performer" className="menuNormal" href="#list_by_performer"> Interpret </a> <br/>
        <a id="list_by_lyricist" className="menuNormal" href="#list_by_lyricist"> Textier </a> <br/>
        <a id="list_by_verse" className="menuNormal" href="#list_by_verse"> Versuri </a>*/}

    </div>);
};
