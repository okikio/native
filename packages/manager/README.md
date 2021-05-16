# @okikio/manager

A superset of the Map class, it extends the Map classes capabilities with awesome new features; it weighs ~360 B (minified and gzipped).

*You will need a Map and Promise polyfill for older browsers. If you install `@okikio/manager` via [npm](https://www.npmjs.com/package/@okikio/manager) you are most likely going to need [rollup](https://rollupjs.org/) or [esbuild](https://esbuild.github.io/). You can use [polyfill.io](https://polyfill.io/), or another source to create a polyfill. The minimum feature requirement for a polyfill are Maps and Promises e.g. [https://cdn.polyfill.io/v3/polyfill.min.js?features=Maps,Promise](https://cdn.polyfill.io/v3/polyfill.min.js?features=Maps,Promise).*

You can try out `@okikio/manager` using Gitpod:

[![Open In Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/okikio/native/blob/master/packages/manager/README.md)

By default Gitpod will start the dev script for you, but if you need to restart the dev script you can do so by typing into the terminal.

```bash
pnpm test-dev --filter "@okikio/manager"
```

Once Gitpod has booted up, go to [./tests/test.ts](./tests/test.ts) and start tweaking and testing to your hearts content.

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
  - [Contributing](#contributing)
  - [Licence](#licence)

## Installation

You can install [@okikio/manager](https://www.skypack.dev/view/@okikio/manager) from [npm](https://www.npmjs.com/package/@okikio/manager) via `npm i @okikio/manager`, `pnpm i @okikio/animate` or `yarn add @okikio/manager`.

You can use `@okikio/manager` on the web via:

- [https://unpkg.com/@okikio/manager/lib/api.es.js](https://unpkg.com/@okikio/manager/lib/api.es.js),
- [https://cdn.skypack.dev/@okikio/manager](https://cdn.skypack.dev/@okikio/manager) or
- [https://cdn.jsdelivr.net/npm/@okikio/manager/lib/api.es.js](https://cdn.jsdelivr.net/npm/@okikio/manager/lib/api.es.js).

Once installed it can be used like this:

```typescript
import { Manager } from "@okikio/manager";
import { Manager } from "https://unpkg.com/@okikio/manager/lib/api.es.js";
import { Manager } from "https://cdn.jsdelivr.net/npm/@okikio/manager/lib/api.es.js";
// Or
import { Manager } from "https://cdn.skypack.dev/@okikio/manager";

// Via script tag
<script src="https://unpkg.com/@okikio/manager/lib/api.js"></script>
// Do note, on the web you need to do this, if you installed it via the script tag:
const { Manager, methodCall } = window.manager;
// or
const { default: Manager, methodCall } = window.manager;
```

## Getting started

The `Manager` class makes Maps easier to use, as well as adding 7 methods, **getMap**, **last**, **methodCall**, **asyncMethodCall**, **add**, **remove**, **keys** and **values**, (**methodCall**, and **asyncMethodCall** are seperate methods from the `Manager` class, so treeshaking can get rid of them if they aren't need).

***Note**: the behavior of the keys and values methods are slightly modified, to return an Array of keys/values instead of an iterator. You can get the keys and values original effects by using `.getMap().keys()` or `.getMap().values()`.*

## API

### Existing Map Methods

`Manager.prototype.get(key: K): V`

Returns a specified element from a Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map object.

`Manager.prototype.set(value: V): Manager`

Adds or updates an element with a specified key and a value to a Map object. Returns the Manager class (it is chainable).

***Note**: techincally the values being returned are different from a normal Map. The Map `.set()` method returns the Map class while the `Manager` `.set()` method return the `Manager` class, this shouldn't leave much of an effect on use, but should be kept in mind.*

`Manager.prototype.size: number`

Returns the number of elements in a Map object.

`Manager.prototype.delete(key: K): boolean`

Removes the specified element from a Map object by key. Returns true if an element in the Map object existed and has been removed, or false if the element does not exist.

`Manager.prototype.entries(): [[K, V], ...]`

Returns a new Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.

`Manager.prototype.has(): boolean`

Returns a boolean indicating whether an element with the specified key exists or not, true if an element with the specified key exists in the Map object; otherwise false.

`Manager.prototype.forEach(callback: Function,context?: object): Manager`

Executes a provided function once per each key/value pair in the Map object, in insertion order. Returns the `Manager` class (it is chainable).

### Manager#length

```ts
Manager.prototype.length

/**
 * Returns the total number of items stored in the Manager, an alias to Manger.prototype.size
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

### Manager#getMap()

```ts
Manager.prototype.getMap();

/**
 * Returns the Manager class as a Map
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

### Manager#add(value)

```ts
Manager.prototype.add(value: V);

/**
 * Adds a value to Manager, and uses the current size of the Manager as it's key, it works best when all the keys in the Manager are numbers
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

### Manager#remove(key)

```ts
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

### Manager#keys()

```ts
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

### Manager#values()

```ts
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

### Manager#last(distance)

```ts
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

### Manager#@@iterator

```ts
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

### #methodCall(method, ...)

```ts
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

### #asyncMethodCall(method, ...)

```ts
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

## Contributing

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request and I'll try to get to it.

*The `native` initiative uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) as the style of commit, we also use the [Commitizen CLI](http://commitizen.github.io/cz-cli/) to make commits easier.*

## Licence

See the [LICENSE](./LICENSE) file for license rights and limitations (MIT).
