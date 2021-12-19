---
layout: layout:PagesLayout
---
### extend

| Default | Type                                                                                            |
| :------ | :---------------------------------------------------------------------------------------------- |
| `{}`    | [KeyframeEffectOptions](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffectOptions) |

The properties of the `extend` animation option are computed and can use [TypeCallback](/docs/api/modules/_okikio_animate.md#typecallback), they are a way to access features that haven't been implemented in `@okikio/animate`, for example, `iterationStart`.

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