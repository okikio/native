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
 * 
 * @beta WIP
 */
export class Timeline {
    /** 
     * The main Animate instance, it controls playback, speed, and generally cause the AnimateTimeline to move.
    */
    public mainInstance: Animate;

    /** 
     * Stores all Animate instances that are attached to the AnimateTimeline
     */
    public animateInstances: Manager<number, Animate> = new Manager();

    /**
     * The total duration of the mainInstance
     */
    public get totalDuration() { return this.mainInstance.totalDuration; }
    public set totalDuration(value: number) { this.mainInstance.totalDuration = value; }

    /**
     * The maximum duration of the mainInstance
     */
    public get maxDuration() { return this.mainInstance.maxDuration; }
    public set maxDuration(value: number) { this.mainInstance.maxDuration = value; }

    /**
     * The smallest delay out of the mainInstance
     */
    public get minDelay() { return this.mainInstance.minDelay; }
    public set minDelay(value: number) { this.mainInstance.minDelay = value; }

    /**
     * The smallest speed out of the mainInstance
     */
    public get maxSpeed() { return this.mainInstance.maxSpeed; }
    public set maxSpeed(value: number) { this.mainInstance.maxSpeed = value; }

    /**
     * The largest end delay out of the mainInstance
     */
    public get maxEndDelay() { return this.mainInstance.maxEndDelay; }
    public set maxEndDelay(value: number) { this.mainInstance.maxEndDelay = value; }

    /**
     * The timelineOffset of the mainInstance
     */
    public get timelineOffset() { return this.mainInstance.timelineOffset; }
    public set timelineOffset(value: number) { this.mainInstance.timelineOffset = value; }

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
     * Allows a user to add a new Animate instances to an AnimateTimeline
     * @param options - you can add an Animate instance by either using animation options or by adding a pre-existing Animate Instance. 
     * @param timelineOffset - by default the timelineOffset is 0, which means the Animation will play in chronological order of when it was defined; a different value, specifies how many miliseconds off from the chronological order before it starts playing the Animation. You can also use absolute values, for exmple, if you want your animation to start at 0ms, setting timelineOffset to 0, or "0" will use relative offsets, while using "= 0" will use absolute offsets. Read more on {@link relativeTo}
     */
    public add(options: IAnimationOptions | Animate = {}, timelineOffset: string | number = 0) {
        let newInst: Animate | Timeline;
        let insParams: IAnimationOptions = Object.assign({}, DefaultAnimationOptions, this.initialOptions,
            options instanceof Animate ? options.initialOptions : parseOptions(options));

        insParams.timelineOffset = relativeTo(timelineOffset, this.totalDuration);
        insParams.autoplay = this.initialOptions.autoplay;

        if (options instanceof Animate) {
            newInst = options;
            newInst.updateOptions(insParams);
        } else newInst = new Animate(insParams);

        this.animateInstances.add(newInst);
        this.updateTiming();

        return this;
    }

    /** Update the timeline's duration, endDelay, etc... based on the `animateInstances` */
    public updateTiming() {
        let timings = this.animateInstances.values();
        let duration = Math.max(...timings.map(x => x.totalDuration));
        this.mainInstance.updateOptions({
            autoplay: this.initialOptions.autoplay,
            duration,
            delay: Math.max(...timings.map(x => x.minDelay)),
            endDelay: duration - Math.max(...timings.map(x => x.totalDuration - x.maxEndDelay)),
        });

        return this;
    }

    /** 
     * Remove an Animate instance from the AnimateTimeline using it's index in animateInstances
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
        return `AnimateTimeline`;
    }
}

export const timeline = (options: IAnimationOptions = {}) => new Timeline(options);