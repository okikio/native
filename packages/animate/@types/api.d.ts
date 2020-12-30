import { EventEmitter, EventInput, ListenerCallback } from "@okikio/emitter";
export declare type AnimationTarget = string | Node | NodeList | HTMLCollection | HTMLElement[] | any[];
export declare const getElements: (selector: string | Node) => Node[];
export declare const getTargets: (targets: AnimationTarget) => Node[];
export declare type closureArgs = [number, number, HTMLElement];
export declare type closure = ((index?: number, total?: number, element?: HTMLElement) => any) | any;
export declare const computeValue: (value: closure, args: closureArgs) => any;
export declare const mapObject: (obj: object, args: closureArgs) => any;
/** From: [https://easings.net] */
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
    onfinish?: (element?: HTMLElement, index?: number, total?: number, animation?: Animation) => any;
    fillMode?: "none" | "forwards" | "backwards" | "both" | "auto" | closure;
    direction?: "normal" | "reverse" | "alternate" | "alternate-reverse" | closure;
    [property: string]: closure | boolean | object | string | string[] | number | null | (number | null)[] | undefined;
}
export declare const DefaultAnimationOptions: AnimationOptions;
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
     * A Set of Animations
     */
    animations: Map<HTMLElement, Animation>;
    /**
     * The total duration of all Animation's
     */
    duration: number;
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
     * The finish method, is called when the main animation has finished
     */
    finish: any;
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
     * Returns the Array of targets
     */
    getTargets(): Node[];
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
     * Adds a listener for a given event
     */
    on(events: EventInput, callback?: ListenerCallback, scope?: object): Animate;
    /**
     * Removes a listener from an event
     */
    off(events: EventInput, callback?: ListenerCallback, scope?: object): Animate;
    /**
     * Call all listeners within an event
     */
    emit(events: string | any[], ...args: any): Animate;
    /**
     * Get a specific Animation from an Animate instance
     */
    getAnimation(element: HTMLElement): Animation;
    /**
     * Play Animation
     */
    play(): Animate;
    /**
     * Pause Animation
     */
    pause(): Animate;
    /**
     * Returns the total duration of Animation
     */
    getDuration(): number;
    /**
     * Returns the current time of the Main Animation
     */
    getCurrentTime(): number;
    /**
     * Set the current time of the Main Animation
     */
    setCurrentTime(time: number): Animate;
    /**
     * Returns the Animation progress as a fraction of the current time / duration
     */
    getProgress(): number;
    /**
     * Set the Animation progress as a value from 0 to 100
     */
    setProgress(percent: number): Animate;
    /**
     * Return the playback speed of the animation
     */
    getSpeed(): number;
    /**
     * Set the playback speed of an Animation
     */
    setSpeed(speed?: number): Animate;
    /**
     * Reset all Animations
     */
    reset(): void;
    /**
     * Returns the current playing state
     */
    getPlayState(): "idle" | "running" | "paused" | "finished";
    /**
     * Get the options of an Animate instance
     */
    getOptions(): AnimationOptions;
    /** Returns the Animate options, as JSON  */
    toJSON(): AnimationOptions;
    /**
     * Cancels & Clears all Animations
     */
    stop(): void;
    /**
     * The Symbol.toStringTag well-known symbol is a string valued property that is used
     * in the creation of the default string description of an object.
     * It is accessed internally by the Object.prototype.toString() method.
     */
    get [Symbol.toStringTag](): string;
}
/** Creates a new Animate instance */
export declare const animate: (options?: AnimationOptions) => Animate;
export default animate;
