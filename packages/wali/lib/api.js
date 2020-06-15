/*!
 * walijs v0.0.0
 * (c) 2020 Okiki Ojo
 * Released under the MIT license
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*!
 * @okikio/event-emitter v1.0.3
 * (c) 2020 Okiki Ojo
 * Released under the MIT license
 */

/*!
 * managerjs v1.0.7
 * (c) 2020 Okiki Ojo
 * Released under the MIT license
 */

/**
 * Manages complex lists of named data, eg. A page can be stored in a list by of other pages with the url being how the page is stored in the list.
 *
 * @export
 * @class Manager
 * @extends {Map<K, V>}
 * @template K
 * @template V
*/
class Manager extends Map {
    /**
     * Creates an instance of Manager.
     *
     * @param {...any} args
     * @memberof Manager
     */
    constructor(...args) {
        super(...args);
    }
    /**
     * Returns the keys of all items stored in the Manager as an Array
     *
     * @returns Array<K>
     * @memberof Manager
     */
    keys() {
        return Array.from(super.keys.call(this));
    }
    /**
     * Returns the values of all items stored in the Manager as an Array
     *
     * @returns Array<V>
     * @memberof Manager
     */
    values() {
        return Array.from(super.values.call(this));
    }
    /**
     * Returns the last item in the Manager who's index is a certain distance from the last item in the Manager
     *
     * @param {number} [distance=1]
     * @returns V | undefined
     * @memberof Manager
     */
    last(distance = 1) {
        let key = this.keys()[this.size - distance];
        return this.get(key);
    }
    /**
     * Returns the second last item in the Manager
     *
     * @public
     * @returns V | undefined
     */
    prev() {
        return this.last(2);
    }
    /**
     * Adds a value to Manager, and uses the current size of the Manager as it's key, it works best when all the key in the Manager are numbers
     *
     * @public
     * @param  {V} value
     * @returns Manager<K, V>
     */
    add(value) {
        super.set.call(this, this.size, value);
        return this;
    }
    /**
     * Calls a method for all items that are currently in it's list
     *
     * @param {string} method
     * @param {Array<any>} [args=[]]
     * @returns Manager<K, V>
     * @memberof Manager
     */
    methodCall(method, ...args) {
        this.forEach((item) => {
            item[method](...args);
        });
        return this;
    }
    /**
     * Asynchronously calls a method for all items that are currently in it's list, similar to methodCall except the loop waits for the asynchronous method to run, before the loop continues on to the the next method
     *
     * @param {string} method
     * @param {Array<any>} [args=[]]
     * @returns Promise<Manager<K, V>>
     * @memberof Manager
     */
    async asyncMethodCall(method, ...args) {
        for await (let [, item] of this) {
            // @ts-ignore
            await item[method](...args);
        }
        return this;
    }
}

/**
 * Represents a new event listener consisting of properties like: callback, scope, name
 *
 * @export
 * @class Listener
 */
class Listener {
    /**
     * Creates an instance of Listener.
     *
     * @param {IListener} { callback = () => { }, scope = null, name = "event" }
     * @memberof Listener
     */
    constructor({ callback = () => { }, scope = null, name = "event", }) {
        this.listener = { callback, scope, name };
    }
    /**
     * Returns the callback Function of the Listener
     *
     * @returns ListenerCallback
     * @memberof Listener
     */
    getCallback() {
        return this.listener.callback;
    }
    /**
     * Returns the scope as an Object, from the Listener
     *
     * @returns object
     * @memberof Listener
     */
    getScope() {
        return this.listener.scope;
    }
    /**
     * Returns the event as a String, from the Listener
     *
     * @returns string
     * @memberof Listener
     */
    getEventName() {
        return this.listener.name;
    }
    /**
     * Returns the listener as an Object
     *
     * @returns IListener
     * @memberof Listener
     */
    toJSON() {
        return this.listener;
    }
}
/**
 * Represents a new event listener consisting of properties like: callback, scope, name
 *
 * @export
 * @class Event
 * @extends {Manager<number, Listener>}
 */
class Event extends Manager {
    /**
     * Creates an instance of Event.
     *
     * @param {string} [name="event"]
     * @memberof Event
     */
    constructor(name = "event") {
        super();
        this.name = name;
    }
}
/**
 * An event emitter
 *
 * @export
 * @class EventEmitter
 * @extends {Manager<string, Event>}
 */
