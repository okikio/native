import { EventEmitter, EventInput, ListenerCallback } from "@okikio/emitter";
import { Manager } from "@okikio/manager";

// DOM
export type AnimationTarget = string | Node | NodeList | HTMLCollection | HTMLElement[] | AnimationTarget[];
export const getElements = (selector: string | Node): Node[] => {
    return typeof selector === "string" ? Array.from(document.querySelectorAll(selector as string)) : [selector];
};

const flatten = (arr: AnimationTarget[]) => [].concat(...arr);
export const getTargets = (targets: AnimationTarget): Node[] => {
    if (Array.isArray(targets)) {
        return flatten((targets as AnimationTarget[]).map(getTargets));
    }
    if (typeof targets == "string" || targets instanceof Node)
        return getElements(targets);
    if (targets instanceof NodeList || targets instanceof HTMLCollection)
        return Array.from(targets);
    return [];
};

// VALUES
export type closureArgs = [number, number, HTMLElement];
export type closure = ((index?: number, total?: number, element?: HTMLElement) => any) | any;
export const computeValue = (value: closure, args: closureArgs, context: AnimationOptions) => {
    if (typeof value === "function") {
        return value.apply(context, args);
    } else { return value; }
};

export const mapObject = (obj: object, args: closureArgs, options: AnimationOptions): any => {
    let key: string, value: any, result = {};
    let keys = Object.keys(obj);
    for (let i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        value = obj[key];
        result[key] = computeValue(value, args, options);
    }

    return result;
};

