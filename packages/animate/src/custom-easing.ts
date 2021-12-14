import {
    isValid,
    transpose,
    toStr,
    convertToDash,
    mapObject,
    getUnit,
    trim,
    isEmpty
} from "./utils";
import { rgba } from "./color-rgba";
import { toRGBAArr } from "./unit-conversion";
import { getCSS } from "./browser-objects";
import bezier from "./bezier-easing";

import type { IAnimateInstanceConfig } from "./types";

export const limit = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

/**
 * The format to use when defining custom easing functions
 */
export type TypeEasingFunction = (
    t: number,
    params?: (string | number)[],
    duration?: number
) => number;

/**
  Easing Functions from anime.js, they are tried and true, so, its better to use them instead of other alternatives 
*/
export const Quad: TypeEasingFunction = (t) => Math.pow(t, 2);
export const Cubic: TypeEasingFunction = (t) => Math.pow(t, 3);
export const Quart: TypeEasingFunction = (t) => Math.pow(t, 4);
export const Quint: TypeEasingFunction = (t) => Math.pow(t, 5);
export const Expo: TypeEasingFunction = (t) => Math.pow(t, 6);
export const Sine: TypeEasingFunction = (t) => 1 - Math.cos((t * Math.PI) / 2);
export const Circ: TypeEasingFunction = (t) => 1 - Math.sqrt(1 - t * t);
export const Back: TypeEasingFunction = (t) => t * t * (3 * t - 2);

export const Bounce: TypeEasingFunction = (t) => {
    let pow2: number,
        b = 4;
    while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) {}
    return (
        1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2)
    );
};

export const Elastic: TypeEasingFunction = (t, params: number[] = []) => {
    let [amplitude = 1, period = 0.5] = params;
    const a = limit(amplitude, 1, 10);
    const p = limit(period, 0.1, 2);
    if (t === 0 || t === 1) return t;
    return (
        -a *
        Math.pow(2, 10 * (t - 1)) *
        Math.sin(
            ((t - 1 - (p / (Math.PI * 2)) * Math.asin(1 / a)) * (Math.PI * 2)) /
                p
        )
    );
};

