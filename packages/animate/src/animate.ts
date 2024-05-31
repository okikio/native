import { EventEmitter } from "@okikio/emitter/src/index.ts";
import { Manager } from "@okikio/manager/src/index.ts";

import { KeyframeParse, parseOffset } from "./builtin-effects.ts";
import { ParseTransformableCSSProperties, ParseTransformableCSSKeyframes, CSSCamelCase } from "./css-properties.ts";
import { flatten, mapObject, camelCaseToKebabCase, isValid, omit, isObject } from "./utils.ts";
import { createTransformValue, CSSVarSupport, transformCSSVars } from "./css-vars.ts";
import { getDocument } from "./browser-objects.ts";

import type { TypeEventInput, TypeListenerCallback } from "@okikio/emitter/src/index.ts";
import type { TypeAnimationTarget, TypeCallbackArgs, IStandaloneComputedAnimateOptions, IStandaloneAnimationConfig, IAnimateInstanceConfig, TypeAnimationEvents, TypePlayStates, ITotalDurationInfo } from "./types.ts";

/**
 * Get elements as an array
 * @param selector The selector to get the elements from
 * @returns An array of elements
 */
export function getElements(selector: string | Node): Node[] {
    return typeof selector === "string" ? Array.from(getDocument()?.querySelectorAll?.(selector as string)) : [selector];
};

/**
 * Retrieves all target elements
 * 
 * @param targets targets to retrieve, ranging from strings to arrays to DOM Elements
 * @returns Returns a flattened array with all the target to retrieve
 */
export function getTargets(targets: TypeAnimationTarget): Node[] {
    if (Array.isArray(targets)) {
        return flatten((targets as TypeAnimationTarget[]).map(getTargets));
    }
    if (typeof targets == "string" || targets instanceof Node)
        return getElements(targets);
    if (targets instanceof NodeList || targets instanceof HTMLCollection)
        return Array.from(targets);
    return [];
};

/**
 * Computes values. 
 * If the input value is a function, run it with the arguments from `args`, and the scope from `scope`, then return the computed value. 
 * Otherwise, return the input value.
 * 
 * @param value The value to compute
 * @param args If value is a function, the arguments to pass to said function
 * @param scope The scope of the function
 * @returns Returns the computed value if inputed value is a function, otherwise, returns the inputed value
 */
export function computeOption(value: unknown, args: TypeCallbackArgs, scope: Animate): unknown {
    if (typeof value === "function") {
        return value.apply(scope, args);
    } else return value;
};

/**
 * Loops through animation options and computes the values of each option if the option is a function.
 * @param options The computable options to compute
 * @param args The arguments to pass to the computable options, callback function
 * @param scope The scope of the computable options
 * @returns The computed values of computable options 
 */
export function mapAnimationOptions (options: IAnimateInstanceConfig, args: TypeCallbackArgs, scope: Animate): IStandaloneComputedAnimateOptions & Omit<KeyframeEffectOptions, keyof IStandaloneComputedAnimateOptions> {
    return mapObject(options, (value) => computeOption(value, args, scope));
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
 * Converts users input into a usable easing function string
 *
 * @param ease easing functions; {@link EasingKeys}, cubic-bezier, steps, linear, etc...
 * @returns an easing function that `KeyframeEffect` can accept
 */
export const GetEase = (ease: keyof typeof EASINGS | (string & {}) = "ease"): string => {
    // Convert camelCase strings into dashed strings, then Remove the "ease-" keyword
    let search = camelCaseToKebabCase(ease).replace(/^ease-/, "");
    return EasingKeys.includes(search) ? EASINGS[search] : ease;
};

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
 * 
 *   persist: true,
 *   fillMode: "none",
 * 
 *   direction: "normal",
 *   padEndDelay: false,
 *   timeline: document.timeline,
 *   extend: {}
 * }
 * ```
 */
export const DefaultAnimationOptions: IAnimateInstanceConfig = {
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

    persist: true,
    fillMode: "none",

    direction: "normal",
    padEndDelay: false,
    timeline: getDocument()?.timeline,
    extend: {}
};

/** Parses the different ways to define options, and returns a merged options object  */
export const parseOptions = (options: IAnimateInstanceConfig): IAnimateInstanceConfig => {
    let { options: animation, ...rest } = options;
    let oldOptions = animation instanceof Animate ? animation.options : (Array.isArray(animation) ? animation?.[0]?.options : animation);
    return Object.assign({}, oldOptions, rest);
}

/** 
 * The array of properties that can be computed as callback functions
*/
export const FUNCTION_SUPPORTED_ANIMATION_CONFIG_KEYS = ["easing", "loop", "endDelay", "duration", "speed", "delay", "timelineOffset", "direction", "extend", "fillMode", "composite"];

/** 
 * The array of properties that `can't` be computed as callback functions
