# Manager

A superset of the Map class, it makes a Map function more like a normal Object.

## Table of Contents
- [Manager](#manager)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Getting started](#getting-started)
  - [API](#api)
      - [Manager#length](#managerlength)
      - [Manager#getMap()](#managergetmap)
      - [Manager#add(value)](#manageraddvalue)
      - [Manager#keys()](#managerkeys)
      - [Manager#values()](#managervalues)
      - [Manager#last(distance)](#managerlastdistance)
      - [Manager#@@iterator](#manageriterator)
      - [#methodCall(method, ...)](#methodcallmethod)
      - [#asyncMethodCall(method, ...)](#asyncmethodcallmethod)


## Installation
You can install Manager from `npm` via `npm i @okikio/manager` or `yarn add @okikio/manager`. You can use Manager on the web via [unpkg](https://unpkg.com/@okikio/manager@latest/lib/api.umd.js) `https://unpkg.com/@okikio/manager@latest/lib/api.umd.js`, [skypack](https://cdn.skypack.dev/@okikio/manager) `https://cdn.skypack.dev/@okikio/manager` or [jsdelivr](https://cdn.jsdelivr.net/npm/@okikio/manager@latest/lib/api.umd.js) `https://cdn.jsdelivr.net/npm/@okikio/manager@latest/lib/api.umd.js`.

Once installed it can be used like this:
```javascript
import { Manager } from "@okikio/manager";
import { Manager } from "https://unpkg.com/@okikio/manager@latest/lib/api.mjs";
import { Manager } from "https://cdn.jsdelivr.net/npm/@okikio/manager@latest/lib/api.mjs";
// Or
import { Manager } from "https://cdn.skypack.dev/@okikio/manager";

// Via script tag
<script src="https://unpkg.com/@okikio/manager@latest/lib/api.umd.js"></script>
// Do note, on the web you need to do this, if you installed it via the script tag:
const { Manager, methodCall } = window.Manager;
```

## Getting started

The Manager class makes Maps easier to use, as well as adding 6 methods, **getMap**, **last**, **methodCall**, **asyncMethodCall**, **add**, **keys** and **values** (the behavior of the keys and values methods are slightly modified, to return an Array of keys/values instead of an iterator).

## API

All the existing Map methods, and ...

#### Manager#length
```js
Manager.prototype.length

/**
 * Returns the total number of items stored in the Manager
 *
 * @public
 * @returns Number
 */

// Example:
import Manager from "@okikio/manager";

const arr = Array.from([1, 2, 3, 4, 5].entries());
const manager = new Manager(arr);
console.log(manager.length); //= 5
```

#### Manager#getMap()
```js
Manager.prototype.getMap();

/**
 * Returns the Manager class's Map
 *
 * @returns Map<K, V>
 * @memberof Manager
 */

// Example:
import Manager from "@okikio/manager";

const arr = Array.from([1, 2, 3, 4, 5].entries());
const manager = new Manager(arr);
console.log(manager.getMap()); //= Map(5) { 0 => 1, 1 => 2, 2 => 3, 3 => 4, 4 => 5 }
```

#### Manager#add(value)
```js
Manager.prototype.add(value: V);

/**
 * Adds a value to Manager, and uses the current size of the Manager as it's key, it works best when all the key in the Manager are numbers
 *
 * @param  {V} value
 * @returns Manager<K, V>
 */

// Example:
import Manager from "@okikio/manager";

const arr = Array.from([1, 2, 3, 4, 5].entries());
const manager = new Manager(arr);
manager.add(6).add(7);
console.log(manager.get(5)); //= 6
```


#### Manager#keys()
```js
Manager.prototype.keys();

/**
 * Returns the keys of all items stored in the Manager as an Array
 *
 * @returns Array<K>
 * @memberof Manager
 */

// Example:
import Manager from "@okikio/manager";

const arr = Array.from([1, 2, 3, 4, 5].entries());
const manager = new Manager(arr);
console.log(manager.keys()); //= [0, 1, 2, 3, 4]
```


#### Manager#values()
```js
Manager.prototype.values();

/**
 * Returns the values of all items stored in the Manager as an Array
 *
 * @returns Array<V>
 * @memberof Manager
 */

// Example:
import Manager from "@okikio/manager";

const arr = Array.from([1, 2, 3, 4, 5].entries());
const manager = new Manager(arr);
console.log(manager.values()); //= [1, 2, 3, 4, 5]
```


#### Manager#last(distance)
```js
Manager.prototype.last(distance: number = 1);

/**
 * Returns the last item in the Manager who's index is a certain distance from the last item in the Manager
 *
 * @param {number} [distance=1]
 * @returns V
 * @memberof Manager
 */

// Example:
import Manager from "@okikio/manager";

const arr = Array.from([1, 2, 3, 4, 5].entries());
const manager = new Manager(arr);
console.log(manager.last()); //= 5
console.log(manager.last(3)); //= 3
```

#### Manager#@@iterator
```js
/**
 * Allows iteration via the for..of, learn more: [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators]
 *
 * @returns IterableIterator<[K, V]>
 * @memberof Manager
 */

// Example:
import Manager from "@okikio/manager";

const arr = Array.from([1, 2, 3, 4, 5].entries());
const manager = new Manager(arr);
for (let [key, value] of manager) {
    console.log({ key, value }); //= { key: ..., value: ... }
}
```

#### #methodCall(method, ...)
```js
methodCall(method: string, ...args: any);

/**
 * Calls the method of a certain name for all items that are currently installed
 *
 * @param {Manager<any, any>} manager
 * @param {string} method
 * @param {Array<any>} [args=[]]
 */

// Example:
import { Manager, methodCall } from "@okikio/manager";

const manager = new Manager();
manager.set("x", { print: console.log });
manager.set("y", { print: console.log });
methodCall(manager, "print", Date.now()); // Eg. 1598772789150, 1598772801639
```

#### #asyncMethodCall(method, ...)
```js
asyncMethodCall(method: string, ...args: any[]);

/**
 * Asynchronously calls the method of a certain name for all items that are currently installed, similar to methodCall
 *
 * @param {Manager<any, any>} manager
 * @param {string} method
 * @param {Array<any>} [args=[]]
 */

// Example:
import { Manager, asyncMethodCall } from "@okikio/manager";

const manager = new Manager();
let fn = (url = "https://google.com") => {
    return async () => {
        let data = await fetch(url);
        console.log(`(${data.url})`);
    };
};

manager.set("x", { print: fn() });
manager.set("y", { print: fn("https://github.com") });
asyncMethodCall(manager, "print"); //= (https://www.google.com/), (https://github.com/)
```
