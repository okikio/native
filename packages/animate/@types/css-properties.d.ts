import { TypeSingleValueCSSProperty, ICSSComputedTransformableProperties } from "./types";
/**
 * Returns a closure Function, which adds a unit to numbers but simply returns strings with no edits assuming the value has a unit if it's a string
 *
 * @param unit - the default unit to give the CSS Value
 * @returns
 * if value already has a unit (we assume the value has a unit if it's a string), we return it;
 * else return the value plus the default unit
 */
export declare const addCSSUnit: (unit?: string) => (value: string | number) => string;
/** Function doesn't add any units by default */
export declare const UnitLess: (value: string | number) => string;
/** Function adds "px" unit to numbers */
export declare const UnitPX: (value: string | number) => string;
/** Function adds "deg" unit to numbers */
export declare const UnitDEG: (value: string | number) => string;
/**
 * Convert the input to an array
 * For strings split them at commas
 * For array do nothing
 * For everything else wrap the input in an array
 */
export declare const toArr: (input: any) => any[];
/**
 * Checks if value is valid/truthy; it counts empty arrays and strings as falsey,
 * as well as null and undefined everything else is valid
 *
 * _**Note:** 0 counts as valid_
 *
 * @param value - anything
 * @returns true or false
 */
export declare const isValid: (value: any) => boolean;
/**
 * Returns a closure function, which adds units to numbers, strings or arrays of both
 *
 * @param unit - a unit function to use to add units to {@link TypeSingleValueCSSProperty | TypeSingleValueCSSProperty's }
 * @returns
 * if input is a string split it into an array at the comma's, and add units
 * else if the input is a number add the default units
 * otherwise if the input is an array of both add units according to {@link addCSSUnit}
 */
export declare const CSSValue: (unit: typeof UnitLess) => (input: TypeSingleValueCSSProperty) => any[];
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
export declare const transpose: (...args: TypeSingleValueCSSProperty[] | TypeSingleValueCSSProperty[][]) => any[];
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
export declare const CSSArrValue: (arr: TypeSingleValueCSSProperty | TypeSingleValueCSSProperty[], unit: typeof UnitLess) => TypeSingleValueCSSProperty[];
export declare const TransformFunctionNames: string[];
/**
 * Creates the transform property text
 */
export declare const createTransformProperty: (arr: any) => string;
/** Parses CSSValues without adding any units */
export declare const UnitLessCSSValue: (input: TypeSingleValueCSSProperty) => any[];
/** Parses CSSValues and adds the "px" unit if required */
export declare const UnitPXCSSValue: (input: TypeSingleValueCSSProperty) => any[];
/** Parses CSSValues and adds the "deg" unit if required */
export declare const UnitDEGCSSValue: (input: TypeSingleValueCSSProperty) => any[];
/**
 * Removes the need for the full transform statement in order to use translate, rotate, scale, skew, or perspective including their X, Y, Z, and 3d varients
 * Also, adds the ability to use single string or number values for transform functions
 *
 * _**Note**: the `transform` animation option will override all transform function properties_
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
 *      ]
 * })
 *
 * //= {
 * //=   transform: [
 * //=       // `translateY(50, 60)` will actually result in an error
 * //=       'translate(25px) translate3d(25px, 35px, 60%) translateX(50px) translateY(50, 60) translateZ(0px) rotate3d(1, 2, 5, 3deg) scale(1, 2) perspective(0px)',
 * //=       'translate(35px) translate3d(50px, 60px, 70px) translateX(60px) translateY(60px) rotate3d(2, 4, 6, 45turn) scale(2, 1)',
 * //=       'translate(60%) translate3d(70px, 50px) translateX(70px) rotate3d(2, 4, 6, -1rad)'
 * //=   ],
 * //=   opacity: [ '0', '5' ]
 * //= }
 * ```
 *
 * @returns
 * an object with a properly formatted `transform` and `opactity`, as well as other unformatted CSS properties
 * ```
 */
export declare const ParseTransformableCSSProperties: (properties: ICSSComputedTransformableProperties) => {
    transform: string[];
} & {
    [key: string]: TypeSingleValueCSSProperty | TypeSingleValueCSSProperty[];
};
/**
 * Similar to {@link ParseTransformableCSSProperties} except it transforms the CSS properties in each Keyframe
 * @param keyframes - an array of keyframes with transformable CSS properties
 * @returns
 * an array of keyframes, with transformed CSS properties
 */
export declare const ParseTransformableCSSKeyframes: (keyframes: ICSSComputedTransformableProperties[]) => ({
    transform: string;
} & (string | number | TypeSingleValueCSSProperty[] | {
    [key: string]: TypeSingleValueCSSProperty | TypeSingleValueCSSProperty[];
}))[];
