---
layout: layout:PagesLayout
---
### composite

The `composite` property of a `KeyframeEffect` resolves how an element's animation impacts its underlying property values.

To understand these values, take the example of a `keyframeEffect` value of `blur(2)` working on an underlying property value of `blur(3)`.

- `replace` - The keyframeEffect overrides the underlying value it is combined with: `blur(2)` replaces `blur(3)`.
- `add` - The keyframeEffect is added to the underlying value with which it is combined (aka additive):  `blur(2) blur(3)`.
- `accumulate` - The keyframeEffect is accumulated on to the underlying value: `blur(5)`.

Read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/composite)

I recommend reading [web.dev](https://web.dev)'s article on [web-animations](https://web.dev/web-animations/#smoother-animations-with-composite-modes).