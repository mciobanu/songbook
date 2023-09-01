import React from 'react';

import '../legacy.css';
import {SongRenderConfig} from '../SongRenderConfig';
import {
    changeStanzaChords,
    cloneEmptyStanzas,
    isChordNotes,
    replaceChordSequence,
    Song,
    Stanza,
} from '../Song';
import {ReactSetter2} from '../Common';


//ttt0 check when same person is lyricist / performer / composer ... and keep one instance of each name, separate by comma

// sort of ESLint bug - //!!! https://stackoverflow.com/questions/63961803/eslint-says-all-enums-in-typescript-app-are-already-declared-in-the-upper-scope
// eslint-disable-next-line no-shadow
enum ChordRendering {
    NONE,
    INLINE,
    ABOVE,
}


const ChordTableWidget = ({
    text,
    last,
} : {
    text: string,
    last: boolean,
}) => {

    const rowsInfo = React.useMemo(() => {
        const n = text.length;
        let k = 0;
        let chordsFound = false;
        //let tr1;
        //let tr2;
        //let td;
        let g = 0;
        let h;
        const tr1Elems: string[] = [];
        const tr2Elems: string[] = [];

        for (;;) {
            while (k < n && text[k] !== '[') {
                ++k;
            }
            h = k;
            while (h < n && text[h] !== ']') {
                ++h;
            }
            if (h < n) {
                // we have chords
                //if (!tr1) {
                if (!chordsFound) {
                    chordsFound = true;
                    /*tr1 = document.createElement("tr");
                    tr1.className = "chordRow";
                    tr2 = document.createElement("tr");
                    tr2.className = "chordRow";*/
                    if (k > 0) {
                        // it's first chord, and we have something before it, so create an empty "chord"
                        tr1Elems.push('');
                    }
                }
                if (k > 0) {
                    const t = text.substring(g, k);
                    tr2Elems.push(t);
                }
                const t = `${text.substring(k + 1, h)} `;
                tr1Elems.push(t);
                g = h + 1;
                k = g;
            } else {
                break;
            }
        }
        /*if (text.indexOf("Când trecem prin") != -1) {
            debugger
        }//*/

        for (k = tr2Elems.length - 1; k >= 0 && !(tr2Elems[k].trim()); --k) {
            //!!! nothing
        }
        ++k; // starting from k all elements of tr2Elems are empty; we remove them, so we don't end up with a
        // final "-" at the end of a verse that ends with multiple chords //ttt2 this would be a reason to only allow one final chord entry in each verse
        //tr2Elems = tr2Elems.slice(0, k);  //ttt9: review why the line below is used, as this seems cleaner
        tr2Elems.length = k;
        if (g < n) {
            tr2Elems.push(text.substring(g, n));
        }
        return {row1: tr1Elems, row2: tr2Elems, chordsFound};
    }, [text]);

    const chordNotes = React.useMemo(() => {
        return isChordNotes(text);
    }, [text]);

    const chordRow = React.useMemo(() => {
        const elems = chordNotes ? ['(', ...rowsInfo.row1, ')'] : rowsInfo.row1;
        return <tr>
            {elems.map((s, index) => {
                return <td className='chordCellChord' key={index}>{s}</td>;
            })}
        </tr>;
    }, [chordNotes, rowsInfo.row1]);

    const textRow = React.useMemo(() => {
        /*const n = text.length;
        let k = 0;
        let chordsFound = false;
        let tr1;
        let tr2;
        let td;
        let g = 0;
        let h;*/
        if (chordNotes) {
            return null;
        }
        /*  //ttt9: make measurements work
                if (i < tr2Elems.length - 1 && t2 && !t2.endsWith("-") && !t2.endsWith(" ")) {
                    //tds.push([td1, td2]);
                    var t1 = tr1Elems[i];
                    uiMeasure.textContent = t1 + "|"; // innerHTML for IE < 9
                    var w1 = uiMeasure.scrollWidth;
                    uiMeasure.textContent = t2 + "|"; // innerHTML for IE < 9
                    //ttt0 Țigăncușa - verse 2 with small fonts and some chords there's no "-" between "ți" and "gani", but there is space
                    var w2 = uiMeasure.scrollWidth;
                    var w3 = uiMeasure.style.width;
                    //console.log(uiMeasure.scrollWidth);
                    if (w1 > w2) {
                        t2 += "-"; //!!! this adds a "-" when the chord name is longer than the text part ("Și restul e numai Chopin și tăce-e   re."  - initially there was a space after "tăce-e")
                        //ttt2 perhaps allow to define a "non-printable dash", that is shown only inside chords, to cover cases where this default doesn't quite work
                    }
                }

        */
        return <tr>
            {rowsInfo.row2.map((s, index) => {
                return <td className='chordCellText' key={index}>{s}</td>;
            })}
        </tr>;
    }, [chordNotes, rowsInfo.row2]);


    if (!rowsInfo.chordsFound) {
        return <p className={last ? 'songLastVerse' : 'songNormalVerse'}></p>;
    }

    // In JS the div below is a p, but changed to div due to warnings in the console ("<table> cannot appear as a descendant of <p>")
    //ttt1: Review if this change causes any issue, as a cursory glance didn't reveal any difference
    return (
        <div className={last ? 'songLastVerseTbl' : 'songNormalVerseTbl'}>
            <table className='chordTable'>
                <tbody>
                    {chordRow}
                    {textRow}
                </tbody>
            </table>
        </div>);
};


