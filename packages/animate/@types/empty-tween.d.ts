import { TypeCustomEasingOptions } from "./custom-easing";
import { Animate } from "./animate";
import type { IAnimationOptions } from "./types";
/** Keeps track of all the empty tween elements */
export declare let UIDCount: number;
/** Creates a new empty tween element */
export declare const createEmptyEl: () => HTMLDivElement;
/** Extends {@link Animate} stop method, so, it automatically removes the target elements from the dom */
export declare class DestroyableAnimate extends Animate {
    constructor(options?: IAnimationOptions);
    stop(): void;
}
/**
 * - create a empty new element,
 * - attach it to the DOM,
 * - animate the opacity of said element
 * - You can then use the "update" event to watch for changes in opacity and
 * use the opacity as a progress bar of values between 0 to 1
*/
export declare const tween: (options?: IAnimationOptions & TypeCustomEasingOptions) => DestroyableAnimate;
/**
 * Uses the change in opacity (from the {@link tween} function) to interpolate the value of other elements
 *
 * e.g.
 * ```ts
 * import { tweenAttr } from "@okikio/animate";
 * import { interpolate } from "polymorph-js";
 *
 * let startPath = usingPolymorphPathEl.getAttribute("d");
 * let endPath = "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z";
 *
 * // This is an svg path interpolate function
 * // If used in tandem with `tweenAttr`, you can create morphing animations
 * let morph = interpolate([startPath, endPath], {
 *      addPoints: 0,
 *      origin: { x: 0, y: 0 },
 *      optimize: "fill",
 *      precision: 3
 * });
 *
 * // `tweenAttr` supports all Animation Options.
 * // The first argument in Animation Options callbacks are set to the progress of the animation beteen 0 and 1, while the other arguments are moved 1 right
 *
 * // So, animation options can look like this
 * // `(progress: number, i: number, len: number, el: HTMLElement) => {
 * //   return progress;
 * // }`
 *
 * tweenAttr({
 *      target: "svg path",
 *      d: progress => morph(progress)
 * });
 *
 * // `tweenAttr` can automatically choose between custom easing functions and or normal easings
 * tweenAttr({
 *      target: ".div",
 *      targets: ".el",
 *      width: 250,
 *      height: ["500px", 600],
 *      easing: "spring"
 *
 * // If you want to update styles instead of attributes,
 * // you can change this to "style"
 * }, "style");
 * ```
 *
 * Read more about {@link tween}
 */
export declare const tweenAttr: (options?: IAnimationOptions & TypeCustomEasingOptions, type?: string) => DestroyableAnimate;
