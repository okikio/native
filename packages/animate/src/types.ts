// import type { Properties, PropertiesHyphen, PropertiesFallback, PropertiesHyphenFallback, Property } from "csstype";
import type { EASINGS } from "./animate.ts";

// Utility type to convert a string to kebab-case
export type KebabCase<S extends string> =
  S extends `${infer T}${infer U}` ?
  T extends Lowercase<T> ?
  `${T}${KebabCase<U>}` :
  `-${Lowercase<T>}${KebabCase<U>}`
  : S;

// Utility type to apply the kebab-case transformation to each property of an interface
export type KebabCasedProperties<T> = {
  [K in keyof T as KebabCase<Extract<K, string>>]: T[K]
};

/**
 * The Animation Events supported by @okikio/animate, they are based on the Animation Events supported by WAAPI 
 * - "begin" - fired when an animation starts
 * - "cancel" - fired when an animation is canceled
 * - "finish" - fired when an animation is finished
 * - "update" - fired at a specified frame rate (default is 60), it is fired by a `requestAnimationFrame` loop
 * - "pause" - fired when an animation is paused
 * - "play" - fired when an animation is played
 * - "error" - fired when an error has occurred in setting up the animation (e.g. invalid options, invalid target, browser doesn't support certain features, etc.)
 * - "playstate-change" - fired when the play state of an animation changes
 */
export type TypeAnimationEvents = "update" | "play" | "pause" | "begin" | "cancel" | "finish" | "error" | "stop" | "playstate-change";

/**
 * The various play states of an animation
 * - "idle" - The animation is not running
 * - "pause" - The animation is paused
 * - "running" - The animation is playing
 * - "finished" - The animation has finished playing
 */
export type TypePlayStates = "idle" | "running" | "paused" | "finished";

/** Lists all supported Animation Targets */
export type TypeAnimationTarget = string | Node | NodeList | HTMLCollection | HTMLElement[] | TypeAnimationTarget[];

/**
 * The callback parameters for computable animation functions
 * e.g. `(index?: number, total?: number, element?: HTMLElement) => number`
 * 
 * @param index - index of target element
 * @param total - total number of target element
 * @param element - the target element
 * 
 * @returns T
 */
export type TypeComputableAnimationFunction<T> = (index?: number, total?: number, element?: HTMLElement) => T;

/**
 * The callback parameters for computable animation functions
 * e.g. `(index?: number, total?: number, element?: HTMLElement) => number`
 */
export type TypeCallbackArgs = Parameters<TypeComputableAnimationFunction<(string & {})[]>>;

/** 
 * string & number generic values for all animation option properties. 
 * 
 * The `string & {}` is a TypeScript hack for autocomplete, 
 * check out [github.com/microsoft/TypeScript/issues/29729](https://github.com/microsoft/TypeScript/issues/29729) to learn more
 */
export type TypeCommonGenerics = number | (string & {});

/** 
 * string, number, calc(${...}) & var(--${...}) generic values for CSS Properties. 
 * 
 * The `string & {}` is a TypeScript hack for autocomplete, 
 * check out [github.com/microsoft/TypeScript/issues/29729](https://github.com/microsoft/TypeScript/issues/29729) to learn more
 */
export type TypeCommonCSSGenerics = TypeCommonGenerics | `calc(${string})` | `var(--${string})` | `var(--${string}, ${string | number})`;

/**
 * Allow either the type alone, or an Array of that type
 */
export type OneOrMany<Type> = Type | Type[];

/**
 * The CSS Generics of Property Indexed Keyframes {@link PropertyIndexedKeyframes}
 */
export type TypeCSSGenericPropertyKeyframes = OneOrMany<TypeCommonCSSGenerics>;

/**
 * Allow either the computed values, or a computable callback function
 */
export type ComputableOrComputed<Type> = Type | TypeComputableAnimationFunction<Type>;

/** 
 * Support CSS Property Functions {@link TypeComputableAnimationFunction} and normal Common Property Values {@link TypeCommonCSSGenerics}
*/
export type TypeComputableCSSGenerics = ComputableOrComputed<TypeCSSGenericPropertyKeyframes>;

/**
 * Represents the individual transform properties
 */
