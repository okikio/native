/** Merges 2-dimensional Arrays into a single 1-dimensional array */
export declare const flatten: (arr: any[]) => any[];
/** Determines whether value is an pure object (not array, not function, etc...) */
export declare const isObject: (obj: any) => boolean;
/** Determines if an object is empty */
export declare const isEmpty: (obj: any) => boolean;
/**
 * Acts like array.map(...) but for functions
 */
export declare const mapObject: (obj: object, fn: (value: any, key: any, obj: any) => any) => {};
/** Converts values to strings */
export declare const toStr: (input: any) => string;
/**
 * Returns the unit of a string, it does this by removing the number in the string
 */
export declare const getUnit: (str: string | number) => string;
/**
  Convert value to string, then trim any extra white space and line terminator characters from the string.
*/
export declare const trim: (str: string) => string;
/**
 * Convert the input to an array
 * For strings if type == "split", split the string at spaces, if type == "wrap" wrap the string in an array
 * For array do nothing
 * For everything else wrap the input in an array
 */
export declare const toArr: (input: any, type?: string) => any[];
/**
 * Checks if a value is valid/truthy; it counts empty arrays and strings as falsey,
 * as well as null, undefined, and NaN, everything else is valid
 *
 * _**Note:** 0 counts as valid_
 *
 * @param value - anything
 * @returns true or false
 */
export declare const isValid: (value: any) => boolean;
/** Convert a camelCase string to a dash-separated string (opposite of {@link camelCase}) */
export declare const convertToDash: (str: string) => string;
/** Convert a dash-separated string into camelCase strings (opposite of {@link convertToDash}) */
export declare const camelCase: (str: string) => string;
/**
 * Return a copy of the object without the keys specified in the keys argument
 *
 * @param keys - arrays of keys to remove from the object
 * @param obj - the object in question
 * @returns
 * a copy of the object without certain keys
 */
export declare const omit: (keys: string[], obj: {
    [key: string]: any;
}) => {
    [x: string]: any;
};
/**
 * Return a copy of the object with only the keys specified in the keys argument
 *
 * @param keys - arrays of keys to keep from the object
 * @param obj - the object in question
 * @returns
 * a copy of the object with only certain keys
 */
export declare const pick: (keys: string[], obj: {
    [key: string]: any;
}) => {};
/**
 * Flips the rows and columns of 2-dimensional arrays
 *
 * Read more on [underscorejs.org](https://underscorejs.org/#zip) & [lodash.com](https://lodash.com/docs/4.17.15#zip)
 *
 * @example
 * ```ts
 * transpose(
 *      ['moe', 'larry', 'curly'],
 *      [30, 40, 50],
 *      [true, false, false]
 * );
 * // [
 * //     ["moe", 30, true],
 * //     ["larry", 40, false],
 * //     ["curly", 50, false]
 * // ]
 * ```
 * @param [...args] - the arrays to process as a set of arguments
 * @returns
 * returns the new array of grouped elements
 */
export declare const transpose: (...args: (any | any[])[]) => any[];
