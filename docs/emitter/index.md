# @okikio/emitter

[NPM](https://www.npmjs.com/package/@okikio/emitter) <span style="padding-inline: 1rem">|</span> [Github](https://github.com/okikio/native/tree/beta/packages/emitter#readme) <span style="padding-inline: 1rem">|</span> [API Guide](/docs/emitter/api.md) <span style="padding-inline: 1rem">|</span> [Licence](/packages/emitter/LICENSE) 

A small Event Emitter written in typescript with performance and ease of use in mind, it weighs **~834 B** (minified and gzipped).

## Installation

You can install [@okikio/emitter](/docs/emitter/index.md) from [npm](https://www.npmjs.com/package/@okikio/emitter) via 


```bash
npm i @okikio/emitter
```

<details>
<summary>Others</summary>

```bash
yarn add @okikio/emitter
```
or
```bash
pnpm i @okikio/emitter
```
</details>

<br/>

You can use `@okikio/emitter` on the web via:

- [https://unpkg.com/@okikio/emitter](https://unpkg.com/@okikio/emitter@latest)
- [https://cdn.skypack.dev/@okikio/emitter](https://cdn.skypack.dev/@okikio/emitter)
- [https://cdn.jsdelivr.net/npm/@okikio/emitter](https://cdn.jsdelivr.net/npm/@okikio/emitter)

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

`EventEmitter` allows for an easy way to manage events. It inherits properties/methods from [@okikio/manager](/docs/manager/index.md).

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

Read through the [API guide](/docs/emitter/api.md) to learn more.

## Browser & Node Support

| Chrome | Edge | Firefox | IE   |
| ------ | ---- | ------- | ---- |
| > 38   | > 12 | > 13    | > 11 |

Learn about polyfilling, bundling, and more in the [platform support guide](/docs/emitter/platform-support.md).

## Contributing

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request on the `beta` branch and I'll try to get to it.

Read through the [contributing documentation](/docs/emitter/contributing.md) for detailed guides.

## Licence

See the [LICENSE](/LICENSE) file for license rights and limitations (MIT).