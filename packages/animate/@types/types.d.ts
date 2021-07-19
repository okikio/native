import type { KebabCase, CamelCase, KebabCasedProperties } from "type-fest";
import type colors from "./colors";
export declare type TypeAnimationTarget = string | Node | NodeList | HTMLCollection | HTMLElement[] | TypeAnimationTarget[];
export declare type TypeCallbackArgs = [number, number, HTMLElement];
export declare type TypeGeneric = boolean | object | string | number | keyof typeof colors;
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
export declare type TypeSingleValueCSSProperty = string | number | TypeCSSPropertyValue;
/**
 * [Animatable CSS Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties)
 *
 */
export declare type TypeAnimatableCSSProperties = CamelCase<"-webkit-line-clamp" | "-webkit-text-fill-color" | "-webkit-text-stroke" | "-webkit-text-stroke-color" | "all" | "background" | "background-color" | "background-position" | "background-size" | "block-size" | "border" | "border-block-end" | "border-block-end-color" | "border-block-end-width" | "border-block-start" | "border-block-start-color" | "border-block-start-width" | "border-bottom" | "border-bottom-color" | "border-bottom-left-radius" | "border-bottom-right-radius" | "border-bottom-width" | "border-color" | "border-end-end-radius" | "border-end-start-radius" | "border-image-outset" | "border-image-slice" | "border-image-width" | "border-inline-end" | "border-inline-end-color" | "border-inline-end-width" | "border-inline-start" | "border-inline-start-color" | "border-inline-start-width" | "border-left" | "border-left-color" | "border-left-width" | "border-radius" | "border-right" | "border-right-color" | "border-right-width" | "border-start-end-radius" | "border-start-start-radius" | "border-top" | "border-top-color" | "border-top-left-radius" | "border-top-right-radius" | "border-top-width" | "border-width" | "bottom" | "box-shadow" | "caret-color" | "clip" | "clip-path" | "color" | "column-count" | "column-gap" | "column-rule" | "column-rule-color" | "column-rule-width" | "column-width" | "columns" | "filter" | "flex" | "flex-basis" | "flex-grow" | "flex-shrink" | "font" | "font-size" | "font-size-adjust" | "font-stretch" | "font-variation-settings" | "font-weight" | "gap" | "grid-column-gap" | "grid-gap" | "grid-row-gap" | "grid-template-columns" | "grid-template-rows" | "height" | "inline-size" | "inset" | "inset-block" | "inset-block-end" | "inset-block-start" | "inset-inline" | "inset-inline-end" | "inset-inline-start" | "left" | "letter-spacing" | "line-height" | "margin" | "margin-block-end" | "margin-block-start" | "margin-bottom" | "margin-inline-end" | "margin-inline-start" | "margin-left" | "margin-right" | "margin-top" | "mask" | "max-block-size" | "max-height" | "max-inline-size" | "max-width" | "min-block-size" | "min-height" | "min-inline-size" | "min-width" | "object-position" | "offset" | "offset-anchor" | "offset-distance" | "offset-path" | "offset-rotate" | "opacity" | "order" | "outline" | "outline-color" | "outline-offset" | "outline-width" | "padding" | "padding-block-end" | "padding-block-start" | "padding-bottom" | "padding-inline-end" | "padding-inline-start" | "padding-left" | "padding-right" | "padding-top" | "perspective" | "perspective-origin" | "right" | "rotate" | "row-gap" | "scale" | "scroll-margin" | "scroll-margin-block" | "scroll-margin-block-end" | "scroll-margin-block-start" | "scroll-margin-bottom" | "scroll-margin-inline" | "scroll-margin-inline-end" | "scroll-margin-inline-start" | "scroll-margin-left" | "scroll-margin-right" | "scroll-margin-top" | "scroll-padding" | "scroll-padding-block" | "scroll-padding-block-end" | "scroll-padding-block-start" | "scroll-padding-bottom" | "scroll-padding-inline" | "scroll-padding-inline-end" | "scroll-padding-inline-start" | "scroll-padding-left" | "scroll-padding-right" | "scroll-padding-top" | "shape-image-threshold" | "shape-margin" | "shape-outside" | "tab-size" | "text-decoration" | "text-decoration-color" | "text-decoration-thickness" | "text-emphasis" | "text-emphasis-color" | "text-indent" | "text-shadow" | "text-underline-offset" | "top" | "transform" | "transform-origin" | "translate" | "vertical-align" | "visibility" | "width" | "word-spacing" | "z-index" | "opacity">;
/**
 * [SVG Presentation Attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation)
 */
