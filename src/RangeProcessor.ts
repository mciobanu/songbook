const NOTES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const ALT_NOTES = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];

const MIN_SONG_RANGE = 4; // a song is considered to have at least 4 semitones, so if a range seems to have less
// than that an octave is added; thus a range of A-C is equivalent to A-C+1, 15 semitones; OTOH C-E is equivalent to
// C-E+0; if a song really has fewer than 4 semitones, the +0 notation can be used to express this


let accidentalUseAscii: boolean = false;

/**
 * Converts accidentals to a format that is suitable to be displayed, regardless of how they look like. A sharp
 * gets converted to '#' or '♯', while a flat gets converted to 'b' or '♭', depending on the current system.
 *
 * @param s one (or several) chords; this function should never be called on a string containing regular words
 */
function accidentalsToDisplay(s: string): string {
    return accidentalUseAscii
        ? s.replace(/♯/g, '#').replace(/♭/g, 'b')
        : s.replace(/#/g, '♯').replace(/b/g, '♭');
}

/**
 * Converts accidentals to the internal format, which always uses '♯' or '♭' (while the display format may use '#'
 * or 'b', depending on the current system.
 *
 * @param s one (or several) chords; this function should never be called on a string containing regular words
 */
function accidentalsToInternal(s: string): string {
    return s.replace(/#/g, '♯').replace(/b/g, '♭');
}

function getAndroidVersion() {
    const androidStr = 'Android';
    let k = navigator.userAgent.indexOf(androidStr);
    if (k === -1) {
        return null;
    }
    const s = navigator.userAgent.substring(k + androidStr.length + 1);
    k = s.indexOf(';');
    if (k === -1) {
        return null;
    }
    return s.substring(0, k);
}


/**
 * Determines if the system can display Unicode accidentals or should stick to ASCII, and stores this in local storage
 */
export function initAsciiForAccidentals() {
    const key = 'accidentalUseAscii';
    const useAsciiStr = localStorage.getItem(key);
    if (useAsciiStr !== null) { // https://en.wikipedia.org/wiki/List_of_musical_symbols#Accidentals_and_key_signatures   intonation / accidental
        accidentalUseAscii = (useAsciiStr === 'true'); //!!! the thing to keep in mind is that
        // localStorage only uses strings, so storing a bool causes the string "false" to be later retrieved, which
        // is logically true
    } else {
        const ver = getAndroidVersion();
        if (ver || navigator.userAgent.indexOf('Chrome') >= 0) {
            accidentalUseAscii = true;
            //with Unicode:
            //  - on Note3/5.0 "♯" is shown in black regardless of the font color; on all Androids there are spaces around "♯"
            //  - on Chrome on browser "♯" causes buttons and edit boxes to be moved down by a pixel or more
            //ttt2 find other cases
        }
        localStorage.setItem(key, String(accidentalUseAscii));
    }
}


function upperCaseChord(s: string): string {
    return s ? s[0].toUpperCase() + s.substring(1) : s;
}


/**
 * Returns the index of a note, with 0 for C, 1 for C♯, ...
 * Returns -1 when the parameter is not a note
 */
function getNoteIndex(s: string) {
    let k = NOTES.indexOf(s);
    if (k === -1) {
        k = ALT_NOTES.indexOf(s);
    }
    return k;
}



/**
 * Creates a numeric range (e.g. [3, 15]) from a string range (e.g. A-C or C-G+)
 * Returns null if the parameter is not a range, but if it contains a "-", it returns something, even if it has invalid
 * notes, for which it returns -1. So for "d-x" it will return [2, -1], and for "dv" it will just return null
 */
function getNumericRange(range: string): number[] | null {
    try {
        const k = range.indexOf('-');
        if (k === -1) {
            return null;
        }
        let h = range.indexOf('+');
        if (h === -1) {
            h = range.length;
        }
        const n1 = getNoteIndex(range.substring(0, k));
        let n2 = getNoteIndex(range.substring(k + 1, h));
        if (n1 === -1 || n2 === -1) {
            return [n1, n2];
        }
        while (n2 <= n1) {
            n2 += 12;
        }
        if (h === range.length) {
            if (n2 < n1 + MIN_SONG_RANGE) { //!!! the convention is that you need at least 4 semitones for a song and
                // that you should have as few as possible; when this isn't what is needed, the octave must be specified
                // manually, using "+" followed by a number of octaves, which might be 0; an empty value means 1
                n2 += 12;
            }
        } else {
            try {
                let octave = 1;
                const r = range.substring(h + 1);
                if (r) {
                    octave = parseInt(r, 10);
                }
                if (Number.isNaN(octave) || r.length > 1 || octave < 0 || octave >= 10) {
                    // noinspection ExceptionCaughtLocallyJS
                    throw Error(`Invalid octave: ${octave}`);
                }
                n2 += 12 * octave;
            } catch (e) {
                n2 = -1;
            }
        }
        return [n1, n2];
    } catch (e) {
        return null;
    }
}


/**
 * Calls getNumericRange and returns its result, if it is notnull. Throws otherwise
 */
function getValidNumericRange(range: string): number[] {
    const numRange = getNumericRange(range);
    if (!numRange) {
        throw Error(`Internal error: ${range} is supposed to be a valid range`);
    }
    return numRange;
}

export type SuggestionRangeComputeResult = {
    minStrInternal: string,
    maxStrInternal: string,
    minStrDisplay: string,
    maxStrDisplay: string,
    minNum: number,
    maxNum: number,
    alerts: string[],
}

/**
 * Computes an adjusted suggestion range, by validating the input parameters. Based on what it returns, a number of
 * things must be updated: the global range (including local storage) and the UI depending on it (what is shown in the
 * menu, as well as the current song).
 *
 * Note names are made uppercase and accidentals are converted to ♯ or ♭ internally. In the UI, accidentals may
 * be converted to ASCII if they are not supported.
 *
 * Doesn't allow a range that is too small or invalid names
 *
 * @param newMin - accepts invalid values; valid ones are like "A", "D#", ... (note and optional accidental)
 * @param newMax - accepts invalid values; valid ones are like "G", "D+", "Cb+2", ...  (note optional accidental,
 *                  optional "+", optional digit when "+" is present)
 * @param currentValidMin - a valid value representing what is currently used for min
 * @param currentValidMax - a valid value representing what is currently used for max
 */
export function computeSuggestionRange(newMin: string, newMax: string, currentValidMin: string,
    currentValidMax: string): SuggestionRangeComputeResult {

    const fixedNewMin = accidentalsToInternal(upperCaseChord(newMin));
    const fixedNewMax = accidentalsToInternal(upperCaseChord(newMax));
    let numRange = getNumericRange(`${fixedNewMin}-${fixedNewMax}`);
    let minNum: number;
    let maxNum: number;
    if (numRange) {
        [minNum, maxNum] = [numRange[0], numRange[1]];
    } else {
        [minNum, maxNum] = [-1, -1];
    }
    const alerts: string[] = [];
    let alertCreated = false;
    let minStr: string;
    if (minNum === -1) {
        alerts.push('Nota cea mai joasă are o valoare incorectă. Trebuie să fie un nume de notă (C, D, E, F, '
                + `G, A, B) urmat opțional de un diez sau bemol ${accidentalUseAscii ? '(#, b)' : '(♯, #, ♭, b)'}`);
        alertCreated = true;
        minStr = currentValidMin;
    } else {
        minStr = fixedNewMin;
    }

    let maxStr: string;
    if (maxNum === -1) {
        alerts.push('Nota cea mai înaltă are o valoare incorectă. Trebuie să fie un nume de notă (C, D, E, F, '
                + `G, A, B) urmat opțional de un diez sau bemol ${accidentalUseAscii ? '(#, b)' : '(♯, #, ♭, b)'}, `
                + 'opțional de \'+\', care, când există, poate fi urmat de o cifră');
        alertCreated = true;
        maxStr = currentValidMax;
    } else {
        maxStr = fixedNewMax;
    }

    if (minNum === -1 || maxNum === -1) {
        numRange = getValidNumericRange(`${minStr}-${maxStr}`);
        [minNum, maxNum] = [numRange[0], numRange[1]];
        if (minNum === -1) {
            minStr = 'C';
        }
        if (maxNum === -1) {
            maxStr = 'D';
        }
        if (minNum === -1 || maxNum === -1) {
            numRange = getValidNumericRange(`${minStr}-${maxStr}`);
            [minNum, maxNum] = [numRange[0], numRange[1]];
            if (minNum === -1 || maxNum === -1) {
                throw Error(`Internal error: Invalid defaults: ${minStr}-${maxStr}`);
            }
        }
    }

    if (maxNum - minNum < 10) { //ttt1: hard-coded
        if (!alertCreated) {
            alerts.push('Nota cea mai înaltă trebuie să fie cu măcar 5 tonuri '
                    + 'mai sus decât nota cea mai joasă. Va fi modificată automat ...');
            //alertCreated = true;
        }
        const k = maxStr.indexOf('+');
        if (k === -1) {
            maxStr += '+';
        } else {
            // it's a "+0", so get rid of the 0; anything else would have more than 1 octave
            maxStr = maxStr.substring(0, k + 1);
        }
        numRange = getValidNumericRange(`${minStr}-${maxStr}`);
        [minNum, maxNum] = [numRange[0], numRange[1]];
    }

    if (maxStr.endsWith('+1')) {
        maxStr = maxStr.substring(0, maxStr.length - 1);
    }

    //!!! somehow confusing that "C-D#+" and "C-D#" are the same thing, so we normalize them (however, "C-E" and "C-E+" are different)
    if (maxStr[maxStr.length - 1] === '+' && maxNum - minNum < 16) {
        maxStr = maxStr.substring(0, maxStr.length - 1);
        numRange = getValidNumericRange(`${minStr}-${maxStr}`);
        [minNum, maxNum] = [numRange[0], numRange[1]];
    }

    return {
        minStrInternal: minStr,
        maxStrInternal: maxStr,
        minStrDisplay: accidentalsToDisplay(minStr),
        maxStrDisplay: accidentalsToDisplay(maxStr),
        minNum,
        maxNum,
        alerts,
    };
}

