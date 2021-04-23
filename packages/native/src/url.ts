export const newURL = (url: string | URL | Location = window.location.href): URL => {
    return url instanceof URL ? url : new URL(url as unknown as string, window.location.origin);
};

/** Returns the pathname with the hash at the end */
export const getHashedPath = (url: URL | string): string => {
    let _url = newURL(url);
    return `${_url.pathname}${_url.hash}`;
};

/** Returns the actual hash without the hashtag */
export const getHash = (url: URL | string): string => newURL(url).hash.slice(1);

/** Removes the hash from the full URL for a clean URL string */
export const clean = (url: URL | string): string => newURL(url).toString().replace(/(\/#.*|\/|#.*)$/, '');

/** Compares two URLs to each other */
export const equal = (a: URL | string, b: URL | string): boolean => (clean(a) === clean(b));

