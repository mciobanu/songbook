/* eslint-disable max-len */  //ttt9: remove
import React from 'react';

import '../legacy.css';
import {SongRenderConfig} from '../SongRenderConfig';
import {Song} from '../Song';
import {ReactSetter2} from '../Common';
import {accidentalsToDisplay, NOTES} from '../RangeProcessor';


//ttt0 check when same person is lyricist / performer / composer ... and keep one instance of each name, separate by comma

export const AUTO = 'auto'; //ttt0: move


/**
 * The main purpose for this is to define alternative notes / chords, when a song can be sung in different ways
 *
 * Chord notes, like in "Noapte la mare" or "Cântec de inimă albastră": a "verse" that starts with "([", ends with "])",
 * and has no other "[" or "]" (but might have "(" or ")"; after "([" there may be a comment, which ends with ": ";
 * this is kept as is and what follows (or the whole thing if there is no comment) is passed through chord conversion;
 *
 * chord separators are defined in substituteChords;
 * note that substituteChords does nothing if its parameter doesn't start with a chord
 *
 * @param verse
 */
function isChordNotes(verse: string) {
    const n = verse.length;
    //return n > 4 && verse[1] == "(" && verse[2] == "[" && verse.indexOf("]") == n - 2 && verse.indexOf(")") == n - 1; //!!! not right: "Cântec de inimă albastră" has inner ")"
    return n > 4 && verse[0] === '(' && verse[1] === '[' && verse.indexOf(']') === n - 2 && verse[n - 1] === ')';
}

/**
 * Returns the root of a chord ("A" for "Am7")
 * Returns null if the param is a string but not a chord, or if it is null
 * @param chord
 */
function getRoot(chord: string): string | null {
    if (!chord || chord.length === 0 || chord[0] < 'A' || chord[0] > 'G') {
        return null;
    }
    let rootLen = 1;
    if (chord.length >= 2 && (chord[1] === '♯' || chord[1] === '♭')) {
        rootLen = 2;
    }
    return chord.substring(0, rootLen);
}


function getAllChords(song: Song): string[] {

    const chords = new Set<string>();
    const deferredChords = new Set<string>(); //used to prevent some intro chords to be detected as "first chord"
    for (let i = 0; i < song.b.length; ++i) { //!!! song["b"] is used rather than song.b to prevent Google Closure Compiler from renaming properties of an object that will be deserialized; see http://stackoverflow.com/questions/7823811/prevent-google-closure-compiler-from-renaming-settings-objects?rq=1 - "Unfortunately, doing data["hello"] all over the place is the recommended (and official) Closure way of preventing variable renaming."
        const stanza = song.b[i];
        const verses = stanza.v;
        if (!verses) {
            continue;
        }
        for (let j = 0; j < verses.length; ++j) {
            const verse = verses[j];
            if (isChordNotes(verse)) { // it's an alternative range or some other note, which we just ignore here
                continue;
            }
            let k = verse.indexOf('[');
            /*if (verse.indexOf("restul e numa") != -1) {
                debugger;
            }//*/
            //var deferred = k == 0 && verse.indexOf("]") == verse.length - 1; //ttt3 review; probably quite confusing when intro is ignored; so as of 2015-12-21 nothing is actually deferred, by setting deferred=false
            const deferred = false;
            for (;;) {
                if (k === -1) {
                    break;
                }
                const h = verse.indexOf(']', k);
                if (h === -1) {
                    break;
                }
                let a = verse.substring(k + 1, h).split(' '); // regular list of chords
                if (a.length === 1) {
                    let a2 = verse.substring(k + 1, h);
                    if (a2.startsWith(';')) {
                        a2 = a2.substring(1);
                    }
                    a = a2.split(';'); // chords that change in the same vowel
                }
                for (let c = 0; c < a.length; ++c) {
                    let chord = a[c].trim();
                    if (chord !== 'N' && chord !== '/') {
                        if (chord.startsWith('1:') || chord.startsWith('2:')) {
                            chord = chord.substring(2);
                        }
                        if (getRoot(chord)) {
                            if (deferred) {
                                deferredChords.add(chord);
                            } else {
                                chords.add(chord);
                            }
                        } else {
                            //console.log("got non-chord passed as chord: '" + chord + "' in verse '" + verse + "'");
                            throw Error(`got non-chord passed as chord: '${chord}' in verse '${verse}'`);
                        }
                    }
                }
                k = verse.indexOf('[', h);
            }
        }
    }

    //const res: string[] = [];

    /*for (const chord in deferredChords) {  //ttt0: make sure the sets implement the original functionality
        if (deferredChords.hasOwnProperty(chord)) {
            chords[chord] = 1;
        }
    }
    for (const chord in chords) {
        if (chords.hasOwnProperty(chord)) {
            res.push(chord);
        }
    }*/
    //return [...chords, ...deferredChords]; // requires ES2015, let's not force it
    deferredChords.forEach((s) => chords.add(s));
    return Array.from(chords);
}

