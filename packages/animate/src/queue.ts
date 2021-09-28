import { Animate, DefaultAnimationOptions, parseOptions } from "./animate";
import { Manager } from "@okikio/manager";

import type { IAnimationOptions, TypeAnimationEvents, TypeComputedOptions, TypePlayStates } from "./types";
import type { TypeEventInput, TypeListenerCallback } from "@okikio/emitter";

/** 
 * If the input value is a string starting with with "=" (the equal sign), it removes the "=" and return the remaining number
 * Otherwise, parse string or numbers to a number and add the base number to it, to create relative numbers (relative to the base value)  
 */
export const relativeTo = (input: string | number, base: number) => {
    if (typeof input == "string") {
        if (/^\=/.test(input))
            return parseFloat(input.replace("=", ""));

        return parseFloat(input) + base;
    }

    return input + base;
}

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
export class Queue {
    /** 
     * The main Animate instance, it controls playback, speed, and generally cause the Timeline to move.
    */
    public mainInstance: Animate;

    /** 
     * Stores all Animate instances that are attached to the Queue
     */
    public animateInstances: Manager<number, Animate> = new Manager();

    /**
     * The total duration of the mainInstance
     */
    public get totalDuration() { return this.mainInstance.totalDuration; }
    public set totalDuration(num: number) { this.mainInstance.totalDuration = num; }

    /**
     * The maximum duration of the mainInstance
     */
    public get maxDuration() { return this.mainInstance.maxDuration; }
    public set maxDuration(num: number) { this.mainInstance.maxDuration = num; }

    /**
     * The smallest delay out of the mainInstance
     */
    public get minDelay() { return this.mainInstance.minDelay; }
    public set minDelay(num: number) { this.mainInstance.minDelay = num; }

    /**
     * The smallest speed out of the mainInstance
     */
    public get maxSpeed() { return this.mainInstance.maxSpeed; }
    public set maxSpeed(num: number) { this.mainInstance.maxSpeed = num; }

    /**
     * The largest end delay out of the mainInstance
     */
    public get maxEndDelay() { return this.mainInstance.maxEndDelay; }
    public set maxEndDelay(num: number) { this.mainInstance.maxEndDelay = num; }

    /**
     * The timelineOffset of the mainInstance
     */
    public get timelineOffset() { return this.mainInstance.timelineOffset; }
    public set timelineOffset(num: number) { this.mainInstance.timelineOffset = num; }

    /**
     * The options from the mainInstance
     */
    public get options() { return this.mainInstance.options; }
    public set options(opts: IAnimationOptions) { this.mainInstance.options = parseOptions(opts); }

    /** The initial options set in the constructor */
    public initialOptions: IAnimationOptions = {};

    /**
     * The event emitter of the mainInstance
     */
    public get emitter() { return this.mainInstance.emitter; }

    /**
     * The promise created by the mainInstance
     */
    public get promise() { return this.mainInstance.promise; }
    constructor(options: IAnimationOptions = {}) {
        this.mainInstance = new Animate({ duration: 0 });
        this.initialOptions = Object.assign({}, DefaultAnimationOptions, parseOptions(options));

        // Reset the duration
        this.totalDuration = 0;
        this.maxDuration = 0;
    }

    /**
     * Allows a user to add a new Animate instance to a Queue
     * @param options - you can add an Animate instance by either using animation options or by adding a pre-existing Animate Instance. 
     * @param timelineOffset - by default the timelineOffset is 0, which means the Animation will play in chronological order of when it was defined; a different value, specifies how many miliseconds off from the chronological order before it starts playing the Animation. You can also use absolute values, for exmple, if you want your animation to start at 0ms, setting timelineOffset to 0, or "0" will use relative offsets, while using "= 0" will use absolute offsets. Read more on {@link relativeTo}
     */
    public add(options: IAnimationOptions | Animate = {}, timelineOffset: string | number = 0) {
        let newInst: Animate | Queue;
        let insParams: IAnimationOptions = Object.assign({}, DefaultAnimationOptions, this.initialOptions,
            options instanceof Animate ? options.initialOptions : parseOptions(options));
        
        if (Math.abs(this.totalDuration) !== Infinity) {
            if (/\</.test(timelineOffset as string)) {
                let lastDuration = (this.animateInstances.last()?.totalDuration ?? 0);

                if (Math.abs(lastDuration) !== Infinity)
                    insParams.timelineOffset = relativeTo(
                        (timelineOffset + "").replace(/\</, ""),
                        this.totalDuration - (this.animateInstances.last()?.totalDuration ?? 0)
                    );
            } else insParams.timelineOffset = relativeTo(timelineOffset, this.totalDuration);
        }

        insParams.autoplay = this.initialOptions.autoplay;

        if (options instanceof Animate) {
            newInst = options;
            newInst.updateOptions(insParams);
        } else newInst = new Animate(insParams);

        this.animateInstances.add(newInst);
        this.updateTiming();

        return this;
    }

    /** Update the Queue's duration, endDelay, etc... based on the `animateInstances` */
    public updateTiming() {
        let timings = this.animateInstances.values();
        if (timings.length <= 1) return this;

        let duration = Math.max(...timings.map(x => x.totalDuration));
        if (Math.abs(duration) == Infinity) {
            console.warn(`[Queue - @okikio/animate] individual Animate instances that are part of a Queue can't have Infinite totalDuration. You can't queue animations one after the other if one of the animations last for literally infinity. This issue may come from setting the "loop, duration, endDelay, delay, etc..." animation options to either Infinity (or for the loop option only, "true").`);
            return this;
        }

        this.mainInstance.updateOptions({
            autoplay: this.initialOptions.autoplay,
            duration,
            delay: Math.max(...timings.map(x => x.minDelay)),
            endDelay: duration - Math.max(...timings.map(x => x.totalDuration - x.maxEndDelay)),
        });

        return this;
    }

