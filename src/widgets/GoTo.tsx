import React from 'react';
import {useNavigate} from 'react-router-dom';

import '../legacy.css';
import {ReactSetter2, SortType} from '../Common';
import {getSortedSongs} from '../SongCollections';
import {createSongPath} from '../Paths';


/**
 * Goes to the specified position in the original list, regardless of the current sort type. The idea is that while
 * it's "nice" to use the sort type, it's confusing for users to refer to the same song if they use different sort
 * types. And in some pages the sort tpe isn't really defined, although it can be said that it persists from
 * previous pages.
 *
 * @param setExpandedMenu
 * @constructor
 */
export const GoToWidget = ({
    setExpandedMenu,
} : {
    setExpandedMenu: ReactSetter2<boolean>,
}) => {

    const [songNo, setSongNo] = React.useState<string>('');

    const navigate = useNavigate();

    const onGo = React.useCallback(() => {
        const songs = getSortedSongs(SortType.position);
        const k = Number.parseInt(songNo, 10);
        if (Number.isNaN(k) || `${k}` !== songNo || k < 1 || k > songs.length) {
            alert(`Trebuie introdus un număr între 1 și ${songs.length}`);
            return;
        }
        navigate(createSongPath(SortType.position, k));
        setSongNo('');
        setExpandedMenu(false);

    }, [navigate, setExpandedMenu, songNo]);

    const onEditChanged = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
        const s = event.currentTarget.value;
        setSongNo(s);
    }, []);

    // https://felixgerschau.com/react-typescript-onkeydown-event-type/
    const onKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {   //ttt1: Review this, at least use some official constant
            onGo();
        }
    }, [onGo]);

    return (<div>
        <input id="gotoInput" type="number" value={songNo} className="editGoto" placeholder="Număr"
            onChange={onEditChanged} onKeyDown={onKeyDown}/>
        &nbsp;
        <input id="gotoBtn" type="button" className="toolBtnNormal" value="&#10148;" onClick={onGo}/>
    </div>);
};
