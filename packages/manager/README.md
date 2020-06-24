# Manager

A superset of the Map class called Manager that allows for complex management of data.

## Getting started

The Manager class makes Maps easier to use, as well as adding 5 methods, **last**, **prev**, **methodCall**, **asyncMethodCall**, **add**, **keys** and **values** (the behavior of the keys and values methods are slightly modified, to return an Array of keys/values instead of an iterator).

### Methods

All the existing Map methods, and ...

#### Manager#getMap
```js
Manager.prototype.getMap();

/**
 * Returns the Manager class's list
 *
 * @returns Map<K, V>
 * @memberof Manager
 */

// Example:
const arr = Array.from([1, 2, 3, 4, 5].entries());
const manager = new Manager(arr);
console.log(manager.getMap()); //= Map(5) { 0 => 1, 1 => 2, 2 => 3, 3 => 4, 4 => 5 }
```

#### Manager#add
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


#### Manager#keys
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


#### Manager#values
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


#### Manager#last
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


#### Manager#prev
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


#### Manager#methodCall
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


#### Manager#asyncMethodCall
```js
Manager.prototype.asyncMethodCall(method: string, ...args: any[]);

/**
 * Asynchronously calls a method for all items that are currently in it's list, similar to methodCall except the loop waits for the asynchronous method to run, before the loop continues on to the the next method
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

