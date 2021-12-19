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

Custom Easing uses the fact that WAAPI allows for [linear easing](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function) and [interpolation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats#syntax) between Array values, for CSS propertyies, to generate an arrays of values that the WAAPI can linearly interpolate between, thus emulating custom easing effects like bounce, elastic, and spring. As of right now, the `CustomEasing function` builds on top of `@okikio/animate`, but `@okikio/animate` isn't absolutely necessary, it just may not be as comfortable to use it without `@okikio/animate`.

Custom Easing has 3 properties they are `easing` (all the easings from [animation options easing](/docs/animate/api/options/easing.md) are supported, on top of custom easing functions, like spring, bounce, etc...), `numPoints` (the size of the Array the Custom Easing function should create), and `decimal` (the number of decimal places of the values within said Array).

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


### Elastic easing

All **Elastic** easing's can be configured using theses parameters,

`*-elastic(amplitude, period)`

Each parameter comes with these defaults

| Parameter | Default Value |
| --------- | ------------- |
| amplitude | `1`           |
| period    | `0.5`         |

### Spring easing

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

_**Suggestion**: if you decide to use [CustomEasing](/docs/api/modules/_okikio_animate.md#customeasing) on one CSS property, I suggest using [CustomEasing](/docs/api/modules/_okikio_animate.md#customeasing) or [ApplyCustomEasing](/docs/api/modules/_okikio_animate.md#applycustomeasing) on the rest_


## SpringEasing(...) Function

Returns an array containing `[easing points, duration]`, it's meant to be a self enclosed way to create spring easing.

Springs have an optimal duration; using [getEasingDuration()](/docs/api/modules/_okikio_animate.md#geteasingduration) we are able to have the determine the optimal duration for a spring with given parameters. 

By default the `SpringEasing(...)` function will only give the optimal duration for `spring` or `spring-in` easing, this is to avoid infinite loops caused by the `getEasingDuration()` function.

Internally the `SpringEasing` uses [CustomEasing](/docs/animate/api/custom-easing.md), read through the [api docs](/docs/api/modules/_okikio_animate.md#customeasing) on it, to understand how the `SpringEasing` function works.

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

Check out the [api docs](/docs/api/modules/_okikio_animate.md#springeasing) to for further detail.

## ApplyCustomEasing(...) Function

Applies the same custom easings to all properties of an object it also returns an object with each property having an array of custom eased values.

If you use the `spring` or `spring-in` easings it will also return the optimal duration as a key in the object it returns.

If you set `duration` to a number, it will prioritize that `duration` over optimal duration given by the spring easings.

Read through the [CustomEasing docs](/docs/animate/api/custom-easing.md), also check out the [CustomEasing api docs](/docs/api/modules/_okikio_animate.md#applycustomeasing).

<!-- _**Suggestion**: if you decide to use [CustomEasing](/docs/api/modules/_okikio_animate.md#customeasing) on one CSS property, I suggest using [CustomEasing](/docs/api/modules/_okikio_animate.md#customeasing) or [ApplyCustomEasing](/docs/api/modules/_okikio_animate.md#applycustomeasing) on the rest_ -->

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

Check out the [api docs](/docs/api/modules/_okikio_animate.md#applycustomeasing) to for further detail.