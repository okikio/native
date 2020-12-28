export declare const newURL: (url?: string | URL | Location) => URL;
/** Returns the pathname with the hash at the end */
export declare const getHashedPath: (url: URL) => string;
/** Returns the actual hash without the hashtag */
export declare const getHash: (url: URL) => string;
/** Removes the hash from the full URL for a clean URL string */
export declare const clean: (url: URL) => string;
/** Compares two URLs to each other */
export declare const equal: (a: URL | string, b: URL | string) => boolean;
