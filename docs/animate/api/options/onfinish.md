### onfinish

| Default                                                                            | Type     |
| :--------------------------------------------------------------------------------- | :------- |
| `(element: HTMLElement, index: number, total: number, animation: Animation) => {}` | Function |

Occurs when the animation for one of the targets completes, meaning when animating many targets that finish at different times this will run multiple times. The arguments it takes is slightly different from the rest of the animation options.

The animation argument represents the animation for the current target.

**Warning**: the order of the callback's arguments are in a different order, with the target element first, and the index second.

```ts
// Avoid using fillMode, use this instead to commit style changes
// Do note endDelay delays the onfinish method
animate({
    target: ".div",
    opacity: [0, 1],

    /**
     * @param {HTMLElement} element - the current target element
     * @param {number} index - the index of the current target element in  `Animate.prototype.targets`
     * @param {number} total - the total number of target elements
     * @param {Animation} animation - the animation of the current target element
     */

    // Note the order of the arguments -- it's different from other properties
    onfinish(element, index, total, animation) {
        element.style.opacity = 0;
        console.log(
            `${
                index + 1
            } out of ${total}, elements have finished their animations. Animation playback speed is ${animation.playbackRate}`
        );
    },
});
```