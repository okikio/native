import type { TypeEasingFunction, TypeCustomEasingOptions } from "./custom-easing";
import type { TypeComputableAnimationFunction } from "./types";
export interface IStaggerOptions {
    from?: number | "first" | "center" | "last";
    grid?: number[];
    axis?: "x" | "y";
    start?: number | string;
    easing?: string | TypeEasingFunction;
    direction?: "normal" | "reverse";
}
/**
 * Creates complex staggered animations, it does it by creating a closure function and using it as an AnimationOption
 * Based on animejs's stagger function, it function the same way
 *
 * Staggering allows you to animate multiple elements with follow through and overlapping action.
 *
 * It can be used like this,
 * ```ts
 * import { animate, stagger } from "@okikio/animate";
 * animate({
 *      target: ".div",
 *
 *      // `stagger` accepts range values but only an Array of 2 values are accepted,
 *      // the values can be either a "string" or a "number".
 *
 *      // `stagger` distributes values evenly between two numbers,
 *      // so, given 5 elements, translate on the first element will be 0,
 *      // on the second element 50, on the third element 100, etc...
 *
 *      // the equation is:
 *      // (start value or first value in array range) + (((second value in the range) - (first value in the range)) / (total number of elements)) * (current index of element)
 *      // For an array of range `[-360, 360]`, 5 elements, and an undefined start value, you will get:
 *      //= -360 + ((360 - (-360)) / 5) * 0
 *      //= -360 + ((360 - (-360)) / 5) * 1
 *      //= -360 + ((360 - (-360)) / 5) * 2
 *      //= -360 + ((360 - (-360)) / 5) * 3
 *      //= -360 + ((360 - (-360)) / 5) * 4
 *      translate: stagger([0, 250]),
 *
 *      // Single value staggers are also possible.
 *      // This increase delay by 100ms for each element.
 *      delay: stagger(100),
 *
 *      fillMode: "both",
 *      easing: "linear",
 *      duration: 5000
 * });
 * ```
 *
 * stagger can also be used for grids.
 * For grids you do this,
 *
 * ```ts
 * import { animate, stagger } from "@okikio/animate";
 * animate({
 *      target: ".div",
 *
 *      // For grids you need to specify the size of the grid via stagger options
 *      // { grid: [number of columns, number of rows] }
 *
 *      // and in this scenario we also need to specify the axis
 *      // { axis: "x" or "y" }
 *      translate: stagger([0, 30], {
 *          grid: [14, 5],
 *          axis: "x"
 *      }),
 *
 *      // Single value staggers are still possible.
 *      delay: stagger(100, { grid: [14, 5] }),
 *
 *      fillMode: "both",
 *      easing: "linear",
 *      duration: 5000
 * });
 * ```
 *
 * the full list of staggering options are:
 *
 * | Stagger option | Types                                                  | Default value                          | Use case                                                                                                                                                                                |
 * | -------------- | ------------------------------------------------------ | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
 * | start          | Number \| String                                       | The first value in an Array range or 0 | Starts the staggering effect from a specific value.                                                                                                                                     |
 * | axis           | "x"    \| "y"                                          | Undefined                              | Forces the direction of a grid staggering effect. It's often used together with the grid stagger option                                                                                 |
 * | from           | Number \| "center" \| "first" \| "last"                | 0                                      | Starts the stagger effect from a specific element.                                                                                                                                      |
 * | direction      | "reverse" \| "normal"                                  | Undefined                              | Changes the order in which the stagger effect operates. e.g. instead of top to bottom, go bottom to top.                                                                                |
 * | easing         | String \| Function                                     | Undefined                              | Stagger values using an easing function. Allows stagger effect to have certain easing characteristics, e.g. in-out-quad, is very smooth so, the stagger effect will also be very smooth |
 * | grid           | Array of 2 values, [number of columns, number of rows] | Undefined                              | Stagger values based on a 2D array that states the [number of columns, number of rows].                                                                                                 |

 *
 * Check out demos on [Codepen](https://codepen.io/okikio/pen/JjNXGPq) as well as animejs's [stagger documentation](https://animejs.com/documentation/#staggeringBasics)
 *
 * Because stagger returns an {@link TypeCallback | AnimationOption callback}, it fundementally doesn't work with {@link CustomEasing},
 * so, you need to use {@link StaggerCustomEasing} to enable custom easing.
 */
export declare const stagger: (val: string | number | (string | number)[], params?: IStaggerOptions) => TypeComputableAnimationFunction<string | number>;
export interface IStaggerCustomEasingOptions extends TypeCustomEasingOptions {
    stagger?: IStaggerOptions;
}
/**
 * Returns an {@link TypeCallback | AnimationOption callback}, with support for {@link stagger} and {@link CustomEasing}.
 * Thus all the same options and restrictions apply, make sure you read more on {@link stagger} and {@link CustomEasing}.
 *
 * `StaggerCustomEasing` only supports array range values.
 *
 * To use `StaggerCustomEasing` you need to do this,
 *
 * ```ts
 * import { animate, stagger, StaggerCustomEasing } from "@okikio/animate";
 * animate({
 *      target: ".div",
 *
 *      translate: StaggerCustomEasing([0, 250], {
 *          // To set stagger options you need to do this
 *          stagger: { from "center" },
 *
 *          // These options are for `CustomEasing`
 *          easing: "out-elastic",
 *          numPoints: 150
 *      }),
 *      delay: stagger(100),
 *
 *      fillMode: "both",
 *      easing: "linear",
 *      duration: 5000
 * })
 * ```
 *
 * Check out demos on [Codepen](https://codepen.io/okikio/pen/JjNXGPq)
*/
export declare const StaggerCustomEasing: (val: (string | number)[], params?: IStaggerCustomEasingOptions) => TypeComputableAnimationFunction<(string | number)[]>;
/**
 * Generates random values within a range of values
 */
export declare const random: (min: number, max: number) => number;
