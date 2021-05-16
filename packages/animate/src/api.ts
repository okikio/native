import { EventEmitter, TypeEventInput, TypeListenerCallback } from "@okikio/emitter";
import { Manager } from "@okikio/manager";
import { KeyframeParse, parseOffset } from "./builtin-effects";

/* DOM */
export type TypeAnimationTarget = string | Node | NodeList | HTMLCollection | HTMLElement[] | TypeAnimationTarget[];
export const getElements = (selector: string | Node): Node[] => {
    return typeof selector === "string" ? Array.from(document.querySelectorAll(selector as string)) : [selector];
};

export const flatten = (arr: TypeAnimationTarget[]) => [].concat(...arr);
export const getTargets = (targets: TypeAnimationTarget): Node[] => {
    if (Array.isArray(targets)) {
        return flatten((targets as TypeAnimationTarget[]).map(getTargets));
    }
    if (typeof targets == "string" || targets instanceof Node)
        return getElements(targets);
    if (targets instanceof NodeList || targets instanceof HTMLCollection)
        return Array.from(targets);
    return [];
};

/* VALUES */
// Types
export type TypeCallbackArgs = [number, number, HTMLElement];
export type TypeGeneric = boolean | object | string | number;
export type TypeCSSLikeKeyframe = { [key: string]: Keyframe & ICSSComputedTransformableProperties };
export type TypeKeyFrameOptionsType = TypeCSSLikeKeyframe | Keyframe[] | PropertyIndexedKeyframes;
export type TypeCSSPropertyValue = (string | number)[];
export type TypeComputedAnimationOptions = TypeGeneric | TypeGeneric[] | TypeKeyFrameOptionsType | KeyframeEffectOptions | ICSSComputedTransformableProperties;
export type TypeCallback = (index?: number, total?: number, element?: HTMLElement) => TypeComputedAnimationOptions;
export type TypeAnimationOptionTypes = TypeCallback | TypeComputedAnimationOptions;
export type TypeComputedOptions = { [key: string]: TypeComputedAnimationOptions };

// Functions
export const computeOption = (value: TypeAnimationOptionTypes, args: TypeCallbackArgs, context: Animate): TypeComputedAnimationOptions => {
    if (typeof value === "function") {
        return value.apply(context, args);
    } else return value;
};

export const mapAnimationOptions = (obj: IAnimationOptions, args: TypeCallbackArgs, options: Animate) => {
    let key: string, value: TypeAnimationOptionTypes, result: TypeComputedOptions = {};
    let keys = Object.keys(obj);
    for (let i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        value = obj[key];
        result[key] = computeOption(value, args, options);
    }

    return result;
};

/**
 * From: [https://easings.net]
 *
 * Read More about easings on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/easing)
 *
 * ```ts
 * {
 *     "in": "ease-in",
 *     "out": "ease-out",
 *     "in-out": "ease-in-out",
 *
 *     // Sine
 *     "in-sine": "cubic-bezier(0.47, 0, 0.745, 0.715)",
 *     "out-sine": "cubic-bezier(0.39, 0.575, 0.565, 1)",
 *     "in-out-sine": "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
 *
 *     // Quad
 *     "in-quad": "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
 *     "out-quad": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
 *     "in-out-quad": "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
 *
 *     // Cubic
 *     "in-cubic": "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
 *     "out-cubic": "cubic-bezier(0.215, 0.61, 0.355, 1)",
 *     "in-out-cubic": "cubic-bezier(0.645, 0.045, 0.355, 1)",
 *
 *     // Quart
 *     "in-quart": "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
 *     "out-quart": "cubic-bezier(0.165, 0.84, 0.44, 1)",
 *     "in-out-quart": "cubic-bezier(0.77, 0, 0.175, 1)",
 *
 *     // Quint
 *     "in-quint": "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
 *     "out-quint": "cubic-bezier(0.23, 1, 0.32, 1)",
 *     "in-out-quint": "cubic-bezier(0.86, 0, 0.07, 1)",
 *
 *     // Expo
 *     "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
 *     "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
 *     "in-out-expo": "cubic-bezier(1, 0, 0, 1)",
 *
 *     // Circ
 *     "in-circ": "cubic-bezier(0.6, 0.04, 0.98, 0.335)",
 *     "out-circ": "cubic-bezier(0.075, 0.82, 0.165, 1)",
 *     "in-out-circ": "cubic-bezier(0.785, 0.135, 0.15, 0.86)",
 *
 *     // Back
 *     "in-back": "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
 *     "out-back": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
 *     "in-out-back": "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
 * }
 * ```
 */
export const EASINGS = {
    "in": "ease-in",
    "out": "ease-out",
    "in-out": "ease-in-out",

    // Sine
    "in-sine": "cubic-bezier(0.47, 0, 0.745, 0.715)",
    "out-sine": "cubic-bezier(0.39, 0.575, 0.565, 1)",
    "in-out-sine": "cubic-bezier(0.445, 0.05, 0.55, 0.95)",

    // Quad
    "in-quad": "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
    "out-quad": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    "in-out-quad": "cubic-bezier(0.455, 0.03, 0.515, 0.955)",

    // Cubic
    "in-cubic": "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    "out-cubic": "cubic-bezier(0.215, 0.61, 0.355, 1)",
    "in-out-cubic": "cubic-bezier(0.645, 0.045, 0.355, 1)",

    // Quart
    "in-quart": "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
    "out-quart": "cubic-bezier(0.165, 0.84, 0.44, 1)",
    "in-out-quart": "cubic-bezier(0.77, 0, 0.175, 1)",

    // Quint
    "in-quint": "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
    "out-quint": "cubic-bezier(0.23, 1, 0.32, 1)",
    "in-out-quint": "cubic-bezier(0.86, 0, 0.07, 1)",

    // Expo
    "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
    "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
    "in-out-expo": "cubic-bezier(1, 0, 0, 1)",

    // Circ
    "in-circ": "cubic-bezier(0.6, 0.04, 0.98, 0.335)",
    "out-circ": "cubic-bezier(0.075, 0.82, 0.165, 1)",
    "in-out-circ": "cubic-bezier(0.785, 0.135, 0.15, 0.86)",

    // Back
    "in-back": "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
    "out-back": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    "in-out-back": "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
};

/**
 * The keys of {@link EASINGS}
 *
 * @remark
 * "in", "out", "in-out", "in-sine", "out-sine", "in-out-sine", "in-quad", "out-quad", "in-out-quad", "in-cubic", "out-cubic", "in-out-cubic", "in-quart", "out-quart", "in-out-quart", "in-quint", "out-quint", "in-out-quint", "in-expo", "out-expo", "in-out-expo", "in-circ", "out-circ", "in-out-circ", "in-back", "out-back", "in-out-back"
 */
export const EasingKeys = Object.keys(EASINGS);

/**
 * Converts users input into a usable easing function
 *
 * @param ease - easing functions; {@link EasingKeys}, cubic-bezier, steps, linear, etc...
 * @returns an easing function that `KeyframeEffect` can accept
 */
export const GetEase = (ease: keyof typeof EASINGS | string): string => {
    let search = ease.replace(/^ease-/, ""); // Remove the "ease-" keyword
    return EasingKeys.includes(search) ? EASINGS[search] : ease;
};

export type TypeSingleValueCSSProperty = string | number | TypeCSSPropertyValue;

/**
 * CSS properties the `ParseTransformableCSSProperties` can parse
 */
