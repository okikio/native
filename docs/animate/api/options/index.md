## Options

Animation options control how an animation is produced, it shouldn't be too different for those who have used `animejs`, or `jquery`'s animate method.

An animation option is an object with keys and values that are computed and passed to the `Animate` class to create animations that match the specified options.

The default options are:

```ts
export const DefaultAnimationOptions: AnimationOptions = {
    keyframes: [],

    loop: 1, // iterations: number,
    delay: 0,
    speed: 1,
    endDelay: 0,
    easing: "ease",
    autoplay: true,
    duration: 1000,
    fillMode: "auto",
    direction: "normal",
    padEndDelay: true,
    extend: {}
};
```