import {describe, expect, test} from '@jest/globals';

import {searchTermsAndMerge} from '../Search';
import {getFullTitle} from '../../Song';
import {prepareForSearch, replaceDiacritics} from '../SearchUtils';
import {getSortedSongs} from '../../SongCollections';
import {SortType} from '../../Common';


const songs = getSortedSongs(SortType.position); // mainly added to make the songs load

type TestInfo = {
    terms: string, // space-separated
    count: number,
    //minCount?: number, //ttt1: A fixed count for a variable DB is quite fragile. We can use minCount / maxCount to
    // have some flexibility
    ignoredCount?: number,
}

describe('searchMatches', () => {
    describe('eq 1', () => {

        const tests: TestInfo[] = [
            {terms: 'ădio', count: 5},
            {terms: 'vii', count: 5},
            {terms: 'mut ochi', count: 3},
            {terms: 'padure', count: 6},

            {terms: 'ninge oape', count: 0},
            {terms: 'ninge pleoape', count: 1, ignoredCount: 1},
            {terms: 'ninge', count: 0, ignoredCount: 1},
            {terms: 'hdyeew pleoape', count: 0},

            {terms: 'casa', count: 15},

            {terms: 'bbbbbb', count: 0},
            {terms: 'kkkk llll', count: 0},
            {terms: 'gggg-hhhh gggg', count: 0},

            {terms: 'iii', count: 0},
            {terms: 'copiii', count: 3},
            {terms: 'copii', count: 11},
        ];

        /*const tests: TestInfo[] = [
            {terms: 'mut ochi', count: 3},
        ];*/

        function updateFound(stringMatch: string, termArr: string[], found: Map<string, boolean>) {
            const stringMatch1 = prepareForSearch(stringMatch);
            //console.log(`sortedSong:'${getFullTitle(sortedSong)}, ${details}, '${stringMatch1}'`);
            termArr.forEach((term) => {
                if (stringMatch1.indexOf(term) !== -1) {
                    found.set(term, true);
                }
            });
        }

        function hlp(testInfo: TestInfo) {
            const {terms} = testInfo;
            test(`"${terms}" has ${testInfo.count} matches and ${testInfo.ignoredCount || 0} ignored terms`, () => {
                const searchResult = searchTermsAndMerge(terms);
                let resultArr = searchResult.entries;
                console.log(`search for ${terms} got ${resultArr.length} results`);
                expect(resultArr.length).toBe(testInfo.count);
                expect(resultArr).toBeTruthy();
                if (testInfo.ignoredCount) {
                    expect(searchResult.ignored.length).toBe(testInfo.ignoredCount);
                }
                resultArr = resultArr || [];
                const termArr = replaceDiacritics(terms).split(' ')
                    .map((s) => {
                        return prepareForSearch(s.trim());
                    });
                for (const res of resultArr) {
                    const sortedSong = songs[res.songNo];
                    //console.log(`sortedSong: '${getFullTitle(sortedSong)}'`);
                    const found = new Map<string, boolean>();
                    termArr.forEach((term) => {
                        found.set(term, false);
                    });
                    if (res.titleMatch.matches.length) {
                        const stringMatch = getFullTitle(sortedSong.song);
                        const details = 'in title';
                        updateFound(stringMatch, termArr, found);
                    }
                    for (const match of res.verseMatches) {
                        const verses = sortedSong.song.b[match.dbg.stanzaNo].v || [];
                        const stringMatch = verses[match.dbg.verseNo];
                        const details = `', stanza:${match.dbg.stanzaNo}, verse:${match.dbg.verseNo} `;
                        updateFound(stringMatch, termArr, found);
                    }
                    found.forEach((val) => {
                        expect(val).toBeTruthy();
                    });
                }
            });
        }

        tests.forEach((s) => {
            hlp((s));
        });
    });
});
