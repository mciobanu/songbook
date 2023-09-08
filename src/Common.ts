import React from 'react';

// sort of ESLint bug - //!!! https://stackoverflow.com/questions/63961803/eslint-says-all-enums-in-typescript-app-are-already-declared-in-the-upper-scope
// eslint-disable-next-line no-shadow
export enum SortType {
    position,
    title,
    performer,
    lyricist,
    verse,
}

//export type ReactGetter<T> = T | undefined;
//export type ReactSetter<T> = React.Dispatch<React.SetStateAction<T | undefined>>;
export type ReactSetter2<T> = React.Dispatch<React.SetStateAction<T>>;  //ttt1: review the need for both ReactSetter and ReactSetter2
