import {assert} from 'chai';
import {describe, it} from 'mocha';

import {getShiftedRange} from '../src/ChordUtils';


describe('getShiftedRange', () => {
    describe('positive 1', () => {
        it('getShiftedRange(\'A-F\', 2) should return B-G', () => {
            const result = getShiftedRange('A-F', 2);
            assert.equal(result, 'B-G');
        });
    });

    describe('positive 2', () => {
        it('getShiftedRange(\'G-D♯\', 2) should return A-F', () => {
            const result = getShiftedRange('G-D♯', 2);
            assert.equal(result, 'A-F');
        });
    });

    describe('positive 3', () => {
        it('getShiftedRange(\'G-D♯+\', 2) should return A-F+', () => {
            const result = getShiftedRange('G-D♯+', 2);
            assert.equal(result, 'A-F+');
        });
    });

    describe('negative 1', () => {
        it('getShiftedRange(\'A-F\', -2) should return G-D♯', () => {
            const result = getShiftedRange('A-F', -2);
            assert.equal(result, 'G-D♯');
        });
    });

    describe('negative 2', () => {
        it('getShiftedRange(\'F-D♯+\', -5) should return C-A♯+', () => {
            const result = getShiftedRange('F-D♯+', -5);
            assert.equal(result, 'C-A♯+');
        });
    });
});