export interface ICSSTransformableProperties {
    perspective?: TypeSingleValueCSSProperty | TypeCallback,
    rotate?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty> | TypeCallback,
    rotate3d?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty> | TypeCallback,
    rotateX?: TypeSingleValueCSSProperty | TypeCallback,
    rotateY?: TypeSingleValueCSSProperty | TypeCallback,
    rotateZ?: TypeSingleValueCSSProperty | TypeCallback,
    translate?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty> | TypeCallback,
    translate3d?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty> | TypeCallback,
    translateX?: TypeSingleValueCSSProperty | TypeCallback,
    translateY?: TypeSingleValueCSSProperty | TypeCallback,
    translateZ?: TypeSingleValueCSSProperty | TypeCallback,
    scale?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty> | TypeCallback,
    scale3d?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty> | TypeCallback,
    scaleX?: TypeSingleValueCSSProperty | TypeCallback,
    scaleY?: TypeSingleValueCSSProperty | TypeCallback,
    scaleZ?: TypeSingleValueCSSProperty | TypeCallback,
    skew?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty> | TypeCallback,
    skewX?: TypeSingleValueCSSProperty | TypeCallback,
    skewY?: TypeSingleValueCSSProperty | TypeCallback,
    opacity?: TypeSingleValueCSSProperty | TypeCallback,
}

/**
 * Animation options control how an animation is produced, it shouldn't be too different for those who have used `animejs`, or `jquery`'s animate method.
 *
 * @remark
 * An animation option is an object with keys and values that are computed and passed to the `Animate` class to create animations that match the specified options.
 */
export interface IAnimationOptions extends ICSSTransformableProperties {
    /**
     * Determines the DOM elements to animate. You can pass it a CSS selector, DOM elements, or an Array of DOM Elements and/or CSS Selectors.
     */
    target?: TypeAnimationTarget,

    /**
     * Alias of `target`
     * {@link AnimationOptions.target | target }
     */
    targets?: TypeAnimationTarget,

    /**
     * Determines the acceleration curve of your animation. Based on the easings of [easings.net](https://easings.net)
     *
     * Read More about easings on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/easing)
     *
     *
     * | constant | accelerate | decelerate | accelerate-decelerate |
     * | :------- | :--------- | :--------- | :-------------------- |
     * | linear   | in-cubic   | out-cubic  | in-out-cubic          |
     * | ease     | in-quart   | out-quart  | in-out-quart          |
     * |          | in-quint   | out-quint  | in-out-quint          |
     * |          | in-expo    | out-expo   | in-out-expo           |
     * |          | in-circ    | out-circ   | in-out-circ           |
     * |          | in-back    | out-back   | in-out-back           |
     *
     * You can create your own custom cubic-bezier easing curves. Similar to css you type `cubic-bezier(...)` with 4 numbers representing the shape of the bezier curve, for example, `cubic-bezier(0.47, 0, 0.745, 0.715)` this is the bezier curve for `in-sine`.
     *
     * *Note: the `easing` property supports the original values and functions for easing as well, for example, `steps(1)`, and etc... are supported.*
     *
     * @example
     * ```ts
     * // cubic-bezier easing
     * animate({
     *     target: ".div",
     *     easing: "cubic-bezier(0.47, 0, 0.745, 0.715)",
     *
     *     // or
     *     easing: "in-sine",
     *     transform: ["translate(0px)", "translate(500px)"],
     * });
     * ```
     */
    easing?: keyof typeof EASINGS | TypeCallback | string | string[],

    /**
     * Determines the duration of your animation in milliseconds. By passing it a callback, you can define a different duration for each element. The callback takes the index of each element, the target dom element, and the total number of target elements as its argument and returns a number.
     *
     * @example
     * ```ts
     * // First element fades out in 1s, second element in 2s, etc.
     * animate({
     *      target: ".div",
     *      easing: "linear",
     *      duration: 1000,
     *      // or
     *      duration: (index) => (index + 1) * 1000,
     *      opacity: [1, 0],
     * });
     * ```
     */
    duration?: number | string | TypeCallback,

    /**
     * Determines the delay of your animation in milliseconds. By passing it a callback, you can define a different delay for each element. The callback takes the index of each element, the target dom element, and the total number of target elements as its argument and returns a number.
     *
     * @example
     * ```ts
     * // First element starts fading out after 1s, second element after 2s, etc.
     * animate({
     *     target: ".div",
     *     easing: "linear",
     *     delay: 5,
     *     // or
     *     delay: (index) => (index + 1) * 1000,
     *     opacity: [1, 0],
     * });
     * ```
     */
    delay?: number | TypeCallback,

    /**
     * Adds an offset ammount to the `delay`, for creating a timeline similar to `animejs`
     */
    timelineOffset?: number | TypeCallback,

    /**
     * Similar to delay but it indicates the number of milliseconds to delay **after** the full animation has played **not before**.
     *
     * _**Note**: `endDelay` will delay the `onfinish` method and event, but will not reserve the current state of the CSS animation, if you need to use endDelay you may need to use the `fillMode` property to reserve the changes to the animation target._

     * @example
     * ```ts
     * // First element fades out but then after 1s finishes, the second element after 2s, etc.
     * animate({
     *     target: ".div",
     *     easing: "linear",
     *     endDelay: 1000,
     *     // or
     *     endDelay: (index) => (index + 1) * 1000,
     *     opacity: [1, 0],
     * });
     * ```
     */
    endDelay?: number | TypeCallback,

    /**
     *
     * This ensures all `animations` match up to the total duration, and don't finish too early, if animations finish too early when the `.play()` method is called specific animations  that are finished will restart while the rest of the animations will continue playing.
     *
     * _**Note**: you cannot use the `padEndDelay` option and set a value for `endDelay`, the `endDelay` value will replace the padded endDelay_
     */
    padEndDelay?: Boolean,

    /**
     * Determines if the animation should repeat, and how many times it should repeat.
     *
     * @example
     * ```ts
     * // Loop forever
     * animate({
     *     target: ".div",
     *     easing: "linear",
     *     loop: true, // If you want it to continously loop
     *     // or
     *     // loop: 5, // If you want the animation to loop 5 times
     *     opacity: [1, 0],
     * });
     * ```
     */
    loop?: number | boolean | TypeCallback,

    /**
     * Occurs when the animation for one of the targets completes, meaning when animating many targets that finish at different times this will run multiple times. The arguments it takes is slightly different from the rest of the animation options.
     *
     * The animation argument represents the animation for the current target.
     *
     * @param element - the current target element
     * @param index - the index of the current target element in `Animate.prototype.targets`
     * @param total -  the total number of target elements
     * @param animation - the animation of the current target element
     *
     * **Warning**: the order of the callback's arguments are in a different order, with the target element first, and the index second.
     */
    onfinish?: (element?: HTMLElement, index?: number, total?: number, animation?: Animation) => void,

    /**
     * Occurs when the animation for one of the targets is cancelled, meaning when animating many targets that are cancelled at different times this will run multiple times. The arguments it takes is slightly different from the rest of the animation options.
     *
     * The animation argument represents the animation for the current target.
     *
     * @param element - the current target element
     * @param index - the index of the current target element in `Animate.prototype.targets`
     * @param total - the total number of target elements
     * @param animation - the animation of the current target element
     *
     *
     * **Warning**: the order of the callback's arguments are in a different order, with the target element first, and the index second.
     */
    oncancel?: (element?: HTMLElement, index?: number, total?: number, animation?: Animation) => void,

    /**
     *
     * Determines if the animation should automatically play immediately after being instantiated.
     */
    autoplay?: boolean,

