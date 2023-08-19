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
