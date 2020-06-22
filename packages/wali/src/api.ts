import { EventEmitter, EventInput, ListenerCallback } from "@okikio/event-emitter";

// DOM
export type AnimationTarget = string | Node | NodeList | HTMLCollection | HTMLElement[] | any[];
export const getElements = (selector: string | Node): Node[] => {
    return typeof selector === "string" ? Array.from(document.querySelectorAll(selector as string)) : [selector];
};

export const getTargets = (targets: AnimationTarget): Node[] => {
    if (Array.isArray(targets)) return targets;
    if (typeof targets == "string" || targets instanceof Node)
        return getElements(targets);
    if (targets instanceof NodeList || targets instanceof HTMLCollection)
        return Array.from(targets);
    return [];
};

// VALUES
export type closureArgs = [number, number, HTMLElement];
export type closure = ((index?: number, total?: number, element?: HTMLElement) => any) | any;
export const computeValue = (value: closure, args: closureArgs) => {
    if (typeof value === "function") {
        return value(...args);
    } else { return value; }
};

export const mapObject = (obj: object, args: closureArgs): any => {
    let key, value, result = {};
    let keys = Object.keys(obj);
    for (let i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        value = obj[key];
        result[key] = computeValue(value, args);
    }

    return result;
};

// From: [https://easings.net]
export const easings = {
    "ease": "ease",
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
    return /^(ease|in|out)/.test(ease) ? easings[ease] : ease;
};

export interface AnimationOptions {
    target?: AnimationTarget,

    speed?: number | closure,
    delay?: number | closure,
    easing?: string | closure,
    endDelay?: number | closure,
    duration?: number | closure,
    autoplay?: boolean | closure,
    keyframes?: object[] | closure,
    loop?: number | boolean | closure, // iterations: number,
    options?: AnimationOptions | closure,
    onfinish?: (element?: HTMLElement, index?: number, total?: number) => any,
    fillMode?: "none" | "forwards" | "backwards" | "both" | "auto" | closure,
    direction?: "normal" | "reverse" | "alternate" | "alternate-reverse" | closure,
    [property: string]: boolean | object | string | string[] | number | null | (number | null)[] | closure | undefined;
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
    onfinish() { },
    fillMode: "auto",
    direction: "normal",
};

// You can check it out here: https://codepen.io/okikio/pen/qBbdGaW?editors=0011
export class Animate {
    /**
     * Stores the options for the current animation
     *
     * @protected
     * @type AnimationOptions
     * @memberof Animate
     */
    protected options: AnimationOptions = {};

    /**
     * The Array of Elements to Animate
     *
     * @protected
     * @type {Node[]}
     * @memberof Animate
     */
    protected targets: Node[] = [];

    /**
     * The properties to animate
     *
     * @protected
     * @type {object}
     * @memberof Animate
     */
    protected properties: object = {};

    /**
     * A Set of Animations
     *
     * @protected
     * @type {Map<HTMLElement, Animation>}
     * @memberof Animate
     */
    protected animations: Map<HTMLElement, Animation> = new Map();

    /**
     * The total duration of all Animation's
     *
     * @protected
     * @type {number}
     * @memberof Animate
     */
    protected duration: number = 0;

    /**
     * The Element the main animation uses
     *
     * @protected
     * @type {HTMLElement}
     * @memberof Animate
     */
    protected mainElement: HTMLElement;

    /**
     * Stores an animation that runs on the total duration of the all other Animations, and as such it's the main Animation
     *
     * @protected
     * @type {Animation}
     * @memberof Animate
     */
    protected mainAnimation: Animation;

    /**
     * Stores request frame calls
     *
     * @protected
     * @type {number}
     * @memberof Animate
     */
    protected animationFrame: number;

    /**
     * An event emitter
     *
     * @protected
     * @type {EventEmitter}
     * @memberof Animate
     */
    protected emitter: EventEmitter = new EventEmitter();

    /**
     * The finish method, is called when the main animation has finished
     *
     * @protected
     * @type {*}
     * @memberof Animate
     */
    protected finish: any;

    /**
     * Returns a promise that is fulfilled when the mainAnimation is finished
     *
     * @protected
     * @type {Promise<AnimationOptions>}
     * @memberof Animate
     */
    protected promise: Promise<AnimationOptions>;

    /**
     * Creates an instance of Animate.
     * 
     * @param {AnimationOptions} options
     * @memberof Animate
     */
    constructor(options: AnimationOptions = {}) {
        let { options: animation, ...rest } = options;
        this.options = Object.assign({}, DefaultAnimationOptions, animation, rest);

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
            ...properties
        } = this.options;