    /**
     * Determines the direction of the animation;
     * - `reverse` runs the animation backwards,
     * - `alternate` switches direction after each iteration if the animation loops.
     * - `alternate-reverse` starts the animation at what would be the end of the animation if the direction were
     * - `normal` but then when the animation reaches the beginning of the animation it alternates going back to the position it started at.
     */
    direction?: PlaybackDirection,

    /**
     * Determines the animation playback rate. Useful in the authoring process to speed up some parts of a long sequence (value above 1) or slow down a specific animation to observe it (value between 0 to 1).
     *
     * _**Note**: negative numbers reverse the animation._
     */
    speed?: number | TypeCallback,

    /**
     * Defines how an element should look after the animation.
     *
     * @remark
     * fillMode of:
     * - `none` means the animation's effects are only visible while the animation is playing.
     * - `forwards` the affected element will continue to be rendered in the state of the final animation frame.
     * - `backwards` the animation's effects should be reflected by the element(s) state prior to playing.
     * - `both` combining the effects of both forwards and backwards; The animation's effects should be reflected by the element(s) state prior to playing and retained after the animation has completed playing.
     * - `auto` if the animation effect fill mode is being applied to is a keyframe effect. "auto" is equivalent to "none". Otherwise, the result is "both".
     *
     * You can learn more here on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/fill).

     * _Be careful when using fillMode, it has some problems when it comes to concurrency of animations read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/fill), if browser support were better I would remove fillMode and use Animation.commitStyles, I'll have to change the way `fillMode` functions later. Use the onfinish method to commit styles [onfinish](#onfinish)._
     */
    fillMode?: FillMode,

    /**
     * Another way to input options for an animation, it's also used to chain animations.
     *
     * @remarks
     * The `options` animation option is another way to declare options, it can take an instance of `Animate`, a single `Animate` instance in an Array, e.g. `[Animate]` or an object containing animation options.
     *
     *
     * `options` extends the animation properties of an animation, but more importance is given to the actual animation options object, so, the properties from `options` will be ignored if there is already an animation option with the same name declared.
     *
     *
     * _**Note**: you can't use this property as a method._
     *
     * @example
     * ```ts
     * (async () => {
     *     // animate is Promise-like, as in it has a then() method like a Promise but it isn't a Promise.
     *     // animate resolves to an Array that contains the Animate instance, e.g. [Animate]
     *     let [options] = await animate({
     *         target: ".div",
     *         opacity: [0, 1],
     *     });
     *
     *     animate({
     *         options,
     *
     *         // opacity overrides the opacity property from `options`
     *         opacity: [1, 0],
     *     });
     *
     *     console.log(options); //= Animate
     * })();
     *
     * // or
     * (async () => {
     *     let options = await animate({
     *         target: ".div",
     *         opacity: [0, 1],
     *         duration: 2000,
     *
     *     });
     *
     *     // Remeber, the `options` animation option can handle Arrays with an Animate instance, e.g. [Animate]
     *     // Also, remeber that Animate resolves to an Arrays with an Animate instance, e.g. [Animate]
     *     // Note: the `options` animation option can only handle one Animate instance in an Array and that is alway the first element in the Array
     *     animate({
     *         options,
     *         opacity: [1, 0],
     *     });
     *
     *     console.log(options); //= [Animate]
     * })();
     *
     * // or
     * (async () => {
     *     let options = {
     *         target: ".div",
     *         opacity: [0, 1],
     *     };
     *
     *     await animate(options);
     *     animate({
     *         options,
     *         opacity: [1, 0],
     *     });
     *
     *     console.log(options); //= { ... }
     * })();
     * ```
     */
    options?: IAnimationOptions,

    /**
     * Contols the starting point of certain parts of an animation
     *
     * @remark
     * The offset of the keyframe specified as a number between `0.0` and `1.0` inclusive or null. This is equivalent to specifying start and end states in percentages in CSS stylesheets using @keyframes. If this value is null or missing, the keyframe will be evenly spaced between adjacent keyframes.
     *
     * Read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats)
     *
     * @example
     * ```ts
     * animate({
     *      duration: 2000,
     *      opacity: [ 0, 0.9, 1 ],
     *      easing: [ 'ease-in', 'ease-out' ],
     *
     *      offset: [ "from", 0.8 ], // Shorthand for [ 0, 0.8, 1 ]
     *      // or
     *      offset: [ 0, "80%", "to" ], // Shorthand for [ 0, 0.8, 1 ]
     *      // or
     *      offset: [ "0", "0.8", "to" ], // Shorthand for [ 0, 0.8, 1 ]
     * });
     * ```
     */
    offset?: (number | string)[] | TypeCallback,

    /**
     * Represents the timeline of animation. It exists to pass timeline features to Animations (default is [DocumentTimeline](https://developer.mozilla.org/en-US/docs/Web/API/DocumentTimeline)).
     *
     * As of right now it doesn't contain any features but in the future when other timelines like the [ScrollTimeline](https://drafts.csswg.org/scroll-animations-1/#scrolltimeline), read the Google Developer article for [examples and demos of ScrollTimeLine](https://developers.google.com/web/updates/2018/10/animation-worklet#hooking_into_the_space-time_continuum_scrolltimeline)
     */
    timeline?: AnimationTimeline,

    /**
     * Allows you to manually set keyframes using a `keyframe` array
     *
     * Read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/setKeyframes)
     *
     * @remark
     * An `array` of objects (keyframes) consisting of properties and values to iterate over. This is the canonical format returned by the [getKeyframes()](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/getKeyframes) method.
     *
     * @example
     * ```ts
     * element.animate([
     *   { // from
     *     opacity: 0,
     *     color: "#fff"
     *   },
     *   { // to
     *     opacity: 1,
     *     color: "#000"
     *   }
     * ], 2000);
     * ```
     *
     * Offsets for each keyframe can be specified by providing an `offset` value.

     * @example
     * ```ts
     * element.animate([ { opacity: 1 },
     *                   { opacity: 0.1, offset: 0.7 },
     *                   { opacity: 0 } ],
     *                 2000);
     * ```
     *
     * _**Note**: `offset` values, if provided, must be between 0.0 and 1.0 (inclusive) and arranged in ascending order._
     *
     * It is not necessary to specify an offset for every keyframe. Keyframes without a specified offset will be evenly spaced between adjacent keyframes.
     *
     * ---
     *
     * The easing to apply between keyframes can be specified by providing an easing `value` as illustrated below.
     *
     * _**Note**: the values for easing in keyframes are limited to "ease", "ease-in", "ease-out", "ease-in-out", "linear", "steps(...)", and "cubic-bezier(...)", to get access to the predefined {@link EASINGS | easings}, you will need to use the function {@link GetEase}._

     * @example
     * ```ts
     * element.animate([ { opacity: 1, easing: 'ease-out' },
     *                   { opacity: 0.1, easing: 'ease-in' },
     *                   { opacity: 0 } ],
     *                 2000);
     * ```
     *
     * In this example, the specified easing only applies from the keyframe where it is specified until the next keyframe. Any easing value specified on the options argument, however, applies across a single iteration of the animation — for the entire duration.
     *
     *
     * `@okikio/animate` also offers another format called `CSSLikeKeyframe`,
     * it basically functions the same way CSS `@keyframe` functions
     *
     * @example
     * ```ts
     * animate({
     *      keyframes: {
     *          "from, 50%, to": {
     *              opacity: 1
     *          },
     *
     *          "25%, 0.7": {
     *              opacity: 0
     *          }
     *      }
     * })
     * // Results in a keyframe array like this
     * //= [
     * //=   { opacity: 1, offset: 0 },
     * //=   { opacity: 0, offset: 0.25 },
     * //=   { opacity: 1, offset: 0.5 },
     * //=   { opacity: 0, offset: 0.7 },
     * //=   { opacity: 1, offset: 1 }
     * //= ]
     * ```
     */
    keyframes?: TypeCSSLikeKeyframe | ICSSComputedTransformableProperties[] & Keyframe[] | object[] | TypeCallback,

