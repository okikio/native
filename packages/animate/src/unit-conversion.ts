import type { OneOrMany } from "./types.ts";
import { isValid, toArr, isEmpty, trim } from "./utils.ts";
import { getCSS, getDocument } from "./browser-objects.ts";
import rgba from "./color-rgba.ts";

/**
 * Adds a unit to numbers or returns the value as is if it's a string.
 *
 * @param value - The value to add a unit to.
 * @param unit - The unit to add (default is an empty string).
 * @returns The value with the unit added, or the value itself if it's a string.
 *
 * @example
 * // Add "px" unit to a number
 * const result = addUnit(10, "px"); // "10px"
 *
 * @example
 * // Return the string value as is
 * const result = addUnit("50%"); // "50%"
 */
export function addUnit(value: string | number, unit: string = ""): string {
  return typeof value === "string" ? value : `${value}${unit}`;
}

/**
 * Adds no unit to the value.
 *
 * @param value - The value to process.
 * @returns The value with no unit added.
 *
 * @example
 * const result = unitNone(100); // "100"
 *
 * @example
 * const result = unitNone("50%"); // "50%"
 */
export function unitNone(value: string | number): string {
  return addUnit(value);
}

/**
 * Adds "px" unit to numbers.
 *
 * @param value - The value to process.
 * @returns The value with "px" unit added.
 *
 * @example
 * const result = unitPx(100); // "100px"
 *
 * @example
 * const result = unitPx("50%"); // "50%"
 */
export function unitPx(value: string | number): string {
  return addUnit(value, "px");
}

/**
 * Adds "deg" unit to numbers.
 *
 * @param value - The value to process.
 * @returns The value with "deg" unit added.
 *
 * @example
 * const result = unitDeg(45); // "45deg"
 *
 * @example
 * const result = unitDeg("50%"); // "50%"
 */
export function unitDeg(value: string | number): string {
  return addUnit(value, "deg");
}

/**
 * Ensures a set of CSS value keyframes all share the same unit for Web Animations API.
 * This function converts numeric values to strings with units, enabling seamless animation.
 *
 * @param input - The value(s) to process.
 * @param unit - The function to add units.
 * @returns An array of values with units added.
 *
 * @example
 * // Add "px" unit to numbers
 * const result = cssValueSet([10, "20px", 30], unitPx); // ["10px", "20px", "30px"]
 *
 * @example
 * // Process a single string value
 * const result = cssValueSet("40%", unitPx); // ["40%"]
 *
 * @example
 * // Handle invalid input
 * const result = cssValueSet(null, unitPx); // []
 *
 * @example
 * // Mixed units, should preserve original units
 * const result = cssValueSet([10, "20%", 30], unitPx); // ["10px", "20%", "30px"]
 *
 * @example
 * // Using with Web Animations API (WAAPI)
 * const keyframes = cssValueSet([0, 50, 100], unitPx);
 * // keyframes = ["0px", "50px", "100px"]
 * element.animate(
 *   { transform: keyframes.map(value => `translateX(${value})`) },
 *   { duration: 1000 }
 * );
 * // This animation will move the element from 0px to 100px along the X-axis.
 * // The map operation will result in:
 * // ["translateX(0px)", "translateX(50px)", "translateX(100px)"]
 */
export function cssValueSet<T>(input: OneOrMany<T>, unit: (value: string | number) => string): string[] {
  if (!isValid(input)) return [];
  return toArr(input).map((val: unknown) => {
      const num = Number(val);
      if (!Number.isNaN(num)) {
        if (typeof val === "number") return unit(val);
        if (typeof val === "string") 
          return unit(num);
      }

      if (typeof val === "string") 
        return trim(val);
      
      return null;
    })
    .filter((x): x is string => isValid(x));
}

