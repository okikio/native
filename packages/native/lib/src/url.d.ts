/**
 * Adds new methods to the native URL Object; it seemed cleaner than using a custom method or editing the prototype.
 *
 * This doesn't extend the **Class** object because it's meant to be a small extension of the native URL class.
 *
 * @export
 * @class _URL
 * @extends {URL}
 */
export declare class _URL extends URL {
    /**
     * Creates an instance of _URL.
     *
     * @param {(string | _URL | URL | Location)} [url=window.location.pathname]
     * @memberof _URL
     */
    constructor(url?: any);
    /**
     * Returns the pathname with the hash
     *
     * @returns string
     * @memberof _URL
     */
    getFullPath(): string;
    /**
     * Returns the actual hash without the hashtag
     *
     * @returns string
     * @memberof _URL
     */
    getHash(): string;
    /**
     * Removes the hash from the full URL for a clean URL string
     *
     * @returns string
     * @memberof _URL
     */
    clean(): string;
    /**
     * Returns the pathname of a URL
     *
     * @returns string
     * @memberof _URL
     */
    getPathname(): string;
    /**
     * Compares this **_URL** to another **_URL**
     *
     * @param {_URL} url
     * @returns boolean
     * @memberof _URL
     */
    equalTo(url: _URL): boolean;
    /**
     * Compares the pathname of two URLs to each other
     *
     * @static
     * @param {_URL} a
     * @param {_URL} b
     * @returns boolean
     * @memberof _URL
     */
    static equal(a: _URL | string, b: _URL | string): boolean;
}