    /**
     * The properties of the `extend` animation option are not interperted or computed, they are given directly to the `Web Animation API`, as way to access features that haven't been implemented in `@okikio/animate`, for example, `iterationStart`.
     *
     * `extend` is supposed to future proof the library if new features are added to the `Web Animation API` that you want to use, but that has not been implemented yet.
     *
     * _**Note**: it doesn't allow for declaring actual animation keyframes; it's just for animation timing options, and it overrides all other animation timing options that accomplish the same goal, e.g. `loop` & `iterations`, if `iterations` is a property of `extend` then `iterations` will override `loop`._
     *
     * @example
     * ```ts
     * animate({
     *     target: ".div",
     *     opacity: [0, 1],
     *     loop: 5,
     *     extend: {
     *         iterationStart: 0.5,
     *         // etc...
     *         fill: "both", // This overrides fillMode
     *         iteration: 2, // This overrides loop
     *         composite: "add"
     *     }
     * });
     * ```
     */
    extend?: KeyframeEffectOptions | TypeCallback,

    /**
     * Theses are the CSS properties to be animated as Keyframes
     *
     * Read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/setKeyframes)
     *
     * @remark
     * An `object` containing key-value pairs consisting of the property to animate and an `array` of values to iterate over.
     *
     * @example
     * ```ts
     * element.animate({
     *   opacity: [ 0, 1 ],          // [ from, to ]
     *   color:   [ "#fff", "#000" ] // [ from, to ]
     * }, 2000);
     * ```
     *
     * Using this format, the number of elements in each array does not need to be equal. The provided values will be spaced out independently.

     * @example
     * ```ts
     * element.animate({
     *   opacity: [ 0, 1 ], // offset: 0, 1
     *   backgroundColor: [ "red", "yellow", "green" ], // offset: 0, 0.5, 1
     * }, 2000);
     * ```
     *
     * The special keys `offset`, `easing`, and `composite` (described below) may be specified alongside the property values.

     * @example
     * ```ts
     * element.animate({
     *   opacity: [ 0, 0.9, 1 ],
     *   offset: [ 0, 0.8 ], // Shorthand for [ 0, 0.8, 1 ]
     *   easing: [ 'ease-in', 'ease-out' ],
     * }, 2000);
     * ```
     *
     * After generating a suitable set of keyframes from the property value lists, each supplied offset is applied to the corresponding keyframe. If there are insufficient values, or if the list contains `null` values, the keyframes without specified offsets will be evenly spaced as with the array format described above.
     *
     * If there are too few `easing` or `composite` values, the corresponding list will be repeated as needed.
     *
     * _**Note**: to use `composite` you will need to add it to the {@link AnimationOptions.extend | extend} object as an option_
     */
    [property: string]: TypeAnimationOptionTypes,
};

/**
 * CSS properties
 */
export interface ICSSProperties {
    [key: string]: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>
};

/**
 * After being computed as an animation option
 */
export interface ICSSComputedTransformableProperties extends ICSSProperties {
    perspective?: TypeSingleValueCSSProperty,
    rotate?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>,
    rotate3d?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>,
    rotateX?: TypeSingleValueCSSProperty,
    rotateY?: TypeSingleValueCSSProperty,
    rotateZ?: TypeSingleValueCSSProperty,
    translate?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>,
    translate3d?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>,
    translateX?: TypeSingleValueCSSProperty,
    translateY?: TypeSingleValueCSSProperty,
    translateZ?: TypeSingleValueCSSProperty,
    scale?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>,
    scale3d?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>,
    scaleX?: TypeSingleValueCSSProperty,
    scaleY?: TypeSingleValueCSSProperty,
    scaleZ?: TypeSingleValueCSSProperty,
    skew?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>,
    skewX?: TypeSingleValueCSSProperty,
    skewY?: TypeSingleValueCSSProperty,
}

/**
 * The default options for every Animate instance
 *
 * ```ts
 * {
 *   keyframes: [],
 *
 *   loop: 1,
 *   delay: 0,
 *   speed: 1,
 *   endDelay: 0,
 *   easing: "ease",
 *   autoplay: true,
 *   duration: 1000,
 *   fillMode: "none",
 *   direction: "normal",
 *   padEndDelay: false,
 *   extend: {}
 * }
 * ```
 */
export const DefaultAnimationOptions: IAnimationOptions = {
    keyframes: [],
    offset: [],

    loop: 1,
    delay: 0,
    speed: 1,
    endDelay: 0,
    easing: "ease",
    timelineOffset: 0,
    autoplay: true,
    duration: 1000,
    fillMode: "none",
    direction: "normal",
    padEndDelay: false,
    extend: {}
};

export type TypeAnimationEvents = "update" | "play" | "pause" | "begin" | "cancel" | "finish" | "error" | "stop" | "playstate-change";
export type TypePlayStates = "idle" | "running" | "paused" | "finished";

export const parseOptions = (options: IAnimationOptions): IAnimationOptions => {
    let { options: animation, ...rest } = options;
    let oldOptions = animation instanceof Animate ? animation.getOptions() : (Array.isArray(animation) ? animation?.[0]?.getOptions() : animation);
    return Object.assign({}, oldOptions, rest);
}

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
 * Convert the input to an array
 * For strings split them at commas
 * For array do nothing
 * For everything else wrap the input in an array
 */
export const toArr = (input: any): any[] => {
    if (Array.isArray(input) || typeof input == "string") {
        if (typeof input == "string") input = input.split(",");
        return input;
    }

    return [input];
}

/**
 * Checks if value is valid/truthy; it counts empty arrays and strings as falsey,
 * as well as null and undefined everything else is valid
 *
 * _**Note:** 0 counts as valid_
 *
 * @param value - anything
 * @returns true or false
 */
export const isValid = (value: any) => {
    if (Array.isArray(value) || typeof value == "string")
        return Boolean(value.length);
    return value != null && value != undefined;
}

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
export const transpose = (...args: TypeSingleValueCSSProperty[] | TypeSingleValueCSSProperty[][]) => {
    let largestArrLen = 0;
    args = args.map(arr => {
        // Convert all values in arrays to an array
        // This ensures that `arrays` is an array of arrays
        let result = toArr(arr);

        // Finds the largest array
        let len = result.length;
        if (len > largestArrLen) largestArrLen = len;
        return result;
    });

    // Flip the rows and columns of arrays
    let result = [];
    let len = args.length;
    for (let col = 0; col < largestArrLen; col++) {
        result[col] = [];

        for (let row = 0; row < len; row++) {
            let val = args[row][col];
            if (isValid(val))
                result[col][row] = val;
        }
    }

    return result;
}

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
export const CSSArrValue = (arr: TypeSingleValueCSSProperty | TypeSingleValueCSSProperty[], unit: typeof UnitLess) => {
    // This is for the full varients of the transform function as well as the 3d varients
    // zipping the `CSSValue` means if a user enters a string, it will treat each value (seperated by a comma) in that
    // string as a seperate transition state
    return toArr(arr).map(CSSValue(unit)) as TypeSingleValueCSSProperty[];
}

