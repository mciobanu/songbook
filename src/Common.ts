import React from "react";

export enum SortType {
    position,
    title,
    singer,
    writer,
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

export function getFullTitle(song: Song): string {
    let additional: string[] = [];
    if (song.p) {
        additional.push(...song.p);
    }
    if (song.l) {
        additional.push(...song.l);
    }
    if (!additional.length) {
        return song.t;
    }
    return song.t + ' (' + additional.join(' / ');
}
