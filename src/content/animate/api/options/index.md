## Options

Animation options control how an animation is produced, it shouldn't be too different for those who have used `animejs`, or `jquery`'s animate method.

An animation option is an object with keys and values that are computed and passed to the `Animate` class to create animations that match the specified options.

The default options are:

```ts
export const DefaultAnimationOptions: AnimationOptions = {
    keyframes: [],

    loop: 1, // iterations: number,
    delay: 0,
    speed: 1,
    endDelay: 0,
    easing: "ease",
    autoplay: true,
    duration: 1000,

    persist: true,
    fillMode: "none",

    direction: "normal",
    padEndDelay: true,
    extend: {}
};
```

The options themselves are,

### [target(s)](/docs/animate/api/options/target.md)

Determines the DOM elements to animate. You can pass it a CSS selector, DOM elements, or an Array of DOM Elements and/or CSS Selectors.

### [easing](/docs/animate/api/options/easing.md)

Determines the acceleration curve of your animation. Based on the easings of [easings.net](https://easings.net).

### [duration](/docs/animate/api/options/duration.md)

Determines the duration of your animation in milliseconds. By passing it a callback, you can define a different duration for each element. The callback takes the index of each element, the target dom element, and the total number of target elements as its argument and returns a number.

### [delay](/docs/animate/api/options/delay.md)

Determines the delay of your animation in milliseconds. By passing it a callback, you can define a different delay for each element. The callback takes the index of each element, the target dom element, and the total number of target elements as its argument and returns a number.

### [timelineOffset](/docs/animate/api/options/timeline-offset.md)

Adds an offset ammount to the `delay`, for creating a timeline similar to `animejs`.

### [endDelay](/docs/animate/api/options/end-delay.md)

Similar to delay but it indicates the number of milliseconds to delay **after** the full animation has played **not before**.

### [padEndDelay](/docs/animate/api/options/pad-end-delay.md)

This ensures all `animations` match up to the total duration, and don't finish too early, if animations finish too early when the `.play()` method is called specific animations  that are finished will restart while the rest of the animations will continue playing.

### [loop](/docs/animate/api/options/loop.md)

Determines if the animation should repeat, and how many times it should repeat.

### [onfinish](/docs/animate/api/options/onfinish.md)

Occurs when the animation for one of the targets completes, meaning when animating many targets that finish at different times this will run multiple times. The arguments it takes is slightly different from the rest of the animation options.

### [oncancel](/docs/animate/api/options/oncancel.md)

Occurs when the animation for one of the targets is cancelled, meaning when animating many targets that are cancelled at different times this will run multiple times. The arguments it takes is slightly different from the rest of the animation options.

### [autoplay](/docs/animate/api/options/autoplay.md)

Determines if the animation should automatically play immediately after being instantiated.

### [direction](/docs/animate/api/options/direction.md)

Determines the direction of the animation.

### [speed](/docs/animate/api/options/speed.md)

Determines the animation playback rate. Useful in the authoring process to speed up some parts of a long sequence (value above 1) or slow down a specific animation to observe it (value between 0 to 1).

### [fillMode](/docs/animate/api/options/fill-mode.md)

Defines how an element should look after the animation.

### [persist](/docs/animate/api/options/persist.md)

Persists animation state, so, when an animation is complete it keeps said finished animation state. Think of it more like a less strict version of [fillMode](/docs/animate/api/options/fill-mode.md), it was inspired by [motion one](https://motion.dev/).

### [options](/docs/animate/api/options/options.md)

Another way to input options for an animation, it's also used to chain animations.

### [offset](/docs/animate/api/options/offset.md)

Contols the starting point of certain parts of an animation.

### [timeline](/docs/animate/api/options/timeline.md)

Represents the timeline of animation. It exists to pass timeline features to Animations (default is [DocumentTimeline](https://developer.mozilla.org/en-US/docs/Web/API/DocumentTimeline)).

### [keyframes](/docs/animate/api/options/keyframes.md)

Allows you to manually set keyframes using a `keyframe` array.

### [composite](/docs/animate/api/options/composite.md)

 The `composite` property of a `KeyframeEffect` resolves how an element's animation impacts its underlying property values.

### [extend](/docs/animate/api/options/extend.md)

The properties of the `extend` animation option are not interperted or computed, they are given directly to the `Web Animation API`, as way to access features that haven't been implemented in `@okikio/animate`, for example, `iterationStart`.
