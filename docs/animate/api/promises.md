## Promises and Promise-Like

`animate()` is promise-like meaning it has `then`, `catch`, and `finally` methods, but `Animate` itself isn't a Promise (this is important to keep in mind when dealing with async/await asynchronous  animations). `Animate`'s `then` resolves once all animations are complete. The promise resolves to an Array with the `Animate` instance being the only element, but the `options` animation option can use the options of another `Animate` instance allowing animation chaining to be straightforward and convenient. The [Getting started](#getting-started) section gives a basic example.

Since `Animate` relies on native promises, you can benefit from all the usual features promises
provide, such as `Promise.all`, `Promise.race`, and especially `async/await` which makes animation timelines easy to set up.

> *An interesting quirk of Promises is that even though `Animate` is not a Promise, async/await still work with it because it has a `then`, and `catch`.*

*Warning: `then`, `catch`, and `finally` are not resetable, however, the `Animate.prototype.on("finish", ...)` event is, meaning if you reset an animation while then using `then`, `catch`, and `finally`, they will **not** fire again after the reset.*

For example,

```ts
animate({
    target: ".div",
    duration: 3000,
    transform: ["translateY(-100vh)", "translateY(0vh)"],
});

// This will only run once
/*
    Note that the AnimateInstance is in an Array when it is resolved,
    this is due to Promises not wanting to resolve references,
    so, you can't resolve the `this` keyword directly.
    I chose to resolve `this` in an Array as it seemed like the best alternative
*/
.then(( [AnimateInstance] ) => {
    console.log(`${getProgress()}`%);
    AnimateInstance.reset();
});

// or
(async () => {
    const [AnimateInstance] = await animate({
        target: ".div",
        duration: 3000,
        transform: ["translateY(-100vh)", "translateY(0vh)"],
    });

    await animate({
        options: AnimateInstance,
        transform: ["rotate(0turn)", "rotate(1turn)"],
    });

    await animate({
        options: AnimateInstance,
        duration: 800,
        easing: "in-quint",
        transform: ["scale(1)", "scale(0)"],
    });
})();
```