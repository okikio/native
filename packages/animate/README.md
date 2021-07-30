# @okikio/animate

[![npm](https://img.shields.io/npm/v/@okikio/animate?style=for-the-badge)](https://www.npmjs.com/package/@okikio/animate) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/@okikio/animate?style=for-the-badge)](https://bundlephobia.com/package/@okikio/animate) ![GitHub issues](https://img.shields.io/github/issues/okikio/native?style=for-the-badge) ![GitHub](https://img.shields.io/github/license/okikio/native?style=for-the-badge)

An animation library for the modern web. Inspired by animate plus, and animejs, [@okikio/animate](https://www.skypack.dev/view/@okikio/animate) is a Javascript animation library focused on performance and ease of use. It utilizes the Web Animation API to deliver fluid animations at a *semi-small* size, it weighs **~11.27 KB** (minified and gzipped), since `@okiko/animate` is treeshakeable, the minimum usable file size you can reach is **~7.07 KB** (minified and gzipped).

_**A quick note on size**: After I added [CustomEasing](#custom-easing) functionality the total library doubled in size, so, when I mean minimum size, I mean when you are only using the `animate` function or the `Animate` class_

I suggest reading the in depth article I made on CSS-Tricks about `@okikio/animate`, <https://css-tricks.com/how-i-used-the-waapi-to-build-an-animation-library/>, it will help you determine if `@okikio/animate` is right for your project.

_**Note**: [Custom Easing](#custom-easing), [staggers](#stagger), and [timelines](#timeline-class) are now supported._

> *To properly understand `@okikio/animate`, please read up on the [Web Animation API](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate) on MDN.*

## Using Gitpod

You can try out `@okikio/animate` using Gitpod:

[![Open In Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/okikio/native/blob/beta/packages/animate/README.md)

By default Gitpod will start the dev script for you, but if you need to restart the dev script you can do so by typing into the terminal.

```bash
pnpm demo
```

Once Gitpod has booted up, click on the `@okikio/animate (no-pjax)` button in the preview, then go to [../../build/pug/animate.pug](../../build/pug/animate.pug) and [../../build/ts/animate.ts](../../build/ts/animate.ts) and start tweaking and testing to your hearts content.

## Runing Locally

You can run `@okikio/animate` locally by first installing some packages via these commands into your terminal,

```bash
npm install -g pnpm && pnpm install -g gulp ultra-runner commitizen && pnpm install && pnpm build
```

and then you can test/demo it using this command,

```bash
pnpm demo 
```

Once it has booted up, go to [../../build/pug/](../../build/pug/) and [../../build/ts/](../../build/ts/) and start tweaking and testing to your hearts content.

You can build your changes/contributions using,

```bash
pnpm build
```

## Table of Contents

- [@okikio/animate](#okikioanimate)
  - [Using Gitpod](#using-gitpod)
  - [Runing Locally](#runing-locally)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Demo](#demo)
  - [Getting started](#getting-started)
  - [API Documentation](#api-documentation)
  - [Options](#options)
    - [target(s)](#targets)
    - [easing](#easing)
    - [duration](#duration)
    - [delay](#delay)
    - [timelineOffset](#timelineoffset)
    - [endDelay](#enddelay)
    - [padEndDelay](#padenddelay)
    - [loop](#loop)
    - [onfinish](#onfinish)
    - [oncancel](#oncancel)
    - [autoplay](#autoplay)
    - [direction](#direction)
    - [speed](#speed)
    - [fillMode](#fillmode)
    - [options](#options-1)
    - [offset](#offset)
    - [timeline](#timeline)
    - [keyframes](#keyframes)
    - [composite](#composite)
    - [extend](#extend)
  - [Animations](#animations)
  - [Animation Options & CSS Properties as Methods](#animation-options--css-properties-as-methods)
  - [Transformable CSS Properties](#transformable-css-properties)
  - [Animation Progress and the requestAnimationFrame](#animation-progress-and-the-requestanimationframe)
  - [Promises and Promise-Like](#promises-and-promise-like)
  - [Events](#events)
  - [Custom Easing](#custom-easing)
    - [SpringEasing](#springeasing)
    - [ApplyCustomEasing](#applycustomeasing)
  - [DestroyableAnimate](#destroyableanimate)
  - [Tweens](#tweens)
    - [tween](#tween)
    - [tweenAttr](#tweenattr)
  - [Effects](#effects)
  - [Additional methods & properties](#additional-methods--properties)
    - [mainAnimation: Animation](#mainanimation-animation)
    - [targetIndexes: WeakMap<Node, number>](#targetindexes-weakmapnode-number)
    - [keyframeEffects: WeakMap<HTMLElement, KeyframeEffect>](#keyframeeffects-weakmaphtmlelement-keyframeeffect)
    - [computedOptions: WeakMap<HTMLElement, TypeComputedOptions>](#computedoptions-weakmaphtmlelement-typecomputedoptions)
    - [animations: WeakMap<KeyframeEffect, Animation>](#animations-weakmapkeyframeeffect-animation)
    - [computedKeyframes: WeakMap<HTMLElement, TypeKeyFrameOptionsType> = new WeakMap()](#computedkeyframes-weakmaphtmlelement-typekeyframeoptionstype--new-weakmap)
    - [minDelay: number](#mindelay-number)
    - [maxSpeed: number](#maxspeed-number)
    - [on(...), off(...), and emit(...)](#on-off-and-emit)
    - [is(playstate: TypePlayStates)](#isplaystate-typeplaystates)
    - [play(), pause(), reverse(), and reset()](#play-pause-reverse-and-reset)
    - [The long list of Get Methods](#the-long-list-of-get-methods)
      - [`getAnimation(target: HTMLElement): Animation`](#getanimationtarget-htmlelement-animation)
      - [`getTiming(value: HTMLElement | Animation): EffectTiming | AnimationOptions`](#gettimingvalue-htmlelement--animation-effecttiming--animationoptions)
      - [`getCurrentTime(): number`](#getcurrenttime-number)
      - [`getProgress(): number`](#getprogress-number)
      - [`getPlayState(): string`](#getplaystate-string)
      - [`getSpeed(): number`](#getspeed-number)
    - [The almost as long list of Set Methods; these methods are chainable](#the-almost-as-long-list-of-set-methods-these-methods-are-chainable)
      - [`setCurrentTime(time: number)`](#setcurrenttimetime-number)
      - [`setProgress(percent: number)`](#setprogresspercent-number)
      - [`setSpeed(speed: number = 1)`](#setspeedspeed-number--1)
    - [then(...), catch(...), and finally(...)](#then-catch-and-finally)
    - [toJSON()](#tojson)
    - [all(method: (animation: Animation, target?: HTMLElement) => void)](#allmethod-animation-animation-target-htmlelement--void)
    - [finish()](#finish)
    - [cancel()](#cancel)
    - [stop()](#stop)
  - [Pause Animation when Page is out of Focus](#pause-animation-when-page-is-out-of-focus)
  - [Examples](#examples)
  - [Browser support](#browser-support)
  - [Polyfills & Bundling](#polyfills--bundling)
  - [CSS & SVG Animations Support](#css--svg-animations-support)
  - [Memory Management](#memory-management)
  - [Best practices (these are from Animate Plus, but they are true for all Animation libraries)](#best-practices-these-are-from-animate-plus-but-they-are-true-for-all-animation-libraries)
  - [Contributing](#contributing)
  - [Licence](#licence)

## Installation

You can install [@okikio/animate](https://www.skypack.dev/view/@okikio/animate) from [npm](https://www.npmjs.com/package/@okikio/animate) via `npm i @okikio/animate`, `pnpm i @okikio/animate` or `yarn add @okikio/animate`.

You can use `@okikio/animate` on the web via

- [https://unpkg.com/@okikio/animate](https://unpkg.com/@okikio/animate),
- [https://cdn.skypack.dev/@okikio/animate](https://cdn.skypack.dev/@okikio/animate) or
- [https://cdn.jsdelivr.net/npm/@okikio/animate](https://cdn.jsdelivr.net/npm/@okikio/animate).

Once installed it can be used like this:

```ts
// There is,
//      .cjs - Common JS Module
//      .mjs - Modern ES Module
//      .js - IIFE
import { animate } from "@okikio/animate";
import { animate } from "https://unpkg.com/@okikio/animate";
import { animate } from "https://cdn.jsdelivr.net/npm/@okikio/animate";
// Or
import { animate } from "https://cdn.skypack.dev/@okikio/animate";

// Via script tag
<script src="https://unpkg.com/@okikio/animate/lib/api.js"></script>
// Do note, on the web you need to do this, if you installed it via the script tag:
const animate = window.animate.default;
// or
const { default: animate } = window.animate;
// or
const { animate } = window.animate;
// or
const { default: anime } = window.animate; // LOL
```

## Demo

I built a small demo showing off the abilities of the `@okikio/animate` library. You can find the files for the demo in [./build](https://github.com/okikio/native/tree/beta/build) folder. For more info on how to use the demo go to [okikio/native#usage](https://github.com/okikio/native/blob/beta/README.md#usage) on Github.

I recommend using the Gitpod link at the top of the page to get started with development, as it removes the need for setup.

> [Click to view demo &#8594;](https://okikio.github.io/native/demo/animate)

## Getting started

`@okikio/animate` create animations by creating instances of `Animate`, a class that acts as a wrapper around the Web Animation API. To create new instances of the `Animate` class, you can either import the `Animate` class and do this, `new Animate({ ... })` or import the `animate` (lowercase) method and do this, `animate({ ... })`. The `animate` method creates new instances of the `Animate` class and passes the options it recieves as arguments to the `Animate` class.

The `Animate` class recieves a set of targets to animate, it then creates a list of Web Animation API `Animation` instances, along side a main animation, which is small `Animation` instance that is set to animate the opacity of a non visible element, the `Animate` class then plays each `Animation` instances keyframes including the main animation.

The main animation is there to ensure accuracy in different browser vendor implementation of the Web Animation API. The main animation is stored in `Animate.prototype.mainAnimation: Animation`, the other `Animation` instances are stored in a `WeakMap` `Animate.prototype.animations: WeakMap<KeyframeEffect, Animation>`.

```ts
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

## API Documentation

Not all available methods and properties are listed here (otherwise this README would be too long), so  go through the [API documentation](https://okikio.github.io../../api/modules/_okikio_animate.html) for the full documented API.

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
    padEndDelay: true,
    extend: {}
};
```

### target(s)

| Default     | Type                                                                                                 |
| :---------- | :--------------------------------------------------------------------------------------------------- |
| `undefined` | AnimationTarget = string \| Node \| NodeList \| HTMLCollection \| HTMLElement[] \| AnimationTarget[] |

Determines the DOM elements to animate. You can pass it a CSS selector, DOM elements, or an Array of DOM Elements and/or CSS Selectors.

```ts
animate({
    target: document.body.children, // You can use either `target` or `targets` for your animations
    // or
    // target: ".div",
    // target: document.querySelectorAll(".el"),
    // target: [document.querySelectorAll(".el"), ".div"]",
    // targets: [document.querySelectorAll(".el"), ".div"]",
    transform: ["rotate(0turn)", "rotate(1turn)"],
});
```

### easing

| Default | Type                                                                                                    |
| :------ | :------------------------------------------------------------------------------------------------------ |
| `ease`  | String \| [TypeCallback](https://okikio.github.io/native/api/modules/_okikio_animate.html#typecallback) |

Determines the acceleration curve of your animation.
Based on the easings of [easings.net](https://easings.net)

| constant   | accelerate   | decelerate     | accelerate-decelerate |
| :--------- | :----------- | :------------- | :-------------------- |
| linear     | ease-in / in | ease-out / out | ease-in-out / in-out  |
| ease       | in-sine      | out-sine       | in-out-sine           |
| steps      | in-quad      | out-quad       | in-out-quad           |
| step-start | in-cubic     | out-cubic      | in-out-cubic          |
| step-end   | in-quart     | out-quart      | in-out-quart          |
|            | in-quint     | out-quint      | in-out-quint          |
|            | in-expo      | out-expo       | in-out-expo           |
|            | in-circ      | out-circ       | in-out-circ           |
|            | in-back      | out-back       | in-out-back           |

You can create your own custom cubic-bezier easing curves. Similar to css you type `cubic-bezier(...)` with 4 numbers representing the shape of the bezier curve, for example, `cubic-bezier(0.47, 0, 0.745, 0.715)` this is the bezier curve for `in-sine`.

_**Note**: the `easing` property supports the original values and functions for easing as well, for example, `steps(1)`, and etc... are supported._

_**Note**: you can also use camelCase when defining easing functions, e.g. `inOutCubic` to represent `in-out-cubic`_

Yay, [Custom Easing](#custom-easing) are now supported, they have limitations, but those shouldn't affect too much.

```ts
// cubic-bezier easing
animate({
    target: ".div",
    easing: "cubic-bezier(0.47, 0, 0.745, 0.715)",
    /* or */
    // easing: "in-sine",
    /* or */
    // easing: "inSine",
    transform: ["translate(0px)", "translate(500px)"],
});
```

As of right now these are the limits of easing, but a couple standards are in discussions right now, so cross your fingers and hope they are standardized soon.

Here are some standards in discussion:

- [Easing Worklet](https://github.com/jakearchibald/easing-worklet)
- [Animation Worklet](https://drafts.css-houdini.org/css-animation-worklet-1/#example-1)
- [CSS Defined Easing](https://github.com/w3c/csswg-drafts/issues/229)

### duration

| Default | Type                                                                                                              |
| :------ | :---------------------------------------------------------------------------------------------------------------- |
| `1000`  | Number \| String \| [TypeCallback](https://okikio.github.io/native/api/modules/_okikio_animate.html#typecallback) |

Determines the duration of your animation in milliseconds. By passing it a callback, you can define a different duration for each element. The callback takes the index of each element, the target dom element, and the total number of target elements as its argument and returns a number.

```ts
// First element fades out in 1s, second element in 2s, etc.
animate({
    target: ".div",
    easing: "linear",
    duration: 1000,
    // or
    duration: (index) => (index + 1) * 1000,
    opacity: [1, 0],
});
```

### delay

| Default | Type                                                                                                    |
| :------ | :------------------------------------------------------------------------------------------------------ |
| `0`     | Number \| [TypeCallback](https://okikio.github.io/native/api/modules/_okikio_animate.html#typecallback) |

Determines the delay of your animation in milliseconds. By passing it a callback, you can define a different delay for each element. The callback takes the index of each element, the target dom element, and the total number of target elements as its argument and returns a number.

```ts
// First element starts fading out after 1s, second element after 2s, etc.
animate({
    target: ".div",
    easing: "linear",
    delay: 5,
    // or
    delay: (index) => (index + 1) * 1000,
    opacity: [1, 0],
});
```

### timelineOffset

| Default | Type             |
| :------ | :--------------- |
| `0`     | Number \| String |

Adds an offset amount to the `delay` option, for creating a timeline similar to `animejs`.

I don't intend to create a `timeline` function for this library but if you wish to please try your hands at creating one, if it's small, light-weight, and there is a need I might incorperate it.

### endDelay

| Default | Type                                                                                                    |
| :------ | :------------------------------------------------------------------------------------------------------ |
| `0`     | Number \| [TypeCallback](https://okikio.github.io/native/api/modules/_okikio_animate.html#typecallback) |

Similar to delay but it indicates the number of milliseconds to delay **after** the full animation has played **not before**.

_**Note**: `endDelay` will delay the `onfinish` method and event, but will not reserve the finished state of the CSS animation, if you need to use `endDelay` you may need to use the `fillMode` property to reserve the changes to the animation target._

```ts
// First element fades out but then after 1s finishes, the second element after 2s, etc.
animate({
    target: ".div",
    easing: "linear",
    endDelay: 1000,
    // or
    endDelay: (index) => (index + 1) * 1000,
    opacity: [1, 0],
});
```

### padEndDelay

| Default | Type    |
| :------ | :------ |
| `false` | Boolean |

This ensures all `animations` match up to the total duration, and don't finish too early, if animations finish too early when the `.play()` method is called specific animations  that are finished will restart while the rest of the animations will continue playing.

_**Note**: you cannot use the `padEndDelay` option and set a value for `endDelay`, the `endDelay` value will replace the padded endDelay, `padEndDelay` is also ignored if `loop` is `true` or is set to `infinity`._

When creating progress/seek bars this needs to be enabled for the animation to function properly.

### loop

| Default | Type                                                                                                               |
| :------ | :----------------------------------------------------------------------------------------------------------------- |
| `1`     | Boolean \| Number \| [TypeCallback](https://okikio.github.io/native/api/modules/_okikio_animate.html#typecallback) |

Determines if the animation should repeat, and how many times it should repeat.

```ts
// Loop forever
animate({
    target: ".div",
    easing: "linear",
    loop: true, // Using `loop: Infinity,` would also have worked
    // or
    loop: 5, // If you want the animation to loop 5 times
    opacity: [1, 0],
});
```

### onfinish

| Default                                                                            | Type     |
| :--------------------------------------------------------------------------------- | :------- |
| `(element: HTMLElement, index: number, total: number, animation: Animation) => {}` | Function |

Occurs when the animation for one of the targets completes, meaning when animating many targets that finish at different times this will run multiple times. The arguments it takes is slightly different from the rest of the animation options.

The animation argument represents the animation for the current target.

**Warning**: the order of the callback's arguments are in a different order, with the target element first, and the index second.

```ts
// Avoid using fillMode, use this instead to commit style changes
// Do note endDelay delays the onfinish method
animate({
    target: ".div",
    opacity: [0, 1],

    /**
     * @param {HTMLElement} element - the current target element
     * @param {number} index - the index of the current target element in  `Animate.prototype.targets`
     * @param {number} total - the total number of target elements
     * @param {Animation} animation - the animation of the current target element
     */

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

### oncancel

| Default                                                                            | Type     |
| :--------------------------------------------------------------------------------- | :------- |
| `(element: HTMLElement, index: number, total: number, animation: Animation) => {}` | Function |

Occurs when the animation for one of the targets is cancelled, meaning when animating many elements that are cancelled at different times this will run multiple times. The arguments it takes is slightly different from the rest of the animation options.

The animation argument represents the animation for the current element.

**Warning**: the order of the callback's arguments are in a different order, with the target element first, and the index second.

```ts
// Avoid using fillMode, use this instead to commit style changes
// Do note endDelay delays the onfinish method
animate({
    target: ".div",
    opacity: [0, 1],

    /**
     * @param element - the current target element
     * @param index - the index of the current target element in  `Animate.prototype.targets`
     * @param total -  the total number of target elements
     * @param animation - the animation of the current target element
     */

    // Note the order of the arguments -- it's different from other properties
    oncacel(element, index, total, animation) {
        console.log(
            `${
                index + 1
            } out of ${total}, elements have been cancelled. Animation playback speed is ${animation.playbackRate}, the target elements id attribute is ${element.id}`
        );
    },
});
```

### autoplay

| Default | Type    |
| :------ | :------ |
| `true`  | Boolean |

Determines if the animation should automatically play, immediately after being instantiated.

### direction

| Default  | Type                                                                                                    |
| :------- | :------------------------------------------------------------------------------------------------------ |
| `normal` | String \| [TypeCallback](https://okikio.github.io/native/api/modules/_okikio_animate.html#typecallback) |

Determines the direction of the animation, the directions available are:

- `reverse` runs the animation backwards,
- `alternate` switches direction after each iteration if the animation loops.
- `alternate-reverse` starts the animation at what would be the end of the animation if the direction were
- `normal` but then when the animation reaches the beginning of the animation it alternates going back to the position it started at.

### speed

| Default | Type                                                                                                    |
| :------ | :------------------------------------------------------------------------------------------------------ |
| `1`     | Number \| [TypeCallback](https://okikio.github.io/native/api/modules/_okikio_animate.html#typecallback) |

Determines the animation playback rate. Useful in the authoring process to speed up some parts of a
long sequence (value above 1) or slow down a specific animation to observe it (value between 0 to 1),

_**Note**: negative numbers reverse the animation._

### fillMode

| Default | Type                                                                                                    |
| :------ | :------------------------------------------------------------------------------------------------------ |
| `auto`  | String \| [TypeCallback](https://okikio.github.io/native/api/modules/_okikio_animate.html#typecallback) |

_Be careful when using fillMode, it has some problems when it comes to concurrency of animations read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/fill), if browser support were better I would remove fillMode and use Animation.commitStyles, I'll have to change the way `fillMode` functions later. Use the onfinish method to commit styles [onfinish](#onfinish)._

Defines how an element should look after the animation. The fillModes availble are:

- `none` means the animation's effects are only visible while the animation is playing.
- `forwards` the affected element will continue to be rendered in the state of the final animation frame.
- `backwards` the animation's effects should be reflected by the element(s) state prior to playing.
- `both` combining the effects of both forwards and backwards; The animation's effects should be reflected by the element(s) state prior to playing and retained after the animation has completed playing.
- `auto` if the animation effect fill mode is being applied to is a keyframe effect. "auto" is equivalent to "none". Otherwise, the result is "both".

You can learn more here on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/fill).

### options

| Default | Type                                                                                                                                        |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `{}`    | [IAnimationOptions](https://okikio.github.io/native/api/interfaces/_okikio_animate.ianimationoptions.html) = Object \| Animate \| Animate[] |

Another way to input options for an animation, it's also used to chain animations.

The `options` animation option is another way to declare options, it can take an instance of `Animate`, a single `Animate` instance in an Array, e.g. `[Animate]` or an object containing animation options.

`options` extends the animation properties of an animation, but more importance is given to the actual animation options object, so, the properties from `options` will be ignored if there is already an animation option with the same name declared.

_**Note**: you can't use this property as a method._

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
    let options = animate({
        target: ".div",
        opacity: [0, 1],
    });

    await options;

    animate({
        options,

        // opacity overrides the opacity property from `options`
        opacity: [1, 0],
    });

    console.log(options); //= Animate
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

### offset

| Default     | Type                                                                                                                  |
| :---------- | :-------------------------------------------------------------------------------------------------------------------- |
| `undefined` | (Number \| String)[] \| [TypeCallback](https://okikio.github.io/native/api/modules/_okikio_animate.html#typecallback) |

Controls the starting point of certain parts of an animation.

The offset of the keyframe specified as a number between `0.0` and `1.0` inclusive or null. This is equivalent to specifying start and end states in percentages in CSS stylesheets using @keyframes. If this value is null or missing, the keyframe will be evenly spaced between adjacent keyframes.

Read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats)

```ts
animate({
    duration: 2000,
    opacity: [ 0, 0.9, 1 ],
    easing: [ 'ease-in', 'ease-out' ],

    offset: [ "from", 0.8 ], // Shorthand for [ 0, 0.8, 1 ]
    // or
    offset: [ 0, "80%", "to" ], // Shorthand for [ 0, 0.8, 1 ]
    // or
    offset: [ "0", "0.8", "to" ], // Shorthand for [ 0, 0.8, 1 ]
});
```

### timeline

| Default                                                                               | Type              |
| :------------------------------------------------------------------------------------ | :---------------- |
| [DocumentTimeline](https://developer.mozilla.org/en-US/docs/Web/API/DocumentTimeline) | AnimationTimeline |

Represents the timeline of animation. It exists to pass timeline features to Animations.

As of right now it doesn't contain any features but in the future when other timelines like the [ScrollTimeline](https://drafts.csswg.org/scroll-animations-1/#scrolltimeline), read the Google Developer article for [examples and demos of ScrollTimeLine](https://developers.google.com/web/updates/2018/10/animation-worklet#hooking_into_the_space-time_continuum_scrolltimeline)

_**Note**: timeline cannot be a callback/function_

### keyframes

| Default | Type                                                                                                                                                                                   |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[]`    | TypeCSSLikeKeyframe \| ICSSComputedTransformableProperties[] & Keyframe[] \| object[] \| [TypeCallback](https://okikio.github.io/native/api/modules/_okikio_animate.html#typecallback) |

I highly suggest going through the API documentation to better understand [keyframes](https://okikio.github.io/native/api/interfaces/_okikio_animate.ianimationoptions.html#keyframes).

Allows you to manually set keyframes using a `keyframe` array

Read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/setKeyframes).

An `array` of objects (keyframes) consisting of properties and values to iterate over. This is the canonical format returned by the [getKeyframes()](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/getKeyframes) method.

`@okikio/animate` also offers another format called `CSSLikeKeyframe`, read more about [KeyframeParse](https://okikio.github.io/native/api/modules/_okikio_native.html#keyframeparse)

It basically functions the same way CSS's `@keyframe` works.

_**Note**: the order of `transform` functions in CSS Property form...matter, meanwhile in keyframes the transform order doesn't, keep this in mind when you are try to create complex rotation based animations or other complex animations in general._

```ts
animate({
     keyframes: {
         "from, 50%, to": {
             opacity: 1
         },
         "25%, 0.7": {
             opacity: 0
         }
     }
})

// Results in a keyframe array like this
//= [
//=   { opacity: 1, offset: 0 },
//=   { opacity: 0, offset: 0.25 },
//=   { opacity: 1, offset: 0.5 },
//=   { opacity: 0, offset: 0.7 },
//=   { opacity: 1, offset: 1 }
//= ]
```

### composite

The `composite` property of a `KeyframeEffect` resolves how an element's animation impacts its underlying property values.

To understand these values, take the example of a `keyframeEffect` value of `blur(2)` working on an underlying property value of `blur(3)`.

- `replace` - The keyframeEffect overrides the underlying value it is combined with: `blur(2)` replaces `blur(3)`.
- `add` - The keyframeEffect is added to the underlying value with which it is combined (aka additive):  `blur(2) blur(3)`.
- `accumulate` - The keyframeEffect is accumulated on to the underlying value: `blur(5)`.

Read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/composite)

I recommend reading [web.dev](https://web.dev)'s article on [web-animations](https://web.dev/web-animations/#smoother-animations-with-composite-modes).

### extend

| Default | Type                                                                                            |
| :------ | :---------------------------------------------------------------------------------------------- |
| `{}`    | [KeyframeEffectOptions](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffectOptions) |

The properties of the `extend` animation option are computed and can use [TypeCallback](https://okikio.github.io/native/api/modules/_okikio_animate.html#typecallback), they are a way to access features that haven't been implemented in `@okikio/animate`, for example, `iterationStart`.

`extend` is supposed to future proof the library if new features are added to the Web Animation API that you want to use, but that has not been implemented yet.

_**Note**: it doesn't allow for declaring actual animation keyframes; it's just for animation timing options, and it overrides all other animation timing options that accomplish the same goal, e.g. `loop` & `iterations`, if `iterations` is a property of `extend` then `iterations` will override `loop`._

_**Warning**: `extend` itself **cannont** be computed, so, it doesn't support TypeCallback._

```ts
animate({
    target: ".div",
    opacity: [0, 1],
    loop: 5,
    extend: {
        iterationStart: 0.5,
        // etc...
        fill: "both", // This overrides fillMode
        iteration: 2, // This overrides loop
        composite: "add"
    }
});
```

## Animations

`@okikio/animate` lets you animate HTML and SVG elements with any property that takes numeric values, including hexadecimal colors.
The `@okikio/animate` module contains a class that controls animatations called `Animate`. To create new instances of the `Animate` class I created the `animate()` function.

```ts
// Animate the fill color of an SVG circle
animate({
    target: "circle",
    fill: ["#80f", "#fc0"],
});
```

Each property you animate needs an array defining the start and end values, or an Array of keyframes.

```ts
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

## Animation Options & CSS Properties as Methods

All options & properties except `target`, `targets`, `autoplay`, `extend`, `onfinish`, and `options` can be represented by a method with the arguments `(index: number, total: number, element: HTMLElement)`.

*Note: the `keyframes` option **can** be a method*.

```ts
/**
 * @param {number} [index] - index of each element
 * @param {number} [total] - total number of elements
 * @param {HTMLElement} [element] - the target element
 * @returns any
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

## Transformable CSS Properties

I added the ability to use single value unitless numbers, strings, and arrays, as well as added the transform functions as CSS properties.

Single value means,

```ts
animate({
    opacity: 0.5, // This will turn into `["5"]`, notice no units, this could also be a string
    translateX: 250, // This will turn into `["250px"]`, notice how it adds units, this could also be a string
    rotate: 360, // This will turn into `["360deg"]`, notice how it adds units, this could also be a string
    skew: "1.25turn", // This will turn into `["1.25turn"]`, notice how it doesn't add "deg" as the units
    left: 50, // This is actually an error, this will turn into `["50"]`, notice no units, this could also be a string. Only transform properties support automatic units
})
```

This is in preperation for [Implicit to/from keyframes](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate#implicit_tofrom_keyframes)

Removes the need for the full transform statement in order to use translate, rotate, scale, skew, or perspective including their X, Y, Z, and 3d varients. Plus adds automatic units to the transform CSS properties.

Also, adds the ability to use single string or number values for transform functions.

_**Note**: the `transform` animation option will override all transform CSS properties_

_**Note**: dash & camel case are supported as CSS property names, this also includes transforms, so, you can use `translate-x` or `translateX`, when setting a CSS property_

_**Note**: all other features will work with Transformable CSS Properties, this includes the `keyframes` animation options and `animation options` as callbacks_

_**Note**: the order of `transform` functions in CSS Property form...matter, meanwhile in keyframes the transform order doesn't, keep this in mind when you are try to create complex rotation based animations or other complex animations in general._

_**Warning**: only the transform function properties and CSS properties with the keys ["margin", "padding", "size", "width", "height", "left", "right", "top", "bottom", "radius", ,"gap", "basis", "inset", "outline-offset", "perspective", "thickness", "position", "distance", "spacing", "rotate"] will get automatic units. It will also work with multiple unit  CSS properties like "margin", "padding", and "inset", etc..., however, no automatic units will be applied to any CSS properties that can accept color, this is to avoid unforseen bugs_

Read more about the [ParseTransformableCSSProperties](https://okikio.github.io/native/api/modules/_okikio_animate.html#parsetransformablecssproperties) method.

Also, read about the [ParseTransformableCSSKeyframes](https://okikio.github.io/native/api/modules/_okikio_animate.html#parsetransformablecsskeyframes) method.

Check out an example on [Codepen](https://codepen.io/okikio/pen/qBrNXoY?editors=0110)

```ts
animate({
    // ...
    /*
    keyframes(index) {
        return [
            { translateX: 0 },
            { translateX: (index + 1) * 250 }
        ];
    },

    // or
    translateX(index) {
        return `0, ${(index + 1) * 250}`;
    },
    */

    // It will automatically add the "px" units for you, or you can write a string with the units you want
    translate3d: [
        "25, 35, 60%",
        [50, "60px", 70],
        ["70", 50]
    ],
    translate: "25, 35, 60%",
    translateX: [50, "60px", "70"],
    translateY: ["50, 60", "60"], // Note: this will actually result in an error, make sure to pay attention to where you are putting strings and commas
    translateZ: 0,
    perspective: 0,
    opacity: "0, 5",
    scale: [
        [1, "2"],
        ["2", 1]
    ],
    rotate3d: [
        [1, 2, 5, "3deg"], // The last value in the array must be a string with units for rotate3d
        [2, "4", 6, "45turn"],
        ["2", "4", "6", "-1rad"]
    ],
    opacity: [0, 1],
    "border-left": 5
})

//= {
//=   transform: [
//=       // `translateY(50, 60)` will actually result in an error
//=       'translate(25px) translate3d(25px, 35px, 60%) translateX(50px) translateY(50, 60) translateZ(0px) rotate3d(1, 2, 5, 3deg) scale(1, 2) perspective(0px)',
//=       'translate(35px) translate3d(50px, 60px, 70px) ranslateX(60px) translateY(60px) rotate3d(2, 4, 6, 45turn) scale(2, 1)',
//=       'translate(60%) translate3d(70px, 50px) translateX(70px) rotate3d(2, 4, 6, -1rad)'
//=   ],
//=   opacity: [ '0', '5' ],
//=   borderLeft: ["5px"]
//= }
```

## Animation Progress and the requestAnimationFrame

The Web Animation API doesn't allow for keeping track of the progress in a clean way, so, I am forced to use requestAnimationFrame to check the current progress of the animation, however, doing, so, can actually decrease framerates, so, I built a system to call requestAnimationFrame less often.

`@okikio/animate` stores running `Animate` instances in a Set stored in the `Animate` class's static RUNNING property, however, it only stores instances that have registered "update" event listeners.

When an Animate instance is played, it gets added to the RUNNING Set, `Animate.requestFrame()` is then called and a single `requestAnimationFrame` is runs for all Animate instances in the RUNNING set. If after a couple frames a Animate instance doesn't have an attached "update" event listener it is automatically removed from the RUNNING Set (**Note**: Animate instances that are finished are also auto-removed, and if there are no Animate instances in the RUNNING Set the requestAnimationFrame is cancelled).

For you to better understand check this out (this is meant for visiualization, avoid directly interacting with these),

```ts
import { Animate } from "@okikio/"
Animate.RUNNING = new Set();

let instance = new Animate({ /* .... */ });
instance.on("update", () => console.log("It works"));

if (instance.emitter.getEvent("update").length > 0) {
    Animate.RUNNING.add(instance);
    if (Animate.animationFrame == null) Animate.requestFrame();
} 
```

If you add an "update" event listener to an Animate instance, the Animate instance is added to the RUNNING Set, and if a `requestAnimationFrame` isn't already running it will request a new one.

## Promises and Promise-Like

`animate()` is promise-like meaning it has `then`, `catch`, and `finally` methods, but `Animate` itself isn't a Promise (this is important to keep in mind when dealing with async/await asynchronous  animations). `Animate`'s `then` resolves once all animations are complete. The promise resolves to an Array with the `Animate` instance being the only element, but the `options` animation option can use the options of another `Animate` instance allowing animation chaining to be straightforward and convenient. The [Getting started](#getting-started) section gives a basic example.

Since `Animate` relies on native promises, you can benefit from all the usual features promises
provide, such as `Promise.all`, `Promise.race`, and especially `async/await` which makes animation timelines easy to set up.

> *An interesting quirk of Promises is that even though `Animate` is not a Promise, async/await still work with it because it has a `then`, and `catch`.*

*Warning: `then`, `catch`, and `finally` are not resetable, however, the `Animate.prototype.on("finish", ...)` event is, meaning if you reset an animation while then using `then`, `catch`, and `finally`, they will **not** fire again after the reset.*

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

- "update"
- "play"
- "pause"
- "begin"
- "finish"
- "cancel"
- "error"
- "stop"
- "playstate-change"

```ts
/* 
    The update event is triggered continously while an animation is playing, it does this by calling requestAnimationFrame.
    By default, whenever an animation is played, the current Animate instance is added to `Animate.RUNNING` WeakSet and 
    a requests for an animation frame is called, where it checks if there are any listeners for the "update" event. 
    If there are none, the Animate instance is removed from the `Animate.RUNNING` WeakSet. 
    If there are listeners the Animate instances loop method is called, and the "update" event is emitted every frame until,
    the Animation is done, where it stops

    If there are no Animate instances in the `Animate.RUNNING` WeakSet, the requestAnimationFrame loop, is stopped, 
    until there are other Animate instances that are played
*/
....on("update", (progress, instance) => {
    /**
     * @param {number} progress - it is the animation progress from 0 to 100
     * @param {Animate} instance - it is the instance of Animate the update event is triggered from
    */
});

// The play & pause events are triggered when the Animate.prototype.play() or .pause() methods are called.
// The "playstate-change" event occurs when the playstate changes, so, when the animation is played, paused, cancelled, or finished
....on("play" | "pause" | "playstate-change", (playstate, instance) => {
    /**
     * @param {"idle" | "running" | "paused" | "finished"} playstate - it is the animations play state
     * @param {Animate} instance - it is the instance of Animate the event is triggered from
    */
});

// The begin, finish, and cancel events are triggered when all animations in an instance of Animate begin, finish or are cancelled.

// The begin event occurs at the begining of all animations and its when the the Animate instance has started, while the finish event is when all animations (taking into account the endDelay and loops as well) have ended.
// Note: By the time events are registered the animation would have started and there wouldn't have be a `begin` event listener to actually emit, so,
// the `begin` event emitter is wrapped in a setTimeout of 0ms so that the event can be defered; by the end of the timeout the rest of the js to run,
// the `begin` event to be registered thus the `begin` event can be emitter

// The cancel event occurs when the mainElement animation is cancelled or the `.cancel()` method is called
....on("begin" | "finish" | "cancel", (instance) => {
    /**
     * @param {Animate} instance - it is the instance of Animate the event is triggered from
    */
});

// The error event is triggered when an error occurs in the `Animate` setup
....on("error", (err) => {
    /**
     * @param {Error} err - the error message
    */
});

// The stop event is triggered when an `Animate` instance has been permanently stopped via the `.stop()` method.
....on("stop", () => { });
```

## Custom Easing

Custom Easing isn't currently a thing in the Web Animation API (WAAPI), so, the next best thing is to emulate the effect of Custom Easing. I added the `CustomEasing` function for this reason, you can use it like this,

```ts
import { animate, CustomEasing, EaseOut, Quad } from "@okikio/animate"; 

animate({
    // Notice how only, the first value in the Array uses the "px" unit
    border: CustomEasing(["1px solid red", "3 dashed green", "2 solid black"], {
        // This is a custom easing function
        easing: EaseOut(Quad)
    }),

    translateX: CustomEasing([0, 250], {
        easing: "linear",

        // You can change the size of Array for the CustomEasing function to generate  
        numPoints: 200,

        // The number of decimal places to round, final values in the generated Array
        decimal: 5,
    }),

    // You can set the easing without an object
    // Also, if units are detected in the values Array, 
    // the unit of the first value in the values Array are
    // applied to other values in the values Array, even if they
    // have prior units 
    rotate: CustomEasing(["0turn", 1, 0, 0.5], "out"),
    "background-color": CustomEasing(["#616aff", "white"]),
    easing: "linear"
})
```

You can view a demo of Custom Easing on [Codepen](https://codepen.io/okikio/pen/abJMWNy). I based the Custom Easing implementation on a comment by [@jakearchibald](https://github.com/jakearchibald) on [Github](https://github.com/w3c/csswg-drafts/issues/229#issuecomment-860778689) and an article by [kirillvasiltsov](https://www.kirillvasiltsov.com/writing/how-to-create-a-spring-animation-with-web-animation-api/).

Custom Easing uses the fact that WAAPI allows for linear easing, and for users to set multiple different values in Array format, thus, I created a small function that generates a set of arrays that create custom easing effects like bounce, elastic, and spring. As of right now it builds on top of `@okikio/animate` but `@okikio/animate` isn't absolutely necessary, it just may not be as comfortable to using it without `@okikio/animate`.

Custom Easing has 3 properties they are `easing` (all the easings from [#easing](#easing) are supported on top of custom easing functions, like spring, bounce, etc...), `numPoints` (the size of the Array the Custom Easing function should create), and `decimal` (the number of decimal places of the values within said Array).

| Properties  | Default Value           |
| ----------- | ----------------------- |
| `easing`    | `spring(1, 100, 10, 0)` |
| `numPoints` | `50`                    |
| `decimal`   | `3`                     |

By default, Custom Easing support easing functions, in the form,

| constant   | accelerate         | decelerate     | accelerate-decelerate | decelerate-accelerate |
| :--------- | :----------------- | :------------- | :-------------------- | :-------------------- |
| linear     | ease-in / in       | ease-out / out | ease-in-out / in-out  | ease-out-in / out-in  |
| ease       | in-sine            | out-sine       | in-out-sine           | out-in-sine           |
| steps      | in-quad            | out-quad       | in-out-quad           | out-in-quad           |
| step-start | in-cubic           | out-cubic      | in-out-cubic          | out-in-cubic          |
| step-end   | in-quart           | out-quart      | in-out-quart          | out-in-quart          |
|            | in-quint           | out-quint      | in-out-quint          | out-in-quint          |
|            | in-expo            | out-expo       | in-out-expo           | out-in-expo           |
|            | in-circ            | out-circ       | in-out-circ           | out-in-circ           |
|            | in-back            | out-back       | in-out-back           | out-in-back           |
|            | in-bounce          | out-bounce     | in-out-bounce         | out-in-bounce         |
|            | in-elastic         | out-elastic    | in-out-elastic        | out-in-elastic        |
|            | spring / spring-in | spring-out     | spring-in-out         | spring-out-in         |

All **Elastic** easing's can be configured using theses parameters,

`*-elastic(amplitude, period)`

Each parameter comes with these defaults

| Parameter | Default Value |
| --------- | ------------- |
| amplitude | `1`           |
| period    | `0.5`         |

***

All **Spring** easing's can be configured using theses parameters,

`spring-*(mass, stiffness, damping, velocity)`

Each parameter comes with these defaults

| Parameter | Default Value |
| --------- | ------------- |
| mass      | `1`           |
| stiffness | `100`         |
| damping   | `10`          |
| velocity  | `0`           |

You can create your own custom cubic-bezier easing curves. Similar to css you type `cubic-bezier(...)` with 4 numbers representing the shape of the bezier curve, for example, `cubic-bezier(0.47, 0, 0.745, 0.715)` this is the bezier curve for `in-sine`.

_**Note**: the `easing` property supports the original values and functions for easing as well, for example, `steps(1)`, and etc... are supported._

_**Note**: you can also use camelCase when defining easing functions, e.g. `inOutCubic` to represent `in-out-cubic`_

_**Suggestion**: if you decide to use [CustomEasing](https://okikio.github.io/native/api/modules/_okikio_animate.html#customeasing) on one CSS property, I suggest using [CustomEasing](https://okikio.github.io/native/api/modules/_okikio_animate.html#customeasing) or [ApplyCustomEasing](https://okikio.github.io/native/api/modules/_okikio_animate.html#applycustomeasing) on the rest_

***

### SpringEasing

Returns an array containing `[easing points, duration]`, it's meant to be a self enclosed way to create spring easing.
Springs have an optimal duration; using [`getEasingDuration()`](https://okikio.github.io/native/api/modules/_okikio_animate.html#geteasingduration) we are able to have the determine the optimal duration for a spring with given parameters.

By default it will only give the optimal duration for `spring` or `spring-in` easing, this is to avoid infinite loops caused by the `getEasingDuration()` function.

Internally the `SpringEasing` uses [CustomEasing](https://okikio.github.io/native/api/modules/_okikio_animate.html#customeasing), read more on it, to understand how the `SpringEasing` function works.

e.g.

```ts
import { animate, SpringEasing } from "@okikio/animate";

// `duration` is the optimal duration for the spring with the set parameters
let [translateX, duration] = SpringEasing([0, 250], "spring(5, 100, 10, 1)");
// or
// `duration` is 5000 here
let [translateX, duration] = SpringEasing([0, 250], { 
     easing: "spring(5, 100, 10, 1)",
     numPoints: 50,
     duration: 5000,
     decimal: 3
});

animate({
     target: "div",
     translateX,
     duration
});
```

***

### ApplyCustomEasing

You can also use `ApplyCustomEasing`. It applies the same custom easings to all properties of an object it also returns an object with each property having an array of custom eased values

If you use the `spring` or `spring-in` easings it will also return the optimal duration as a key in the object it returns.
If you set `duration` to a number, it will prioritize that `duration` over optimal duration given by the spring easings.

Read more about [CustomEasing](https://okikio.github.io/native/api/modules/_okikio_animate.html#applycustomeasing).

_**Suggestion**: if you decide to use [CustomEasing](https://okikio.github.io/native/api/modules/_okikio_animate.html#customeasing) on one CSS property, I suggest using [CustomEasing](https://okikio.github.io/native/api/modules/_okikio_animate.html#customeasing) or [ApplyCustomEasing](https://okikio.github.io/native/api/modules/_okikio_animate.html#applycustomeasing) on the rest_

e.g.

```ts
import { animate, ApplyCustomEasing } from "@okikio/animate";
animate({
     target: "div",

     ...ApplyCustomEasing({
       border: ["1px solid red", "3 dashed green", "2 solid black"],
       translateX: [0, 250],
       rotate: ["0turn", 1, 0, 0.5],
       "background-color": ["#616aff", "white"],

       // You don't need to enter any parameters, you can just use the default values
       easing: "spring",
       // You can change the size of Array for the CustomEasing function to generate  
       numPoints: 200,
       // The number of decimal places to round, final values in the generated Array
       decimal: 5,
       
       // You can also set the duration from here.
       // When using spring animations, the duration you set here is not nesscary,
       // since by default springs will try to determine the most appropriate duration for the spring animation.
       // But the duration value here will override `spring` easings optimal duration value
       duration: 3000
     })
})
```

## DestroyableAnimate

[`DestroyableAnimate`](https://okikio.github.io/native/api/modules/_okikio_animate.html#destroyableanimate) is an extended varient of [`Animate`](https://okikio.github.io/native/api/classes/_okikio_animate.animate.html) that automatically removes the target elements from the DOM, when the [`stop()`](https://okikio.github.io/native/api/classes/_okikio_animate.animate.html#stop) method is called.

## Tweens

### tween

[`tween()`](https://okikio.github.io/native/api/modules/_okikio_animate.html#tween) creates an empty new element with an id of `empty-animate-el-${number...}` with a display style of `none`, and then attaches it to the DOM. `tween()` returns a new instance of the `DestroyableAnimate` class and then animates the opacity of the empty element.

You can then use the "update" event to watch for changes in opacity and use the opacity as a progress bar of values between 0 to 1. This enables you to animate properties and attributes the Web Animation API (WAAPI) doesn't yet support.

### tweenAttr

[`tweenAttr()`](https://okikio.github.io/native/api/modules/_okikio_animate.html#tweenattr) uses the change in opacity (from the [tween](https://okikio.github.io/native/api/modules/_okikio_animate.html#tween) function) to interpolate the value of other elements.

e.g.

```ts
import { tweenAttr } from "@okikio/animate";
import { interpolate } from "polymorph-js";

let startPath = usingPolymorphPathEl.getAttribute("d");
let endPath = "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z";

// This is an svg path interpolate function
// If used in tandem with `tweenAttr`, you can create morphing animations
let morph = interpolate([startPath, endPath], {
     addPoints: 0,
     origin: { x: 0, y: 0 },
     optimize: "fill",
     precision: 3
});

// `tweenAttr` supports all Animation Options.
// The first argument in Animation Options callbacks are set to the progress of the animation beteen 0 and 1, while the other arguments are moved 1 right

// So, animation options can look like this 
// `(progress: number, i: number, len: number, el: HTMLElement) => {
//   return progress;
// }`

tweenAttr({
     target: "svg path",
     d: progress => morph(progress)
});

// `tweenAttr` can automatically choose between custom easing functions and or normal easings
tweenAttr({
     target: ".div",
     targets: ".el",
     width: 250,
     height: ["500px", 600],
     easing: "spring"

// If you want to update styles instead of attributes, 
// you can change this to "style"
}, "style");
```

Read more about [tween](https://okikio.github.io/native/api/modules/_okikio_animate.html#tween).

## Effects

You may want to use premade effects like the onces [animate.css](https://www.npmjs.com/package/animate.css) provide, I initially planned on bundling this functionality in, but because of the plentiful number of libraries that do the same thing, I suggest using those instead, and if you want to create your own effects from CSS, you can use CSS Keyframe style JSON object, make sure to read the documentation for [KeyframeParse](https://okikio.github.io/native/api/modules/_okikio_animate.html#keyframeparse)

I suggest [@shoelace-style/animations](https://www.npmjs.com/package/@shoelace-style/animations) for all your animate.css needs, you can use it like this,

```ts
import { animate } from "@okikio/animate";
import { bounce } from '@shoelace-style/animations';

animate({
    keyframes: bounce,
    loop: true,
    easing: "in-sine"
})
```

or

if you just need some quick effects go to [github.com/wellyshen/use-web-animations/](https://github.com/wellyshen/use-web-animations/tree/master/src/animations) and copy the `keyframes` array for the effect you want, remember to say thank you to [@wellyshen](https://github.com/wellyshen) for all his hardwork, 😂.

## Additional methods & properties

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
E.g. { duration, endDelay, delay, iterations, iterationStart, direction, easing, fill, etc... }

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

An alias for [options](https://okikio.github.io/native/api/classes/animate.animate-1.html#options)

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

## Pause Animation when Page is out of Focus

If the page looses focus, by default `Animate` will pause all playing animations until the user goes back to the page, however, this behavior can be changed by setting the `pauseOnPageHidden` static property to false.

_**Note**: you need to put this statemeant at the top of your document, before all `Animate` instances_

```ts
import { animate, Animate } from "@okikio/animate";
Animate.pauseOnPageHidden = false;
animate({
    // ...
})
```

## Examples

[![@okikio/animate - playground](https://raw.githubusercontent.com/okikio/native/beta/packages/animate/assets/Web%20Animation%20API%20Library%20Playground.png)](https://codepen.io/collection/rxOEBO)

[Go through this collection of examples for more detailed demos   &#8594;](https://codepen.io/collection/rxOEBO)

## Browser support

`@okikio/animate` is provided as a native ES6 module, which means you may need to transpile it depending on your browser support policy. The library works using `<script type="module">` in
the following browsers (`@okikio/animate` may support older browsers, but I haven't tested those browsers):

- Chrome > 84
- Edge > 84
- Firefox > 63

Determining compatability is a little difficult but the versions stated are the minimum versions of browsers where all of `@okikio/animate`'s features work without [polyfilling](#polyfills--bundling).

Below Chrome 84 you can't use the [updateOptions](http://127.0.0.1:3000/api/classes/_okikio_animate.animate.html#updateoptions) method to update animation keyframes, because browsers don't support [KeyframeEffect.setKeyframes()](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/setKeyframes), and anything below Chrome 75 you will need a polyfill.

The caniuse pages for the [Web Animation API](https://caniuse.com/web-animation), and [KeyframeEffect.setKeyframes()](https://caniuse.com/mdn-api_keyframeeffect_setkeyframes) do a good job of visualizing browser support (Chromium Based Edge supports everything Chrome does, so I don't know why caniuse says otherwise, but you should keep note of this before making a descision).

_**Note**: as it really difficult to get access to older versions of these browsers, I have only tested Chrome 84 and above._

## Polyfills & Bundling

If you install [@okikio/animate](https://www.skypack.dev/view/@okikio/animate) via [npm](https://www.npmjs.com/package/@okikio/animate) you are most likely going to need [rollup](https://rollupjs.org/) or [esbuild](https://esbuild.github.io/).

You will most likely need the Web Animation API, Promise, Object.values, Array.prototype.includes and Array.from polyfills.

You can use [web-animations-js](https://github.com/web-animations/web-animations-js), or [polyfill.io](https://polyfill.io/) to create a polyfill. The minimum feature requirement for a polyfill are Promise, and a Web Animation polyfill (that supports KeyframeEffect),
For a quick polyfill I suggest using both of these on your project.  

- <https://cdn.polyfill.io/v3/polyfill.min.js?features=default,es2015,es2018,Array.prototype.includes,Object.values,Promise>

- [https://cdn.jsdelivr.net/npm/web-animations-js/web-animations-next.min.js](https://cdn.jsdelivr.net/npm/web-animations-js/web-animations-next.min.js).

I suggest checking out the [demo](../../build/ts/webanimation-polyfill.ts) to see how I setup the Web Animation Polyfill*

***Warning**: polyfilling may not fix animation format bugs, e.g. [composite animations](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/composite) don't work on older browsers, so, if you use `polyfill.io` and set it to check if the browser supports the feature before applying the polyfill, your project might encounter errors, as the browser may only have partial support of the Web Animation API.*

## CSS & SVG Animations Support

_**Warning**: Techinically the `d` attribute is supported in Chromium based browsers, but litterarly no one else supports it so, be carefull and take the following list of attributes with a grain of salt, make sure to test them in the browser enviroments you expect them to be used in._

`Animate` can animate `~197` CSS properties; [MDN Animatable CSS Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties) and `~63` SVG properties; [MDN SVG Presentation Attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation).

The animatable CSS properties are:

- backdrop-filter
- background
- background-color
- background-position
- background-size
- block-size
- border
- border-block-end
- border-block-end-color
- border-block-end-width
- border-block-start
- border-block-start-color
- border-block-start-width
- border-bottom
- border-bottom-color
- border-bottom-left-radius
- border-bottom-right-radius
- border-bottom-width
- border-color
- border-end-end-radius
- border-end-start-radius
- border-image-outset
- border-image-slice
- border-image-width
- border-inline-end
- border-inline-end-color
- border-inline-end-width
- border-inline-start
- border-inline-start-color
- border-inline-start-width
- border-left
- border-left-color
- border-left-width
- border-radius
- border-right
- border-right-color
- border-right-width
- border-start-end-radius
- border-start-start-radius
- border-top
- border-top-color
- border-top-left-radius
- border-top-right-radius
- border-top-width
- border-width
- bottom
- box-shadow
- caret-color
- clip
- clip-path
- offset-distance
- color
- [etc...](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties)

The animatable SVG properties are:

- alignment-baseline
- baseline-shift
- clip
- clip-path
- clip-rule
- color
- color-interpolation
- color-interpolation-filters
- color-profile
- color-rendering
- cursor
- d (only on Chromium browsers)
- direction
- display
- dominant-baseline
- enable-background
- fill
- fill-opacity
- fill-rule
- filter
- flood-color
- flood-opacity
- font-family
- font-size
- font-size-adjust
- font-stretch
- font-style
- font-variant
- font-weight
- letter-spacing
- lighting-color
- marker-end
- marker-mid
- marker-start
- mask
- opacity
- overflow
- pointer-events
- shape-rendering
- solid-color
- solid-opacity
- stop-color
- stop-opacity
- stroke
- stroke-dasharray
- stroke-dashoffset
- stroke-linecap
- stroke-linejoin
- stroke-miterlimit
- stroke-opacity
- stroke-width
- text-anchor
- text-decoration
- text-rendering
- transform
- vector-effect
- visibility
- word-spacing
- writing-mode
- [etc...](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation)

Unfortunately, morphing SVG paths via the `d` property isn't well supported yet, as Gecko (Firefox) & Webkit (Safari) based browsers don't support it yet, and there are other limitations to what the Web Animation API will allow 😭, these limitation are covered in detail by an article published by Adobe about [the current state of SVG animation on the web](https://blog.adobe.com/en/publish/2015/06/05/the-state-of-svg-animation.html#gs.pihpjw). However, animation using paths is now viable through [Motion Path](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Motion_Path).

## Memory Management

I have found that infinite CSS Animations tend to be the cause of high memory usage in websites. Javascript has become so efficient that it can effectively garbage collect js animations, however, I have also found it exceptionally difficult to manage looped animation so be very careful of memory when dealing with CSS and JS Animations, they eat up large ammounts of memory and CPU when left running for extended periods of time. I would suggest making all your animations only occur a couple times and when they are done use the `cancel()` (preference) or `stop()` methods, (you can use the `stop()` method *"if you **don't** plan on replaying the same animation"*). Don't just use the `stop()` method, test it first on your site before deploying it in a production enviroment.

## Best practices (these are from Animate Plus, but they are true for all Animation libraries)

Animations play a major role in the design of good user interfaces. They help connecting actions to consequences, make the flow of interactions manifest, and greatly improve the polish and perception of a product. However, animations can be damaging and detrimental to the user experience if they get in the way. Here are a few best practices to keep your animations effective and enjoyable:

- **Speed**: Keep your animations fast. A quick animation makes a software feel more productive and responsive. The optimal duration depends on the effect and animation curve, but in most cases you should likely stay under 500 milliseconds.
- **Easing**: The animation curve contributes greatly to a well-crafted animation. The easing "out" option is usually a safe bet as animations kick off promptly, making them react to user interactions instantaneously.
- **Performance**: Having no animation is better than animations that stutter. When animating HTML elements, aim for using exclusively `transform` and `opacity` as these are the only properties browsers can animate cheaply.
- **Restraint**: Tone down your animations and respect user preferences. Animations can rapidly feel overwhelming and cause motion sickness, so it's important to keep them subtle and to attenuate them even more for users who need reduced motion, for example by using `matchMedia("(prefers-reduced-motion)")` in JavaScript.

## Contributing

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request and I'll try to get to it.

_**Note**: all contributions must be done on the `beta` branch._

*The `native` initiative uses [Changesets](https://github.com/atlassian/changesets/blob/main/docs/intro-to-using-changesets.md#adding-changesets), for versioning and Changelog generation, you don't need to create one, but it would be amazing if you could.*

## Licence

See the [LICENSE](./LICENSE) file for license rights and limitations (MIT).
