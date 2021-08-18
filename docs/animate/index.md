# @okikio/animate

[NPM](https://www.npmjs.com/package/@okikio/animate) <span style="padding-inline: 1rem">|</span> [API Guide](/docs/animate/api.md) <span style="padding-inline: 1rem">|</span> [Licence](/packages/animate/LICENSE) 

An animation library for the modern web. Inspired by animate plus, and animejs, [@okikio/animate](/docs/animate/index.md) is a Javascript animation library focused on performance and ease of use. It utilizes the Web Animation API (WAAPI) to deliver fluid animations at a *semi-small* size, it weighs **~11.27 KB** (minified and gzipped), since `@okiko/animate` is treeshakeable, the minimum usable file size you can reach is **~7.07 KB** (minified and gzipped).

> _**A quick note on size**: [CustomEasing](/docs/animate/api/custom-easing.md), [staggers](/docs/animate/api/stagger-and-random.md), and [timelines](/docs/animate/api/timeline-class.md) are now supported. After I added [CustomEasing](/docs/animate/api/custom-easing.md) functionality the total library size doubled, so when I mean minimum size, I mean when you are only using the `animate` function or the `Animate` class_

I suggest reading the in depth [CSS-Tricks article](https://css-tricks.com/how-i-used-the-waapi-to-build-an-animation-library/) I made on `@okikio/animate`, it will help you determine if `@okikio/animate` is right for your project.

> _**Note**: To properly understand `@okikio/animate`, please read up on the [Web Animation API](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate) on MDN._



## Installation

You can install [@okikio/animate](/docs/animate/index.md) from [npm](https://www.npmjs.com/package/@okikio/animate) via `npm i @okikio/animate`, `pnpm i @okikio/animate` or `yarn add @okikio/animate`.

You can use `@okikio/animate` on the web via

- [https://unpkg.com/@okikio/animate](https://unpkg.com/@okikio/animate)
- [https://cdn.skypack.dev/@okikio/animate](https://cdn.skypack.dev/@okikio/animate) 
- [https://cdn.jsdelivr.net/npm/@okikio/animate](https://cdn.jsdelivr.net/npm/@okikio/animate)

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

## Demo & Showcase

* [bundle.js.org](https://bundle.js.org)
* [jabodent.com](https://jabodent.com)
* Your project name here...

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


## Usage

Using `@okikio/animate` is actually fairly easy to use, in fact you can use it in **10 lines or less**, check it out,


[![@okikio/animate - starting demo](/packages/animate/assets/Code%20for%20Web%20Animation%20API%20Library%20Playground.png)](https://codepen.io/okikio/pen/RwVpvRz?editors=0010)

> [Check out this demo on Codepen  &#8594;](https://codepen.io/okikio/pen/RwVpvRz) 

Read through the [API guide](/docs/native/api.md) to learn more. 

## Examples

[![@okikio/animate - playground](/packages/animate/assets/Web%20Animation%20API%20Library%20Playground.png)](https://codepen.io/okikio/pen/mdPwNbJ?editors=0010)

[Go through a collection of examples & demos on Codepen   &#8594;](https://codepen.io/collection/rxOEBO)

## Limitations

Unfortunately, the Web Animation API can't animate all CSS properties just yet, for example, morphing SVG paths via the `d` property isn't well supported yet, as Gecko (Firefox) & Webkit (Safari) based browsers don't natively support it. 

There are other limitations to what the Web Animation API will allow 😭, these limitation are covered in detail by an article published by Adobe about [the current state of SVG animation on the web](https://blog.adobe.com/en/publish/2015/06/05/the-state-of-svg-animation.html#gs.pihpjw). 

Some of these limitations have been unlocked recently with Chrome, Firefox, and Safari adding more WAAPI features, and `@okikio/animate` doing some background work to enable these features. Animation using motion paths are now possible through [Motion Path](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Motion_Path), and morphing can be emulated through [tweenAttr](/docs/animate/api/tween-attributes.md).

Not all limitations are covered here, look through the [limitations doc](/docs/animate/limitations.md) for more.

## Best practices 

Read through the [best practices guide](/docs/animate/best-practices.md) for ways to control memory usage, and to create accessible animations.

## Browser Support

| Chrome | Edge | Firefox |
| ------ | ---- | ------- |
| > 84   | > 84 | > 63    |

Learn about polyfilling, bundling, and more in the [browser support guide](/docs/animate/browser-support.md).

## Contributing

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request on the `beta` branch and I'll try to get to it.

Read through the [contributing documentation](/docs/animate/contributing.md) for detailed guides.

## Licence

See the [LICENSE](/LICENSE) file for license rights and limitations (MIT).