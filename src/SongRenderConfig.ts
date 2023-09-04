export type SongRenderConfig = {
    fontSize: number,
    showChords: boolean,
    inlineChords: boolean,
    useSuggestions: boolean,
    minVoiceInternal: string, // Internally we always use ♯ and ♭ for accidentals, while on the screen we may use # and b on old systems
    maxVoiceInternal: string,
    minVoiceDisplay: string,
    maxVoiceDisplay: string,
    voiceRange: number,
    maxSuggestions: number,
    maxCapo: number,
};

export function voiceRange(songRenderConfig: SongRenderConfig) {
    return `${songRenderConfig.minVoiceInternal}-${songRenderConfig.maxVoiceInternal}`;  //ttt1: There are a number of
    // places using a similar template
}

type SongRenderConfigV1 = {
    fontSize: number,
    showChords: boolean,
    inlineChords: boolean,
    useSuggestions: boolean,
    minNoteInternal?: string,
    maxNoteInternal?: string,
    minNoteDisplay?: string,
    maxNoteDisplay?: string,
    noteRange?: number,
    maxSuggestions: number,
    maxCapo: number,
};


/**
 * Converts from the old version of SongRenderConfig to the latest, by renaming fields
 * @param cfg
 * @param def
 */
export function upgradeSongRenderConfig(cfg: SongRenderConfig, def: SongRenderConfig) {
    // @ts-ignore
    const cfgOld = cfg as SongRenderConfigV1;
    const cfg2 = cfg;
    if (cfgOld.maxNoteDisplay !== undefined) {
        cfg2.minVoiceInternal = cfgOld.minNoteInternal || def.minVoiceInternal;
        cfg2.maxVoiceInternal = cfgOld.maxNoteInternal || def.maxVoiceInternal;
        cfg2.minVoiceDisplay = cfgOld.minNoteDisplay || def.minVoiceDisplay;
        cfg2.maxVoiceDisplay = cfgOld.maxNoteDisplay || def.maxVoiceDisplay;
        cfg2.voiceRange = cfgOld.noteRange || def.voiceRange;
        cfgOld.minNoteInternal = undefined;
        cfgOld.maxNoteInternal = undefined;
        cfgOld.minNoteDisplay = undefined;
        cfgOld.maxNoteDisplay = undefined;
        cfgOld.noteRange = undefined;
    }
}
