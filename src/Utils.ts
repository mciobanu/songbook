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
