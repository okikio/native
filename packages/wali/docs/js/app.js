function n(n){var t;if("undefined"!=typeof Symbol){if(Symbol.asyncIterator&&null!=(t=n[Symbol.asyncIterator]))return t.call(n);if(Symbol.iterator&&null!=(t=n[Symbol.iterator]))return t.call(n)}throw new TypeError("Object is not async iterable")}function t(n,e,i){if(!n.s){if(i instanceof r){if(!i.s)return void(i.o=t.bind(null,n,e));1&e&&(e=i.s),i=i.v;}if(i&&i.then)return void i.then(t.bind(null,n,e),t.bind(null,n,2));n.s=e,n.v=i;var u=n.o;u&&u(n);}}var e=function(){function t(n){this.map=new Map(n);}var e,r=t.prototype;return r.getMap=function(){return this.map},r.get=function(n){return this.map.get(n)},r.keys=function(){return [].concat(this.map.keys())},r.values=function(){return [].concat(this.map.values())},r.set=function(n,t){return this.map.set(n,t),this},r.add=function(n){return this.set(this.size,n),this},r.last=function(n){void 0===n&&(n=1);var t=this.keys()[this.size-n];return this.get(t)},r.prev=function(){return this.last(2)},r.delete=function(n){return this.map.delete(n),this},r.clear=function(){return this.map.clear(),this},r.has=function(n){return this.map.has(n)},r.entries=function(){return this.map.entries()},r.forEach=function(n,t){return void 0===n&&(n=function(){}),this.map.forEach(n,t),this},r[Symbol.iterator]=function(){return this.entries()},r.methodCall=function(n){var t=arguments;return this.forEach(function(e){e[n].apply(e,[].slice.call(t,1));}),this},r.asyncMethodCall=function(t){try{var e,r,i,h,c,a=this,s=arguments,l=!0,v=!1,d=f(function(){return o(function(){r=n(a.map);var e=u(function(){return !!Promise.resolve(r.next()).then(function(n){return l=i.done,i=n,Promise.resolve(i.value).then(function(n){return h=n,!l})})},function(){return !!(l=!0)},function(){var n=h[1];return Promise.resolve(n[t].apply(n,[].slice.call(s,1))).then(function(){})});if(e&&e.then)return e.then(function(){})},function(n){v=!0,c=n;})},function(n,t){function i(r){if(e)return r;if(n)throw t;return t}var u=f(function(){var n=function(){if(!l&&null!=r.return)return Promise.resolve(r.return()).then(function(){})}();if(n&&n.then)return n.then(function(){})},function(n,t){if(v)throw c;if(n)throw t;return t});return u&&u.then?u.then(i):i(u)});return Promise.resolve(d&&d.then?d.then(function(n){return e?n:a}):e?d:a)}catch(n){return Promise.reject(n)}},(e=[{key:"size",get:function(){return this.map.size}}])&&function(n,t){for(var e=0;e<t.length;e++){var r=t[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(n,r.key,r);}}(t.prototype,e),t}(),r=function(){function n(){}return n.prototype.then=function(e,r){var i=new n,u=this.s;if(u){var o=1&u?e:r;if(o){try{t(i,1,o(this.v));}catch(n){t(i,2,n);}return i}return this}return this.o=function(n){try{var u=n.v;1&n.s?t(i,1,e?e(u):u):r?t(i,1,r(u)):t(i,2,u);}catch(n){t(i,2,n);}},i},n}();function i(n){return n instanceof r&&1&n.s}function u(n,e,u){for(var o;;){var f=n();if(i(f)&&(f=f.v),!f)return h;if(f.then){o=0;break}var h=u();if(h&&h.then){if(!i(h)){o=1;break}h=h.s;}if(e){var c=e();if(c&&c.then&&!i(c)){o=2;break}}}var a=new r,s=t.bind(null,a,2);return (0===o?f.then(v):1===o?h.then(l):c.then(d)).then(void 0,s),a;function l(r){h=r;do{if(e&&(c=e())&&c.then&&!i(c))return void c.then(d).then(void 0,s);if(!(f=n())||i(f)&&!f.v)return void t(a,1,h);if(f.then)return void f.then(v).then(void 0,s);i(h=u())&&(h=h.v);}while(!h||!h.then);h.then(l).then(void 0,s);}function v(n){n?(h=u())&&h.then?h.then(l).then(void 0,s):l(h):t(a,1,h);}function d(){(f=n())?f.then?f.then(v).then(void 0,s):v(f):t(a,1,h);}}function o(n,t){try{var e=n();}catch(n){return t(n)}return e&&e.then?e.then(void 0,t):e}function f(n,t){try{var e=n();}catch(n){return t(!0,n)}return e&&e.then?e.then(t.bind(null,!1),t.bind(null,!0)):t(!1,e)}

function e$1(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e;}var n$1=function(){function t(t){var e=t.callback,n=t.scope,r=t.name;this.listener={callback:void 0===e?function(){}:e,scope:void 0===n?null:n,name:void 0===r?"event":r};}var e=t.prototype;return e.getCallback=function(){return this.listener.callback},e.getScope=function(){return this.listener.scope},e.getEventName=function(){return this.listener.name},e.toJSON=function(){return this.listener},t}(),r$1=function(t){function n(e){var n;return void 0===e&&(e="event"),(n=t.call(this)||this).name=e,n}return e$1(n,t),n}(e),i$1=function(t){function i(){return t.call(this)||this}e$1(i,t);var o=i.prototype;return o.getEvent=function(t){var e=this.get(t);return e instanceof r$1?e:(this.set(t,new r$1(t)),this.get(t))},o.newListener=function(t,e,r){var i=this.getEvent(t);return i.add(new n$1({name:t,callback:e,scope:r})),i},o.on=function(t,e,n){var r,i,o,c=this;return void 0===t||("string"==typeof t&&(t=t.split(/\s/g)),Object.keys(t).forEach(function(s){"object"!=typeof t||Array.isArray(t)?(r=t[s],i=e,o=n):(r=s,i=t[s],o=e),c.newListener(r,i,o);},this)),this},o.removeListener=function(t,e,r){var i=this.getEvent(t);if(e){for(var o,c=0,s=i.size,a=new n$1({name:t,callback:e,scope:r});c<s&&(o=i.get(c),console.log(o),o.getCallback()!==a.getCallback()||o.getScope()!==a.getScope());c++);i.delete(c);}return i},o.off=function(t,e,n){var r,i,o,c=this;return void 0===t||("string"==typeof t&&(t=t.split(/\s/g)),Object.keys(t).forEach(function(s){"object"!=typeof t||Array.isArray(t)?(r=t[s],i=e,o=n):(r=s,i=t[s],o=e),i?c.removeListener(r,i,o):c.delete(r);},this)),this},o.once=function(t,e,n){var r=this;return void 0===t||("string"==typeof t&&(t=t.split(/\s/g)),this.on(t,function i(){r.off(t,i,n),e.apply(n,[].slice.call(arguments));},n)),this},o.emit=function(t){var e=this,n=[].slice.call(arguments,1);return void 0===t||("string"==typeof t&&(t=t.split(/\s/g)),t.forEach(function(t){var r=e.getEvent(t),i=new CustomEvent(t,{detail:n});window.dispatchEvent(i),r.forEach(function(t){var e=t.toJSON();e.callback.apply(e.scope,n);});},this)),this},i}(e);

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
const computeValue = (value, args) => {
    if (typeof value === "function") {
        return value(...args);
    }
    else {
        return value;
    }
};
const mapObject = (obj, args) => {
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
const easings = {
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
const getEase = (ease) => {
    return /^(ease|in|out)/.test(ease) ? easings[ease] : ease;
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
    onfinish() { },
    fillMode: "auto",
    direction: "normal",
};
// You can check it out here: https://codepen.io/okikio/pen/qBbdGaW?editors=0011
class Animate {
    /**
     * Creates an instance of Animate.
     *
     * @param {AnimationOptions} options
     * @memberof Animate
     */
    constructor(options = {}) {
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
        this.emitter = new i$1();
        let { options: animation, ...rest } = options;
        this.options = Object.assign({}, DefaultAnimationOptions, animation, rest);
        let { loop, delay, speed, easing, endDelay, duration, direction, fillMode, onfinish, target, keyframes, autoplay, ...properties } = this.options;
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
                fill: fillMode,
            };
            // Accept keyframes as a keyframes Object, or a method, 
            // if there are no animations in the keyframes array,
            // uses css properties from the options object
            let arrKeyframes = computeValue(keyframes, [i, len, target]);
            animationKeyframe = arrKeyframes.length ? arrKeyframes :
                this.properties;
            // Allows the use of functions as the values, for both the keyframes and the animation object
            // It adds the capability of advanced stagger animation, similar to the anime js stagger functions
            animationOptions = mapObject(animationOptions, [i, len, target]);
            if (!(arrKeyframes.length > 0))
                animationKeyframe = mapObject(animationKeyframe, [i, len, target]);
            // Set the Animate classes duration to be the Animation with the largest totalDuration
            let tempDuration = animationOptions.delay +
                (animationOptions.duration * animationOptions.iterations) +
                animationOptions.endDelay;
            if (this.duration < tempDuration)
                this.duration = tempDuration;
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
        if (autoplay)
            this.play();
        else
            this.pause();
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
    newPromise() {
        return new Promise((resolve, reject) => {
            try {
                this.finish = (options) => {
                    this.emit("finish", options);
                    return resolve(options);
                };
            }
            catch (err) {
                reject(err);
            }
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
    then(onFulfilled, onRejected) {
        return this.promise.then(onFulfilled, onRejected);
    }
    /**
     * Catches error that occur in the this.promise Promise
     *
     * @param {(reason?: any) => any} onRejected
     * @returns {Promise<AnimationOptions>}
     * @memberof Animate
     */
    catch(onRejected) {
        return this.promise.catch(onRejected);
    }
    /**
     * If you don't care if the this.promise Promise has either been rejected or resolved
     *
     * @param {() => any} onFinally
     * @returns {Promise<AnimationOptions>}
     * @memberof Animate
     */
    finally(onFinally) {
        return this.promise.finally(onFinally);
    }
    /**
     * Represents an Animation Frame Loop
     *
     * @private
     * @memberof Animate
     */
    loop() {
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
     * Return the playback speed of the animation
     *
     * @returns {number}
     * @memberof Animate
     */
    getSpeed() {
        return this.mainAnimation.playbackRate;
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
        this.promise = this.newPromise();
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
        return this.getOptions();
    }
}
// Creates a new Animate instance
const animate = (options = {}) => {
    return new Animate(options);
};

let anim = animate({
    target: ".div",
    keyframes(index, total, element) {
        console.log(element);
        return [
            { transform: "translateX(0px)", opacity: 0 },
            { transform: "translateX(300px)", opacity: ((index + 1) / total) }
        ];
    },
    // transform: ["translateX(0px)", "translateX(300px)"],
    easing: "out-cubic",
    // opacity(index, total, element) {
    //     console.log(element);
    //     return [0, ((index + 1) / total)];
    // },
    duration(index) {
        return (index + 1) * 500;
    },
    onfinish(element, index, total) {
        element.style.opacity = `${((index + 1) / total)}`;
        element.style.transform = "translateX(300px)";
    },
    loop: 5,
    speed: 1,
    direction: "alternate",
    delay(i) {
        return i * 200;
    },
    autoplay: true,
});
anim.then(() => {
    let el = document.querySelector(".info");
    let info = "Done, it was delayed because of the endDelay property.";
    el.textContent = info;
    el.style.color = "red";
    console.log(info);
});
let progressSpan = document.querySelector(".progress");
anim.on("change", () => {
    progressSpan.textContent = `${Math.round(anim.getProgress() * 100)}%`;
});
let body = document.querySelector("body");
body.addEventListener("click", () => {
    let state = anim.getPlayState();
    if (state === "running")
        anim.pause();
    else if (state === "finished")
        anim.reset();
    else
        anim.play();
    console.log(state);
});
