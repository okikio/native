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
export const computeValue = (value: any, ...args: any[]) =>
    typeof value == "function" ? value(...args) : value;

export const mapObject = (obj: object, fn: Function): object => {
    let keys = Object.keys(obj);
    for (let i = 0, len = keys.length; i < len; i++) {
        let key = keys[i];
        let value = obj[key];
        obj[key] = fn(value);
    }

    return obj;
};

// From: [https://easings.net]
export const easings = {
    "ease": "ease",
    "ease-in": "ease-in",
    "ease-out": "ease-out",
    "ease-in-out": "ease-in-out",

    // Sine
    "ease-in-sine": "cubic-bezier(0.47, 0, 0.745, 0.715)",
    "ease-out-sine": "cubic-bezier(0.39, 0.575, 0.565, 1)",
    "ease-in-out-sine": "cubic-bezier(0.445, 0.05, 0.55, 0.95)",

    // Quad
    "ease-in-quad": "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
    "ease-out-quad": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    "ease-in-out-quad": "cubic-bezier(0.455, 0.03, 0.515, 0.955)",

    // Cubic
    "ease-in-cubic": "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    "ease-out-cubic": "cubic-bezier(0.215, 0.61, 0.355, 1)",
    "ease-in-out-cubic": "cubic-bezier(0.645, 0.045, 0.355, 1)",

    // Quart
    "ease-in-quart": "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
    "ease-out-quart": "cubic-bezier(0.165, 0.84, 0.44, 1)",
    "ease-in-out-quart": "cubic-bezier(0.77, 0, 0.175, 1)",

    // Quint
    "ease-in-quint": "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
    "ease-out-quint": "cubic-bezier(0.23, 1, 0.32, 1)",
    "ease-in-out-quint": "cubic-bezier(0.86, 0, 0.07, 1)",

    // Expo
    "ease-in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
    "ease-out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
    "ease-in-out-expo": "cubic-bezier(1, 0, 0, 1)",

    // Circ
    "ease-in-circ": "cubic-bezier(0.6, 0.04, 0.98, 0.335)",
    "ease-out-circ": "cubic-bezier(0.075, 0.82, 0.165, 1)",
    "ease-in-out-circ": "cubic-bezier(0.785, 0.135, 0.15, 0.86)",

    // Back
    "ease-in-back": "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
    "ease-out-back": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    "ease-in-out-back": "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
};

export interface AnimationOptions {
    target?: AnimationTarget,

    speed?: number,
    delay?: number,
    easing?: string,
    endDelay?: number,
    duration?: number,
    autoplay?: boolean,
    keyframes?: object[],
    animation?: AnimationOptions,
    loop?: number | boolean, // iterations: number,
    fill?: "none" | "forwards" | "backwards" | "both" | "auto",
    direction?: "normal" | "reverse" | "alternate" | "alternate-reverse",
    [property: string]: boolean | object | string | string[] | number | null | (number | null)[] | undefined;
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
    fill: "forwards",
    direction: "normal",
};

// You can check it out here: https://codepen.io/okikio/pen/qBbdGaW?editors=0011
export class Animate extends Promise<AnimationOptions> {
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
     * Creates an instance of Animate.
     * 
     * @param {AnimationOptions} options
     * @memberof Animate
     */
    constructor(
        options: AnimationOptions = {},
        finish?: any /* Typescript has some weird bugs, so in order declare a variable 
                       before the super's constructor you have to use it as a parameter */
    ) {
        super(resolve => { finish = resolve; });
        this.finish = (...args: any) => {
            this.emit("finish", ...args);
            return finish(...args);
        };

        let { animation, ...rest } = options;
        this.options = Object.assign({}, DefaultAnimationOptions, animation, rest);

        let {
            loop,
            delay,
            speed,
            easing,
            endDelay,
            duration,
            direction,
            fill,
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
            let target = this.targets[i];
            let animationOptions = {
                easing: easing.startsWith("ease") ? easings[easing] : easing,
                iterations: loop === true ? Infinity : (loop as number),
                direction,
                endDelay,
                duration,
                delay,
                fill,
            };

            // Accept keyframes as the keyframes Object
            animationKeyframe = (keyframes as Keyframe[]).length ?
                (keyframes as Keyframe[]) :
                (this.properties as PropertyIndexedKeyframes);

            // Allows the use of functions as the values, for both the keyframes and the animation object
            // It adds the capability of advanced stagger animation, similar to the anime js stagger functions
            let valueClosure = (value: any) => computeValue(value, i, len, target);
            mapObject(animationOptions, valueClosure);
            mapObject(animationKeyframe, valueClosure);

            // Set the Animate classes duration to be the Animation with the largest totalDuration
            let tempDuration: number =
                animationOptions.delay +
                (animationOptions.duration * animationOptions.iterations) +
                animationOptions.endDelay;
            if (this.duration < tempDuration) this.duration = tempDuration;

            // Add animation to the Animations Set
            let animation = (target as HTMLElement).animate(animationKeyframe, animationOptions);
            this.animations.set((target as HTMLElement), animation);
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

        this.mainAnimation.onfinish = () => {
            this.finish(this.options);
            window.cancelAnimationFrame(this.animationFrame);
        };
    }

    // You can also use Symbol.species in order to
    // return a Promise for then/catch/finally
    static get [Symbol.species]() {
        return Promise;
    }

    // Promise overrides this Symbol.toStringTag
    get [Symbol.toStringTag]() {
        return 'MyPromise';
    }

    /**
     * Represents an Animation Frame Loop
     *
     * @private
     * @memberof Animate
     */
    protected loop(): void {
        this.animationFrame = window.requestAnimationFrame(this.loop.bind(this));
        this.emit("loop change", this.getCurrentTime());
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
        this.mainAnimation.play();
        this.animationFrame = requestAnimationFrame(this.loop.bind(this));
        this.animations.forEach(animation => {
            animation.play();
        });
        this.emit("play");
        return this;
    }

    /**
     * Pause Animation's
     *
     * @returns {Animate}
     * @memberof Animate
     */
    public pause(): Animate {
        this.mainAnimation.pause();
        window.cancelAnimationFrame(this.animationFrame);
        this.animations.forEach(animation => {
            animation.pause();
        });
        this.emit("pause");
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
        return this.options;
    }
}

// Creates a new Animate instance
export const animate = (options: AnimationOptions = {}): Animate => {
    return new Animate(options);
};
export default animate;