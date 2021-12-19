---
layout: layout:PagesLayout
---
### duration

| Default | Type                                                                                  |
| :------ | :------------------------------------------------------------------------------------ |
| `1000`  | Number \| String \| [TypeCallback](/docs/api/modules/_okikio_animate.md#typecallback) |

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