export declare type TypeSVGPresentationAttributes = CamelCase<"alignment-baseline" | "baseline-shift" | "clip-rule" | "color-interpolation" | "color-interpolation-filters" | "color-profile" | "color-rendering" | "cursor" | "direction" | "display" | "fill" | "fill-opacity" | "fill-rule" | "flood-color" | "flood-opacity" | "font-family" | "font-style" | "font-variant" | "kerning" | "lighting-color" | "marker-end" | "marker-mid" | "marker-start" | "overflow" | "pointer-events" | "stroke" | "stroke-dasharray" | "stroke-dashoffset" | "stroke-linecap" | "stroke-linejoin" | "stroke-miterlimit" | "stroke-opacity" | "stroke-width" | "text-anchor" | "text-rendering" | "vector-effect" | "writing-mode">;
/**
 * [SVG Presentation Attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation)
 */
export declare type TypeAnimatableSVGAttributes = {
    [property in TypeSVGPresentationAttributes]?: TypeAnimationOptionTypes;
};
/**
 * CSS properties the `ParseTransformableCSSProperties` can parse
 */
export declare type TypeCSSTransformableProperties = {
    [K in keyof ICSSComputedTransformableProperties]?: ICSSComputedTransformableProperties[K] | TypeCallback;
};
/**
 * CSS Properties that are missing from the type definition
 */
export declare type TypeMissingCSSProperties = {
    /**
     * Morphing SVG paths via the `d` property isn't well supported yet, as Gecko (Firefox) & Webkit (Safari) based browsers don't support it yet, and there are other limitations to what the Web Animation API will allow 😭, these limitation are covered in detail by an article published by Adobe about [the current state of SVG animation on the web](https://blog.adobe.com/en/publish/2015/06/05/the-state-of-svg-animation.html#gs.pihpjw). However, animation using paths is now viable through [Motion Path](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Motion_Path).
     *
     * You use it like this:
     * ```ts
     * // ...
     * animate({
     *      // ...
     *      // The paths have to have the same number of points, that is why the 2 paths below seem similar
     *      d: [
     *          `path("M2,5 S2,14 4,5 S7,8 8,4")`,
     *          `path("M2,5 S2,-2 4,5 S7,8 8,4")`
     *      ]
     * })
     * ```
     */
    d?: string | string[] | TypeCallback;
    backdropFilter?: string | string[] | TypeCallback;
    lineClamp?: number | string | (string | number)[] | TypeCallback;
    maskBorder?: string | string[] | TypeCallback;
    maskPosition?: number | string | (string | number)[] | TypeCallback;
    maskSize?: number | string | (string | number)[] | TypeCallback;
    maxLines?: number | string | (string | number)[] | TypeCallback;
    offsetPosition?: number | string | (string | number)[] | TypeCallback;
    scrollbarColor?: string | string[] | keyof typeof colors | Array<keyof typeof colors> | TypeCallback;
} & {
    [K in TypeAnimatableCSSProperties]?: TypeAnimationOptionTypes;
};
/**
 * Full list of CSS & SVG Animatable Properties & Animation Options that are supported
*/
export declare type TypeCSSAnimationOptions = {
    [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K] | CSSStyleDeclaration[K][] | TypeAnimationOptionTypes;
} & {
    [K in keyof CSSStyleDeclaration as KebabCase<K>]?: CSSStyleDeclaration[K] | CSSStyleDeclaration[K][] | TypeAnimationOptionTypes;
} & TypeCSSTransformableProperties & KebabCasedProperties<TypeCSSTransformableProperties> & TypeMissingCSSProperties & KebabCasedProperties<TypeMissingCSSProperties> & TypeAnimatableSVGAttributes & KebabCasedProperties<TypeAnimatableSVGAttributes>;
/**
 * Animation options control how an animation is produced, it shouldn't be too different for those who have used `animejs`, or `jquery`'s animate method.
 *
 * @remark
 * An animation option is an object with keys and values that are computed and passed to the `Animate` class to create animations that match the specified options.
 */
