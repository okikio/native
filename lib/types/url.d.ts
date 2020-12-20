/**
 * Adds new methods to the native URL Object; it seemed cleaner than using a custom method or editing the prototype.
 *
 * This doesn't extend the **Class** object because it's meant to be a small extension of the native URL class.
 *
 * @export
 * @class URL
 * @extends {URL}
 */
/**
 * Creates an instance of URL.
 *
 * @param {(string | URL | Location)} [url=window.location.pathname]
 * @return URL
 */
export declare const newURL: (url?: string | URL | Location) => URL;
/**
 * Returns the pathname with the hash
 *
 * @param {URL} url
 * @returns string
 */
export declare const getHashedPath: (url: URL) => string;
/**
 * Returns the actual hash without the hashtag
 *
 * @param {URL} url
 * @returns string
 */
export declare const getHash: (url: URL) => string;
/**
 * Removes the hash from the full URL for a clean URL string
 *
 * @param {URL} url
 * @returns string
 */
export declare const clean: (url: URL) => string;
/**
 * Compares two URLs to each other
 *
 * @param {URL} a
 * @param {URL} b
 * @returns boolean
 */
export declare const equal: (a: URL | string, b: URL | string) => boolean;