export const TransformFunctionNames = [
    "translate",
    "translate3d",
    "translateX",
    "translateY",
    "translateZ",
    "rotate",
    "rotate3d",
    "rotateX",
    "rotateY",
    "rotateZ",
    "scale",
    "scale3d",
    "scaleX",
    "scaleY",
    "scaleZ",
    "skew",
    "skewX",
    "skewY",
    "perspective"
];

/**
 * Creates the transform property text
 */
export const createTransformProperty = (arr) => {
    let result = "";
    let len = TransformFunctionNames.length;
    for (let i = 0; i < len; i++) {
        let name = TransformFunctionNames[i];
        let value = arr[i];
        if (isValid(value))
            result += `${name}(${Array.isArray(value) ? value.join(", ") : value}) `;
    }

    return result.trim();
}

/** Parses CSSValues without adding any units */
export const UnitLessCSSValue = CSSValue(UnitLess);

/** Parses CSSValues and adds the "px" unit if required */
export const UnitPXCSSValue = CSSValue(UnitPX);

/** Parses CSSValues and adds the "deg" unit if required */
export const UnitDEGCSSValue = CSSValue(UnitDEG);

/**
 * Wrap non array CSS property values in an array
 */
export const CSSPropertiesToArr = (properties: ICSSProperties) => {
    for (let [key, value] of Object.entries(properties)) {
        // Wrap non array values in arrays
        properties[key] = [].concat(value).map(value => `` + value);
    }

    return properties;
};

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
export const ParseTransformableCSSProperties = (properties: ICSSComputedTransformableProperties) => {
    let {
        perspective,
        rotate,
        rotate3d,
        rotateX,
        rotateY,
        rotateZ,
        translate,
        translate3d,
        translateX,
        translateY,
        translateZ,
        scale,
        scale3d,
        scaleX,
        scaleY,
        scaleZ,
        skew,
        skewX,
        skewY,
        ...rest
    } = properties;

    translate = CSSArrValue(translate, UnitPX);
    translate3d = CSSArrValue(translate3d, UnitPX);
    translateX = UnitPXCSSValue(translateX);
    translateY = UnitPXCSSValue(translateY);
    translateZ = UnitPXCSSValue(translateZ);

    rotate = CSSArrValue(rotate, UnitDEG);
    rotate3d = CSSArrValue(rotate3d, UnitLess);
    rotateX = UnitDEGCSSValue(rotateX);
    rotateY = UnitDEGCSSValue(rotateY);
    rotateZ = UnitDEGCSSValue(rotateZ);

    scale = CSSArrValue(scale, UnitLess);
    scale3d = CSSArrValue(scale3d, UnitLess);
    scaleX = UnitLessCSSValue(scaleX);
    scaleY = UnitLessCSSValue(scaleY);
    scaleZ = UnitLessCSSValue(scaleZ);

    skew = CSSArrValue(skew, UnitDEG);
    skewX = UnitDEGCSSValue(skewX);
    skewY = UnitDEGCSSValue(skewY);

    perspective = UnitPXCSSValue(perspective);

    let transform = transpose(
        translate, translate3d, translateX, translateY, translateZ,
        rotate, rotate3d, rotateX, rotateY, rotateZ,
        scale, scale3d, scaleX, scaleY, scaleZ,
        skew, skewX, skewY,
        perspective
    ).map(createTransformProperty);

    rest = CSSPropertiesToArr(rest);
    return Object.assign({},
        isValid(transform) ? { transform } : null,
        rest);
}

/**
 * Similar to {@link ParseTransformableCSSProperties} except it transforms the CSS properties in each Keyframe
 * @param keyframes - an array of keyframes with transformable CSS properties
 * @returns
 * an array of keyframes, with transformed CSS properties
 */
export const ParseTransformableCSSKeyframes = (keyframes: ICSSComputedTransformableProperties[]) => {
    return keyframes.map(properties => {
        let {
            translate,
            translate3d,
            translateX,
            translateY,
            translateZ,
            rotate,
            rotate3d,
            rotateX,
            rotateY,
            rotateZ,
            scale,
            scale3d,
            scaleX,
            scaleY,
            scaleZ,
            skew,
            skewX,
            skewY,
            perspective,
            ...rest
        } = properties;

        translate = UnitPXCSSValue(translate as TypeSingleValueCSSProperty);
        translate3d = UnitPXCSSValue(translate3d as TypeSingleValueCSSProperty);
        translateX = UnitPXCSSValue(translateX)[0];
        translateY = UnitPXCSSValue(translateY)[0];
        translateZ = UnitPXCSSValue(translateZ)[0];

        rotate = UnitDEGCSSValue(rotate as TypeSingleValueCSSProperty);
        rotate3d = UnitLessCSSValue(rotate3d as TypeSingleValueCSSProperty);
        rotateX = UnitDEGCSSValue(rotateX)[0];
        rotateY = UnitDEGCSSValue(rotateY)[0];
        rotateZ = UnitDEGCSSValue(rotateZ)[0];

        scale = UnitLessCSSValue(scale as TypeSingleValueCSSProperty);
        scale3d = UnitLessCSSValue(scale3d as TypeSingleValueCSSProperty);
        scaleX = UnitLessCSSValue(scaleX)[0];
        scaleY = UnitLessCSSValue(scaleY)[0];
        scaleZ = UnitLessCSSValue(scaleZ)[0];

        skew = UnitDEGCSSValue(skew as TypeSingleValueCSSProperty);
        skewX = UnitDEGCSSValue(skewX)[0];
        skewY = UnitDEGCSSValue(skewY)[0];

        perspective = UnitPXCSSValue(perspective)[0];

        return [
            rest,
            translate, translate3d, translateX, translateY, translateZ,
            rotate, rotate3d, rotateX, rotateY, rotateZ,
            scale, scale3d, scaleX, scaleY, scaleZ,
            skew, skewX, skewY,
            perspective
        ];
    }).map(([rest, ...transformFunctions]) => {
        let transform = createTransformProperty(transformFunctions);
        rest = CSSPropertiesToArr(rest as ICSSProperties);
        return Object.assign({},
            isValid(transform) ? { transform } : null,
            rest);
    });
}

/**
 * An animation library for the modern web, which. Inspired by animate plus, and animejs, [@okikio/animate](https://www.skypack.dev/view/@okikio/animate) is a Javascript animation library focused on performance and ease of use.
 *
 * You can check it out here: <https://codepen.io/okikio/pen/qBbdGaW?editors=0011>
 */
export class Animate {
    /**
     * Stores the options for the current animation
     *
     * @inheritDoc DefaultAnimationOptions
     */
    public options: IAnimationOptions = {};

    /**
     * The list of Elements to Animate
     */
    public targets: Manager<number, Node> = new Manager();

    /**
     * The properties to animate
     */
    public properties: object = {};

    /**
     * A Manager of Animations
     */
    public animations: Manager<HTMLElement, Animation> = new Manager();

    /**
     * A Manager of KeyFrameEffects
     */
    public keyframeEffects: Manager<Animation, KeyframeEffect> = new Manager();

    /**
     * The total duration of all Animation's
     */
    public totalDuration: number = 0;

    /**
     * The smallest delay out of all Animation's
     */
    public minDelay: number = 0;

    /**
     * The largest speed out of all Animation's
     */
    public maxSpeed: number = 0;

    /**
     * The options for individual animations
     *
     * A Manager that stores all the fully calculated options for individual Animation instances.
     *
     * _**Note**: the computedOptions are changed to their proper Animation instance options, so, some of the names are different, and options that can't be computed are not present. E.g. fillMode in the animation options is now just fill in the computedOptions.*_
     *
     * _**Note**: keyframes are not included, both the array form and the object form; the options, speed, extend, padEndDelay, and autoplay animation options are not included_
     */
    public computedOptions: Manager<Animation, TypeComputedOptions> = new Manager();

