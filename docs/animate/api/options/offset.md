### offset

| Default     | Type                                                                                                                  |
| :---------- | :-------------------------------------------------------------------------------------------------------------------- |
| `undefined` | (Number \| String)[] \| [TypeCallback](https://okikio.github.io/native/api/modules/_okikio_animate.html#typecallback) |

Controls the starting point of certain parts of an animation.

The offset of the keyframe specified as a number between `0.0` and `1.0` inclusive or null. This is equivalent to specifying start and end states in percentages in CSS stylesheets using @keyframes. If this value is null or missing, the keyframe will be evenly spaced between adjacent keyframes.

Read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats)

```ts
animate({
    duration: 2000,
    opacity: [ 0, 0.9, 1 ],
    easing: [ 'ease-in', 'ease-out' ],

    offset: [ "from", 0.8 ], // Shorthand for [ 0, 0.8, 1 ]
    // or
    offset: [ 0, "80%", "to" ], // Shorthand for [ 0, 0.8, 1 ]
    // or
    offset: [ "0", "0.8", "to" ], // Shorthand for [ 0, 0.8, 1 ]
});
```
