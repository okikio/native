---
layout: layout:PagesLayout
---
## Browser support

`@okikio/native` is provided as a native ES6 module, which means you may need to transpile it depending on your browser support policy. The library works using `<script type="module">` in
the following browsers (`@okikio/native` may support older browsers, but I haven't tested those browsers):

- Chrome > 51
- Edge > 14
- Firefox > 54

I recommend **only** using `@okikio/native` on browsers that support `ES6+`, the experience on older legacy browsers can be hit or miss, so, it's better to support only `ES6+` browsers.


## Polyfills & Bundling

If you install [@okikio/native](/docs/native/) via [npm](https://www.npmjs.com/package/@okikio/native) you are most likely going to need [rollup](https://rollupjs.org/) or [esbuild](https://esbuild.github.io/).

You will need Promise, Object.values, Array.from, Array.prototype.includes, and fetch polyfills for older browsers.

You can use [polyfill.io](https://polyfill.io/), or another source to create a polyfill. The minimum feature requirement for a polyfill are Promise, and fetch e.g. <https://cdn.polyfill.io/v3/polyfill.min.js?features=default,es2015,es2018,Array.prototype.includes,Object.values,Promise,fetch>.