    /**
     * The keyframes for individual animations
     *
     * A Manager that stores all the fully calculated keyframes for individual Animation instances.
     *
     * _**Note**: the computedKeyframes are changed to their proper Animation instance options, so, some of the names are different, and options that can't be computed are not present. E.g. translateX, skew, etc..., they've all been turned into the transform property.*_
     */
    public computedKeyframes: Manager<Animation, TypeKeyFrameOptionsType> = new Manager();

    /**
     * The Element the mainAnimation runs on
     */
    public mainElement: HTMLElement;

    /**
     * Stores an animation that runs on the total duration of all the `Animation` instances, and as such it's the main Animation.
     */
    public mainAnimation: Animation;

    /**
     * The Keyframe Effect for the mainAnimation
     */
    public mainkeyframeEffect: KeyframeEffect;

    /**
     * Stores request frame calls
     */
    public animationFrame: number;

    /**
     * An event emitter
     */
    public emitter: EventEmitter = new EventEmitter();

    /**
     * Returns a promise that is fulfilled when the mainAnimation is finished
     */
    public promise: Promise<Animate[]>;
    constructor(options: IAnimationOptions) {
        this.loop = this.loop.bind(this);
        this.updateOptions(options);
    }

    /**
     * Returns a new Promise that is resolved when the animation finishes
     */
    public newPromise(): Promise<Animate[]> {
        this.promise = new Promise((resolve, reject) => {
            /*
                Note that the `this` keyword is in an Array when it is resolved,
                this is due to Promises not wanting to resolve references,
                so, you can't resolve `this` directly, so, I chose to resolve `this` in an
                Array

                Note: the `resolve` method by default will only run once so to avoid
            */
            this?.emitter?.once?.("finish", () => resolve([this]));
            this?.emitter?.once?.("error", err => reject(err));
        });

        return this.promise;
    }

    /**
     * Fulfills the `this.promise` Promise
     */
    public then(
        onFulfilled?: (value?: any) => any,
        onRejected?: (reason?: any) => any
    ): Animate {
        onFulfilled = onFulfilled?.bind(this);
        onRejected = onRejected?.bind(this);
        this?.promise?.then?.(onFulfilled, onRejected);
        return this;
    }

    /**
     * Catches error that occur in the `this.promise` Promise
     */
    public catch(onRejected: (reason?: any) => any): Animate {
        onRejected = onRejected?.bind(this);
        this.promise?.catch?.(onRejected);
        return this;
    }

    /**
     * If you don't care if the `this.promise` Promise has either been rejected or resolved
     */
    public finally(onFinally: () => any): Animate {
        onFinally = onFinally?.bind(this);
        this.promise?.finally?.(onFinally);
        return this;
    }

    /**
     * Represents an Animation Frame Loop
     */
    public loop(): void {
        this.stopLoop();
        this.emit("update", this.getProgress(), this);
        this.animationFrame = window.requestAnimationFrame(this.loop);
    }

    /**
     * Cancels animation frame
     */
    public stopLoop() {
        window.cancelAnimationFrame(this.animationFrame);
    }

    /**
     * Calls a method that affects all animations **excluding** the mainAnimation; the method only allows the animation parameter
    */
    public allAnimations(method: (animation?: Animation, target?: HTMLElement) => void) {
        this.animations.forEach(method);
        return this;
    }

    /**
     * Calls a method that affects all animations **including** the mainAnimation; the method only allows the animation parameter
    */
    public all(method: (animation?: Animation, target?: HTMLElement) => void) {
        this.mainAnimation && method(this.mainAnimation, this.mainElement);
        this.allAnimations(method);
        return this;
    }

    /**
     * Register the begin event
     */
    protected beginEvent() {
        if (this.getProgress() == 0)
            this.emit("begin", this);
    }

    /**
     * Play Animation
     */
    public play(): Animate {
        let playstate = this.getPlayState();
        this.beginEvent();
        this.all(anim => anim.play());
        this.emit("play", playstate, this);
        if (!this.is(playstate))
            this.emit("playstate-change", playstate, this);
        this.loop();
        return this;
    }

    /**
     * Pause Animation
     */
    public pause(): Animate {
        let playstate = this.getPlayState();
        this.all(anim => anim.pause());
        this.emit("pause", playstate, this);
        if (!this.is(playstate))
            this.emit("playstate-change", playstate, this);
        this.stopLoop();
        this.animationFrame = undefined;
        return this;
    }

    /**
     * Reverse Animation
     */
    public reverse() {
        this.all(anim => anim.reverse());
        return this;
    }

    /**
     * Reset all Animations
     */
    public reset() {
        this.setProgress(0);

        if (this.options.autoplay) this.play();
        else this.pause();
        return this;
    }

    /**
     * Cancels all Animations
     */
    public cancel() {
        this.all(anim => anim.cancel());
        return this;
    }

    /**
     * Force complete all Animations
     */
    public finish() {
        this.all(anim => anim.finish());
        return this;
    }

    /**
     * Cancels & Clears all Animations
     */
    public stop() {
        this.cancel();
        this.computedOptions.clear();
        this.animations.clear();
        this.keyframeEffects.clear();
        this.targets.clear();

        this.mainkeyframeEffect = undefined;
        this.mainAnimation = undefined;
        this.mainElement = undefined;

        this.emit("stop");
        this.emitter.clear();

        this.promise = undefined;
        this.computedOptions = undefined;
        this.animations = undefined;
        this.keyframeEffects = undefined;
        this.emitter = undefined;
        this.targets = undefined;
        this.options = undefined;
    }

    /**
     * Returns an Manager instance for targets
     */
    public getTargets() {
        return this.targets.values();
    }

    /**
     * Get a specific Animation from an Animate instance
     */
    public getAnimation(element: HTMLElement): Animation {
        return this.animations.get(element);
    }

    /**
     * Get a specific Animation's KeyframeEffect from an Animate instance
     */
    public getKeyframeEffect(animation: Animation): KeyframeEffect {
        return this.keyframeEffects.get(animation);
    }

    /**
     * Returns the timings of an Animation, given a target
     * E.g. { duration, endDelay, delay, iterations, iterationStart, direction, easing, fill, etc... }
     */
    public getTiming(target: HTMLElement | Animation): TypeComputedAnimationOptions {
        let animation = target instanceof Animation ? target : this.getAnimation(target);
        let keyframeOptions = this.computedOptions.get(animation) ?? {};
        let timings = this.getKeyframeEffect(animation).getTiming?.() ?? {};
        let options = this.getOptions();

        return { ...DefaultAnimationOptions, ...options, ...timings, ...keyframeOptions };
    }

    /**
     * Returns the total duration of Animation
     */
    public getTotalDuration(): number {
        return this.totalDuration;
    }

    /**
     * Returns the current time of the Main Animation
     */
    public getCurrentTime(): number {
        return this.mainAnimation.currentTime;
    }

    /**
     * Returns the Animation progress as a fraction of the current time / duration * 100
     */
    public getProgress() {
        return (this.getCurrentTime() / this.totalDuration) * 100;
    }

    /**
     * Return the playback speed of the animation
     */
    public getSpeed(): number {
        return this.mainAnimation.playbackRate;
    }

    /**
     * Returns the current playing state
     */
    public getPlayState(): TypePlayStates {
        return this.mainAnimation.playState;
    }

    /**
     * Get the options of an Animate instance
     */
    public getOptions(): IAnimationOptions {
        return this.options;
    }

