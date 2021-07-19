# @okikio/emitter

[![npm](https://img.shields.io/npm/v/@okikio/emitter?style=for-the-badge)](https://www.npmjs.com/package/@okikio/emitter) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/@okikio/emitter?style=for-the-badge)](https://bundlephobia.com/package/@okikio/emitter) [![GitHub](https://img.shields.io/github/license/okikio/native?style=for-the-badge)](../../LICENSE)

A small Event Emitter written in typescript with performance and ease of use in mind, it weighs **~838 B** (minified and gzipped).


## Table of Contents

- [@okikio/emitter](#okikioemitter)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Getting started](#getting-started)
  - [Browser & Node Support](#browser--node-support)
  - [Contributing](#contributing)

## Installation

You can install [@okikio/emitter](https://www.skypack.dev/view/@okikio/emitter) from [npm](https://www.npmjs.com/package/@okikio/emitter) via `npm i @okikio/emitter`, `pnpm i @okikio/emitter` or `yarn add @okikio/emitter`.

You can use `@okikio/emitter` on the web via:

- [https://unpkg.com/@okikio/emitter](https://unpkg.com/@okikio/emitter@latest),
- [https://cdn.skypack.dev/@okikio/emitter](https://cdn.skypack.dev/@okikio/emitter) or
- [https://cdn.jsdelivr.net/npm/@okikio/emitter](https://cdn.jsdelivr.net/npm/@okikio/emitter).

Once installed it can be used like this:

```typescript
// There is,
//      .cjs - Common JS Module
//      .mjs - Modern ES Module
//      .js - IIFE
import { EventEmitter } from "@okikio/emitter";
import { EventEmitter } from "https://unpkg.com/@okikio/emitter";
import { EventEmitter } from "https://cdn.jsdelivr.net/npm/@okikio/emitter";
// Or
import { EventEmitter } from "https://cdn.skypack.dev/@okikio/emitter";

// Via script tag
<script src="https://unpkg.com/@okikio/emitter/lib/api.js"></script>
// Do note, on the web you need to do this, if you installed it via the script tag:
const { EventEmitter } = window.emitter;
```

## Getting started

The `EventEmitter` class is what runs the show for the `@okikio/emitter` library. To use it properly you need to create a new instance of `EventEmitter`, the instance of `EventEmitter` is what allows for event emitting, and listening.

`EventEmitter` allows for an easy way to manage events. It inherits properties/methods from [@okikio/manager](https://www.npmjs.com/package/@okikio/manager).

```ts
// You need to first initialize a new Event Emitter
const emitter = new EventEmitter();

// Then listen for an event
emitter.on("new-event", () => {
    console.log("A new event occured");
});

// Then emit or fire the event
setTimeout(() => {
    // Eg. after 3 seconds fire the `new-event` listener
    emitter.emit("new-event"); //= A new event occured
}, 3000);
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