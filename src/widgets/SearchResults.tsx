import React from 'react';

import '../legacy.css';

import {SearchMatch, SearchResult} from '../search/Search';
import {Paths} from '../Paths';


export const SearchResultsWidget = ({
    searchTerms,
    searchResult,
} : {
    searchTerms: string,
    searchResult: SearchResult,
}) => {

    const formatMatch = React.useCallback((searchMatch: SearchMatch) => {
        return <>
            {searchMatch.matches.map((match) => {
                return <><span>{match.plain}</span><span className='searchMatch'>{match.highlight}</span></>;
            })}
            <span>{searchMatch.plainEnd}</span>
        </>;
    }, []);

    const songList = React.useMemo(() => {
        return searchResult.entries.map((entry, index) => {
            return <p className='searchResult' key={index}>
                <a href={`${Paths.songByPosition}/${entry.songNo + 1}`}><i>{formatMatch(entry.titleMatch)}</i></a>
                {!!entry.verseMatches.length && entry.verseMatches.map((match, index1) => {
                    return <>{index1 === 0 ? ' - ' : ' [...] '} {formatMatch(match)}</>;
                })}
            </p>;
        });
    }, [formatMatch, searchResult.entries]);

    function getResultsText() {
        return `Căutarea după “${searchTerms}” a găsit ${searchResult.entries.length}`
                + ` rezultat${searchResult.entries.length === 1 ? '' : 'e'}.`;
    }

    function getWarningText() {
        if (!searchResult.ignored.length) {
            return null;
        }
        const ignoredList = searchResult.ignored.map((s) => {
            return `“${s}”`;
        }).join(', ');
        return <span className='searchWarning'> Cuvinte ignorate deoarece apar prea des în text: {ignoredList}.</span>;
    }

    return (<>
        <p className='searchSummary'>{getResultsText()} {getWarningText()}</p>
        {songList}
    </>);
    //ttt0: In JS there was a escapeHtml() around searchTerms. See if needed, probably by searching for "&lt;" or similar and comparing with JS
};