class EventEmitter extends Manager {
    /**
     * Creates an instance of EventEmitter.
     *
     * @memberof EventEmitter
     */
    constructor() {
        super();
    }
    /**
     * Gets events, if event doesn't exist create a new Event
     *
     * @param {string} name
     * @returns Event
     * @memberof EventEmitter
     */
    getEvent(name) {
        let event = this.get(name);
        if (!(event instanceof Event)) {
            this.set(name, new Event(name));
            return this.get(name);
        }
        return event;
    }
    /**
     * Creates a new listener and adds it to the event
     *
     * @param {string} name
     * @param {ListenerCallback} callback
     * @param {object} scope
     * @returns Event
     * @memberof EventEmitter
     */
    newListener(name, callback, scope) {
        let event = this.getEvent(name);
        event.add(new Listener({ name, callback, scope }));
        return event;
    }
    /**
     * Adds a listener for a given event
     *
     * @param {EventInput} events
     * @param {ListenerCallback} callback
     * @param {object} scope
     * @returns
     * @memberof EventEmitter
     */
    on(events, callback, scope) {
        // If there is no event break
        if (typeof events == "undefined")
            return this;
        // Create a new event every space
        if (typeof events == "string")
            events = events.split(/\s/g);
        let _name;
        let _callback;
        let _scope;
        // Loop through the list of events
        Object.keys(events).forEach(key => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array<string>}
            // Check If events is an Object (JSON like Object, and not an Array)
            if (typeof events == "object" && !Array.isArray(events)) {
                _name = key;
                _callback = events[key];
                _scope = callback;
            }
            else {
                _name = events[key];
                _callback = callback;
                _scope = scope;
            }
            this.newListener(_name, _callback, _scope);
        }, this);
        return this;
    }
    /**
     * Removes a listener from an event
     *
     * @param {string} name
     * @param {ListenerCallback} [callback]
     * @param {object} [scope]
     * @returns Event
     * @memberof EventEmitter
     */
    removeListener(name, callback, scope) {
        let event = this.getEvent(name);
        if (callback) {
            let i = 0, len = event.size, value;
            let listener = new Listener({ name, callback, scope });
            for (; i < len; i++) {
                value = event.get(i);
                console.log(value);
                if (value.getCallback() === listener.getCallback() &&
                    value.getScope() === listener.getScope())
                    break;
            }
            event.delete(i);
        }
        return event;
    }
    /**
     * Removes a listener from a given event, or it just completely removes an event
     *
     * @param {EventInput} events
     * @param {ListenerCallback} [callback]
     * @param {object} [scope]
     * @returns EventEmitter
     * @memberof EventEmitter
     */
    off(events, callback, scope) {
        // If there is no event break
        if (typeof events == "undefined")
            return this;
        // Create a new event every space
        if (typeof events == "string")
            events = events.split(/\s/g);
        let _name;
        let _callback;
        let _scope;
        // Loop through the list of events
        Object.keys(events).forEach((key) => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array<any>}
            // Check If events is an Object (JSON like Object, and not an Array)
            if (typeof events == "object" && !Array.isArray(events)) {
                _name = key;
                _callback = events[key];
                _scope = callback;
            }
            else {
                _name = events[key];
                _callback = callback;
                _scope = scope;
            }
            if (_callback) {
                this.removeListener(_name, _callback, _scope);
            }
            else
                this.delete(_name);
        }, this);
        return this;
    }
    /**
     * Adds a one time event listener for an event
     *
     * @param {EventInput} events
     * @param {ListenerCallback} callback
     * @param {object} scope
     * @returns EventEmitter
     * @memberof EventEmitter
     */
    once(events, callback, scope) {
        // If there is no event break
        if (typeof events == "undefined")
            return this;
        // Create a new event every space
        if (typeof events == "string")
            events = events.split(/\s/g);
        let onceFn = (...args) => {
            this.off(events, onceFn, scope);
            callback.apply(scope, args);
        };
        this.on(events, onceFn, scope);
        return this;
    }
    /**
     * Call all listeners within an event
     *
     * @param {(string | Array<any>)} events
     * @param {...any} args
     * @returns EventEmitter
     * @memberof EventEmitter
     */
    emit(events, ...args) {
        // If there is no event break
        if (typeof events == "undefined")
            return this;
        // Create a new event every space
        if (typeof events == "string")
            events = events.split(/\s/g);
        // Loop through the list of events
        events.forEach((event) => {
            let listeners = this.getEvent(event);
            const customEvent = new CustomEvent(event, { detail: args });
            window.dispatchEvent(customEvent);
            listeners.forEach((listener) => {
                let { callback, scope } = listener.toJSON();
                callback.apply(scope, args);
            });
        }, this);
        return this;
    }
}

const getElements = (selector) => {
    return typeof selector === "string" ? Array.from(document.querySelectorAll(selector)) : [selector];
};
const getTargets = (targets) => {
    if (Array.isArray(targets))
        return targets;
    if (typeof targets == "string" || targets instanceof Node)
        return getElements(targets);
    if (targets instanceof NodeList || targets instanceof HTMLCollection)
        return Array.from(targets);
    return [];
};
// VALUES
const computeValue = (value, ...args) => typeof value == "function" ? value(...args) : value;
const mapObject = (obj, fn) => {
    let keys = Object.keys(obj);
    for (let i = 0, len = keys.length; i < len; i++) {
        let key = keys[i];
        let value = obj[key];
        obj[key] = fn(value);
    }
    return obj;
};
// From: [https://easings.net]
const easings = {
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
const DefaultAnimationOptions = {
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
class Animate extends Promise {
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
                easing: easing.startsWith("ease") ? easings[easing] : easing,
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
const animate = (options = {}) => {
    return new Animate(options);
};

exports.Animate = Animate;
exports.DefaultAnimationOptions = DefaultAnimationOptions;
exports.animate = animate;
exports.computeValue = computeValue;
exports.default = animate;
exports.easings = easings;
exports.getElements = getElements;
exports.getTargets = getTargets;
exports.mapObject = mapObject;