const CapoCbB = ({
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


const FirstChordCbB = ({
    chords,
    useSuggestions,
} : {
    chords: string[],
    useSuggestions: boolean,
}) => {
    const [firstChordCbBVal, setFirstChordCbBVal] = React.useState<string>(/*computeInitialFirstChord()*/'');

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


/**
 * The capo and the first chord. Rendered together, so they can be aligned, for which a table is used
 *
 * Functionality: For capo and first chord we want to compute something initially for a song, then don't touch them
 * unless the settings change.
 */
export const DropdownsWidget = ({
    chords,
    songRenderConfig,
    capoCbBVal,
    setCapoCbBVal,
} : {
    chords: string[],
    songRenderConfig: SongRenderConfig,
    capoCbBVal: string,
    setCapoCbBVal: ReactSetter2<string>,
}) => {
    if (!songRenderConfig.showChords) {
        throw Error('Internal error. Asked to create chord info when chords are not rendered');
    }

    return (
        <table className={'capoTable'}>
            <tbody>
                {songRenderConfig.useSuggestions && (
                    <tr>
                        <td>Capodastru: </td>
                        <td><CapoCbB capoCbBVal={capoCbBVal} setCapoCbBVal={setCapoCbBVal}/></td>
                    </tr>)}
                {chords.length && (
                    <tr>
                        <td>Primul acord: </td>
                        <td><FirstChordCbB chords={chords} useSuggestions={songRenderConfig.useSuggestions}/></td>
                    </tr>)}
            </tbody>
        </table>);
};


/**
 * Creates the part above the actual song, with chord, capo, suggestions, etc.
 */
export const ChordsWidget = ({
    chords,
    songRenderConfig,
    capoCbBVal,
    setCapoCbBVal,
} : {
    chords: string[],
    songRenderConfig: SongRenderConfig,
    capoCbBVal: string,
    setCapoCbBVal: ReactSetter2<string>,
}) => {
    if (!songRenderConfig.showChords || !chords.length) {
        return null;
    }
    return (
        <DropdownsWidget chords={chords} songRenderConfig={songRenderConfig} capoCbBVal={capoCbBVal}
            setCapoCbBVal={setCapoCbBVal}/>
    );
    // var tbl = document.createElement("table");
    // var tbdy = document.createElement("tbody");
    //
    //
    // if (lastSongIndex != currentSongIndex || !suggestions) {
    //     if (useSuggestions) {
    //         suggestions = getChordSuggestions(range, chords);
    //         rangeShift = suggestions[0].rangeShift;
    //         capo = suggestions[0].capo;
    //         outsideRange = suggestions[0].outsideRange;
    //     } else {
    //         suggestions = null;
    //         var shiftedChordRoot = getRoot(firstChordCbBVal);
    //         if (!shiftedChordRoot) {
    //             throw "Logic error: null shiftedChordRoot";
    //         }
    //         rangeShift = (getNoteIndex(shiftedChordRoot) - getNoteIndex(firstChordRoot) + 12) % 12;
    //         capo = 0;
    //         outsideRange = false;
    //     }
    // }
    // //!!! else nothing: the user chose something specifically
    //
    // var textDetails = [];
    //
    // if (capo != 0) {
    //     //currentInfo += " ; |" + capo;
    //     //addTextDetail("|" + capo, domElem, outsideRange);
    //     textDetails.push("|" + capo); textDetails.push(outsideRange);
    // }
    // if (range) {
    //     //currentInfo += " ; " + getShiftedRange(range);
    //     //addTextDetail("Interval: " + getShiftedRange(range), domElem, outsideRange);
    //     textDetails.push("Interval: " + getShiftedRange(range)); textDetails.push(outsideRange);
    // }
    // //currentInfo += " ; " + substituteChords(chords[0]);
    // var chordsTxt = substituteChords(chords[0]);
    // for (var i = 1; i < chords.length; ++i) {
    //     //currentInfo += ", " + substituteChords(chords[i]);
    //     chordsTxt += ", " + substituteChords(chords[i]);
    // }
    // //addTextDetail("Acorduri: " + chordsTxt, domElem);
    // textDetails.push("Acorduri: " + chordsTxt); textDetails.push(false);
    // if (firstNote) {
    //     //currentInfo += " ; " + substituteChords(firstNote); //!!! song["f"] is a note, not a chord, but it's OK to call substituteChords
    //     //addTextDetail("Prima notă: " + substituteChords(firstNote), domElem);
    //     textDetails.push("Prima notă: " + substituteChords(firstNote)); textDetails.push(false);
    // }
    // if (showOriginalSuggestions) {
    //     currentInfo = "Sugestie originală: " + (range ? range + " ; " : "") + chords + (firstNote ? " ; " + firstNote : "") + (song["s"] ? " ; (" + song["s"] + ")" : "");
    //     //addTextDetail(currentInfo, domElem);
    //     textDetails.push(currentInfo); textDetails.push(false);
    // }
    // /*} else {
    //     currentInfo += chords[0];
    //     for (var i = 1; i < chords.length; ++i) {
    //         currentInfo += ", " + chords[i];
    //     }
    //     currentInfo += " ; " + substituteChords(song["f"]); //!!! song["f"] is a note, not a chord, but it's OK to call substituteChords
    //     if (showOriginalSuggestions) {
    //         currentInfo += " {" + chords + (firstNote ? " ; " + firstNote : "") + (song["s"] ? " ; (" + song["s"] + ")" : "") + "}";
    //     }
    //     suggestions = null;
    // }*/
    // var i1 = 0;
    // for (; i1 < textDetails.length - 2; i1 += 2) {
    //     addTextDetail(textDetails[i1], domElem, textDetails[i1 + 1], false);
    // }
    // addTextDetail(textDetails[i1], domElem, textDetails[i1 + 1], true);
    //
    // /*node = document.createElement("p");
    // node.className = "songLastVerse" + (outsideRange ? " outsideRange" : " insideRange");
    // //node.className = "songLastVerse";
    // var textNode = document.createTextNode(fixAccidentals(currentInfo.substring(3))); // 3 is to remove starting " ; "
    // node.appendChild(textNode);
    // domElem.appendChild(node);//*/
    //
    // if (suggestions) {
    //     node = document.createElement("p");
    //     node.className = "suggestion";
    //     for (var i = 0; i < suggestions.length; ++i) {
    //         var s = suggestions[i];
    //         var rangeShift2 = s.rangeShift;
    //         var capo2 = s.capo;
    //         currentInfo = "";
    //         currentInfo += substituteChords(chords[0], rangeShift2, capo2);
    //         if (capo2 != 0) {
    //             currentInfo += "|" + capo2;
    //         }
    //         currentInfo += " " + getShiftedRange(range, rangeShift2);
    //         if (debugEnabled) {
    //             currentInfo += " " + s.score;
    //         }
    //         var btn = document.createElement("button");
    //         btn.className = "btnNormal";
    //         var textNode = document.createTextNode(fixAccidentals(currentInfo));
    //         btn.appendChild(textNode);
    //         btn.onclick = buildSuggestionCallback(rangeShift2, capo2, s.outsideRange, hash);
    //         if (capo2 == capo && rangeShift2 == rangeShift) {
    //             btn.disabled = true;
    //         }
    //         node.appendChild(btn);
    //     }
    //     domElem.appendChild(node);
    // }
    //
    // if (song["d"]) {
    //     node = document.createElement("p");
    //     node.className = "songLastVerse";
    //     var textNode = document.createTextNode(fixAccidentals(song["d"])); //ttt3 get range-shifted definitions
    //     node.appendChild(textNode);
    //     domElem.appendChild(node);
    // }
};

export const SongWidget = ({
    song,
    songRenderConfig,
    capoCbBVal,
    setCapoCbBVal,
} : {
    song: Song,
    songRenderConfig: SongRenderConfig,
    capoCbBVal: string,
    setCapoCbBVal: ReactSetter2<string>,
}) => {
    /*const [chords, setChords] = React.useState(getAllChords(song)); //ttt1: Review situations like this,
    // where it probably makes more sense to use a dummy chord list, as this function call will be replaced in the useEffect() below
    React.useEffect(() => {
        setChords(getAllChords(song));
    }, [song]);*/

    const chords = React.useMemo(() => {
        return getAllChords(song);
    }, [song]);

    return <ChordsWidget chords={chords} songRenderConfig={songRenderConfig} capoCbBVal={capoCbBVal}
        setCapoCbBVal={setCapoCbBVal}/>;
    /*{ &&
(songRenderConfig.showChords &&

            <CreateChordWidget song={song} songRenderConfig={songRenderConfig}
            capoCbBVal={capoCbBVal} setCapoCbBVal={setCapoCbBVal}/>}
    </div>);*/

    /*var node = document.createElement("p");
    node.className = "songTitle";
    //var textNode = document.createTextNode(getInfoByTitle(song) + " #" + (song.index + 1));
    var textNode = document.createTextNode(/!*(song.index + 1) + ". " +*!/ getInfoByNumber(song));
    node.appendChild(textNode);
    domElem.appendChild(node);*/

    // if (chordsCkB.checked) {
    // }
    //
    // if (localStorage["showNotes"] == "true" && song["n"]) { //ttt2 maybe separate setting and place
    //     currentInfo = "";
    //     for (var i = 0; i < song["n"].length; ++i) {
    //         currentInfo += "; " + song["n"][i];
    //     }
    //     var textNode = document.createTextNode(fixAccidentals(currentInfo.substring(2))); // 2 is to remove starting "; "
    //     node = document.createElement("p");
    //     node.className = "songLastVerse";
    //     node.appendChild(textNode);
    //     domElem.appendChild(node);
    // }
    //
    // cloneEmptyStanzas(song);
    // for (var i = 0; i < song["b"].length; i++) {
    //     var stanza = song["b"][i];
    //     var verses = stanza["v"];
    //     var n = verses.length;
    //     var prevNode;
    //     for (var j = 0; j < n; j++) {
    //         var verse = verses[j];
    //         verse = removeInvisibleId(verse);
    //         if (isChordNotes(verse) && !chordsCkB.checked) {
    //             continue;
    //         }
    //
    //         if (j == 0) {
    //             if (stanza["r"] && stanza["r"] != 1) {
    //                 verse = stanza["r"] + "x: " + verse;
    //             }
    //             var id = stanza["i"];
    //             if (id) {
    //                 id = id.replace(/\^.*/, "");
    //                 if (id) {
    //                     verse = id + ") " + verse;
    //                 }
    //             }
    //         }
    //
    //         //node.setAttribute("class", j == n - 1 ? "songLastVerse" : "songNormalVerse"); // apparently setAttribute() not needed - http://stackoverflow.com/questions/3919291/when-to-use-setattribute-vs-attribute-in-javascript  http://stackoverflow.com/questions/22151560/what-is-happening-behind-setattribute-vs-attribute  http://quirksmode.org/dom/core/#attributes  ; need to test in old browsers (IE6, IE7, IE8) but Android 2.2 seems fine
    //         // see also http://www.w3schools.com/jsref/dom_obj_all.asp, because not all attributes have the same HTML and JavaScript name (e.g. class vs className);
    //         if (embeddedChordsCkB.checked || !chordsCkB.checked) {
    //             node = document.createElement("p");
    //             node.className = j == n - 1 ? "songLastVerse" : "songNormalVerse";
    //             var text = chordsCkB.checked ? replaceChordSequence(changeStanzaChords(verse)) : removeChords(verse);
    //             if (text) {
    //                 var textNode = document.createTextNode(text);
    //                 node.appendChild(textNode);
    //                 domElem.appendChild(node);
    //             } else {
    //                 if (prevNode) {
    //                     prevNode.className = "songLastVerse"; // ttt2 a failure here causes some confusion about the identity of the current song, e.g. when trying to enable chords; to trigger a failure, remove the test for prevNode, hide chords and go to "Mica țiganiadă"; it happens due to a verse having only chords; they should be ignored completely
    //                 }
    //             }
    //         } else {
    //             var text = replaceChordSequence(changeStanzaChords(verse));
    //             if (text) {
    //                 //var tbl = createChordTable(text);
    //                 node = createChordTable(text, j == n - 1 && stanza["i"] != "^pre");
    //                 domElem.appendChild(node);
    //             } else {
    //                 var prevClass = prevNode.className;
    //                 if (prevClass == "songNormalVerseTbl") {
    //                     prevNode.className = "songLastVerseTbl";
    //                 } else if (prevClass == "songNormalVerse") {
    //                     prevNode.className = "songLastVerse";
    //                 } else {
    //                     alert("Incorrect previous class: '" + prevClass + "'");
    //                     throw "Incorrect previous class: '" + prevClass + "'";
    //                 }
    //             }
    //         }
    //         prevNode = node;
    //     }
    // }

    //return (<div>{debugFmt(song, true)}</div>);
};

//ttt0: Show the index in the original list regardless of the current sort order, so people can reference them.
// Also, this avoids situations like songs having 0 or multiple entries

// Note: At a time there was this warning:
// Warning: Cannot update a component (`CreateChordWidget`) while rendering a different component (`CreateFirstChordCbB`).
//
// Most advice on the net is about making a call in the body of the function to a setXyz() that was
// defined in a parent component, rather than in a hook, and the advice is to use a hook.
// The situation here was different, as we were in a hook. However, tried tmpFirstChordCbBVal and it
// leads to a stack overflow. Still, despite the warning, things seemed OK. Also, the warning was only seen
// initially, when the page loads, and not at navigation between songs.
//
// The thing is, the warning made sense: The code was in a hook which was called from inside the return statement,
// which renders the current widget. An idea was to have an useEffect that depends on the current song (and
// this is the only reason the song was passed as a parameter), but it didn't work.
//
// The solution was to properly understand the dependencies and add several useEffect hooks that took care of updating
// dependent components when their dependencies changed.