*/
export const NON_FUNCTION_SUPPORTED_ANIMATION_CONFIG_KEYS = ["keyframes", "padEndDelay", "persist", "onfinish", "oncancel", "autoplay", "target", "targets", "timeline"];

/**
 * The full array of properties that are supported as config options, computable or not
 */
export const ALL_ANIMATION_CONFIG_KEYS = [...FUNCTION_SUPPORTED_ANIMATION_CONFIG_KEYS, ...NON_FUNCTION_SUPPORTED_ANIMATION_CONFIG_KEYS];

/**
 * An animation library for the modern web, which. Inspired by animate plus, and animejs, [@okikio/animate](https://www.skypack.dev/view/@okikio/animate) is a Javascript animation library focused on performance and ease of use.
 *
 * You can check it out here: <https://codepen.io/okikio/pen/qBbdGaW?editors=0011>
 */
export class Animate {
    /**
     * Stores the options for the current animation **with** the {@link DefaultAnimationOptions}
     *
     * Read more about the {@link DefaultAnimationOptions}
     */
    public options: IAnimateInstanceConfig = {};

    /** 
     * Stores the options for the current animation `without` the {@link DefaultAnimationOptions}
    */
    public initialOptions: IAnimateInstanceConfig = {};

    /**
     * The properties to animate
     */
    public properties: object = {};

    /**
     * The total duration of all Animation's
     */
    public totalDuration: number = 0;

    /**
     * The computed options that are used for the total duration
     */
    public totalDurationOptions: ITotalDurationInfo = {};

    /**
     * The largest duration out of all Animation's
     */
    public maxDuration: number = 0;

    /**
     * The smallest delay out of all Animation's
     */
    public minDelay: number = Infinity;

    /**
     * The fastest speed out of all Animation's
     */
    public maxSpeed: number = Infinity;

    /**
     * The largest end delay out of all Animation's
     */
    public maxEndDelay: number = 0;

    /**
     * The timelineOffset of the current Animate instance
     */
    public timelineOffset: number = 0;

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
     * An event emitter
     */
    public emitter: EventEmitter = new EventEmitter();

    /**
     * Returns a promise that is fulfilled when the mainAnimation is finished
     */
    public promise: Promise<Animate[]>;

    /**
     * The list of Elements to Animate
     */
    public targets: Manager<number, Node> = new Manager();

    /**
     * The indexs of target Elements in Animate
     */
    public targetIndexes: WeakMap<Node, number> = new WeakMap();

    /**
     * A WeakMap of KeyFrameEffects
     */
    public keyframeEffects: WeakMap<HTMLElement, KeyframeEffect> = new WeakMap();

    /**
     * The options for individual animations
     *
     * A WeakMap that stores all the fully calculated options for individual Animation instances.
     *
     * _**Note**: the computedOptions are changed to their proper Animation instance options, so, some of the names are different, and options that can't be computed are not present. E.g. fillMode in the animation options is now just fill in the computedOptions.*_
     *
     * _**Note**: keyframes are not included, both the array form and the object form; the options, speed, extend, padEndDelay, and autoplay animation options are not included_
     */
    public computedOptions: WeakMap<HTMLElement, KeyframeEffect> = new WeakMap();

    /**
     * A WeakMap of Animations
     */
    public animations: WeakMap<KeyframeEffect, Animation> = new WeakMap();

    /**
     * The keyframes for individual animations
     *
     * A WeakMap that stores all the fully calculated keyframes for individual Animation instances.
     *
     * _**Note**: the computedKeyframes are changed to their proper Animation instance options, so, some of the names are different, and options that can't be computed are not present. E.g. translateX, skew, etc..., they've all been turned into the transform property.*_
     */
    public computedKeyframes: WeakMap<HTMLElement, Keyframe[] | PropertyIndexedKeyframes> = new WeakMap();

    constructor(options: IAnimateInstanceConfig = {}) {
        this.loop = this.loop.bind(this);
        this.onVisibilityChange = this.onVisibilityChange.bind(this);
        this.on("error", console.error);
        this.updateOptions(options);

        if (this.mainAnimation) {
            this.visibilityPlayState = this.getPlayState();
            if (Animate.pauseOnPageHidden) {
                getDocument()?.addEventListener('visibilitychange', this.onVisibilityChange, false);
            }
        }

        this.newPromise();
    }

    /**
     * Stores all currently running instances of the Animate Class that are actively using requestAnimationFrame to check progress, 
     * it's meant to ensure you don't have multiple instances of the Animate Class creating multiple requestAnimationFrames at the same time
     * this can cause performance hiccups
     */
    static RUNNING: Set<Animate> = new Set();