    /** 
     * Remove an Animate instance from the Queue using it's index in animateInstances
    */
    public remove(index: number): Animate | null {
        let len = this.animateInstances.size;
        if (this.animateInstances.has(index)) {
            let animation = this.animateInstances.get(index);
            let { totalDuration, timelineOffset } = animation.totalDurationOptions;
            let totalTimelineOffset = Number(totalDuration) - Number(timelineOffset);

            for (let i = index; i < len; i++) {
                let instance = this.animateInstances.get(i);
                instance.updateOptions({
                    timelineOffset: instance.timelineOffset - totalTimelineOffset
                });
            }

            this.animateInstances.remove(index);
            this.updateTiming();
            return animation;
        }

        return null;
    }

    /**
     * Fulfills the `this.promise` Promise
     */
    public then(
        onFulfilled?: (value?: any) => any,
        onRejected?: (reason?: any) => any
    ) {
        onFulfilled = onFulfilled?.bind(this);
        onRejected = onRejected?.bind(this);
        this.mainInstance?.then?.(onFulfilled, onRejected);
        return this;
    }

    /**
     * Catches error that occur in the `this.promise` Promise
     */
    public catch(onRejected: (reason?: any) => any) {
        onRejected = onRejected?.bind(this);
        this.mainInstance?.catch?.(onRejected);
        return this;
    }

    /**
     * If you don't care if the `this.promise` Promise has either been rejected or resolved
     */
    public finally(onFinally: () => any) {
        onFinally = onFinally?.bind(this);
        this.mainInstance?.finally?.(onFinally);
        return this;
    }

    /**
     * Calls a method that affects all Animate instances **excluding** the mainInstance
    */
    public allInstances(method: (animate?: Animate, index?: number) => void) {
        this.animateInstances.forEach(method);
        return this;
    }

    /**
     * Calls a method that affects all animations **including** the mainAnimation
    */
    public all(method: (animate?: Animate, index?: number) => void) {
        this.mainInstance && method(this.mainInstance);
        this.allInstances(method);
        return this;
    }

    /**
     * Play Animation
     */
    public play() {
        this.all(anim => anim.play());
        return this;
    }

    /**
     * Pause Animation
     */
    public pause() {
        this.all(anim => anim.pause());
        return this;
    }

    /**
     * Reverse Animation
     */
    public reverse() {
        this.all(anim => anim.reverse());
        return this;
    }

    /**
     * Reset all Animations
     */
    public reset() {
        this.all(anim => anim.reset());
        return this;
    }

    /**
     * Cancels all Animations
     */
    public cancel() {
        this.all(anim => anim.cancel());
        return this;
    }

    /**
     * Force complete all Animations
     */
    public finish() {
        this.all(anim => anim.finish());
        return this;
    }

    /**
     * Cancels & Clears all Animations
     */
    public stop() {
        this.all(anim => anim.stop());
        this.animateInstances.clear();

        this.mainInstance = null;
        this.animateInstances = null;
    }

    /**
     * Returns the current time of the Main Animate Instance
     */
    public getCurrentTime(): number {
        return this.mainInstance.getCurrentTime();
    }

    /**
     * Returns the Animation progress as a fraction of the current time / duration * 100
     */
    public getProgress() {
        return this.mainInstance.getProgress();
    }

    /**
     * Returns the current playing state
     */
    public getPlayState() {
        return this.mainInstance.getPlayState();
    }

    /**
     * Returns a boolean determining if the `animate` instances playstate is equal to the `playstate` parameter.
     */
    public is(playstate: TypePlayStates) {
        return this.mainInstance.is(playstate);
    }

    /**
     * Set the current time of the Main Animate Instance
     */
    public setCurrentTime(time: number) {
        this.all(anim => anim.setCurrentTime(time));
        return this;
    }

    /**
     * Set the Animation progress as a value from 0 to 100
     */
    public setProgress(percent: number) {
        this.all(anim => anim.setProgress(percent));
        return this;
    }

    /**
     * Set the playback speed of an Animation
     */
    public setSpeed(speed: number = 1) {
        this.all(anim => anim.setSpeed(speed));
        return this;
    }

    /**
     * Adds a listener for a given event
     */
    public on(events: TypeAnimationEvents[] | TypeAnimationEvents | TypeEventInput, callback?: TypeListenerCallback | object, scope?: object) {
        scope = scope ?? this;
        this.mainInstance?.on?.(events, callback ?? scope, scope);
        return this;
    }

    /**
     * Removes a listener from an event
     */
    public off(events: TypeAnimationEvents[] | TypeAnimationEvents | TypeEventInput, callback?: TypeListenerCallback | object, scope?: object) {
        scope = scope ?? this;
        this.mainInstance?.off?.(events, callback ?? scope, scope);
        return this;
    }

    /**
     * Call all listeners within an event
     */
    public emit(events: TypeAnimationEvents[] | TypeAnimationEvents | string | any[], ...args: any) {
        this.mainInstance?.emit?.(events, ...args);
        return this;
    }

    /** Returns the Animate options, as JSON  */
    public toJSON(): IAnimationOptions {
        return this.options;
    }

    /**
     * The Symbol.toStringTag well-known symbol is a string valued property that is used
     * in the creation of the default string description of an object.
     * It is accessed internally by the Object.prototype.toString() method.
     */
    get [Symbol.toStringTag]() {
        return `Queue`;
    }
}

/** 
 * Creates a new {@link Queue} instance, and passes the options to the constructor
*/
export const queue = (options: IAnimationOptions = {}) => new Queue(options);