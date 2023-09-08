import React from 'react';

import '../legacy.css';

import {ReactSetter2} from '../Common';

const FONT_RANGE_MIN = 4;
const FONT_RANGE_MAX = 8;
const FONT_RANGE_STEP = 0.5;

function computeZoom(val: number): number {
    //return parseInt(Math.pow(1.5, parseFloat(val, 10) + 1) + 4.609375);
    return Math.trunc(1.5 ** (val + 1) + 4.609375);
}


function zoomRangeFromFontSize(fontSize: number): number {
    let crtDiff;
    let bestDiff = 1000;
    let bestPos = FONT_RANGE_MAX; // Doesn't really matter, just some value for the transpiler
    for (let pos = FONT_RANGE_MIN; pos <= FONT_RANGE_MAX + 1e-5; pos += FONT_RANGE_STEP) {
        crtDiff = Math.abs(computeZoom(pos) - fontSize);
        if (crtDiff < bestDiff) {
            bestDiff = crtDiff;
            bestPos = pos;
        }
    }
    return bestPos;
}


export const FontConfiguratorWidget = ({
    fontSize,
    setFontSize,
} : {
    fontSize: number,
    setFontSize: ReactSetter2<number>,
}) => {
    const rangeValue = React.useMemo(() => {
        return zoomRangeFromFontSize(fontSize);
    }, [fontSize]);

    const [isMouseDown, setIsMouseDown] = React.useState(false);

    const onZoomChange = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
        //console.log(event);
        //console.log(debugFmt(event));
        //console.log(event.currentTarget.value);
        const str = event.currentTarget.value;
        if (isMouseDown) {
            //console.log(`MouseDown; won't set value to ${str}`);
        } else {
            //console.log(`setting value to ${str}`);
            setFontSize(computeZoom(parseFloat(str)));
        }
        //
    }, [isMouseDown, setFontSize]);

    //ttt1: In JS there's a zoomButtonsContainer and a zoomRangeContainer, to have something working in old systems. See if still needed
    return (<span id="zoomRangeContainer" className="singleLine">
        {/*glyphs missing in older systems ttt1 review if we still need them
            &#x207a;&#x2044;&#x208b; <input id="zoomRange" type="range" class="zoom" min="4" max="8" step="0.5" onchange="changeZoom(this.value)" />
            &nbsp;*/}

                &minus;<input id="zoomRange" type="range" className="zoom" onChange={onZoomChange}
            onMouseUp={() => setIsMouseDown(false)} onMouseDown={() => setIsMouseDown(true)}
            min={FONT_RANGE_MIN} max={FONT_RANGE_MAX} step={FONT_RANGE_STEP} value={rangeValue}/>+&nbsp;&nbsp;

        {/*ttt1 review this copied comment:
                What's going on:

                The main issue is that the width of the menu assumes there's no vertical scrollbar. Then when a scrollbar is needed,
                the menu is not moved to the left to accomodate it, but rather the menu gets shrinked horizontally to make room for
                the scrollbar, which causes things that were on a single line to be on multiple lines. There was a workaround that
                relied on zoomRangeContainer being the widest, which looked OK in some cases but hasn't been tested properly. By
                adding at least one &nbsp; after "+" we request more space than normally needed. By using "overflow-x:hidden;" in
                menuDiv we make the vertical scrollbar overlap this empty space (at least on desktop). An improvement over using
                zoomRangeContainer was implemented: trying to set a width for <hr> so they are the widest elements. (If this is not
                the case, the search button might move to the next line or the note range might get split.) Since the width of <hr>
                is easier to control, this approach seems better, but it's possible for these issues to occur for some font sizes
                (although a few tests seemed fine.) Also, in lower versions zoomRangeContainer gets hidden anyway, as they have no
                "range". Further improvements haven't been examined. One idea would be to measure the width of the widest line, but
                not sure this can be done in JavaScript and it's quite a kludge anyway. //ttt2

                Anyway, using "overflow-x:hidden;" in menuDiv makes more sense in Android, so "overflow-x:auto;" should be used
                there, and this is also OK on browser

                Another issue is that the scroll for the menu doesn't work in Android when chords are above the verses //ttt1

                Then, in 2.3.3 the scroll of the menu is ignored anyway: only what fits on the screen is rendered, and scrolling
                just reveals the song (or index) that was supposed to be underneath. ttt2

                (This might be somehow related to the fact that in 2.3.3 "position:fixed;" is not done correctly and the menu
                scrolls along with the text underneath, whereas from 3.0 above it stays in the top-right corner (unless it is
                itself big enough that it needs to scroll) ttt2

                ttt2 view https://benfrain.com/easy-css-fix-fixed-positioning-android-2-2-2-3/ about 2.3.3 and "position:fixed;"
                    https://groups.google.com/forum/#!topic/phonegap/Xr3h5NyL0Xc
    */}

    </span>);
};
