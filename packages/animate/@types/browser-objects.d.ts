/**
 * Returns browser objects that can be used on the server
 * @returns An object with the following properties: `{ document, CSS }`, this so `@okikio/animate` can be used in both the browser and the server
 */
export declare const getBrowserObject: () => {
    document: Document;
    CSS: typeof CSS;
};
/**
 * Returns the browser's `document` object, except if it's a server, in which case it returns an empty object
 * @returns The browser document object, but allows it to be used both in the browser and the server
 */
export declare const getDocument: () => Document;
/**
 * The browser's `CSS` object, except if it's a server, in which case it returns an empty object
 * @returns The browser CSS object, except if it's a server, in which case it returns an empty object
 */
export declare const getCSS: () => typeof CSS;