export const Spring: TypeEasingFunction = (
    t: number,
    params: number[] = [],
    duration?: number
) => {
    let [mass = 1, stiffness = 100, damping = 10, velocity = 0] = params;

    mass = limit(mass, 0.1, 1000);
    stiffness = limit(stiffness, 0.1, 1000);
    damping = limit(damping, 0.1, 1000);
    velocity = limit(velocity, 0.1, 1000);

    const w0 = Math.sqrt(stiffness / mass);
    const zeta = damping / (2 * Math.sqrt(stiffness * mass));
    const wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
    const a = 1;
    const b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;

    let progress = duration ? (duration * t) / 1000 : t;
    if (zeta < 1) {
        progress =
            Math.exp(-progress * zeta * w0) *
            (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
    } else {
        progress = (a + b * progress) * Math.exp(-progress * w0);
    }

    if (t === 0 || t === 1) return t;
    return 1 - progress;
};

/**
 * Cache the durations at set easing parameters
 */
export const EasingDurationCache: Map<
    string | TypeEasingFunction,
    number
> = new Map();

/**
 * The threshold for an infinite loop
 */
export const INTINITE_LOOP_LIMIT = 10000;

/**
 * The spring easing function will only look smooth at certain durations, with certain parameters.
 * This functions returns the optimal duration to create a smooth springy animation based on physics
 *
 * Note: it can also be used to determine the optimal duration of other types of easing function, but be careful of "in-"
 * easing functions, because of the nature of the function it can sometimes create an infinite loop, I suggest only using
 * `getEasingDuration` for `spring`, specifically "out-spring" and "spring"
 */
export const getEasingDuration = (
    easing: string | TypeEasingFunction = "spring"
) => {
    if (EasingDurationCache.has(easing)) return EasingDurationCache.get(easing);

    const easingFunction =
        typeof easing == "function"
            ? easing
            : GetEasingFunction(easing as string);
    const params =
        typeof easing == "function" ? [] : parseEasingParameters(easing);
    const frame = 1 / 6;

    let elapsed = 0;
    let rest = 0;
    let count = 0;

    while (++count < INTINITE_LOOP_LIMIT) {
        elapsed += frame;
        if (easingFunction(elapsed, params, null) === 1) {
            rest++;
            if (rest >= 16) break;
        } else {
            rest = 0;
        }
    }

    const duration = elapsed * frame * 1000;
    EasingDurationCache.set(easing, duration);
    return duration;
};

/** 
  These Easing Functions are based off of the Sozi Project's easing functions 
  https://github.com/sozi-projects/Sozi/blob/d72e44ebd580dc7579d1e177406ad41e632f961d/src/js/player/Timing.js
*/
export const Steps: TypeEasingFunction = (t: number, params = []) => {
    let [steps = 10, type] = params as [number, string];
    const trunc = type == "start" ? Math.ceil : Math.floor;
    return trunc(limit(t, 0, 1) * steps) / steps;
};

export const Bezier: TypeEasingFunction = (
    t: number,
    params: number[] = []
) => {
    let [mX1, mY1, mX2, mY2] = params;
    return bezier(mX1, mY1, mX2, mY2)(t);
};

/** The default `ease-in` easing function */
export const easein: TypeEasingFunction = bezier(0.42, 0.0, 1.0, 1.0);

/** Converts easing functions to their `out`counter parts */
export const EaseOut = (ease: TypeEasingFunction): TypeEasingFunction => {
    return (t, params = [], duration?: number) =>
        1 - ease(1 - t, params, duration);
};

/** Converts easing functions to their `in-out` counter parts */
export const EaseInOut = (ease: TypeEasingFunction): TypeEasingFunction => {
    return (t, params = [], duration?: number) =>
        t < 0.5
            ? ease(t * 2, params, duration) / 2
            : 1 - ease(t * -2 + 2, params, duration) / 2;
};

/** Converts easing functions to their `out-in` counter parts */
export const EaseOutIn = (ease: TypeEasingFunction): TypeEasingFunction => {
    return (t, params = [], duration?: number) => {
        return t < 0.5
            ? (1 - ease(1 - t * 2, params, duration)) / 2
            : (ease(t * 2 - 1, params, duration) + 1) / 2;
    };
};

/**
 * The default list of easing functions, 
 * 
 * _**Note**_: this is different from {@link EASING}
 */
export const EasingFunctions: { [key: string]: TypeEasingFunction } = {
    steps: Steps,
    "step-start": (t) => Steps(t, [1, "start"]),
    "step-end": (t) => Steps(t, [1, "end"]),

    linear: (t) => t,
    "cubic-bezier": Bezier,
    ease: (t) => Bezier(t, [0.25, 0.1, 0.25, 1.0]),

    in: easein,
    out: EaseOut(easein),
    "in-out": EaseInOut(easein),
    "out-in": EaseOutIn(easein),

    "in-quad": Quad,
    "out-quad": EaseOut(Quad),
    "in-out-quad": EaseInOut(Quad),
    "out-in-quad": EaseOutIn(Quad),

    "in-cubic": Cubic,
    "out-cubic": EaseOut(Cubic),
    "in-out-cubic": EaseInOut(Cubic),
    "out-in-cubic": EaseOutIn(Cubic),

    "in-quart": Quart,
    "out-quart": EaseOut(Quart),
    "in-out-quart": EaseInOut(Quart),
    "out-in-quart": EaseOutIn(Quart),

    "in-quint": Quint,
    "out-quint": EaseOut(Quint),
    "in-out-quint": EaseInOut(Quint),
    "out-in-quint": EaseOutIn(Quint),

    "in-expo": Expo,
    "out-expo": EaseOut(Expo),
    "in-out-expo": EaseInOut(Expo),
    "out-in-expo": EaseOutIn(Expo),

    "in-sine": Sine,
    "out-sine": EaseOut(Sine),
    "in-out-sine": EaseInOut(Sine),
    "out-in-sine": EaseOutIn(Sine),

    "in-circ": Circ,
    "out-circ": EaseOut(Circ),
    "in-out-circ": EaseInOut(Circ),
    "out-in-circ": EaseOutIn(Circ),

    "in-back": Back,
    "out-back": EaseOut(Back),
    "in-out-back": EaseInOut(Back),
    "out-in-back": EaseOutIn(Back),

    "in-bounce": Bounce,
    "out-bounce": EaseOut(Bounce),
    "in-out-bounce": EaseInOut(Bounce),
    "out-in-bounce": EaseOutIn(Bounce),

    "in-elastic": Elastic,
    "out-elastic": EaseOut(Elastic),
    "in-out-elastic": EaseInOut(Elastic),
    "out-in-elastic": EaseOutIn(Elastic),

    spring: Spring,
    "spring-in": Spring,
    "spring-out": EaseOut(Spring),
    "spring-in-out": EaseInOut(Spring),
    "spring-out-in": EaseOutIn(Spring),
};

export let EasingFunctionKeys = Object.keys(EasingFunctions);

/**
 * Allows you to register new easing functions
 */
export const registerEasingFunction = (key: string, fn: TypeEasingFunction) => {
    Object.assign(EasingFunctions, {
        [key]: fn,
    });

    EasingFunctionKeys = Object.keys(EasingFunctions);
};

/**
 * Allows you to register multiple new easing functions
 */
export const registerEasingFunctions = (
    ...obj: Array<typeof EasingFunctions>
) => {
    Object.assign(EasingFunctions, ...obj);
    EasingFunctionKeys = Object.keys(EasingFunctions);
};

/**
 * Convert string easing to their proper form
 */
export const ComplexEasingSyntax = (ease: string) =>
    convertToDash(ease)
        .replace(/^ease-/, "") // Remove the "ease-" keyword
        .replace(/(\(|\s).+/, "") // Remove the function brackets and parameters
        .toLowerCase()
        .trim();

/** Re-maps a number from one range to another. Numbers outside the range are not clamped to 0 and 1, because out-of-range values are often intentional and useful. */
export const GetEasingFunction = (ease: string) => {
    let search = ComplexEasingSyntax(toStr(ease));

    if (EasingFunctionKeys.includes(search)) return EasingFunctions[search];
    return null;
};

/** Convert easing parameters to Array of numbers, e.g. "spring(2, 500)" to [2, 500] */
export const parseEasingParameters = (str: string) => {
    const match = /(\(|\s)([^)]+)\)?/.exec(toStr(str));
    return match
        ? match[2].split(",").map((value) => {
              let num = parseFloat(value);
              return !Number.isNaN(num) ? num : value.trim();
          })
        : [];
};

/** map `t` from 0 to 1, to `start` to `end` */
export const scale = (t: number, start: number, end: number) =>
    start + (end - start) * t;

/** Rounds numbers to a fixed decimal place */
export const toFixed = (value: number, decimal: number) =>
    Math.round(value * 10 ** decimal) / 10 ** decimal;

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
export const interpolateNumber = (t: number, values: number[], decimal = 3) => {
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
export const isNumberLike = (num: string | number) => {
    let value = parseFloat(num as string);
    return typeof value == "number" && !Number.isNaN(value);
};

/** 
  Given an Array of values, find a value using `t` (`t` goes from 0 to 1), by
  using `t` to estimate the index of said value in the array of `values` 
*/
export const interpolateUsingIndex = (
    t: number,
    values: (string | number)[]
) => {
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
export const interpolateString = (
    t: number,
    values: (string | number)[],
    decimal = 3
) => {
    let units = "";

    // If the first value looks like a number with a unit
    if (isNumberLike(values[0])) units = getUnit(values[0]);

    return (
        interpolateNumber(
            t,
            values.map((v) => (typeof v == "number" ? v : parseFloat(v))),
            decimal
        ) + units
    );
};

/** 
  Use the `color-rgba` npm package, to convert all color formats to an Array of rgba values, 
  e.g. `[red, green, blue, alpha]`. Then, use the {@link interpolateNumber} functions to interpolate over the array
  
  _**Note**: the red, green, and blue colors are rounded to intergers with no decimal places, 
  while the alpha color gets rounded to a specific decimal place_

  Make sure to read {@link interpolateNumber}.
*/
export const interpolateColor = (t: number, values: string[], decimal = 3) => {
    return transpose(...values.map((v) => toRGBAArr(v))).map(
        (colors: number[], i) => {
            let result = interpolateNumber(t, colors);
            return i < 3 ? Math.round(result) : toFixed(result, decimal);
        }
    );
};

/** 
  Converts "10px solid red #555   rgba(255, 0,5,6, 7)  " 
  to [ '10px', 'solid', 'red', '#555', 'rgba(255, 0,5,6, 7)' ] 
*/
export const ComplexStrtoArr = (str: string) => {
    return (
        trim(str)
            .replace(/(\d|\)|\w)\s/g, (match) => match[0] + "__")
            .split("__")
            .map(trim)

            // Remove invalid values
            .filter(isValid)
    );
};

/**
  Interpolates all types of values including number, string, color, and complex values. 
  Complex values are values like "10px solid red", that border, and other CSS Properties use.

  Make sure to read {@link interpolateNumber}, {@link interpolateString}, {@link interpolateColor}, and {@link interpolateUsingIndex}.
*/
export const interpolateComplex = (
    t: number,
    values: (string | number)[],
    decimal = 3
) => {
    // Interpolate numbers
    let isNumber = values.every((v) => typeof v == "number");
    if (isNumber) return interpolateNumber(t, values as number[], decimal);

    // Interpolate colors
    let isColor = values.every((v) => !isEmpty(getCSS()) ? getCSS()?.supports?.("color", toStr(v)) : isValid(rgba(v ?? null)) );
    if (isColor)
        return `rgba(${interpolateColor(t, values as string[], decimal)})`;

    // Interpolate complex values and strings
    let isString = values.some((v) => typeof v == "string");
    if (isString) {
        // Interpolate complex values like "10px solid red"
        let isComplex = values.some((v) =>
            /(\d|\)|\w)\s/.test(trim(v as string))
        );
        if (isComplex) {
            return transpose(...values.map(ComplexStrtoArr))
                .map((value) => interpolateComplex(t, value, decimal))
                .join(" ");
        }

        // Interpolate strings with numbers, e.g. "5px"
        let isLikeNumber = values.every((v) => isNumberLike(v as string));
        if (isLikeNumber)
            return interpolateString(t, values as (number | string)[], decimal);
        // Interpolate pure strings, e.g. "inherit", "solid", etc...
        else return interpolateUsingIndex(t, values as string[]);
    }
};

/**
 * Custom Easing has 3 properties they are `easing` (all the easings from [#easing](#easing) are supported on top of custom easing functions, like spring, bounce, etc...), `numPoints` (the size of the Array the Custom Easing function should create), and `decimal` (the number of decimal places of the values within said Array).
 *
 * | Properties  | Default Value           |
 * | ----------- | ----------------------- |
 * | `easing`    | `spring(1, 100, 10, 0)` |
 * | `numPoints` | `50`                    |
 * | `decimal`   | `3`                     |
 */
export type TypeCustomEasingOptions = {
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
export const CustomEasingOptions = (
    options: TypeCustomEasingOptions | string | TypeEasingFunction = {}
) => {
    let isEasing = typeof options == "string" || typeof options == "function";
    let {
        easing = "spring(1, 100, 10, 0)",
        numPoints = 100,
        decimal = 3,
        duration,
    } = (isEasing ? { easing: options } : options) as TypeCustomEasingOptions;
    return { easing, numPoints, decimal, duration };
};

/** 
  Cache calculated tween points for commonly used easing functions
*/
export const TweenCache = new Map();

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
export const EasingPts = ({
    easing,
    numPoints,
    duration,
}: TypeCustomEasingOptions = {}): number[] => {
    const pts = [];
    const key = `${easing}${numPoints}`;
    if (TweenCache.has(key)) return TweenCache.get(key);

    const easingFunction =
        typeof easing == "function"
            ? easing
            : GetEasingFunction(easing as string);
    const params =
        typeof easing == "function" ? [] : parseEasingParameters(easing);

    for (let i = 0; i < numPoints; i++) {
        pts[i] = easingFunction(i / (numPoints - 1), params, duration);
    }

    TweenCache.set(key, pts);
    return pts;
};

/**
 * Update the duration of `spring` and `spring-in` easings ot use optimal durations
 */
const updateDuration = (optionsObj: TypeCustomEasingOptions = {}) => {
    if (typeof optionsObj.easing == "string") {
        let easing = ComplexEasingSyntax(optionsObj.easing as string);
        if (/(spring|spring-in)$/i.test(easing)) {
            optionsObj.duration = getEasingDuration(optionsObj.easing);
        }
    }
};

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
export const CustomEasing = (
    values: (string | number)[],
    options: TypeCustomEasingOptions | string | TypeEasingFunction = {}
): (string | number)[] => {
    let optionsObj = CustomEasingOptions(options);
    updateDuration(optionsObj);

    return EasingPts(optionsObj).map((t) =>
        interpolateComplex(t, values, optionsObj.decimal)
    );
};

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
export const SpringEasing = (
    values: (string | number)[],
    options: TypeCustomEasingOptions | string = {}
): [(string | number)[], number] => {
    let optionsObj = CustomEasingOptions(options);

    let { duration } = optionsObj;
    updateDuration(optionsObj);

    return [
        CustomEasing(values, optionsObj),
        isValid(duration) ? duration : optionsObj.duration,
    ];
};

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
export const ApplyCustomEasing = (
    options: TypeCustomEasingOptions & {
        [key: string]:
            | number
            | string
            | TypeEasingFunction
            | (number | string)[];
    } = {}
): IAnimateInstanceConfig & TypeCustomEasingOptions & {
    [key: string]:
        | number
        | string
        | TypeEasingFunction
        | (number | string)[];
} => {
    let { easing, numPoints, decimal, duration, ...rest } = options;
    let optionsObj = { easing, numPoints, decimal, duration };
    updateDuration(optionsObj);

    let properties = mapObject(rest, (value: (string | number)[]) =>
        CustomEasing(value, optionsObj)
    );

    let durationObj = {};
    if (isValid(duration)) durationObj = { duration };
    else if (isValid(optionsObj.duration))
        durationObj = { duration: optionsObj.duration };

    return Object.assign({}, properties, durationObj);
};