export type TypeIndividualTransformProperties = {
  perspective?: TypeCSSGenericPropertyKeyframes,

  rotate?: OneOrMany<TypeCSSGenericPropertyKeyframes>,
  rotate3d?: OneOrMany<TypeCSSGenericPropertyKeyframes>,
  rotateX?: TypeCSSGenericPropertyKeyframes,
  rotateY?: TypeCSSGenericPropertyKeyframes,
  rotateZ?: TypeCSSGenericPropertyKeyframes,

  translate?: OneOrMany<TypeCSSGenericPropertyKeyframes>,
  translate3d?: OneOrMany<TypeCSSGenericPropertyKeyframes>,
  translateX?: TypeCSSGenericPropertyKeyframes,
  translateY?: TypeCSSGenericPropertyKeyframes,
  translateZ?: TypeCSSGenericPropertyKeyframes,

  scale?: OneOrMany<TypeCSSGenericPropertyKeyframes>,
  scale3d?: OneOrMany<TypeCSSGenericPropertyKeyframes>,

  scaleX?: TypeCSSGenericPropertyKeyframes,
  scaleY?: TypeCSSGenericPropertyKeyframes,
  scaleZ?: TypeCSSGenericPropertyKeyframes,

  skew?: OneOrMany<TypeCSSGenericPropertyKeyframes>,

  skewX?: TypeCSSGenericPropertyKeyframes,
  skewY?: TypeCSSGenericPropertyKeyframes,

  // matrix?: OneOrMany<TypeCSSGenericPropertyKeyframes>,
  // matrix3d?: OneOrMany<TypeCSSGenericPropertyKeyframes>,
};

/**
 * Add support for Kebab Case transform properties, e.g. "translate-x", "translate-3d"
 */
export type AddKebabCaseTransformProperties = TypeIndividualTransformProperties & KebabCasedProperties<TypeIndividualTransformProperties>;

/**
 * Contains the individual transform properties, `translate, rotate, scale, skew, perspective`, and all their varients
 */
export interface IIndividualTransformProperties extends AddKebabCaseTransformProperties { }

/**
 * The union of all CSS Property types, ranging from hypenated to cammelCase, including individual transform properties
 * 
 * e.g.
 * ```ts
 * {
 *  // ...
 *  "background-color": "red",
 *   borderColor: "green" 
 * }
 * ```
 * 
 * The Full list of CSS & SVG Animatable Properties & Animation Options that are supported excluding the `d` property
 * 
 * Supported Animatable Properties:
 * - [Animatable CSS Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties)
 * - [SVG Presentation Attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation) excluding the `d` property
 * 
*/
export type TypeCSSProperties =
  Omit<object
    // Properties<TypeCommonGenerics, TypeCommonGenerics> &
    // PropertiesHyphen<TypeCommonGenerics, TypeCommonGenerics> &
    // PropertiesFallback<TypeCommonGenerics, TypeCommonGenerics> &
    // PropertiesHyphenFallback<TypeCommonGenerics, TypeCommonGenerics>
    , keyof IIndividualTransformProperties> &
  IIndividualTransformProperties;

/** 
 * Full list of supported CSS, SVG & Individual Transform Animatable Properties that are supported.
 * Also adds support for CSS variables, and the `d` property
 * 
 * Supported Animatable Properties:
 * - [Animatable CSS Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties)
 * - [SVG Presentation Attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation)
 */
