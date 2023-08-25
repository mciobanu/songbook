/* eslint-disable max-len */  //ttt9: remove
import React from 'react';

import '../legacy.css';
import {SongRenderConfig} from '../SongRenderConfig';
import {Song} from '../Song';
import {ReactSetter2} from '../Common';
import {getRoot} from '../ChordUtils';
import {ChordsAreaWidget} from './chords/ChordsArea';


//ttt0 check when same person is lyricist / performer / composer ... and keep one instance of each name, separate by comma


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

    const [firstChordCbBVal, setFirstChordCbBVal] = React.useState<string>(/*computeInitialFirstChord()*/'');

    const chords = React.useMemo(() => {
        return getAllChords(song);
    }, [song]);

    return <ChordsAreaWidget chords={chords} songRenderConfig={songRenderConfig} capoCbBVal={capoCbBVal}
        setCapoCbBVal={setCapoCbBVal} song={song} firstChordCbBVal={firstChordCbBVal}
        setFirstChordCbBVal={setFirstChordCbBVal}/>;
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
