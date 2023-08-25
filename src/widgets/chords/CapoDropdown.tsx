import React from 'react';

import {ReactSetter2} from '../../Common';
import {AUTO} from '../../ChordUtils';

export const CapoDropdown = ({
    capoCbBVal,
    setCapoCbBVal,
} : {
    capoCbBVal: string,
    setCapoCbBVal: ReactSetter2<string>,
}) => {
    /*var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.appendChild(document.createTextNode("Capodastru: "));
    tr.appendChild(td);
    td = document.createElement("td");

    capoCbB = document.createElement("select");
    capoCbB.className = "dropDown";
    var option = document.createElement("option");
    option.value = option.text = AUTO;
    capoCbB.appendChild(option);
    for (let i = 0; i <= 11; ++i) {
        option = document.createElement("option");
        option.value = option.text = i;
        capoCbB.appendChild(option);
    }
    if (capoCbBVal) {
        capoCbB.value = capoCbBVal;  //ttt9:
    }
    capoCbB.onchange = onCapoChanged; //ttt9:
    capoCbB.onclick = buildSelectCallback();  //ttt9: // used to prevent clicking on a dropbox to close the menu //ttt2 make sure works OK in old browsers - fine in Android 2.2, not sure about IE
    td.appendChild(capoCbB);
    tr.appendChild(td);
    tbdy.appendChild(tr);*/

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
        setCapoCbBVal(s);  //ttt9: check if this works
    }, [setCapoCbBVal]);

    return (
        <select className='dropDown' value={capoCbBVal} onChange={onChange}>
            <option value={AUTO} key={AUTO}>{AUTO}</option>
            {generateOptions()}
        </select>
    );
};

