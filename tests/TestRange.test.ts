import {assert, expect} from 'chai';

import {describe, it} from 'mocha';


describe('RangeTest', () => {
    console.log('aa');
    it('should know how to multiply', () => {
        expect(3 * 7).to.be.equal(21);
    });
});

describe('Calculator Tests 2', () => {
    it('should return 6 when 2 is added to 4', () => {
        const result = 2 + 4;
        assert.equal(result, 6);
    });
});
