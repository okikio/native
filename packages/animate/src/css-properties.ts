import { camelCase, isValid, mapObject, omit, toArr, toStr, transpose } from "./utils";

import type { TypeSingleValueCSSProperty, ICSSComputedTransformableProperties } from "./types";

/**
 * Returns a closure Function, which adds a unit to numbers but simply returns strings with no edits assuming the value has a unit if it's a string
 *
 * @param unit - the default unit to give the CSS Value
 * @returns
 * if value already has a unit (we assume the value has a unit if it's a string), we return it;
 * else return the value plus the default unit
 */
export const addCSSUnit = (unit: string = "") => {
    return (value: string | number) => typeof value == "string" ? value : `${value}${unit}`;
}

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
export const CSSValue = (unit: typeof UnitLess) => {
    return (input: TypeSingleValueCSSProperty) => {
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
}

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
export const CSSArrValue = (arr: TypeSingleValueCSSProperty | TypeSingleValueCSSProperty[], unit: typeof UnitLess) => {
    // This is for the full varients of the transform function as well as the 3d varients
    // zipping the `CSSValue` means if a user enters a string, it will treat each value (seperated by a comma) in that
    // string as a seperate transition state
    return toArr(arr).map(CSSValue(unit)) as TypeSingleValueCSSProperty[];
}

/** Parses CSSValues without adding any units */
export const UnitLessCSSValue = CSSValue(UnitLess);

/** Parses CSSValues and adds the "px" unit if required */
export const UnitPXCSSValue = CSSValue(UnitPX);

/** Parses CSSValues and adds the "deg" unit if required */
export const UnitDEGCSSValue = CSSValue(UnitDEG);

/**
 * Removes dashes from CSS properties & maps the values to the camelCase keys
 */
export const ParseCSSProperties = (obj: object) => {
    let keys = Object.keys(obj);
    let key, value, result = {};
    for (let i = 0, len = keys.length; i < len; i++) {
        key = camelCase(keys[i]);
        value = obj[keys[i]];
        result[key] = value;
    }

    return result;
}

export interface ITransformFunctions {
    [key: string]: (value: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>) => TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>;
}

/**
 * Details how to compute each transform function
 */
export const TransformFunctions: ITransformFunctions = {
    "translate": value => CSSArrValue(value, UnitPX),
    "translate3d": value => CSSArrValue(value, UnitPX),
    "translateX": (value: TypeSingleValueCSSProperty) => UnitPXCSSValue(value),
    "translateY": (value: TypeSingleValueCSSProperty) => UnitPXCSSValue(value),
    "translateZ": (value: TypeSingleValueCSSProperty) => UnitPXCSSValue(value),

    "rotate": value => CSSArrValue(value, UnitDEG),
    "rotate3d": value => CSSArrValue(value, UnitLess),
    "rotateX": (value: TypeSingleValueCSSProperty) => UnitDEGCSSValue(value),
    "rotateY": (value: TypeSingleValueCSSProperty) => UnitDEGCSSValue(value),
    "rotateZ": (value: TypeSingleValueCSSProperty) => UnitDEGCSSValue(value),

    "scale": value => CSSArrValue(value, UnitLess),
    "scale3d": value => CSSArrValue(value, UnitLess),
    "scaleX": (value: TypeSingleValueCSSProperty) => UnitLessCSSValue(value),
    "scaleY": (value: TypeSingleValueCSSProperty) => UnitLessCSSValue(value),
    "scaleZ": (value: TypeSingleValueCSSProperty) => UnitLessCSSValue(value),

    "skew": value => CSSArrValue(value, UnitDEG),
    "skewX": (value: TypeSingleValueCSSProperty) => UnitDEGCSSValue(value),
    "skewY": (value: TypeSingleValueCSSProperty) => UnitDEGCSSValue(value),

    "perspective": (value: TypeSingleValueCSSProperty) => UnitPXCSSValue(value),
};

/**
 * Store all the supported transform functions as an Array
 */
export const TransformFunctionNames = Object.keys(TransformFunctions);

/**
 * Creates the transform property text
 */
export const createTransformProperty = (transformFnNames: string[], arr: any[]) => {
    let result = "";
    let len = transformFnNames.length;
    for (let i = 0; i < len; i++) {
        let name = transformFnNames[i];
        let value = arr[i];
        if (isValid(value))
            result += `${name}(${Array.isArray(value) ? value.join(", ") : value}) `;
    }

    return result.trim();
}

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
export const ParseTransformableCSSProperties = (properties: ICSSComputedTransformableProperties) => {
    // Convert dash seperated strings to camelCase strings
    let AllCSSProperties = ParseCSSProperties(properties) as ICSSComputedTransformableProperties;
    let rest = omit(TransformFunctionNames, AllCSSProperties);

    // Adds support for ordered transforms 
    let transformFunctionNames = Object.keys(AllCSSProperties)
        .filter(key => TransformFunctionNames.includes(key));
    
    let transformFunctionValues = transformFunctionNames
        .map((key) => TransformFunctions[key](AllCSSProperties[key]));

    // The transform string
    let transform = transpose(...transformFunctionValues)
        .filter(isValid)
        .map(arr => createTransformProperty(transformFunctionNames, arr));

    // Wrap non array CSS property values in an array
    rest = mapObject(rest, (value, key) => {
        let unit: typeof UnitDEGCSSValue | typeof UnitPXCSSValue;

        // If key doesn't have the word color in it, try to add the default "px" or "deg" to it
        if (!/color/i.test(key)) {
            let isAngle = /rotate/i.test(key);
            let isLength = new RegExp(CSSPXDataType, "i").test(key);

            // There is an intresting bug that occurs if you test a string againt the same instance of a Regular Expression
            // where the answer will be different every test
            // so, to avoid this bug, I create a new instance every time
            if (isAngle || isLength) {
                // If the key has rotate in it's name use "deg" as a default unit
                if (isAngle) unit = UnitDEGCSSValue;

                // If the key is for a common CSS Property name which has the units "px" as an acceptable value
                // try to add "px" as the default unit
                else if (isLength) unit = UnitPXCSSValue;

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

    return Object.assign({},
        isValid(transform) ? { transform } : null,
        rest);
}

/**
 * Similar to {@link ParseTransformableCSSProperties} except it transforms the CSS properties in each Keyframe
 * @param keyframes - an array of keyframes with transformable CSS properties
 * @returns
 * an array of keyframes, with transformed CSS properties
 */
export const ParseTransformableCSSKeyframes = (keyframes: ICSSComputedTransformableProperties[]) => {
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

            easing,
            iterations,
            offset,
            ...rest

            // Convert dash seperated strings to camelCase strings
        } = ParseCSSProperties(properties) as ICSSComputedTransformableProperties;

        translate = UnitPXCSSValue(translate as TypeSingleValueCSSProperty);
        translate3d = UnitPXCSSValue(translate3d as TypeSingleValueCSSProperty);
        translateX = UnitPXCSSValue(translateX)[0];
        translateY = UnitPXCSSValue(translateY)[0];
        translateZ = UnitPXCSSValue(translateZ)[0];

        rotate = UnitDEGCSSValue(rotate as TypeSingleValueCSSProperty);
        rotate3d = UnitLessCSSValue(rotate3d as TypeSingleValueCSSProperty);
        rotateX = UnitDEGCSSValue(rotateX)[0];
        rotateY = UnitDEGCSSValue(rotateY)[0];
        rotateZ = UnitDEGCSSValue(rotateZ)[0];

        scale = UnitLessCSSValue(scale as TypeSingleValueCSSProperty);
        scale3d = UnitLessCSSValue(scale3d as TypeSingleValueCSSProperty);
        scaleX = UnitLessCSSValue(scaleX)[0];
        scaleY = UnitLessCSSValue(scaleY)[0];
        scaleZ = UnitLessCSSValue(scaleZ)[0];

        skew = UnitDEGCSSValue(skew as TypeSingleValueCSSProperty);
        skewX = UnitDEGCSSValue(skewX)[0];
        skewY = UnitDEGCSSValue(skewY)[0];

        perspective = UnitPXCSSValue(perspective)[0];

        return [
            rest,
            translate, translate3d, translateX, translateY, translateZ,
            rotate, rotate3d, rotateX, rotateY, rotateZ,
            scale, scale3d, scaleX, scaleY, scaleZ,
            skew, skewX, skewY,
            perspective
        ];
    }).map(([rest, ...transformFunctions]) => {
        let transform = createTransformProperty(TransformFunctionNames, transformFunctions);
        rest = mapObject(rest as object, (value, key) => {
            let unit: typeof UnitDEGCSSValue | typeof UnitPXCSSValue;

            // If key doesn't have the word color in it, try to add the default "px" or "deg" to it
            if (!/color/i.test(key)) {
                let isAngle = /rotate/i.test(key);
                let isLength = new RegExp(CSSPXDataType, "i").test(key);

                // There is an intresting bug that occurs if you test a string againt the same instance of a Regular Expression
                // where the answer will be different every test
                // so, to avoid this bug, I create a new instance every time
                if (isAngle || isLength) {
                    // If the key has rotate in it's name use "deg" as a default unit
                    if (isAngle) unit = UnitDEGCSSValue;

                    // If the key is for a common CSS Property name which has the units "px" as an acceptable value
                    // try to add "px" as the default unit
                    else if (isLength) unit = UnitPXCSSValue;

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

        return Object.assign({},
            isValid(transform) ? { transform } : null,
            rest);
    });
}