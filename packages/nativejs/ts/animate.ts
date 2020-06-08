// Based on animate-plus.js
// DOM
export type AnimationTarget = string | Node | NodeList;
export const getElements = (selector: string | Node): Node[] => {
    return typeof selector === "string" ? Array.from(document.querySelectorAll(selector as string)) : [selector];
};

export const getTargets = (targets: AnimationTarget): Node[] => {
    if (Array.isArray(targets)) return targets;
    if (typeof targets == "string" || targets instanceof Node)
        return getElements(targets);
    if (targets instanceof NodeList) return Array.from(targets);
    return [];
};

let computeValue = (value: any, ...args: any[]) =>
    typeof value == "function" ? value(...args) : value;

// From: easings.net
const easings = {
    "ease": "ease",
    "ease-in": "ease-in",
    "ease-out": "ease-out",
    "ease-in-out": "ease-in-out",
    "ease-in-out-back": "cubic-bezier(0.68, -0.6, 0.32, 1.6)"
};

export interface AnimationOptions {
    target?: AnimationTarget,

    delay?: number,
    easing?: string,
    endDelay?: number,
    duration?: number,
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
    easing: "ease",
    endDelay: 0,
    duration: 1000,
    direction: "normal",
    fill: "forwards",
};

// Check it out here: https://codepen.io/okikio/pen/qBbdGaW?editors=0011
export class Animate extends Promise<AnimationOptions> {
    /**
     * Stores the options for the current animation
     *
     * @protected
     * @type AnimationOptions
     * @memberof Animate
     */
    protected options: AnimationOptions = {};

    protected targets: Node[] = [];
    protected properties: object = {};

    /**
     * An Array of Animations
     *
     * @protected
     * @type {Set<Animation>}
     * @memberof Animate
     */
    protected animations: Set<Animation> = new Set();
    protected promises: Promise<Animate>[] = [];

    /**
     * Creates an instance of Animate.
     * 
     * @param {AnimationOptions} options
     * @memberof Animate
     */
    constructor(
        options: AnimationOptions = {},
        finish: any
    ) {
        super(resolve => { finish = resolve; });

        (async () => {
            let { animation, ...rest } = options;
            this.options = Object.assign({}, DefaultAnimationOptions, animation, rest);

            let {
                loop,
                delay,
                easing,
                endDelay,
                duration,
                direction,
                fill,
                target,
                keyframes,
                ...properties
            } = this.options;
            this.targets = getTargets(target);
            this.properties = properties;

            let objectMap = (obj: object, fn: Function) => {
                let keys = Object.keys(obj);
                for (let key of keys) {
                    let value = obj[key];
                    obj[key] = fn(value);
                }
            };

            let animationKeyframe;
            let len = this.targets.length;
            for (let i = 0; i < len; i++) {
                let target = this.targets[i];
                let valueClosure = (value: any) => computeValue(value, target, i, len);
                let animationOptions = {
                    iterations: loop == true ? Infinity : (loop as number),
                    easing: easing.startsWith("ease") ? easings[easing] : easing,
                    delay: delay,
                    endDelay: endDelay,
                    duration,
                    direction,
                    fill,
                };

                objectMap(animationOptions, valueClosure);
                if ((keyframes as Keyframe[]).length) {
                    animationKeyframe = (keyframes as Keyframe[]);
                } else {
                    animationKeyframe = (this.properties as PropertyIndexedKeyframes);
                    objectMap(animationKeyframe, valueClosure);
                }

                let animation = (target as HTMLElement).animate(animationKeyframe, animationOptions);
                this.animations.add(animation);
            }

            this.animations.forEach(animation => {
                let promise: Promise<Animate> = new Promise(finish => {
                    animation.onfinish = () => { finish(); };
                });

                this.promises.push(promise);
            });

            await Promise.all(this.promises);
            finish(this.options);
        })();
    }

    // you can also use Symbol.species in order to
    // return a Promise for then/catch/finally
    static get [Symbol.species]() {
        return Promise;
    }

    // Promise overrides his Symbol.toStringTag
    get [Symbol.toStringTag]() {
        return 'MyPromise';
    }

    public toJSON(): AnimationOptions {
        return this.options;
    }
}

export const animate = (targets: AnimationTarget, properties: object, options: AnimationOptions) => { };
export default animate;