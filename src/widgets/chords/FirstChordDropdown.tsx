import React from 'react';

import {
    accidentalsToDisplay,
    getRoot,
    NOTES,
    AUTO,
} from '../../ChordUtils';

import {ReactSetter2} from '../../Common';

/**
 * Normally it gets the first chord, extracts the quality (major, minor, dim7, ...) and builds a list of all 12
 * chords with the same quality, plus auto. If the param is empty, assumes chords are major.
 *
 * @param chords - Only the first chord matters, if present. If chords' length is 0, just assumes major chords, but
 * this shouldn't matter, in the sense that this may happen only at initialization, and a proper list will be passed
 * shortly. If the song really doesn't have chords, this doesn't get called at all.
 */
function createFirstChordOptions(chords: string[]) {
    //ttt0: "Om bun (Dan Andrei Aldea, Sfinx)" has a funny first chord list: "Cm(C)", "C#m(C)", ... The same happens
    // in the JS code, so it's not a new bug

    const initialChord = chords.length > 0 ? chords[0] : 'D';  //!!! 'D' doesn't matter in itself. We just
    // need a value to avoid checking for null in many places, but nothing will be rendered
    const firstChordRoot = getRoot(initialChord);
    if (!firstChordRoot) {
        throw Error(`Internal error. Unable to find root for chord "${initialChord}"`);
    }
    const arr: string[] = [AUTO];
    const firstChordQuality = initialChord.substring(firstChordRoot.length);
    for (let i = 0; i <= 11; ++i) {
        arr.push(accidentalsToDisplay(NOTES[i]) + firstChordQuality);
    }
    console.log(`createFirstChordOptions(${initialChord}). Generated ${arr}`);
    return arr;
}


/**
 * The initial value for the first chord CbB is computed like this:
 *       If suggestions are enabled, it's "auto"
 *       If suggestions are not enabled, it's the actual first chord in the song.
 */
function computeInitialFirstChord(chords: string[], useAuto: boolean) {
    // noinspection UnnecessaryLocalVariableJS
    const res = useAuto || !chords.length ? AUTO : chords[0];
    console.log(`computeInitialFirstChord(${chords}, ${useAuto}) returning ${res}`);
    return res; //!!! actually nothing will be rendered when there are no chords for a song, but
    // the function will still be called, and it must return "something"
}


export const FirstChordDropdown = ({
    chords,
    useSuggestions,
    firstChordCbBVal,
    setFirstChordCbBVal,
} : {
    chords: string[],
    useSuggestions: boolean,
    firstChordCbBVal: string,
    setFirstChordCbBVal: ReactSetter2<string>,
}) => {

    React.useEffect(() => {
        const newVal = computeInitialFirstChord(chords, useSuggestions);
        console.log(`setting new value for firstChordCbBVal: ${newVal}`);
        setFirstChordCbBVal(newVal);
    }, [useSuggestions, chords, setFirstChordCbBVal]);

    const optionsStr = React.useMemo(() => {
        const newOptions = createFirstChordOptions(chords);
        console.log(`new chords: ${chords}; new options: ${newOptions}`);
        return newOptions;
    }, [chords]);

    const generateOptions = React.useCallback(() => {
        return optionsStr.map((s) => {
            return <option value={s} key={s}>{s}</option>;
        });
    }, [optionsStr]);

    const onChange = React.useCallback((event: React.FormEvent<HTMLSelectElement>) => {
        const s = event.currentTarget.value;
        console.log(`FirstChordCbB.onChange(): Setting FirstChordCbBVal to ${s} when the user changed it`);
        setFirstChordCbBVal(s);  //ttt9: check if this works
    }, [setFirstChordCbBVal]);

    return (
        <select className='dropDown' value={firstChordCbBVal} onChange={onChange}>
            {generateOptions()}
        </select>
    );



    /*var option;
    for (var i = 0; i <= 11; ++i) {
        option = document.createElement("option");
        option.value = option.text = accidentalsToDisplay(NOTES[i]) + firstChordQuality;
        firstChordCbB.appendChild(option);
    }
    if (useSuggestions) {
        if (!isDefined(firstChordCbBVal) || lastSongIndex != currentSongIndex) {
            firstChordCbBVal = AUTO; //!!! note that something similar is not used for capoCbBVal, which has a persisted value
        }
    } else {
        if (!isDefined(firstChordCbBVal) || lastSongIndex != currentSongIndex) {
            firstChordCbBVal = firstChord;
        }
    }
    firstChordCbB.value = fixAccidentals(firstChordCbBVal);
    firstChordCbB.onchange = onFirstChordChanged;
    firstChordCbB.onclick = buildSelectCallback();  //ttt9:
    td.appendChild(firstChordCbB);
    tr.appendChild(td);
    tbdy.appendChild(tr);
    tbl.appendChild(tbdy);
    tbl.className = "capoTable";
    domElem.appendChild(tbl);*/

};