export interface IAllSupportedCSSProperties extends TypeCSSProperties {
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
   * 
   * Or for more browser support you can use [polymorph-js](https://npmjs.com/polymorph-js) together with {@link AnimateAttributes | tweenAttr} to interpolate between multiple paths:
   * 
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
   * // `tweenAttr` supports all Animation Options with some restrictions and things to note.
   * // 1. Callbacks - the first argument in Animation Options callbacks are set to the progress of the animation beteen 0 and 1, while the other arguments are moved 1 right
   *
   * // So, animation options look like this 
   * // `(progress: number, i: number, len: number, el: HTMLElement) => {
   * //   return progress;
   * // }
   * 
   * // 2. Custom easing by default - `easing`, `decimal`, `numPoints`, etc... from `CustomEasing` are supported, meaning you can use any easing function you want, including `spring`, etc... without calling `CustomEasing` on the property you want to apply custom easing to
   * // 3. You can use `.updateOptions(...)` to update the animation options of tweens
   * 
   * tweenAttr({
   *      target: "svg path",
   *      d: progress => morph(progress)
   * });
   * ```
   * 
   * Check out the [documentation](https://animate.okikio.dev/api/animate-attributes/) to learn more about animating attributes.
   */
  d?: string, // Property.OffsetPath,

  /**
   * `offset`, by default represents the keyframe offset, to ensure the css offset property can still be access, we use `cssOffset` property name.
   * The offset CSS shorthand property sets all the properties required for animating an element along a defined path.
   * Read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/offset)
   */
  cssOffset?: string, // TypeCSSProperties["offset"],

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
  [property: `--${string}`]: TypeCSSGenericPropertyKeyframes,
}

/**
 * Adds support computed CSS properties to the {@link IAllSupportedCSSProperties} interface
 */
export type TypeComputedCSSProperties = {
  [K in keyof IAllSupportedCSSProperties]?: OneOrMany<IAllSupportedCSSProperties[K]>
}

/**
 * Adds support computable CSS properties to the {@link TypeComputedCSSProperties} interface
 */
export type TypeComputableCSSProperties = {
  [K in keyof TypeComputedCSSProperties]?: ComputableOrComputed<TypeComputedCSSProperties[K]>
}

/**
 * An Interface that holds the CSS properties from the {@link IAllSupportedCSSProperties} interface as computable callback functions
 */
export interface IComputableCSSProperties extends TypeComputableCSSProperties { }

/**
 * Standalone animation configurations (CSS properties aren't included), as in they specify how the animation is played,
 * Duration, Delay, Easing, Loop, etc.
 * e.g. 
 * ```ts
 * {
 *     easing: "in-sine",
 *     duration: 2000,
 *     delay: 1000,
 *     endDelay: 1000,
 *     loop: 2,
 *     speed: 1.25,
 *     direction: "alternate",
 * }
 * ```
 */
export interface IStandaloneAnimationConfig {
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
  easing?: keyof typeof EASINGS | (string & {}) | (keyof typeof EASINGS | (string & {}))[],

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
  duration?: TypeCommonGenerics,

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
  delay?: TypeCommonGenerics,

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
  endDelay?: TypeCommonGenerics,

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
  loop?: TypeCommonGenerics | boolean,

  /**
   * Determines the animation playback rate. Useful in the authoring process to speed up some parts of a long sequence (value above 1) or slow down a specific animation to observe it (value between 0 to 1).
   *
   * _**Note**: negative numbers reverse the animation._
   */
  speed?: TypeCommonGenerics,

  /**
   * Determines the direction of the animation;
   * - `reverse` runs the animation backwards,
   * - `alternate` switches direction after each iteration if the animation loops.
   * - `alternate-reverse` starts the animation at what would be the end of the animation if the direction were
   * - `normal` but then when the animation reaches the beginning of the animation it alternates going back to the position it started at.
   */
  direction?: KeyframeEffectOptions["direction"] | PlaybackDirection,
}

/**
 * Standalone animation options that aren't the standard animation configurations, as in they still specify how the animation is played just in a more abstract manner.
 * e.g. 
 * ```ts
 * {
 *     offset: [0, 0.5],
 *     direction: "alternate",
 *     timelineOffset: 200,
 *     fillMode: "auto",
 *     keyframes: [
 *         { opacity: 1, offset: 0 },
 *         { opacity: 0, offset: 0.25 },
 *     ],
 *     composite: "default",
 *     extend: {
 *         iterationStart: 0.5
 *     }
 * }
 * ```
 */
export interface IStandaloneAnimationOptions {
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
  keyframes?: (Keyframe & TypeCSSProperties)[],

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
  offset?: (number | string)[],

  /** 
   * The `composite` property of a `KeyframeEffect` resolves how an element's animation impacts its underlying property values.
   * 
   * To understand these values, take the example of a `keyframeEffect` value of `blur(2)` working on an underlying property value of `blur(3)`.
   * - `replace` (default) - The keyframeEffect overrides the underlying value it is combined with: `blur(2)` replaces `blur(3)`.
   * - `add` - The keyframeEffect is added to the underlying value with which it is combined (aka additive):  `blur(2) blur(3)`. 
   * - `accumulate` - The keyframeEffect is accumulated on to the underlying value: `blur(5)`.
   * 
   * Read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/composite)
   * 
   * I recommend reading [web.dev](https://web.dev)'s article on [web-animations](https://web.dev/web-animations/#smoother-animations-with-composite-modes).
  */
  composite?: KeyframeEffectOptions["composite"],

  /**
   * Adds an offset ammount to the `delay`, for creating a timeline similar to `animejs`
   */
  timelineOffset?: number | string,

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

   * > _Be careful when using fillMode, it has some problems when it comes to concurrency of animations read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/fill). I highly suggest using {@link IAnimateInstanceConfig.persist | persist}, as it's less permanent, or better yet use the {@link IAnimateInstanceConfig.onfinish | onfinish(...) } method, with {@link Animate.commitStyles | Animate.commitStyles(...)\ } to commit styles._
   */
  fillMode?: KeyframeEffectOptions["fill"] | FillMode,

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
  extend?: KeyframeEffectOptions
}

/**
 * Stores the final value of computed animation options
 * e.g.
 * ```ts
 * {
 *     easing: "in-sine",
 *     duration: 2000,
 *     delay: 1000,
 *     endDelay: 1000,
 *     loop: 2,
 *     speed: 1.25,
 *     direction: "alternate",
 *     offset: [0, 0.5],
 *     direction: "alternate",
 *     timelineOffset: 200,
 *     fillMode: "auto",
 *     keyframes: [
 *         { opacity: 1, offset: 0 },
 *         { opacity: 0, offset: 0.25 },
 *     ],
 *     composite: "default",
 *     extend: {
 *         iterationStart: 0.5
 *     }
 * }
 * ```
 */
export interface IStandaloneComputedAnimateOptions extends IStandaloneAnimationConfig, IStandaloneAnimationOptions { }

/**
 * Stores all the info needed to create a the total duration of an animation
 */
export interface ITotalDurationInfo extends IStandaloneComputedAnimateOptions, Omit<KeyframeEffectOptions, keyof IStandaloneComputedAnimateOptions> {
  /**
   * The total duration of an animation
   */
  totalDuration?: number
}

/**
 * Merge both standalone `configs` and `options` into a single type, whose properties are computable.
 */
type TypeComputableAnimationConfig = {
  [key in keyof IStandaloneAnimationConfig]?:
  IStandaloneAnimationConfig[key] |
  TypeComputableAnimationFunction<IStandaloneAnimationConfig[key]>
} & {
    [key in keyof IStandaloneAnimationOptions]?:
    IStandaloneAnimationOptions[key] |
    TypeComputableAnimationFunction<IStandaloneAnimationOptions[key]>
  };

/**
 * Merge both standalone {@link IStandaloneAnimationConfig `configs`} and {@link IStandaloneAnimationOptions `options`} into a single interface, whose properties are computable.
 */
export interface IComputableAnimationConfig extends TypeComputableAnimationConfig { }

/**
 * An interface for Animation options & configs that aren't computable.
 */
export interface INoneComputableAnimationConfig {
  /**
   * Determines the DOM elements to animate. You can pass it a CSS selector, DOM elements, or an Array of DOM Elements and/or CSS Selectors.
   */
  target?: TypeAnimationTarget,

  /**
   * Alias of `{@link IAnimationConfig.target }`
   */
  targets?: TypeAnimationTarget,

  /**
   *
   * This ensures all `animations` match up to the total duration, and don't finish too early, if animations finish too early when the `.play()` method is called specific animations  that are finished will restart while the rest of the animations will continue playing.
   *
   * _**Note**: you cannot use the `padEndDelay` option and set a value for `endDelay`, the `endDelay` value will replace the padded endDelay_
   */
  padEndDelay?: Boolean,

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
   * Persists animation state, so, when an animation is complete it keeps said finished animation state. 
   * Think of it more like a less strict version of {@link IAnimateInstanceConfig.fillMode | fillMode}, it was inspired by [motion one](https://motion.dev/).
   * 
   * By default WAAPI resets animations back to their initial state once an animation is complete and fillMode isn't being used. The persist animation option, basically tells Animate to find the final state of all CSS Properties being animated, and then set them, so, once the animation is finished and WAAPI resets animations back to their initial state (so `initial state = final state`) the user doesn't notice difference and it looks like the animation stopped on the final state.
   * 
   * > _**Note**: use this most of the time instead of `fillMode`, as it's impact is less permanent._
   */
  persist?: boolean,

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
  options?: IAnimateInstanceConfig,

  /**
   * Represents the timeline of animation. It exists to pass timeline features to Animations (default is [DocumentTimeline](https://developer.mozilla.org/en-US/docs/Web/API/DocumentTimeline)).
   *
   * As of right now it doesn't contain any features but in the future when other timelines like the [ScrollTimeline](https://drafts.csswg.org/scroll-animations-1/#scrolltimeline), read the Google Developer article for [examples and demos of ScrollTimeLine](https://developers.google.com/web/updates/2018/10/animation-worklet#hooking_into_the_space-time_continuum_scrolltimeline)
   */
  timeline?: AnimationTimeline | null,
}

/**
 * Animate config control how an animation is produced, it shouldn't be too different for those who have used `animejs`, or `jquery`'s animate method.
 *
 * @remark
 * An animate config is an object with keys and values that are computed and passed to the `Animate` class to create animations that match the specified options.
 */
export interface IAnimationConfig extends IComputableAnimationConfig, INoneComputableAnimationConfig { }

/**
 * A type that extends both {@link IAnimationConfig} and {@link IComputableCSSProperties}, allowing for both Animate config and CSS properties to be used in the same object
 */
type MergedType = Omit<IComputableCSSProperties, keyof IAnimationConfig | "offset"> & IAnimationConfig;

/**
 * Extends both {@link IAnimationConfig} and {@link IComputableCSSProperties}, allowing for both Animate config and CSS properties to be used in the same object, however, it gives priority to the Animate config even if there are CSS properties with the same name. There are very few cases where this is needed, but it's a good behaviour to have. 
 */
export interface IAnimateInstanceConfig extends MergedType { }
