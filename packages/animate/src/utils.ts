/** Merges 2-dimensional Arrays into a single 1-dimensional array */
export const flatten = (arr: any[]) => [].concat(...arr);

/** Determines whether value is an pure object (not array, not function, etc...) */
export const isObject = (obj: any) =>
    typeof obj == "object" && !Array.isArray(obj) && typeof obj != "function";

/** Determines if an object is empty */
export const isEmpty = (obj: any) => {
    for (let _ in obj) {
        return false;
    }
    
    return true;
};

/**
 * Acts like array.map(...) but for functions
 */
export const mapObject = (
    obj: object,
    fn: (value: any, key: any, obj: any) => any
) => {
    let keys = Object.keys(obj);
    let key: any,
        value: any,
        result = {};
    for (let i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        value = obj[key];
        result[key] = fn(value, key, obj);
    }

    return result;
};

/** Converts values to strings */
export const toStr = (input: any) => `` + input;

/**
 * Returns the unit of a string, it does this by removing the number in the string
 */
export const getUnit = (str: string | number) => {
    let num = parseFloat(str as string);
    return toStr(str).replace(toStr(num), "");
};

/** 
  Convert value to string, then trim any extra white space and line terminator characters from the string. 
*/
export const trim = (str: string) => toStr(str).trim();

/**
 * Convert the input to an array
 * For strings if type == "split", split the string at spaces, if type == "wrap" wrap the string in an array
 * For array do nothing
 * For everything else wrap the input in an array
 */
export const toArr = (input: any): any[] => {
    if (Array.isArray(input) || typeof input == "string") {
        if (typeof input == "string") input = input.split(/\s+/);
        return input;
    }

    return [input];
};

/**
 * Checks if a value is valid/truthy; it counts empty arrays and strings as falsey,
 * as well as null, undefined, and NaN, everything else is valid
 *
 * _**Note:** 0 counts as valid_
 *
 * @param value - anything
 * @returns true or false
 */
export const isValid = (value: any) => {
    if (Array.isArray(value) || typeof value == "string")
        return Boolean(value.length);
    return value != null && value != undefined && !Number.isNaN(value);
};

/** Convert a camelCase string to a dash-separated string (opposite of {@link camelCase}) */
export const convertToDash = (str: string) => {
    str = str.replace(/([A-Z])/g, (letter) => `-${letter.toLowerCase()}`);

    // Remove first dash
    return str.charAt(0) == "-" ? str.substr(1) : str;
};

/** Convert a dash-separated string into camelCase strings (opposite of {@link convertToDash}) */
export const camelCase = (str: string) => {
    if (str.includes("--")) return str;
    let result = `${str}`.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase()
    );
    return result;
};

/**
 * Return a copy of the object without the keys specified in the keys argument
 *
 * @param keys - arrays of keys to remove from the object
 * @param obj - the object in question
 * @returns
 * a copy of the object without certain keys
 */
export const omit = (keys: string[], obj: { [key: string]: any }) => {
    let arr = [...keys];
    let rest = { ...obj };
    while (arr.length) {
        let { [arr.pop()]: omitted, ...remaining } = rest;
        rest = remaining;
    }
    return rest;
};

/**
 * Return a copy of the object with only the keys specified in the keys argument
 *
 * @param keys - arrays of keys to keep from the object
 * @param obj - the object in question
 * @returns
 * a copy of the object with only certain keys
 */
export const pick = (keys: string[], obj: { [key: string]: any }) => {
    let arr = [...keys];
    let rest = {};

    for (let key of arr) {
        if (isValid(obj[key])) rest[key] = obj[key];
    }

    return rest;
};

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
// (TypeCSSGenericPropertyKeyframes | TypeCSSGenericPropertyKeyframes[])[]
export const transpose = (...args: (any | any[])[]) => {
    let largestArrLen = 0;
    args = args.map((arr) => {
        // Convert all values in arrays to an array
        // This ensures that `arrays` is an array of arrays
        let result = toArr(arr);

        // Finds the largest array
        let len = result.length;
        if (len > largestArrLen) largestArrLen = len;
        return result;
    });

    // Flip the rows and columns of arrays
    let result = [];
    let len = args.length;
    for (let col = 0; col < largestArrLen; col++) {
        result[col] = [];

        for (let row = 0; row < len; row++) {
            let val = args[row][col];
            if (isValid(val)) result[col][row] = val;
        }
    }

    return result;
};
