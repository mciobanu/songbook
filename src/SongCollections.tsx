import {Song} from "./Common";
import {TestSongs} from "./Songs";

export type SortedSong = {
    index: number,
    sortString: string,
    song: Song,
}

let songsByVerse : SortedSong[];

function sortSongs(songs: SortedSong[]): void {
    songs.sort((s1, s2) => s1.sortString.localeCompare(s2.sortString));
    for (let i = 0; i < songs.length; i++) {
        songs[i].index = i + 1;
    }
}

export function getSongsByVerse(): SortedSong[] {
    if (!songsByVerse) {
        songsByVerse = [];
        for (let song of TestSongs) {
            if (song.v) {
                for (let verse of song.v) {
                    songsByVerse.push({
                        index: -1,
                        sortString: verse,
                        song: song,
                    })
                }
            }
        }
        sortSongs(songsByVerse);
    }
    return songsByVerse;
}
