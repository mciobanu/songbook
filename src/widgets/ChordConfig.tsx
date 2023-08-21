import React from 'react';
import {useNavigate} from 'react-router-dom';

import '../legacy.css';
import {SongRenderConfig} from '../SongRenderConfig';
import {ReactSetter2} from '../Common';
import {Paths} from '../Paths';
import {computeSuggestionRange} from '../RangeProcessor';

export const ChordConfigWidget = ({
    songRenderConfig, setSongRenderConfig,
} : {
    songRenderConfig: SongRenderConfig, setSongRenderConfig: ReactSetter2<SongRenderConfig>,
}) => {
    //ttt0: make these work
    // onchange="onMaxSuggestionsChanged();"
    // onchange="onMaxCapoChanged();"

    /* eslint max-len: off */

    const toggleChordVisibility = React.useCallback(() => {
        const newConfig = {...songRenderConfig};  //ttt0: Review if this shallow copy
        // is good enough. (Probably so, as all fields are scalar.) Keep in mind that it's also used below.
        newConfig.showChords = !newConfig.showChords;
        setSongRenderConfig(newConfig);
    }, [setSongRenderConfig, songRenderConfig]);

    const navigate = useNavigate();

    const onHelp = React.useCallback(() => {
        navigate(Paths.help);
    }, [navigate]);

    const toggleInlineChords = React.useCallback(() => {
        const newConfig = {...songRenderConfig};
        newConfig.inlineChords = !newConfig.inlineChords;
        setSongRenderConfig(newConfig);
    }, [setSongRenderConfig, songRenderConfig]);

    const toggleSuggestions = React.useCallback(() => {
        const newConfig = {...songRenderConfig};
        newConfig.useSuggestions = !newConfig.useSuggestions;
        setSongRenderConfig(newConfig);
    }, [setSongRenderConfig, songRenderConfig]);

    const rangeMin = 'voiceMin';
    const rangeMax = 'voiceMax';

    const onRangeChanged = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
        const s = event.currentTarget.value;
        const {id} = event.currentTarget;
        const newMin = id === rangeMin ? s : songRenderConfig.minNote;
        const newMax = id === rangeMax ? s : songRenderConfig.maxNote;
        const newConfig = {...songRenderConfig};
        const range = computeSuggestionRange(newMin, newMax, songRenderConfig.minNote, songRenderConfig.maxNote);
        newConfig.minNote = range.minStr;
        newConfig.maxNote = range.maxStr;
        newConfig.noteRange = range.maxNum - range.minNum;
        setSongRenderConfig(newConfig);
        if (range.alerts.length) {
            alert(range.alerts.join('\n'));
        }
    }, [setSongRenderConfig, songRenderConfig]);

    return (<div>
        Acorduri &nbsp;
        <input id="chords" type="checkbox" className="chkBox" checked={songRenderConfig.showChords} onChange={toggleChordVisibility}/>&nbsp;
        <input id="helpBtn" type="button" className="toolBtnNormal" value="?" onClick={onHelp}/> <br/>
        {songRenderConfig.showChords && <div>
            În versuri &nbsp;
            <input id="embeddedChords" type="checkbox" className="chkBox" checked={songRenderConfig.inlineChords} onChange={toggleInlineChords}/> <br/>
            Sugestii &nbsp;
            <input id="useSuggestions" type="checkbox" className="chkBox" checked={songRenderConfig.useSuggestions} onChange={toggleSuggestions}/> <br/>
            <div id="suggestionsContainer">
                <input id="voiceMin" value={songRenderConfig.minNote} className="editVoiceRangeShort" placeholder="min"
                    spellCheck="false" autoComplete="off" autoCorrect="off" onChange={onRangeChanged}/> {/*ttt2 maybe put in a table*/}
                <input id="voiceMax" value={songRenderConfig.maxNote} className="editVoiceRangeNormal" placeholder="max"
                    spellCheck="false" autoComplete="off" autoCorrect="off" onChange={onRangeChanged}/>
                <span id="voiceRange"> {songRenderConfig.noteRange} </span>
                <br/>
                Max sugestii <input id="maxSuggestions" value={songRenderConfig.maxSuggestions} type="number" className="editSmallNumber" />
                <br/>
                Max capo <input id="maxCapo" value={songRenderConfig.maxCapo} type="number" className="editSmallNumber" />
                <br/>
            </div>
        </div>}
    </div>);
};
