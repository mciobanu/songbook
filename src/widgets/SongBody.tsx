import React from 'react';

import '../legacy.css';
import {SongRenderConfig} from '../SongRenderConfig';
import {
    changeStanzaChords,
    cloneEmptyStanzas,
    isChordNotes,
    removeChords,
    replaceChordSequence,
    Song,
    Stanza,
} from '../Song';
import {accidentalsToDisplay} from '../ChordUtils';


//ttt0 check when same person is lyricist / performer / composer ... and keep one instance of each name, separate by comma

// sort of ESLint bug - //!!! https://stackoverflow.com/questions/63961803/eslint-says-all-enums-in-typescript-app-are-already-declared-in-the-upper-scope
// eslint-disable-next-line no-shadow
enum ChordRendering {
    NONE,
    INLINE,
    ABOVE,
}


type WidthCalculator = (s: string) => number;

const ChordTableWidget = ({
    text,
    last,
    widthCalculator,
} : {
    text: string,
    last: boolean,
    widthCalculator: WidthCalculator,
}) => {

    const rowsInfo = React.useMemo(() => {
        const n = text.length;
        let k = 0;
        let chordsFound = false;
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
                if (!chordsFound) {
                    chordsFound = true;
                    if (k > 0) {
                        // it's first chord, and we have something before it, so create an empty "chord"
                        tr1Elems.push('');
                    }
                }
                if (k > 0) {
                    const t = text.substring(g, k);
                    tr2Elems.push(t);
                }
                const t = `${accidentalsToDisplay(text.substring(k + 1, h))} `;
                tr1Elems.push(t);
                g = h + 1;
                k = g;
            } else {
                break;
            }
        }

        for (k = tr2Elems.length - 1; k >= 0 && !(tr2Elems[k].trim()); --k) {
            //!!! nothing
        }
        ++k; // starting from k all elements of tr2Elems are empty; we remove them, so we don't end up with a
        // final "-" at the end of a verse that ends with multiple chords //ttt2 this would be a reason to only allow one final chord entry in each verse
        tr2Elems.length = k; // Note that this is a valid way of truncating an array, and is not considered an
        // antipattern: https://stackoverflow.com/questions/31547315/is-it-an-antipattern-to-set-an-array-length-in-javascript
        // The more verbose version is "tr2Elems = tr2Elems.slice(0, k);", and it forces tr2Elems to be declared with "let"
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
        if (chordNotes) {
            return null;
        }

        /*return <tr>
            {rowsInfo.row2.map((s, index) => {
                let t2 = s;
                if (index < rowsInfo.row2.length - 1 && !s.endsWith('-') && !s.endsWith(' ')) { //ttt0: Make sure this works with zoom
                    // Check if we should add a dash, for cases when the chord above takes more space than the text
                    // below
                    const t1 = rowsInfo.row1[index];
                    //const output = document.createElement('span')
                    //const uiMeasure1 = document.getElementById('uiMeasure');
                    const uiMeasure1 = uiMeasure;

                    uiMeasure1.textContent = `${t1}|`; // innerHTML for IE < 9
                    const w1 = uiMeasure.scrollWidth;
                    uiMeasure1.textContent = `${t2}|`; // innerHTML for IE < 9
                    //ttt0 Țigăncușa - verse 2 with small fonts and some chords there's no "-" between "ți" and "gani", but there is space
                    const w2 = uiMeasure.scrollWidth;
                    //const w3 = uiMeasure.style.width;
                    //console.log(uiMeasure.scrollWidth);
                    if (w1 > w2) {
                        t2 += '-'; //!!! This adds a "-" when the chord name is longer than the text part
                        // Without it: "Și restul e numai Chopin și tăce-e   re."
                        // With it:    "Și restul e numai Chopin și tăce-e-  re."
                        //ttt2 perhaps allow to define a "non-printable dash", that is shown only inside chords, to cover cases where this default doesn't quite work
                    }
                    //console.log(t1);
                    //console.log(`uiMeasure1:${uiMeasure1}`);
                }

                return <td className='chordCellText' key={index}>{t2}</td>;
            })}
        </tr>;*/

        return <tr>
            {rowsInfo.row2.map((s, index) => {
                let t2 = s;
                if (index < rowsInfo.row2.length - 1 && !s.endsWith('-') && !s.endsWith(' ')) { //ttt0: Make sure this works with zoom
                    // Check if we should add a dash, for cases when the chord above takes more space than the text
                    // below
                    const t1 = rowsInfo.row1[index];
                    //const output = document.createElement('span')
                    //const uiMeasure1 = document.getElementById('uiMeasure');

                    const w1 = widthCalculator(`${t1}|`);
                    //ttt0 Țigăncușa - verse 2 with small fonts and some chords there's no "-" between "ți" and "gani", but there is space
                    const w2 = widthCalculator(`${t2}|`);
                    //const w3 = uiMeasure.style.width;
                    //console.log(uiMeasure.scrollWidth);
                    if (w1 > w2) {
                        t2 += '-'; //!!! This adds a "-" when the chord name is longer than the text part
                        // Without it: "Și restul e numai Chopin și tăce-e   re."
                        // With it:    "Și restul e numai Chopin și tăce-e-  re."
                        //ttt2 perhaps allow to define a "non-printable dash", that is shown only inside chords, to cover cases where this default doesn't quite work
                    }
                    //console.log(t1);
                    //console.log(`uiMeasure1:${uiMeasure1}`);
                }

                return <td className='chordCellText' key={index}>{t2}</td>;
            })}
        </tr>;

    }, [chordNotes, rowsInfo.row1, rowsInfo.row2, widthCalculator]);


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
    widthCalculator,
} : {
    verse: string,
    firstVerse: boolean,
    lastVerse: boolean,
    stanzaId: string | undefined,
    repeat: number | undefined,
    chordRendering: ChordRendering,
    capo: number,
    rangeShift: number,
    widthCalculator: WidthCalculator,
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
                return <ChordTableWidget text={text} last={lastVerse} widthCalculator={widthCalculator}/>;
            }
            return null;
        }

        const text = chordRendering === ChordRendering.INLINE
            ? replaceChordSequence(changeStanzaChords(v, capo, rangeShift, false))
            : removeChords(v);

        if (!text) {
            return null;
        }

        return <p className={lastVerse ? 'songLastVerse' : 'songNormalVerse'}>{text}</p>;
    }, [capo, chordRendering, firstVerse, lastVerse, rangeShift, repeat, stanzaId, widthCalculator, verse]);

    return res;
};