/**
 * Ensures CSS value keyframes all share the same unit for properties supporting multiple values.
 * Useful for animating properties like `box-shadow` and `margin` with the Web Animations API.
 * This function converts numeric values to strings with units, enabling seamless animation for complex properties.
 *
 * @param arr - The array of values to process.
 * @param unit - The function to add units.
 * @returns An array of arrays of values with units added.
 *
 * @example
 * // Add "px" unit to numbers in nested arrays
 * const result = multiValueCssSet([[10, "20px"], "30 40"], unitPx);
 * // [["10px", "20px"], ["30px", "40px"]]
 *
 * @example
 * // Process an empty array
 * const result = multiValueCssSet([], unitPx); // []
 *
 * @example
 * // Process nested arrays with mixed types
 * const result = multiValueCssSet([[10, "20px", null], "30%", undefined], unitPx);
 * // [["10px", "20px"], ["30%"]]
 *
 * @example
 * // Using with Web Animations API (WAAPI)
 * const keyframes = multiValueCssSet([[0, "10px", 20], "30 40"], unitPx);
 * // keyframes = [["0px", "10px", "20px"], ["30px", "40px"]]
 * element.animate(
 *   { margin: keyframes.map(values => values.join(" ")) },
 *   { duration: 1000 }
 * );
 * // This animation will transition the element's margin through multiple values.
 * // The map operation will result in:
 * // ["0px 10px 20px", "30px 40px"]
 *
 * @example
 * // Example for animating box-shadow with mixed values
 * const boxShadowKeyframes = multiValueCssSet([
 *   ["0px 0px 5px 0px rgba(0, 0, 0, 0.2)", "0 0 10px rgba(0, 0, 0, 0.3)"],
 *   ["0px 0px 15px 0px rgba(0, 0, 0, 0.4)", "0px 0px 20px rgba(0, 0, 0, 0.5)"],
 *   25,
 *   [25, "0px 0px 25px rgba(0, 0, 0, 0.6)"]
 * ], unitPx);
 * // boxShadowKeyframes = [
 * //   ["0px 0px 5px 0px rgba(0, 0, 0, 0.2)", "0px 0px 10px rgba(0, 0, 0, 0.3)"],
 * //   ["0px 0px 15px 0px rgba(0, 0, 0, 0.4)", "0px 0px 20px rgba(0, 0, 0, 0.5)"],
 * //   ["25px"],
 * //   ["25px", "0px 0px 25px rgba(0, 0, 0, 0.6)"]
 * // ]
 * element.animate(
 *   { boxShadow: boxShadowKeyframes.map(values => values.join(", ")) },
 *   { duration: 1000 }
 * );
 * // This animation will transition the element's box-shadow through multiple values.
 * // The map operation will result in:
 * // [
 * //   "0px 0px 5px 0px rgba(0, 0, 0, 0.2), 0px 0px 10px rgba(0, 0, 0, 0.3)",
 * //   "0px 0px 15px 0px rgba(0, 0, 0, 0.4), 0px 0px 20px rgba(0, 0, 0, 0.5)",
 * //   "",
 * //   "25px, 0px 0px 25px rgba(0, 0, 0, 0.6)"
 * // ]
 */
export function multiValueCssSet<T>(arr: OneOrMany<OneOrMany<T>>, unit: (value: string | number) => string): string[][] {
  return toArr(arr)
    .map(value => cssValueSet(value, unit))
    .filter(x => isValid(x));
}

/**
 * Processes values or arrays of values without adding any units.
 *
 * @param value - The value(s) to process.
 * @returns An array of values with no units added.
 *
 * @example
 * const result = noUnitSet([10, "20%"]); // ["10", "20%"]
 *
 * @example
 * const result = noUnitSet("30% 40%"); // ["30%", "40%"]
 *
 * @example
 * // Using with Web Animations API (WAAPI)
 * const keyframes = noUnitSet([0, "20%", "40%"]);
 * // keyframes = ["0", "20%", "40%"]
 * element.animate(
 *   { opacity: keyframes },
 *   { duration: 1000 }
 * );
 * // This animation will change the element's opacity through the keyframes.
 * // The map operation will result in:
 * // ["0", "20%", "40%"]
 */
export function noUnitSet<T>(value: T | T[]): string[] {
  return cssValueSet(value, unitNone);
}

