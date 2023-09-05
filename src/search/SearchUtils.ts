import {removeChords} from '../Song';

export function replaceDiacritics(text: string): string {  //ttt1: Romanian-specific
    let res = text;
    res = res.replace(/ș/g, 's');
    res = res.replace(/ț/g, 't');
    res = res.replace(/ţ/g, 't');
    res = res.replace(/ă/g, 'a');
    res = res.replace(/â/g, 'a');
    res = res.replace(/î/g, 'i');
    return res;
}

export function prepareForSearch(text: string): string {
    let res = text;
    res = res.toLowerCase();
    res = removeChords(res);
    res = replaceDiacritics(res);
    //res = res.toLowerCase(); //ttt1: This is where lower case is applied in JS, with the issue that it's too late for diacritics. See if there was a good reason for it
    //res = res.replace(/^[^\)\(]+\)/, ""); //!!! meant to get rid of stanza number but also removes things inside titles and verses; so removing stanza numbers is done in SearchBuilder.ts
    res = res.replace(/[^a-z ]/g, '');
    return res;
}

export const MIN_WORD_SIZE = 3;
export const DISCARD_LIMIT = 45;

//ttt0: Document how these things work, including the relationship between allWords and searchIndex

let allWords: string = '';

export function setAllWords(s: string) {
    allWords = s;
}

export function getAllWords(): string {
    return allWords;
}

export type SearchEntry = {
    count: number,
    matches: string[] | null,
}

const searchIndex = new Map<string, SearchEntry>();

export function getSearchIndex(): Map<string, SearchEntry> {
    return searchIndex;
}
