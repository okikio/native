---
layout: layout:PagesLayout
---
## Methods & properties

### mainAnimation: Animation

Stores an animation that runs on the total duration of all the `Animation` instances, and as such it's the main Animation.

### targetIndexes: WeakMap<Node, number>

The indexs of target Elements in Animate

### keyframeEffects: WeakMap<HTMLElement, KeyframeEffect>

A WeakMap of KeyFrameEffects

### computedOptions: WeakMap<HTMLElement, TypeComputedOptions>

The computed options for individual animations
A WeakMap that stores all the fully calculated options for individual Animation instances.

_**Note**: the computedOptions are changed to their proper Animation instance options, so, some of the names are different, and tions that can't be computed are not present. E.g. fillMode in the animation options is now just fill in the computedOptions._

_**Note**: keyframes are not included, both the array form and the object form; the options, speed, extend, padEndDelay, and autoplay animation options are not included_

### animations: WeakMap<KeyframeEffect, Animation>

A WeakMap of Animations

### computedKeyframes: WeakMap<HTMLElement, TypeKeyFrameOptionsType> = new WeakMap()

The keyframes for individual animations

A WeakMap that stores all the fully calculated keyframes for individual Animation instances.

_**Note**: the computedKeyframes are changed to their proper Animation instance options, so, some of the names are different, and options that can't be computed are not present. E.g. translateX, skew, etc..., they've all been turned into the transform property._

### minDelay: number

The smallest delay out of all `Animation`'s, it is zero by default.

### maxSpeed: number

The smallest speed out of all `Animation`'s, it is zero by default.

### on(...), off(...), and emit(...)

These methods are inherited from [@okikio/emitter](https://www.npmjs.com/package/@okikio/emitter). They control events and their listeners. The only difference is that by default their scopes are set to the instance of `Animate`.

```ts
import { animate } from "@okikio/animate";

let anim = animate({
    target: ".div",
    easing: "linear",
    duration: (index) => 8000 + index * 200,
    loop: true,
    transform: ["rotate(0deg)", "rotate(360deg)"],
});

// For more info. on what you can do with the Event Emitter go to [https://www.npmjs.com/package/@okikio/emitter],
// I implemented the `on`, `off`, and `emit` methods from the Event Emitter on `Animate`.
anim.on("complete", () => {
    console.log("completed");
})
    // This is a built in event
    .on("update", (progress) => {
        console.log(
            "It runs every animation frame while the animation is running and not paused."
        );
        console.log(`Progress ${progress}%`); // Eg: Progress 10%
    })
    .on({
        play() {
            console.log("When the animation is played");
        },
        pause() {
            anim.emit("Cool");
            console.log("When the animation is paused");
        },
        cool() {
            console.log("The cool event isn't a built in event, but it will fire when the Animation is paused.");
        }
    });
```

### is(playstate: TypePlayStates)

Returns a boolean determining if the `animate` instances playstate is equal to the `playstate` parameter

### play(), pause(), reverse(), and reset()

They are self explanatory, the `play/pause` methods play/pause animation, the `reverse` method causes all animation to reverse directions, while the `reset` method resets the progress of an animation.

### The long list of Get Methods

#### `getAnimation(target: HTMLElement): Animation`

Allows you to select a specific animation from an element

#### `getTiming(value: HTMLElement | Animation): EffectTiming | AnimationOptions`

Returns the timings of an Animation, given a target.
E.g. \{ duration, endDelay, delay, iterations, iterationStart, direction, easing, fill, etc... \}

#### `getCurrentTime(): number`

Returns the current time of the animation of all elements

#### `getProgress(): number`

Returns the progress of the animation of all elements as a percentage between 0 to 100.

#### `getPlayState(): string`

Returns the current playing state, it can be `"idle" | "running" | "paused" | "finished"`

#### `getSpeed(): number`

Return the playback speed of the animation

### The almost as long list of Set Methods; these methods are chainable

#### `setCurrentTime(time: number)`

Sets the current time of the animation

#### `setProgress(percent: number)`

Similar to `setCurrentTime` except it use a number between 0 and 100 to set the current progress of the animation

#### `setSpeed(speed: number = 1)`

Sets the playback speed of an animation

### then(...), catch(...), and finally(...)

They represent the then, catch, and finally methods of a Promise that is resolved when an animation has finished. It's also what allows the use of the `await/async` keywords for resolving animations. The `then` method resolves to the Animations Options, which can then be passed to other `Animate` instances to create animations with similar properties. Then, catch, and finally are chainable, they return the `Animate` class.

### toJSON()

An alias for [options](/docs/api/classes/animate.animate-1.md#options)

### all(method: (animation: Animation, target?: HTMLElement) => void)

Calls a method that affects all animations including the mainAnimation; the method only allows the animation parameter

For example,

```ts
// This is a small snippet from the setCurrentTime() method
this.all((animation: Animation) => {
    animation.currentTime = 5;
});
```

### finish()

Forces all Animations to finish, and triggers the `finish` event.

### cancel()

Cancels all Animations, it just runs the cancel method from each individual animation including the mainAnimation; it triggers the `cancel` event.

### stop()

Cancels all Animations and de-references them, allowing them to be garbage collected in a rush. It also emits a `stop` event to alert you to the animation stopping.

The `stop` method is not chainable.

_**Warning**: if you try to reference properties from the `Animate` class after stop has been called many things will break. The `Animate` class cannot and will not recover from stop, it is meant as a final trash run of animations, don't use it if you think you may restart the animation._