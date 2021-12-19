---
layout: layout:PagesLayout
---
### target(s)

| Default     | Type                                                                                                 |
| :---------- | :--------------------------------------------------------------------------------------------------- |
| `undefined` | AnimationTarget = string \| Node \| NodeList \| HTMLCollection \| HTMLElement[] \| AnimationTarget[] |

Determines the DOM elements to animate. You can pass it a CSS selector, DOM elements, or an Array of DOM Elements and/or CSS Selectors.

```ts
animate({
    target: document.body.children, // You can use either `target` or `targets` for your animations
    // or
    // target: ".div",
    // target: document.querySelectorAll(".el"),
    // target: [document.querySelectorAll(".el"), ".div"]",
    // targets: [document.querySelectorAll(".el"), ".div"]",
    transform: ["rotate(0turn)", "rotate(1turn)"],
});
```