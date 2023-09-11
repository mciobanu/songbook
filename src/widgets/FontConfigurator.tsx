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
    </span>);
};
