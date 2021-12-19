## Events

There are `8` events in total, they are:

- "update"
- "play"
- "pause"
- "begin"
- "finish"
- "cancel"
- "error"
- "stop"
- "playstate-change"

```ts
/* 
    The update event is triggered continously while an animation is playing, it does this by calling requestAnimationFrame.
    By default, whenever an animation is played, the current Animate instance is added to `Animate.RUNNING` WeakSet and 
    a requests for an animation frame is called, where it checks if there are any listeners for the "update" event. 
    If there are none, the Animate instance is removed from the `Animate.RUNNING` WeakSet. 
    If there are listeners the Animate instances loop method is called, and the "update" event is emitted every frame until,
    the Animation is done, where it stops

    If there are no Animate instances in the `Animate.RUNNING` WeakSet, the requestAnimationFrame loop, is stopped, 
    until there are other Animate instances that are played
*/
....on("update", (progress, instance) => {
    /**
     * @param {number} progress - it is the animation progress from 0 to 100
     * @param {Animate} instance - it is the instance of Animate the update event is triggered from
    */
});

// The play & pause events are triggered when the Animate.prototype.play() or .pause() methods are called.
// The "playstate-change" event occurs when the playstate changes, so, when the animation is played, paused, cancelled, or finished
....on("play" | "pause" | "playstate-change", (playstate, instance) => {
    /**
     * @param {"idle" | "running" | "paused" | "finished"} playstate - it is the animations play state
     * @param {Animate} instance - it is the instance of Animate the event is triggered from
    */
});

// The begin, finish, and cancel events are triggered when all animations in an instance of Animate begin, finish or are cancelled.

// The begin event occurs at the begining of all animations and its when the the Animate instance has started, while the finish event is when all animations (taking into account the endDelay and loops as well) have ended.
// Note: By the time events are registered the animation would have started and there wouldn't have be a `begin` event listener to actually emit, so,
// the `begin` event emitter is wrapped in a setTimeout of 0ms so that the event can be defered; by the end of the timeout the rest of the js to run,
// the `begin` event to be registered thus the `begin` event can be emitter

// The cancel event occurs when the mainElement animation is cancelled or the `.cancel()` method is called
....on("begin" | "finish" | "cancel", (instance) => {
    /**
     * @param {Animate} instance - it is the instance of Animate the event is triggered from
    */
});

// The error event is triggered when an error occurs in the `Animate` setup
....on("error", (err) => {
    /**
     * @param {Error} err - the error message
    */
});

// The stop event is triggered when an `Animate` instance has been permanently stopped via the `.stop()` method.
....on("stop", () => { });
```