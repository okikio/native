import { Animate } from "./animate";
import { Manager } from "@okikio/manager";
import type { IAnimateInstanceConfig, TypeAnimationEvents, TypePlayStates } from "./types";
import type { TypeEventInput, TypeListenerCallback } from "@okikio/emitter";
/**
 * If the input value is a string starting with with "=" (the equal sign), it removes the "=" and return the remaining number
 * Otherwise, parse string or numbers to a number and add the base number to it, to create relative numbers (relative to the base value)
 */
export declare const relativeTo: (input: string | number, base: number) => number;
/**
 * Queues acts as a playback manager for a set of Animate instances.
 * It is responsible for controlling the chronological order of Animate instances, as well as the general playback state of all Animate instances.
 *
 * It's used like this,
 * ```ts
 * import { Queue, Animate, CustomEasing } from "@okikio/animate";
 *
 * new Queue({
 *    // These options are passed to each Animate instance that is added to the Queue,
 *    // this is the only way to pass animation options to the Animate instance.
 *    target: ".div",
 *
 *    // You don't set the Queue options at all, you set the animation options for each Animate instance, the Queue then automatically sets the Queues totalDuration, minDelay, etc... based on this, using the `.updateTimings()` method.
 *    duration: 1000,
 * })
 *
 * // You add Animate instances to a Queue using the `.add(AnimationOptions, TimelineOffset)` method (`.add()` is chainable)
 * .add({
 *    // You can set the animation options for each Animate instance,
 *    // these options are passed to the Animate instance when it's created.
 *
 *    translateX: 500,
 *    scale: 2,
 *    // ...
 * })
 *
 * .add(
 *      new Animate({
 *          translateX: CustomEasing([0, 500])
 *      }),
 *
 * // The timeline offset states where relative to the other Animate instances to place the new Animate instance on the chronological timeline,
 * // by default you can use string and numbers as relative timeline offsets, to use absolute timeline offsests you need to use this format "= number" e.g. `new Queue(...).add({ ... }, "= 0")`, start at absolute `0` (the beginning) of the Queue
 * // NOTE: if you can use negative "relative" and "absolute" timeline offsets, so, "-50" and "= -50" are viable timeline offsets
 *
 * // Start at relative "50" (add "50") to the position of the last Animate instance in the Queues chronologial order
 * 50)
 *
 * // You can also pass a function that returns an Animate instance
 * .add((() => {
 *      let options = {
 *          width: 600,
 *          rotate: 45
 *      };
 *
 *      return new Animate(options);
 * })(), "= 50"); // Start at absolute "50" of the Queue (add "50" to the start of the Queue)
 * ```
 *
 * _**NOTE**: `Queues` do not in any way replace the {@link IAnimationOptions.timeline}, it supplements it, with a format similar to [animejs's timeline](https://animejs.com/documentation/#timelineBasics).
 * As of the writing this documentations, devs are not yet able to interact with [AnimationTimeline](https://developer.mozilla.org/en-US/docs/Web/API/AnimationTimeline), in a way that create timeline like effects, aside from [ScrollTimeline](https://drafts.csswg.org/scroll-animations-1/#scroll-driven-animations), thus,
 * this the `Queue` class should tide us over until such a day, that devs can use `AnimationTimeline` to create cool animations_
 *
 * @beta WIP
 */
export declare class Queue {
    /**
     * The main Animate instance, it controls playback, speed, and generally cause the Timeline to move.
    */
    mainInstance: Animate;
    /**
     * Stores all Animate instances that are attached to the Queue
     */
    animateInstances: Manager<number, Animate>;
    /**
     * The total duration of the mainInstance
     */
    get totalDuration(): number;
    set totalDuration(num: number);
    /**
     * The maximum duration of the mainInstance
     */
    get maxDuration(): number;
    set maxDuration(num: number);
    /**
     * The smallest delay out of the mainInstance
     */
    get minDelay(): number;
    set minDelay(num: number);
    /**
     * The smallest speed out of the mainInstance
     */
    get maxSpeed(): number;
    set maxSpeed(num: number);
    /**
     * The largest end delay out of the mainInstance
     */
    get maxEndDelay(): number;
    set maxEndDelay(num: number);
    /**
     * The timelineOffset of the mainInstance
     */
    get timelineOffset(): number;
    set timelineOffset(num: number);
    /**
     * The options from the mainInstance
     */
    get options(): IAnimateInstanceConfig;
    set options(opts: IAnimateInstanceConfig);
    /** The initial options set in the constructor */
    initialOptions: IAnimateInstanceConfig;
    /**
     * The event emitter of the mainInstance
     */
    get emitter(): import("@okikio/emitter").EventEmitter;
    /**
     * The promise created by the mainInstance
     */
    get promise(): Promise<Animate[]>;
    constructor(options?: IAnimateInstanceConfig);
    /**
     * Allows a user to add a new Animate instance to a Queue
     * @param options - you can add an Animate instance by either using animation options or by adding a pre-existing Animate Instance.
     * @param timelineOffset - by default the timelineOffset is 0, which means the Animation will play in chronological order of when it was defined; a different value, specifies how many miliseconds off from the chronological order before it starts playing the Animation. You can also use absolute values, for exmple, if you want your animation to start at 0ms, setting timelineOffset to 0, or "0" will use relative offsets, while using "= 0" will use absolute offsets. Read more on {@link relativeTo}
     */
    add(options?: IAnimateInstanceConfig | Animate, timelineOffset?: string | number): this;
    /** Update the Queue's duration, endDelay, etc... based on the `animateInstances` */
    updateTiming(): this;
    /**
     * Remove an Animate instance from the Queue using it's index in animateInstances
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
    toJSON(): IAnimateInstanceConfig;
    /**
     * The Symbol.toStringTag well-known symbol is a string valued property that is used
     * in the creation of the default string description of an object.
     * It is accessed internally by the Object.prototype.toString() method.
     */
    get [Symbol.toStringTag](): string;
}
/**
 * Creates a new {@link Queue} instance, and passes the options to the constructor
*/
export declare const queue: (options?: IAnimateInstanceConfig) => Queue;
