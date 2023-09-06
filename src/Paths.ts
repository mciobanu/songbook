import {SortType} from './Common';

const INDEX_BY_POSITION = '/index-by-position';

export const Paths = {
    help: '/help',
    search: '/search',

    indexByPosition: INDEX_BY_POSITION,
    indexByTitle: '/index-by-title',
    indexByPerformer: '/index-by-performer',
    indexByLyricist: '/index-by-lyricist',
    indexByVerse: '/index-by-verse',

    songByPosition: '/song-by-position',
    songByTitle: '/song-by-title',
    songByPerformer: '/song-by-performer',
    songByLyricist: '/song-by-lyricist',
    songByVerse: '/song-by-verse',

    defaultPath: INDEX_BY_POSITION,
    //songBySearch: '/song-by-search',  //ttt1: Perhaps implement this, but keep in mind that the search string
    // would need to be passed as well in order for the URL to be meaningful. Or, simpler: from Search,
    // pass the /song-by-position URL
} as const;


const songPathsForSortType: string[] = [];

function initSongPathsForSortType() {
    songPathsForSortType[SortType.position] = Paths.songByPosition;
    songPathsForSortType[SortType.title] = Paths.songByTitle;
    songPathsForSortType[SortType.performer] = Paths.songByPerformer;
    songPathsForSortType[SortType.lyricist] = Paths.songByLyricist;
    songPathsForSortType[SortType.verse] = Paths.songByVerse;
}

initSongPathsForSortType();  //ttt2: Make sure this is always OK

export function createSongPath(sortType: SortType, songNo: number): string {
    return `${songPathsForSortType[sortType]}/${songNo}`;
}

const indexPageTitles: string[] = [];

function initIndexPageTitles() {
    indexPageTitles[SortType.position] = 'Index după număr';
    indexPageTitles[SortType.title] = 'Index după titlu';
    indexPageTitles[SortType.performer] = 'Index după interpret';
    indexPageTitles[SortType.lyricist] = 'Index după textier';
    indexPageTitles[SortType.verse] = 'Index după versuri';
}

initIndexPageTitles();

export function getIndexPageTitle(sortType: SortType): string {
    return  indexPageTitles[sortType];
}
