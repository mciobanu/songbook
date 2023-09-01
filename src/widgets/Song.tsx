/* eslint-disable max-len */  //ttt9: remove
import React from 'react';

import '../legacy.css';
import {SongRenderConfig} from '../SongRenderConfig';
import {getAllChords, Song} from '../Song';
import {ReactSetter2} from '../Common';
import {ChordsAreaWidget} from './chords/ChordsArea';


//ttt0 check when same person is lyricist / performer / composer ... and keep one instance of each name, separate by comma



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
