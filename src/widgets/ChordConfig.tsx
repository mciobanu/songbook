import React from 'react';

import '../legacy.css';

export const ChordConfigWidget = () => {
    // onchange="onChordsToggle()"      //ttt0: make these work
    //  onClick="self.location.href = '#help';"
    // onchange="onEmbeddedChordsToggle()"
    // onchange="onSuggestionsToggle()"
    // onchange="updateSuggestionRange();"
    // onchange="updateSuggestionRange();"
    // onchange="onMaxSuggestionsChanged();"
    // onchange="onMaxCapoChanged();"

    /* eslint max-len: off */

    return (<div>
        Acorduri <input id="chords" type="checkbox" className="chkBox" />
        <input id="helpBtn" type="button" className="toolBtnNormal" value="?" /> <br/>
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
    </div>);
};
