
## API Documentation

### Animations

`@okikio/animate` lets you animate HTML and SVG elements with any property that takes numeric values, including hexadecimal colors.
The `@okikio/animate` module contains a class that controls animatations called `Animate`. To create new instances of the `Animate` class I created the `animate()` function.

```ts
// Animate the fill color of an SVG circle
animate({
    target: "circle",
    fill: ["#80f", "#fc0"],
});
```

Each property you animate needs an array defining the start and end values, or an Array of keyframes.

```ts
animate({
    target: ".div",
    transform: ["translate(0px)", "translate(1000px)"],
});

// Or
// Same as ["translate(0px)", "translate(100px)"]
animate({
    target: ".div",
    keyframes: [
        { transform: "translate(0px)" },
        { transform: "translate(100px)" },
    ],
});
```

*Note: you can only use one of these formats for an animation, and if `Animate` sees the `keyframes` property, it ignores all other css properties, in situations where `Animate` sees the keyframes property it will still accept animation properties like `easing`, `duration`, etc...*

These arrays can optionally be returned by a callback that takes the index of each element, the total number of elements, and each specific element, just like with other properties.

```ts
// First element translates by 100px, second element by 200px, etc.
animate({
    target: ".div",
    transform(index) {
        return ["translate(0px)", `translate(${(index + 1) * 100}px)`];
    },
});

// Or
// Same as above
animate({
    target: ".div",
    keyframes(index) {
        return [
            { transform: "translate(0px)" },
            { transform: `translate(${(index + 1) * 100}px)` },
        ];
    },
});
```

### Animation Options & CSS Properties as Methods

### Transformable CSS Properties


### Animation Progress and the requestAnimationFrame

### Promises and Promise-Like


### Events

### Custom Easing



### Destroyable Animate

Remove elements and animations from the DOM when the `.stop()` method is called. Read more on the [Destroyable Animate docs](/docs/animate/api/destroyable-animate.md)

### TweenAttributes & tweenAttr

Create morphing animations using the `tweenAttr` method, read more on the [tween attributes doc](/docs/animate/api/tween-attributes.md).

### Effects

Use pre-made effects in `@okikio/animate`, for example, the `animate.css` effects can be used via `@shoelace-style/animations`, read the [effects doc](/docs/animate/api/effects.md), to learn more.

### Methods & properties

Read through the [methods and properties doc](/docs/animate/api/methods-and-properties.md), to learn some of the most usefull methods and properties of `Animate` class.

### Complete API Documentation

Not all available methods and properties are listed here (otherwise this README would be too long), go through the [API documentation](/docs/api/modules/_okikio_animate.md) for the full documented API.