    /**
     * Get the computed options object for a specific target
     */
    public getComputedOption(target: HTMLElement | Animation): IAnimationOptions {
        let animation = target instanceof Animation ? target : this.getAnimation(target);
        return this.computedOptions.get(animation);
    }

    /**
     * Returns a boolean determining if the `animate` instances playstate is equal to the `playstate` parameter.
     */
    public is(playstate: TypePlayStates) {
        return this.getPlayState() == playstate;
    }

    /**
     * Set the current time of the Main Animation
     */
    public setCurrentTime(time: number): Animate {
        this.all(anim => { anim.currentTime = time; });
        this.emit("update", this.getProgress());
        return this;
    }

    /**
     * Set the Animation progress as a value from 0 to 100
     */
    public setProgress(percent: number): Animate {
        let time = (percent / 100) * this.totalDuration;
        this.setCurrentTime(time);
        return this;
    }

    /**
     * Set the playback speed of an Animation
     */
    public setSpeed(speed: number = 1): Animate {
        this.maxSpeed = speed;
        this.all(anim => {
            if (anim.updatePlaybackRate)
                anim.updatePlaybackRate(speed);
            else anim.playbackRate = speed;
        });
        return this;
    }

    /**
     * Update the options for all targets set in the constructor
     *
     * _**Note**: `KeyframeEffect` support is really low, so, I am suggest that you avoid using the `updateOptions` method, until browser support for `KeyframeEffect.updateTiming(...)` and `KeyframeEffefct.setKeyframes(...)` is better_
     *
     * @beta
     */
    public updateOptions(options: IAnimationOptions = {}) {
        try {
            this.options = Object.assign({}, DefaultAnimationOptions, this.options, parseOptions(options));

            let {
                loop,
                delay,
                speed,
                easing,
                timelineOffset,
                endDelay,
                duration,
                direction,
                fillMode,
                onfinish,
                oncancel,
                keyframes,
                autoplay,
                target,
                targets: _targets,
                padEndDelay,
                extend,

                /**
                 * Theses are the CSS properties to be animated as Keyframes
                 */
                ...properties
            } = this.options;

            let targets = new Set([...this.getTargets(), ...getTargets(_targets), ...getTargets(target)]);
            this.targets = new Manager();
            this.properties = properties;

            targets.forEach(value => this.targets.add(value));

            let delayArr = [];
            let speedArr = [];
            let len = this.targets.size;
            let listofComputedOptions = [];
            let oldTotalDuration = this.totalDuration;
            let animationOptions: IAnimationOptions = {
                easing: typeof easing == "string" ? GetEase(easing) : easing,
                iterations: loop === true ? Infinity : (loop as number),
                direction,
                endDelay,
                duration,
                speed,
                delay,
                timelineOffset,
                fill: fillMode,
                ...extend
            };

            this.targets.forEach((target: HTMLElement, i) => {
                // Allows the use of functions as the values, for both the keyframes and the animation object
                // It adds the capability of advanced stagger animation, similar to the animejs stagger functions
                let computedOptions = mapAnimationOptions(animationOptions, [i, len, target], this);

                // Add timelineOffset to delay, this is future proofing;
                // if you want to create a custom timeline similar to animejs this will help you
                // I don't intend to make a timeline function for this project
                let { timelineOffset, ...remainingComputedOptions } = computedOptions;

                (remainingComputedOptions.delay as number) += timelineOffset as number;
                remainingComputedOptions.tempDurations = +remainingComputedOptions.delay +
                    (+remainingComputedOptions.duration * +remainingComputedOptions.iterations) +
                    +remainingComputedOptions.endDelay;

                // Set the Animate class's duration to be the Animation with the largest totalDuration
                if (this.totalDuration < +remainingComputedOptions.tempDurations) {
                    this.totalDuration = +remainingComputedOptions.tempDurations;
                }

                listofComputedOptions[i] = remainingComputedOptions;
                delayArr.push(remainingComputedOptions.delay);
                speedArr.push(remainingComputedOptions.speed);
            });

            this.targets.forEach((target: HTMLElement, i) => {
                let { speed: $speed, tempDurations, ...computedOptions }: IAnimationOptions = listofComputedOptions[i];
                let animationKeyframe: TypeKeyFrameOptionsType;
                let computedKeyframes: Keyframe[] | PropertyIndexedKeyframes;

                // You cannot use the `padEndDelay` option and set a value for `endDelay`, the `endDelay` value will
                // replace the padded endDelay

                // This ensures all `animations` match up to the total duration, and don't finish too early,
                // if animations finish too early, when the `.play()` method is called, some animations
                // that are finished will restart, while the rest will continue playing.
                // This is mostly for progress control, but depending on your usage may truly benefit you
                if (padEndDelay && computedOptions.endDelay == 0 && Math.abs(+computedOptions.iterations) != Math.abs(Infinity)) {
                    computedOptions.endDelay = this.totalDuration - (tempDurations as number);
                }

                // Accept keyframes as a keyframes Object, or a method,
                // if there are no animations in the keyframes array,
                // uses css properties from the options object
                let arrKeyframes = computeOption(keyframes, [i, len, target], this) as (Keyframe[] | TypeCSSLikeKeyframe);
                if (typeof arrKeyframes == "object")
                    arrKeyframes = KeyframeParse(arrKeyframes);
                animationKeyframe = isValid(arrKeyframes) ? arrKeyframes as Keyframe[] : (properties as PropertyIndexedKeyframes);

                // If keyframes isn't defined as an animation option, use CSS properties as keyframes
                if (!Array.isArray(animationKeyframe)) {
                    let { offset, ...CSSProperties } = mapAnimationOptions(animationKeyframe as IAnimationOptions, [i, len, target], this);
                    let $offset = offset as (string | number)[];

                    // transform, is often used so, to make them easier to use we parse them for strings, number, and/or arrays of both;
                    // for transform we parse the translate, skew, scale, and perspective functions (including all their varients) as CSS properties;
                    // it then turns these properties into valid `PropertyIndexedKeyframes`
                    // Read the documentation for `ParseTransformableCSSProperties`
                    CSSProperties = ParseTransformableCSSProperties(CSSProperties as ICSSComputedTransformableProperties);
                    computedKeyframes = Object.assign({},
                        // Remove the offset effect option if it's not valid
                        isValid($offset) ? { offset: $offset.map(parseOffset) } : null,
                        CSSProperties
                    ) as PropertyIndexedKeyframes;
                } else {
                    // Validate keyframe effect options
                    computedKeyframes = animationKeyframe.map((keyframe: Keyframe & { loop: boolean | number }) => {
                        let { speed, loop, easing, offset, ...rest } = keyframe; // Remove `speed`, it's not a valid CSS property

                        return {
                            easing: typeof easing == "string" ? GetEase(easing) : easing,
                            iterations: (loop as boolean) === true ? Infinity : (loop as number),
                            offset: parseOffset(offset),
                            ...rest
                        };
                    });

                    // Transform transformable CSS properties in each keyframe of the keyframe array
                    computedKeyframes = ParseTransformableCSSKeyframes(computedKeyframes) as Keyframe[];
                }

                let animation: Animation, keyFrameEffect: KeyframeEffect;
                if (!this.animations.has(target)) {
                    // Create animation and add it to the Animations Set
                    keyFrameEffect = new KeyframeEffect(target, computedKeyframes, computedOptions as KeyframeAnimationOptions);
                    animation = new Animation(keyFrameEffect, computedOptions.timeline);

                    this.animations.set(target, animation);
                    this.keyframeEffects.set(animation, keyFrameEffect);
                } else {
                    // Update the animation
                    animation = this.getAnimation(target);
                    keyFrameEffect = this.getKeyframeEffect(animation);

                    keyFrameEffect?.setKeyframes?.(computedKeyframes);
                    keyFrameEffect?.updateTiming?.(computedOptions as KeyframeAnimationOptions);
                }

                animation.playbackRate = $speed as number;

                // Support for on finish
                animation.onfinish = () => {
                    typeof onfinish == "function" && onfinish.call(this, target, i, len, animation);
                };

                // Support for on cancel
                animation.oncancel = () => {
                    typeof oncancel == "function" && oncancel.call(this, target, i, len, animation);
                };

                // Set the calculated options & keyframes for each individual animation
                this.computedOptions.set(animation, computedOptions);
                this.computedKeyframes.set(animation, computedKeyframes);
            });

            if (!this.mainAnimation) {
                this.mainkeyframeEffect = new KeyframeEffect(this.mainElement, [
                    { opacity: "0" },
                    { opacity: "1" }
                ], {
                    // Why waste performance on an animation no one can see?
                    duration: this.totalDuration,
                    easing: "linear"
                });

                this.mainAnimation = new Animation(this.mainkeyframeEffect, this.options.timeline);
                this.mainAnimation.onfinish = () => {
                    let playstate = this.getPlayState();
                    this.emit("finish", playstate, this);
                    if (!this.is(playstate))
                        this.emit("playstate-change", playstate, this);
                    this.stopLoop();
                };

                this.mainAnimation.oncancel = () => {
                    let playstate = this.getPlayState();
                    this.emit("cancel", playstate, this);
                    if (!this.is(playstate))
                        this.emit("playstate-change", playstate, this);
                    this.stopLoop();
                };
            } else if (oldTotalDuration !== this.totalDuration) {
                this.mainkeyframeEffect?.updateTiming?.({
                    duration: this.totalDuration
                });

                if (!this.mainkeyframeEffect.setKeyframes || !this.mainkeyframeEffect.updateTiming)
                    console.error("@okikio/animate - `KeyframeEffect.setKeyframes` and/or `KeyframeEffect.updateTiming` are not supported in this browser.");
            }

            this.minDelay = Math.min(...delayArr);
            this.maxSpeed = Math.min(...speedArr);;
            this.mainAnimation.playbackRate = this.maxSpeed;

            if (autoplay) {
                // By the time events are registered the animation would have started and there wouldn't have be a `begin` event listener to actually emit
                // So, this defers the emitting for a 0ms time allowing the rest of the js to run, the `begin` event to be registered thus
                // the `begin` event can be emitter
                let timer: number | void = window.setTimeout(() => {
                    this.emit("begin", this);
                    timer = window.clearTimeout(timer as number);
                }, 0);

                this.play();
            } else this.pause();

            this.newPromise();
        } catch (err) {
            this.emit("error", err);
        }
    }

