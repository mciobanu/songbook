import React from 'react';

import '../legacy.css';
import {SongRenderConfig} from '../SongRenderConfig';
import {Song} from '../Song';
import {debugFmt} from '../Common';

export const SongWidget = ({song, songRenderConfig}: {song: Song, songRenderConfig: SongRenderConfig}) => {
    return (<div>{debugFmt(song, true)}</div>);
};
