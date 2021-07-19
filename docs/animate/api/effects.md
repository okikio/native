## Effects

You may want to use pre-made effects like the onces [animate.css](https://www.npmjs.com/package/animate.css) provide, I initially planned on bundling this functionality in, but because of the plentiful number of libraries that do the same thing, I suggest using those instead, and if you want to create your own effects from CSS, you can use CSS Keyframe style JSON object, make sure to read the documentation for [KeyframeParse](https://okikio.github.io/native/api/modules/_okikio_animate.html#keyframeparse)

I suggest [@shoelace-style/animations](https://www.npmjs.com/package/@shoelace-style/animations) for all your animate.css needs, you can use it like this,

```ts
import { animate } from "@okikio/animate";
import { bounce } from '@shoelace-style/animations';

animate({
    keyframes: bounce,
    loop: true,
    easing: "in-sine"
})
```

or

if you just need some quick effects go to [github.com/wellyshen/use-web-animations/](https://github.com/wellyshen/use-web-animations/tree/master/src/animations) and copy the `keyframes` array for the effect you want, remember to say thank you to [@wellyshen](https://github.com/wellyshen) for all his hardwork, 😂.
