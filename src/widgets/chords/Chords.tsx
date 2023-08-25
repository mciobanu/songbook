import {SongRenderConfig} from '../../SongRenderConfig';
import {ReactSetter2} from '../../Common';
import {DropdownsWidget} from './Dropdowns';

/**
 * Creates the part above the actual song, with chord, capo, suggestions, etc.
 */
export const ChordsWidget = ({
    chords,
    songRenderConfig,
    capoCbBVal,
    setCapoCbBVal,
} : {
    chords: string[],
    songRenderConfig: SongRenderConfig,
    capoCbBVal: string,
    setCapoCbBVal: ReactSetter2<string>,
}) => {
    if (!songRenderConfig.showChords || !chords.length) {
        return null;
    }
    return (
        <DropdownsWidget chords={chords} songRenderConfig={songRenderConfig} capoCbBVal={capoCbBVal}
            setCapoCbBVal={setCapoCbBVal}/>
    );
};
