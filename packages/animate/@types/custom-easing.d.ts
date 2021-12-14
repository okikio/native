import type { IAnimateInstanceConfig } from "./types";
export declare const limit: (value: number, min: number, max: number) => number;
/**
 * The format to use when defining custom easing functions
 */
export declare type TypeEasingFunction = (t: number, params?: (string | number)[], duration?: number) => number;
/**
  Easing Functions from anime.js, they are tried and true, so, its better to use them instead of other alternatives
*/
export declare const Quad: TypeEasingFunction;
export declare const Cubic: TypeEasingFunction;
export declare const Quart: TypeEasingFunction;
export declare const Quint: TypeEasingFunction;
export declare const Expo: TypeEasingFunction;
export declare const Sine: TypeEasingFunction;
export declare const Circ: TypeEasingFunction;
export declare const Back: TypeEasingFunction;
export declare const Bounce: TypeEasingFunction;
export declare const Elastic: TypeEasingFunction;
export declare const Spring: TypeEasingFunction;
/**
 * Cache the durations at set easing parameters
 */
export declare const EasingDurationCache: Map<string | TypeEasingFunction, number>;
/**
 * The threshold for an infinite loop
 */
export declare const INTINITE_LOOP_LIMIT = 10000;
/**
 * The spring easing function will only look smooth at certain durations, with certain parameters.
 * This functions returns the optimal duration to create a smooth springy animation based on physics
 *
 * Note: it can also be used to determine the optimal duration of other types of easing function, but be careful of "in-"
 * easing functions, because of the nature of the function it can sometimes create an infinite loop, I suggest only using
 * `getEasingDuration` for `spring`, specifically "out-spring" and "spring"
 */
export declare const getEasingDuration: (easing?: string | TypeEasingFunction) => number;
/**
  These Easing Functions are based off of the Sozi Project's easing functions
  https://github.com/sozi-projects/Sozi/blob/d72e44ebd580dc7579d1e177406ad41e632f961d/src/js/player/Timing.js
*/
export declare const Steps: TypeEasingFunction;
export declare const Bezier: TypeEasingFunction;
/** The default `ease-in` easing function */
export declare const easein: TypeEasingFunction;
/** Converts easing functions to their `out`counter parts */
export declare const EaseOut: (ease: TypeEasingFunction) => TypeEasingFunction;
/** Converts easing functions to their `in-out` counter parts */
export declare const EaseInOut: (ease: TypeEasingFunction) => TypeEasingFunction;
/** Converts easing functions to their `out-in` counter parts */
export declare const EaseOutIn: (ease: TypeEasingFunction) => TypeEasingFunction;
/**
 * The default list of easing functions,
 *
 * _**Note**_: this is different from {@link EASING}
 */
export declare const EasingFunctions: {
    [key: string]: TypeEasingFunction;
};
export declare let EasingFunctionKeys: string[];
/**
 * Allows you to register new easing functions
 */
export declare const registerEasingFunction: (key: string, fn: TypeEasingFunction) => void;
/**
 * Allows you to register multiple new easing functions
 */
export declare const registerEasingFunctions: (...obj: Array<typeof EasingFunctions>) => void;
/**
 * Convert string easing to their proper form
 */
