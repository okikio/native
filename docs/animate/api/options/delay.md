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