    /**
     * Stores request frame calls
     */
    static animationFrame: number;

    /** 
     * Specifies the maximum number of times per second the "update" event fires.
     */
    static FRAME_RATE = 60;

    /**
     * Stores frame start time to ensure framerates are met
     */
    protected static FRAME_START_TIME: number = 0;

    /**
     * Calls requestAnimationFrame for each running instance of Animate.
     * Often the "update" event is used for heavy animations that the browser can't handle natively via WAAPI, or 
     * for keeping track of the progress of Animations, for those use cases, using a full 60fps or 120fps is not nessecary,
     * you can force a maximum constant framerate by setting `Animate.FRAME_RATE` to the framerate you wish, 
     * by default it's `60` frames per second
     */
    static requestFrame(time: DOMHighResTimeStamp = 0) {
        let interval = 1000 / Animate.FRAME_RATE;
        let elapsed = time - Animate.FRAME_START_TIME;

        if (elapsed > interval) {
            Animate.FRAME_START_TIME = time - (elapsed % interval);
            Animate.RUNNING.forEach((inst) => {
                if (inst.emitter.getEvent("update").length <= 0) {
                    inst.stopLoop();
                } else { inst.loop(); }
            });
        }

        // If there are no more Animate instances in the RUNNING WeakSet,
        // cancel the requestAnimationFrame
        if (Animate.RUNNING.size > 0) {
            Animate.animationFrame = window.requestAnimationFrame(Animate.requestFrame);
        } else Animate.cancelFrame();
    }

    /**
     * Cancels animationFrame
     */
    static cancelFrame() {
        window.cancelAnimationFrame(Animate.animationFrame);
        Animate.animationFrame = null;
    }

    /**
     * Represents an Animation Frame Loop
     */
    public loop() {
        this.emit("update", this.getProgress(), this);
        return this;
    }

    /**
     * Cancels animation frame
     */
    public stopLoop() {
        Animate.RUNNING.delete(this);
        return this;
    }

    /**
     * Tells all animate instances to pause when the page is hidden
     */
    static pauseOnPageHidden: Boolean = true;

    /**
     * Store the last remebered playstate before page was hidden
     */
    public visibilityPlayState: TypePlayStates;

