import * as JSON5 from 'json5';
import {decycle} from './decycle';

/**
 * Converts a string to an integer value, making sure it stays within given limits.
 * Shows an error message if appropriate
 *
 * @param str
 * @param min
 * @param max
 * @param defaultVal
 */
export function convertToInt(str: string, min: number, max: number, defaultVal: number): number {
    let val;
    try {
        val = parseInt(str, 10);//ttt3 check all parseInt to test for NaN
        //ttt3 probably some places that are expected to throw actually just assign NaN or do other non-throwing things; not sure how to detect them
    } catch (e) {
        val = min - 1;
    }
    if (Number.isNaN(val) || val < min || val > max) {
        alert(`Valoarea trebuie să fie un număr între ${min} și ${max}`);
        val = defaultVal;
    }
    return val;
}


/**
 * Returns true iff both arrays exist and have the same elements, in the same order
 * @param arr1
 * @param arr2
 */
export function arraysAreEqual<T>(arr1: T[] | undefined, arr2: T[] | undefined) {
    if (!arr1 || !arr2 || arr1.length !== arr2.length) {
        return false;
    }
    return arr1.every((val, index) => {
        return val === arr2[index];
    });
}


/**
 * Replaces undefined fields of obj with the corresponding fields from def. To be used when changing the name of some
 * persisted fields changed, and we'd rather take the defaults, instead of copying the existing values
 *
 * @param obj
 * @param def
 */
export function populateNewFields<T>(obj: T, def: T) {
    let prop: keyof typeof obj;
    for (prop in obj) {
        if (obj[prop] === undefined) {
            // eslint-disable-next-line no-param-reassign
            obj[prop] = def[prop];
        }
    }
}

export function getLast<T>(arr: T[]): T {
    return arr[arr.length - 1];
}


function debugFmtHlp(x: any, multiLine: boolean = false): string {
    if (Array.isArray(x)) {
        return `[${x.map((o) => {
            return debugFmtHlp(o);
        }).join(', ')}]`;
    }
    const x1: any = (x instanceof Map) ? Object.fromEntries(x) : x;
    return multiLine ? JSON5.stringify(x1, null, 2) : JSON.stringify(x1);
}

export function debugFmt(x: any, multiLine: boolean = false): string {
    return debugFmtHlp(decycle(x), multiLine);
}
