import React from 'react';

import {ReactSetter2} from '../../Common';
import {AUTO} from '../../ChordUtils';

export const CapoDropdown = ({
    capoCbBVal,
    setCapoCbBVal,
    setCurrentSuggestion,
} : {
    capoCbBVal: string,
    setCapoCbBVal: ReactSetter2<string>,
    setCurrentSuggestion: ReactSetter2<number>,
}) => {

    const generateOptions = React.useCallback(() => {
        const arr: string[] = [];
        for (let i = 0; i <= 11; ++i) {
            arr.push(String(i));
        }
        return arr.map((s) => {
            return <option value={s} key={s}>{s}</option>;
        });
    }, []);

    const onChange = React.useCallback((event: React.FormEvent<HTMLSelectElement>) => {
        const s = event.currentTarget.value;
        setCapoCbBVal(s);
        setCurrentSuggestion(0);
    }, [setCapoCbBVal, setCurrentSuggestion]);

    // used to prevent clicking on a dropbox to close the menu //ttt2 make sure works OK in old browsers - fine in Android 2.2, not sure about IE
    const onClick = React.useCallback((event:  React.MouseEvent<HTMLSelectElement>) => {
        const s = event.currentTarget.value;
        console.log(`click CkB ${s}`);
        event.stopPropagation();

        //ttt3: Code in JS (below) is more complicated; see if needed, perhaps on older browsers
        /*return function(event) {
            event.cancelBubble = true;
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            return false;
        }*/
    }, []);

    return (
        <select className='dropDown' value={capoCbBVal} onChange={onChange} onClick={onClick}>
            <option value={AUTO} key={AUTO}>{AUTO}</option>
            {generateOptions()}
        </select>
    );
};