export interface IAnimationOptions extends TypeCSSAnimationOptions {
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
     * | constant   | accelerate   | decelerate     | accelerate-decelerate |
     * | :--------- | :----------- | :------------- | :-------------------- |
     * | linear     | ease-in / in | ease-out / out | ease-in-out / in-out  |
     * | ease       | in-sine      | out-sine       | in-out-sine           |
     * | steps      | in-quad      | out-quad       | in-out-quad           |
     * | step-start | in-cubic     | out-cubic      | in-out-cubic          |
     * | step-end   | in-quart     | out-quart      | in-out-quart          |
     * |            | in-quint     | out-quint      | in-out-quint          |
     * |            | in-expo      | out-expo       | in-out-expo           |
     * |            | in-circ      | out-circ       | in-out-circ           |
     * |            | in-back      | out-back       | in-out-back           |
     *
     * You can create your own custom cubic-bezier easing curves. Similar to css you type `cubic-bezier(...)` with 4 numbers representing the shape of the bezier curve, for example, `cubic-bezier(0.47, 0, 0.745, 0.715)` this is the bezier curve for `in-sine`.
     *
     * *Note: the `easing` property supports the original values and functions for easing as well, for example, `steps(1)`, and etc... are supported.*
     *
     * *Note: you can also use camelCase when defining easing functions, e.g. `inOutCubic` to represent `in-out-cubic`*
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
     *
     *     // or
     *     easing: "inSine",
     *
     *     transform: ["translate(0px)", "translate(500px)"],
     * });
     * ```
     */
    easing?: KeyframeEffectOptions["easing"] | TypeCallback | string | string[];
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
    duration?: KeyframeEffectOptions["duration"] | number | string | TypeCallback;
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
    delay?: KeyframeEffectOptions["delay"] | string | number | TypeCallback;
    /**
     * Adds an offset ammount to the `delay`, for creating a timeline similar to `animejs`
     */
    timelineOffset?: number | string;
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
    endDelay?: KeyframeEffectOptions["endDelay"] | string | number | TypeCallback;
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
    loop?: KeyframeEffectOptions["iterations"] | number | boolean | TypeCallback;
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
    direction?: KeyframeEffectOptions["direction"] | PlaybackDirection;
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
    fillMode?: KeyframeEffectOptions["fill"] | FillMode;
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
    offset?: PropertyIndexedKeyframes["offset"] | (number | string)[] | TypeCallback;
    /**
     * Represents the timeline of animation. It exists to pass timeline features to Animations (default is [DocumentTimeline](https://developer.mozilla.org/en-US/docs/Web/API/DocumentTimeline)).
     *
     * As of right now it doesn't contain any features but in the future when other timelines like the [ScrollTimeline](https://drafts.csswg.org/scroll-animations-1/#scrolltimeline), read the Google Developer article for [examples and demos of ScrollTimeLine](https://developers.google.com/web/updates/2018/10/animation-worklet#hooking_into_the_space-time_continuum_scrolltimeline)
     */
    timeline?: AnimationTimeline | null;
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
     * The `composite` property of a `KeyframeEffect` resolves how an element's animation impacts its underlying property values.
     *
     * To understand these values, take the example of a `keyframeEffect` value of `blur(2)` working on an underlying property value of `blur(3)`.
     * - `replace` - The keyframeEffect overrides the underlying value it is combined with: `blur(2)` replaces `blur(3)`.
     * - `add` - The keyframeEffect is added to the underlying value with which it is combined (aka additive):  `blur(2) blur(3)`.
     * - `accumulate` - The keyframeEffect is accumulated on to the underlying value: `blur(5)`.
     *
     * Read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/composite)
     *
     * I recommend reading [web.dev](https://web.dev)'s article on [web-animations](https://web.dev/web-animations/#smoother-animations-with-composite-modes).
    */
    composite?: KeyframeEffectOptions["composite"] | TypeCallback;
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
    [property: `--${string}`]: TypeAnimationOptionTypes;
}
export declare type TypeAnimationEvents = "update" | "play" | "pause" | "begin" | "cancel" | "finish" | "error" | "stop" | "playstate-change";
export declare type TypePlayStates = "idle" | "running" | "paused" | "finished";
/**
 * CSS properties
 */
export interface ICSSProperties {
    [key: string]: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>;
}
/**
 * After being computed as an animation option
 */
export interface ICSSComputedTransformableProperties {
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
    matrix?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>;
    matrix3d?: TypeSingleValueCSSProperty | Array<TypeSingleValueCSSProperty>;
}
