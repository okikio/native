### options

| Default | Type                                                                                                                                        |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `{}`    | [IAnimationOptions](/docs/api/interfaces/_okikio_animate.ianimationoptions.md) = Object \| Animate \| Animate[] |

Another way to input options for an animation, it's also used to chain animations.

The `options` animation option is another way to declare options, it can take an instance of `Animate`, a single `Animate` instance in an Array, e.g. `[Animate]` or an object containing animation options.

`options` extends the animation properties of an animation, but more importance is given to the actual animation options object, so, the properties from `options` will be ignored if there is already an animation option with the same name declared.

_**Note**: you can't use this property as a method._

```ts
(async () => {
    // animate is Promise-like, as in it has a then() method like a Promise but it isn't a Promise.
    // animate resolves to an Array that contains the Animate instance, e.g. [Animate]
    let [options] = await animate({
        target: ".div",
        opacity: [0, 1],
    });

    animate({
        options,

        // opacity overrides the opacity property from `options`
        opacity: [1, 0],
    });

    console.log(options); //= Animate
})();

// or
(async () => {
    let options = await animate({
        target: ".div",
        opacity: [0, 1],
        duration: 2000,

    });

    // Remeber, the `options` animation option can handle Arrays with an Animate instance, e.g. [Animate]
    // Also, remeber that Animate resolves to an Arrays with an Animate instance, e.g. [Animate]
    // Note: the `options` animation option can only handle one Animate instance in an Array and that is alway the first element in the Array
    animate({
        options,
        opacity: [1, 0],
    });

    console.log(options); //= [Animate]
})();

// or
(async () => {
    let options = animate({
        target: ".div",
        opacity: [0, 1],
    });

    await options;

    animate({
        options,

        // opacity overrides the opacity property from `options`
        opacity: [1, 0],
    });

    console.log(options); //= Animate
})();

// or
(async () => {
    let options = {
        target: ".div",
        opacity: [0, 1],
    };

    await animate(options);
    animate({
        options,
        opacity: [1, 0],
    });

    console.log(options); //= { ... }
})();
```

> Go through the [animation options docs](/docs/animate/api/options/index.md) for extra info. on other animation options.