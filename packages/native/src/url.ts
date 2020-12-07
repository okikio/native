/**
 * Adds new methods to the native URL Object; it seemed cleaner than using a custom method or editing the prototype.
 *
 * This doesn't extend the **Class** object because it's meant to be a small extension of the native URL class.
 *
 * @export
 * @class URL
 * @extends {URL}
 */
// Read up on the native URL class [devdocs.io/dom/url]
/**
 * Creates an instance of URL.
 *
 * @param {(string | URL | Location)} [url=window.location.pathname]
 * @return URL
 */
export const newURL = (url: string | URL | Location = window.location.href): URL => {
    return url instanceof URL ? url : new URL(url as unknown as string, window.location.origin);
};

/**
 * Returns the pathname with the hash
 *
 * @param {URL} url
 * @returns string
 */
export const getHashedPath = (url: URL): string => (`${url.pathname}${url.hash}`);

/**
 * Returns the actual hash without the hashtag
 *
 * @param {URL} url
 * @returns string
 */
export const getHash = (url: URL): string => (url.hash.slice(1));

/**
 * Removes the hash from the full URL for a clean URL string
 *
 * @param {URL} url
 * @returns string
 */
export const clean = (url: URL): string => (url.toString().replace(/(\/#.*|\/|#.*)$/, ''));

/**
 * Compares two URLs to each other
 *
 * @param {URL} a
 * @param {URL} b
 * @returns boolean
 */
export const equal = (a: URL | string, b: URL | string): boolean => {
    let urlA = newURL(a);
    let urlB = newURL(b);
    return clean(urlA) === clean(urlB);
};
