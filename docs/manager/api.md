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

## Complete API Documentation

You can also go through the full [API documentation](https://okikio.github.io/native/api/modules/_okikio_manager.html), for a more detailed documentation of the API.
