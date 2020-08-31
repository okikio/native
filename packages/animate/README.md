# Animate

An animation library for the modern web, it utilizes the Web Animation API (WAAPI) that's partially where it gets its name from. Inspired by animate plus, and animejs; animate is a Javascript animation library focusing on performance and ease of use. It aims to deliver butter smooth animations at a small size, it weighs less than 3 KB (minified and compressed).

_Before even getting started, note you will most likely need a WAAPI polyfill and if you install this via `npm` you are most likely going to need [rollup](https://rollupjs.org/). You can use [web-animations-js](https://github.com/web-animations/web-animations-js), or [polyfill.io](https://polyfill.io/), to create a polyfill._

## Table of Contents
- [Animate](#animate)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Getting started](#getting-started)
  - [Options](#options)
    - [target](#target)
    - [easing](#easing)
    - [duration](#duration)
    - [delay](#delay)
    - [endDelay](#enddelay)
    - [loop](#loop)
    - [onfinish](#onfinish)
    - [autoplay](#autoplay)
    - [direction](#direction)
    - [speed](#speed)
    - [fillMode](#fillmode)
    - [options](#options-1)
  - [Animations](#animations)
  - [Methods as Properties](#methods-as-properties)
  - [Promises](#promises)
  - [Additional methods](#additional-methods)
    - [on, off, and emit](#on-off-and-emit)
    - [play, pause, and reset](#play-pause-and-reset)
    - [The long list of Get Methods](#the-long-list-of-get-methods)
    - [The almost as long list of Set Methods; these methods are chainable](#the-almost-as-long-list-of-set-methods-these-methods-are-chainable)
    - [then, catch, and finally](#then-catch-and-finally)
    - [toJSON](#tojson)
  - [Example](#example)
  - [Browser support](#browser-support)
  - [Content delivery networks](#content-delivery-networks)
  - [Best practices (from Animate Plus, but they are true for all Animation libraries)](#best-practices-from-animate-plus-but-they-are-true-for-all-animation-libraries)

## Installation
You can install Animate from `npm` via `npm i @okikio/animate` or `yarn add @okikio/animate`. You can use Animate on the web via [unpkg](https://unpkg.com/@okikio/animate@latest/lib/api.umd.js) `https://unpkg.com/@okikio/animate@latest/lib/api.umd.js`, [skypack](https://cdn.skypack.dev/@okikio/animate) `https://cdn.skypack.dev/@okikio/animate` or [jsdelivr](https://cdn.jsdelivr.net/npm/@okikio/animate@latest/lib/api.umd.js) `https://cdn.jsdelivr.net/npm/@okikio/animate@latest/lib/api.umd.js`.

Once installed it can be used like this:
```javascript
import { animate } from "@okikio/animate";
import { animate } from "https://unpkg.com/@okikio/animate@latest/lib/api.mjs";
import { animate } from "https://cdn.jsdelivr.net/npm/@okikio/animate@latest/lib/api.mjs";
// Or
import { animate } from "https://cdn.skypack.dev/@okikio/animate";

// Via script tag
<script src="https://unpkg.com/@okikio/animate@latest/lib/api.umd.js"></script>
// Do note, on the web you need to do this, if you installed it via the script tag:
const { animate } = window.Animate;
```

## Getting started

```javascript
import animate from "@okikio/animate";

// Do note, on the web you need to do this, if you installed it via the script tag:
// const { animate } = window.Animate;

animate({
    target: ".div",
    /* NOTE: If you turn this on you have to comment out the transform property. The keyframes property is a different format for animation you cannot you both styles of formatting in the same animation */
    // keyframes: [
    //     { transform: "translateX(0px)" },
    //     { transform: "translateX(300px)" }
    // ],
    transform: ["translateX(0px)", "translateX(300px)"],
    easing: "out",
    duration(i) {
        return (i + 1) * 500;
    },
    loop: 1,
    speed: 2,
    fillMode: "both",
    direction: "normal",
    delay(i) {
        return (i + 1) * 100;
    },
    autoplay: true,
    endDelay(i) {
        return (i + 1) * 100;
    },
}).then((options) => {
    animate({
        options,
        transform: ["translateX(300px)", "translateX(0px)"],
    });
});
```

[Preview this example &#8594;](https://codepen.io/okikio/pen/mdPwNbJ?editors=0010)

## Options

### target

| Default | Type                                                                     |
| :------ | :----------------------------------------------------------------------- |
| `null`  | string \| Node \| NodeList \| HTMLCollection \| HTMLElement[] \| Array[] |

Determines the DOM elements to animate. You can either pass it a CSS selector or DOM elements.

```javascript
animate({
    target: document.body.children,
    transform: ["rotate(0turn)", "rotate(1turn)"],
});
```

### easing

| Default | Type               |
| :------ | :----------------- |
| `ease`  | String \| Function |

Determines the acceleration curve of your animation.
Based on the easings of [easings.net](https://easings.net)

| constant | accelerate | decelerate | accelerate-decelerate |
| :------- | :--------- | :--------- | :-------------------- |
| linear   | in-cubic   | out-cubic  | in-out-cubic          |
| ease     | in-quart   | out-quart  | in-out-quart          |
|          | in-quint   | out-quint  | in-out-quint          |
|          | in-expo    | out-expo   | in-out-expo           |
|          | in-circ    | out-circ   | in-out-circ           |
|          | in-back    | out-back   | in-out-back           |

You can create your own custom cubic-bezier easing curves. Similar to css you type `cubic-bezier(...)` with 4 numbers representing the shape of the bezier curve, for example, `cubic-bezier(0.47, 0, 0.745, 0.715)` this is the bezier curve for `in-sine`

```javascript
// cubic-bezier easing
animate({
    target: ".div",
    easing: "cubic-bezier(0.47, 0, 0.745, 0.715)",
    transform: ["translate(0px)", "translate(500px)"],
});
```

### duration

| Default | Type               |
| :------ | :----------------- |
| `1000`  | Number \| Function |

Determines the duration of your animation in milliseconds. By passing it a callback, you can define a different duration for each element. The callback takes the index of each element as its argument and returns a number.

```javascript
// First element fades out in 1s, second element in 2s, etc.
animate({
    target: "span",
    easing: "linear",
    duration: (index) => (index + 1) * 1000,
    opacity: [1, 0],
});
```

### delay

| Default | Type               |
| :------ | :----------------- |
| `0`     | Number \| Function |

Determines the delay of your animation in milliseconds. By passing it a callback, you can define
a different delay for each element. The callback takes the index of each element as its argument
and returns a number.

```javascript
// First element starts fading out after 1s, second element after 2s, etc.
animate({
    target: "span",
    easing: "linear",
    delay: (index) => (index + 1) * 1000,
    opacity: [1, 0],
});
```

### endDelay

| Default | Type               |
| :------ | :----------------- |
| `0`     | Number \| Function |

Similar to delay but it indicates the number of milliseconds to delay after the full animation has played not before.

```javascript
// First element fades out but then after 1s finishes, the second element after 2s, etc.
animate({
    target: "span",
    easing: "linear",
    endDelay: (index) => (index + 1) * 1000,
    opacity: [1, 0],
});
```

### loop

| Default | Type                          |
| :------ | :---------------------------- |
| `1`     | Boolean \| Number \| Function |

Determines if the animation should repeat, and how many times it should repeat.

```javascript
// Loop forever
animate({
    target: "span",
    easing: "linear",
    loop: true,
    opacity: [1, 0],
});
```

### onfinish

| Default                                                      | Type     |
| :----------------------------------------------------------- | :------- |
| `(element: HTMLElement, index: number, total: number) => {}` | Function |

Occurs when the animation for one of the elements completes, meaning when animating many elements that finish at different time this will run multiple times. The method it takes is slightly different.

```javascript
// Avoid using fillMode, use this instead to commit style changes
// Do note endDelay delays the onfinish method
animate({
    target: "span",
    opacity: [0, 1],

    // Note the order of the arguments, it's different from other properties
    onfinish(element, index, total) {
        element.style.opacity = 0;
        console.log(
            `${
                index + 1
            } out of ${total}, elements have finished their animations.`
        );
    },
});
```

### autoplay

| Default | Type                |
| :------ | :------------------ |
| `true`  | Boolean \| Function |

Determines if the animation should automatically play, immediately after being instantiated.

### direction

| Default  | Type               |
| :------- | :----------------- |
| `normal` | String \| Function |

Determines the direction of the animation; `reverse` runs the animation backwards, `alternate` switches direction after each iteration if the animation loops. `alternate-reverse` starts the animation at what would be the end of the animation if the direction were `normal` but then when the animation reaches the beginning of the animation it alternates going back to the position it started at.

### speed

| Default | Type               |
| :------ | :----------------- |
| `1`     | Number \| Function |

Determines the animation playback rate. Useful in the authoring process to speed up some parts of a
long sequence (value above 1) or slow down a specific animation to observe it (value below 1).

### fillMode

| Default | Type               |
| :------ | :----------------- |
| `auto`  | String \| Function |

_Be careful when using fillMode, it has some problems when it comes to concurrency of animations read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/fill), if browser support were better I would remove fillMode and use Animation.commitStyles, I'll have to change the way `fillMode` functions later. Use the onfinish method to commit styles [onfinish](#onfinish)._

Defines how an element should look after the animation. `none` the animation's effects are only visible while the animation is playing. `forwards` the affected element will continue to be rendered in the state of the final animation frame. `backwards` the animation's effects should be reflected by the element(s) state prior to playing. `both` combining the effects of both forwards and backwards: The animation's effects should be reflected by the element(s) state prior to playing and retained after the animation has completed playing. `auto` if the animation effect fill mode is being applied to is a keyframe effect. "auto" is equivalent to "none". Otherwise, the result is "both". Uou can learn more here on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/fill).

### options

| Default | Type   |
| :------ | :----- |
| `{}`    | Object | Animation |

Another way to input options for an animation, it's also used to chain animations. Do note you can't use the property as a method.

## Animations

Animate lets you animate HTML and SVG elements with any property that takes numeric values, including hexadecimal colors.

```javascript
// Animate the radius and fill color of an SVG circle
animate({
    target: "circle",
    r: [0, 50],
    fill: ["#80f", "#fc0"],
});
```

Each property you animate needs an array defining the start and end values, or an Array of keyframes.

```javascript
animate({
    target: "span",
    transform: ["translate(0px)", "translate(1000px)"],
});

// Or
// Same as ["translate(0px)", "translate(100px)"]
animate({
    target: "span",
    keyframes: [
        { transform: "translate(0px)" },
        { transform: "translate(100px)" },
    ],
});
```

Do note you can only use one of these formats for an animation, and if Animate sees the `keyframes` property, it ignores all other css properties, it will still accept animation properties like `easing`, `duration`, etc...

These arrays can optionally be returned by a callback that takes the index of each element, the total number of elements, and each specific element, just like with other properties.

```javascript
// First element translates by 100px, second element by 200px, etc.
animate({
    target: "span",
    transform(index) {
        return ["translate(0px)", `translate(${(index + 1) * 100}px)`];
    },
});

// Or
// Same as above
animate({
    target: "span",
    keyframes(index) {
        return [
            { transform: "translate(0px)" },
            { transform: `translate(${(index + 1) * 100}px)` },
        ];
    },
});
```

## Methods as Properties

All properties except `target` can be represented by a method with the arguments`(index: number, total: number, element: HTMLElement)`. Do note, `keyframes` can also be a method.

```javascript
/**
 * @param {number} [index] - index of each element
 * @param {number} [total] - total number of elements
 * @param {HTMLElement} [element] - the target element
 * @returns {any}
 */

// For example
animate({
    target: "span",
    opacity(index, total, element) {
        console.log(element);
        return [0, (index + 1) / total];
    },
});
```

## Promises

`animate()` returns a promise which resolves once the animation finishes. The promise resolves to the options initially passed to `animate()`, making animation chaining straightforward and convenient. The [Getting started](#getting-started) section gives you a basic promise example.

Since Animate relies on native promises, you can benefit from all the usual features promises
provide, such as `Promise.all`, `Promise.race`, and especially `async/await` which makes animation
timelines easy to set up.

```javascript
const play = async () => {
    const options = await animate({
        target: "span",
        duration: 3000,
        transform: ["translateY(-100vh)", "translateY(0vh)"],
    });

    await animate({
        options,
        transform: ["rotate(0turn)", "rotate(1turn)"],
    });

    await animate({
        options,
        duration: 800,
        easing: "in-quint",
        transform: ["scale(1)", "scale(0)"],
    });
};

play();
```

## Additional methods

### on, off, and emit

These methods are inherited from [@okikio/emitter](https://www.npmjs.com/package/@okikio/emitter). They control events and their listeners.

```javascript
import { animate } from "@okikio/animate";

let anim = animate({
    target: "span",
    easing: "linear",
    duration: (index) => 8000 + index * 200,
    loop: true,
    transform: ["rotate(0deg)", "rotate(360deg)"],
});

// For more info. on what you can do with the Event Emitter go to [https://www.npmjs.com/package/@okikio/emitter],
// I implemented the `on`, `off`, and `emit` methods from the Event Emitter on Animate.
anim.on("finish", () => {
    console.log("Finished");
})
    .on("change tick", (progress) => {
        console.log(
            "Runs every animation frame while the animation is running and not paused."
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
    });
```

### play, pause, and reset

They are self explanatory, the `play/pause` methods play/pause animation, while the `reset` method resets the progress of an animation.

### The long list of Get Methods

-   `getAnimation(element: HTMLElement)` - Allows you to select a specific animation from an element
-   `getDuration()` - Returns the total duration of the animation of all elements added together
-   `getCurrentTime()` - Returns the current time of the animation of all elements
-   `getProgress()` - Returns the progress of the animation of all elements as a percentage between 0% to 100%.
-   `getPlayState()` - Returns the current playing state, it can be `"idle" | "running" | "paused" | "finished"`
-   `getSpeed()` - Return the playback speed of the animation
-   `getOptions()` - Returns the options that were used to create the animation

### The almost as long list of Set Methods; these methods are chainable

-   `setCurrentTime(time: number)` - Sets the current time of the animation
-   `setProgress(percent: number)` - Similar to `setCurrentTime` except it use a number between 0 and 1 to set the current progress of the animation
-   `setSpeed(speed: number = 1)` - Sets the playback speed of an animation

### then, catch, and finally

They represent the then, catch, and finally methods of a Promise that is resolved when an animation has finished. It's also what allows the use of the `await/async` keywords for resolving animations.

### toJSON

An alias for `getOptions`

## Example
[![Web Animation API Library Playground](/assets/Web%20Animation%20API%20Library%20Playground.png)](/assets/Web%20Animation%20API%20Library%20Playground.mp4)

[Check out the example on Codepen  &#8594;](https://codepen.io/okikio/pen/qBbdGaW?editors=0010)

## Browser support

Animate is provided as a native ES6 module, which means you may need to transpile it depending on your browser support policy. The library works using `<script type="module">` in
the following browsers:

-   Chrome 61
-   Edge 16
-   Firefox 60

## Content delivery networks

Animate is available on [unpkg](https://unpkg.com/@okikio/animate@latest/lib/api.umd.js) `https://unpkg.com/@okikio/animate@latest/lib/api.umd.js`, [skypack](https://cdn.skypack.dev/@okikio/animate) `https://cdn.skypack.dev/@okikio/animate` or [jsdelivr](https://cdn.jsdelivr.net/npm/@okikio/animate@latest/lib/api.umd.js) `https://cdn.jsdelivr.net/npm/@okikio/animate@latest/lib/api.umd.js`.

```javascript
// Notice the .mjs file name extension, that represents ES Modules
// There is also,
//      .mjs - Modern ES Module
//      .umd.js - Normal UMD Module
//      .js - The Fresh JS, uses IIFE.
import { animate } from "https://cdn.skypack.dev/@okikio/animate";

animate({
    target: "div",
    transform: ["translate(0%)", 100],
});
```

## Best practices (from Animate Plus, but they are true for all Animation libraries)

Animations play a major role in the design of good user interfaces. They help connecting actions to consequences, make the flow of interactions manifest, and greatly improve the polish and perception of a product. However, animations can be damaging and detrimental to the user experience if they get in the way. Here are a few best practices to keep your animations effective and enjoyable:

-   **Speed**: Keep your animations fast. A quick animation makes a software feel more productive and responsive. The optimal duration depends on the effect and animation curve, but in most cases you should likely stay under 500 milliseconds.
-   **Easing**: The animation curve contributes greatly to a well-crafted animation. The easing "out" option is usually a safe bet as animations kick off promptly, making them react to user interactions instantaneously.
-   **Performance**: Having no animation is better than animations that stutter. When animating HTML elements, aim for using exclusively `transform` and `opacity` as these are the only properties browsers can animate cheaply.
-   **Restraint**: Tone down your animations and respect user preferences. Animations can rapidly feel overwhelming and cause motion sickness, so it's important to keep them subtle and to attenuate them even more for users who need reduced motion, for example by using `matchMedia("(prefers-reduced-motion)")` in JavaScript.
