export const newURL = (url: string | URL | Location = window.location.href): URL => {
    return url instanceof URL ? url : new URL(url as unknown as string, window.location.origin);
};

/** Returns the pathname with the hash at the end */
export const getHashedPath = (url: URL): string => (`${url.pathname}${url.hash}`);

/** Returns the actual hash without the hashtag */
export const getHash = (url: URL): string => (url.hash.slice(1));

/** Removes the hash from the full URL for a clean URL string */
export const clean = (url: URL): string => (url.toString().replace(/(\/#.*|\/|#.*)$/, ''));

/** Compares two URLs to each other */
export const equal = (a: URL | string, b: URL | string): boolean => {
    let urlA = newURL(a);
    let urlB = newURL(b);
    return clean(urlA) === clean(urlB);
};
