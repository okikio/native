# @okikio/animate

[NPM](https://www.npmjs.com/package/@okikio/animate) <span style="padding-inline: 1rem">|</span> [Github](https://github.com/okikio/native/tree/beta/packages/animate#readme) <span style="padding-inline: 1rem">|</span> [API Guide](/docs/animate/api/index.md) <span style="padding-inline: 1rem">|</span> [Licence](/packages/animate/LICENSE)  

[@okikio/animate](/docs/animate/index.md) is a js animation library for the modern web. It was inspired by [animateplus](https://github.com/bendc/animateplus) and [animejs](https://animejs.com/), it is focused on performance and ease of use. It utilizes the Web Animation API (WAAPI) to deliver fluid animations at a *semi-small* size, in total it weighs **~11.27 KB** (minified and gzipped). Most devs will only really be using a few of `@okiko/animate`'s features at a time, so the actual minimum usable [treeshakeable](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) file size is [**~7.07 KB** (minified and gzipped)](https://bundle.js.org/?q=@okikio/animate&treeshake=animate).

I suggest reading the in depth [CSS-Tricks article](https://css-tricks.com/how-i-used-the-waapi-to-build-an-animation-library/) I made on `@okikio/animate`, it will help you determine if `@okikio/animate` is right for your project.

> _**A quick note on size**: [CustomEasing](/docs/animate/api/custom-easing.md), [staggers](/docs/animate/api/stagger-and-random.md), and [Queue](/docs/animate/api/queue-class.md) are now supported. After these additions the total library size doubled, so when I mean minimum usable size, I mean when you are only using the `animate` function._


## Demo & Showcase

* [bundle.js.org](https://bundle.js.org)
* [jabodent.com](https://jabodent.com)
* Your project name here...

> [Click to view demo &#8594;](/docs/demo)

## Installation

You can install [@okikio/animate](/docs/animate/index.md) from [npm](https://www.npmjs.com/package/@okikio/animate) via 

```bash
npm i @okikio/animate
```

<details>
<summary>Others</summary>

```bash
yarn add @okikio/animate
```
or
```bash
pnpm i @okikio/animate
```
</details>

<br/>

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
<script src="https://unpkg.com/@okikio/animate/lib/index.js"></script>
// Do note, on the web you need to do this, if you installed it via the script tag:
const animate = window.animate.default;
// or
const { default: animate } = window.animate;
// or
const { animate } = window.animate;
// or
const { default: anime } = window.animate; // LOL
```


## Getting started

`@okikio/animate` creates animations by creating instances of the [Animate class](/docs/api/classes/_okikio_animate.Animate.md) (a class that acts as a wrapper around the Web Animation API). 

_To create new instances of the `Animate` class, you can do this, `animate({ ... })`._

```ts
import { animate } from "@okikio/animate";

// The `animate` function creates new instances of the `Animate` class
animate({
  target: [/* ... */],
  duration: 2000,
  // ... 
});
```

The `Animate` class recieves a set of [targets](/docs/animate/api/options/target.md) to animate, it then creates a list of WAAPI `Animation` instances corrosponding to the target elements. 

In order to determine when all target animations are complete, the `Animate` class also creates a main `Animation` instance. The main `Animation` instance plays for the total duration of all target animations, and alerts the user when all target animations have completed. 

> _**Note**: `Animation` instances come from the `Animation` class of the Web Animations API. The `Animation` class represents a single animation player and provides playback controls and a timeline for an animation node or source, [Read more...](https://developer.mozilla.org/en-US/docs/Web/API/Animation)_

[Read the API docs to learn more  &#8594;](/docs/animate/api/index.md)




## Usage

`@okikio/animate` is actually fairly easy to use, in fact you can use it in **10 lines or less**, check it out,


[![@okikio/animate - starting demo](/packages/animate/assets/Code-for-Web-Animation-API-Library-Playground.png)](https://codepen.io/okikio/pen/RwVpvRz?editors=0010)

> [Check out this demo on Codepen  &#8594;](https://codepen.io/okikio/pen/RwVpvRz) 

Read through the [API guide](/docs/native/api/index.md) to learn more. 

## Examples


Using these basics you can create some truly stunning and complex animations, with promises, transforms, CSS property methods, etc..., check out the example below.

```ts
import animate from "@okikio/animate";

// Do note, on the web you need to do this, if you installed it via the script tag:
// const { animate } = window.animate;

(async () => {
    let [options] = await animate({
        target: ".div",
        /* 
         * NOTE: 
         *   If you turn this on you have to comment out the transform property. 
         *   The keyframes property is a different format for animation you cannot use 
         *   both styles of formatting in the same animation 
         */
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

[![@okikio/animate - playground](/packages/animate/assets/Web-Animation-API-Library-Playground.png)](https://codepen.io/okikio/pen/mdPwNbJ?editors=0010)
[Preview this example &#8594;](https://codepen.io/okikio/pen/mdPwNbJ?editors=0010)

> [Go through a collection of examples & demos on Codepen   &#8594;](https://codepen.io/collection/rxOEBO)

## Limitations

Unfortunately, the Web Animation API still has some constraints, as it can't animate all CSS properties just yet, for example, morphing SVG paths via the `d` property isn't well supported yet, as Gecko (Firefox) & Webkit (Safari) based browsers don't natively support it. 

There are other limitations to what the Web Animation API will allow, most of these limitation are covered in detail by an article published by Adobe about [the current state of SVG animation on the web](https://blog.adobe.com/en/publish/2015/06/05/the-state-of-svg-animation.html#gs.pihpjw) 😭. 

Some of these constraints have been recently unlocked, with Chrome, Firefox, and Safari adding more WAAPI features, and `@okikio/animate` doing some background work to enable cool new features. For one, animations using motion paths are now possible through [Motion Path](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Motion_Path), and morphing can be emulated through [tweenAttr](/docs/animate/api/animate-attributes-and-morphing.md).

Not all limitations are covered here, look through the [limitations guide](/docs/animate/limitations.md) for more.

## Best practices 

Read through the [best practices guide](/docs/animate/best-practices.md) for ways to control memory usage, and to create accessible animations, the best advice I can give is to respect users preferences, and don't go overboard with animation as it can sometimes overwhelm users.

## Browser Support

| Chrome | Edge | Firefox |
| ------ | ---- | ------- |
| > 84   | > 84 | > 63    |

Learn about polyfilling, bundling, and more in the [browser support guide](/docs/animate/browser-support.md).

## Contributing

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request on the `beta` branch and I'll try to get to it.

Read through the [contributing guide](/docs/animate/contributing.md) for detailed guides.

## Licence

See the [LICENSE](/LICENSE) file for license rights and limitations (MIT).
