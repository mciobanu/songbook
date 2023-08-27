import React from 'react';

import {SongRenderConfig, voiceRange} from '../../SongRenderConfig';
import {ReactSetter2} from '../../Common';
import {DropdownsWidget} from './Dropdowns';
import {getChordSuggestions} from '../../Suggestions';
import {Song} from '../../Song';
import {capoStrToNum} from '../../ChordUtils';
import {CapoWidget} from './Capo';
import {IntervalWidget} from './Interval';
import {ChordListWidget} from './ChordList';

/**
 * Creates the part above the actual song, with chord, capo, suggestions, etc.
 */
export const ChordsAreaWidget = ({
    song,
    chords,
    songRenderConfig,
    capoCbBVal,
    setCapoCbBVal,
    firstChordCbBVal,
    setFirstChordCbBVal,
} : {
    song: Song,
    chords: string[],
    songRenderConfig: SongRenderConfig,
    capoCbBVal: string,
    setCapoCbBVal: ReactSetter2<string>,
    firstChordCbBVal: string,
    setFirstChordCbBVal: ReactSetter2<string>,
}) => {
    const suggestions = React.useMemo(() => {
        return getChordSuggestions(chords, song.r || '', voiceRange(songRenderConfig),
                songRenderConfig.maxSuggestions, capoStrToNum(capoCbBVal), songRenderConfig.maxCapo, firstChordCbBVal);
    }, [capoCbBVal, chords, firstChordCbBVal, song.r, songRenderConfig]);

    const [currentSuggestion, setCurrentSuggestion] = React.useState(0);

    if (!songRenderConfig.showChords || !chords.length) {
        return null;
    }
    return (<>
        <DropdownsWidget chords={chords} songRenderConfig={songRenderConfig} capoCbBVal={capoCbBVal}
            setCapoCbBVal={setCapoCbBVal} firstChordCbBVal={firstChordCbBVal}
            setFirstChordCbBVal={setFirstChordCbBVal}/>
        <CapoWidget suggestions={suggestions} currentSuggestion={currentSuggestion}/>
        {song.r && <IntervalWidget suggestions={suggestions} currentSuggestion={currentSuggestion} range={song.r}/>}
        <ChordListWidget suggestions={suggestions} currentSuggestion={currentSuggestion} chords={chords}/>
    </>);
};


function oldChords() {
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
}
