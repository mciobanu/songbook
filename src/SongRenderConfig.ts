export type SongRenderConfig = {
    fontSize: number,
    showChords: boolean,
    inlineChords: boolean,
    useSuggestions: boolean,
    minNoteInternal: string,
    maxNoteInternal: string,  //ttt0: rename, using "voice"
    minNoteDisplay: string,
    maxNoteDisplay: string,
    noteRange: number,
    maxSuggestions: number,
    maxCapo: number,
};

export function voiceRange(songRenderConfig: SongRenderConfig) {
    return `${songRenderConfig.minNoteInternal}-${songRenderConfig.maxNoteInternal}`;  //ttt1: There are a number of
    // places using a similar template
}
