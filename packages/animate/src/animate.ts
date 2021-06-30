import { EventEmitter } from "@okikio/emitter";
import { Manager } from "@okikio/manager";
import { KeyframeParse, parseOffset } from "./builtin-effects";
import { ParseTransformableCSSProperties, ParseTransformableCSSKeyframes } from "./css-properties";
import { flatten, mapObject, convertToDash, isValid, omit } from "./utils";

import type { TypeEventInput, TypeListenerCallback } from "@okikio/emitter";
import type { TypeAnimationTarget, TypeAnimationOptionTypes, TypeCallbackArgs, TypeComputedAnimationOptions, IAnimationOptions, TypeComputedOptions, TypeKeyFrameOptionsType, TypeCSSLikeKeyframe, ICSSComputedTransformableProperties, TypeAnimationEvents, TypePlayStates } from "./types";

/* DOM */
export const getElements = (selector: string | Node): Node[] => {
    return typeof selector === "string" ? Array.from(document.querySelectorAll(selector as string)) : [selector];
};

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
export const computeOption = (value: TypeAnimationOptionTypes, args: TypeCallbackArgs, context: Animate): TypeComputedAnimationOptions => {
    if (typeof value === "function") {
        return value.apply(context, args);
    } else return value;
};

export const mapAnimationOptions = (options: IAnimationOptions, args: TypeCallbackArgs, animate: Animate): TypeComputedOptions => {
    return mapObject(options, (value) => computeOption(value, args, animate));
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
 * @param ease - easing functions; {@link EasingKeys}, cubic-bezier, steps, linear, etc...
 * @returns an easing function that `KeyframeEffect` can accept
 */
export const GetEase = (ease: keyof typeof EASINGS | string = "ease"): string => {
    // Convert camelCase strings into dashed strings, then Remove the "ease-" keyword
    let search = convertToDash(ease).replace(/^ease-/, "");
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
 *   fillMode: "none",
 *   direction: "normal",
 *   padEndDelay: false,
 *   timeline: document.timeline,
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
    timeline: document.timeline,
    extend: {}
};

/** Parses the different ways to define options, and returns a merged options object  */
export const parseOptions = (options: IAnimationOptions): IAnimationOptions => {
    let { options: animation, ...rest } = options;
    let oldOptions = animation instanceof Animate ? animation.options : (Array.isArray(animation) ? animation?.[0]?.options : animation);
    return Object.assign({}, oldOptions, rest);
}

export const FUNCTION_SUPPORTED_TIMING_KEYS = ["easing", "loop", "endDelay", "duration", "speed", "delay", "timelineOffset", "direction", "extend", "fillMode", "offset"];
export const NOT_FUNCTION_SUPPORTED_TIMING_KEYS = ["keyframes", "padEndDelay", "onfinish", "oncancel", "autoplay", "target", "targets", "timeline"];
export const ALL_TIMING_KEYS = [...FUNCTION_SUPPORTED_TIMING_KEYS, ...NOT_FUNCTION_SUPPORTED_TIMING_KEYS];

/**
 * An animation library for the modern web, which. Inspired by animate plus, and animejs, [@okikio/animate](https://www.skypack.dev/view/@okikio/animate) is a Javascript animation library focused on performance and ease of use.
 *
 * You can check it out here: <https://codepen.io/okikio/pen/qBbdGaW?editors=0011>
 */
export class Animate {
    /**
     * Stores the options for the current animation
     *
     * Read more about the {@link DefaultAnimationOptions}
     */
    public options: IAnimationOptions = {};

    /**
     * The properties to animate
     */
    public properties: object = {};

    /**
     * The total duration of all Animation's
     */
    public totalDuration: number = -Infinity;

    /**
     * The smallest delay out of all Animation's
     */
    public minDelay: number = Infinity;

    /**
     * The smallest speed out of all Animation's
     */
    public maxSpeed: number = Infinity;

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
    public computedOptions: WeakMap<HTMLElement, TypeComputedOptions> = new WeakMap();

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
    public computedKeyframes: WeakMap<HTMLElement, TypeKeyFrameOptionsType> = new WeakMap();
    constructor(options: IAnimationOptions) {
        this.loop = this.loop.bind(this);
        this.onVisibilityChange = this.onVisibilityChange.bind(this);

        this.on("error", console.error);
        this.updateOptions(options);

        if (this.mainAnimation) {
            this.visibilityPlayState = this.getPlayState();
            if (Animate.pauseOnPageHidden) {
                document.addEventListener('visibilitychange', this.onVisibilityChange, false);
            }
        }

        this.newPromise();
    }

    /**
     * Tells all animate instances to pause when the page is hidden
     */
    static pauseOnPageHidden: Boolean = true;

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
     * Calls requestAnimationFrame for each running instance of Animate
     */
    static requestFrame() {
        // Cancel any lingering requestAnimationFrames from preious run of the requestFrame method
        Animate.cancelFrame();
        Animate.RUNNING.forEach((inst) => {
            if (inst.emitter.getEvent("update").length <= 0) {
                inst.stopLoop();
            } else { inst.loop(); }
        });

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
    public loop(): void {
        this.emit("update", this.getProgress(), this);
    }

    /**
     * Cancels animation frame
     */
    public stopLoop() {
        Animate.RUNNING.delete(this);
    }

    /**
     * Store the last remebered playstate before page was hidden
     */
    protected visibilityPlayState: TypePlayStates;

    /**
     * document `visibilitychange` event handler
     */
    protected onVisibilityChange() {
        if (document.hidden) {
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
    ): Animate {
        onFulfilled = onFulfilled?.bind(this);
        onRejected = onRejected?.bind(this);
        this.promise?.then?.(onFulfilled, onRejected);
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
     * Calls a method that affects all animations **excluding** the mainAnimation; the method only allows the animation parameter
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

        // Because the Web Animation API doesn't require requestAnimationFrame for animations,
        // we only run the requestAnimationFrame when there is a "update" event listener 
        Animate.RUNNING.add(this);
        Animate.requestFrame();
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
        this.stopLoop();
        document.removeEventListener('visibilitychange', this.onVisibilityChange, false);

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
    public getTiming(target: HTMLElement): TypeComputedAnimationOptions {
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
    public setCurrentTime(time: number): Animate {
        this.all(anim => (anim.currentTime = time));
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
     * Returns an array of computed options
     */
    protected createArrayOfComputedOptions(optionsFromParam: IAnimationOptions, len: number) {
        let result: TypeComputedAnimationOptions = [];
        this.targets.forEach((target: HTMLElement, i) => {
            // Basically if there is already a computedOption for the target element use it, but don't ovveride any new options
            let oldComputedOptions: IAnimationOptions = this.computedOptions.get(target) ?? {};
            let getOption = (key: string) => {
                let computedKey = key;
                if (key == "loop") computedKey = "iterations";
                if (key == "fillMode") computedKey = "fill";
                return optionsFromParam[key] ?? oldComputedOptions[computedKey] ?? this.options[key] ?? DefaultAnimationOptions[key];
            };

            let animationOptions = Object.assign({
                easing: getOption("easing"),
                iterations: getOption("loop"),
                direction: getOption("direction"),
                endDelay: getOption("endDelay"),
                duration: getOption("duration"),
                speed: getOption("speed"),
                delay: getOption("delay"),
                timelineOffset: getOption("timelineOffset"),
                keyframes: getOption("keyframes"),
            }, getOption("extend") ?? {});

            // let oldComputedOptions = this.computedOptions.get(target)
            // Allows the use of functions as the values, for both the keyframes and the animation object
            // It adds the capability of advanced stagger animation, similar to the animejs stagger functions
            let computedOptions = mapAnimationOptions(animationOptions as IAnimationOptions, [i, len, target], this);

            if (typeof computedOptions.easing == "string")
                computedOptions.easing = GetEase(computedOptions.easing);

            if (computedOptions.iterations === true)
                computedOptions.iterations = Infinity;

            computedOptions.fill = getOption("fillMode");

            // Add timelineOffset to delay, this is future proofing;
            // if you want to create a custom timeline similar to animejs this will help you
            // I don't intend to make a timeline function for this project
            let {
                timelineOffset,
                speed,
                endDelay,
                delay,
                duration,
                iterations,
                ...remainingComputedOptions
            } = computedOptions;

            iterations = Number(iterations);
            duration = Number(duration);
            endDelay = Number(endDelay);
            speed = Number(speed);
            delay = Number(delay) + Number(timelineOffset);

            let tempDurations = delay + (duration * iterations) + endDelay;

            // Set the totalDuration to be the Animation with the largest totalDuration
            if (this.totalDuration < tempDurations)
                this.totalDuration = tempDurations;

            result[i] = {
                ...remainingComputedOptions,
                speed,
                tempDurations,
                endDelay,
                delay,
                duration,
                iterations,
            };

            if (this.minDelay > delay) this.minDelay = delay;
            if (this.maxSpeed > speed) this.maxSpeed = speed;
        });
        return result;
    }

    /**
     * Creates animations out of an array of computed options
     */
    protected createAnimations(param: { arrOfComputedOptions: any; padEndDelay: any; oldCSSProperties: any; onfinish: any; oncancel: any; timeline?: any; }, len: number) {
        let {
            arrOfComputedOptions,
            padEndDelay,
            oldCSSProperties,
            onfinish,
            oncancel,
            timeline
        } = param;

        this.targets.forEach((target: HTMLElement, i) => {
            let { speed, keyframes, tempDurations, ...computedOptions } = arrOfComputedOptions[i];

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
            let animationKeyframe: TypeKeyFrameOptionsType;

            // Accept keyframes as a keyframes Object, or a method,
            // if there are no animations in the keyframes array,
            // uses css properties from the options object
            let arrKeyframes = keyframes as (Keyframe[] | TypeCSSLikeKeyframe);
            if (typeof arrKeyframes == "object") arrKeyframes = KeyframeParse(arrKeyframes);

            // If `computedKeyframes` have been previously computed for this target element replace
            // the old uncomputed CSS properties with it, otherwise, use the uncomputed property
            let oldComputedKeyframe = this.computedKeyframes.get(target) ?? {};
            let fullProperties = Object.assign({}, oldCSSProperties, oldComputedKeyframe);

            // Replace old CSS properties with new CSS properties if there is a new value for the CSS property
            // As in the new CSS property is not null or null
            let properties = mapObject(fullProperties, (value, key) => (this.properties[key] ?? value));

            // Prefer arrays of keyframes over pure CSS Properties
            animationKeyframe = isValid(arrKeyframes) ? arrKeyframes : properties as PropertyIndexedKeyframes;

            if (!Array.isArray(animationKeyframe)) {
                // Remove `keyframes` animation option, it's not a valid CSS property
                let remaining: IAnimationOptions = omit(["keyframes"], animationKeyframe);
                let { offset, ...CSSProperties } = mapAnimationOptions(remaining, [i, len, target], this);

                // transform, is often used so, to make them easier to use we parse them for strings, number, and/or arrays of both;
                // for transform we parse the translate, skew, scale, and perspective functions (including all their varients) as CSS properties;
                // it then turns these properties into valid `PropertyIndexedKeyframes`
                // Read the documentation for `ParseTransformableCSSProperties`
                CSSProperties = ParseTransformableCSSProperties(CSSProperties as ICSSComputedTransformableProperties);

                let _offset = offset as (string | number)[];
                computedKeyframes = Object.assign({},
                    CSSProperties,
                    isValid(_offset) ? { offset: _offset.map(parseOffset) } : null
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

                // Transform transformable CSS properties in each keyframe of the keyframe array
                computedKeyframes = ParseTransformableCSSKeyframes(computedKeyframes) as Keyframe[];
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

            animation.playbackRate = speed;

            // Support for on finish
            animation.onfinish = () => {
                typeof onfinish == "function" && onfinish.call(this, target, i, len, animation);
            };

            // // Support for on cancel
            animation.oncancel = () => {
                typeof oncancel == "function" && oncancel.call(this, target, i, len, animation);
            };

            // Set the calculated options & keyframes for each individual animation
            this.computedOptions.set(target, computedOptions);
            this.computedKeyframes.set(target, computedKeyframes);
        });
    }

    /**
     * Update the options for all targets
     *
     * _**Note**: `KeyframeEffect` support is really low, so, I am suggest that you avoid using the `updateOptions` method, until browser support for `KeyframeEffect.updateTiming(...)` and `KeyframeEffefct.setKeyframes(...)` is better_
     *
     * @beta
     */
    public updateOptions(options: IAnimationOptions = {}) {
        try {
            let optionsFromParam = parseOptions(options);
            this.options = Object.assign({}, DefaultAnimationOptions, this.options, optionsFromParam);

            // This removes all none CSS properties from `properties`
            let {
                // These values cannot be functions
                padEndDelay,
                autoplay,
                target,
                targets,
                timeline,

                onfinish,
                oncancel,

                /**
                 * Theses are the CSS properties to be animated as Keyframes
                 */
                ...oldCSSProperties
            } = omit(FUNCTION_SUPPORTED_TIMING_KEYS, this.options);

            // This removes all none CSS properties from `optionsFromParam`
            this.properties = omit(ALL_TIMING_KEYS, optionsFromParam);

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
                timeline
            }, len);

            // If the total number of targets is zero or less, it means there not values in  `arrOfComputedOptions`
            // So, set the values for `totalDuration`, `minDelay`, and `maxSpeed` to the options directly
            // This is for anyone who wants to build a `timeline` in the future
            if (len <= 0) {
                if (this.maxSpeed == Infinity) this.maxSpeed = Number(this.options.speed);
                if (this.minDelay == Infinity)
                    this.minDelay = Number(this.options.delay) + Number(this.options.timelineOffset);
                if (this.totalDuration == -Infinity) this.totalDuration = Number(this.options.duration);
            }

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
                    console.warn("@okikio/animate - `KeyframeEffect.setKeyframes` and/or `KeyframeEffect.updateTiming` are not supported in this browser.");
            }

            this.mainAnimation.playbackRate = this.maxSpeed;
            this.mainAnimation.onfinish = () => {
                if (this.mainAnimation) {
                    let playstate = this.getPlayState();
                    if (!this.is(playstate))
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
                    if (!this.is(playstate))
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
     *
     * @beta
     */
    public add(target: HTMLElement) {
        let progress = this.getProgress();
        let running = this.is("running");
        let paused = this.is("paused");

        this.updateOptions({ target });
        this.setProgress(progress);

        if (running) this.play();
        else if (paused) this.pause();
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
    }

    /**
     * Removes a target from an Animate instance, and update the animation options with the change
     *
     * _**Note**: `KeyframeEffect` support is really low, so, I am suggest that you avoid using the `remove` method, until browser support for `KeyframeEffect.updateTiming(...)` and `KeyframeEffefct.setKeyframes(...)` is better_
     *
     * @beta
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
    }

    /**
     * Adds a listener for a given event
     */
    public on(events: TypeAnimationEvents[] | TypeAnimationEvents | TypeEventInput, callback?: TypeListenerCallback | object, scope?: object): Animate {
        this.emitter?.on?.(events, callback, scope ?? this);

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
    public off(events: TypeAnimationEvents[] | TypeAnimationEvents | TypeEventInput, callback?: TypeListenerCallback | object, scope?: object): Animate {
        this.emitter?.off?.(events, callback, scope ?? this);
        return this;
    }

    /**
     * Call all listeners within an event
     */
    public emit(events: TypeAnimationEvents[] | TypeAnimationEvents | string | any[], ...args: any): Animate {
        this.emitter?.emit?.(events, ...args);
        return this;
    }

    /** Returns the Animate options, as JSON  */
    public toJSON(): IAnimationOptions {
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
export const animate = (options: IAnimationOptions = {}): Animate => {
    return new Animate(options);
};

export default animate;