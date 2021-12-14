import { Animate } from "./animate";
import { Manager } from "@okikio/manager";
import type { IAnimateInstanceConfig } from "./types";
import type { TypeCustomEasingOptions } from "./custom-easing";
import type { TypeListenerCallback } from "@okikio/emitter";
/** Keeps track of how many empty tween elements are in use */
export declare let UIDCount: number;
/** For better performance push empty elements into `EmptyTweenElContainer` */
export declare const EmptyTweenElContainer: HTMLElement;
/** Creates a new empty tween element */
export declare const createEmptyEl: () => HTMLDivElement;
/** Extends {@link Animate} stop method, so, it automatically removes the target elements from the dom */
export declare class DestroyableAnimate extends Animate {
    stop(): void;
}
/**
 * - create a empty new element,
 * - attach it to the DOM,
 * - animate the opacity of said element
 * - You can then use the "update" event to watch for changes in opacity and use the opacity as a progress bar of values between 0 to 1
*/
export declare const createTweenOptions: (options?: IAnimateInstanceConfig & TypeCustomEasingOptions) => IAnimateInstanceConfig;
/**
 * Uses the change in opacity of empty elements (created by {@link createTweenOptions}) to interpolate the attributes of other elements
 *
 * e.g.
 * ```ts
 * import { AnimateAttributes } from "@okikio/animate";
 * import { interpolate } from "polymorph-js";
 *
 * let startPath = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
 * let endPath = "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z";
 *
 * // This is an svg path interpolate function
 * // If used in tandem with `AnimateAttributes`, you can create morphing animations
 * let morph = interpolate([startPath, endPath], {
 *      addPoints: 0,
 *      origin: { x: 0, y: 0 },
 *      optimize: "fill",
 *      precision: 3
 * });
 *
 * // `AnimateAttributes` supports all Animation Options with some restrictions and things to note.
 * // 1. Callbacks - the first argument in Animation Options callbacks are set to the progress of the animation beteen 0 and 1, while the other arguments are moved 1 right
 *
 * // So, animation options can look like this
 * // `(progress: number, i: number, len: number, el: HTMLElement) => {
 * //   return progress;
 * // }
 *
 * // 2. Custom easing by default - `easing`, `decimal`, `numPoints`, etc... from `CustomEasing` are supported, meaning you can use any easing function you want, including `spring`, etc... without calling `CustomEasing` on the property you want to apply custom easing to
 * // 3. You can use `.updateOptions(...)` to update the animation options of tweens
 *
 * new AnimateAttributes({
 *      target: "svg path",
 *      d: progress => morph(progress)
 * });
 * ```
 *
 * You can use {@link tweenAttr} as a fast way to create new instances of `AnimateAttributes`
 */
export declare class AnimateAttributes extends DestroyableAnimate {
    /**
     * Stores all updateListeners for the corresponding tweens, to avoid leaving unused listeners
     */
    updateListeners: Manager<number, TypeListenerCallback>;
    updateOptions(options?: IAnimateInstanceConfig & TypeCustomEasingOptions): this;
}
/**
 * Creates new instances of {@link AnimateAttributes}
 */
export declare const tweenAttr: (options?: IAnimateInstanceConfig & TypeCustomEasingOptions) => AnimateAttributes;
