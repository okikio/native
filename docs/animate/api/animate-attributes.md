## tweenAttr & AnimateAttributes

[`tweenAttr()`](/docs/api/modules/_okikio_animate.md#tweenattr) uses the change in opacity (from the [AnimateAttributes](/docs/api/classes/_okikio_animate.AnimateAttributes.md) class) to interpolate the attribute value of other elements.

`tweenAttr` returns a new instance of [AnimateAttributes](/docs/api/classes/_okikio_animate.AnimateAttributes.md) which is an extension of the [DestroyableAnimate](/docs/api/classes/_okikio_animate.DestroyableAnimate.md) class.

`AnimateAttributes` creates an empty new element with an id of `empty-animate-el-${number...}`, and a display style of `none`. `AnimateAttributes` then attaches the empty element to the DOM and then animates the opacity of the empty element. It then use the "update" event to watch for changes in opacity and use the opacity as a progress bar (with values between 0 to 1). This enables you to animate properties and attributes the Web Animation API (WAAPI) doesn't yet support.

With this you can animate the `d` attribute on svg paths, and create morphing svg shapes.

e.g.

```ts
import { tweenAttr, AnimateAttributes } from "@okikio/animate";
import { interpolate } from "polymorph-js";

let startPath = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
let endPath = "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z";

// This is an svg path interpolate function
// If used in tandem with `tweenAttr`, you can create morphing animations
let morph = interpolate([startPath, endPath], {
     addPoints: 0,
     origin: { x: 0, y: 0 },
     optimize: "fill",
     precision: 3
});

// `AnimateAttributes` supports all Animation Options with some restrictions and things to note.
// 1. Callbacks - the first argument in Animation Options callbacks are set to the progress of the animation beteen 0 and 1, while the other arguments are moved 1 right
// So, animation options can look like this 
// `(progress: number, i: number, len: number, el: HTMLElement) => {
//   return progress;
// }
 
// 2. Custom easing by default - `easing`, `decimal`, `numPoints`, etc... from `CustomEasing` are supported, meaning you can use any easing function you want, including `spring`, etc... without calling `CustomEasing` on the property you want to apply custom easing to
// 3. You can use `.updateOptions(...)` to update the animation options of tweens

tweenAttr({
    target: "svg path",
    d: progress => morph(progress)
});

// or
new AnimateAttributes({
    target: "svg path",
    d: progress => morph(progress)
})
```

Read more about [AnimateAttributes](/docs/api/classes/_okikio_animate.AnimateAttributes.md).