export declare const ComplexEasingSyntax: (ease: string) => string;
/** Re-maps a number from one range to another. Numbers outside the range are not clamped to 0 and 1, because out-of-range values are often intentional and useful. */
export declare const GetEasingFunction: (ease: string) => TypeEasingFunction;
/** Convert easing parameters to Array of numbers, e.g. "spring(2, 500)" to [2, 500] */
export declare const parseEasingParameters: (str: string) => (string | number)[];
/** map `t` from 0 to 1, to `start` to `end` */
export declare const scale: (t: number, start: number, end: number) => number;
/** Rounds numbers to a fixed decimal place */
export declare const toFixed: (value: number, decimal: number) => number;
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
export declare const interpolateNumber: (t: number, values: number[], decimal?: number) => number;
/** If a value can be converted to a valid number, then it's most likely a number */
export declare const isNumberLike: (num: string | number) => boolean;
/**
  Given an Array of values, find a value using `t` (`t` goes from 0 to 1), by
  using `t` to estimate the index of said value in the array of `values`
*/
export declare const interpolateUsingIndex: (t: number, values: (string | number)[]) => string | number;
/**
  Functions the same way {@link interpolateNumber} works.
  Convert strings to numbers, and then interpolates the numbers,
  at the end if there are units on the first value in the `values` array,
  it will use that unit for the interpolated result.

  Make sure to read {@link interpolateNumber}.
*/
export declare const interpolateString: (t: number, values: (string | number)[], decimal?: number) => string;
/**
  Use the `color-rgba` npm package, to convert all color formats to an Array of rgba values,
  e.g. `[red, green, blue, alpha]`. Then, use the {@link interpolateNumber} functions to interpolate over the array
  
  _**Note**: the red, green, and blue colors are rounded to intergers with no decimal places,
  while the alpha color gets rounded to a specific decimal place_

  Make sure to read {@link interpolateNumber}.
*/
export declare const interpolateColor: (t: number, values: string[], decimal?: number) => number[];
/**
  Converts "10px solid red #555   rgba(255, 0,5,6, 7)  "
  to [ '10px', 'solid', 'red', '#555', 'rgba(255, 0,5,6, 7)' ]
*/
export declare const ComplexStrtoArr: (str: string) => string[];
/**
  Interpolates all types of values including number, string, color, and complex values.
  Complex values are values like "10px solid red", that border, and other CSS Properties use.

  Make sure to read {@link interpolateNumber}, {@link interpolateString}, {@link interpolateColor}, and {@link interpolateUsingIndex}.
*/
export declare const interpolateComplex: (t: number, values: (string | number)[], decimal?: number) => any;
/**
 * Custom Easing has 3 properties they are `easing` (all the easings from [#easing](#easing) are supported on top of custom easing functions, like spring, bounce, etc...), `numPoints` (the size of the Array the Custom Easing function should create), and `decimal` (the number of decimal places of the values within said Array).
 *
 * | Properties  | Default Value           |
 * | ----------- | ----------------------- |
 * | `easing`    | `spring(1, 100, 10, 0)` |
 * | `numPoints` | `50`                    |
 * | `decimal`   | `3`                     |
 */
export declare type TypeCustomEasingOptions = {
    /**
     *
     * By default, Custom Easing support easing functions, in the form,
     *
     * | constant   | accelerate         | decelerate     | accelerate-decelerate | decelerate-accelerate |
     * | :--------- | :----------------- | :------------- | :-------------------- | :-------------------- |
     * | linear     | ease-in / in       | ease-out / out | ease-in-out / in-out  | ease-out-in / out-in  |
     * | ease       | in-sine            | out-sine       | in-out-sine           | out-in-sine           |
     * | steps      | in-quad            | out-quad       | in-out-quad           | out-in-quad           |
     * | step-start | in-cubic           | out-cubic      | in-out-cubic          | out-in-cubic          |
     * | step-end   | in-quart           | out-quart      | in-out-quart          | out-in-quart          |
     * |            | in-quint           | out-quint      | in-out-quint          | out-in-quint          |
     * |            | in-expo            | out-expo       | in-out-expo           | out-in-expo           |
     * |            | in-circ            | out-circ       | in-out-circ           | out-in-circ           |
     * |            | in-back            | out-back       | in-out-back           | out-in-back           |
     * |            | in-bounce          | out-bounce     | in-out-bounce         | out-in-bounce         |
     * |            | in-elastic         | out-elastic    | in-out-elastic        | out-in-elastic        |
     * |            | spring / spring-in | spring-out     | spring-in-out         | spring-out-in         |
     *
     * All **Elastic** easing's can be configured using theses parameters,
     *
     * `*-elastic(amplitude, period)`
     *
     * Each parameter comes with these defaults
     *
     * | Parameter | Default Value |
     * | --------- | ------------- |
     * | amplitude | `1`           |
     * | period    | `0.5`         |
     *
     * ***
     *
     * All **Spring** easing's can be configured using theses parameters,
     *
     * `spring-*(mass, stiffness, damping, velocity)`
     *
     * Each parameter comes with these defaults
     *
     * | Parameter | Default Value |
     * | --------- | ------------- |
     * | mass      | `1`           |
     * | stiffness | `100`         |
     * | damping   | `10`          |
     * | velocity  | `0`           |
     *
     * You can create your own custom cubic-bezier easing curves. Similar to css you type `cubic-bezier(...)` with 4 numbers representing the shape of the bezier curve, for example,  `cubic-bezier(0.47, 0, 0.745, 0.715)` this is the bezier curve for `in-sine`.
     *
     * _**Note**: the `easing` property supports the original values and functions for easing as well, for example, `steps(1)`, and etc... are supported._
     *
     * _**Note**: you can also use camelCase when defining easing functions, e.g. `inOutCubic` to represent `in-out-cubic`_
     *
     */
    easing?: string | TypeEasingFunction;
    numPoints?: number;
    decimal?: number;
    duration?: number;
};
/**
 * returns a CustomEasingOptions object from a easing "string", or function
 */
