import {removeChords, Song} from '../Song';
import {
    DISCARD_LIMIT, getSearchIndex, MIN_WORD_SIZE, prepareForSearch, replaceDiacritics, SearchEntry, setAllWords,
} from './SearchUtils';


function isLowercaseAsciiLetter(c: string) {
    return c >= 'a' && c <= 'z';
}



function indexWord(word: string, songNo: number, stanzaNo: number, verseNo: number, start: number, end: number) {
    let i;
    let word1 = replaceDiacritics(word.toLowerCase());
    let start1 = start;
    for (i = 0; i < word1.length && !isLowercaseAsciiLetter(word1[i]); ++i) { // don't include non-letters at the beginning and end1
        ++start1;
    }
    let end1 = end;
    for (i = word1.length - 1; i >= 0 && !isLowercaseAsciiLetter(word1[i]); --i) {
        --end1;
    }

    if (start1 === 0 && word1[word1.length - 1] === ')') {
        return; // we don't index stanza numbers
    }
    word1 = prepareForSearch(word1);
    if (!word1 || word1.length < MIN_WORD_SIZE) {
        return;
    }
    const searchIndex = getSearchIndex();
    let entry = searchIndex.get(word1);
    if (!entry) {
        entry = {
            count: 0,
            matches: [],
        };
    }
    ++entry.count;
    if (entry.count === DISCARD_LIMIT) {
        //console.log("discarding " + word1);
        entry.matches = null; // word1 is too frequent
    }
    if (entry.matches) {
        entry.matches.push(`${songNo}#${stanzaNo}#${verseNo}#${start1}#${end1}`);
    }
    searchIndex.set(word1, entry);
}


function indexLine(line: string, songNo: number, stanzaNo: number, verseNo: number) {
    //line2 = prepareForSearch(line2);
    //console.log(line2);
    let k = 0;
    let i = 0;
    const line2 = `${removeChords(line)} `; //!!! with " " we assure regular processing for the last word
    let dashPos: number[] | null = null;
    while (i < line2.length) {
        if (line2[i] === '-') {
            if (!dashPos) {
                dashPos = [k - 1]; // not really a dash, but makes processing easier
            }
            dashPos.push(i);
        } else if (line2[i] === ' ') {
            indexWord(line2.substring(k, i), songNo, stanzaNo, verseNo, k, i);
            if (dashPos) {
                //!!! to deal with "-", we index the whole thing but also the separate words;
                // users must be able to search for "era-ntr-o" and find an exact match for a single word; but this should also be an exact match for "era"; so both should be indexed
                //!!! when searching, "-" should be just discarded, and we find the match for the "full word"
                dashPos.push(i);
                for (let j = 0; j < dashPos.length - 1; ++j) {
                    //console.log("indexing '" + line2.substring(dashPos[j] + 1, dashPos[j + 1]) + "'");
                    indexWord(line2.substring(dashPos[j] + 1, dashPos[j + 1]), songNo, stanzaNo, verseNo,
                            dashPos[j] + 1, dashPos[j + 1]);
                }
                dashPos = null;
            }
            k = i + 1;
        }
        ++i;
    }
    //indexWord(line2.substring(k, i), songNo, stanzaNo, verseNo, k, i); //!!! not needed, due to adding a space to line2
}


function getInfoByTitle(song: Song): string {
    let res = song.t;
    const performer = song.p;
    const lyricist = song.l;
    if (performer) {
        if (lyricist && lyricist !== performer) {
            res += ` (${performer} / ${lyricist})`;
        } else {
            res += ` (${performer})`;
        }
    } else if (lyricist) {
        res += ` (${lyricist})`;
    }
    return res;
}


export function indexAll(songsUnsorted: Song[]) { //ttt0: This should be called at build to generate code and avoid a costly indexing at each start
    let songNo = 0;  //ttt9: Double check that this has the same value as i
    for (let i = 0; i < songsUnsorted.length; ++i) {
        //console.log(getInfoByTitle(songsUnsorted[i]));
        const song = songsUnsorted[i];
        indexLine(getInfoByTitle(songsUnsorted[i]), songNo, -1, -1);
        for (let st = 0; st < song.b.length; ++st) {
            const stanza = song.b[st];
            const verses = stanza.v;
            if (verses) {
                for (let v = 0; v < verses.length; ++v) {
                    indexLine(verses[v], songNo, st, v);
                }
            }
        }
        ++songNo;
    }
    let allWords = ' ';
    /*for (const word in searchIndex) {
        if (searchIndex.hasOwnProperty(word)) {
            if (searchIndex[word].matches) {
                allWords += `${word} `;
            } else {
                //console.log("indexAll(): discarded " + word + ": " + searchIndex[word].count);
            }
        }
    }*/

    const searchIndex = getSearchIndex();
    searchIndex.forEach((entry, word) => {
        if (entry.matches) {
            allWords += `${word} `;
        } else {
            //console.log("indexAll(): discarded " + word + ": " + searchIndex[word].count);
        }
    });
    setAllWords(allWords);
    //console.log(searchIndex);
    //console.log(allWords);

    /*if (typeof inBrowser !== "undefined" && inBrowser) {
        alert("indexAll() done; song count: " + songsUnsorted.length);
    }//*/
}
