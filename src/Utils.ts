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
