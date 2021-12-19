---
layout: layout:PagesLayout
---
## Animation Options & CSS Properties as Methods

All options & properties except `target`, `targets`, `autoplay`, `extend`, `onfinish`, and `options` can be represented by a method with the arguments `(index: number, total: number, element: HTMLElement)`.

_Note: the `keyframes` animation option **can** be a method._

```ts
/**
 * @param {number} [index] - index of each element
 * @param {number} [total] - total number of elements
 * @param {HTMLElement} [element] - the target element
 * @returns any
 */

// For example
animate({
    target: ".div",
    opacity(index, total, element) {
        console.log(element);
        return [0, (index + 1) / total];
    },
    duration(index, total) {
        return 200 + (500 * (index + 1) / total);
    }
});
```