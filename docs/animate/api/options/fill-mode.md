### fillMode

| Default | Type                                                                                                    |
| :------ | :------------------------------------------------------------------------------------------------------ |
| `auto`  | String \| [TypeCallback](https://okikio.github.io/native/api/modules/_okikio_animate.html#typecallback) |

_Be careful when using fillMode, it has some problems when it comes to concurrency of animations read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/fill), if browser support were better I would remove fillMode and use Animation.commitStyles, I'll have to change the way `fillMode` functions later. Use the onfinish method to commit styles [onfinish](/docs/animate/api/options/onfinish.md)._

Defines how an element should look after the animation. The fillModes availble are:

- `none` means the animation's effects are only visible while the animation is playing.
- `forwards` the affected element will continue to be rendered in the state of the final animation frame.
- `backwards` the animation's effects should be reflected by the element(s) state prior to playing.
- `both` combining the effects of both forwards and backwards; The animation's effects should be reflected by the element(s) state prior to playing and retained after the animation has completed playing.
- `auto` if the animation effect fill mode is being applied to is a keyframe effect. "auto" is equivalent to "none". Otherwise, the result is "both".

You can learn more here on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/fill).