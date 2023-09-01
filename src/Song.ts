import {getRoot, substituteChords} from './ChordUtils';

export type Stanza = {
    i?: string, // "id", or "index"; usually 1, 2, 3, ... , R, but also "^R2", "R^1", "^2", "^2a", "Intro", "^pre":
    // cat songs_db.js | grep ' i: "' | sort | uniq
    v?: string[], // verses; might be missing in some cases, mainly when the chorus is the same as the
    // one previously defined (and "i" must be present in this case)
    r?: number, // repeat
};

export type Song = {
    t: string, // title
    l?: string[], // lyricists
    p?: string[], // performers
    g?: string[], // groups
    r?: string, // range
    f?: string, // firstNote
    s?: string, // suggestion
    n?: string[], // notes    //ttt0: The latest versions don't show these. Make it work and check the other fields as well.
    d?: string, // definitions //ttt1 this should be an array, as mentioned in Java/SongsDbTextImport/src/net/ciobi/songs/textimport/Song.java
    b: Stanza[], // body
    v?: string[], // verses (to be used in search)

    clonesInserted?: boolean,
};

/**
 * @return title like "Cântec de inimă albastră (Adrian Jacota / Mircea Dinescu)"
 */
export function getFullTitle(song: Song): string {
    return getFullTitleSomeRemoved(song);
}

export function getFullTitleLyricistRemoved(song: Song, removedLyricist: string): string {
    return getFullTitleSomeRemoved(song, removedLyricist);
}

export function getFullTitlePerformerRemoved(song: Song, removedPerformer: string): string {
    return getFullTitleSomeRemoved(song, undefined, removedPerformer);
}

/**
 * Creates a copy of a list and removes an element from it.
 * If the copy becomes empty, returns undefined.
 * If the element is undefined, returns the original list.
 * If the list is undefined, returns undefined.
 */
function removeElement(element?: string, list?: string[]): string[] | undefined {
    if (!element) {
        return list;
    }
    if (!list) {
        return undefined;
    }
    const k = list.indexOf(element);
    if (k === -1) {
        return list;
    }
    const a: string[] = [...list];
    a.splice(k, 1);
    return a.length ? a : undefined;
}

/**
 * Returns the list joined by commas.
 * Returns undefined if the list is undefined
 */
function listAsString(list?: string[]): string | undefined {
    if (!list) {
        return undefined;
    }
    return list.join(', ');
}

/**
 * Basically returns the first list joined by commas, followed by a slash and the second list joined by commas, and all
 * of this between braces and preceded by a space.
 *
 * If both lists are undefined, returns an empty string.
 * If a single list is undefined, the slash and that list are excluded
 */
function listsAsString(list1?: string[], list2?: string[]): string {
    if (list1) {
        if (list2) {
            return ` (${listAsString(list1)} / ${listAsString(list2)})`;
        }
        return ` (${listAsString(list1)})`;
    }
    if (list2) {
        return ` (${listAsString(list2)})`;
    }
    return '';
}

function getFullTitleSomeRemoved(song: Song, removedLyricist?: string, removedPerformer?: string): string {
    const lyricists = removeElement(removedLyricist, song.l);
    const performers = removeElement(removedPerformer, song.p);
    return song.t + listsAsString(performers, lyricists);
}


/**
 * The main purpose for this is to define alternative notes / chords, when a song can be sung in different ways
 *
 * Chord notes, like in "Noapte la mare" or "Cântec de inimă albastră": a "verse" that starts with "([", ends with "])",
 * and has no other "[" or "]" (but might have "(" or ")"; after "([" there may be a comment, which ends with ": ";
 * this is kept as is and what follows (or the whole thing if there is no comment) is passed through chord conversion;
 *
 * Chord separators are defined in substituteChords.
 *
 * Note that substituteChords does nothing if its parameter doesn't start with a chord.
 * @param verse
 */
export function isChordNotes(verse: string) {
    const n = verse.length;
    //return n > 4 && verse[1] == "(" && verse[2] == "[" && verse.indexOf("]") == n - 2 && verse.indexOf(")") == n - 1; //!!! not right: "Cântec de inimă albastră" has inner ")"
    return n > 4 && verse[0] === '(' && verse[1] === '[' && verse.indexOf(']') === n - 2 && verse[n - 1] === ')';
}

