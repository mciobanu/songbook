import {
    getAllWords, getSearchIndex, MIN_WORD_SIZE, prepareForSearch,
} from './SearchUtils';
import {getLast} from '../Utils';


const MAX_WORD_MATCHES = 20;
const MAX_RESULTS_PER_SONG = 4;
const EXP_BASE = 4;

//MIN_WORD_SIZE_EXP = MIN_WORD_SIZE;  // ttt2 see how better to deal with these - the issue is that in NodeJS putting var or const makes a variable module-specific, while not putting any makes it global
//DISCARD_LIMIT_EXP = DISCARD_LIMIT;

type LineMatch = {
    stanza: number,
    verse: number,
    start: number,
    end: number,
}

type SearchResult = {
    song: number,
    word: string, //!!! debug-only
    score: number,
    matches: LineMatch[],
}

// expects a "prepared" word: lowercase, non-alpha removed ...
function searchWholeWord(word: string): SearchResult[] | null {  //ttt0: search the code for "| null" and see if "| undefined" might be better
    //word = prepareForSearch(word); // param expected as this
    const searchIndex = getSearchIndex();
    const entry = searchIndex.get(word);
    if (!entry || !entry.matches /*|| word.length < MIN_WORD_SIZE*/) { //!!! no need to check MIN_WORD_SIZE, because these words don't get indexed anyway
        //console.log("searchWholeWord(" + word + "): null");
        return null;
    }
    const res: SearchResult[] = [];
    //const prevFmtMatch = null;
    for (let i = 0; i < entry.matches.length; ++i) {
        const match = entry.matches[i];
        const k1 = match.indexOf('#');
        const k2 = match.indexOf('#', k1 + 1);
        const k3 = match.indexOf('#', k2 + 1);
        const k4 = match.indexOf('#', k3 + 1);
        const song = parseInt(match.substring(0, k1), 10);
        const lineMatch: LineMatch = {
            stanza: parseInt(match.substring(k1 + 1, k2), 10),
            verse: parseInt(match.substring(k2 + 1, k3), 10),
            start: parseInt(match.substring(k3 + 1, k4), 10),
            end: parseInt(match.substring(k4 + 1), 10),
        };
        if (res.length === 0 || getLast(res).song !== song) {
            res.push({
                song,
                word, //!!! debug-only
                matches: [],
                score: -1,
            });
        }
        getLast(res).matches.push(lineMatch);
    }
    for (let i = 0; i < res.length; ++i) {
        res[i].score = 1 - EXP_BASE ** -res[i].matches.length; //ttt2 might also want to look at the size of a song in chars
    }
    //console.log("searchWholeWord(" + word + "): " + JSON.stringify(res, null, 4));
    return res;
}


/*
[
    {
        "song": 84,
        "matches": [
            {
                "stanza": 0,
                "verse": 2,
                "start": 7,
                "end": 11
            },
            {
                "stanza": 0,
                "verse": 3,
                "start": 7,
                "end": 11
            }
        ],
        "word": "mut",
        "score": 0.9375
    }
]
*/

type PossibleMatch = {
    word: string,
    sizeDiff: number,
}

/**
 * Finds partial matches.
 *
 * Normally returns an array with matches, but may also return null, to signal that it couldn't search (e.g. because
 * a word had too many entries or was too short).
 *
 * Search results are one per song, with one or more matches.
 *
 * In some artificial cases duplicates might be returned: when we search for jjj and the text contains jjjj, then we
 * have 2 matches as substrings, one that starts at 0 and one that starts at 1; they will be dealt with later, as we
 * would have to check for overlaps from multiple terms anyway.
 *
 * @param word2
 */