        this.mainElement = document.createElement("span");
        this.targets = getTargets(target);
        this.properties = properties;

        let animationKeyframe: Keyframe[] | PropertyIndexedKeyframes;
        for (let i = 0, len = this.targets.length; i < len; i++) {
            let target = this.targets[i] as HTMLElement;
            let animationOptions = {
                easing: getEase(easing),
                iterations: loop === true ? Infinity : (loop as number),
                direction,
                endDelay,
                duration,
                delay,
                fill: fillMode,
            };

            // Accept keyframes as a keyframes Object, or a method, 
            // if there are no animations in the keyframes array,
            // uses css properties from the options object
            let arrKeyframes = computeValue((keyframes as Keyframe[]), [i, len, target]);
            animationKeyframe = arrKeyframes.length ? arrKeyframes :
                (this.properties as PropertyIndexedKeyframes);

            // Allows the use of functions as the values, for both the keyframes and the animation object
            // It adds the capability of advanced stagger animation, similar to the anime js stagger functions
            animationOptions = mapObject(animationOptions, [i, len, target]);
            if (!(arrKeyframes.length > 0))
                animationKeyframe = mapObject(animationKeyframe, [i, len, target]);

            // Set the Animate classes duration to be the Animation with the largest totalDuration
            let tempDuration: number =
                animationOptions.delay +
                (animationOptions.duration * animationOptions.iterations) +
                animationOptions.endDelay;
            if (this.duration < tempDuration) this.duration = tempDuration;

            // Add animation to the Animations Set
            let animation = target.animate(animationKeyframe, animationOptions);
            animation.onfinish = () => {
                onfinish(target, i, len);
            };
            this.animations.set(target, animation);
        }

        this.mainAnimation = this.mainElement.animate([
            { opacity: "0" },
            { opacity: "1" }
        ], {
            duration: this.duration,
            easing: "linear"
        });

        this.setSpeed(speed);
        if (autoplay) this.play();
        else this.pause();

