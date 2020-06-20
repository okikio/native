import { EventEmitter } from "@okikio/event-emitter";
export const getElements = (selector) => {
    return typeof selector === "string" ? Array.from(document.querySelectorAll(selector)) : [selector];
};
export const getTargets = (targets) => {
    if (Array.isArray(targets))
        return targets;
    if (typeof targets == "string" || targets instanceof Node)
        return getElements(targets);
    if (targets instanceof NodeList || targets instanceof HTMLCollection)
        return Array.from(targets);
    return [];
};
// VALUES
export const computeValue = (value, ...args) => typeof value == "function" ? value(...args) : value;
export const mapObject = (obj, fn) => {
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
export const getEase = (ease) => {
    return /^(ease|in|out)/.test(ease) ? easings[ease] : ease;
};
;
export const DefaultAnimationOptions = {
    keyframes: [],
    loop: 1,
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
export class Animate extends Promise {
    /**
     * Creates an instance of Animate.
     *
     * @param {AnimationOptions} options
     * @memberof Animate
     */
    constructor(options = {}, finish /* Typescript has some weird bugs, so in order declare a variable
                   before the super's constructor you have to use it as a parameter */) {
        super(resolve => { finish = resolve; });
        /**
         * Stores the options for the current animation
         *
         * @protected
         * @type AnimationOptions
         * @memberof Animate
         */
        this.options = {};
        /**
         * The Array of Elements to Animate
         *
         * @protected
         * @type {Node[]}
         * @memberof Animate
         */
        this.targets = [];
        /**
         * The properties to animate
         *
         * @protected
         * @type {object}
         * @memberof Animate
         */
        this.properties = {};
        /**
         * A Set of Animations
         *
         * @protected
         * @type {Map<HTMLElement, Animation>}
         * @memberof Animate
         */
        this.animations = new Map();
        /**
         * The total duration of all Animation's
         *
         * @protected
         * @type {number}
         * @memberof Animate
         */
        this.duration = 0;
        /**
         * An event emitter
         *
         * @protected
         * @type {EventEmitter}
         * @memberof Animate
         */
        this.emitter = new EventEmitter();
        this.finish = (...args) => {
            this.emit("finish", ...args);
            return finish(...args);
        };
        let { animation, ...rest } = options;
        this.options = Object.assign({}, DefaultAnimationOptions, animation, rest);
        let { loop, delay, speed, easing, endDelay, duration, direction, fill, target, keyframes, autoplay, ...properties } = this.options;
        this.mainElement = document.createElement("span");
        this.targets = getTargets(target);
        this.properties = properties;
        let animationKeyframe;
        for (let i = 0, len = this.targets.length; i < len; i++) {
            let target = this.targets[i];
            let animationOptions = {
                easing: getEase(easing),
                iterations: loop === true ? Infinity : loop,
                direction,
                endDelay,
                duration,
                delay,
                fill,
            };
            // Accept keyframes as the keyframes Object
            animationKeyframe = keyframes.length ?
                keyframes :
                this.properties;
            // Allows the use of functions as the values, for both the keyframes and the animation object
            // It adds the capability of advanced stagger animation, similar to the anime js stagger functions
            let valueClosure = (value) => computeValue(value, i, len, target);
            mapObject(animationOptions, valueClosure);
            mapObject(animationKeyframe, valueClosure);
            // Set the Animate classes duration to be the Animation with the largest totalDuration
            let tempDuration = animationOptions.delay +
                (animationOptions.duration * animationOptions.iterations) +
                animationOptions.endDelay;
            if (this.duration < tempDuration)
                this.duration = tempDuration;
            // Add animation to the Animations Set
            let animation = target.animate(animationKeyframe, animationOptions);
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
        if (autoplay)
            this.play();
        else
            this.pause();
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
    loop() {
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
    on(events, callback, scope) {
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
    off(events, callback, scope) {
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
    emit(events, ...args) {
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
    getAnimation(element) {
        return this.animations.get(element);
    }
    /**
     * Play Animation's
     *
     * @returns {Animate}
     * @memberof Animate
     */
    play() {
        // Once the animation is done, it's done, it can only be paused by the reset method
        if (this.mainAnimation.playState !== "finished") {
            this.mainAnimation.play();
            this.animationFrame = requestAnimationFrame(this.loop.bind(this));
            this.animations.forEach(animation => {
                if (animation.playState !== "finished")
                    animation.play();
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
    pause() {
        // Once the animation is done, it's done, it can only be reset by the reset method
        if (this.mainAnimation.playState !== "finished") {
            this.mainAnimation.pause();
            window.cancelAnimationFrame(this.animationFrame);
            this.animations.forEach(animation => {
                if (animation.playState !== "finished")
                    animation.pause();
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
    getDuration() {
        return this.duration;
    }
    /**
     * Returns the current time of the Main Animation
     *
     * @returns {number}
     * @memberof Animate
     */
    getCurrentTime() {
        return this.mainAnimation.currentTime;
    }
    /**
     * Set the current time of the Main Animation
     *
     * @param {number} time
     * @returns {Animate}
     * @memberof Animate
     */
    setCurrentTime(time) {
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
    getProgress() {
        return this.getCurrentTime() / this.duration;
    }
    /**
     * Set the Animation progress as a fraction of the current time / duration
     *
     * @param {number} percent
     * @returns {Animate}
     * @memberof Animate
     */
    setProgress(percent) {
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
    setSpeed(speed = 1) {
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
    reset() {
        this.setCurrentTime(0);
        if (this.options.autoplay)
            this.play();
        else
            this.pause();
    }
    /**
     * Returns the current playing state
     *
     * @returns {("idle" | "running" | "paused" | "finished")}
     * @memberof Animate
     */
    getPlayState() {
        return this.mainAnimation.playState;
    }
    /**
     * Get the options of an Animate instance
     *
     * @returns {AnimationOptions}
     * @memberof Animate
     */
    getOptions() {
        return this.options;
    }
    // Returns the Animate options, as JSON
    toJSON() {
        return this.options;
    }
}
// Creates a new Animate instance
export const animate = (options = {}) => {
    return new Animate(options);
};