export declare const CustomEasingOptions: (options?: TypeCustomEasingOptions | string | TypeEasingFunction) => {
    easing: string | TypeEasingFunction;
    numPoints: number;
    decimal: number;
    duration: number;
};
/**
  Cache calculated tween points for commonly used easing functions
*/
export declare const TweenCache: Map<any, any>;
/**
  * Create an Array of tween points using easing functions.
  * The array is `numPoints` large, which is by default 50.
  * Easing function can be custom defined, so, instead of string you can use functions,
  * e.g.
  * ```ts
  * tweenPts({
  *     easing: t =>  t,
  *     numPoints: 50
  * })
  * ```
  
  Based on https://github.com/w3c/csswg-drafts/issues/229#issuecomment-861415901
*/
export declare const EasingPts: ({ easing, numPoints, duration, }?: TypeCustomEasingOptions) => number[];
/**
 * Generates an Array of values using easing functions which in turn create the effect of custom easing.
 * To use this properly make sure to set the easing animation option to "linear".
 * Check out a demo of CustomEasing at <https://codepen.io/okikio/pen/abJMWNy?editors=0010>
 *
 * Custom Easing has 3 properties they are `easing` (all the easings from {@link EasingFunctions} are supported on top of custom easing functions like spring, bounce, etc...), `numPoints` (the size of the Array the Custom Easing function should create), and `decimal` (the number of decimal places of the values within said Array).
 *
 * | Properties  | Default Value           |
 * | ----------- | ----------------------- |
 * | `easing`    | `spring(1, 100, 10, 0)` |
 * | `numPoints` | `50`                    |
 * | `decimal`   | `3`                     |
 *
 * By default, Custom Easing support easing functions, in the form,
 *
 * | constant   | accelerate         | decelerate     | accelerate-decelerate | decelerate-accelerate |
 * | :--------- | :----------------- | :------------- | :-------------------- | :-------------------- |
 * | linear     | ease-in / in       | ease-out / out | ease-in-out / in-out  | ease-out-in / out-in  |
 * | ease       | in-sine            | out-sine       | in-out-sine           | out-in-sine           |
 * | steps      | in-quad            | out-quad       | in-out-quad           | out-in-quad           |
 * | step-start | in-cubic           | out-cubic      | in-out-cubic          | out-in-cubic          |
 * | step-end   | in-quart           | out-quart      | in-out-quart          | out-in-quart          |
 * |            | in-quint           | out-quint      | in-out-quint          | out-in-quint          |
 * |            | in-expo            | out-expo       | in-out-expo           | out-in-expo           |
 * |            | in-circ            | out-circ       | in-out-circ           | out-in-circ           |
 * |            | in-back            | out-back       | in-out-back           | out-in-back           |
 * |            | in-bounce          | out-bounce     | in-out-bounce         | out-in-bounce         |
 * |            | in-elastic         | out-elastic    | in-out-elastic        | out-in-elastic        |
 * |            | spring / spring-in | spring-out     | spring-in-out         | spring-out-in         |
 *
 * All **Elastic** easing's can be configured using theses parameters,
 *
 * `*-elastic(amplitude, period)`
 *
 * Each parameter comes with these defaults
 *
 * | Parameter | Default Value |
 * | --------- | ------------- |
 * | amplitude | `1`           |
 * | period    | `0.5`         |
 *
 * ***
 *
 * All **Spring** easing's can be configured using theses parameters,
 *
 * `spring-*(mass, stiffness, damping, velocity)`
 *
 * Each parameter comes with these defaults
 *
 * | Parameter | Default Value |
 * | --------- | ------------- |
 * | mass      | `1`           |
 * | stiffness | `100`         |
 * | damping   | `10`          |
 * | velocity  | `0`           |
 *
 * You can create your own custom cubic-bezier easing curves. Similar to css you type `cubic-bezier(...)` with 4 numbers representing the shape of the bezier curve, for example, `cubic-bezier(0.47, 0, 0.745, 0.715)` this is the bezier curve for `in-sine`.
 *
 * _**Note**: the `easing` property supports the original values and functions for easing as well, for example, `steps(1)`, and etc... are supported._
 *
 * _**Note**: you can also use camelCase when defining easing functions, e.g. `inOutCubic` to represent `in-out-cubic`_
 *
 * _**Suggestion**: if you decide to use CustomEasing on one CSS property, I suggest using CustomEasing or {@link ApplyCustomEasing} on the rest (this is no longer necessary, but for the sake of readability it's better to do)_
 *
 *  e.g.
 *  ```ts
 *  import { animate, CustomEasing, EaseOut, Quad } from "@okikio/animate";
 *  animate({
 *    target: "div",
 *
 *    // Notice how only, the first value in the Array uses the "px" unit
 *    border: CustomEasing(["1px solid red", "3 dashed green", "2 solid black"], {
 *        // This is a custom easing function
 *        easing: EaseOut(Quad)
 *    }),
 *
 *    translateX: CustomEasing([0, 250], {
 *        easing: "linear",
 *
 *        // You can change the size of Array for the CustomEasing function to generate
 *        numPoints: 200,
 *
 *        // The number of decimal places to round, final values in the generated Array
 *        decimal: 5,
 *    }),
 *
 *    // You can set the easing without an object
 *    // Also, if units are detected in the values Array,
 *    // the unit of the first value in the values Array are
 *    // applied to other values in the values Array, even if they
 *    // have prior units
 *    rotate: CustomEasing(["0turn", 1, 0, 0.5], "out"),
 *    "background-color": CustomEasing(["#616aff", "white"]),
 *        easing: "linear"
 *    }),
 *
 *    // TIP... Use linear easing for the proper effect
 *    easing: "linear"
 *  })
 *  ```
 */
