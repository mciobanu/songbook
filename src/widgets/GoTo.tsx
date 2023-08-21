import React from 'react';
import {useNavigate} from 'react-router-dom';

import '../legacy.css';
import {ReactSetter2, SortType} from '../Common';
import {getSortedSongs} from '../SongCollections';
import {createSongPath} from '../Paths';

export const GoToWidget = ({
    sortType,
    setExpandedMenu,
} : {
    sortType: SortType,
    setExpandedMenu: ReactSetter2<boolean>,
}) => {

    const [songNo, setSongNo] = React.useState<string>('');

    const navigate = useNavigate();

    const onGo = React.useCallback(() => {
        const songs = getSortedSongs(sortType);
        const k = Number.parseInt(songNo, 10);
        if (Number.isNaN(k) || `${k}` !== songNo || k < 1 || k > songs.length) {
            alert(`Trebuie introdus un număr între 1 și ${songs.length}`);
            return;
        }
        navigate(createSongPath(sortType, k));
        setSongNo('');
        setExpandedMenu(false);

    }, [navigate, setExpandedMenu, songNo, sortType]);

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
