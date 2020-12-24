# @okikio/emitter

A small Event Emitter written in typescript with performance and ease of use in mind, it weighs less than 800 B (minified and compressed).

*You will need a Map polyfill for older browsers. If you install `@okikio/emitter` via `npm` you are most likely going to need [rollup](https://rollupjs.org/) or [esbuild](https://esbuild.github.io/). You can use [polyfill.io](https://polyfill.io/), or another source to create a polyfill. The minimum feature requirement for a polyfill are Maps e.g. [https://polyfill.io/v3/polyfill.min.js?features=Maps](https://polyfill.io/v3/polyfill.min.js?features=Maps).*





You can play with `@okikio/emitter` using Gitpod:

[![Edit with Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/okikio/native/tree/master/packages/emitter)

Once Gitpod has booted up, go to the `./test folder` and start tweaking and testing to your hearts content.


*Note: if an error occurs that stops the test script, just type into the terminal*
```bash
ultra test:watch
```

## Table of Contents
- [@okikio/emitter](#okikioemitter)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Getting started](#getting-started)
  - [API](#api)
      - [EventEmitter#on(events, callback, scope) & EventEmitter#emit(events, ...args)](#eventemitteronevents-callback-scope--eventemitteremitevents-args)
      - [EventEmitter#off(events, callback, scope)](#eventemitteroffevents-callback-scope)
  - [Contributing](#contributing)
  - [Licence](#licence)


## Installation
You can install `@okikio/emitter` from `npm` via `npm i @okikio/emitter` or `yarn add @okikio/emitter`. You can use `@okikio/emitter` on the web via:
* [https://unpkg.com/@okikio/emitter@latest/lib/api.modern.js](https://unpkg.com/@okikio/emitter@latest/lib/api.modern.js),
* [https://cdn.skypack.dev/@okikio/emitter](https://cdn.skypack.dev/@okikio/emitter) or
* [https://cdn.jsdelivr.net/npm/@okikio/emitter@latest/lib/api.modern.js](https://cdn.jsdelivr.net/npm/@okikio/emitter@latest/lib/api.modern.js).

Once installed it can be used like this:
```javascript
import { EventEmitter } from "@okikio/emitter";
import { EventEmitter } from "https://unpkg.com/@okikio/emitter@latest/lib/api.modern.js";
import { EventEmitter } from "https://cdn.jsdelivr.net/npm/@okikio/emitter@latest/lib/api.modern.js";
// Or
import { EventEmitter } from "https://cdn.skypack.dev/@okikio/emitter";

// Via script tag
<script src="https://unpkg.com/@okikio/emitter@latest/lib/api.js"></script>
// Do note, on the web you need to do this, if you installed it via the script tag:
const { default: EventEmitter } = window.emitter;
```

## Getting started

The `EventEmitter` class is what runs the show for the `@okikio/emitter` library. To use it properly you need to create a new instance of `EventEmitter`, the instance of `EventEmitter` is what allows for event emitting, and listening.

`EventEmitter` allows for an easy way to manage events. It inherits properties/methods from [@okiki/manager](https://www.npmjs.com/package/@okikio/manager).

```js
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

## API

#### EventEmitter#on(events, callback, scope) & EventEmitter#emit(events, ...args)
```js
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
    obj // Bind all callbacks to `obj` scope
);

// You can emit multiple events back to back
on.emit("play1 play2 play3 play1", "true", 1)
    .emit(["play1", "play2", "play3"], 1, "true");
console.log(test); //= [1, "true"]
console.log(counter); //= 15
```

#### EventEmitter#off(events, callback, scope)
```js
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
    `EventEmitter.prototype.off(...)` literally does the same thing `EventEmitter.prototype.on(...)` does except instead of listening for Events it removes Events and Event Listeners
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

## Contributing
If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request and I'll try to get to it.

## Licence
See the [LICENSE](./LICENSE) file for license rights and limitations (MIT).
