import React from 'react';

import '../legacy.css';
import {Link} from 'react-router-dom';
import {Paths} from '../Paths';

export const IndexSelectorWidget = () => {
    return (<div>
        Ordonare după: <br/>      {/*ttt0 have the current index in bold */}
        <Link to={Paths.indexByPosition}>Număr</Link> <br/>
        <Link to={Paths.indexByTitle}>Titlu</Link> <br/>
        <Link to={Paths.indexByPerformer}>Interpret</Link> <br/>
        <Link to={Paths.indexByLyricist}>Textier</Link> <br/>
        <Link to={Paths.indexByVerse}>Versuri</Link>
        {/*<a id="list_unsorted" className="menuNormal" href="#list_unsorted"> Număr </a> <br/>
        <a id="list_by_title" className="menuNormal" href="#list_by_title"> Titlu </a> <br/>
        <a id="list_by_performer" className="menuNormal" href="#list_by_performer"> Interpret </a> <br/>
        <a id="list_by_lyricist" className="menuNormal" href="#list_by_lyricist"> Textier </a> <br/>
        <a id="list_by_verse" className="menuNormal" href="#list_by_verse"> Versuri </a>*/}

    </div>);
};
