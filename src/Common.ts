import React from "react";

export enum SortType {
    position,
    title,
    performer,
    lyricist,
    verse,
}

export type ReactGetter<T> = T | undefined;
export type ReactSetter<T> = React.Dispatch<React.SetStateAction<T | undefined>>;
export type ReactSetter2<T> = React.Dispatch<React.SetStateAction<T>>;  //ttt1: review the need for both ReactSetter and ReactSetter2

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
    let a: string[] = [...list];
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
    return list.join(", ");
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
