import React from 'react';

import * as JSON5 from 'json5';

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

export function debugFmt(x: any, multiLine: boolean = false): string {
    if (Array.isArray(x)) {
        return `[${x.map((o) => {
            return debugFmt(o);
        }).join(', ')}]`;
    }
    const x1: any = (x instanceof Map) ? Object.fromEntries(x) : x;
    return multiLine ? JSON5.stringify(x1, null, 2) : JSON.stringify(x1);
}
