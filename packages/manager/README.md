# Manager

A superset of the Map class called Manager that manages complex amounts of data.

## Table of Contents
- [Manager](#manager)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Getting started](#getting-started)
  - [API](#api)
      - [Manager#getMap()](#managergetmap)
      - [Manager#add(value)](#manageraddvalue)
      - [Manager#keys()](#managerkeys)
      - [Manager#values()](#managervalues)
      - [Manager#last(distance)](#managerlastdistance)
      - [Manager#prev()](#managerprev)
      - [Manager#methodCall(method, ...)](#managermethodcallmethod-)
      - [Manager#asyncMethodCall(method, ...)](#managerasyncmethodcallmethod-)
      - [Manager#@@iterator](#manageriterator)


## Installation
You can install Manager from `npm` via `npm i managerjs` or `yarn add managerjs`. You can use Manager on the web via [unpkg](https://unpkg.com/managerjs@latest/lib/api.umd.js) `https://unpkg.com/managerjs@latest/lib/api.umd.js` or [jsdelivr](https://cdn.jsdelivr.net/npm/managerjs@latest/lib/api.umd.js) `https://cdn.jsdelivr.net/npm/managerjs@latest/lib/api.umd.js`.

Once installed it can be used like this:
```javascript
import { Manager } from "managerjs";
import { Manager } from "https://unpkg.com/managerjs@latest/lib/api.umd.js) `https://unpkg.com/managerjs@latest/lib/api.es.js";
// Or
import { Manager } from "https://unpkg.com/managerjs@latest/lib/api.umd.js) `https://unpkg.com/managerjs@latest/lib/api.modern.js";

// Via script tag
<script src="https://unpkg.com/managerjs@latest/lib/api.umd.js"></script>
// Do note, on the web you need to do this, if you installed it via the script tag:
const { Manager } = window.managerjs;
```


## Getting started

The Manager class makes Maps easier to use, as well as adding 6 methods, **getMap**, **last**, **prev**, **methodCall**, **asyncMethodCall**, **add**, **keys** and **values** (the behavior of the keys and values methods are slightly modified, to return an Array of keys/values instead of an iterator).

## API

All the existing Map methods, and ...

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
const arr = Array.from([1, 2, 3, 4, 5].entries());
const manager = new Manager(arr);
console.log(manager.last()); //= 5
console.log(manager.last(3)); //= 3
```


#### Manager#prev()
```js
Manager.prototype.prev();

/**
 * Returns the second last item in the Manager
 *
 * @public
 * @returns V
 */

// Example:
const arr = Array.from([1, 2, 3, 4, 5].entries());
const manager = new Manager(arr);
console.log(manager.prev()); //= 4
```


#### Manager#methodCall(method, ...)
```js
Manager.prototype.methodCall(method: string, ...args: any);

/**
 * Calls a method for all items that are currently in it's list
 *
 * @param {string} method
 * @param {Array<any>} [args=[]]
 * @returns Manager<K, V>
 * @memberof Manager
 */

// Example:
const manager = new Manager();
manager.set("x", { print: console.log });
manager.set("y", { print: console.log });
manager.methodCall("print", Date.now());
```

#### Manager#asyncMethodCall(method, ...)
```js
Manager.prototype.asyncMethodCall(method: string, ...args: any[]);

/**
 * Asynchronously calls a method for all items that are currently in it's map, similar to methodCall except the loop waits for the asynchronous method to run, before the loop continues on to the the next method
 *
 * @param {string} method
 * @param {Array<any>} [args=[]]
 * @returns Promise<Manager<K, V>>
 * @memberof Manager
 */

// Example:
const manager = new Manager();
let fn = (url = "https://google.com") => {
    return async () => {
        let data = await fetch(url);
        console.log(`(${data.url})`);
    };
};

manager.set("x", { print: fn() });
manager.set("y", { print: fn("https://github.com") });
manager.asyncMethodCall("print"); //= (https://www.google.com/), (https://github.com/)
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
const arr = Array.from([1, 2, 3, 4, 5].entries());
const manager = new Manager(arr);
for (let [key, value] of manager) {
    console.log({ key, value }); //= { key: ..., value: ... }
}
```

