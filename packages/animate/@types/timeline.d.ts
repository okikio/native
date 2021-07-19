import { Animate } from "./animate";
import { Manager } from "@okikio/manager";
import type { IAnimationOptions, TypeAnimationEvents, TypePlayStates } from "./types";
import type { TypeEventInput, TypeListenerCallback } from "@okikio/emitter";
/**
 * If the input value is a string starting with with "=" (the equal sign), it removes the "=" and return the remaining number
 * Otherwise, parse string or numbers to a number and add the base number to it, to create relative numbers (relative to the base value)
 */
export declare const relativeTo: (input: string | number, base: number) => number;
/**
 *
 * @beta WIP
 */
export declare class Timeline {
    /**
     * The main Animate instance, it controls playback, speed, and generally cause the AnimateTimeline to move.
    */
    mainInstance: Animate;
    /**
     * Stores all Animate instances that are attached to the AnimateTimeline
     */
    animateInstances: Manager<number, Animate>;
    /**
     * The total duration of the mainInstance
     */
    get totalDuration(): number;
    set totalDuration(value: number);
    /**
     * The maximum duration of the mainInstance
     */
    get maxDuration(): number;
    set maxDuration(value: number);
    /**
     * The smallest delay out of the mainInstance
     */
    get minDelay(): number;
    set minDelay(value: number);
    /**
     * The smallest speed out of the mainInstance
     */
    get maxSpeed(): number;
    set maxSpeed(value: number);
    /**
     * The largest end delay out of the mainInstance
     */
    get maxEndDelay(): number;
    set maxEndDelay(value: number);
    /**
     * The timelineOffset of the mainInstance
     */
    get timelineOffset(): number;
    set timelineOffset(value: number);
    /**
     * The options from the mainInstance
     */
    get options(): IAnimationOptions;
    set options(opts: IAnimationOptions);
    /** The initial options set in the constructor */
    initialOptions: IAnimationOptions;
    /**
     * The event emitter of the mainInstance
     */
    get emitter(): import("@okikio/emitter").EventEmitter;
    /**
     * The promise created by the mainInstance
     */
    get promise(): Promise<Animate[]>;
    constructor(options?: IAnimationOptions);
    /**
     * Allows a user to add a new Animate instances to an AnimateTimeline
     * @param options - you can add an Animate instance by either using animation options or by adding a pre-existing Animate Instance.
     * @param timelineOffset - by default the timelineOffset is 0, which means the Animation will play in chronological order of when it was defined; a different value, specifies how many miliseconds off from the chronological order before it starts playing the Animation. You can also use absolute values, for exmple, if you want your animation to start at 0ms, setting timelineOffset to 0, or "0" will use relative offsets, while using "= 0" will use absolute offsets. Read more on {@link relativeTo}
     */
    add(options?: IAnimationOptions | Animate, timelineOffset?: string | number): this;
    /** Update the timeline's duration, endDelay, etc... based on the `animateInstances` */
    updateTiming(): this;
    /**
     * Remove an Animate instance from the AnimateTimeline using it's index in animateInstances
    */
    remove(index: number): Animate | null;
    /**
     * Fulfills the `this.promise` Promise
     */
    then(onFulfilled?: (value?: any) => any, onRejected?: (reason?: any) => any): this;
    /**
     * Catches error that occur in the `this.promise` Promise
     */
    catch(onRejected: (reason?: any) => any): this;
    /**
     * If you don't care if the `this.promise` Promise has either been rejected or resolved
     */
    finally(onFinally: () => any): this;
    /**
     * Calls a method that affects all Animate instances **excluding** the mainInstance
    */
    allInstances(method: (animate?: Animate, index?: number) => void): this;
    /**
     * Calls a method that affects all animations **including** the mainAnimation
    */
    all(method: (animate?: Animate, index?: number) => void): this;
    /**
     * Play Animation
     */
    play(): this;
    /**
     * Pause Animation
     */
    pause(): this;
    /**
     * Reverse Animation
     */
    reverse(): this;
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
     * Returns the current time of the Main Animate Instance
     */
    getCurrentTime(): number;
    /**
     * Returns the Animation progress as a fraction of the current time / duration * 100
     */
    getProgress(): number;
    /**
     * Returns the current playing state
     */
    getPlayState(): TypePlayStates;
    /**
     * Returns a boolean determining if the `animate` instances playstate is equal to the `playstate` parameter.
     */
    is(playstate: TypePlayStates): boolean;
    /**
     * Set the current time of the Main Animate Instance
     */
    setCurrentTime(time: number): this;
    /**
     * Set the Animation progress as a value from 0 to 100
     */
    setProgress(percent: number): this;
    /**
     * Set the playback speed of an Animation
     */
    setSpeed(speed?: number): this;
    /**
     * Adds a listener for a given event
     */
    on(events: TypeAnimationEvents[] | TypeAnimationEvents | TypeEventInput, callback?: TypeListenerCallback | object, scope?: object): this;
    /**
     * Removes a listener from an event
     */
    off(events: TypeAnimationEvents[] | TypeAnimationEvents | TypeEventInput, callback?: TypeListenerCallback | object, scope?: object): this;
    /**
     * Call all listeners within an event
     */
    emit(events: TypeAnimationEvents[] | TypeAnimationEvents | string | any[], ...args: any): this;
    /** Returns the Animate options, as JSON  */
    toJSON(): IAnimationOptions;
    /**
     * The Symbol.toStringTag well-known symbol is a string valued property that is used
     * in the creation of the default string description of an object.
     * It is accessed internally by the Object.prototype.toString() method.
     */
    get [Symbol.toStringTag](): string;
}
export declare const timeline: (options?: IAnimationOptions) => Timeline;
