---
layout: layout:PagesLayout
---
## Browser & Node support

`@okikio/manager` is provided as a native ES6 module, which means you may need to transpile it depending on your browser support policy. The library works using `<script type="module">` in the following browsers:

- Chrome > 38
- Edge > 12
- Firefox > 13
- IE > 11

`@okikio/manager` doesn't rely on any browser specific api's, so, you can use it in Node js without much worry.

## Polyfills & Bundling

If you install [@okikio/manager](/docs/manager/) via [npm](https://www.npmjs.com/package/@okikio/manager) you are most likely going to need [rollup](https://rollupjs.org/) or [esbuild](https://esbuild.github.io/).

You will most likely need Object.values, Array.prototype.includes and Array.from polyfills.

You can use [polyfill.io](https://polyfill.io/), or another source to create a polyfill. You can use this polyfill for you projects e.g. <https://cdn.polyfill.io/v3/polyfill.min.js?features=default,es2015,es2018,Array.prototype.includes,Object.values>
