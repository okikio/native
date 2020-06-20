import { EventEmitter, EventInput, ListenerCallback } from "@okikio/event-emitter";
export declare type AnimationTarget = string | Node | NodeList | HTMLCollection | HTMLElement[] | any[];
export declare const getElements: (selector: string | Node) => Node[];
export declare const getTargets: (targets: AnimationTarget) => Node[];
export declare const computeValue: (value: any, ...args: any[]) => any;
export declare const mapObject: (obj: object, fn: Function) => object;
export declare const easings: {
    ease: string;
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
export declare const getEase: (ease: string) => any;
export interface AnimationOptions {
    target?: AnimationTarget;
    speed?: number;
    delay?: number;
    easing?: string;
    endDelay?: number;
    duration?: number;
    autoplay?: boolean;
    keyframes?: object[];
    animation?: AnimationOptions;
    loop?: number | boolean;
    direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
    [property: string]: boolean | object | string | string[] | number | null | (number | null)[] | undefined;
}
export declare const DefaultAnimationOptions: AnimationOptions;
export declare class Animate extends Promise<AnimationOptions> {
    /**
     * Stores the options for the current animation
     *
     * @protected
     * @type AnimationOptions
     * @memberof Animate
     */
    protected options: AnimationOptions;
    /**
     * The Array of Elements to Animate
     *
     * @protected
     * @type {Node[]}
     * @memberof Animate
     */
    protected targets: Node[];
    /**
     * The properties to animate
     *
     * @protected
     * @type {object}
     * @memberof Animate
     */
    protected properties: object;
    /**
     * A Set of Animations
     *
     * @protected
     * @type {Map<HTMLElement, Animation>}
     * @memberof Animate
     */
    protected animations: Map<HTMLElement, Animation>;
    /**
     * The total duration of all Animation's
     *
     * @protected
     * @type {number}
     * @memberof Animate
     */
    protected duration: number;
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
    protected emitter: EventEmitter;
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
    constructor(options?: AnimationOptions, finish?: any);
    static get [Symbol.species](): PromiseConstructor;
    get [Symbol.toStringTag](): string;
    /**
     * Represents an Animation Frame Loop
     *
     * @private
     * @memberof Animate
     */
    protected loop(): void;
    /**
     * Adds a listener for a given event
     *
     * @param {EventInput} events
     * @param {ListenerCallback} [callback]
     * @param {object} [scope]
     * @returns {Animate}
     * @memberof Animate
     */
    on(events: EventInput, callback?: ListenerCallback, scope?: object): Animate;
    /**
     * Removes a listener from an event
     *
     * @param {EventInput} events
     * @param {ListenerCallback} [callback]
     * @param {object} [scope]
     * @returns {Animate}
     * @memberof Animate
     */
    off(events: EventInput, callback?: ListenerCallback, scope?: object): Animate;
    /**
     * Call all listeners within an event
     *
     * @param {(string | any[])} events
     * @param {...any} args
     * @returns {Animate}
     * @memberof Animate
     */
    emit(events: string | any[], ...args: any): Animate;
    /**
     * Get a specific Animation from an Animate instance
     *
     * @param {HTMLElement} element
     * @returns {Animation}
     * @memberof Animate
     */
    getAnimation(element: HTMLElement): Animation;
    /**
     * Play Animation's
     *
     * @returns {Animate}
     * @memberof Animate
     */
    play(): Animate;
    /**
     * Pause Animation's
     *
     * @returns {Animate}
     * @memberof Animate
     */
    pause(): Animate;
    /**
     * Returns the total duration of all Animations
     *
     * @returns {number}
     * @memberof Animate
     */
    getDuration(): number;
    /**
     * Returns the current time of the Main Animation
     *
     * @returns {number}
     * @memberof Animate
     */
    getCurrentTime(): number;
    /**
     * Set the current time of the Main Animation
     *
     * @param {number} time
     * @returns {Animate}
     * @memberof Animate
     */
    setCurrentTime(time: number): Animate;
    /**
     * Returns the Animation progress as a fraction of the current time / duration
     *
     * @returns
     * @memberof Animate
     */
    getProgress(): number;
    /**
     * Set the Animation progress as a fraction of the current time / duration
     *
     * @param {number} percent
     * @returns {Animate}
     * @memberof Animate
     */
    setProgress(percent: number): Animate;
    /**
     * Set the playback speed of an Animation
     *
     * @param {number} [speed=1]
     * @returns {Animate}
     * @memberof Animate
     */
    setSpeed(speed?: number): Animate;
    /**
     * Reset all Animations
     *
     * @memberof Animate
     */
    reset(): void;
    /**
     * Returns the current playing state
     *
     * @returns {("idle" | "running" | "paused" | "finished")}
     * @memberof Animate
     */
    getPlayState(): "idle" | "running" | "paused" | "finished";
    /**
     * Get the options of an Animate instance
     *
     * @returns {AnimationOptions}
     * @memberof Animate
     */
    getOptions(): AnimationOptions;
    toJSON(): AnimationOptions;
}
export declare const animate: (options?: AnimationOptions) => Animate;
