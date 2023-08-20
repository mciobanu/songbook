export const Paths = {
    help: '/help',
    search: '/search',

    indexByPosition: '/index-by-position',
    indexByTitle: '/index-by-title',
    indexByPerformer: '/index-by-performer',
    indexByLyricist: '/index-by-lyricist',
    indexByVerse: '/index-by-verse',

    songByPosition: '/song-by-position',
    songByTitle: '/song-by-title',
    songByPerformer: '/song-by-performer',
    songByLyricist: '/song-by-lyricist',
    songByVerse: '/song-by-verse',
    //songBySearch: '/song-by-search',  //ttt1: Perhaps implement this, but keep in mind that the search string
    // would need to be passed as well in order for the URL to be meaningful. Or, simpler: from Search,
    // pass the /song-by-position URL
} as const;
