### direction

| Default  | Type                                                                                                    |
| :------- | :------------------------------------------------------------------------------------------------------ |
| `normal` | String \| [TypeCallback](https://okikio.github.io/native/api/modules/_okikio_animate.html#typecallback) |

Determines the direction of the animation, the directions available are:

- `reverse` runs the animation backwards,
- `alternate` switches direction after each iteration if the animation loops.
- `alternate-reverse` starts the animation at what would be the end of the animation if the direction were
- `normal` but then when the animation reaches the beginning of the animation it alternates going back to the position it started at.