        this.promise = this.newPromise();
        this.mainAnimation.onfinish = () => {
            this.finish(this.options);
            window.cancelAnimationFrame(this.animationFrame);
        };
    }

    /**
     * Returns a new Promise that is resolve when this.finish is called
     *
     * @protected
     * @returns {Promise<AnimationOptions>}
     * @memberof Animate
     */
    protected newPromise(): Promise<AnimationOptions> {
        return new Promise((resolve, reject) => {
            try {
                this.finish = (options: AnimationOptions) => {
                    this.emit("finish", options);
                    return resolve(options);
                };
            } catch (err) { reject(err); }
        });
    }

    /**
     * Fulfills the this.promise Promise
     *
     * @param {(value?: any) => any} [onFulfilled]
     * @param {(reason?: any) => any} [onRejected]
     * @returns {Promise<AnimationOptions>}
     * @memberof Animate
     */
    public then(
        onFulfilled?: (value?: any) => any,
        onRejected?: (reason?: any) => any
    ): Promise<AnimationOptions> {
        return this.promise.then(onFulfilled, onRejected);
    }

    /**
     * Catches error that occur in the this.promise Promise
     *
     * @param {(reason?: any) => any} onRejected
     * @returns {Promise<AnimationOptions>}
     * @memberof Animate
     */
    public catch(onRejected: (reason?: any) => any): Promise<AnimationOptions> {
        return this.promise.catch(onRejected);
    }

    /**
     * If you don't care if the this.promise Promise has either been rejected or resolved  
     *
     * @param {() => any} onFinally
     * @returns {Promise<AnimationOptions>}
     * @memberof Animate
     */
    public finally(onFinally: () => any): Promise<AnimationOptions> {
        return this.promise.finally(onFinally);
    }

    /**
     * Represents an Animation Frame Loop
     *
     * @private
     * @memberof Animate
     */
    protected loop(): void {
        this.animationFrame = window.requestAnimationFrame(this.loop.bind(this));
        this.emit("tick change", this.getCurrentTime());
    }

    /**
     * Adds a listener for a given event
     *
     * @param {EventInput} events
     * @param {ListenerCallback} [callback]
     * @param {object} [scope]
     * @returns {Animate}
     * @memberof Animate
     */
    public on(events: EventInput, callback?: ListenerCallback, scope?: object): Animate {
        this.emitter.on(events, callback, scope);
        return this;
    }

    /**
     * Removes a listener from an event
     *
     * @param {EventInput} events
     * @param {ListenerCallback} [callback]
     * @param {object} [scope]
     * @returns {Animate}
     * @memberof Animate
     */
    public off(events: EventInput, callback?: ListenerCallback, scope?: object): Animate {
        this.emitter.off(events, callback, scope);
        return this;
    }

    /**
     * Call all listeners within an event
     *
     * @param {(string | any[])} events
     * @param {...any} args
     * @returns {Animate}
     * @memberof Animate
     */
    public emit(events: string | any[], ...args: any): Animate {
        this.emitter.emit(events, ...args);
        return this;
    }

    /**
     * Get a specific Animation from an Animate instance
     *
     * @param {HTMLElement} element
     * @returns {Animation}
     * @memberof Animate
     */
    public getAnimation(element: HTMLElement): Animation {
        return this.animations.get(element);
    }

    /**
     * Play Animation's
     *
     * @returns {Animate}
     * @memberof Animate
     */
    public play(): Animate {
        // Once the animation is done, it's done, it can only be paused by the reset method
        if (this.mainAnimation.playState !== "finished") {
            this.mainAnimation.play();
            this.animationFrame = requestAnimationFrame(this.loop.bind(this));
            this.animations.forEach(animation => {
                if (animation.playState !== "finished") animation.play();
            });
            this.emit("play");
        }
        return this;
    }

    /**
     * Pause Animation's
     *
     * @returns {Animate}
     * @memberof Animate
     */
    public pause(): Animate {
        // Once the animation is done, it's done, it can only be reset by the reset method
        if (this.mainAnimation.playState !== "finished") {
            this.mainAnimation.pause();
            window.cancelAnimationFrame(this.animationFrame);
            this.animations.forEach(animation => {
                if (animation.playState !== "finished") animation.pause();
            });
            this.emit("pause");
        }
        return this;
    }

    /**
     * Returns the total duration of all Animations
     *
     * @returns {number}
     * @memberof Animate
     */
    public getDuration(): number {
        return this.duration;
    }

    /**
     * Returns the current time of the Main Animation
     *
     * @returns {number}
     * @memberof Animate
     */
    public getCurrentTime(): number {
        return this.mainAnimation.currentTime;
    }

    /**
     * Set the current time of the Main Animation
     *
     * @param {number} time
     * @returns {Animate}
     * @memberof Animate
     */
    public setCurrentTime(time: number): Animate {
        this.mainAnimation.currentTime = time;
        this.animations.forEach(animation => {
            animation.currentTime = time;
        });
        return this;
    }

    /**
     * Returns the Animation progress as a fraction of the current time / duration
     *
     * @returns
     * @memberof Animate
     */
    public getProgress() {
        return this.getCurrentTime() / this.duration;
    }

    /**
     * Set the Animation progress as a fraction of the current time / duration
     *
     * @param {number} percent
     * @returns {Animate}
     * @memberof Animate
     */
    public setProgress(percent: number): Animate {
        this.mainAnimation.currentTime = percent * this.duration;
        this.animations.forEach(animation => {
            animation.currentTime = percent * this.duration;
        });
        return this;
    }

    /**
     * Return the playback speed of the animation
     *
     * @returns {number}
     * @memberof Animate
     */
    public getSpeed(): number {
        return this.mainAnimation.playbackRate;
    }
    /**
     * Set the playback speed of an Animation
     *
     * @param {number} [speed=1]
     * @returns {Animate}
     * @memberof Animate
     */
    public setSpeed(speed: number = 1): Animate {
        this.mainAnimation.playbackRate = speed;
        this.animations.forEach(animation => {
            animation.playbackRate = speed;
        });
        return this;
    }

    /**
     * Reset all Animations
     *
     * @memberof Animate
     */
    public reset() {
        this.setCurrentTime(0);
        this.promise = this.newPromise();

        if (this.options.autoplay) this.play();
        else this.pause();
    }

    /**
     * Returns the current playing state
     *
     * @returns {("idle" | "running" | "paused" | "finished")}
     * @memberof Animate
     */
    public getPlayState(): "idle" | "running" | "paused" | "finished" {
        return this.mainAnimation.playState;
    }

    /**
     * Get the options of an Animate instance
     *
     * @returns {AnimationOptions}
     * @memberof Animate
     */
    public getOptions(): AnimationOptions {
        return this.options;
    }

    // Returns the Animate options, as JSON
    public toJSON(): AnimationOptions {
        return this.getOptions();
    }
}

// Creates a new Animate instance
export const animate = (options: AnimationOptions = {}): Animate => {
    return new Animate(options);
};