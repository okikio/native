import { Manager } from "@okikio/manager";
import type { TypeCSSGenericPropertyKeyframes } from "./types";
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
 * Returns a closure function, which adds units to numbers, strings or arrays of both
 *
 * @param unit - a unit function to use to add units to {@link TypeCSSGenericPropertyKeyframes TypeCSSGenericPropertyKeyframes's }
 * @returns
 * if input is a string split it into an array at the comma's, and add units
 * else if the input is a number add the default units
 * otherwise if the input is an array of both add units according to {@link addCSSUnit}
 */
export declare const CSSValue: (unit: typeof UnitLess) => (input: TypeCSSGenericPropertyKeyframes) => ReturnType<typeof UnitLess>[];
/**
 * Takes `TypeCSSGenericPropertyKeyframes` or an array of `TypeCSSGenericPropertyKeyframes` and adds units approriately
 *
 * @param arr - array of numbers, strings and/or an array of array of both e.g. ```[[25, "50px", "60%"], "25 35 60%", 50]```
 * @param unit - a unit function to use to add units to {@link TypeCSSGenericPropertyKeyframes | TypeCSSGenericPropertyKeyframes's }
 * @returns
 * an array of an array of strings with units
 * e.g.
 * ```ts
 * import { CSSArrValue, UnitPX } from "@okikio/animate";
 *
 * CSSArrValue([
 *      [25, "50px", "60%"],
 *      "25 35 60%",
 *      50
 * ], UnitPX)
 *
 * //= [
 * //=      [ '25px', '50px', '60%' ],
 * //=      [ '25px', '35px', '60%' ],
 * //=      [ '50px' ]
 * //= ]
 * ```
 */
export declare const CSSArrValue: (arr: TypeCSSGenericPropertyKeyframes | TypeCSSGenericPropertyKeyframes[], unit: typeof UnitLess) => TypeCSSGenericPropertyKeyframes[];
/** Parses CSSValues without adding any units */
export declare const UnitLessCSSValue: (input: TypeCSSGenericPropertyKeyframes) => ReturnType<typeof UnitLess>[];
/** Parses CSSValues and adds the "px" unit if required */
export declare const UnitPXCSSValue: (input: TypeCSSGenericPropertyKeyframes) => ReturnType<typeof UnitLess>[];
/** Parses CSSValues and adds the "deg" unit if required */
export declare const UnitDEGCSSValue: (input: TypeCSSGenericPropertyKeyframes) => ReturnType<typeof UnitLess>[];
/**
 * Cache previously converted CSS values to avoid lots of Layout, Style, and Paint computations when computing CSS values
*/
export declare const CSS_CACHE: Manager<unknown, unknown>;
/**
 * Convert colors to an [r, g, b, a] Array
*/
export declare const toRGBAArr: (color?: string) => unknown;
/**
 * Convert CSS lengths to pixels
 * @beta
*/
