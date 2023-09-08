import {
    getAllWords,
    getSearchIndex,
    getTitleSearchInfo,
    MIN_WORD_SIZE,
    prepareForSearch,
} from './SearchUtils';

import {getLast} from '../Utils';
import {getSortedSongs} from '../SongCollections';
import {SortType} from '../Common';
import {removeChords, Song} from '../Song';


const MAX_WORD_MATCHES = 20;
const MAX_RESULTS_PER_SONG = 4;
const EXP_BASE = 4;


type SimpleLineMatch = {
    stanzaNo: number,
    verseNo: number,
    start: number,
    end: number,
}

/**
 * Whole or partial word
 */
type WordSearchResultEntry = {
    song: number,
    word: string, //!!! debug-only
    score: number,
    matches: SimpleLineMatch[],
}

// expects a "prepared" word: lowercase, non-alpha removed ...
function searchWholeWord(word: string): WordSearchResultEntry[] | null {  //ttt0: search the code for "| null" and see if "| undefined" might be better
    const searchIndex = getSearchIndex();
    const entry = searchIndex.get(word);
    if (!entry || !entry.matches /*|| word.length < MIN_WORD_SIZE*/) { //!!! no need to check MIN_WORD_SIZE, because these words don't get indexed anyway
        //console.log("searchWholeWord(" + word + "): null");
        return null;
    }
    const res: WordSearchResultEntry[] = [];
    //const prevFmtMatch = null;
    for (let i = 0; i < entry.matches.length; ++i) {
        const match = entry.matches[i];
        const k1 = match.indexOf('#');
        const k2 = match.indexOf('#', k1 + 1);
        const k3 = match.indexOf('#', k2 + 1);
        const k4 = match.indexOf('#', k3 + 1);
        const song = parseInt(match.substring(0, k1), 10);
        const lineMatch: SimpleLineMatch = {
            stanzaNo: parseInt(match.substring(k1 + 1, k2), 10),
            verseNo: parseInt(match.substring(k2 + 1, k3), 10),
            start: parseInt(match.substring(k3 + 1, k4), 10),
            end: parseInt(match.substring(k4 + 1), 10),
        };
        if (res.length === 0 || getLast(res).song !== song) {
            res.push({
                song,
                word, //!!! debug-only
                matches: [],
                score: -1, // a default that will be recomputed below
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
 * @param word
 *
 * @return array with results if the word is valid and some matches were found;
 * empty array if the word is valid and no matches were found;
 * null if the word is ignored;  //ttt1: Perhaps improve
 */
function searchWord(word: string): WordSearchResultEntry[] | null {
    const word1 = prepareForSearch(word);
    const searchIndex = getSearchIndex();
    if (!word1 || word1.length < MIN_WORD_SIZE || (searchIndex.get(word1) && !searchIndex.get(word1)?.matches)) { // !!! don't try to see where a short word might be a substring, and don't try to find unindexed substrings of indexed ones
        //console.log("searchWord(" + word + "): null");
        return null;
    }
    const allWords = getAllWords();
    const possibleMatches: PossibleMatch[] = [];
    let k = 0;
    for (;;) {
        k = allWords.indexOf(` ${word1}`, k); // prepend " " so we don't find matches in the middle of a word
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
            sizeDiff: k2 - k1 - word1.length,
        });
        ++k;
    }
    possibleMatches.sort((x, y) => { return x.sizeDiff - y.sizeDiff; });
    let lastDiff = 0;
    let prevWorstScore = 1.0;
    let crtWorstScore = 1.0; // with these we make sure all scores for a smaller sizeDiff are better than the ones for a larger sizeDiff

    let gotNotIndexed = false;
    let res: WordSearchResultEntry[] | null = [];
    const resMap = new Map<number, WordSearchResultEntry>();
    for (let i = 0; i < possibleMatches.length; ++i) {
        if (res.length >= MAX_WORD_MATCHES && possibleMatches[i].sizeDiff !== lastDiff) {
            break;
        }
        if (lastDiff !== possibleMatches[i].sizeDiff) {
            //crtWorstScore *= 1 - Math.pow(EXP_BASE, lastDiff - possibleMatches[i].sizeDiff);
            for (let j = 0; j < possibleMatches[i].sizeDiff - lastDiff; ++j) {
                crtWorstScore *= 1 - EXP_BASE ** -1; // while "1/EXP_BASE" has the same value, the exponent could be changed later, hence using this more generic form
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


function overlapExists(matches: SimpleLineMatch[], match: SimpleLineMatch) {
    for (let i = 0; i < matches.length; ++i) {
        const m = matches[i];
        if (m.stanzaNo === match.stanzaNo && m.verseNo === match.verseNo) {
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


type SimpleSearchResult = {
    entries: WordSearchResultEntry[],
    ignored: string[],
}

function searchTerms(terms: string): SimpleSearchResult {
    //terms = terms.replace(/ +/g, " "); // fine but not really needed
    const res: SimpleSearchResult = {
        entries: [],
        ignored: [],
    };
    // eslint-disable-next-line no-undef-init
    let entries: WordSearchResultEntry[] | undefined = undefined; //!!! The previous line ("eslint-disable") is needed. Without
    // this unnecessary "=undefined", there will be many warnings down below about the variable not being initialized
    let k = 0;
    let h = 0;
    while (k < terms.length) {
        k = terms.indexOf(' ', h); //ttt3 doesn't care about one term being a substring of another
        if (k === -1) {
            k = terms.length;
        }

        const word = terms.substring(h, k);
        const r = searchWord(word);
        if (r) {
            if (!entries) {
                entries = r;
            } else {
                // combine results
                const merged: WordSearchResultEntry[] = [];
                for (let i = 0; i < entries.length; ++i) {
                    let j = 0;
                    for (; j < r.length; ++j) {
                        if (entries[i].song === r[j].song) {
                            entries[i].matches = entries[i].matches.concat(r[j].matches);
                            entries[i].word = `${entries[i].word} ${r[j].word}`;
                            entries[i].score = (entries[i].score + r[j].score) / 2; //ttt2 review
                            break;
                        }
                    }
                    if (j < r.length) {
                        merged.push(entries[i]);
                    }
                }
                entries = merged;
            }
        } else {
            res.ignored.push(word);
        }
        h = k + 1;
    }
    res.entries = entries || [];

    //console.log("searchTerms(" + terms + "): " + JSON.stringify(res, null, 4));
    return res;
}


export type VerseMatchEntry = {
    plain: string,
    highlight: string,
}

/**
 * Used for both title and verses. When use for title, the matches array is empty, unless the title itself is a match.
 *
 * A verse is made by joining plain, highlight, plain, highlight, ... , plain, highlight, plainEnd.
 */
export type SearchMatch = {
    matches: VerseMatchEntry[],
    plainEnd: string,
    dbg: { // just for tests
        stanzaNo: number,
        verseNo: number,
    }
}

export type SearchResultEntry = {
    songNo: number, // 0-based
    titleMatch: SearchMatch,
    //titlePlainEnd: string,
    word: string, //!!! debug-only
    score: number,
    verseMatches: SearchMatch[],
}

export type SearchResult = {
    entries: SearchResultEntry[],
    ignored: string[],
}

type InternalMatch = {
    stanzaNo: number,
    verseNo: number,
    intervals: {
        start: number,
        end: number,
    }[],
}

/**
 * Searches for some terms and returns a result list.
 *
 * The search is by word prefixes, with diacritics replaced with ASCII and everything lowercase.
 * So: If "Ninge fără milă" is indexed, "far" or "ninge" will find results, but "inge" won't.
 *
 * @param terms search terms, as a string of space-separated words
 */
export function searchTermsAndMerge(terms: string): SearchResult {
    const s = searchTerms(terms);
    const res: SearchResult = {
        entries: [],
        ignored: s.ignored,
    };
    if (!s.entries.length) {
        return res;
    }
    for (let i = 0; i < s.entries.length; ++i) {
        const wordSearchResultEntry = s.entries[i];
        const {song} = getSortedSongs(SortType.position)[wordSearchResultEntry.song];
        wordSearchResultEntry.matches.sort((x, y) => {
            if (x.stanzaNo !== y.stanzaNo) {
                return x.stanzaNo - y.stanzaNo;
            }
            if (x.verseNo !== y.verseNo) {
                return x.verseNo - y.verseNo;
            }
            if (x.start !== y.start) {
                return x.start - y.start;
            }
            return x.end - y.end;
        });

        const r: SearchResultEntry = {
            songNo: (song.index || 0) - 1, // we want songNo to be 0-based
            titleMatch: {
                plainEnd: '',
                matches: [],
                dbg: {
                    stanzaNo: -1,
                    verseNo: -1,
                },
            },
            word: wordSearchResultEntry.word,
            score: wordSearchResultEntry.score,
            verseMatches: [],
        };
        res.entries.push(r);

        const title = getTitleSearchInfo(song);

        let internalMatch: InternalMatch = {
            stanzaNo: -2,
            verseNo: -2,
            intervals: [],
        };

        for (let j = 0; j < wordSearchResultEntry.matches.length; ++j) {
            const m = wordSearchResultEntry.matches[j];
            //const internalMatch = getLast(r.matches);
            if (m.stanzaNo === internalMatch.stanzaNo && m.verseNo === internalMatch.verseNo) {
                // need to merge; keep in mind that we searched for multiple terms
                const lastInterval = getLast(internalMatch.intervals);
                if (m.start <= lastInterval.end) {
                    // maybe extend previous
                    if (m.end > lastInterval.end) {
                        lastInterval.end = m.end;
                    } else {
                        //!!! nothing; m is inside lastInterval
                    }
                } else {
                    internalMatch.intervals.push({
                        start: m.start,
                        end: m.end,
                    });
                }
            } else {
                addMatch(r, song, title, internalMatch); // this gets called with an empty list the first time, which is fine
                internalMatch = {
                    stanzaNo: m.stanzaNo,
                    verseNo: m.verseNo,
                    intervals: [{
                        start: m.start,
                        end: m.end,
                    }],
                };
            }
        }
        addMatch(r, song, title, internalMatch);

        if (!r.titleMatch.plainEnd) {
            // There was no match for the title; set it now
            r.titleMatch.plainEnd = title;
        }
    }

    res.entries.sort((x, y) => { return y.score - x.score; });

    //console.log("searchTermsAndMerge(" + terms + "): " + JSON.stringify(res, null, 4));
    return res;
}


function addMatch(entry: SearchResultEntry, song: Song, songTitle: string, internalMatch: InternalMatch) {
    if (internalMatch.stanzaNo === -2) {
        // The "previous" variable (internalMatch) gets initialized with <-2, -2, []>, and this is what we end up
        // with here at the first match
        return;
    }
    if (internalMatch.stanzaNo === -1) {
        addTitleMatch(entry, songTitle, internalMatch);
    } else {
        addVerseMatch(entry, song, internalMatch);
    }
}

function addTitleMatch(entry: SearchResultEntry, songTitle: string, internalTitleMatch: InternalMatch) {
    // eslint-disable-next-line no-param-reassign
    entry.titleMatch = buildSearchMatch(songTitle, internalTitleMatch);
}

function addVerseMatch(entry: SearchResultEntry, song: Song, internalVerseMatch: InternalMatch) {
    if (!internalVerseMatch.intervals.length) {
        return;
    }

    const stanza = song.b[internalVerseMatch.stanzaNo];
    if (!stanza.v) {
        throw Error(`Internal error: Trying to add search results for song with empty stanza ${song.t}`);
    }

    let verse = stanza.v[internalVerseMatch.verseNo];
    verse = removeChords(verse);

    entry.verseMatches.push(buildSearchMatch(verse, internalVerseMatch));
}

function buildSearchMatch(verse: string, internalVerseMatch: InternalMatch): SearchMatch {
    const verseMatch: SearchMatch = {
        matches: [],
        plainEnd: verse.substring(getLast(internalVerseMatch.intervals).end)
            .replace(/[.,;-]$/, ''), // get rid of ending punctuation marks
        dbg: {
            stanzaNo: internalVerseMatch.stanzaNo,
            verseNo: internalVerseMatch.verseNo,
        },
    };
    verseMatch.matches = internalVerseMatch.intervals.map((interval, index) => {
        const verseMatchEntry: VerseMatchEntry = {
            plain: verse.substring(index === 0 ? 0 : internalVerseMatch.intervals[index - 1].end, interval.start),
            highlight: verse.substring(interval.start, interval.end),
        };
        return verseMatchEntry;
    });
    return verseMatch;
}
