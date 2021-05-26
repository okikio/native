import { EventEmitter, TypeEventInput, TypeListenerCallback } from "@okikio/emitter";
import { Manager } from "@okikio/manager";
import { TypeAnimationTarget, TypeAnimationOptionTypes, TypeCallbackArgs, TypeComputedAnimationOptions, IAnimationOptions, TypeComputedOptions, TypeKeyFrameOptionsType, TypeAnimationEvents, TypePlayStates } from "./types";
export * from "./types";
export * from "./builtin-effects";
export * from "./css-properties";
export declare const getElements: (selector: string | Node) => Node[];
export declare const flatten: (arr: TypeAnimationTarget[]) => any[];
export declare const getTargets: (targets: TypeAnimationTarget) => Node[];
export declare const computeOption: (value: TypeAnimationOptionTypes, args: TypeCallbackArgs, context: Animate) => TypeComputedAnimationOptions;
/**
 * Acts like array.map(...) but for functions
 */
export declare const mapObject: (obj: object, fn: (value: any, key: any, obj: any) => any) => {};
export declare const mapAnimationOptions: (options: IAnimationOptions, args: TypeCallbackArgs, animate: Animate) => TypeComputedOptions;
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
export declare const parseOptions: (options: IAnimationOptions) => IAnimationOptions;
/**
 * Return a copy of the object without the keys specified in the keys argument
 *
 * @param keys - arrays of keys to remove from the object
 * @param obj - the object in question
 * @returns
 * a copy of the object without certain key
 */
export declare const omit: (keys: string[], obj: {
    [key: string]: any;
}) => {
    [x: string]: any;
};
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
     * The properties to animate
     */
    properties: object;
    /**
     * The total duration of all Animation's
     */
    totalDuration: number;
    /**
     * The smallest delay out of all Animation's
     */
    minDelay: number;
    /**
     * The smallest speed out of all Animation's
     */
    maxSpeed: number;
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
    /**
     * The list of Elements to Animate
     */
    targets: Manager<number, Node>;
    /**
     * The indexs of target Elements in Animate
     */
    targetIndexes: WeakMap<Node, number>;
    /**
     * A WeakMap of KeyFrameEffects
     */
    keyframeEffects: WeakMap<HTMLElement, KeyframeEffect>;
    /**
     * The options for individual animations
     *
     * A WeakMap that stores all the fully calculated options for individual Animation instances.
     *
     * _**Note**: the computedOptions are changed to their proper Animation instance options, so, some of the names are different, and options that can't be computed are not present. E.g. fillMode in the animation options is now just fill in the computedOptions.*_
     *
     * _**Note**: keyframes are not included, both the array form and the object form; the options, speed, extend, padEndDelay, and autoplay animation options are not included_
     */
    computedOptions: WeakMap<HTMLElement, TypeComputedOptions>;
    /**
     * A WeakMap of Animations
     */
    animations: WeakMap<KeyframeEffect, Animation>;
    /**
     * The keyframes for individual animations
     *
     * A WeakMap that stores all the fully calculated keyframes for individual Animation instances.
     *
     * _**Note**: the computedKeyframes are changed to their proper Animation instance options, so, some of the names are different, and options that can't be computed are not present. E.g. translateX, skew, etc..., they've all been turned into the transform property.*_
     */
    computedKeyframes: WeakMap<HTMLElement, TypeKeyFrameOptionsType>;
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
     * Get a specific Animation from an Animate instance
     */
    getAnimation(target: HTMLElement): Animation;
    /**
     * Returns the timings of an Animation, given a target
     * E.g. { duration, endDelay, delay, iterations, iterationStart, direction, easing, fill, etc... }
     */
    getTiming(target: HTMLElement): TypeComputedAnimationOptions;
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
     * Returns an array of computed options
     */
    protected createArrayOfComputedOptions(optionsFromParam: IAnimationOptions, len: number): object | Keyframe[] | import("./types").TypeGeneric[];
    /**
     * Creates animations out of an array of computed options
     */
    protected createAnimations(param: {
        arrOfComputedOptions: any;
        padEndDelay: any;
        oldCSSProperties: any;
        onfinish: any;
        oncancel: any;
        timeline?: any;
    }, len: number): void;
    /**
     * Update the options for all targets
     *
     * _**Note**: `KeyframeEffect` support is really low, so, I am suggest that you avoid using the `updateOptions` method, until browser support for `KeyframeEffect.updateTiming(...)` and `KeyframeEffefct.setKeyframes(...)` is better_
     *
     * @beta
     */
    updateOptions(options?: IAnimationOptions): void;
    /**
     * Adds a target to the Animate instance, and update the animation options with the change
     *
     * _**Note**: `KeyframeEffect` support is really low, so, I am suggest that you avoid using the `add` method, until browser support for `KeyframeEffect.updateTiming(...)` and `KeyframeEffefct.setKeyframes(...)` is better_
     *
     * @beta
     */
    add(target: HTMLElement): void;
    /**
     * Removes a target from an Animate instance
     *
     * _**Note**: it doesn't update the current running options, you need to use the `Animate.prototype.remove(...)` method if you want to also update the running options_
     */
    removeTarget(target: HTMLElement): void;
    /**
     * Removes a target from an Animate instance, and update the animation options with the change
     *
     * _**Note**: `KeyframeEffect` support is really low, so, I am suggest that you avoid using the `remove` method, until browser support for `KeyframeEffect.updateTiming(...)` and `KeyframeEffefct.setKeyframes(...)` is better_
     *
     * @beta
     */
    remove(target: HTMLElement): void;
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
export default animate;
