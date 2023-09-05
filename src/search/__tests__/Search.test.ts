import {describe, expect, test} from '@jest/globals';

import {searchTermsAndMerge} from '../Search';
import {TestSongs} from '../../Songs';
import {getFullTitle} from '../../Song';
import {prepareForSearch, replaceDiacritics} from '../SearchUtils';


const songs = TestSongs; // mainly added to make the songs load

type TestInfo = {
    terms: string, // space-separated
    count: number,
    //minCount?: number, //ttt1: A fixed count for a variable DB is quite fragile. We can use minCount / maxCount to
    // have some flexibility
}

describe('searchMatches', () => {
    describe('eq 1', () => {

        const tests: TestInfo[] = [
            {terms: 'ădio', count: 5},
            {terms: 'vii', count: 5},
            {terms: 'mut ochi', count: 3},
            {terms: 'ninge oape', count: 0},
            {terms: 'ninge pleoape', count: 1},
            {terms: 'ninge', count: 0},
            {terms: 'bbbbbb', count: 0},
            {terms: 'casa', count: 15},


            {terms: 'jjjjjj', count: 0},
            {terms: 'kkkk llll', count: 0},
            {terms: 'gggg-hhhh gggg', count: 0},
            {terms: 'gggg hhhh', count: 0},

            {terms: 'ddf', count: 0},
            {terms: 'ddf dff', count: 0},
            {terms: 'ddf ddff', count: 0},
            {terms: 'iiiii', count: 0},

            {terms: 'iii', count: 0},
            {terms: 'copiii', count: 3},
            {terms: 'copii', count: 11},
        ];

        function hlp(testInfo: TestInfo) {
            const {terms} = testInfo;
            test(`match for ${terms}`, () => {
                let resultArr = searchTermsAndMerge(terms);
                console.log(`search for ${terms} got ${resultArr.length} results`);
                expect(resultArr.length).toBe(testInfo.count);
                expect(resultArr).toBeTruthy();
                resultArr = resultArr || [];
                const termArr = replaceDiacritics(terms).split(' ')
                    .map((s) => {
                        return prepareForSearch(s.trim());
                    });
                for (const res of resultArr) {
                    const song = songs[res.song];
                    //console.log(`song: '${getFullTitle(song)}'`);
                    const found = new Map<string, boolean>();
                    termArr.forEach((term) => {
                        found.set(term, false);
                    });
                    for (const match of res.matches) {
                        let stringMatch: string;
                        let details: string;
                        if (match.stanza === -1) {
                            stringMatch = getFullTitle(song);
                            details = 'in title';
                        } else {
                            const verses = song.b[match.stanza].v || [];
                            stringMatch = verses[match.verse];
                            details = `', stanza:${match.stanza}, verse:${match.verse} `;
                        }
                        //console.log(`song:'${getFullTitle(song)}, ${details}, '${stringMatch}'`);
                        stringMatch = prepareForSearch(stringMatch);
                        termArr.forEach((term) => {
                            if (stringMatch.indexOf(term) !== -1) {
                                found.set(term, true);
                            }
                        });
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
