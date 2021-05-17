import { EventEmitter, TypeEventInput, TypeListenerCallback } from "@okikio/emitter";
import { Manager } from "@okikio/manager";
export declare type TypeAnimationTarget = string | Node | NodeList | HTMLCollection | HTMLElement[] | TypeAnimationTarget[];
export declare const getElements: (selector: string | Node) => Node[];
export declare const flatten: (arr: TypeAnimationTarget[]) => any[];
export declare const getTargets: (targets: TypeAnimationTarget) => Node[];
export declare type TypeCallbackArgs = [number, number, HTMLElement];
export declare type TypeGeneric = boolean | object | string | number;
export declare type TypeCSSLikeKeyframe = {
    [key: string]: Keyframe & ICSSComputedTransformableProperties;
};
export declare type TypeKeyFrameOptionsType = TypeCSSLikeKeyframe | Keyframe[] | PropertyIndexedKeyframes;
export declare type TypeCSSPropertyValue = (string | number)[];
export declare type TypeComputedAnimationOptions = TypeGeneric | TypeGeneric[] | TypeKeyFrameOptionsType | KeyframeEffectOptions | ICSSComputedTransformableProperties;
export declare type TypeCallback = (index?: number, total?: number, element?: HTMLElement) => TypeComputedAnimationOptions;
export declare type TypeAnimationOptionTypes = TypeCallback | TypeComputedAnimationOptions;
export declare type TypeComputedOptions = {
    [key: string]: TypeComputedAnimationOptions;
};
export declare const computeOption: (value: TypeAnimationOptionTypes, args: TypeCallbackArgs, context: Animate) => TypeComputedAnimationOptions;
export declare const mapAnimationOptions: (obj: IAnimationOptions, args: TypeCallbackArgs, options: Animate) => TypeComputedOptions;
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
export declare const EASINGS: {
    in: string;
    out: string;
    "in-out": string;
    "in-sine": string;
    "out-sine": string;
    "in-out-sine": string;
    "in-quad": string;
    "out-quad": string;
    "in-out-quad": string;
    "in-cubic": string;
    "out-cubic": string;
    "in-out-cubic": string;
    "in-quart": string;
    "out-quart": string;
    "in-out-quart": string;
    "in-quint": string;
    "out-quint": string;
    "in-out-quint": string;
    "in-expo": string;
    "out-expo": string;
    "in-out-expo": string;
    "in-circ": string;
    "out-circ": string;
    "in-out-circ": string;
    "in-back": string;
    "out-back": string;
    "in-out-back": string;
};
/**
 * The keys of {@link EASINGS}
 *
 * @remark
 * "in", "out", "in-out", "in-sine", "out-sine", "in-out-sine", "in-quad", "out-quad", "in-out-quad", "in-cubic", "out-cubic", "in-out-cubic", "in-quart", "out-quart", "in-out-quart", "in-quint", "out-quint", "in-out-quint", "in-expo", "out-expo", "in-out-expo", "in-circ", "out-circ", "in-out-circ", "in-back", "out-back", "in-out-back"
 */
export declare const EasingKeys: string[];
/**
 * Converts users input into a usable easing function
 *
 * @param ease - easing functions; {@link EasingKeys}, cubic-bezier, steps, linear, etc...
 * @returns an easing function that `KeyframeEffect` can accept
 */
export declare const GetEase: (ease: keyof typeof EASINGS | string) => string;
export declare type TypeSingleValueCSSProperty = string | number | TypeCSSPropertyValue;
/**
 * CSS properties the `ParseTransformableCSSProperties` can parse
 */
