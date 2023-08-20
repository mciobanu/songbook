import React from 'react';

import '../legacy.css';

export const FontConfiguratorWidget = () => {
    // ttt0 make sure min, max, step are set in JS
    // onChange="changeZoom(this.value)"   //ttt0: make this work
    /* eslint max-len: off */

    return (<span id="zoomRangeContainer" className="singleLine">
        {/*glyphs missing in older systems
            &#x207a;&#x2044;&#x208b; <input id="zoomRange" type="range" class="zoom" min="4" max="8" step="0.5" onchange="changeZoom(this.value)" />
            &nbsp;*/}

                &minus;<input id="zoomRange" type="range" className="zoom" />+&nbsp;&nbsp;

        {/*What's going on:

                The main issue is that the width of the menu assumes there's no vertical scrollbar. Then when a scrollbar is needed the menu is not moved to the left to accomodate it, but rather the menu gets shrinked horizontally to make room for the scrollbar, which causes things that were on a single line to be on multiple lines. There was a workaround that relied on zoomRangeContainer being the widest, which looked OK in some cases but hasn't been tested properly. By adding at least one &nbsp; after "+" we request more space than normally needed. By using "overflow-x:hidden;" in menuDiv we make the vertical scrollbar overlap this empty space (at least on desktop). An improvement over using zoomRangeContainer was implemented: trying to set a width for <hr> so they are the widest elements. (If this is not the case, the search button might move to the next line or the note range might get split.) Since the width of <hr> is easier to control, this approach seems better, but it's possible for these issues to occur for some font sizes (although a few tests seemed fine.) Also, in lower versions zoomRangeContainer gets hidden anyway, as they have no "range". Further improvements haven't been examined. One idea would be to measure the width of the widest line, but not sure this can be done in JavaScript and it's quite a kludge anyway. //ttt2

                Anyway, using "overflow-x:hidden;" in menuDiv makes more sense in Android, so "overflow-x:auto;" should be used there, and this is also OK on browser

                Another issue is that the scroll for the menu doesn't work in Android when chords are above the verses //ttt1

                Then, in 2.3.3 the scroll of the menu is ignored anyway: only what fits on the screen is rendered, and scrolling just reveals the song (or index) that was supposed to be underneath. ttt2
                (This might be somehow related to the fact that in 2.3.3 "position:fixed;" is not done correctly and the menu scrolls along with the text underneath, whereas from 3.0 above it stays in the top-right corner (unless it is itself big enough that it needs to scroll) ttt2
                ttt2 view https://benfrain.com/easy-css-fix-fixed-positioning-android-2-2-2-3/ about 2.3.3 and "position:fixed;"
                    https://groups.google.com/forum/#!topic/phonegap/Xr3h5NyL0Xc
    */}

    </span>);
};