const VerseWidget = ({
    verse,
    firstVerse,
    lastVerse,
    stanzaId,
    repeat,
    chordRendering,
    capo,
    rangeShift,
} : {
    verse: string,
    firstVerse: boolean,
    lastVerse: boolean,
    stanzaId: string | undefined,
    repeat: number | undefined,
    chordRendering: ChordRendering,
    capo: number,
    rangeShift: number,
}) => {
    // noinspection UnnecessaryLocalVariableJS
    const res = React.useMemo(() => {
        let v = verse;
        if (firstVerse) {
            if (repeat !== undefined && repeat !== 1) {
                v = `${repeat}x: ${v}`;
            }
            if (stanzaId) {
                let id = stanzaId;
                id = id.replace(/\^.*/, '');
                if (id) {
                    v = `${id}) ${v}`;
                }
            }
        }
        if (chordRendering === ChordRendering.ABOVE) {
            const text = replaceChordSequence(changeStanzaChords(v, capo, rangeShift, false));
            if (text) {
                return <ChordTableWidget text={text} last={lastVerse}></ChordTableWidget>;
            }
            return null;
        }
        return <p>TODO</p>;
    }, [capo, chordRendering, firstVerse, lastVerse, rangeShift, repeat, stanzaId, verse]);

    return res;
};


const StanzaWidget = ({
    stanza,
    chordRendering,
    capo,
    rangeShift,
} : {
    stanza: Stanza,
    chordRendering: ChordRendering,
    capo: number,
    rangeShift: number,
}) => {
    //!!! Handling of empty verses: Nothing is shown for such a verse, but the verse above is marked as "last", which
    // adds some space.

    // noinspection UnnecessaryLocalVariableJS
    const verses = React.useMemo(() => {
        const v = stanza.v || [];
        return v.map((verse, index) => {
            return <VerseWidget verse={verse} firstVerse={index === 0} stanzaId={index === 0 ? stanza.i : undefined}
                repeat={stanza.r} chordRendering={chordRendering} capo={capo} rangeShift={rangeShift}
                lastVerse={index === v.length - 1 || !v[index + 1]} key={index}
            />;
        });
    }, [capo, chordRendering, rangeShift, stanza.i, stanza.r, stanza.v]);

    return <>
        {verses}
    </>;
};


export const SongBodyWidget = ({
    song,
    songRenderConfig,
    /*songRenderConfig,
    capoCbBVal,
    setCapoCbBVal,*/
    capo,
    rangeShift,
} : {
    song: Song,
    songRenderConfig: SongRenderConfig,
    /*songRenderConfig: SongRenderConfig,
    capoCbBVal: string,
    setCapoCbBVal: ReactSetter2<string>,*/
    capo: number,
    rangeShift: number,
}) => {

    const songReady = React.useMemo(() => {
        cloneEmptyStanzas(song); //ttt0: Not right, as it changes React variable directly, but it is really a global variable
        return true; // This is supposed to make sure that cloneEmptyStanzas() is called once before doing anything about stanzas
    }, [song]);

    // noinspection UnnecessaryLocalVariableJS
    const stanzas = React.useMemo(() => {
        return songReady ? <> {song.b.map((stanza, index) => {
            return <StanzaWidget stanza={stanza} chordRendering={computeChordRendering(songRenderConfig)}
                capo={capo} rangeShift={rangeShift} key={index}/>;
        })} </> : null;
    }, [capo, rangeShift, song.b, songReady, songRenderConfig]);

    return stanzas;
};

function computeChordRendering(songRenderConfig: SongRenderConfig) {
    if (!songRenderConfig.showChords) {
        return ChordRendering.NONE;
    }
    return songRenderConfig.inlineChords ? ChordRendering.INLINE : ChordRendering.ABOVE;
}
