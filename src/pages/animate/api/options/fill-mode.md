---
layout: layout:PagesLayout
---
### fillMode

| Default | Type                                                                        |
| :------ | :-------------------------------------------------------------------------- |
| `auto`  | String \| [TypeCallback](/docs/api/modules/_okikio_animate.md#typecallback) |

> _Be careful when using fillMode, it has some problems when it comes to concurrency of animations read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/fill). I highly suggest using [IAnimationOptions.persist](/docs/api/interfaces/_okikio_animate.IAnimationOptions.html#persist), as it's less permanent, or better yet use the [IAnimationOptions.onfinish(...)](/docs/api/interfaces/_okikio_animate.IAnimationOptions.html#onfinish) method, with [Animate.commitStyles(...)](/docs/api/classes/_okikio_animate.Animate.html#commitStyles) to commit styles._

Defines how an element should look after the animation. The fillModes availble are:

- `none` means the animation's effects are only visible while the animation is playing.
- `forwards` the affected element will continue to be rendered in the state of the final animation frame.
- `backwards` the animation's effects should be reflected by the element(s) state prior to playing.
- `both` combining the effects of both forwards and backwards; The animation's effects should be reflected by the element(s) state prior to playing and retained after the animation has completed playing.
- `auto` if the animation effect fill mode is being applied to is a keyframe effect. "auto" is equivalent to "none". Otherwise, the result is "both".

You can learn more here on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/fill).