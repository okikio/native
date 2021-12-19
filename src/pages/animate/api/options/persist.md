---
layout: layout:PagesLayout
---
### persist

| Default | Type    |
| :------ | :------ |
| `true`  | Boolean |

Persists animation state, so, when an animation is complete it keeps said finished animation state. 
Think of it more like a less strict version of [IAnimationOptions.fillMode](/docs/api/interfaces/_okikio_animate.IAnimationOptions.html#fillMode), it was inspired by [motion one](https://motion.dev/).

By default WAAPI resets animations back to their initial state once an animation is complete and fillMode isn't being used. The persist animation option, basically tells Animate to find the final state of all CSS Properties being animated, and then set them, so, once the animation is finished and WAAPI resets animations back to their initial state (so `initial state = final state`) the user doesn't notice difference and it looks like the animation stopped on the final state.

> _**Note**: use this most of the time instead of `fillMode`, as it's impact is less permanent._