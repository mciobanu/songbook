import {CapoDropdown} from './CapoDropdown';
import {FirstChordDropdown} from './FirstChordDropdown';
import {SongRenderConfig} from '../../SongRenderConfig';
import {ReactSetter2} from '../../Common';

/**
 * The capo and the first chord. Rendered together, so they can be aligned, for which a table is used
 *
 * Functionality: For capo and first chord we want to compute something initially for a song, then don't touch them
 * unless the settings change.
 */
export const DropdownsWidget = ({
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
    if (!songRenderConfig.showChords) {
        throw Error('Internal error. Asked to create chord info when chords are not rendered');
    }

    return (
        <table className={'capoTable'}>
            <tbody>
                {songRenderConfig.useSuggestions && (
                    <tr>
                        <td>Capodastru: </td>
                        <td><CapoDropdown capoCbBVal={capoCbBVal} setCapoCbBVal={setCapoCbBVal}/></td>
                    </tr>)}
                {chords.length && (
                    <tr>
                        <td>Primul acord: </td>
                        <td><FirstChordDropdown chords={chords} useSuggestions={songRenderConfig.useSuggestions}/></td>
                    </tr>)}
            </tbody>
        </table>);
};