/**
 * Processes values or arrays of values by adding "px" units.
 *
 * @param value - The value(s) to process.
 * @returns An array of values with "px" units added.
 *
 * @example
 * const result = pxUnitSet([10, "20%"]); // ["10px", "20%"]
 *
 * @example
 * const result = pxUnitSet("30 40"); // ["30px", "40px"]
 *
 * @example
 * // Using with Web Animations API (WAAPI)
 * const keyframes = pxUnitSet([0, 50, 100]);
 * // keyframes = ["0px", "50px", "100px"]
 * element.animate(
 *   { transform: keyframes.map(value => `translateX(${value})`) },
 *   { duration: 1000 }
 * );
 * // This animation will move the element from 0px to 100px along the X-axis.
 * // The map operation will result in:
 * // ["translateX(0px)", "translateX(50px)", "translateX(100px)"]
 */
export function pxUnitSet<T>(value: T | T[]): string[] {
  return cssValueSet(value, unitPx);
}

/**
 * Processes values or arrays of values by adding "deg" units.
 *
 * @param value - The value(s) to process.
 * @returns An array of values with "deg" units added.
 *
 * @example
 * const result = degUnitSet([45, "90deg"]); // ["45deg", "90deg"]
 *
 * @example
 * const result = degUnitSet("120 180"); // ["120deg", "180deg"]
 *
 * @example
 * // Using with Web Animations API (WAAPI)
 * const keyframes = degUnitSet([0, 180, 360]);
 * // keyframes = ["0deg", "180deg", "360deg"]
 * element.animate(
 *   { transform: keyframes.map(value => `rotate(${value})`) },
 *   { duration: 1000 }
 * );
 * // This animation will rotate the element from 0deg to 360deg.
 * // The map operation will result in:
 * // ["rotate(0deg)", "rotate(180deg)", "rotate(360deg)"]
 */
export function degUnitSet<T>(value: T | T[]): string[] {
  return cssValueSet(value, unitDeg);
}

/**
 * Cache previously converted CSS values to avoid redundant Layout, Style, and Paint computations
 */
export const CSS_COLOR_CACHE = new Map<string, number[]>();

/**
 * Convert a color string to an [r, g, b, a] array.
 * 
 * @param {string} color - The color string to convert. Defaults to "transparent".
 * @returns {number[]} The RGBA array representation of the color.
 *
 * @example
 * // Basic usage
 * toRGBAArr("red"); // [255, 0, 0, 1]
 * 
 * @example
 * // Handling rgba color
 * toRGBAArr("rgba(0, 0, 255, 0.5)"); // [0, 0, 255, 0.5]
 *
 * @example
 * // Edge case: transparent
 * toRGBAArr("transparent"); // [0, 0, 0, 0]
 */
export function toRGBAArr(color: string = "transparent", customConverter?: typeof rgba): number[] {
  color = trim(color);
  if (CSS_COLOR_CACHE.has(color)) return CSS_COLOR_CACHE.get(color)!;

  let result: number[] = [];
  if (!isEmpty(getCSS())) {
    if (!getCSS()?.supports?.("background-color", color) && customConverter) return customConverter?.(color);

    let el: HTMLDivElement | null = getDocument()?.createElement?.("div");
    if (el) {
      el.style.backgroundColor = color;
      
      let parent: HTMLElement | null = getDocument()?.body;
      if (parent) {
        parent.appendChild(el);

        const { backgroundColor } = globalThis?.getComputedStyle?.(el) ?? {};
        parent.removeChild(el);
        parent = null;

        const computedColor = backgroundColor.match(/\(([^)]+)\)/)?.[1].split(",");
        const rgbaArr = toArr(computedColor).map(x => parseFloat(x as string));
        result =  computedColor?.length === 3 ? [...rgbaArr, 1] : rgbaArr;
      }

      el = null;
    }
  } else {
    result = rgba(color);
  }

  CSS_COLOR_CACHE.set(color, result);
  return result;
}

/**
 * Convert CSS lengths to pixels
 * @beta
*/
// export const toPX = (value = "0", target?: HTMLElement) => {
//     if (CSS_CACHE.has(value)) return CSS_CACHE.get(value);
//     if (!CSS.supports("width", value)) return toPX;

//     let el = getDocument()?.createElement?.(target?.tagName ?? "div");
//     el.style.width = value;

//     let parent = target?.parentElement ?? getDocument()?.body;
//     parent?.appendChild(el);

//     let { width: result } = globalThis?.getComputedStyle?.(el);
//     parent?.removeChild(el);

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
