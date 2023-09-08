import * as JSON5 from 'json5';

/**
 * Retrieves an object from local storage
 * @param key
 * @param x
 */
export function persist<T>(key: string, x: T): void {
    const s = JSON5.stringify(x);
    localStorage.setItem(key, s);
}

export function retrieve<T>(key: string): T {
    const s = localStorage.getItem(key);
    if (!s) {
        throw Error(`No valid entry found for key ${key}`);
    }
    return JSON5.parse(s) as T;
}

const lastPathKey = 'lastPath';

export function persistLastPath(path: string) {
    if (path === '/') {
        //console.log(`won't persist last path: ${path}`);
        return;
    }
    //console.log(`persisting last path: ${path}`);
    localStorage.setItem(lastPathKey, path);
}

export function retrieveLastPath(): string | null {
    return localStorage.getItem(lastPathKey);
}

const fontSizeKey = 'fontSizeKey';
export const DEFAULT_FONT_SIZE = 16;

export function persistFontSize(fontSize: number) {
    //console.log(`persisting font size ${fontSize}`);
    localStorage.setItem(fontSizeKey, String(fontSize));
}

export function retrieveFontSize(): number {
    const str = localStorage.getItem(fontSizeKey);
    if (str) {
        const res = parseFloat(str);
        if (Number.isFinite(res) && res < 100 && res > 5) {
            //console.log(`retrieved font size ${res}`);
            return res;
        }
    }
    //console.log(`font size retrieval failed; returning default ${DEFAULT_FONT_SIZE}`);
    return DEFAULT_FONT_SIZE;
}