export interface ICSSTransformableProperties {
    perspective?: TypeSingleValueCSSProperty | TypeCallback;
    rotate?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty> | TypeCallback;
    rotate3d?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty> | TypeCallback;
    rotateX?: TypeSingleValueCSSProperty | TypeCallback;
    rotateY?: TypeSingleValueCSSProperty | TypeCallback;
    rotateZ?: TypeSingleValueCSSProperty | TypeCallback;
    translate?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty> | TypeCallback;
    translate3d?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty> | TypeCallback;
    translateX?: TypeSingleValueCSSProperty | TypeCallback;
    translateY?: TypeSingleValueCSSProperty | TypeCallback;
    translateZ?: TypeSingleValueCSSProperty | TypeCallback;
    scale?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty> | TypeCallback;
    scale3d?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty> | TypeCallback;
    scaleX?: TypeSingleValueCSSProperty | TypeCallback;
    scaleY?: TypeSingleValueCSSProperty | TypeCallback;
    scaleZ?: TypeSingleValueCSSProperty | TypeCallback;
    skew?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty> | TypeCallback;
    skewX?: TypeSingleValueCSSProperty | TypeCallback;
    skewY?: TypeSingleValueCSSProperty | TypeCallback;
    opacity?: TypeSingleValueCSSProperty | TypeCallback;
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
    target?: TypeAnimationTarget;
    /**
     * Alias of `target`
     * {@link AnimationOptions.target | target }
     */
    targets?: TypeAnimationTarget;
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
    easing?: keyof typeof EASINGS | TypeCallback | string | string[];
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
    duration?: number | string | TypeCallback;
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
    delay?: number | TypeCallback;
    /**
     * Adds an offset ammount to the `delay`, for creating a timeline similar to `animejs`
     */
    timelineOffset?: number | TypeCallback;
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
    endDelay?: number | TypeCallback;
    /**
     *
     * This ensures all `animations` match up to the total duration, and don't finish too early, if animations finish too early when the `.play()` method is called specific animations  that are finished will restart while the rest of the animations will continue playing.
     *
     * _**Note**: you cannot use the `padEndDelay` option and set a value for `endDelay`, the `endDelay` value will replace the padded endDelay_
     */
    padEndDelay?: Boolean;
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
    loop?: number | boolean | TypeCallback;
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
    onfinish?: (element?: HTMLElement, index?: number, total?: number, animation?: Animation) => void;
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
    oncancel?: (element?: HTMLElement, index?: number, total?: number, animation?: Animation) => void;
    /**
     *
     * Determines if the animation should automatically play immediately after being instantiated.
     */
    autoplay?: boolean;
    /**
     * Determines the direction of the animation;
     * - `reverse` runs the animation backwards,
     * - `alternate` switches direction after each iteration if the animation loops.
     * - `alternate-reverse` starts the animation at what would be the end of the animation if the direction were
     * - `normal` but then when the animation reaches the beginning of the animation it alternates going back to the position it started at.
     */
    direction?: PlaybackDirection;
    /**
     * Determines the animation playback rate. Useful in the authoring process to speed up some parts of a long sequence (value above 1) or slow down a specific animation to observe it (value between 0 to 1).
     *
     * _**Note**: negative numbers reverse the animation._
     */
    speed?: number | TypeCallback;
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
    fillMode?: FillMode;
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
    options?: IAnimationOptions;
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
    offset?: (number | string)[] | TypeCallback;
    /**
     * Represents the timeline of animation. It exists to pass timeline features to Animations (default is [DocumentTimeline](https://developer.mozilla.org/en-US/docs/Web/API/DocumentTimeline)).
     *
     * As of right now it doesn't contain any features but in the future when other timelines like the [ScrollTimeline](https://drafts.csswg.org/scroll-animations-1/#scrolltimeline), read the Google Developer article for [examples and demos of ScrollTimeLine](https://developers.google.com/web/updates/2018/10/animation-worklet#hooking_into_the_space-time_continuum_scrolltimeline)
     */
    timeline?: AnimationTimeline;
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
    keyframes?: TypeCSSLikeKeyframe | ICSSComputedTransformableProperties[] & Keyframe[] | object[] | TypeCallback;
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
    extend?: KeyframeEffectOptions | TypeCallback;
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
    [property: string]: TypeAnimationOptionTypes;
}
/**
 * CSS properties
 */
export interface ICSSProperties {
    [key: string]: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>;
}
/**
 * After being computed as an animation option
 */