function searchWord(word2: string): SearchResult[] | null { //ttt9: rename "SearchWholeWordResult"
    const word = prepareForSearch(word2);
    const searchIndex = getSearchIndex();
    if (!word || word.length < MIN_WORD_SIZE || (searchIndex.get(word) && !searchIndex.get(word)?.matches)) { // !!! don't try to see where a short word might be a substring, and don't try to find unindexed substrings of indexed ones
        //console.log("searchWord(" + word + "): null");
        return null;
    }
    const allWords = getAllWords();
    const possibleMatches: PossibleMatch[] = [];
    let k = 0;
    for (;;) {
        k = allWords.indexOf(` ${word}`, k); // prepend " " so we don't find matches in the middle of a word
        if (k === -1) {
            break;
        }
        ++k;
        let k1 = k;
        let k2 = k;
        while (allWords[k1] !== ' ') { //!!! no need for index checks, as allWords begins and ends with spaces
            --k1;
        }
        ++k1;
        while (allWords[k2] !== ' ') { //!!! no need for index checks, as allWords begins and ends with spaces
            ++k2;
        }
        possibleMatches.push({
            word: allWords.substring(k1, k2),
            sizeDiff: k2 - k1 - word.length,
        });
        ++k;
    }
    possibleMatches.sort((x, y) => { return x.sizeDiff - y.sizeDiff; });
    let lastDiff = 0;
    let prevWorstScore = 1.0;
    let crtWorstScore = 1.0; // with these we make sure all scores for a smaller sizeDiff are better than the ones for a larger sizeDiff

    let gotNotIndexed = false;
    let res: SearchResult[] | null = [];
    const resMap = new Map<number, SearchResult>();
    for (let i = 0; i < possibleMatches.length; ++i) {
        if (res.length >= MAX_WORD_MATCHES && possibleMatches[i].sizeDiff !== lastDiff) {
            break;
        }
        if (lastDiff !== possibleMatches[i].sizeDiff) {
            //crtWorstScore *= 1 - Math.pow(EXP_BASE, lastDiff - possibleMatches[i].sizeDiff);
            for (let j = 0; j < possibleMatches[i].sizeDiff - lastDiff; ++j) {
                crtWorstScore *= 1 - EXP_BASE ** -1; //ttt9: see if there's any reason not to use "1/EXP_BASE"
            }
            lastDiff = possibleMatches[i].sizeDiff;
            //crtWorstScore *= 0.9;
            prevWorstScore = crtWorstScore;
        }
        const r = searchWholeWord(possibleMatches[i].word);
        if (!r) {
            gotNotIndexed = true;
            continue;
        }

        for (let j = 0; j < r.length; ++j) {
            const sr = r[j];
            sr.score *= prevWorstScore;
            if (sr.score < crtWorstScore) {
                crtWorstScore = sr.score; //ttt3 next we might decide to actually ignore this result, so perhaps we should only change the score if result is kept
            }
            const existingEntry = resMap.get(sr.song);
            if (existingEntry) {
                //if (existingEntry.matches.length < MAX_RESULTS_PER_SONG) {
                for (k = 0; existingEntry.matches.length < MAX_RESULTS_PER_SONG && k < sr.matches.length; ++k) {
                    if (!overlapExists(existingEntry.matches, sr.matches[k])) { // !!! don't allow "de-acasă" to replace "acasă" when what we are looking for is "acasă"
                        existingEntry.matches.push(sr.matches[k]);
                    }
                    //!!! leave alone "score" and "word", which will thus get discarded, but it's no big loss (existing entries were at least as good as what's in sr)
                }
            } else {
                res.push(sr);
                resMap.set(sr.song, sr);
                if (sr.matches.length > MAX_RESULTS_PER_SONG) {
                    sr.matches.length = MAX_RESULTS_PER_SONG;
                }
            }
        }
    }
    if (res.length === 0 && gotNotIndexed) {
        res = null;
    }
    //console.log("searchWord(" + word + ") possibleMatches: " + JSON.stringify(possibleMatches, null, 4));
    //console.log("searchWord(" + word + "): " + JSON.stringify(res, null, 4));
    return res;
}
//ttt2 while the score is generally usable to sort results, it's quite meaningless in itself; would be nice to have a relevance that makes sense


