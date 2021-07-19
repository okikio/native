# @okikio/manager

[![npm](https://img.shields.io/npm/v/@okikio/manager?style=for-the-badge)](https://www.npmjs.com/package/@okikio/manager) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/@okikio/manager?style=for-the-badge)](https://bundlephobia.com/package/@okikio/manager) [![GitHub](https://img.shields.io/github/license/okikio/native?style=for-the-badge)](../../LICENSE)

A superset of the Map class, it extends the Map classes capabilities with awesome new features; it weighs **~331 B** (minified and gzipped).


## Getting started

The `Manager` class makes Maps easier to use, as well as adding 7 methods, **getMap**, **last**, **methodCall**, **add**, **remove**, **keys** and **values**, (**methodCall** is a seperate method from the `Manager` class, so treeshaking can get rid of it, if it isn't need).

_**Note**: the behavior of the keys and values methods are slightly modified, to return an Array of keys/values instead of an iterator. You can get the keys and values original effects by using `.getMap().keys()` or `.getMap().values()`._

### Installation

You can install [@okikio/manager](https://www.skypack.dev/view/@okikio/manager) from [npm](https://www.npmjs.com/package/@okikio/manager) via `npm i @okikio/manager`, `pnpm i @okikio/animate` or `yarn add @okikio/manager`.

You can use `@okikio/manager` on the web via:

- [https://unpkg.com/@okikio/manager](https://unpkg.com/@okikio/manager),
- [https://cdn.skypack.dev/@okikio/manager](https://cdn.skypack.dev/@okikio/manager) or
- [https://cdn.jsdelivr.net/npm/@okikio/manager](https://cdn.jsdelivr.net/npm/@okikio/manager).

Once installed it can be used like this:

```typescript
// There is,
//      .cjs - Common JS Module
//      .mjs - Modern ES Module
//      .js - IIFE
import { Manager } from "@okikio/manager";
import { Manager } from "https://unpkg.com/@okikio/manager";
import { Manager } from "https://cdn.jsdelivr.net/npm/@okikio/manager";
// Or
import { Manager } from "https://cdn.skypack.dev/@okikio/manager";

// Via script tag
<script src="https://unpkg.com/@okikio/manager/lib/api.js"></script>
// Do note, on the web you need to do this, if you installed it via the script tag:
const { Manager, methodCall } = window.manager;
// or
const { default: Manager, methodCall } = window.manager;
```

## Usage

`@okikio/manager` is used the same way `Map` is used. Like this,

In `typescript`,
```ts
import { Manager } from "@okikio/manager";

let elements = new Manager<number, Node>();
let el = document.querySelector(".div");
elements.add(el);
elements.set(1, el.cloneNode());
```

In `javascript`,
```js
import { Manager } from "@okikio/manager";

let elements = new Manager();
let el = document.querySelector(".div");
elements.add(el);
elements.set(1, el.cloneNode());
```

Read through the [API guide](./api.md) to learn more. 

## Browser & Node Support

| Chrome | Edge | Firefox | IE   |
| ------ | ---- | ------- | ---- |
| > 38   | > 12 | > 13    | > 11 |

Learn about polyfilling, bundling, and more in the [platform support guide](./browser-and-node-support.md).

## Contributing

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request on the `beta` branch and I'll try to get to it.

Read through the [contributing documentation](./contributing.md) for detailed guides.