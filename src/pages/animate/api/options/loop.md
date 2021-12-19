---
layout: layout:PagesLayout
---
### loop

| Default | Type                                                                                   |
| :------ | :------------------------------------------------------------------------------------- |
| `1`     | Boolean \| Number \| [TypeCallback](/docs/api/modules/_okikio_animate.md#typecallback) |

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