    /**
     * document `visibilitychange` event handler
     */
    public onVisibilityChange() {
        if (getDocument()?.hidden) {
            this.visibilityPlayState = this.getPlayState();
            if (this.is("running")) {
                this.loop();
                this.pause();
            }
        } else {
            if (this.visibilityPlayState == "running" && this.is("paused"))
                this.play();
        }
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
            this.emitter?.once?.("finish", () => resolve([this]));
            this.emitter?.once?.("error", err => reject(err));
        });

        return this.promise;
    }

    /**
     * Fulfills the `this.promise` Promise
     */
    public then(
        onFulfilled?: (value?: any) => any,
        onRejected?: (reason?: any) => any
    ) {
        onFulfilled = onFulfilled?.bind(this);
        onRejected = onRejected?.bind(this);
        this.promise?.then?.(onFulfilled, onRejected);
        return this;
    }

    /**
     * Catches error that occur in the `this.promise` Promise
     */
    public catch(onRejected: (reason?: any) => any) {
        onRejected = onRejected?.bind(this);
        this.promise?.catch?.(onRejected);
        return this;
    }

    /**
     * If you don't care if the `this.promise` Promise has either been rejected or resolved
     */
    public finally(onFinally: () => any) {
        onFinally = onFinally?.bind(this);
        this.promise?.finally?.(onFinally);
        return this;
    }

    /**
     * Calls a method that affects all animations **excluding** the mainAnimation
    */
    public allAnimations(method: (animation?: Animation, target?: HTMLElement) => void) {
        this.targets.forEach((target: HTMLElement) => {
            let keyframeEffect = this.keyframeEffects.get(target);
            let animation = this.animations.get(keyframeEffect);
            return method(animation, target);
        });
        return this;
    }

    /**
     * Calls a method that affects all animations **including** the mainAnimation
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
    public play() {
        let playstate = this.getPlayState();
        this.beginEvent();
        this.all(anim => anim.play());
        this.emit("play", playstate, this);
        this.emit("playstate-change", playstate, this);

        this.loop();

        // Because the Web Animation API doesn't require requestAnimationFrame for animations,
        // we only run the requestAnimationFrame when there is a "update" event listener 
        Animate.RUNNING.add(this);
        Animate.requestFrame();
        return this;
    }

    /**
     * Pause Animation
     */
    public pause() {
        let playstate = this.getPlayState();
        this.all(anim => anim.pause());
        this.emit("pause", playstate, this);
        this.emit("playstate-change", playstate, this);
        this.stopLoop();
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
     * Commits the end styling state of an animation to the element being animated, even after that animation has been removed. It will cause the end styling state to be written to the element being animated, in the form of properties inside a style attribute.
     * Learn more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Animation/commitStyles)
     */
    public commitStyles() {
        this.all(anim => anim?.commitStyles());
        return this;
    }

    /**
     * Explicitly persists an animations final state it's similar to `commitStyles` except it doesn't care if the animation is filling or not.
     * It does the exact same thing {@link IAnimationOptions.persist} does, except it's in function form. 
     * 
     * > _**Warning**: This is different [MDN Animation.persist](https://developer.mozilla.org/en-US/docs/Web/API/Animation/persist), this keeps the final state of CSS during the animation, while [MDN Animation.persist](https://developer.mozilla.org/en-US/docs/Web/API/Animation/persist), tells the browser to not automatically remove Animations._ 
     */
    public persist() {
        // Persist animation states without `fillMode`
        this.targets.forEach((target: HTMLElement) => {
            let computedKeyframes = this.computedKeyframes.get(target);
            if (Array.isArray(computedKeyframes) && computedKeyframes.length) {
                mapObject(computedKeyframes[computedKeyframes.length - 1], (value: any, key: any) => {
                    target.style.setProperty(key, value);
                });
            } else {
                mapObject(computedKeyframes, (value: any, key: any) => {
                    if (!value.length || key == "offset") return;
                    target.style.setProperty(key, value[value.length - 1]);
                });
            }
        });
        
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
        this.stopLoop();
        getDocument()?.removeEventListener('visibilitychange', this.onVisibilityChange, false);

        this.targets.forEach((target: HTMLElement) => this.removeTarget(target));

        this.emit("stop");
        this.emitter.clear();

        this.mainkeyframeEffect = null;
        this.mainAnimation = null;

        this.mainElement?.remove?.();
        this.mainElement = null;

        this.promise = null;
        this.computedOptions = null;
        this.animations = null;
        this.keyframeEffects = null;
        this.emitter = null;
        this.targets = null;
        this.options = null;
        this.properties = null;
    }

    /**
     * Get a specific Animation from an Animate instance
     */
    public getAnimation(target: HTMLElement) {
        let keyframeEffect = this.keyframeEffects.get(target);
        return this.animations.get(keyframeEffect);
    }

    /**
     * Returns the timings of an Animation, given a target
     * E.g. { duration, endDelay, delay, iterations, iterationStart, direction, easing, fill, etc... }
     */
    public getTiming(target: HTMLElement): KeyframeEffectOptions {
        let keyframeOptions = this.computedOptions.get(target) ?? {};
        let timings = this.keyframeEffects.get(target).getTiming?.() ?? {};

        return { ...keyframeOptions, ...timings };
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
     * Returns a boolean determining if the `animate` instances playstate is equal to the `playstate` parameter.
     */
    public is(playstate: TypePlayStates) {
        return this.getPlayState() == playstate;
    }

    /**
     * Set the current time of the Main Animation
     */
    public setCurrentTime(time: number) {
        this.all(anim => (anim.currentTime = time));
        this.emit("update", this.getProgress());
        return this;
    }

    /**
     * Set the Animation progress as a value from 0 to 100
     */
    public setProgress(percent: number) {
        let time = (percent / 100) * this.totalDuration;
        this.setCurrentTime(time);
        return this;
    }

    /**
     * Set the playback speed of an Animation
     */
    public setSpeed(speed: number | string = 1) {
        if (typeof speed == "string")
            speed = Number(speed);

        this.maxSpeed = speed as number;
        this.all(anim => {
            if (anim.updatePlaybackRate)
                anim.updatePlaybackRate(speed as number);
            else anim.playbackRate = speed as number;
        });
        return this;
    }

    /**
     * Returns an array of computed options
     */
    protected createArrayOfComputedOptions(optionsFromParam: IAnimateInstanceConfig, len: number) {
        let result: (ReturnType<typeof mapAnimationOptions> & {
            /**
             * The temporary storage of a specific animations total duration
             */
            tempDurations?: number,
            iterations?: KeyframeEffectOptions["iterations"] | number
        })[] = [];

        // Converts animation options to their proper Animation Effects forms
        let convertOptions = (getOption: Function) => {
            return Object.assign({
                easing: getOption("easing"),
                iterations: getOption("loop"),
                direction: getOption("direction"),
                endDelay: getOption("endDelay"),
                duration: getOption("duration"),
                speed: getOption("speed"),
                delay: getOption("delay"),
                timelineOffset: getOption("timelineOffset"),
                keyframes: getOption("keyframes"),
                fill: getOption("fillMode"),
                composite: getOption("composite"),
            }, getOption("extend") ?? {});
        };

        // This sets good defaults for situations where no targets are given e.g. Queue's mainAnimateInstance
        // If the total number of targets is zero or less, it means there not values in  `arrOfComputedOptions`
        // So, set the values for `totalDuration`, `minDelay`, `maxSpeed`, etc... to the options directly
        if (this.targets.size == 0) {
            let { delay, duration, iterations, endDelay, speed, timelineOffset } = convertOptions((key: string) => {
                let value = optionsFromParam[key] ?? this.options[key] ?? DefaultAnimationOptions[key];
                return typeof value !== "function" ? value : DefaultAnimationOptions[key];
            });

            timelineOffset = Number(timelineOffset);
            iterations = Number(iterations);
            duration = Number(duration);
            endDelay = Number(endDelay);
            speed = Number(speed);
            delay = Number(delay);

            this.timelineOffset = timelineOffset;
            this.minDelay = delay;
            this.maxSpeed = speed;

            this.maxDuration = duration;
            this.maxEndDelay = endDelay;

            this.totalDuration = delay + timelineOffset + (duration * iterations) + endDelay;
            this.totalDurationOptions = { delay, duration, iterations, endDelay, speed, timelineOffset, totalDuration: this.totalDuration, };
        }

        this.targets.forEach((target: HTMLElement, i) => {
            // Basically if there is already a computedOption for the target element use it, but don't ovveride any new options
            let oldComputedOptions = (this.computedOptions.get(target) ?? {}) as IAnimateInstanceConfig;
            let animationOptions = convertOptions((key: string) => {
                let computedKey = key;
                if (key == "loop") computedKey = "iterations";
                if (key == "fillMode") computedKey = "fill";
                return optionsFromParam[key] ?? oldComputedOptions[computedKey] ?? this.options[key] ?? DefaultAnimationOptions[key];
            });

            // Allows the use of functions as the values, for both the keyframes and the animation object
            // It adds the capability of advanced stagger animation, similar to the animejs stagger functions
            let computedOptions = mapAnimationOptions(animationOptions as IAnimateInstanceConfig, [i, len, target], this);
            if (typeof computedOptions.easing == "string" || Array.isArray(computedOptions.easing)) {
                let { easing } = computedOptions;
                computedOptions.easing = (Array.isArray(easing) ? (easing as string[]).map(ease => GetEase(ease)) : GetEase(easing)) as IStandaloneAnimationConfig["easing"];
            }

            // @ts-ignore
            if (computedOptions.iterations === true)
                computedOptions.iterations = Infinity;

            // Add timelineOffset to delay, this is future proofing, it's what allows the Queue class to act like animejs's timeline functions
            let {
                timelineOffset,
                speed,
                endDelay,
                delay,
                duration,
                iterations,
                ...remainingComputedOptions
            } = computedOptions;

            timelineOffset = Number(timelineOffset);
            iterations = Number(iterations);
            duration = Number(duration);
            endDelay = Number(endDelay);
            speed = Number(speed);
            delay = Number(delay) + timelineOffset;

            this.timelineOffset = timelineOffset ?? this.timelineOffset;
            if (this.minDelay > delay) this.minDelay = delay;
            if (this.maxSpeed > speed) this.maxSpeed = speed;

            if (this.maxDuration < duration)
                this.maxDuration = duration;

            if (this.maxEndDelay < endDelay)
                this.maxEndDelay = endDelay;

            let tempDuration = delay + timelineOffset + (duration * iterations) + endDelay;

            // Set the totalDuration to be the Animation with the largest totalDuration
            if (this.totalDuration < tempDuration) {
                this.totalDuration = tempDuration;
                this.totalDurationOptions = {
                    delay,
                    duration,
                    totalDuration: tempDuration,
                    iterations,
                    endDelay,
                    speed,
                    timelineOffset
                };
            }

            result[i] = {
                ...remainingComputedOptions,
                speed,
                tempDurations: tempDuration,
                endDelay,
                delay,
                duration,
                iterations,
                timelineOffset
            };
        }, this);
        return result;
    }

    /**
     * Specifies if animations should use CSS variables, as CSS variables are not hardware accelerated
     */
    public static USE_CSS_VARS = false;

    /**
     * Creates animations out of an array of computed options
     */
    protected createAnimations(param: { arrOfComputedOptions: any; padEndDelay: any; oldCSSProperties: any; onfinish: any; oncancel: any; persist?: boolean; timeline?: any; }, len: number) {
        let {
            arrOfComputedOptions,
            padEndDelay,
            oldCSSProperties,
            onfinish,
            oncancel,
            persist,
            timeline
        } = param;

        this.targets.forEach((target: HTMLElement, i) => {
            let { speed, keyframes, tempDurations, timelineOffset, ...computedOptions } = arrOfComputedOptions[i];
            let transformValue: string;

            // You cannot use the `padEndDelay` option and set a value for `endDelay`, the `endDelay` value will
            // replace the padded endDelay

            // This ensures all `animations` match up to the total duration, and don't finish too early,
            // if animations finish too early, when the `.play()` method is called, some animations
            // that are finished will restart, while the rest will continue playing.
            // This is mostly for progress control, but depending on your usage may truly benefit you
            if (padEndDelay && computedOptions.endDelay == 0 &&
                Math.abs(computedOptions.iterations) != Math.abs(Infinity)) {
                computedOptions.endDelay = this.totalDuration - tempDurations;
            }

            let computedKeyframes: Keyframe[] | PropertyIndexedKeyframes;
            let animationKeyframe: Keyframe[] | PropertyIndexedKeyframes;

            // Accept keyframes as a keyframes Object, or a method,
            // if there are no animations in the keyframes array,
            // uses css properties from the options object
            let arrKeyframes = keyframes as (Keyframe[] | PropertyIndexedKeyframes);
            if (isObject(arrKeyframes)) arrKeyframes = KeyframeParse(arrKeyframes);

            // If `computedKeyframes` have been previously computed for this target element replace
            // the old uncomputed CSS properties with it, otherwise, use the uncomputed property
            let oldComputedKeyframe = this.computedKeyframes.get(target) ?? {};

            // To avoid unexpected errors the computed transform property is removed.
            // The computed transform property is manually added to the AnimationOptions by `ParseTransformableCSSProperties`,
            // this causes errors when trying to update an Animate instance, to avoid said errors, we omit the `transform` property, 
            // but only if it wasn't present in the non computed `AnimationOptions`
            let excludeComputedTransform = "transform" in this.properties ? oldComputedKeyframe : omit(["transform"], oldComputedKeyframe);
            let fullProperties = Object.assign({}, oldCSSProperties, excludeComputedTransform);

            // Replace old CSS properties with new CSS properties if there is a new value for the CSS property
            // As in the new CSS property is not null or null
            let properties = mapObject(fullProperties, (value, key) => (this.properties[key] ?? value));

            // Prefer arrays of keyframes over pure CSS Properties
            animationKeyframe = isValid(arrKeyframes) ? arrKeyframes : properties as PropertyIndexedKeyframes;

            if (!Array.isArray(animationKeyframe)) {
                // Remove `keyframes` animation option, it's not a valid CSS property
                let remaining: IAnimateInstanceConfig = omit(["keyframes"], animationKeyframe);
                let { offset, ...CSSProperties } = mapAnimationOptions(remaining, [i, len, target], this);

                // Convert dashed case properties to camelCase, then create a transform CSS value with CSS Vars. as transform functions, 
                // and with each CSS variable/transform function running in the order they were defined as Animation Options.
                transformValue = createTransformValue(CSSCamelCase(CSSProperties));

                // transform, is often used so, to make them easier to use we parse them for strings, number, and/or arrays of both;
                // for transform we parse the translate, skew, scale, and perspective functions (including all their varients) as CSS properties;
                // it then turns these properties into valid `PropertyIndexedKeyframes`
                // Read the documentation for `ParseTransformableCSSProperties`
                let TransformedCSSProperties = ParseTransformableCSSProperties((CSSProperties as any) as Keyframe, Animate.USE_CSS_VARS);

                let _offset = offset as IStandaloneComputedAnimateOptions["offset"];
                computedKeyframes = Object.assign({},
                    TransformedCSSProperties,
                    isValid(_offset) ? { offset: _offset.map(v => parseOffset(v)) } : null
                ) as PropertyIndexedKeyframes;
            } else {
                computedKeyframes = animationKeyframe.map((keyframe: Keyframe) => {
                    // Remove `speed` & `loop`, they are not valid CSS properties
                    let { easing, offset, ...remaining } = omit(["speed", "loop"], keyframe);

                    return Object.assign({},
                        remaining,
                        typeof easing == "string" ? { easing: GetEase(easing) } : null,
                        typeof offset == "string" || typeof offset == "number"
                            ? { offset: parseOffset(offset) } : null
                    );
                });

                // The transform CSS value with CSS Vars support, and with each transform function running in order
                transformValue = createTransformValue(transformCSSVars);

                // Transform transformable CSS properties in each keyframe of the keyframe array
                computedKeyframes = ParseTransformableCSSKeyframes(computedKeyframes, Animate.USE_CSS_VARS) as Keyframe[];
            }

            let animation: Animation, keyFrameEffect: KeyframeEffect;
            if (this.keyframeEffects.has(target)) {
                // Update the animation, if the target already is already being animated
                keyFrameEffect = this.keyframeEffects.get(target);
                animation = this.animations.get(keyFrameEffect);

                keyFrameEffect?.setKeyframes?.(computedKeyframes);
                keyFrameEffect?.updateTiming?.(computedOptions as KeyframeAnimationOptions);
            } else {
                // Create animation and add it to the Animations Set
                keyFrameEffect = new KeyframeEffect(target, computedKeyframes, computedOptions as KeyframeAnimationOptions);
                animation = new Animation(keyFrameEffect, timeline);

                this.keyframeEffects.set(target, keyFrameEffect);
                this.animations.set(keyFrameEffect, animation);
            }

            if (typeof speed == "string") speed = Number(speed);
            if (animation.updatePlaybackRate)
                animation.updatePlaybackRate(speed);
            else animation.playbackRate = speed;

            // Support for on finish
            animation.onfinish = () => {
                // Persist animation states without `fillMode`
                if (persist) {
                    if (Array.isArray(computedKeyframes) && computedKeyframes.length) {
                        mapObject(computedKeyframes[computedKeyframes.length - 1], (value: any, key: any) => {
                            target.style.setProperty(key, value);
                        });
                    } else {
                        mapObject(computedKeyframes, (value: any, key: any) => {
                            if (!value.length || key == "offset") return;
                            target.style.setProperty(key, value[value.length - 1]);
                        });
                    }
                }

                typeof onfinish == "function" && onfinish.call(this, target, i, len, animation);
            };

            // Support for on cancel
            animation.oncancel = () => {
                typeof oncancel == "function" && oncancel.call(this, target, i, len, animation);
            };

            // To avoid bugs, we manually apply the transform property from the computed CSS properties if CSS Vars are supported
            // Note: CSS vars. are not hardware accelerated, so you must really need the flexibility of CSS Vars. before using them
            if (CSSVarSupport && Animate.USE_CSS_VARS)
                Object.assign(target?.style, { transform: transformValue });

            // Set the calculated options & keyframes for each individual animation
            this.computedOptions.set(target, computedOptions);
            this.computedKeyframes.set(target, computedKeyframes);
        });
    }

    /**
     * Update the options for all targets
     *
     * _**Note**: `KeyframeEffect` support is really low, so, I am suggest that you avoid using the `updateOptions` method, until browser support for `KeyframeEffect.updateTiming(...)` and `KeyframeEffefct.setKeyframes(...)` is better_
     */
    public updateOptions(options: IAnimateInstanceConfig = {}) {
        try {
            let optionsFromParam = parseOptions(options);
            this.initialOptions = optionsFromParam;
            this.options = Object.assign({}, DefaultAnimationOptions, this.options, optionsFromParam);

            // This removes all none CSS properties from `properties`
            let {
                // These values cannot be functions
                padEndDelay,
                autoplay,
                target,
                targets,
                timeline,
                persist,

                // These values are always functions
                onfinish,
                oncancel,

                /**
                 * Theses are the CSS properties to be animated as Keyframes
                 */
                ...oldCSSProperties
            } = omit(FUNCTION_SUPPORTED_ANIMATION_CONFIG_KEYS, this.options);

            // This removes all none CSS properties from `optionsFromParam`
            this.properties = omit(ALL_ANIMATION_CONFIG_KEYS, optionsFromParam);

            // Avoid duplicate elements
            let oldTargets = this.targets.values();
            let targetSet = [...new Set([...oldTargets, ...getTargets(targets), ...getTargets(target)])];

            this.targets.clear();
            targetSet.forEach((value, i) => {
                this.targets.set(i, value);
                this.targetIndexes.set(value, i);
            });

            let len = this.targets.size;
            let arrOfComputedOptions = this.createArrayOfComputedOptions(optionsFromParam, len);
            this.createAnimations({
                arrOfComputedOptions,
                padEndDelay,
                oldCSSProperties,
                onfinish,
                oncancel,
                persist,
                timeline
            }, len);

            if (!this.mainAnimation) {
                this.mainkeyframeEffect = new KeyframeEffect(this.mainElement, null, {
                    duration: this.totalDuration
                });

                this.mainAnimation = new Animation(this.mainkeyframeEffect, timeline);
            } else {
                this.mainkeyframeEffect?.updateTiming?.({
                    duration: this.totalDuration
                });

                if (!this.mainkeyframeEffect.setKeyframes || !this.mainkeyframeEffect.updateTiming)
                    console.warn("[Animate - @okikio/animate] `KeyframeEffect.setKeyframes` and/or `KeyframeEffect.updateTiming` are not supported in this browser.");
            }

            if (this.mainAnimation.updatePlaybackRate)
                this.mainAnimation.updatePlaybackRate(this.maxSpeed);
            else this.mainAnimation.playbackRate = this.maxSpeed;

            this.mainAnimation.onfinish = () => {
                if (this.mainAnimation) {
                    let playstate = this.getPlayState();
                    this.emit("playstate-change", playstate, this);

                    // Ensure the progress reaches 100%
                    this.loop();
                    this.stopLoop();
                }

                this.emit("finish", this);
            };

            this.mainAnimation.oncancel = () => {
                if (this.mainAnimation) {
                    let playstate = this.getPlayState();
                    this.emit("playstate-change", playstate, this);

                    // Ensure the progress is accurate
                    this.loop();
                    this.stopLoop();
                }

                this.emit("cancel", this);
            };

            if (autoplay) {
                // By the time events are registered the animation would have started and there wouldn't have be a `begin` event listener to actually emit
                // So, this defers the emitting for a 0ms time allowing the rest of the js to run, the `begin` event to be registered thus
                // the `begin` event can be emitter
                let timer: number | void = window.setTimeout(() => {
                    this.emit("begin", this);

                    let playstate = this.getPlayState();
                    this.emit("playstate-change", playstate, this);

                    timer = window.clearTimeout(timer as number);
                }, 0);
                this.play();
            } else this.pause();
        } catch (err) {
            this.emit("error", err);
        }
    }

    /**
     * Adds a target to the Animate instance, and update the animation options with the change
     *
     * _**Note**: `KeyframeEffect` support is really low, so, I am suggest that you avoid using the `add` method, until browser support for `KeyframeEffect.updateTiming(...)` and `KeyframeEffefct.setKeyframes(...)` is better_
     */
    public add(target: HTMLElement) {
        let progress = this.getProgress();
        let running = this.is("running");
        let paused = this.is("paused");

        this.updateOptions({ target });
        this.setProgress(progress);

        if (running) this.play();
        else if (paused) this.pause();
        return this;
    }

    /**
     * Removes a target from an Animate instance
     *
     * _**Note**: it doesn't update the current running options, you need to use the `Animate.prototype.remove(...)` method if you want to also update the running options_
     */
    public removeTarget(target: HTMLElement) {
        let keyframeEffect = this.keyframeEffects.get(target);
        this.animations.delete(keyframeEffect);
        keyframeEffect = null;

        this.computedKeyframes.delete(target);
        this.computedOptions.delete(target);
        this.keyframeEffects.delete(target);

        let index = this.targetIndexes.get(target);
        this.targets.delete(index);
        this.targetIndexes.delete(target);
        return this;
    }

    /**
     * Removes a target from an Animate instance, and update the animation options with the change
     *
     * _**Note**: `KeyframeEffect` support is really low, so, I am suggest that you avoid using the `remove` method, until browser support for `KeyframeEffect.updateTiming(...)` and `KeyframeEffefct.setKeyframes(...)` is better_
     */
    public remove(target: HTMLElement) {
        this.removeTarget(target);

        let targetSet = new Set([].concat(this.targets.values()));

        this.options.target = [...targetSet];
        this.options.targets = [];
        targetSet.clear();
        targetSet = null;

        let progress = this.getProgress();
        let running = this.is("running");
        let paused = this.is("paused");

        this.updateOptions();

        if (running) this.play();
        else if (paused) this.pause();

        this.setProgress(progress);
        return this;
    }

    /**
     * Adds a listener for a given event
     */
    public on(events: TypeAnimationEvents[] | TypeAnimationEvents | TypeEventInput, callback?: TypeListenerCallback | object, scope?: object) {
        scope = scope ?? this;
        this.emitter?.on?.(events, callback ?? scope, scope);

        // Because the Web Animation API doesn't require requestAnimationFrame for animations,
        // we only run the requestAnimationFrame when there is a "update" event listener 
        if (this.emitter.getEvent("update").length > 0) {
            Animate.RUNNING.add(this);
            if (Animate.animationFrame == null) Animate.requestFrame();
        }

        return this;
    }

    /**
     * Removes a listener from an event
     */
    public off(events: TypeAnimationEvents[] | TypeAnimationEvents | TypeEventInput, callback?: TypeListenerCallback | object, scope?: object) {
        scope = scope ?? this;
        this.emitter?.off?.(events, callback ?? scope, scope);
        return this;
    }

    /**
     * Call all listeners within an event
     */
    public emit(events: TypeAnimationEvents[] | TypeAnimationEvents | (string & {})[] | (string & {}), ...args: any) {
        this.emitter?.emit?.(events, ...args);
        return this;
    }

    /** Returns the Animate options, as JSON  */
    public toJSON(): IAnimateInstanceConfig {
        return this.options;
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
export const animate = (options: IAnimateInstanceConfig = {}) => {
    return new Animate(options);
};

export default animate;