# @okikio/emitter

[![npm](https://img.shields.io/npm/v/@okikio/emitter?style=for-the-badge)](https://www.npmjs.com/package/@okikio/emitter) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/@okikio/emitter?style=for-the-badge)](https://bundlephobia.com/package/@okikio/emitter) ![GitHub issues](https://img.shields.io/github/issues/okikio/native?style=for-the-badge) ![GitHub](https://img.shields.io/github/license/okikio/native?style=for-the-badge)

A small Event Emitter written in typescript with performance and ease of use in mind, it weighs **~838 B** (minified and gzipped).

*You will need a Map and Promise polyfill for older browsers. If you install `@okikio/emitter` via [npm](https://www.npmjs.com/package/@okikio/emitter) you are most likely going to need [rollup](https://rollupjs.org/) or [esbuild](https://esbuild.github.io/). You can use [polyfill.io](https://polyfill.io/), or another source to create a polyfill. The minimum feature requirement for a polyfill are Maps and Promises e.g. [https://polyfill.io/v3/polyfill.min.js?features=Promise,Map](https://polyfill.io/v3/polyfill.min.js?features=Promise,Map).*

You can try out `@okikio/emitter` using Gitpod:

[![Open In Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/okikio/native/blob/beta/packages/emitter/README.md)

By default Gitpod will start the dev script for you, but if you need to restart the dev script you can do so by typing into the terminal.

```bash
pnpm test-dev --filter "@okikio/emitter"
```

You can run `@okikio/emitter` locally by first installing some packages via these commands into your terminal,

```bash
npm install -g pnpm && pnpm install -g gulp ultra-runner commitizen && pnpm install && pnpm build
```

You can build your changes/contributions using,

```bash
pnpm build
```

You can test your changes/contributions using,

```bash
pnpm test-dev --filter "@okikio/emitter"
```

Once Gitpod has booted up, go to [./tests/test.ts](./tests/test.ts) and start tweaking and testing to your hearts content.

## Table of Contents

- [@okikio/emitter](#okikioemitter)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Getting started](#getting-started)
    - [API Documentation](#api-documentation)
  - [API](#api)
      - [EventEmitter#on(events, callback, scope) & EventEmitter#emit(events, ...args)](#eventemitteronevents-callback-scope--eventemitteremitevents-args)
      - [EventEmitter#off(events, callback, scope)](#eventemitteroffevents-callback-scope)
      - [EventEmitter#once(events, callback, scope)](#eventemitteronceevents-callback-scope)
  - [Contributing](#contributing)
  - [Licence](#licence)

## Installation

You can install [@okikio/emitter](https://www.skypack.dev/view/@okikio/emitter) from [npm](https://www.npmjs.com/package/@okikio/emitter) via `npm i @okikio/emitter`, `pnpm i @okikio/emitter` or `yarn add @okikio/emitter`.

You can use `@okikio/emitter` on the web via:

- [https://unpkg.com/@okikio/emitter/lib/api.es.js](https://unpkg.com/@okikio/emitter@latest/lib/api.es.js),
- [https://cdn.skypack.dev/@okikio/emitter](https://cdn.skypack.dev/@okikio/emitter) or
- [https://cdn.jsdelivr.net/npm/@okikio/emitter/lib/api.es.js](https://cdn.jsdelivr.net/npm/@okikio/emitter/lib/api.es.js).

Once installed it can be used like this:

```typescript
import { EventEmitter } from "@okikio/emitter";
import { EventEmitter } from "https://unpkg.com/@okikio/emitter/lib/api.es.js";
import { EventEmitter } from "https://cdn.jsdelivr.net/npm/@okikio/emitter/lib/api.es.js";
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

### API Documentation

You can also go through the [API documentation](https://okikio.github.io/native/docs/modules/_okikio_emitter.html), for a more detailed documentation of the API.

## API

#### EventEmitter#on(events, callback, scope) & EventEmitter#emit(events, ...args)

```ts
/**
 * Adds a listener for a given event
 *
 * @param {EventInput} events
 * @param {ListenerCallback | object} callback
 * @param {object} scope
 * @returns EventEmitter
 * @memberof EventEmitter
 */

EventEmitter.prototype.on(events: EventInput, callback?: ListenerCallback | object, scope?: object);

/**
 * Call all listeners within an event
 *
 * @param {(string | Array<any>)} events
 * @param {...any} args
 * @returns EventEmitter
 * @memberof EventEmitter
 */

EventEmitter.prototype.emit(events: string | Array<any>, ...args: any);


// Example:
import EventEmitter from "@okikio/emitter";
const emitter = new EventEmitter();

let test = false;
let obj = { bool: false };
let counter = 0;
let on = emitter.on(
    "test",
    function (key, value) {
        test = [key, value];

        // `this` comes from `obj`, since it was set as the scope of this listener
        console.log(this.bool); //= false
    },
    obj // Binds the callback to the `obj` scope
)

// You can chain methods
.on(
    // You can listen for multiple events at the same time
    "test test1 test2", // You can also use arrays ["test", "test1", "test2"]
    function (key, value) {
        test = [value, key];
        counter++;
        console.log(this.bool); //= undefined
    }
    // You can also bind all event listener callbacks to the same scope, in this example I didn't
);

on.emit("test", 1, "true");
console.log(test); //= [1, "true"]

on.emit(
    "test test1 test2", // You can also use arrays ["test", "test1", "test2"]
    1, "true");
console.log(test); //= ["true", 1]
console.log(counter); //= 3

counter = 0;
let fn = function (i = 1) {
    return function (key, value) {
        test = [key, value];
        counter += i;
        console.log(this.bool); //= false
    };
};

// You can also use an object to listen for events
emitter.on(
    {
        play1: fn(),
        play2: fn(2),
        play3: fn(4)
    },
    obj // Bind all callbacks to the `obj` scope
);

// You can emit multiple events back to back
on.emit("play1 play2 play3 play1", "true", 1)
    .emit(["play1", "play2", "play3"], 1, "true");
console.log(test); //= [1, "true"]
console.log(counter); //= 15
```

#### EventEmitter#off(events, callback, scope)

```ts
EventEmitter.prototype.off(events: EventInput, callback?: ListenerCallback | object, scope?: object);

/**
 * Removes a listener from a given event, or completely removes an event
 *
 * @param {EventInput} events
 * @param {ListenerCallback | object} [callback]
 * @param {object} [scope]
 * @returns EventEmitter
 * @memberof EventEmitter
 */

// Example:
import EventEmitter from "@okikio/emitter";
const emitter = new EventEmitter();

/*
    `EventEmitter.prototype.off(...)` literally does the opposite of what `EventEmitter.prototype.on(...)` does,
    `EventEmitter.prototype.off(...)` removes Events and Event Listeners
*/
let counter = 0, fn, scope = { bool: false };
let on = emitter.on(
    // You can listen for multiple events at the same time
    "test test1 test2", // You can also use arrays ["test", "test1", "test2"]
    fn = function () {
        counter++;
    },
    scope
);

// To remove an entire Event, or multiple Events
emitter.off("test1 test2");

// To remove a specific listener you need the scope (if you didn't put anything as the scope when listening for an Event then you don't need a scope) and callback
emitter.off("test", fn, scope);

on.emit("test test1 test2"); // Nothing happens, there are no Events or listeners, so, it can't emit anything
console.log(counter); //= 0
```

#### EventEmitter#once(events, callback, scope)

```ts
/**
 * Adds a one time event listener for an event
 *
 * @param {EventInput} events
 * @param {ListenerCallback | object} callback
 * @param {object} scope
 * @returns EventEmitter
 * @memberof EventEmitter
 */

EventEmitter.prototype.once(events: EventInput, callback?: ListenerCallback | object, scope?: object);


// Example:
import EventEmitter from "@okikio/emitter";
const emitter = new EventEmitter();

/**
 * `EventEmitter#once(...)` supports everything `EventEmitter#on(...)` supports
 * except the event listeners can only be fired once
 * */
let test: boolean | any = false;
let obj = { bool: false };
let counter = 0;
let on: EventEmitter = emitter.once(
    "test test1 test2",
    function (key, value) {
        test = [key, value];
        counter++;

        // `this` comes from `obj`, since it was set as the scope of this listener
        console.log(this.bool); //= false
    },
    obj
);

on.emit("test test1 test2", 1, "true");
console.log(test); //= [1, "true"]
console.log(counter); //= 3

// Since event listeners registered using the `once` method can only be emitted once\
// The second `emit` actually does nothing
on.emit("test test1 test2", 1, "true");
console.log(test); //= [1, "true"]
console.log(counter); //= 3

// The "test" event has no listeners registered since, they have already been removed
console.log(on.get("test").size) //= 0
```

## Contributing

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request and I'll try to get to it.

_**Note**: all contributions must be done on the `beta` branch, using the Conventional Commits style._

*The `native` initiative uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) as the style of commit, we also use the [Commitizen CLI](http://commitizen.github.io/cz-cli/) to make commits easier.*

## Licence

See the [LICENSE](./LICENSE) file for license rights and limitations (MIT).