export function getAllChords(song: Song): string[] {

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


/**
 * Replaces stanzas that are only given as an ID with the actual content from where that stanza is defined
 */
export function cloneEmptyStanzas(song: Song) {
    if (song.clonesInserted) {
        return;
    }

    const stanzaMap = new Map<string, Stanza>();

    for (let i = 0; i < song.b.length; ++i) {
        const stanza = song.b[i];
        const id = stanza.i;
        if (id) {
            if (!stanza.v) {
                const existing = stanzaMap.get(id);
                if (existing) {
                    //const clone = shallowCopy(existing);
                    const clone = {...existing};
                    if (stanza.r) {  // override "repeat"
                        clone.r = stanza.r;
                    }
                    // eslint-disable-next-line no-param-reassign
                    song.b[i] = clone;
                } else {
                    alert(`Strofa numită ${id} nu este definită`);
                }
            } else {
                stanzaMap.set(id, stanza);
            }
        }
    }

    // eslint-disable-next-line no-param-reassign
    song.clonesInserted = true;
}

/**
 * Replaces the chords in a stanza taking into account the current range shift, capo ...
 *
 * The name of the parameter isn't quite right, because while externally it always gets passed a verse, the function
 * calls itself recursively, with a fragment of a verse
 *
 * @param verse
 * @param capo
 * @param rangeShift
 * @param showCapo
 */
export function changeStanzaChords(verse: string, capo: number, rangeShift: number, showCapo: boolean): string {
//debugger
    /*if (verse.indexOf("1:Am7") != -1) {
        debugger;
    }//*/
    if (capo === 0 && rangeShift === 0 /*&& !accidentalUseAscii*/) {  //ttt9: accidentalUseAscii is in JS; review if needed
        return verse;
    }
    //look for things like [Am, D]
    let k = verse.indexOf('[');
    if (k === -1) {
        return verse;
    }
    const h = verse.indexOf(']', k);
    if (h === -1) {
        return verse;
    }
    //var chrd = verse.substring(k + 1, h - k - 1);
    if (verse[k + 1] === ';') {
        ++k;
    } else if (isChordNotes(verse)) { //!!! theoretically this might be incorrect due to recursion, but a substring cannot actually match in practice
        const g = verse.indexOf(': ', k);
        if (g > 0 && g < h) {  // skip the "comment" part of an "chord notes" entry
            k = g + 1;
        }
    } else if (verse.substring(k + 1, k + 3) === '1:') { // "alternative extra chords" for stanza that repeats (usually chorus)
        k += 2;
    }
    const chrd = verse.substring(k + 1, h);
    const tail = verse.substring(h);
    // noinspection UnnecessaryLocalVariableJS
    const res = verse.substring(0, k + 1) + substituteChords(chrd, rangeShift, capo, showCapo)
        + changeStanzaChords(tail, capo, rangeShift, showCapo);
    return res;
}


/**
 * Replaces chord sequences like [;G;Em] with individual chords, when a syllable has multiple chords.
 * Example:  a[;c1;c2;c3] => a-[c1]a-[c2]a-[c3]a
 *
 * @param verse
 */
export function replaceChordSequence(verse: string): string {
    /*if (verse.indexOf("Când trecem prin") != -1) {
        debugger
    }//*/

    const k = verse.indexOf('[;');
    if (k === -1) {
        return verse;
    }
    if (k === 0) {
        throw Error(`Missing text before chord sequence in ${verse}`);
    }
    const h = verse.indexOf(']', k + 2);
    if (h === -1) {
        throw Error(`Missing chord sequence closing element in ${verse}`);
    }
    const c = verse[k - 1];
    let s = '';
    const a = verse.substring(k + 2, h).split(';');
    for (let i = 0; i < a.length; ++i) {
        s += `-[${a[i]}]${c}`;
    }
    const r = replaceChordSequence(verse.substring(h + 1));
    // noinspection UnnecessaryLocalVariableJS
    const res = verse.substring(0, k) + s + r;
    return res;
}

