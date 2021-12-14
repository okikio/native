/**
 * Returns browser objects that can be used on the server
 * @returns An object with the following properties: `{ document, CSS }`, this so `@okikio/animate` can be used in both the browser and the server
 */
 export const getBrowserObject = () => {
    return {
        document: (("document" in globalThis) ? globalThis.document : {}) as Document,
        CSS: (("CSS" in globalThis) ? globalThis.CSS : {}) as typeof CSS,
    };
}

/**
 * Returns the browser's `document` object, except if it's a server, in which case it returns an empty object
 * @returns The browser document object, but allows it to be used both in the browser and the server
 */
export const getDocument = () => {
    return getBrowserObject().document;
}

/**
 * The browser's `CSS` object, except if it's a server, in which case it returns an empty object
 * @returns The browser CSS object, except if it's a server, in which case it returns an empty object
 */
export const getCSS = () => {
    return getBrowserObject().CSS;
}