/** From: [https://easings.net] */
export const easings = {
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

export const getEase = (ease: string) => {
    return /^(in|out)/.test(ease) ? easings[ease] : ease;
};

export interface AnimationOptions {
    target?: AnimationTarget,

    speed?: number,
    autoplay?: boolean,
    options?: AnimationOptions,
    delay?: number | closure,
    easing?: string | closure,
    endDelay?: number | closure,
    duration?: number | closure,
    keyframes?: object[] | closure,
    loop?: number | boolean | closure, // iterations: number,
    onfinish?: (element?: HTMLElement, index?: number, total?: number, animation?: Animation) => any,
    fillMode?: "none" | "forwards" | "backwards" | "both" | "auto" | closure,
    direction?: "normal" | "reverse" | "alternate" | "alternate-reverse" | closure,
    extend?: EffectTiming,
    [property: string]: closure | boolean | object | string | string[] | number | null | (number | null)[] | undefined;
};

export const DefaultAnimationOptions: AnimationOptions = {
    keyframes: [],

    loop: 1, // iterations: number,
    delay: 0,
    speed: 1,
    endDelay: 0,
    easing: "ease",
    autoplay: true,
    duration: 1000,
    fillMode: "auto",
    direction: "normal",
    extend: {}
};

export type AnimationEvents = "update" | "play" | "pause" | "start" | "begin" | "complete" | "finish" | "error" | "stop";

/** You can check it out here: https://codepen.io/okikio/pen/qBbdGaW?editors=0011 */
export class Animate {
    /**
     * Stores the options for the current animation
     */
    public options: AnimationOptions = {};

    /**
     * The Array of Elements to Animate
     */
    public targets: Node[] = [];

    /**
     * The properties to animate
     */
    public properties: object = {};

    /**
     * A Manager of Animations
     */
    public animations: Manager<HTMLElement, Animation> = new Manager();

    /**
     * The total duration of all Animation's
     */
    public totalDuration: number = 0;

    /**
     * The smallest delay out of all Animation's
     */
    public minDelay: number = 0;

    /**
     * The options for individual animations
     */
    public computedOptions: Manager<Animation, AnimationOptions> = new Manager();

    /**
     * The Element the main animation uses
     */
    public mainElement: HTMLElement;

    /**
     * Stores an animation that runs on the total duration of the all other Animations, and as such it's the main Animation
     */
    public mainAnimation: Animation;

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
    public promise: Promise<AnimationOptions>;
    constructor(options: AnimationOptions = {}) {
        try {
            let { options: animation, ...rest } = options;
            let oldOptions = animation instanceof Animate ? animation.getOptions() : (Array.isArray(animation) ? animation?.[0]?.getOptions() : animation);
            this.options = Object.assign({}, DefaultAnimationOptions, oldOptions, rest);
            this.loop = this.loop.bind(this);

            let {
                loop,
                delay,
                speed,
                easing,
                endDelay,
                duration,
                direction,
                fillMode,
                onfinish,
                target,
                keyframes,
                autoplay,
                extend,
                ...properties
            } = this.options;

            this.mainElement = document.createElement("div");
            this.targets = getTargets(target);
            this.properties = properties;

            let delays = [];
            let len = this.targets.length;
            let animationKeyframe: Keyframe[] | PropertyIndexedKeyframes;
            for (let i = 0; i < len; i++) {
                let target = this.targets[i] as HTMLElement;
                let animationOptions: AnimationOptions = {
                    easing: typeof easing == "string" ? getEase(easing) : easing,
                    iterations: loop === true ? Infinity : (loop as number),
                    direction,
                    endDelay,
                    duration,
                    delay,
                    fill: fillMode,
                    ...extend
                };

                // Accept keyframes as a keyframes Object, or a method,
                // if there are no animations in the keyframes array,
                // uses css properties from the options object
                let arrKeyframes = computeValue((keyframes as Keyframe[]), [i, len, target], animationOptions);
                animationKeyframe = arrKeyframes.length ? arrKeyframes :
                    (this.properties as PropertyIndexedKeyframes);

                // Allows the use of functions as the values, for both the keyframes and the animation object
                // It adds the capability of advanced stagger animation, similar to the anime js stagger functions
                animationOptions = mapObject(animationOptions, [i, len, target], animationOptions);
                if (!(arrKeyframes.length > 0))
                    animationKeyframe = mapObject(animationKeyframe, [i, len, target], animationOptions);

                // Set the Animate classes duration to be the Animation with the largest totalDuration
                let tempDurations = animationOptions.delay +
                    (animationOptions.duration * animationOptions.iterations) +
                    animationOptions.endDelay;
                if (this.totalDuration < tempDurations) this.totalDuration = tempDurations;

                // Add animation to the Animations Set
                let animation = target.animate(animationKeyframe, animationOptions);

                // Support for on finish
                animation.onfinish = () => {
                    typeof onfinish == "function" && onfinish.call(this, target, i, len, animation);
                    this.emit("finish", target, i, len, animation);
                };

                // The calculated options for each individual option
                this.computedOptions.set(animation, animationOptions);
                this.animations.set(target, animation);
                delays.push(animationOptions.delay);
            }

            this.mainAnimation = this.mainElement.animate([
                { opacity: "0" },
                { opacity: "1" }
            ], {
                // Why waste performance on an animation no one can see?
                duration: this.totalDuration,
                easing: "linear"
            });

            this.minDelay = Math.min(...delays);
            this.setSpeed(speed);
            if (autoplay) this.play();
            else this.pause();

            this.promise = this.newPromise();
            this.mainAnimation.onfinish = () => {
                this.emit("complete", this);
                window.cancelAnimationFrame(this.animationFrame);
            };
        } catch (err) {
            this.emit("error", err);
        }
    }

    /**
     * Returns a new Promise that is resolve when this.finish is called
     */
    public newPromise(): Promise<AnimationOptions> {
        return new Promise((resolve, reject) => {
            /*
                Note that the `this` keyword is in an Array when it is resolved,
                this is due to Promises not wanting to resolve references,
                so, you can't resolve `this` directly, so, I chose to resolve `this` in an
                Array
            */
            this.on("complete", () => resolve([this]));
            this.on("error", err => reject(err));
        });
    }

    /**
     * Fulfills the this.promise Promise
     */
    public then(
        onFulfilled?: (value?: any) => any,
        onRejected?: (reason?: any) => any
    ): Animate {
        onFulfilled = onFulfilled?.bind(this);
        onRejected = onRejected?.bind(this);
        this.promise.then(onFulfilled, onRejected);
        return this;
    }

    /**
     * Catches error that occur in the this.promise Promise
     */
    public catch(onRejected: (reason?: any) => any): Animate {
        onRejected = onRejected?.bind(this);
        this.promise.catch(onRejected);
        return this;
    }

    /**
     * If you don't care if the this.promise Promise has either been rejected or resolved
     */
    public finally(onFinally: () => any): Animate {
        onFinally = onFinally?.bind(this);
        this.promise.finally(onFinally);
        return this;
    }

    /**
     * Represents an Animation Frame Loop
     */
    public loop(): void {
        this.animationFrame = window.requestAnimationFrame(this.loop);
        this.emit("update", this.getProgress(), this);
    }

    /**
     * Calls a method that affects all animations including the mainAnimation; the method only allows the animation parameter
    */
    public all(method: (animation: Animation) => void) {
        method(this.mainAnimation);
        this.animations.forEach(animation => method(animation));
        return this;
    }

    /**
     * Register the begin event
     */
    protected beginEvent() {
        if (this.getProgress() == 0) {
            let timer: number | void = window.setTimeout(() => {
                this.emit("begin", this);
                timer = window.clearTimeout(timer as number);
            }, this.minDelay);
        }
    }

    /**
     * Play Animation
     */
    public play(): Animate {
        let playstate = this.getPlayState();
        if (playstate !== "finished") {
            this.beginEvent();
            this.animationFrame = requestAnimationFrame(this.loop);
            this.all(anim => anim.playState == "paused" && anim.play());
            this.emit("play", playstate, this);
        }
        return this;
    }

    /**
     * Pause Animation
     */
    public pause(): Animate {
        let playstate = this.getPlayState();
        if (playstate !== "finished") {
            this.all(anim => anim.playState == "running" && anim.pause());
            window.cancelAnimationFrame(this.animationFrame);
            this.emit("pause", playstate, this);
        }
        return this;
    }

    /**
     * Reset all Animations
     */
    public reset() {
        this.setProgress(0);
        this.beginEvent();

        if (this.options.autoplay) this.play();
        else this.pause();
        return this;
    }

    /**
     * Cancels all Animations
     */
    public cancel() {
        this.all(anim => anim.cancel());
        window.cancelAnimationFrame(this.animationFrame);
        return this;
    }

    /**
     * Force complete all Animations
     */
    public finish() {
        this.all(anim => anim.finish());
        window.cancelAnimationFrame(this.animationFrame);
        return this;
    }

    /**
     * Cancels & Clears all Animations
     */
    public stop() {
        this.cancel();
        this.animations.clear();
        while (this.targets.length) this.targets.pop();
        this.mainElement = undefined;
        this.emit("stop");
    }

    /**
     * Returns an Array of targets
     */
    public getTargets(): Node[] {
        return this.targets;
    }

    /**
     * Get a specific Animation from an Animate instance
     */
    public getAnimation(element: HTMLElement): Animation {
        return this.animations.get(element);
    }

    /**
     * Returns the timings of an Animation, given a target
     * E.g. { duration, endDelay, delay, iterations, iterationStart, direction, easing, fill, etc... }
     */
    public getTiming(target: HTMLElement | Animation): AnimationOptions & EffectTiming {
        let animation = target instanceof Animation ? target : this.getAnimation(target);
        let keyframeOptions = this.computedOptions.get(animation) ?? {};
        let timings = animation.effect?.getTiming() ?? {};
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
    public getPlayState(): "idle" | "running" | "paused" | "finished" {
        return this.mainAnimation.playState;
    }

    /**
     * Get the options of an Animate instance
     */
    public getOptions(): AnimationOptions {
        return this.options;
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
        this.all(anim => { anim.playbackRate = speed; });
        return this;
    }

    /**
     * Adds a listener for a given event
     */
    public on(events: AnimationEvents | EventInput, callback?: ListenerCallback, scope?: object): Animate {
        this.emitter.on(events, callback, scope ?? this);
        return this;
    }

    /**
     * Removes a listener from an event
     */
    public off(events: AnimationEvents | EventInput, callback?: ListenerCallback, scope?: object): Animate {
        this.emitter.off(events, callback, scope ?? this);
        return this;
    }

    /**
     * Call all listeners within an event
     */
    public emit(events: AnimationEvents | string | any[], ...args: any): Animate {
        this.emitter.emit(events, ...args);
        return this;
    }


    /** Returns the Animate options, as JSON  */
    public toJSON(): AnimationOptions {
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

/** Creates a new Animate instance */
export const animate = (options: AnimationOptions = {}): Animate => {
    return new Animate(options);
};

export default animate;
