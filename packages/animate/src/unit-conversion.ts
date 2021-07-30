import { Manager } from "@okikio/manager";
import { getUnit, isValid, toArr } from "./utils";

import type { TypeSingleValueCSSProperty, ICSSComputedTransformableProperties, ICSSProperties } from "./types";
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
 * @param arr - array of numbers, strings and/or an array of array of both e.g. ```[[25, "50px", "60%"], "25 35 60%", 50]```
 * @param unit - a unit function to use to add units to {@link TypeSingleValueCSSProperty | TypeSingleValueCSSProperty's }
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
 * Cache previously converted CSS values to avoid lots of Layout, Style, and Paint computations when computing CSS values
*/
export const CSS_CACHE = new Manager();

/** 
 * Convert colors to an [r, g, b, a] Array
*/
export const toRGBAArr = (color = "transparent") => {
    color = color.trim();
    if (CSS_CACHE.has(color)) return CSS_CACHE.get(color);
    if (!CSS.supports("background-color", color)) return color;

    let el = document.createElement("div");
    el.style.backgroundColor = color;
    
    let parent = document.body;
    parent.appendChild(el);

    let { backgroundColor } = getComputedStyle(el);
    el.remove();
    
    let computedColor = /\(([^)]+)\)?/.exec(backgroundColor)?.[1].split(",");
    let result = (computedColor.length == 3 ? [...computedColor, "1"] : computedColor).map(v => parseFloat(v));
    
    CSS_CACHE.set(color, result);
    return result;
};

/** 
 * Convert CSS lengths to pixels
 * @beta
*/
// export const toPX = (value = "0", target?: HTMLElement) => {
//     if (CSS_CACHE.has(value)) return CSS_CACHE.get(value);
//     if (!CSS.supports("width", value)) return toPX;

//     let el = document.createElement(target?.tagName ?? "div");
//     el.style.width = value;

//     let parent = target?.parentElement ?? document.body;
//     parent.appendChild(el);

//     let { width: result } = getComputedStyle(el);
//     parent.removeChild(el);

//     CSS_CACHE.set(value, result);
//     return result;
// };

// export const angleConversions = {
//     'deg': 1,
//     'rad': ( 180 / Math.PI ),
//     'grad': ( 180 / 200 ),
//     'turn': 360
// }


// export const angleUnits = Object.keys(angleConversions);

// /** 
//  * Convert CSS andles to degrees
//  * @beta
// */
// export const toDEG = (value = "0deg") => {
//     let unit = getUnit(value);
//     return (parseFloat(value) * angleConversions[unit]) + "deg";
// };
