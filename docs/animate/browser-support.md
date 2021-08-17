## Browser support

`@okikio/animate` is provided as a native ES6 module, which means you may need to transpile it depending on your browser support policy. The library works using `<script type="module">` in
the following browsers (`@okikio/animate` may support older browsers, but I haven't tested those browsers):

- Chrome > 84
- Edge > 84
- Firefox > 63

Determining compatability is a little difficult but the versions stated are the minimum versions of browsers where all of `@okikio/animate`'s features work without [polyfilling](#polyfills--bundling).

Below Chrome 84 you can't use the [updateOptions](http://127.0.0.1:3000/api/classes/_okikio_animate.animate.html#updateoptions) method to update animation keyframes, because browsers don't support [KeyframeEffect.setKeyframes()](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/setKeyframes), and anything below Chrome 75 you will need a polyfill.

The caniuse pages for the [Web Animation API](https://caniuse.com/web-animation), and [KeyframeEffect.setKeyframes()](https://caniuse.com/mdn-api_keyframeeffect_setkeyframes) do a good job of visualizing browser support (Chromium Based Edge supports everything Chrome does, so I don't know why caniuse says otherwise, but you should keep note of this before making a descision).

_**Note**: as it really difficult to get access to older versions of these browsers, I have only tested Chrome 84 and above._

## Polyfills & Bundling

If you install [@okikio/animate](/docs/animate/index.md) via [npm](https://www.npmjs.com/package/@okikio/animate) you are most likely going to need [rollup](https://rollupjs.org/) or [esbuild](https://esbuild.github.io/).

You will most likely need the Web Animation API, Promise, Object.values, Array.prototype.includes and Array.from polyfills.

You can use [web-animations-js](https://github.com/web-animations/web-animations-js), or [polyfill.io](https://polyfill.io/) to create a polyfill. The minimum feature requirement for a polyfill are Promise, and a Web Animation polyfill (that supports KeyframeEffect),
For a quick polyfill I suggest using both of these on your project.  

- <https://cdn.polyfill.io/v3/polyfill.min.js?features=default,es2015,es2018,Array.prototype.includes,Object.values,Promise>

- [https://cdn.jsdelivr.net/npm/web-animations-js/web-animations-next.min.js](https://cdn.jsdelivr.net/npm/web-animations-js/web-animations-next.min.js).

I suggest checking out the [demo](/build/ts/webanimation-polyfill.ts) to see how I setup the Web Animation Polyfill*

***Warning**: polyfilling may not fix animation format bugs, e.g. [composite animations](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/composite) don't work on older browsers, so, if you use `polyfill.io` and set it to check if the browser supports the feature before applying the polyfill, your project might encounter errors, as the browser may only have partial support of the Web Animation API.*
