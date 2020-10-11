/**
 * Adds new methods to the native URL Object; it seemed cleaner than using a custom method or editing the prototype.
 *
 * This doesn't extend the **Class** object because it's meant to be a small extension of the native URL class.
 *
 * @export
 * @class _URL
 * @extends {URL}
 */
// export class _URL extends URL {
//     // Read up on the native URL class [devdocs.io/dom/url]
// 	/**
// 	 * Creates an instance of _URL.
// 	 *
//      * @param {(string | _URL | URL | Location)} [url=window.location.pathname]
// 	 * @memberof _URL
// 	 */
//     constructor(url: any = window.location.href) {
//         super(url instanceof URL ? url.href : url, window.location.origin);
//     }

//     /**
//      * Returns the pathname with the hash
//      *
//      * @returns string
//      * @memberof _URL
//      */
//     public getFullPath(): string {
//         return `${this.pathname}${this.hash}`;
//     }

//     /**
//      * Returns the actual hash without the hashtag
//      *
//      * @returns string
//      * @memberof _URL
//      */
//     public getHash(): string {
//         return this.hash.slice(1);
//     }

//     /**
// 	 * Removes the hash from the full URL for a clean URL string
// 	 *
// 	 * @returns string
// 	 * @memberof _URL
// 	 */
//     public clean(): string {
//         return this.toString().replace(/(\/#.*|\/|#.*)$/, '');
//     }

// 	/**
// 	 * Returns the pathname of a URL
// 	 *
// 	 * @returns string
// 	 * @memberof _URL
// 	 */
//     public getPathname(): string {
//         return this.pathname;
//     }

// 	/**
// 	 * Compares this **_URL** to another **_URL**
// 	 *
// 	 * @param {_URL} url
// 	 * @returns boolean
// 	 * @memberof _URL
// 	 */
//     public equalTo(url: _URL): boolean {
//         return this.clean() == url.clean();
//     }

// 	/**
// 	 * Compares the pathname of two URLs to each other
// 	 *
// 	 * @static
// 	 * @param {_URL} a
// 	 * @param {_URL} b
// 	 * @returns boolean
// 	 * @memberof _URL
// 	 */
//     static equal(a: _URL | string, b: _URL | string): boolean {
//         let urlA = a instanceof _URL ? a : new _URL(a);
//         let urlB = b instanceof _URL ? b : new _URL(b);
//         return urlA.equalTo(urlB);
//     }
// }

// Read up on the native URL class [devdocs.io/dom/url]
/**
 * Creates an instance of _URL.
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
 * @param {_URL} a
 * @param {_URL} b
 * @returns boolean
 */
export const equal = (a: URL | string, b: URL | string): boolean => {
    let urlA = newURL(a);
    let urlB = newURL(b);
    return clean(urlA) === clean(urlB);
};