const StanzaWidget = ({
    stanza,
    chordRendering,
    capo,
    rangeShift,
    widthCalculator,
} : {
    stanza: Stanza,
    chordRendering: ChordRendering,
    capo: number,
    rangeShift: number,
    widthCalculator: WidthCalculator,
}) => {
    //!!! Handling of empty verses: Nothing is shown for such a verse, but the verse above is marked as "last", which
    // adds some space.

    // noinspection UnnecessaryLocalVariableJS
    const verses = React.useMemo(() => {
        const v = stanza.v || [];
        return v.map((verse, index) => {
            return <VerseWidget verse={verse} firstVerse={index === 0} stanzaId={index === 0 ? stanza.i : undefined}
                repeat={stanza.r} chordRendering={chordRendering} capo={capo} rangeShift={rangeShift}
                lastVerse={index === v.length - 1 || !v[index + 1]} key={index} widthCalculator={widthCalculator}
            />;
        });
    }, [capo, chordRendering, rangeShift, stanza.i, stanza.r, stanza.v, widthCalculator]);

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

    // Create an invisible DOM element directly, to be used for measurements
    let uiMeasure: HTMLSpanElement;
    const existingUiMeasure = document.getElementById('uiMeasure');
    if (existingUiMeasure) {
        uiMeasure = existingUiMeasure;
    } else {
        uiMeasure = document.createElement('span');
        uiMeasure.id = 'uiMeasure';
        uiMeasure.className = 'measureSpan';
        //existingUiMeasure = document.getElementById('uiMeasure');
        //const rootNode = document.getRootNode();
        const rootNode = document.getElementById('root');
        if (rootNode) {
            rootNode.appendChild(uiMeasure);
            //existingUiMeasure = document.getElementById('uiMeasure');
        }
    }

    const widthCalculator = React.useCallback((s: string): number => {
        uiMeasure.textContent = s;   // innerHTML for IE < 9
        return uiMeasure.scrollWidth;
    }, [uiMeasure]);  //ttt9: see if uiMeasure should be Memo, to prevent recomputing at every render

    console.log(widthCalculator('abc'));

    //ttt2: See if this can replace uiMeasure. The idea is to use a canvas to measure things, but one issue is getting
    // the attributes from the "measureSpan" class, namely the font, including zoom changes. The other issue is that
    // the computations seem to work only for elements that are actually inserted in the DOM, not merely created.
    // If that is really the case, there's little point in this alternative
    /*const text = 'text';
    const span = document.createElement('span');
    span.className = 'measureSpan';
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
        const st = getComputedStyle(span); // this has no properties
        const rootNode = document.getElementById('root');
        if (rootNode) {
            console.log(`font:${st.font}`); // nothing
            rootNode.appendChild(span); //!!! this seems needed to get any useful style info
            console.log(`font:${st.font}`); // 14.4px Verdana, Geneva, sans-serif
        }
        context.font = st.font;  //ttt2: Set actual font
        const {width} = context.measureText(text);
        console.log(`measureText: ${width}`);
    }*/

    // noinspection UnnecessaryLocalVariableJS
    const stanzas = React.useMemo(() => {
        return songReady ? <>
            {song.b.map((stanza, index) => {
                return <StanzaWidget stanza={stanza} chordRendering={computeChordRendering(songRenderConfig)}
                    capo={capo} rangeShift={rangeShift} key={index} widthCalculator={widthCalculator}/>;
            })} </> : null;
    }, [capo, rangeShift, song.b, songReady, songRenderConfig, widthCalculator]);

    return stanzas;
};

function computeChordRendering(songRenderConfig: SongRenderConfig) {
    if (!songRenderConfig.showChords) {
        return ChordRendering.NONE;
    }
    return songRenderConfig.inlineChords ? ChordRendering.INLINE : ChordRendering.ABOVE;
}
