import {SortType} from './Common';
import {
    getFullTitle, getFullTitleLyricistRemoved, getFullTitlePerformerRemoved, Song,
} from './Song';
import {TestSongs} from './Songs';

export type SortedSong = {
    index: number,
    displayString: string, // usually used for sorting too, except in "ByPosition"
    song: Song,
}

function sortSongs(songs: SortedSong[]): void {
    songs.sort((s1, s2) => s1.displayString.localeCompare(s2.displayString));
    for (let i = 0; i < songs.length; i++) {
        // eslint-disable-next-line no-param-reassign
        songs[i].index = i + 1;
    }
}

let songsByPosition : SortedSong[];

function getSongsByPosition(): SortedSong[] {
    if (!songsByPosition) {
        songsByPosition = [];
        for (let i = 1; i <= TestSongs.length; i++) {
            const song = TestSongs[i - 1];
            songsByPosition.push({
                index: i,
                displayString: getFullTitle(song),
                song,
            });
        }
        //sortSongs(songsByPosition); //!!! We don't want to sort
    }
    return songsByPosition;
}

let songsByTitle : SortedSong[];

function getSongsByTitle(): SortedSong[] {
    if (!songsByTitle) {
        songsByTitle = [];
        for (const song of TestSongs) {
            songsByTitle.push({
                index: -1,
                displayString: getFullTitle(song),
                song,
            });
        }
        sortSongs(songsByTitle);
    }
    return songsByTitle;
}

let songsByPerformer : SortedSong[];

function getSongsByPerformer(): SortedSong[] {
    if (!songsByPerformer) {
        songsByPerformer = [];
        for (const song of TestSongs) {
            if (song.p) {
                for (const performer of song.p) {
                    songsByPerformer.push({
                        index: -1,
                        displayString: `${performer} - ${getFullTitlePerformerRemoved(song, performer)}`,
                        song,
                    });
                }
            }
        }
        sortSongs(songsByPerformer);
    }
    return songsByPerformer;
}

let songsByLyricist : SortedSong[];

function getSongsByLyricist(): SortedSong[] {
    if (!songsByLyricist) {
        songsByLyricist = [];
        for (const song of TestSongs) {
            if (song.l) {
                for (const lyricist of song.l) {
                    songsByLyricist.push({
                        index: -1,
                        displayString: `${lyricist} - ${getFullTitleLyricistRemoved(song, lyricist)}`,
                        song,
                    });
                }
            }
        }
        sortSongs(songsByLyricist);
    }
    return songsByLyricist;
}

let songsByVerse : SortedSong[];

function getSongsByVerse(): SortedSong[] {
    if (!songsByVerse) {
        songsByVerse = [];
        for (const song of TestSongs) {
            if (song.v) {
                for (const verse of song.v) {
                //song.v.forEach((verse) => {
                    songsByVerse.push({
                        index: -1,
                        displayString: `${verse} - ${getFullTitle(song)}`,
                        song,
                    });
                }
            }
        }
        sortSongs(songsByVerse);
    }
    return songsByVerse;
}

export function getSortedSongs(sortType: SortType): SortedSong[] {
    switch (sortType) {
    case SortType.position:
        return getSongsByPosition();
    case SortType.title:
        return getSongsByTitle();
    case SortType.performer:
        return getSongsByPerformer();
    case SortType.lyricist:
        return getSongsByLyricist();
    case SortType.verse:
        return getSongsByVerse();
    default:
        throw Error(`Unknown sort type: ${sortType}`);
    }
}