export declare const CustomEasing: (values: (string | number)[], options?: TypeCustomEasingOptions | string | TypeEasingFunction) => (string | number)[];
/**
 * Returns an array containing `[easing pts, duration]`, it's meant to be a self enclosed way to create spring easing.
 * Springs have an optimal duration; using `getEasingDuration()` we are able to have the determine the optimal duration for a spring with given parameters.
 *
 * By default it will only give the optimal duration for `spring` or `spring-in` easing, this is to avoid infinite loops caused by the `getEasingDuration()` function.
 *
 * Internally the `SpringEasing` uses {@link CustomEasing}, read more on it, to understand how the `SpringEasing` function works.
 *
 * e.g.
 * ```ts
 * import { animate, SpringEasing } from "@okikio/animate";
 *
 * // `duration` is the optimal duration for the spring with the set parameters
 * let [translateX, duration] = SpringEasing([0, 250], "spring(5, 100, 10, 1)");
 * // or
 * // `duration` is 5000 here
 * let [translateX, duration] = SpringEasing([0, 250], {
 *      easing: "spring(5, 100, 10, 1)",
 *      numPoints: 50,
 *      duration: 5000,
 *      decimal: 3
 * });
 *
 * animate({
 *      target: "div",
 *      translateX,
 *      duration
 * });
 * ```
 */
export declare const SpringEasing: (values: (string | number)[], options?: TypeCustomEasingOptions | string) => [(string | number)[], number];
/**
 * Applies the same custom easings to all properties of the object and returns an object with each property having an array of custom eased values
 *
 * If you use the `spring` or `spring-in` easings it will also return the optimal duration as a key in the object it returns.
 * If you set `duration` to a number, it will prioritize that `duration` over optimal duration given by the spring easings.
 *
 * Read more about {@link CustomEasing}
 *
 * e.g.
 * ```ts
 * import { animate, ApplyCustomEasing } from "@okikio/animate";
 * animate({
 *      target: "div",
 *
 *      ...ApplyCustomEasing({
 *        border: ["1px solid red", "3 dashed green", "2 solid black"],
 *        translateX: [0, 250],
 *        rotate: ["0turn", 1, 0, 0.5],
 *        "background-color": ["#616aff", "white"],
 *
 *        // You don't need to enter any parameters, you can just use the default values
 *        easing: "spring",
 *
 *        // You can change the size of Array for the CustomEasing function to generate
 *        numPoints: 200,
 *
 *        // The number of decimal places to round, final values in the generated Array
 *        decimal: 5,
 *
 *        // You can also set the duration from here.
 *        // When using spring animations, the duration you set here is not nesscary,
 *        // since by default springs will try to determine the most appropriate duration for the spring animation.
 *        // But the duration value here will override `spring` easings optimal duration value
 *        duration: 3000
 *      })
 * })
 * ```
 */
export declare const ApplyCustomEasing: (options?: TypeCustomEasingOptions & {
    [key: string]: string | number | (string | number)[] | TypeEasingFunction;
}) => IAnimateInstanceConfig & TypeCustomEasingOptions & {
    [key: string]: string | number | (string | number)[] | TypeEasingFunction;
};
