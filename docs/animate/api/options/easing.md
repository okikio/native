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

Yay, [Custom Easing](/docs/animate/api/custom-easing.md) are now supported, they have limitations, but those shouldn't affect too much.

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