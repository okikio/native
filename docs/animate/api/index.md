
## API Documentation

### Animations

```ts
// Animate the fill color of an SVG circle
animate({
    target: "circle",
    fill: ["#80f", "#fc0"],
});
```

`@okikio/animate` creates animations by creating instances of the [Animate class](/docs/api/classes/_okikio_animate.Animate.md) (a class that acts as a wrapper around the Web Animation API). 

_To create new instances of the `Animate` class, you can either import the `Animate` class and do this, `new Animate({ ... })` or import the `animate` (lowercase) method and do this, `animate({ ... })`. The `animate` method creates new instances of the `Animate` class and passes the options it recieves as arguments to the `Animate` class._

```ts
import { Animate, animate } from "@okikio/animate";

new Animate({
  target: [/* ... */],
  duration: 2000,
  // ... 
});

// or

animate({
  target: [/* ... */],
  duration: 2000,
  // ... 
});
```

> **Info**: `@okikio/animate` lets you animate HTML and SVG elements with any CSS property that is [animatable](/docs/animate/limitations.md#css--svg-animations-support), you might be surprised to learn many CSS properties fall under this perview, including `display` and `visibility`. 

The `Animate` class recieves a set of [targets](/docs/animate/api/options/target.md) to animate, it then creates a list of `Animation` instances corrosponding to the respective target elements. In order to determine when all target animations are complete, the `Animate` class also creates a main `Animation` instance. The main `Animation` instance plays for the total duration of all target animations, and alerts the user when all target animations have completed. 

Target animations are stored in `Animate.prototype.animations: WeakMap<KeyframeEffect, Animation>`, using their [KeyframeEffect](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect) as the key, while the the main animation is stored in `Animate.prototype.mainAnimation: Animation`. You can actually access the animation for a specific target using `Animate.prototype.getAnimation(target: HTMLElement): Animation`, meaning you aren't limited by what `@okikio/animate` provides, you can use the WAAPI api's you know and love directly.

> _**Note**: `Animation` instances come from the `Animation` class of the Web Animations API. The `Animation` class represents a single animation player and provides playback controls and a timeline for an animation node or source, [Read more...](https://developer.mozilla.org/en-US/docs/Web/API/Animation)_

Each property you animate needs an array defining the start and end values, or an Array of keyframes.

> _**Info**: `Implicit to/from keyframes` are now supported in all [evergreen browsers](https://www.techopedia.com/definition/31094/evergreen-browser), In newer browser versions, you are able to set a beginning or end state for an animation only (i.e. a single keyframe), and the browser will infer the other end of the animation if it is able to. [Read more...](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats#implicit_tofrom_keyframes)_

```ts
animate({
    target: ".div",
    transform: ["translate(0px)", "translate(1000px)"],
});

// Or
animate({
    target: ".div",
 
    // This is the same as ["translate(0px)", "translate(100px)"]
    keyframes: [
        { transform: "translate(0px)" },
        { transform: "translate(100px)" },
    ],
});
```

> _**Note**: you can only use one of these formats for an animation, and if `Animate` sees the `keyframes` property, it ignores all other css properties, in situations where `Animate` sees the keyframes property it will still accept animation properties like `easing`, `duration`, etc..._

These value arrays can optionally be returned by an [animation option method](/docs/animate/api/animation-options-as-methods.md) that takes the index of each element, the total number of elements, and each specific element, just like with other properties.

```ts
// First element translates by 100px, second element by 200px, etc.
animate({
    target: ".div",
    transform(index) {
        return ["translate(0px)", `translate(${(index + 1) * 100}px)`];
    },
});

// Or
// Same as above
animate({
    target: ".div",
    keyframes(index) {
        return [
            { transform: "translate(0px)" },
            { transform: `translate(${(index + 1) * 100}px)` },
        ];
    },
});
```

### Animation Options & CSS Properties as Methods

All options & properties except `target`, `targets`, `autoplay`, `extend`, `onfinish`, and `options` can be represented by a method with the arguments `(index: number, total: number, element: HTMLElement)`....

> [Read more about Animation Option Callback   &#8594;](/docs/animate/api/animation-options-as-methods.md)

### Transformable CSS Properties

By default WAAPI only supports string values with the unit specified for CSS properties to be animated, however, this is generally a bad Developer Experience, so, `@okikio/animate` does some computations on the given Animation Options, allowing you to use single value unitless `numbers`, `strings`, and `arrays`, as well as removing the need for the `transform` CSS property, as it exposes all the [transform functions as CSS properties](/docs/animate/api/transformable-css-properties.md#css-transform-functions-as-css-properties).

> [Learn more about Transformable CSS Properties   &#8594;](/docs/animate/api/transformable-css-properties.md)

### Animation Progress and the requestAnimationFrame

The Web Animation API doesn't allow for keeping track of the progress in a clean way, so, we are forced to use `requestAnimationFrame` to check the current progress of an animation, however, doing, so, can actually decrease framerates, so, I built a system to call `requestAnimationFrame` less often. If you listen for the `update` event on an `Animate` instance, you can get access to this custom framerate `requestAnimationFrame`, so, something like this,

```ts
import { animate, Animate } from "@okikio/animate";
let animation = animate({ /* ... */ });

// By default the "update" event will only run at 60 fps
animation.on("update", () => {
    console.log("update")
});

// You can change the framerate by setting it using 
Animate.FRAME_RATE = 30; // 30 fps
```

> [Read through the request animation frame docs    &#8594;](/docs/animate/api/request-animation-frame.md)

### Promises and Promise-Like

`new Animate()` is promise-like meaning it has `then`, `catch`, and `finally` methods, but `Animate` itself isn't a Promise (this is important to keep in mind when dealing with async/await asynchronous  animations). `Animate`'s `then` resolves once all animations are complete. The promise resolves to an Array with the `Animate` instance being the only element. 

Since `Animate` relies on native promises, you can benefit from all the usual features promises
provide, such as `Promise.all`, `Promise.race`, and especially `async/await` which makes animation timelines easy to set up. 

> *An interesting quirk of Promises is that even though `Animate` is not a Promise, async/await still work with it because it has a `then`, and `catch`.*

Read through the [promises doc](/docs/animate/api/promises.md) to learn how to chain animations using promises.


### Events

There are `8` events in total, they are:

- "update"
- "play"
- "pause"
- "begin"
- "finish"
- "cancel"
- "error"
- "stop"
- "playstate-change"

The events themselves are fairly self explanitory, but to listen for said events you do this,

```ts
animation.on("play", () => {
    // Do something
})
```

`@okikio/animate` uses [@okikio/emitter](https://npmjs.com/@okikio/emitter), read through both [@okikio/emitter's doc](/docs/emitter/index.md) and the [events doc](/docs/animate/api/events.md) to properly learn how events work.


### Custom Easing

Custom Easing is extra complex especially while using WAAPI, and ensuring great performance, but `@okikio/animate` is able to do it. The basic idea is to generate most of the numbers required for the custom easing, and then using WAAPI's ability to linearly interpolate between numbers to do the rest. You can use custom easing like this,

```ts
import { animate, CustomEasing } from "@okikio/animate"; 

animate({
    translateX: CustomEasing([0, 250], {
        easing: "spring(5, 100, 10, 1)",

        // You can change the size of Array for the CustomEasing function to generate  
        numPoints: 200,

        // The number of decimal places to round, final values in the generated Array
        decimal: 5,
    }),

    easing: "linear"
})
```

> Check out a demo of Custom Easing on [Codepen   &#8594;](https://codepen.io/okikio/pen/abJMWNy)

This technique has some benefits and drawbacks, you can learn all about these on the [custom easing doc](/docs/animate/api/custom-easing.md).

### Destroyable Animate

Remove elements and animations from the DOM when the `.stop()` method is called. Read more on the [Destroyable Animate docs](/docs/animate/api/destroyable-animate.md)

### AnimateAttributes & tweenAttr

Create morphing animations using the `tweenAttr` method, read more on the [animate attributes doc](/docs/animate/api/animate-attributes.md).

### Effects

Use pre-made effects in `@okikio/animate`, for example, the `animate.css` effects can be used via [@shoelace-style/animations](https://npmjs.com/@shoelace-style/animations), read the [effects doc](/docs/animate/api/effects.md), to learn more.


### Stagger and Random

### Timeline Class


### Methods & properties

Read through the [methods and properties doc](/docs/animate/api/methods-and-properties.md), to learn some of the most useful and importent methods and properties of `Animate` class.

### Complete API Documentation

Not all available methods and properties are listed here (otherwise this README would be too long), go through the [API documentation](/docs/api/modules/_okikio_animate.md) for the full documented API.