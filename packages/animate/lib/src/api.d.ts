import { EventEmitter, EventInput, ListenerCallback } from "@okikio/emitter";
export declare type AnimationTarget = string | Node | NodeList | HTMLCollection | HTMLElement[] | any[];
export declare const getElements: (selector: string | Node) => Node[];
export declare const getTargets: (targets: AnimationTarget) => Node[];
export declare type closureArgs = [number, number, HTMLElement];
export declare type closure = ((index?: number, total?: number, element?: HTMLElement) => any) | any;
export declare const computeValue: (value: closure, args: closureArgs) => any;
export declare const mapObject: (obj: object, args: closureArgs) => any;
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
    speed?: number | closure;
    delay?: number | closure;
    easing?: string | closure;
    endDelay?: number | closure;
    duration?: number | closure;
    autoplay?: boolean | closure;
    keyframes?: object[] | closure;
    loop?: number | boolean | closure;
    options?: AnimationOptions | closure;
    onfinish?: (element?: HTMLElement, index?: number, total?: number) => any;
    fillMode?: "none" | "forwards" | "backwards" | "both" | "auto" | closure;
    direction?: "normal" | "reverse" | "alternate" | "alternate-reverse" | closure;
    [property: string]: closure | boolean | object | string | string[] | number | null | (number | null)[] | undefined;
}
export declare const DefaultAnimationOptions: AnimationOptions;
export declare class Animate {
    /**
     * Stores the options for the current animation
     *
     * @public
     * @type AnimationOptions
     * @memberof Animate
     */
    public options: AnimationOptions;
    /**
     * The Array of Elements to Animate
     *
     * @public
     * @type {Node[]}
     * @memberof Animate
     */
    public targets: Node[];
    /**
     * The properties to animate
     *
     * @public
     * @type {object}
     * @memberof Animate
     */
    public properties: object;
    /**
     * A Set of Animations
     *
     * @public
     * @type {Map<HTMLElement, Animation>}
     * @memberof Animate
     */
    public animations: Map<HTMLElement, Animation>;
    /**
     * The total duration of all Animation's
     *
     * @public
     * @type {number}
     * @memberof Animate
     */
    public duration: number;
    /**
     * The Element the main animation uses
     *
     * @public
     * @type {HTMLElement}
     * @memberof Animate
     */
    public mainElement: HTMLElement;
    /**
     * Stores an animation that runs on the total duration of the all other Animations, and as such it's the main Animation
     *
     * @public
     * @type {Animation}
     * @memberof Animate
     */
    public mainAnimation: Animation;
    /**
     * Stores request frame calls
     *
     * @public
     * @type {number}
     * @memberof Animate
     */
    public animationFrame: number;
    /**
     * An event emitter
     *
     * @public
     * @type {EventEmitter}
     * @memberof Animate
     */
    public emitter: EventEmitter;
    /**
     * The finish method, is called when the main animation has finished
     *
     * @public
     * @type {*}
     * @memberof Animate
     */
    public finish: any;
    /**
     * Returns a promise that is fulfilled when the mainAnimation is finished
     *
     * @public
     * @type {Promise<AnimationOptions>}
     * @memberof Animate
     */
    public promise: Promise<AnimationOptions>;
    /**
     * Creates an instance of Animate.
     *
     * @param {AnimationOptions} options
     * @memberof Animate
     */
    constructor(options?: AnimationOptions);
    /**
     * Returns the Array of targets
     *
     * @returns {Node[]}
     * @memberof Animate
     */
    getTargets(): Node[];
    /**
     * Returns a new Promise that is resolve when this.finish is called
     *
     * @public
     * @returns {Promise<AnimationOptions>}
     * @memberof Animate
     */
    public newPromise(): Promise<AnimationOptions>;
    /**
     * Fulfills the this.promise Promise
     *
     * @param {(value?: any) => any} [onFulfilled]
     * @param {(reason?: any) => any} [onRejected]
     * @returns {Promise<AnimationOptions>}
     * @memberof Animate
     */
    then(onFulfilled?: (value?: any) => any, onRejected?: (reason?: any) => any): Promise<AnimationOptions>;
    /**
     * Catches error that occur in the this.promise Promise
     *
     * @param {(reason?: any) => any} onRejected
     * @returns {Promise<AnimationOptions>}
     * @memberof Animate
     */
    catch(onRejected: (reason?: any) => any): Promise<AnimationOptions>;
    /**
     * If you don't care if the this.promise Promise has either been rejected or resolved
     *
     * @param {() => any} onFinally
     * @returns {Promise<AnimationOptions>}
     * @memberof Animate
     */
    finally(onFinally: () => any): Promise<AnimationOptions>;
    /**
     * Represents an Animation Frame Loop
     *
     * @private
     * @memberof Animate
     */
    public loop(): void;
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
     * Return the playback speed of the animation
     *
     * @returns {number}
     * @memberof Animate
     */
    getSpeed(): number;
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
export default animate;
