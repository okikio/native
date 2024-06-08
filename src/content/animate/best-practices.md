## Pause Animation when Page is out of Focus

If the page looses focus, by default `Animate` will pause all playing animations until the user goes back to the page, however, this behavior can be changed by setting the `pauseOnPageHidden` static property to false.

_**Note**: you need to put this statemeant at the top of your document, before all `Animate` instances_

```ts
import { animate, Animate } from "@okikio/animate";
Animate.pauseOnPageHidden = false;
animate({
    // ...
})
```

## Memory Management

I have found that infinite CSS Animations tend to be the cause of high memory usage in websites. Javascript has become so efficient that it can effectively garbage collect js animations, however, I have also found it exceptionally difficult to manage looped animation so be very careful of memory when dealing with CSS and JS Animations, they eat up large ammounts of memory and CPU when left running for extended periods of time. I would suggest making all your animations only occur a couple times and when they are done use the `cancel()` (preference) or `stop()` methods, (you can use the `stop()` method *"if you **don't** plan on replaying the same animation"*). Don't just use the `stop()` method, test it first on your site before deploying it in a production enviroment.

## Best practices 

_These are from Animate Plus, but they are true for all Animation libraries_

Animations play a major role in the design of good user interfaces. They help connecting actions to consequences, make the flow of interactions manifest, and greatly improve the polish and perception of a product. However, animations can be damaging and detrimental to the user experience if they get in the way. Here are a few best practices to keep your animations effective and enjoyable:

- **Speed**: Keep your animations fast. A quick animation makes a software feel more productive and responsive. The optimal duration depends on the effect and animation curve, but in most cases you should likely stay under 500 milliseconds.
- **Easing**: The animation curve contributes greatly to a well-crafted animation. The easing "out" option is usually a safe bet as animations kick off promptly, making them react to user interactions instantaneously.
- **Performance**: Having no animation is better than animations that stutter. When animating HTML elements, aim for using exclusively `transform` and `opacity` as these are the only properties browsers can animate cheaply.
- **Restraint**: Tone down your animations and respect user preferences. Animations can rapidly feel overwhelming and cause motion sickness, so it's important to keep them subtle and to attenuate them even more for users who need reduced motion, for example by using `matchMedia("(prefers-reduced-motion)")` in JavaScript.