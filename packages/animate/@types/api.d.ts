import { EventEmitter, EventInput, ListenerCallback } from "@okikio/emitter";
import { Manager } from "@okikio/manager";
export declare type AnimationTarget = string | Node | NodeList | HTMLCollection | HTMLElement[] | AnimationTarget[];
export declare const getElements: (selector: string | Node) => Node[];
export declare const getTargets: (targets: AnimationTarget) => Node[];
export declare type closureArgs = [number, number, HTMLElement];
export declare type closure = ((index?: number, total?: number, element?: HTMLElement) => (genericTypes[] | void)) | any;
export declare const computeValue: (value: closure, args: closureArgs, context: Animate) => any;
export declare const mapObject: (obj: object, args: closureArgs, options: Animate) => any;
/** From: [https://easings.net] */
export declare const easings: {
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
export declare type genericTypes = genericTypes[] | boolean | object | string | number | closure | null | undefined;
export interface AnimationOptions {
    target?: AnimationTarget;
    speed?: number;
    autoplay?: boolean;
    options?: AnimationOptions;
    delay?: number | closure;
    easing?: string | closure;
    endDelay?: number | closure;
    duration?: number | closure;
    keyframes?: Keyframe[] | object[] | closure;
    loop?: number | boolean | closure;
    onfinish?: (element?: HTMLElement, index?: number, total?: number, animation?: Animation) => any;
    fillMode?: "none" | "forwards" | "backwards" | "both" | "auto" | closure;
    direction?: "normal" | "reverse" | "alternate" | "alternate-reverse" | closure;
    extend?: EffectTiming;
    [property: string]: genericTypes;
}
export declare const DefaultAnimationOptions: AnimationOptions;
export declare type AnimationEvents = "update" | "play" | "pause" | "start" | "begin" | "complete" | "finish" | "error" | "stop";
/** You can check it out here: https://codepen.io/okikio/pen/qBbdGaW?editors=0011 */
export declare class Animate {
    /**
     * Stores the options for the current animation
     */
    options: AnimationOptions;
    /**
     * The Array of Elements to Animate
     */
    targets: Node[];
    /**
     * The properties to animate
     */
    properties: object;
    /**
     * A Manager of Animations
     */
    animations: Manager<HTMLElement, Animation>;
    /**
     * The total duration of all Animation's
     */
    totalDuration: number;
    /**
     * The smallest delay out of all Animation's
     */
    minDelay: number;
    /**
     * The options for individual animations
     */
    computedOptions: Manager<Animation, AnimationOptions>;
    /**
     * The Element the main animation uses
     */
    mainElement: HTMLElement;
    /**
     * Stores an animation that runs on the total duration of the all other Animations, and as such it's the main Animation
     */
    mainAnimation: Animation;
    /**
     * Stores request frame calls
     */
    animationFrame: number;
    /**
     * An event emitter
     */
    emitter: EventEmitter;
    /**
     * Returns a promise that is fulfilled when the mainAnimation is finished
     */
    promise: Promise<AnimationOptions>;
    constructor(options?: AnimationOptions);
    /**
     * Returns a new Promise that is resolve when this.finish is called
     */
    newPromise(): Promise<AnimationOptions>;
    /**
     * Fulfills the this.promise Promise
     */
    then(onFulfilled?: (value?: any) => any, onRejected?: (reason?: any) => any): Animate;
    /**
     * Catches error that occur in the this.promise Promise
     */
    catch(onRejected: (reason?: any) => any): Animate;
    /**
     * If you don't care if the this.promise Promise has either been rejected or resolved
     */
    finally(onFinally: () => any): Animate;
    /**
     * Represents an Animation Frame Loop
     */
    loop(): void;
    /**
     * Cancels animation frame
     */
    stopLoop(): void;
    /**
     * Calls a method that affects all animations including the mainAnimation; the method only allows the animation parameter
    */
    all(method: (animation?: Animation, target?: HTMLElement) => void): this;
    /**
     * Register the begin event
     */
    protected beginEvent(): void;
    /**
     * Play Animation
     */
    play(): Animate;
    /**
     * Pause Animation
     */
    pause(): Animate;
    /**
     * Reset all Animations
     */
    reset(): this;
    /**
     * Cancels all Animations
     */
    cancel(): this;
    /**
     * Force complete all Animations
     */
    finish(): this;
    /**
     * Cancels & Clears all Animations
     */
    stop(): void;
    /**
     * Returns an Array of targets
     */
    getTargets(): Node[];
    /**
     * Get a specific Animation from an Animate instance
     */
    getAnimation(element: HTMLElement): Animation;
    /**
     * Returns the timings of an Animation, given a target
     * E.g. { duration, endDelay, delay, iterations, iterationStart, direction, easing, fill, etc... }
     */
    getTiming(target: HTMLElement | Animation): AnimationOptions & EffectTiming;
    /**
     * Returns the total duration of Animation
     */
    getTotalDuration(): number;
    /**
     * Returns the current time of the Main Animation
     */
    getCurrentTime(): number;
    /**
     * Returns the Animation progress as a fraction of the current time / duration * 100
     */
    getProgress(): number;
    /**
     * Return the playback speed of the animation
     */
    getSpeed(): number;
    /**
     * Returns the current playing state
     */
    getPlayState(): "idle" | "running" | "paused" | "finished";
    /**
     * Get the options of an Animate instance
     */
    getOptions(): AnimationOptions;
    /**
     * Set the current time of the Main Animation
     */
    setCurrentTime(time: number): Animate;
    /**
     * Set the Animation progress as a value from 0 to 100
     */
    setProgress(percent: number): Animate;
    /**
     * Set the playback speed of an Animation
     */
    setSpeed(speed?: number): Animate;
    /**
     * Adds a listener for a given event
     */
    on(events: AnimationEvents | EventInput, callback?: ListenerCallback, scope?: object): Animate;
    /**
     * Removes a listener from an event
     */
    off(events: AnimationEvents | EventInput, callback?: ListenerCallback, scope?: object): Animate;
    /**
     * Call all listeners within an event
     */
    emit(events: AnimationEvents | string | any[], ...args: any): Animate;
    /** Returns the Animate options, as JSON  */
    toJSON(): AnimationOptions;
    /**
     * The Symbol.toStringTag well-known symbol is a string valued property that is used
     * in the creation of the default string description of an object.
     * It is accessed internally by the Object.prototype.toString() method.
     */
    get [Symbol.toStringTag](): string;
}
/** Creates a new Animate instance */
export declare const animate: (options?: AnimationOptions) => Animate;
export declare class Timeline extends Animate {
    /**
     * A Manager of Animations
     */
    animations: Manager<HTMLElement, Animation>;
    constructor(options?: AnimationOptions);
    add(options: AnimationOptions): this;
}
export default animate;
