import React from 'react';

import {useLocation} from 'react-router-dom';


/**
 * Scrolls to the top of the page, to be used when the route changes.
 *
 * @constructor
 */
export function ScrollToTop() {
    // https://stackoverflow.com/questions/36904185/react-router-scroll-to-top-on-every-transition
    const {pathname} = useLocation();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
