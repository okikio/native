# @okikio/animate

An animation library for the modern web which utilizes the Web Animation API. Inspired by animate plus, and animejs, `@okikio/animate` is a Javascript animation library focusing on performance and ease of use. It aims to deliver butter smooth animations at a small size, it weighs ~2.7 KB (minified and compressed).

*Before even getting started, you will most likely need the Web Animation API polyfill. If you install `@okikio/animate` via `npm` you are most likely going to need [rollup](https://rollupjs.org/) or [esbuild](https://esbuild.github.io/). You can use [web-animations-js](https://github.com/web-animations/web-animations-js), or [polyfill.io](https://polyfill.io/) to create a polyfill. The minimum feature requirement for a polyfill are Maps and a WebAnimations polyfill, e.g. [https://polyfill.io/v3/polyfill.min.js?features=Map%2CWebAnimations](https://polyfill.io/v3/polyfill.min.js?features=Map%2CWebAnimations).*

***Warning**: polyfilling may not fix animation format bugs, e.g. [composite animations](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/composite) don't work on older browsers, so, if you use `polyfill.io` and set it to check if the browser supports the feature before applying the polyfill, your project might encounter errors, as the browser may only have partial support of the Web Animation API.*

***Note**: to properly understand `@okikio/animate`, please read up on the [Web Animation API](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate) on MDN.*





You can play with `@okikio/animate` using Gitpod:


[![Edit with Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/okikio/native)

_Start the dev script by typing into the terminal_

```bash
ultra demo:watch
```

Once Gitpod has booted up, go to the `./build folder` and start tweaking and testing to your hearts content.


## Table of Contents
- [@okikio/animate](#okikioanimate)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Demo](#demo)
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
    - [extend](#extend)
  - [Animations](#animations)
    - [CSS & SVG Animations](#css--svg-animations)
  - [Options & Properties as Methods](#options--properties-as-methods)
  - [Promises and Promise-Like](#promises-and-promise-like)
  - [Events](#events)
  - [Additional methods & properties](#additional-methods--properties)
    - [mainAnimation: Animation](#mainanimation-animation)
    - [animations: Manager<HTMLElement, Animation>](#animations-managerhtmlelement-animation)
    - [computedOptions: Manager<Animation, AnimationOptions>](#computedoptions-manageranimation-animationoptions)
    - [minDelay: number](#mindelay-number)
    - [on(...), off(...), and emit(...)](#on-off-and-emit)
    - [play(), pause(), and reset()](#play-pause-and-reset)
    - [The long list of Get Methods](#the-long-list-of-get-methods)
    - [The almost as long list of Set Methods; these methods are chainable](#the-almost-as-long-list-of-set-methods-these-methods-are-chainable)
    - [then(...), catch(...), and finally(...)](#then-catch-and-finally)
    - [toJSON()](#tojson)
    - [all(method: (animation: Animation) => void)](#allmethod-animation-animation--void)
    - [finish()](#finish)
    - [cancel()](#cancel)
    - [stop()](#stop)
  - [Example](#example)
  - [Browser support](#browser-support)
  - [Content delivery networks](#content-delivery-networks)
  - [Memory Management](#memory-management)
  - [Best practices (these are from Animate Plus, but they are true for all Animation libraries)](#best-practices-these-are-from-animate-plus-but-they-are-true-for-all-animation-libraries)
  - [Contributing](#contributing)
  - [Licence](#licence)

## Installation
You can install `@okikio/animate` from `npm` via `npm i @okikio/animate` or `yarn add @okikio/animate`. You can use `@okikio/animate` on the web via
* [https://unpkg.com/@okikio/animate@latest/lib/api.es.js](https://unpkg.com/@okikio/animate@latest/lib/api.es.js),
* [https://cdn.skypack.dev/@okikio/animate](https://cdn.skypack.dev/@okikio/animate) or
* [https://cdn.jsdelivr.net/npm/@okikio/animate@latest/lib/api.es.js](https://cdn.jsdelivr.net/npm/@okikio/animate@latest/lib/api.es.js).

Once installed it can be used like this:
```javascript
import { animate } from "@okikio/animate";
import { animate } from "https://unpkg.com/@okikio/animate@latest/lib/api.es.js";
import { animate } from "https://cdn.jsdelivr.net/npm/@okikio/animate@latest/lib/api.es.js";
// Or
import { animate } from "https://cdn.skypack.dev/@okikio/animate";

// Via script tag
<script src="https://unpkg.com/@okikio/animate@latest/lib/api.js"></script>
// Do note, on the web you need to do this, if you installed it via the script tag:
const animate = window.animate.default;
// or
const { default: animate } = window.animate;
// or
const { default: anime } = window.animate; // LOL
```

## Demo
I built a small demo showing off the abilities of the `@okikio/animate` library. You can find the files for the demo in the [./build](https://github.com/okikio/native/tree/master/build) folder.


> [Click to view demo &#8594;](https://okikio.github.io/native/demo)

## Getting started

`@okikio/animate` create animations by creating instances of `Animate`, a class that acts as a wrapper around the Web Animation API. To create new instances of the `Animate` class, you can either import the `Animate` class and do this, `new Animate({ ... })` or import the `animate` (lowercase) method and do this, `animate({ ... })`. The `animate` method creates new instances of the `Animate` class and passes the options it recieves as arguments to the `Animate` class.

The `Animate` class recieves a set of targets to animate, it then creates a list of Web Animation API `Animation` instances, along side a main animation, which is small `Animation` instance that is set to animate the opacity of a non visible element, the `Animate` class then plays each `Animation` instances keyframes including the main animation.

The main animation is there to ensure accuracy in different browser vendor implementation of the Web Animation API. The main animation is stored in `Animate.prototype.mainAnimation: Animation`, the other `Animation` instances are stored in a `Manager` (from [@okikio/manager](https://www.npmjs.com/package/@okikio/manager)) `Animate.prototype.animations: Manager<HTMLElement, Animation>`.

```javascript
import animate from "@okikio/animate";

// Do note, on the web you need to do this, if you installed it via the script tag:
// const { animate } = window.animate;

(async () => {
    let [options] = await animate({
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
        autoplay: true,
        delay(i) {
            return (i + 1) * 100;
        },
        endDelay(i) {
            return (i + 1) * 100;
        },
    });

    animate({
        options,
        transform: ["translateX(300px)", "translateX(0px)"],
    });
})();

// or you can use the .then() method
animate({
    target: ".div",
    // NOTE: If you turn this on you have to comment out the transform property. The keyframes property is a different format for animation you cannot you both styles of formatting in the same animation
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
    }
}).then((options) => {
    animate({
        options,
        transform: ["translateX(300px)", "translateX(0px)"]
    });
});
```

[Preview this example &#8594;](https://codepen.io/okikio/pen/mdPwNbJ?editors=0010)

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
    fillMode: "auto",
    direction: "normal",
    extend: {}
};
```

### target

| Default | Type                                                                                                 |
| :------ | :--------------------------------------------------------------------------------------------------- |
| `null`  | AnimationTarget = string \| Node \| NodeList \| HTMLCollection \| HTMLElement[] \| AnimationTarget[] |

Determines the DOM elements to animate. You can pass it a CSS selector, DOM elements, or an Array of DOM Elements and/or CSS Selectors.

```javascript
animate({
    target: document.body.children,
    // or
    // target: ".div",
    // target: document.querySelectorAll(".el"),
    // target: [document.querySelectorAll(".el"), ".div"]",
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

You can create your own custom cubic-bezier easing curves. Similar to css you type `cubic-bezier(...)` with 4 numbers representing the shape of the bezier curve, for example, `cubic-bezier(0.47, 0, 0.745, 0.715)` this is the bezier curve for `in-sine`.

*Note: the `easing` property supports the original values and functions for easing as well, for example, `steps(1)`, and etc... are supported.*

```javascript
// cubic-bezier easing
animate({
    target: ".div",
    easing: "cubic-bezier(0.47, 0, 0.745, 0.715)",
    /* or */
    // easing: "in-sine",
    transform: ["translate(0px)", "translate(500px)"],
});
```


### duration

| Default | Type               |
| :------ | :----------------- |
| `1000`  | Number \| Function |

Determines the duration of your animation in milliseconds. By passing it a callback, you can define a different duration for each element. The callback takes the index of each element, the target dom element, and the total number of target elements as its argument and returns a number.

```javascript
// First element fades out in 1s, second element in 2s, etc.
animate({
    target: ".div",
    easing: "linear",
    duration: (index) => (index + 1) * 1000,
    opacity: [1, 0],
});
```

### delay

| Default | Type               |
| :------ | :----------------- |
| `0`     | Number \| Function |

Determines the delay of your animation in milliseconds. By passing it a callback, you can define a different delay for each element. The callback takes the index of each element, the target dom element, and the total number of target elements as its argument and returns a number.

```javascript
// First element starts fading out after 1s, second element after 2s, etc.
animate({
    target: ".div",
    easing: "linear",
    delay: (index) => (index + 1) * 1000,
    opacity: [1, 0],
});
```

### endDelay

| Default | Type               |
| :------ | :----------------- |
| `0`     | Number \| Function |

Similar to delay but it indicates the number of milliseconds to delay **after** the full animation has played **not before**.

*Note: `endDelay` will delay the `onfinish` method and event, but will not reserve the current state of the CSS animation, if you need to use endDelay you may need to use the `fillMode` property to reserve the changes to the animation target.

```javascript
// First element fades out but then after 1s finishes, the second element after 2s, etc.
animate({
    target: ".div",
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
    target: ".div",
    easing: "linear",
    loop: true,
    // or
    // loop: 5, // If you want the animation to loop 5 times
    opacity: [1, 0],
});
```

### onfinish

| Default                                                                            | Type     |
| :--------------------------------------------------------------------------------- | :------- |
| `(element: HTMLElement, index: number, total: number, animation: Animation) => {}` | Function |

Occurs when the animation for one of the elements completes, meaning when animating many elements that finish at different times this will run multiple times. The method it takes is slightly different.

The animation argument represents the animation for the current element.

**Warning**: the order of the callback's arguments are in a different order, with the target element first, and the index second.

```javascript
// Avoid using fillMode, use this instead to commit style changes
// Do note endDelay delays the onfinish method
animate({
    target: ".div",
    opacity: [0, 1],

    // Note the order of the arguments -- it's different from other properties
    onfinish(element, index, total, animation) {
        element.style.opacity = 0;
        console.log(
            `${
                index + 1
            } out of ${total}, elements have finished their animations. Animation playback speed is ${animation.playbackRate}`
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
long sequence (value above 1) or slow down a specific animation to observe it (value between 0 to 1), don't put negative numbers for speed.

### fillMode

| Default | Type               |
| :------ | :----------------- |
| `auto`  | String \| Function |

_Be careful when using fillMode, it has some problems when it comes to concurrency of animations read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/fill), if browser support were better I would remove fillMode and use Animation.commitStyles, I'll have to change the way `fillMode` functions later. Use the onfinish method to commit styles [onfinish](#onfinish)._

Defines how an element should look after the animation. `none` the animation's effects are only visible while the animation is playing. `forwards` the affected element will continue to be rendered in the state of the final animation frame. `backwards` the animation's effects should be reflected by the element(s) state prior to playing. `both` combining the effects of both forwards and backwards: The animation's effects should be reflected by the element(s) state prior to playing and retained after the animation has completed playing. `auto` if the animation effect fill mode is being applied to is a keyframe effect. "auto" is equivalent to "none". Otherwise, the result is "both". You can learn more here on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/fill).

### options

| Default | Type                           |
| :------ | :----------------------------- |
| `{}`    | Object \| Animate \| Animate[] |

Another way to input options for an animation, it's also used to chain animations.

The `options` animation option is another way to declare options, it can take an instance of `Animate`, a single `Animate` instance in an Array, e.g. `[Animate]` or an object containing animation options.

`options` extends the animation properties of an animation, but more importance is given to the actual animation options object, so, the properties from `options` will be ignored if there is already an animation option with the same name declared.

*Note: you can't use this property as a method.*

```ts
(async () => {
    // animate is Promise-like, as in it has a then() method like a Promise but it isn't a Promise.
    // animate resolves to an Array that contains the Animate instance, e.g. [Animate]
    let [options] = await animate({
        target: ".div",
        opacity: [0, 1],
    });

    animate({
        options,

        // opacity overrides the opacity property from `options`
        opacity: [1, 0],
    });

    console.log(options); //= Animate
})();

// or
(async () => {
    let options = await animate({
        target: ".div",
        opacity: [0, 1],
        duration: 2000,

    });

    // Remeber, the `options` animation option can handle Arrays with an Animate instance, e.g. [Animate]
    // Also, remeber that Animate resolves to an Arrays with an Animate instance, e.g. [Animate]
    // Note: the `options` animation option can only handle one Animate instance in an Array and that is alway the first element in the Array
    animate({
        options,
        opacity: [1, 0],
    });

    console.log(options); //= [Animate]
})();

// or
(async () => {
    let options = {
        target: ".div",
        opacity: [0, 1],
    };

    await animate(options);
    animate({
        options,
        opacity: [1, 0],
    });

    console.log(options); //= { ... }
})();
```

### extend

| Default | Type   |
| :------ | :----- |
| `{}`    | Object |

The properties of the `extend` animation option are not interperted or computed, they are given directly to the Web Animation API, as way to access features that haven't been implemented in `@okikio/animate`, for example, `iterationStart`.

`extend` is supposed to future proof the library if new features are added to the Web Animation API that you want to use, but that has not been implemented yet.

*Note: you can't use this property as a method, neither can it's properties be used as methods.*

*Note: it doesn't allow for declaring animation keyframes, it's just for animation options, and it overrides all other animation options that accomplish the same goal, e.g. `loop` & `iterations`, if iterations is a property of `extend` then `iterations` will override `loop`.*

```ts
animate({
    target: ".div",
    opacity: [0, 1],
    loop: 5,
    extend: {
        iterationStart: 0.5,
        // etc...
        fill: "both", // This overrides fillMode
        iteration: 2 // This overrides loop
    }
});
```

## Animations

`@okikio/animate` lets you animate HTML and SVG elements with any property that takes numeric values, including hexadecimal colors.
The `@okikio/animate` module contains a class that controls animatations called `Animate`. To create new instances of the `Animate` class I created the `animate()` function.

```javascript
// Animate the fill color of an SVG circle
animate({
    target: "circle",
    fill: ["#80f", "#fc0"],
});
```

Each property you animate needs an array defining the start and end values, or an Array of keyframes.

```javascript
animate({
    target: ".div",
    transform: ["translate(0px)", "translate(1000px)"],
});

// Or
// Same as ["translate(0px)", "translate(100px)"]
animate({
    target: ".div",
    keyframes: [
        { transform: "translate(0px)" },
        { transform: "translate(100px)" },
    ],
});
```
*Note: you can only use one of these formats for an animation, and if `Animate` sees the `keyframes` property, it ignores all other css properties, in situations where `Animate` sees the keyframes property it will still accept animation properties like `easing`, `duration`, etc...*

These arrays can optionally be returned by a callback that takes the index of each element, the total number of elements, and each specific element, just like with other properties.

```javascript
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

### CSS & SVG Animations
`Animate` can animate `~197` CSS properties; [MDN Animatable CSS Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties) and `~63` SVG properties; [MDN SVG Presentation Attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation).

The animatable CSS properties are:
* backdrop-filter
* background
* background-color
* background-position
* background-size
* block-size
* border
* border-block-end
* border-block-end-color
* border-block-end-width
* border-block-start
* border-block-start-color
* border-block-start-width
* border-bottom
* border-bottom-color
* border-bottom-left-radius
* border-bottom-right-radius
* border-bottom-width
* border-color
* border-end-end-radius
* border-end-start-radius
* border-image-outset
* border-image-slice
* border-image-width
* border-inline-end
* border-inline-end-color
* border-inline-end-width
* border-inline-start
* border-inline-start-color
* border-inline-start-width
* border-left
* border-left-color
* border-left-width
* border-radius
* border-right
* border-right-color
* border-right-width
* border-start-end-radius
* border-start-start-radius
* border-top
* border-top-color
* border-top-left-radius
* border-top-right-radius
* border-top-width
* border-width
* bottom
* box-shadow
* caret-color
* clip
* clip-path
* color
* [etc...](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties)


The animatable SVG properties are:
* alignment-baseline
* baseline-shift
* clip
* clip-path
* clip-rule
* color
* color-interpolation
* color-interpolation-filters
* color-profile
* color-rendering
* cursor
* direction
* display
* dominant-baseline
* enable-background
* fill
* fill-opacity
* fill-rule
* filter
* flood-color
* flood-opacity
* font-family
* font-size
* font-size-adjust
* font-stretch
* font-style
* font-variant
* font-weight
* letter-spacing
* lighting-color
* marker-end
* marker-mid
* marker-start
* mask
* opacity
* overflow
* pointer-events
* shape-rendering
* solid-color
* solid-opacity
* stop-color
* stop-opacity
* stroke
* stroke-dasharray
* stroke-dashoffset
* stroke-linecap
* stroke-linejoin
* stroke-miterlimit
* stroke-opacity
* stroke-width
* text-anchor
* text-decoration
* text-rendering
* transform
* vector-effect
* visibility
* word-spacing
* writing-mode
* [etc...](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation)

Unfortunately, morphing SVG paths via the `d` property isn't supported yet as browsers don't yet support it, and there are other limitations to what the Web Animation API will allow 😭 :sob:, these limitation are covered in detail by an article published by Adobe about [the current state of SVG animation on the web](https://blog.adobe.com/en/publish/2015/06/05/the-state-of-svg-animation.html#gs.pihpjw).
## Options & Properties as Methods

All options & properties except `target`, `speed`, `autoplay`, `extend`, `onfinish`, and `options` can be represented by a method with the arguments `(index: number, total: number, element: HTMLElement)`.

*Note: the `keyframes` option **can** be a method*.

```javascript
/**
 * @param {number} [index] - index of each element
 * @param {number} [total] - total number of elements
 * @param {HTMLElement} [element] - the target element
 * @returns {any}
 */

// For example
animate({
    target: ".div",
    opacity(index, total, element) {
        console.log(element);
        return [0, (index + 1) / total];
    },
    duration(index, total) {
        return 200 + (500 * (index + 1) / total);
    }
});
```

## Promises and Promise-Like

`animate()` is promise-like meaning it has `then`, `catch`, and `finally` methods, but `Animate` itself isn't a Promise (this is important to keep in mind when dealing with async/await asynchronous  animations). `Animate`'s `then` resolves once all animations are complete. The promise resolves to an Array with the `Animate` instance being the only element, but the `options` animation option can use the options of another `Animate` instance allowing animation chaining to be straightforward and convenient. The [Getting started](#getting-started) section gives a basic example.

Since `Animate` relies on native promises, you can benefit from all the usual features promises
provide, such as `Promise.all`, `Promise.race`, and especially `async/await` which makes animation timelines easy to set up.


> *An interesting quirk of Promises is that even though `Animate` is not a Promise, async/await still work with it because it has a `then`, and `catch`.*

*Warning: `then`, `catch`, and `finally` are not resetable, however, the `Animate.prototype.on("complete", ...)` event is, meaning if you reset an animation while the using `then`, `catch`, and `finally`, they will **not** fire again after the reset.*


For example,
```ts
animate({
    target: ".div",
    duration: 3000,
    transform: ["translateY(-100vh)", "translateY(0vh)"],
});

// This will only run once
/*
    Note that the AnimateInstance is in an Array when it is resolved,
    this is due to Promises not wanting to resolve references,
    so, you can't resolve the `this` keyword directly.
    I chose to resolve `this` in an Array as it seemed like the best alternative
*/
.then(( [AnimateInstance] ) => {
    console.log(`${getProgress()}`%);
    AnimateInstance.reset();
});

// or
(async () => {
    const [AnimateInstance] = await animate({
        target: ".div",
        duration: 3000,
        transform: ["translateY(-100vh)", "translateY(0vh)"],
    });

    await animate({
        options: AnimateInstance,
        transform: ["rotate(0turn)", "rotate(1turn)"],
    });

    await animate({
        options: AnimateInstance,
        duration: 800,
        easing: "in-quint",
        transform: ["scale(1)", "scale(0)"],
    });
})();
```
## Events
There are `8` events in total, they are:
* "update"
* "play"
* "pause"
* "begin"
* "complete"
* "finish"
* "error"
* "stop"


```ts
// The update event is triggered continously while an animation is playing.
....on("update", (progress, instance) => {
    /**
     * @param {number} progress - it is the animation progress from 0 to 100
     * @param {Animate} instance - it is the instance of Animate the update event is triggered from
    */
});

// The play & pause events are triggered when the Animate.prototype.play() or .pause() methods are called.
....on("play" | "pause", (playstate, instance) => {
    /**
     * @param {"idle" | "running" | "paused" | "finished"} playstate - it is the animations play state
     * @param {Animate} instance - it is the instance of Animate the event is triggered from
    */
});

// The begin & complete events are triggered when all animations in an instance of Animate begin or complete.
// The begining of all animations is when the smallest delay in the Animate instance has passed, while the complete event is when all animations (taking into account the endDelay and loops as well) have ended.
....on("begin" | "complete", (instance) => {
    /**
     * @param {Animate} instance - it is the instance of Animate the event is triggered from
    */
});

// The finish event is triggered for all animation as they finish their individual animations
....on("finish", (target, i, len, animation) => {
    /**
     * @param {HTMLElement} target - it is the current element being animated
     * @param {number} i - the index of the target element in a list of target elements
     * @param {number} len - the total number of target elements
     * @param {Animation} animation - it is the instance of the `Animation` (this is a Web Animation API class) that has just finished
    */
});

// The error event is triggered when an error occurs in the `Animate` setup
....on("error", (err) => {
    /**
     * @param {Error} err - the error message
    */
});

// The stop event is triggered when an `Animate` instance has been permanently stopped.
....on("stop", () => { });
```

## Additional methods & properties

### mainAnimation: Animation
Stores an animation that runs on the total duration of all the `Animation` instances, and as such it's the main Animation.

### animations: Manager<HTMLElement, Animation>
A Manager of `Animations`; it stores all the `Animation` instances.

### computedOptions: Manager<Animation, AnimationOptions>
A Manager that stores all the fully calculated options for individual `Animation` instances.

*Note: the `computedOptions` are changed to their proper `Animation` instance options, so, some of the names are different, and options that can't be computed are not present. E.g. `fillMode` in the animation options is now just `fill` in the `computedOptions`.*

*Note: `keyframes` are not included, both the array form and the object form, the `options`, `speed`, and `autoplay` animation options are not allowed.*

### minDelay: number
The smallest delay out of all `Animation`'s, it is zero by default.

### on(...), off(...), and emit(...)

These methods are inherited from [@okikio/emitter](https://www.npmjs.com/package/@okikio/emitter). They control events and their listeners. The only difference is that by default their scopes are set to the instance of `Animate`.

```javascript
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

### play(), pause(), and reset()

They are self explanatory, the `play/pause` methods play/pause animation, while the `reset` method resets the progress of an animation.

### The long list of Get Methods

-   `getTargets(): HTMLElement[]` - Returns an Array of HTMLElement's
-   `getAnimation(element: HTMLElement): Animation` - Allows you to select a specific animation from an element
-   `getTiming(value: HTMLElement | Animation): EffectTiming | AnimationOptions` - Returns the timings of an Animation, given a target E.g. { duration, endDelay, delay, iterations, iterationStart, direction, easing, fill, etc... }
-   `getTotalDuration(): number` - Returns the total duration of the animation of all elements added together
-   `getCurrentTime(): number` - Returns the current time of the animation of all elements
-   `getProgress(): number` - Returns the progress of the animation of all elements as a percentage between 0 to 100.
-   `getPlayState(): string` - Returns the current playing state, it can be `"idle" | "running" | "paused" | "finished"`
-   `getSpeed(): number` - Return the playback speed of the animation
-   `getOptions(): object` - Returns the options that were used to create the animation

### The almost as long list of Set Methods; these methods are chainable

-   `setCurrentTime(time: number)` - Sets the current time of the animation
-   `setProgress(percent: number)` - Similar to `setCurrentTime` except it use a number between 0 and 100 to set the current progress of the animation
-   `setSpeed(speed: number = 1)` - Sets the playback speed of an animation

### then(...), catch(...), and finally(...)

They represent the then, catch, and finally methods of a Promise that is resolved when an animation has finished. It's also what allows the use of the `await/async` keywords for resolving animations. The `then` method resolves to the Animations Options, which can then be passed to other `Animate` instances to create animations with similar properties. Then, catch, and finally are chainable, they return the `Animate` class.

### toJSON()

An alias for `getOptions`

### all(method: (animation: Animation) => void)

Calls a method that affects all animations including the mainAnimation; the method only allows the animation parameter

For example,
```ts
// This is a small snippet from the setCurrentTime() method
this.all((animation: Animation) => {
    animation.currentTime = 5;
});
```

### finish()

Forces all Animations to finish, it triggers the `finish` and `complete` events.

### cancel()

Cancels all Animations, it just runs the cancel method from each individual animation.

### stop()

Cancels all Animations and de-references them allowing them to be garbage collected in a rush. It also emits a `stop` event to alert you to the animation stopping.

The `stop` method is not chainable.

*Warning: if you try to reference properties from the `Animate` class after stop has been called many things will break. The `Animate` class cannont and will not recover from stop, it is meant as a final trash run of animations, don't use it if you think you may restart the animation.*

## Example
[![Web Animation API Library Playground](https://raw.githubusercontent.com/okikio/native/master/packages/animate/assets/Web%20Animation%20API%20Library%20Playground.png)](https://codepen.io/okikio/pen/qBbdGaW?editors=0010)

[Check out the example on Codepen  &#8594;](https://codepen.io/okikio/pen/qBbdGaW?editors=0010)

## Browser support

`@okikio/animate` is provided as a native ES6 module, which means you may need to transpile it depending on your browser support policy. The library works using `<script type="module">` in
the following browsers (`@okikio/animate` may support older browsers, but I haven't tested those browsers):

-   Chrome > 71
-   Edge > 79
-   Firefox > 60

*Note: as it really difficult to get access to older versions of these browsers, I have only tested Chrome 71 and above.*

## Content delivery networks

`@okikio/animate` is available on [unpkg](https://unpkg.com/@okikio/animate@latest/lib/api.es.js) `https://unpkg.com/@okikio/animate@latest/lib/api.es.js`, [skypack](https://cdn.skypack.dev/@okikio/animate) `https://cdn.skypack.dev/@okikio/animate` or [jsdelivr](https://cdn.jsdelivr.net/npm/@okikio/animate@latest/lib/api.es.js) `https://cdn.jsdelivr.net/npm/@okikio/animate@latest/lib/api.es.js`.

```javascript
// Notice the .es.js file name extension, that represents ES Modules
// There is also,
//      .cjs.js - Common JS Module
//      .es.js - Modern ES Module
//      .js - The Fresh JS, uses IIFE.
import { animate } from "https://cdn.skypack.dev/@okikio/animate";

animate({
    target: "div",
    transform: ["translate(0%)", 100],
});
```

## Memory Management
I have found that CSS Animations tend to be the cause of memory leaks in websites, especially infinite animations. Javascript has become so efficient that it can effectively garbage collect js animations, however, I have found it is exceptionally difficult to manage looped animation so be very careful of memory when dealing with CSS and JS Animation), they eat up large ammounts of memory and CPU when left running for long periods of time. I would suggest making all your animations only occur a couple times and when they are done use the `stop()` method to remove the animations from memory *"if you don't plan on replaying the same animation"*. Don't just use the `stop()` method, test it first on your site before deploying it in a production enviroment.


## Best practices (these are from Animate Plus, but they are true for all Animation libraries)

Animations play a major role in the design of good user interfaces. They help connecting actions to consequences, make the flow of interactions manifest, and greatly improve the polish and perception of a product. However, animations can be damaging and detrimental to the user experience if they get in the way. Here are a few best practices to keep your animations effective and enjoyable:

-   **Speed**: Keep your animations fast. A quick animation makes a software feel more productive and responsive. The optimal duration depends on the effect and animation curve, but in most cases you should likely stay under 500 milliseconds.
-   **Easing**: The animation curve contributes greatly to a well-crafted animation. The easing "out" option is usually a safe bet as animations kick off promptly, making them react to user interactions instantaneously.
-   **Performance**: Having no animation is better than animations that stutter. When animating HTML elements, aim for using exclusively `transform` and `opacity` as these are the only properties browsers can animate cheaply.
-   **Restraint**: Tone down your animations and respect user preferences. Animations can rapidly feel overwhelming and cause motion sickness, so it's important to keep them subtle and to attenuate them even more for users who need reduced motion, for example by using `matchMedia("(prefers-reduced-motion)")` in JavaScript.

## Contributing
If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request and I'll try to get to it.

*The `native` project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) as the style of commit, we even use the [Commitizen CLI](http://commitizen.github.io/cz-cli/) to make commits easier.*

## Licence
See the [LICENSE](./LICENSE) file for license rights and limitations (MIT).
