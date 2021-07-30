import type { TypeSingleValueCSSProperty, ICSSComputedTransformableProperties, ICSSProperties } from "./types";
export interface ITransformFunctions {
    [key: string]: (value: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>) => TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>;
}
/**
 * Details how to compute each transform function
 */
export declare const TransformFunctions: ITransformFunctions;
/**
 * Store all the supported transform functions as an Array
 */
export declare const TransformFunctionNames: string[];
/**
 * Removes dashes from CSS properties & maps the values to camelCase keys
 */
export declare const CSSCamelCase: (obj: object) => {};
/**
 * Creates the transform property text
 */
export declare const createTransformProperty: (transformFnNames: string[], arr: any[]) => string;
/** Common CSS Property names with the units "px" as an acceptable value */
export declare const CSSPXDataType: string;
/**
 * It fills in the gap between different size transform functions, so, for example,
 * ```ts
 * {
 *      translateX: [50, 60, 80, 90],
 *      scale: [0.5, 2]
 * }
 * ```
 *
 * There are more values of `translateX`, so the `transform` property created will look like this,
 * ```ts
 * {
 *      transform: [
 *          "translateX(50px) scale(0.5)",
 *          "translateX(60px) scale(2)",
 *          "translateX(80px)",
 *          "translateX(90px)"
 *      ]
 * }
 * ```
 *
 * `arrFill` interpolates between all missing portions of transform functions, and helps create a uniform size transform property,
 * e.g.
 * ```ts
 * {
 *      transform: [
 *          "translateX(50px) scale(0.5)",
 *          "translateX(60px) scale(1)",
 *          "translateX(80px) scale(1.5)",
 *          "translateX(90px) scale(2)"
 *      ]
 * }
 * ```
 */
export declare const arrFill: (arr: any[] | any[][], maxLen?: number) => any;
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
 *          "25 35 60%",
 *          [50, "60px", 70],
 *          ["70", 50]
 *      ],
 *      translate: "25 35 60%",
 *      translateX: [50, "60px", "70"],
 *      translateY: ["50, 60", "60"], // Note: this will actually result in an error, make sure to pay attention to where you are putting commas
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
 *      "offset-rotate": "10 20",
 *      margin: 5,
 *
 *      // When writing in this formation you must specify the units
 *      padding: "5px 6px 7px"
 * })
 *
 * // On Chromium based browsers, e.g. Chrome, Edge, Brave, Opera, etc... or browsers that support `CSS.registerProperty` this will be the result
 * //= {
 * //=      "--translate3d0": [ "25px", "50px", "70px" ],
 * //=      "--translate3d1": [ "35px", "60px", "50px" ],
 * //=      "--translate3d2": [ "60%", "70px" ],
 * //=      "--translate0": [ "25px" ],
 * //=      "--translate1": [ "35px" ],
 * //=      "--translateX": [ "50px", "60px", "70px" ],
 * //=      "--translateY": [ "50,,60", "60px" ],
 * //=      "--translateZ": [ "0px" ],
 * //=      "--rotate3d0": [ "1deg", "2deg", "2deg" ],
 * //=      "--rotate3d1": [ "2deg", "4deg", "4deg" ],
 * //=      "--rotate3d2": [ "5deg", "6deg", "6deg" ],
 * //=      "--rotate3d3": [ "3deg", "45turn", "-1rad" ],
 * //=      "--scale0": [ "1", "2" ],
 * //=      "--scale1": [ "2", "1" ],
 * //=      "--perspective": [ "0px" ],
 * //=      "opacity": [ "0, 5" ],
 * //=      "borderLeft": [ "50px" ],
 * //=      "offsetRotate": [ "10deg", "20deg" ],
 * //=      "margin": [ "5px" ],
 * //=      "padding": [ "5px", "6px", "7px" ]
 * //= }
 *
 * // Browsers that don't support `CSS.registerProperty` will result in the following, namely Firefox and Safari
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
 *
 * // The key difference between the two is that the former will allow other animations to be used to
 * // manipulate multiple different transforms at the same time,
 * // while the latter will not, and must continously update the transform property,
 * // meaning that new animations will always override the previous ones on the same element,
 * // on browsers that *don't* support `CSS.registerProperty`
 * ```
 *
 * @returns
 * an object with a properly formatted `transform` and `opactity`, as well as other unformatted CSS properties
 * ```
 */
export declare const ParseTransformableCSSProperties: (properties: ICSSProperties) => ICSSProperties;
/**
 * Similar to {@link ParseTransformableCSSProperties} except it transforms the CSS properties in each Keyframe
 * @param keyframes - an array of keyframes with transformable CSS properties
 * @returns
 * an array of keyframes, with transformed CSS properties
 */
export declare const ParseTransformableCSSKeyframes: (keyframes: (ICSSComputedTransformableProperties & Keyframe)[]) => ({
    transform: string;
} & ({
    [x: string]: any;
} | {
    [x: string]: (TypeSingleValueCSSProperty | TypeSingleValueCSSProperty[]) & (string | number);
    composite?: CompositeOperationOrAuto;
    easing?: string;
    offset?: number;
}))[];
