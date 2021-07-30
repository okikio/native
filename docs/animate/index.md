# @okikio/animate

[![npm](https://img.shields.io/npm/v/@okikio/animate?style=for-the-badge)](https://www.npmjs.com/package/@okikio/animate) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/@okikio/animate?style=for-the-badge)](https://bundlephobia.com/package/@okikio/animate) [![GitHub](https://img.shields.io/github/license/okikio/native?style=for-the-badge)](../../LICENSE)

An animation library for the modern web. Inspired by animate plus, and animejs, [@okikio/animate](https://www.skypack.dev/view/@okikio/animate) is a Javascript animation library focused on performance and ease of use. It utilizes the Web Animation API to deliver fluid animations at a *semi-small* size, it weighs **~11.27 KB** (minified and gzipped), since `@okiko/animate` is treeshakeable, the minimum usable file size you can reach is **~7.07 KB** (minified and gzipped).

_**A quick note on size**: After I added [CustomEasing](#custom-easing) functionality the total library doubled in size, so, when I mean minimum size, I mean when you are only using the `animate` function or the `Animate` class_

I suggest reading the in depth article I made on CSS-Tricks about `@okikio/animate`, <https://css-tricks.com/how-i-used-the-waapi-to-build-an-animation-library/>, it will help you determine if `@okikio/animate` is right for your project.

_**Note**: [Custom Easing](#custom-easing), [staggers](#stagger), and [timelines](#timeline-class) are now supported._

> *To properly understand `@okikio/animate`, please read up on the [Web Animation API](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate) on MDN.*
> 
## Table of Contents

- [@okikio/animate](#okikioanimate)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Demo](#demo)
  - [Getting started](#getting-started)
  - [API Documentation](#api-documentation)
  - [Examples](#examples)
  - [Limitations](#limitations)
  - [Best practices](#best-practices)
  - [Browser Support](#browser-support)
  - [Contributing](#contributing)

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

* 








## Examples

[![@okikio/animate - playground](https://raw.githubusercontent.com/okikio/native/beta/packages/animate/assets/Web%20Animation%20API%20Library%20Playground.png)](https://codepen.io/collection/rxOEBO)

[Go through this collection of examples for more detailed demos   &#8594;](https://codepen.io/collection/rxOEBO)

Check out the [examples page](./examples.md) to view more examples, and showcases of `@okikio/animate` in production sites.

## Limitations

Unfortunately, the Web Animation API can't animate all CSS properties just yet, for example, morphing SVG paths via the `d` property isn't well supported yet, as Gecko (Firefox) & Webkit (Safari) based browsers don't natively support it. 

There are other limitations to what the Web Animation API will allow 😭, these limitation are covered in detail by an article published by Adobe about [the current state of SVG animation on the web](https://blog.adobe.com/en/publish/2015/06/05/the-state-of-svg-animation.html#gs.pihpjw). 

Some of these limitations have been unlocked recently with Chrome, Firefox, and Safari adding more WAAPI features, and `@okikio/animate` doing some background work to enable these features. Animation using motion paths are now possible through [Motion Path](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Motion_Path), and morphing can be emulated through [tweenAttr](#tweenattr).

Not all limitations are covered here, look through the [limitations doc](./limitations.md) for more.

## Best practices 

Read through the [best practices guide](./best-practices.md) for ways to control memory usage, and to create accessible animations.


## Browser Support

| Chrome | Edge | Firefox |
| ------ | ---- | ------- |
| > 84   | > 84 | > 63    |

Learn about polyfilling, bundling, and more in the [platform support guide](./browser-support.md).

## Contributing

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request on the `beta` branch and I'll try to get to it.

Read through the [contributing documentation](./contributing.md) for detailed guides.