import React from 'react';

import '../legacy.css';
import {SongRenderConfig} from '../SongRenderConfig';
import {ReactSetter2} from '../Common';

export const ChordConfigWidget = ({
    songRenderConfig, setSongRenderConfig,
} : {
    songRenderConfig: SongRenderConfig, setSongRenderConfig: ReactSetter2<SongRenderConfig>,
}) => {
    // onchange="onChordsToggle()"      //ttt0: make these work
    //  onClick="self.location.href = '#help';"
    // onchange="onEmbeddedChordsToggle()"
    // onchange="onSuggestionsToggle()"
    // onchange="updateSuggestionRange();"
    // onchange="updateSuggestionRange();"
    // onchange="onMaxSuggestionsChanged();"
    // onchange="onMaxCapoChanged();"

    /* eslint max-len: off */

    const toggleChordVisibility = React.useCallback(() => {
        const newConfig = {...songRenderConfig};  //ttt0: Review if this shallow copy
        // is good enough. (Probably so, as all fields are scalar.)
        newConfig.showChords = !newConfig.showChords;
        setSongRenderConfig(newConfig);
    }, [setSongRenderConfig, songRenderConfig]);

    return (<div>
        Acorduri <input id="chords" type="checkbox" className="chkBox" onChange={toggleChordVisibility}/>&nbsp;
        <input id="helpBtn" type="button" className="toolBtnNormal" value="?" /> <br/>
        {songRenderConfig.showChords && <div>
            În versuri <input id="embeddedChords" type="checkbox" className="chkBox" /> <br/>
            Sugestii <input id="useSuggestions" type="checkbox" className="chkBox" /> <br/>
            <div id="suggestionsContainer">
                <input id="voiceMin" type="text" className="editVoiceRangeShort" placeholder="min" spellCheck="false" autoComplete="off" autoCorrect="off" /> {/*ttt2 maybe put in a table*/}
                <input id="voiceMax" className="editVoiceRangeNormal" placeholder="max" spellCheck="false" autoComplete="off" autoCorrect="off" />
                <span id="voiceRange" > 1 </span>
                <br/>
                Max sugestii <input id="maxSuggestions" type="number" className="editSmallNumber" />
                <br/>
                Max capo <input id="maxCapo" type="number" className="editSmallNumber" />
                <br/>
            </div>
        </div>}
    </div>);
};