function overlapExists(matches: LineMatch[], match: LineMatch) {
    for (let i = 0; i < matches.length; ++i) {
        const m = matches[i];
        if (m.stanza === match.stanza && m.verse === match.verse) {
            if (m.start <= match.start) {
                if (m.end >= match.start) {
                    return true;
                }
            } else if (match.end >= m.start) {
                return true;
            }
        }
    }
    return false;
}


function searchTerms(terms: string): SearchResult[] | null {
    //terms = terms.replace(/ +/g, " "); // fine but not really needed
    let res: SearchResult[] | null = null;
    let k = 0;
    let h = 0;
    while (k < terms.length) {
        k = terms.indexOf(' ', h); //ttt3 doesn't care about one term being a substring of another
        if (k === -1) {
            k = terms.length;
        }

        const r = searchWord(terms.substring(h, k));
        if (r) {
            if (res == null) {
                res = r;
            } else {
                // combine results
                const merged: SearchResult[] = [];
                for (let i = 0; i < res.length; ++i) {
                    let j = 0;
                    for (; j < r.length; ++j) {
                        if (res[i].song === r[j].song) {
                            res[i].matches = res[i].matches.concat(r[j].matches);
                            res[i].word = `${res[i].word} ${r[j].word}`;
                            res[i].score = (res[i].score + r[j].score) / 2; //ttt2 review
                            break;
                        }
                    }
                    if (j < r.length) {
                        merged.push(res[i]);
                    }
                }
                res = merged;
            }
        }
        h = k + 1;
    }

    //console.log("searchTerms(" + terms + "): " + JSON.stringify(res, null, 4));
    return res;
}

type MergedLineMatch = {
    stanza: number,
    verse: number,
    intervals: {
        start: number,
        end: number,
    }[],
}

type MergedSearchResult = {
    song: number,
    word: string, //!!! debug-only
    score: number,
    matches: MergedLineMatch[],
}


/**
 * Searches for some terms and returns a result list.
 *
 * The search is by word prefixes, with diacritics replaced with ASCII and everything lowercase.
 * So: If "Ninge fără milă" is indexed, "far" or "ninge" will find results, but "inge" won't.
 *
 * @param terms search terms, as a string of space-separated words
 */
export function searchTermsAndMerge(terms: string): MergedSearchResult[] {
    const s = searchTerms(terms);
    const res: MergedSearchResult[] = [];
    if (!s) {
        return res;
    }
    for (let i = 0; i < s.length; ++i) {
        const song = s[i];
        song.matches.sort((x, y) => {
            if (x.stanza !== y.stanza) {
                return x.stanza - y.stanza;
            }
            if (x.verse !== y.verse) {
                return x.verse - y.verse;
            }
            if (x.start !== y.start) {
                return x.start - y.start;
            }
            return x.end - y.end;
        });

        const r = {
            song: song.song,
            word: song.word,
            score: song.score,
            matches: [{
                stanza: song.matches[0].stanza,
                verse: song.matches[0].verse,
                intervals: [{
                    start: song.matches[0].start,
                    end: song.matches[0].end,
                }],
            }],
        };
        res.push(r);

        for (let j = 1; j < song.matches.length; ++j) {
            const m = song.matches[j];
            const lastMatch = getLast(r.matches);
            if (m.stanza === lastMatch.stanza && m.verse === lastMatch.verse) {
                // need to merge
                const lastInterval = getLast(lastMatch.intervals);
                if (m.start <= lastInterval.end) {
                    // maybe extend previous
                    if (m.end > lastInterval.end) {
                        lastInterval.end = m.end;
                    } else {
                        //!!! nothing, m is inside lastInterval
                    }
                } else {
                    lastMatch.intervals.push({
                        start: m.start,
                        end: m.end,
                    });
                }
            } else {
                const newMatch = {
                    stanza: m.stanza,
                    verse: m.verse,
                    intervals: [{
                        start: m.start,
                        end: m.end,
                    }],
                };
                r.matches.push(newMatch);
            }
        }
    }

    res.sort((x, y) => { return y.score - x.score; });

    //console.log("searchTermsAndMerge(" + terms + "): " + JSON.stringify(res, null, 4));
    return res;
}
