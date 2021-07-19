### endDelay

| Default | Type                                                                                                    |
| :------ | :------------------------------------------------------------------------------------------------------ |
| `0`     | Number \| [TypeCallback](https://okikio.github.io/native/api/modules/_okikio_animate.html#typecallback) |

Similar to delay but it indicates the number of milliseconds to delay **after** the full animation has played **not before**.

_**Note**: `endDelay` will delay the `onfinish` method and event, but will not reserve the finished state of the CSS animation, if you need to use `endDelay` you may need to use the `fillMode` property to reserve the changes to the animation target._

```ts
// First element fades out but then after 1s finishes, the second element after 2s, etc.
animate({
    target: ".div",
    easing: "linear",
    endDelay: 1000,
    // or
    endDelay: (index) => (index + 1) * 1000,
    opacity: [1, 0],
});
```