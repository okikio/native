# EventEmitter
A small Event Emitter written in typescript with performance and ease of use in mind.

## Table of Contents
- [EventEmitter](#eventemitter)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Getting started](#getting-started)
  - [API](#api)
      - [EventEmitter#on(events, callback, scope) & EventEmitter#emit(events, ...args)](#eventemitteronevents-callback-scope--eventemitteremitevents-args)
      - [EventEmitter#off(events, callback, scope)](#eventemitteroffevents-callback-scope)


## Installation
You can install Emitter from `npm` via `npm i @okikio/emitter` or `yarn add @okikio/emitter`. You can use Emitter on the web via [unpkg](https://unpkg.com/@okikio/emitter@latest/lib/api.js) `https://unpkg.com/@okikio/emitter@latest/lib/api.js`, [skypack](https://cdn.skypack.dev/@okikio/emitter) `https://cdn.skypack.dev/@okikio/emitter` or [jsdelivr](https://cdn.jsdelivr.net/npm/@okikio/emitter@latest/lib/api.js) `https://cdn.jsdelivr.net/npm/@okikio/emitter@latest/lib/api.js`.

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
const { EventEmitter } = window.EventEmitter;
```

## Getting started

Event Emitter allows for an easy way to manage events. It inherits properties/methods from [@okiki/manager](https://www.npmjs.com/package/@okikio/manager).

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
