## Animation Progress and the requestAnimationFrame

The Web Animation API doesn't allow for keeping track of the progress in a clean way, so, we are forced to use `requestAnimationFrame` to check the current progress of an animation, however, doing, so, can actually decrease framerates, so, I built a system to call `requestAnimationFrame` less often.

`@okikio/animate` stores running `Animate` instances in a Set stored in the `Animate` class's static RUNNING property, however, it only stores instances that have registered "update" event listeners.

When an Animate instance is played, it gets added to the RUNNING Set, `Animate.requestFrame()` is then called and a single `requestAnimationFrame` runs for all Animate instances in the RUNNING set. If after a couple frames a Animate instance doesn't have an attached "update" event listener it is automatically removed from the RUNNING Set (**Note**: Animate instances that are finished are also auto-removed, and if there are no Animate instances in the RUNNING Set the requestAnimationFrame is cancelled).

For you to better understand check this out (this is meant for visiualization, avoid directly interacting with these),

```ts
import { Animate } from "@okikio/"
Animate.RUNNING = new Set();

let instance = new Animate({ /* .... */ });
instance.on("update", () => console.log("It works"));

if (instance.emitter.getEvent("update").length > 0) {
    Animate.RUNNING.add(instance);
    if (Animate.animationFrame == null) Animate.requestFrame();
} 
```

If you add an "update" event listener to an Animate instance, the Animate instance is added to the RUNNING Set, and if a `requestAnimationFrame` isn't already running it will request a new one.

By default `requestAnimationFrame` is now throttled to match a maximum frame rate of 60 fps (frames per second). You can change the frame rate by setting `Animate.FRAME_RATE` to your preferred frame rate.

_**Note**: the frame rate affects `tweenAttr`, as it uses the "update" event to animation attributes._

```ts
Animate.FRAME_RATE = 30; // 30 fps
```