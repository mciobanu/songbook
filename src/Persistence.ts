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