    /**
     * Adds a listener for a given event
     */
    public on(events: TypeAnimationEvents[] | TypeAnimationEvents | TypeEventInput, callback?: TypeListenerCallback | object, scope?: object): Animate {
        this?.emitter?.on(events, callback, scope ?? this);
        return this;
    }

    /**
     * Removes a listener from an event
     */
    public off(events: TypeAnimationEvents[] | TypeAnimationEvents | TypeEventInput, callback?: TypeListenerCallback | object, scope?: object): Animate {
        this?.emitter?.off(events, callback, scope ?? this);
        return this;
    }

    /**
     * Call all listeners within an event
     */
    public emit(events: TypeAnimationEvents[] | TypeAnimationEvents | string | any[], ...args: any): Animate {
        this?.emitter?.emit(events, ...args);
        return this;
    }

    /** Returns the Animate options, as JSON  */
    public toJSON(): IAnimationOptions {
        return this.getOptions();
    }

    /**
     * The Symbol.toStringTag well-known symbol is a string valued property that is used
     * in the creation of the default string description of an object.
     * It is accessed internally by the Object.prototype.toString() method.
     */
    get [Symbol.toStringTag]() {
        return `Animate`;
    }
}

/**
 * Creates a new Animate instance
 *
 * @remark
 * `@okikio/animate` create animations by creating instances of `Animate`, a class that acts as a wrapper around the Web Animation API. To create new instances of the `Animate` class, you can either import the `Animate` class and do this, `new Animate({ ... })` or import the `animate` (lowercase) method and do this, `animate({ ... })`. The `animate` method creates new instances of the `Animate` class and passes the options it recieves as arguments to the `Animate` class.
 *
 * The `Animate` class recieves a set of targets to animate, it then creates a list of Web Animation API `Animation` instances, along side a main animation, which is small `Animation` instance that is set to animate the opacity of a non visible element, the `Animate` class then plays each `Animation` instances keyframes including the main animation.

 * The main animation is there to ensure accuracy in different browser vendor implementation of the Web Animation API. The main animation is stored in `Animate.prototype.mainAnimation: Animation`, the other `Animation` instances are stored in a `Manager` (from [@okikio/manager](https://www.npmjs.com/package/@okikio/manager)) `Animate.prototype.animations: Manager<HTMLElement, Animation>`.

 * @example
 * ```ts
 * import animate from "@okikio/animate";
 *
 * // Do note, on the web you need to do this, if you installed it via the script tag:
 * // const { animate } = window.animate;
 *
 * (async () => {
 *     let [options] = await animate({
 *         target: ".div",
 *         // NOTE: If you turn this on you have to comment out the transform property. The keyframes property is a different format for animation you cannot you both styles of formatting in the same animation
 *         // keyframes: [
 *         //     { transform: "translateX(0px)" },
 *         //     { transform: "translateX(300px)" }
 *         // ],
 *         transform: ["translateX(0px)", "translateX(300px)"],
 *         easing: "out",
 *         duration(i) {
 *             return (i + 1) * 500;
 *         },
 *         loop: 1,
 *         speed: 2,
 *         fillMode: "both",
 *         direction: "normal",
 *         autoplay: true,
 *         delay(i) {
 *             return (i + 1) * 100;
 *         },
 *         endDelay(i) {
 *             return (i + 1) * 100;
 *         },
 *     });
 *
 *     animate({
 *         options,
 *         transform: ["translateX(300px)", "translateX(0px)"],
 *     });
 * })();
 *
 * // or you can use the .then() method
 * animate({
 *     target: ".div",
 *     // NOTE: If you turn this on you have to comment out the transform property. The keyframes property is a different format for animation you cannot you both styles of formatting in the same animation
 *     // keyframes: [
 *     //     { transform: "translateX(0px)" },
 *     //     { transform: "translateX(300px)" }
 *     // ],
 *     transform: ["translateX(0px)", "translateX(300px)"],
 *     easing: "out",
 *     duration(i) {
 *         return (i + 1) * 500;
 *     },
 *     loop: 1,
 *     speed: 2,
 *     fillMode: "both",
 *     direction: "normal",
 *     delay(i) {
 *         return (i + 1) * 100;
 *     },
 *     autoplay: true,
 *     endDelay(i) {
 *         return (i + 1) * 100;
 *     }
 * }).then((options) => {
 *     animate({
 *         options,
 *         transform: ["translateX(300px)", "translateX(0px)"]
 *     });
 * });
 * ```
 *
 * [Preview this example &#8594;](https://codepen.io/okikio/pen/mdPwNbJ?editors=0010)
 *
 * @packageDocumentation
 */
export const animate = (options: IAnimationOptions = {}): Animate => {
    return new Animate(options);
};

export * from "./builtin-effects";
export default animate;
