import {describe, expect, test} from '@jest/globals';
import {debugFmt} from '../Common';


describe('debugFmt', () => {
    function hlp(obj: any, expected: string) {
        test(`debugFmt('${obj}') should return '${expected}'`, () => {
            const result = debugFmt(obj);
            expect(result).toBe(expected);
        });
    }

    hlp('Am', '"Am"');
    hlp([1, 2], '[1, 2]');
});