export interface ICSSComputedTransformableProperties extends ICSSProperties {
    perspective?: TypeSingleValueCSSProperty;
    rotate?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>;
    rotate3d?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>;
    rotateX?: TypeSingleValueCSSProperty;
    rotateY?: TypeSingleValueCSSProperty;
    rotateZ?: TypeSingleValueCSSProperty;
    translate?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>;
    translate3d?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>;
    translateX?: TypeSingleValueCSSProperty;
    translateY?: TypeSingleValueCSSProperty;
    translateZ?: TypeSingleValueCSSProperty;
    scale?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>;
    scale3d?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>;
    scaleX?: TypeSingleValueCSSProperty;
    scaleY?: TypeSingleValueCSSProperty;
    scaleZ?: TypeSingleValueCSSProperty;
    skew?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>;
    skewX?: TypeSingleValueCSSProperty;
    skewY?: TypeSingleValueCSSProperty;
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
export declare const DefaultAnimationOptions: IAnimationOptions;
export declare type TypeAnimationEvents = "update" | "play" | "pause" | "begin" | "cancel" | "finish" | "error" | "stop" | "playstate-change";
export declare type TypePlayStates = "idle" | "running" | "paused" | "finished";
export declare const parseOptions: (options: IAnimationOptions) => IAnimationOptions;
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
 * Convert the input to an array
 * For strings split them at commas
 * For array do nothing
 * For everything else wrap the input in an array
 */
export declare const toArr: (input: any) => any[];
/**
 * Checks if value is valid/truthy; it counts empty arrays and strings as falsey,
 * as well as null and undefined everything else is valid
 *
 * _**Note:** 0 counts as valid_
 *
 * @param value - anything
 * @returns true or false
 */
export declare const isValid: (value: any) => boolean;
/**
 * Returns a closure function, which adds units to numbers, strings or arrays of both
 *
 * @param unit - a unit function to use to add units to {@link TypeSingleValueCSSProperty | TypeSingleValueCSSProperty's }
 * @returns
 * if input is a string split it into an array at the comma's, and add units
 * else if the input is a number add the default units
 * otherwise if the input is an array of both add units according to {@link addCSSUnit}
 */
export declare const CSSValue: (unit: typeof UnitLess) => (input: TypeSingleValueCSSProperty) => any[];
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
export declare const transpose: (...args: TypeSingleValueCSSProperty[] | TypeSingleValueCSSProperty[][]) => any[];
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
export declare const CSSArrValue: (arr: TypeSingleValueCSSProperty | TypeSingleValueCSSProperty[], unit: typeof UnitLess) => TypeSingleValueCSSProperty[];
export declare const TransformFunctionNames: string[];
/**
 * Creates the transform property text
 */
export declare const createTransformProperty: (arr: any) => string;
/** Parses CSSValues without adding any units */
export declare const UnitLessCSSValue: (input: TypeSingleValueCSSProperty) => any[];
/** Parses CSSValues and adds the "px" unit if required */
export declare const UnitPXCSSValue: (input: TypeSingleValueCSSProperty) => any[];
/** Parses CSSValues and adds the "deg" unit if required */
export declare const UnitDEGCSSValue: (input: TypeSingleValueCSSProperty) => any[];
/**
 * Wrap non array CSS property values in an array
 */
export declare const CSSPropertiesToArr: (properties: ICSSProperties) => ICSSProperties;
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
export declare const ParseTransformableCSSProperties: (properties: ICSSComputedTransformableProperties) => {
    transform: string[];
} & {
    [key: string]: TypeSingleValueCSSProperty | TypeSingleValueCSSProperty[];
};
/**
 * Similar to {@link ParseTransformableCSSProperties} except it transforms the CSS properties in each Keyframe
 * @param keyframes - an array of keyframes with transformable CSS properties
 * @returns
 * an array of keyframes, with transformed CSS properties
 */
export declare const ParseTransformableCSSKeyframes: (keyframes: ICSSComputedTransformableProperties[]) => ({
    transform: string;
} & {
    [key: string]: TypeSingleValueCSSProperty | TypeSingleValueCSSProperty[];
})[];
/**
 * An animation library for the modern web, which. Inspired by animate plus, and animejs, [@okikio/animate](https://www.skypack.dev/view/@okikio/animate) is a Javascript animation library focused on performance and ease of use.
 *
 * You can check it out here: <https://codepen.io/okikio/pen/qBbdGaW?editors=0011>
 */
export declare class Animate {
    /**
     * Stores the options for the current animation
     *
     * @inheritDoc DefaultAnimationOptions
     */
    options: IAnimationOptions;
    /**
     * The list of Elements to Animate
     */
    targets: Manager<number, Node>;
    /**
     * The properties to animate
     */
    properties: object;
    /**
     * A Manager of Animations
     */
    animations: Manager<HTMLElement, Animation>;
    /**
     * A Manager of KeyFrameEffects
     */
    keyframeEffects: Manager<Animation, KeyframeEffect>;
    /**
     * The total duration of all Animation's
     */
    totalDuration: number;
    /**
     * The smallest delay out of all Animation's
     */
    minDelay: number;
    /**
     * The largest speed out of all Animation's
     */
    maxSpeed: number;
    /**
     * The options for individual animations
     *
     * A Manager that stores all the fully calculated options for individual Animation instances.
     *
     * _**Note**: the computedOptions are changed to their proper Animation instance options, so, some of the names are different, and options that can't be computed are not present. E.g. fillMode in the animation options is now just fill in the computedOptions.*_
     *
     * _**Note**: keyframes are not included, both the array form and the object form; the options, speed, extend, padEndDelay, and autoplay animation options are not included_
     */
    computedOptions: Manager<Animation, TypeComputedOptions>;
    /**
     * The keyframes for individual animations
     *
     * A Manager that stores all the fully calculated keyframes for individual Animation instances.
     *
     * _**Note**: the computedKeyframes are changed to their proper Animation instance options, so, some of the names are different, and options that can't be computed are not present. E.g. translateX, skew, etc..., they've all been turned into the transform property.*_
     */
    computedKeyframes: Manager<Animation, TypeKeyFrameOptionsType>;
    /**
     * The Element the mainAnimation runs on
     */
    mainElement: HTMLElement;
    /**
     * Stores an animation that runs on the total duration of all the `Animation` instances, and as such it's the main Animation.
     */
    mainAnimation: Animation;
    /**
     * The Keyframe Effect for the mainAnimation
     */
    mainkeyframeEffect: KeyframeEffect;
    /**
     * Stores request frame calls
     */
    animationFrame: number;
    /**
     * An event emitter
     */
    emitter: EventEmitter;
    /**
     * Returns a promise that is fulfilled when the mainAnimation is finished
     */
    promise: Promise<Animate[]>;
    constructor(options: IAnimationOptions);
    /**
     * Tells all animate instances to pause when the page is hidden
     *
     * @static
     * @type {Boolean}
     * @memberof Animate
     */
    static pauseOnPageHidden: Boolean;
    /**
     * Store the last remebered playstate before page was hidden
     *
     * @protected
     * @type {TypePlayStates}
     * @memberof Animate
     */
    protected visibilityPlayState: TypePlayStates;
    /**
     * document `visibilitychange` event handler
     */
    protected onVisibilityChange(): void;
    /**
     * Returns a new Promise that is resolved when the animation finishes
     */
    newPromise(): Promise<Animate[]>;
    /**
     * Fulfills the `this.promise` Promise
     */
    then(onFulfilled?: (value?: any) => any, onRejected?: (reason?: any) => any): Animate;
    /**
     * Catches error that occur in the `this.promise` Promise
     */
    catch(onRejected: (reason?: any) => any): Animate;
    /**
     * If you don't care if the `this.promise` Promise has either been rejected or resolved
     */
    finally(onFinally: () => any): Animate;
    /**
     * Represents an Animation Frame Loop
     */
    loop(): void;
    /**
     * Cancels animation frame
     */
    stopLoop(): void;
    /**
     * Calls a method that affects all animations **excluding** the mainAnimation; the method only allows the animation parameter
    */
    allAnimations(method: (animation?: Animation, target?: HTMLElement) => void): this;
    /**
     * Calls a method that affects all animations **including** the mainAnimation; the method only allows the animation parameter
    */
    all(method: (animation?: Animation, target?: HTMLElement) => void): this;
    /**
     * Register the begin event
     */
    protected beginEvent(): void;
    /**
     * Play Animation
     */
    play(): Animate;
    /**
     * Pause Animation
     */
    pause(): Animate;
    /**
     * Reverse Animation
     */
    reverse(): this;
    /**
     * Reset all Animations
     */
    reset(): this;
    /**
     * Cancels all Animations
     */
    cancel(): this;
    /**
     * Force complete all Animations
     */
    finish(): this;
    /**
     * Cancels & Clears all Animations
     */
    stop(): void;
    /**
     * Returns an Manager instance for targets
     */
    getTargets(): Node[];
    /**
     * Get a specific Animation from an Animate instance
     */
    getAnimation(element: HTMLElement): Animation;
    /**
     * Get a specific Animation's KeyframeEffect from an Animate instance
     */
    getKeyframeEffect(animation: Animation): KeyframeEffect;
    /**
     * Returns the timings of an Animation, given a target
     * E.g. { duration, endDelay, delay, iterations, iterationStart, direction, easing, fill, etc... }
     */
    getTiming(target: HTMLElement | Animation): TypeComputedAnimationOptions;
    /**
     * Returns the total duration of Animation
     */
    getTotalDuration(): number;
    /**
     * Returns the current time of the Main Animation
     */
    getCurrentTime(): number;
    /**
     * Returns the Animation progress as a fraction of the current time / duration * 100
     */
    getProgress(): number;
    /**
     * Return the playback speed of the animation
     */
    getSpeed(): number;
    /**
     * Returns the current playing state
     */
    getPlayState(): TypePlayStates;
    /**
     * Get the options of an Animate instance
     */
    getOptions(): IAnimationOptions;
    /**
     * Get the computed options object for a specific target
     */
    getComputedOption(target: HTMLElement | Animation): IAnimationOptions;
    /**
     * Returns a boolean determining if the `animate` instances playstate is equal to the `playstate` parameter.
     */
    is(playstate: TypePlayStates): boolean;
    /**
     * Set the current time of the Main Animation
     */
    setCurrentTime(time: number): Animate;
    /**
     * Set the Animation progress as a value from 0 to 100
     */
    setProgress(percent: number): Animate;
    /**
     * Set the playback speed of an Animation
     */
    setSpeed(speed?: number): Animate;
    /**
     * Update the options for all targets set in the constructor
     *
     * _**Note**: `KeyframeEffect` support is really low, so, I am suggest that you avoid using the `updateOptions` method, until browser support for `KeyframeEffect.updateTiming(...)` and `KeyframeEffefct.setKeyframes(...)` is better_
     *
     * @beta
     */
    updateOptions(options?: IAnimationOptions): void;
    /**
     * Adds a listener for a given event
     */
    on(events: TypeAnimationEvents[] | TypeAnimationEvents | TypeEventInput, callback?: TypeListenerCallback | object, scope?: object): Animate;
    /**
     * Removes a listener from an event
     */
    off(events: TypeAnimationEvents[] | TypeAnimationEvents | TypeEventInput, callback?: TypeListenerCallback | object, scope?: object): Animate;
    /**
     * Call all listeners within an event
     */
    emit(events: TypeAnimationEvents[] | TypeAnimationEvents | string | any[], ...args: any): Animate;
    /** Returns the Animate options, as JSON  */
    toJSON(): IAnimationOptions;
    /**
     * The Symbol.toStringTag well-known symbol is a string valued property that is used
     * in the creation of the default string description of an object.
     * It is accessed internally by the Object.prototype.toString() method.
     */
    get [Symbol.toStringTag](): string;
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
export declare const animate: (options?: IAnimationOptions) => Animate;
export * from "./builtin-effects";
export default animate;
