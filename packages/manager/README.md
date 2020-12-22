# @okikio/manager

A superset of the Map class, it gives Map superpowers, it weighs less than 450 B (minified and compressed).

*You will need a Map polyfill for older browsers. If you install `@okikio/manager` via `npm` you are most likely going to need [rollup](https://rollupjs.org/) or [esbuild](https://esbuild.github.io/). You can use [polyfill.io](https://polyfill.io/), or another source to create a polyfill. The minimum feature requirement for a polyfill are Maps e.g. [https://polyfill.io/v3/polyfill.min.js?features=Maps](https://polyfill.io/v3/polyfill.min.js?features=Maps).*

## Table of Contents
- [@okikio/manager](#okikiomanager)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Getting started](#getting-started)
  - [API](#api)
      - [Existing Map Methods](#existing-map-methods)
      - [Manager#length](#managerlength)
      - [Manager#getMap()](#managergetmap)
      - [Manager#add(value)](#manageraddvalue)
      - [Manager#remove(key)](#managerremovekey)
      - [Manager#keys()](#managerkeys)
      - [Manager#values()](#managervalues)
      - [Manager#last(distance)](#managerlastdistance)
      - [Manager#@@iterator](#manageriterator)
      - [#methodCall(method, ...)](#methodcallmethod-)
      - [#asyncMethodCall(method, ...)](#asyncmethodcallmethod-)


## Installation
You can install Manager from `npm` via `npm i @okikio/manager` or `yarn add @okikio/manager`. You can use Manager on the web via [unpkg](https://unpkg.com/@okikio/manager@latest/lib/api.modern.js) `https://unpkg.com/@okikio/manager@latest/lib/api.modern.js`, [skypack](https://cdn.skypack.dev/@okikio/manager) `https://cdn.skypack.dev/@okikio/manager` or [jsdelivr](https://cdn.jsdelivr.net/npm/@okikio/manager@latest/lib/api.modern.js) `https://cdn.jsdelivr.net/npm/@okikio/manager@latest/lib/api.modern.js`.

Once installed it can be used like this:
```javascript
import { Manager } from "@okikio/manager";
import { Manager } from "https://unpkg.com/@okikio/manager@latest/lib/api.modern.js";
import { Manager } from "https://cdn.jsdelivr.net/npm/@okikio/manager@latest/lib/api.modern.js";
// Or
import { Manager } from "https://cdn.skypack.dev/@okikio/manager";

// Via script tag
<script src="https://unpkg.com/@okikio/manager@latest/lib/api.js"></script>
// Do note, on the web you need to do this, if you installed it via the script tag:
const { Manager, methodCall } = window.manager;
// or
const { default: Manager, methodCall } = window.manager;
```

## Getting started

The Manager class makes Maps easier to use, as well as adding 7 methods, **getMap**, **last**, **methodCall**, **asyncMethodCall**, **add**, **remove**, **keys** and **values**, (**methodCall**, and **asyncMethodCall** are seperate from the Manager class, so treeshaking can get rid of them if they aren't need).

*Note: the behavior of the keys and values methods are slightly modified, to return an Array of keys/values instead of an iterator. You can get the keys and values original effects by using ...getMap().keys() or ...getMap().values().*

## API

#### Existing Map Methods
* Manager.prototype.get(key: K)
  * Returns a specified element from a Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map object.
* Manager.prototype.set(value: V)
  * Adds or updates an element with a specified key and a value to a Map object.
  * Note: Techincally the values being returned are different from a normal Map. The Map set returns the Map class while the Manager set return the Manager class, this shouldn't leave much of an effect on use, but should be kept in mind.
* Manager.prototype.size
  * Returns the number of elements in a Map object.
* Manager.prototype.delete(key: K)
  * Removes the specified element from a Map object by key. Returns true if an element in the Map object existed and has been removed, or false if the element does not exist.
* Manager.prototype.entries()
  * Returns a new Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
* Manager.prototype.has()
  * Returns a boolean indicating whether an element with the specified key exists or not, true if an element with the specified key exists in the Map object; otherwise false.
* Manager.prototype.forEach(callback: Function,context?: object)
  * Executes a provided function once per each key/value pair in the Map object, in insertion order.
  * Returns the Manager class (it is chainable).

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

#### Manager#remove(key)
```js
Manager.prototype.remove(key: K);

/**
 * Removes a value stored in the Manager, via the key, returns the Manager class, allowing for chains
 * Similar to `Manager.prototype.delete`, except it is chainable, and returns the Manager class.
 *
 * @public
 * @param  {K} key - The key for the key value pair to be removed
 * @returns Manager<K, V>
 */

// Example:
import Manager from "@okikio/manager";

const arr = Array.from([1, 2, 3, 4, 5].entries());
const manager = new Manager(arr);
manager.remove(2).remove(1);
console.log(manager.get(1)); //= undefined
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
