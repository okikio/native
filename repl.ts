/**
 * Acts like array.map(...) but for functions
 */
export const mapObject = (obj, fn) => {
    let keys = Object.keys(obj);
    let key, value, result = {};
    for (let i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        value = obj[key];
        result[key] = fn(value, key, obj);
    }
    return result;
};

/** Converts values to strings */
export const toStr = (input) => `` + input;

/**
 * Convert the input to an array
 * For strings split them at commas
 * For array do nothing
 * For everything else wrap the input in an array
 */
export const toArr = (input) => {
    if (Array.isArray(input) || typeof input == "string") {
        if (typeof input == "string")
            input = input.split(",");
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
export const isValid = (value) => {
    if (Array.isArray(value) || typeof value == "string")
        return Boolean(value.length);
    return value != null && value != undefined && !Number.isNaN(value);
};

/** Convert a camelCase string to a dash-separated string (opposite of {@link camelCase}) */
export const convertToDash = (str) => {
    str = str.replace(/([A-Z])/g, letter => `-${letter.toLowerCase()}`);
    // Remove first dash
    return (str.charAt(0) == '-') ? str.substr(1) : str;
};

/** Convert a dash-separated string into camelCase strings (opposite of {@link convertToDash}) */
export const camelCase = (str) => {
    if (str.includes("--"))
        return str;
    let result = `${str}`.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
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
export const omit = (keys, obj) => {
    let arr = [...keys];
    let rest = Object.assign({}, obj);
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
export const pick = (keys, obj) => {
    let arr = [...keys];
    let rest = {};
    for (let key of arr) {
        if (isValid(obj[key]))
            rest[key] = obj[key];
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
// (TypeSingleValueCSSProperty | TypeSingleValueCSSProperty[])[]
export const transpose = (...args) => {
    let largestArrLen = 0;
    args = args.map(arr => {
        // Convert all values in arrays to an array
        // This ensures that `arrays` is an array of arrays
        let result = toArr(arr);
        // Finds the largest array
        let len = result.length;
        if (len > largestArrLen)
            largestArrLen = len;
        return result;
    });
    // Flip the rows and columns of arrays
    let result = [];
    let len = args.length;
    for (let col = 0; col < largestArrLen; col++) {
        result[col] = [];
        for (let row = 0; row < len; row++) {
            let val = args[row][col];
            if (isValid(val))
                result[col][row] = val;
        }
    }
    return result;
};

/**
 * Returns the unit of a string, it does this by removing the number in the string 
 */
export const getUnit = (str) => {
    let num = parseFloat(str );
    return toStr(str).replace(toStr(num), "");
}
export const limit = (value, min, max) => Math.min(Math.max(value, min), max);
/** map `t` from 0 to 1, to `start` to `end` */
export const scale = (t, start, end) => start + (end - start) * t;
/** Rounds numbers to a fixed decimal place */
export const toFixed = (value, decimal) => Math.round(value * 10 ** decimal) / 10 ** decimal;
/**
  Given an Array of numbers, estimate the resulting number, at a `t` value between 0 to 1
  Based on d3.interpolateBasis [https://github.com/d3/d3-interpolate#interpolateBasis],
  check out the link above for more detail.

  Basic interpolation works by scaling `t` from 0 - 1, to some start number and end number, in this case lets use
  0 as our start number and 100 as our end number, so, basic interpolation would interpolate between 0 to 100.

  If we use a `t` of 0.5, the interpolated value between 0 to 100, is 50.
  {@link interpolateNumber} takes it further, by allowing you to interpolate with more than 2 values,
  it allows for multiple values.

  E.g. Given an Array of values [0, 100, 0], and a `t` of 0.5, the interpolated value would become 100.
*/
export const interpolateNumber = (t, values, decimal = 3) => {
    // nth index
    let n = values.length - 1;
    // The current index given t
    let i = limit(Math.floor(t * n), 0, n - 1);
    let start = values[i];
    let end = values[i + 1];
    let progress = (t - i / n) * n;
    return toFixed(scale(progress, start, end), decimal);
};
/** If a value can be converted to a valid number, then it's most likely a number */
export const isNumberLike = (num) => {
    let value = parseFloat(num);
    return typeof value == "number" && !Number.isNaN(value);
};
/**
  Given an Array of values, find a value using `t` (`t` goes from 0 to 1), by
  using `t` to estimate the index of said value in the array of `values`
*/
export const interpolateUsingIndex = (t, values) => {
    // limit `t`, to a min of 0 and a max of 1
    t = limit(t, 0, 1);
    // nth index
    let n = values.length - 1;
    // The current index given t
    let i = Math.round(t * n);
    return values[i];
};


/** 
  Functions the same way {@link interpolateNumber} works.
  Convert strings to numbers, and then interpolates the numbers,
  at the end if there are units on the first value in the `values` array,
  it will use that unit for the interpolated result.

  Make sure to read {@link interpolateNumber}.
*/
export const interpolateString = (t, values, decimal = 3) => {
    let units = "";

    // If the first value looks like a number with a unit
    if (isNumberLike(values[0]))
        units = getUnit(values[0]);

    return interpolateNumber(t, values.map(parseFloat), decimal) + units;
};

/**
 * Returns a closure Function, which adds a unit to numbers but simply returns strings with no edits assuming the value has a unit if it's a string
 *
 * @param unit - the default unit to give the CSS Value
 * @returns
 * if value already has a unit (we assume the value has a unit if it's a string), we return it;
 * else return the value plus the default unit
 */
export const addCSSUnit = (unit = "") => {
    return (value) => typeof value == "string" ? value : `${value}${unit}`;
};
/** Function doesn't add any units by default */
export const UnitLess = addCSSUnit();
/** Function adds "px" unit to numbers */
export const UnitPX = addCSSUnit("px");
/** Function adds "deg" unit to numbers */
export const UnitDEG = addCSSUnit("deg");
/**
 * Returns a closure function, which adds units to numbers, strings or arrays of both
 *
 * @param unit - a unit function to use to add units to {@link TypeSingleValueCSSProperty | TypeSingleValueCSSProperty's }
 * @returns
 * if input is a string split it into an array at the comma's, and add units
 * else if the input is a number add the default units
 * otherwise if the input is an array of both add units according to {@link addCSSUnit}
 */
export const CSSValue = (unit) => {
    return (input) => {
        return isValid(input) ? toArr(input).map(val => {
            if (typeof val != "number" && typeof val != "string")
                return val;
            // Basically if you can convert it to a number try to,
            // otherwise just return whatever you can
            let num = Number(val);
            let value = Number.isNaN(num) ? (typeof val == "string" ? val.trim() : val) : num;
            return unit(value); // Add the default units
        }) : [];
    };
};
/**
 * Takes `TypeSingleValueCSSProperty` or an array of `TypeSingleValueCSSProperty` and adds units approriately
 *
 * @param arr - array of numbers, strings and/or an array of array of both e.g. ```[[25, "50px", "60%"], "25, 35, 60%", 50]```
 * @param unit - a unit function to use to add units to {@link TypeSingleValueCSSProperty | TypeSingleValueCSSProperty's }
 * @returns
 * an array of an array of strings with units
 * e.g.
 * ```ts
 * [
 *      [ '25px', '35px', ' 60%' ],
 *      [ '50px', '60px', '70px' ]
 * ]
 * ```
 */
export const CSSArrValue = (arr, unit) => {
    // This is for the full varients of the transform function as well as the 3d varients
    // zipping the `CSSValue` means if a user enters a string, it will treat each value (seperated by a comma) in that
    // string as a seperate transition state
    return toArr(arr).map(CSSValue(unit));
};
/** Parses CSSValues without adding any units */
export const UnitLessCSSValue = CSSValue(UnitLess);
/** Parses CSSValues and adds the "px" unit if required */
export const UnitPXCSSValue = CSSValue(UnitPX);
/** Parses CSSValues and adds the "deg" unit if required */
export const UnitDEGCSSValue = CSSValue(UnitDEG);
/**
 * Removes dashes from CSS properties & maps the values to the camelCase keys
 */
export const ParseCSSProperties = (obj) => {
    let keys = Object.keys(obj);
    let key, value, result = {};
    for (let i = 0, len = keys.length; i < len; i++) {
        key = camelCase(keys[i]);
        value = obj[keys[i]];
        result[key] = value;
    }
    return result;
};
/**
 * Details how to compute each transform function
 */
export const TransformFunctions = {
    "translate": value => CSSArrValue(value, UnitPX),
    "translate3d": value => CSSArrValue(value, UnitPX),
    "translateX": (value) => UnitPXCSSValue(value),
    "translateY": (value) => UnitPXCSSValue(value),
    "translateZ": (value) => UnitPXCSSValue(value),
    "rotate": value => CSSArrValue(value, UnitDEG),
    "rotate3d": value => CSSArrValue(value, UnitLess),
    "rotateX": (value) => UnitDEGCSSValue(value),
    "rotateY": (value) => UnitDEGCSSValue(value),
    "rotateZ": (value) => UnitDEGCSSValue(value),
    "scale": value => CSSArrValue(value, UnitLess),
    "scale3d": value => CSSArrValue(value, UnitLess),
    "scaleX": (value) => UnitLessCSSValue(value),
    "scaleY": (value) => UnitLessCSSValue(value),
    "scaleZ": (value) => UnitLessCSSValue(value),
    "skew": value => CSSArrValue(value, UnitDEG),
    "skewX": (value) => UnitDEGCSSValue(value),
    "skewY": (value) => UnitDEGCSSValue(value),
    "perspective": (value) => UnitPXCSSValue(value),
    "matrix": value => CSSArrValue(value, UnitLess),
    "matrix3d": value => CSSArrValue(value, UnitLess),
};
/**
 * Store all the supported transform functions as an Array
 */
export const TransformFunctionNames = Object.keys(TransformFunctions);
/**
 * Creates the transform property text
 */
export const createTransformProperty = (transformFnNames, arr) => {
    let result = "";
    let len = transformFnNames.length;
    for (let i = 0; i < len; i++) {
        let name = transformFnNames[i];
        let value = arr[i];
        if (isValid(value))
            result += `${name}(${Array.isArray(value) ? value.join(", ") : value}) `;
    }
    return result.trim();
};
/** Common CSS Property names with the units "px" as an acceptable value */
export const CSSPXDataType = ["margin", "padding", "size", "width", "height", "left", "right", "top", "bottom", "radius", "gap", "basis", "inset", "outline-offset", "perspective", "thickness", "position", "distance", "spacing"].map(camelCase).join("|");
/**
 * Removes the need for the full transform statement in order to use translate, rotate, scale, skew, or perspective including their X, Y, Z, and 3d varients
 * Also, adds the ability to use single string or number values for transform functions
 *
 * _**Note**: the `transform` animation option will override all transform function properties_
 *
 * _**Note**: the order of where/when you define transform function matters, for example, depending on the order you define `translate`, and `rotate`, you can create change the radius of the rotation_
 *
 * @param properties - the CSS properties to transform
 *
 * @example
 * ```ts
 * ParseTransformableCSSProperties({
 *      // It will automatically add the "px" units for you, or you can write a string with the units you want
 *      translate3d: [
 *          "25, 35, 60%",
 *          [50, "60px", 70],
 *          ["70", 50]
 *      ],
 *      translate: "25, 35, 60%",
 *      translateX: [50, "60px", "70"],
 *      translateY: ["50, 60", "60"], // Note: this will actually result in an error, make sure to pay attention to where you are putting strings and commas
 *      translateZ: 0,
 *      perspective: 0,
 *      opacity: "0, 5",
 *      scale: [
 *          [1, "2"],
 *          ["2", 1]
 *      ],
 *      rotate3d: [
 *          [1, 2, 5, "3deg"], // The last value in the array must be a string with units for rotate3d
 *          [2, "4", 6, "45turn"],
 *          ["2", "4", "6", "-1rad"]
 *      ],
 *
 *      // Units are required for non transform CSS properties
 *      // String won't be split into array, they will be wrappeed in an Array
 *      // It will transform border-left to camelCase "borderLeft"
 *      "border-left": 50,
 *      "offset-rotate": "10, 20",
 *      margin: 5,
 *
 *      // When writing in this formation you must specify the units
 *      padding: "5px 6px 7px"
 * })
 *
 * //= {
 * //=   transform: [
 * //=       // `translateY(50, 60)` will actually result in an error
 * //=       'translate(25px) translate3d(25px, 35px, 60%) translateX(50px) translateY(50, 60) translateZ(0px) rotate3d(1, 2, 5, 3deg) scale(1, 2) perspective(0px)',
 * //=       'translate(35px) translate3d(50px, 60px, 70px) translateX(60px) translateY(60px) rotate3d(2, 4, 6, 45turn) scale(2, 1)',
 * //=       'translate(60%) translate3d(70px, 50px) translateX(70px) rotate3d(2, 4, 6, -1rad)'
 * //=   ],
 * //=   opacity: [ '0', '5' ],
 * //=   borderLeft: ["50px"],
 * //=
 * //=   // Notice the "deg"
 * //=   offsetRotate: ["10deg", "20deg"],
 * //=   margin: ["5px"],
 * //=   padding: ["5px 6px 7px"]
 * //= }
 * ```
 *
 * @returns
 * an object with a properly formatted `transform` and `opactity`, as well as other unformatted CSS properties
 * ```
 */
export const ParseTransformableCSSProperties = (properties) => {
    // Convert dash seperated strings to camelCase strings
    let AllCSSProperties = ParseCSSProperties(properties);
    let rest = omit(TransformFunctionNames, AllCSSProperties);
    // Adds support for ordered transforms 
    let transformFunctionNames = Object.keys(AllCSSProperties)
        .filter(key => TransformFunctionNames.includes(key));
    let transformFunctionValues = transformFunctionNames
        .map((key) => TransformFunctions[key](AllCSSProperties[key]));
    let maxLen = Math.max(...transformFunctionValues.map(value => value.length));
    transformFunctionValues = transformFunctionValues.map(v => {
        let len = v.length;
        return len !== maxLen ? Array.from(Array(maxLen), (_, i) => {
            return interpolateUsingIndex(i / len, v);
        }) : v;
    });
    transformFunctionValues.map((v, i) => console.log(`${transformFunctionNames[i]}`, v))
    // The transform string
    let transform = transpose(...transformFunctionValues)
        .filter(isValid);
        transform=transform.map(arr => createTransformProperty(transformFunctionNames, arr));
    // Wrap non array CSS property values in an array
    rest = mapObject(rest, (value, key) => {
        let unit;
        // If key doesn't have the word color in it, try to add the default "px" or "deg" to it
        if (!/color/i.test(key)) {
            let isAngle = /rotate/i.test(key);
            let isLength = new RegExp(CSSPXDataType, "i").test(key);
            // There is an intresting bug that occurs if you test a string againt the same instance of a Regular Expression
            // where the answer will be different every test
            // so, to avoid this bug, I create a new instance every time
            if (isAngle || isLength) {
                // If the key has rotate in it's name use "deg" as a default unit
                if (isAngle)
                    unit = UnitDEGCSSValue;
                // If the key is for a common CSS Property name which has the units "px" as an acceptable value
                // try to add "px" as the default unit
                else if (isLength)
                    unit = UnitPXCSSValue;
                // Note: we first apply units, to make sure if it's a simple number, then units are added
                // but otherwise, if it's "margin", "padding", "inset", etc.. with values like "55 60 70 5em"
                // it can easily include the units required
                return unit(value).map(str => {
                    // To support multi-value CSS properties like "margin", "padding", and "inset"
                    // split the value into an array using spaces as the seperator
                    // then apply the valid default units and join them back with spaces
                    // seperating them
                    let arr = str.trim().split(" ");
                    return unit(arr).join(" ");
                });
            }
        }
        return [].concat(value).map(toStr);
    });
    return Object.assign({}, isValid(transform) ? { transform } : null, rest);
};
/**
 * Similar to {@link ParseTransformableCSSProperties} except it transforms the CSS properties in each Keyframe
 * @param keyframes - an array of keyframes with transformable CSS properties
 * @returns
 * an array of keyframes, with transformed CSS properties
 */
export const ParseTransformableCSSKeyframes = (keyframes) => {
    return keyframes.map(properties => {
        let {
            translate,
            translate3d,
            translateX,
            translateY,
            translateZ,
            rotate,
            rotate3d,
            rotateX,
            rotateY,
            rotateZ,
            scale,
            scale3d,
            scaleX,
            scaleY,
            scaleZ,
            skew,
            skewX,
            skewY,
            perspective,
            matrix,
            matrix3d,

            easing,
            iterations,
            offset,
            ...rest

            // Convert dash seperated strings to camelCase strings
        } = ParseCSSProperties(properties) as any;

        translate = UnitPXCSSValue(translate);
        translate3d = UnitPXCSSValue(translate3d);
        translateX = UnitPXCSSValue(translateX)[0];
        translateY = UnitPXCSSValue(translateY)[0];
        translateZ = UnitPXCSSValue(translateZ)[0];
        rotate = UnitDEGCSSValue(rotate);
        rotate3d = UnitLessCSSValue(rotate3d);
        rotateX = UnitDEGCSSValue(rotateX)[0];
        rotateY = UnitDEGCSSValue(rotateY)[0];
        rotateZ = UnitDEGCSSValue(rotateZ)[0];
        scale = UnitLessCSSValue(scale);
        scale3d = UnitLessCSSValue(scale3d);
        scaleX = UnitLessCSSValue(scaleX)[0];
        scaleY = UnitLessCSSValue(scaleY)[0];
        scaleZ = UnitLessCSSValue(scaleZ)[0];
        skew = UnitDEGCSSValue(skew);
        skewX = UnitDEGCSSValue(skewX)[0];
        skewY = UnitDEGCSSValue(skewY)[0];
        perspective = UnitPXCSSValue(perspective)[0];
        matrix = UnitLessCSSValue(matrix);
        matrix3d = UnitLessCSSValue(matrix3d);
        return [
            rest,
            translate, translate3d, translateX, translateY, translateZ,
            rotate, rotate3d, rotateX, rotateY, rotateZ,
            scale, scale3d, scaleX, scaleY, scaleZ,
            skew, skewX, skewY,
            perspective, matrix, matrix3d
        ];
    }).map(([rest, ...transformFunctions]) => {
        let transform = createTransformProperty(TransformFunctionNames, transformFunctions);
        rest = mapObject(rest, (value, key) => {
            let unit;
            // If key doesn't have the word color in it, try to add the default "px" or "deg" to it
            if (!/color/i.test(key)) {
                let isAngle = /rotate/i.test(key);
                let isLength = new RegExp(CSSPXDataType, "i").test(key);
                // There is an intresting bug that occurs if you test a string againt the same instance of a Regular Expression
                // where the answer will be different every test
                // so, to avoid this bug, I create a new instance every time
                if (isAngle || isLength) {
                    // If the key has rotate in it's name use "deg" as a default unit
                    if (isAngle)
                        unit = UnitDEGCSSValue;
                    // If the key is for a common CSS Property name which has the units "px" as an acceptable value
                    // try to add "px" as the default unit
                    else if (isLength)
                        unit = UnitPXCSSValue;
                    // To support multi-value CSS properties like "margin", "padding", and "inset"
                    // with values like "55 60 70 5em", split the value into an array using spaces as the seperator
                    // then apply the valid default units and join them back with spaces
                    // seperating them
                    let arr = toStr(value).trim().split(" ");
                    return unit(arr).join(" ");
                }
            }
            return toStr(value);
        });
        return Object.assign({}, isValid(transform) ? { transform } : null, rest);
    });
};

// ParseTransformableCSSProperties({
//     // It will automatically add the "px" units for you, or you can write a string with the units you want
//     translate3d: [
//         "25, 35, 60%",
//         [50, "60px", 70],
//         ["70", 50]
//     ],
//     translate: "25, 35, 60%",
//     translateX: [50, "60px", "70"],
//     translateY: ["50, 60", "60"], // Note: this will actually result in an error, make sure to pay attention to where you are putting strings and commas
//     translateZ: 0,
//     perspective: 0,
//     opacity: "0, 5",
//     scale: [
//         [1, "2"],
//         ["2", 1]
//     ],
//     rotate3d: [
//         [1, 2, 5, "3deg"], // The last value in the array must be a string with units for rotate3d
//         [2, "4", 6, "45turn"],
//         ["2", "4", "6", "-1rad"]
//     ],
//     // Units are required for non transform CSS properties
//     // String won't be split into array, they will be wrappeed in an Array
//     // It will transform border-left to camelCase "borderLeft"
//     "border-left": 50,
//     "offset-rotate": "10, 20",
//     margin: 5,
//     // When writing in this formation you must specify the units
//     padding: "5px 6px 7px"
// })

// console.log(transpose(...transpose(
//     [50, 60, 70],
//     [80, 90, 100]
// )))
export const arrFill = (arr, maxLen?) => {
    // Ensure all transform function Arrays are the same length to create smooth motion
    maxLen = maxLen ?? Math.max(...arr.map(value => value.length));
    return arr.map(value => {
        let len = value.length;
        let isComplexTransform = value.every(v => Array.isArray(v));

        if (!isComplexTransform) {
            if (len !== maxLen) {
                return Array.from(Array(maxLen), (_, i) => {
                    return interpolateString(i / (maxLen - 1), value); 
                });
            } else return value;
        } else {
            return transpose(...arrFill(transpose(...value), maxLen));
        }
    });
}

let x = arrFill([
    [50, 60, 80, 90],
    [0.5, 2]
]);
console.log(x)