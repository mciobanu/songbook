import React from 'react';

import '../legacy.css';
import {NonNavigatingRootMenuWidget} from '../widgets/NonNavigatingRootMenu';

export const SearchPage = () => {
    return (
        <div>
            <NonNavigatingRootMenuWidget />
            <span className="songTitle">SearchPage</span>
        </div>
    );
};
