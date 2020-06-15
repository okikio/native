# Manager
A superset of the Map class called Manager and Storage respectively that allows for complex management of data.


## Getting started
The Manager class makes Maps easier to use, as well as adding 5 methods, **last**, **prev**, **methodCall**, **asyncMethodCall**, and, **keys** (the behavior of the keys method is slightly modefied, to return an Array of keys instead of an iterator).

### Manager
All the existing Map methods, and ...

* ```js
  Manager.prototype.last(distance: number = 1)

  /**
   * Returns the last item in the Manager who's index is a certain distance from the last item in the Manager
   *
   * @param {number} [distance=1]
   * @returns V
   * @memberof Manager
   */

  // Example:
  const manager = new Manager([1, 2, 3, 4, 5]);
  console.log(manager.last()); //= 5
  console.log(manager.last(3)); //= 3
  ```


* ```js
  Manager.prototype.prev()

  /**
   * Returns the second last item in the Manager
   *
   * @public
   * @returns V
   */

  // Example:
  const manager = new Manager([1, 2, 3, 4, 5]);
  console.log(manager.prev()); //= 4
  ```


* ```js
  Manager.prototype.methodCall(method: string, ...args: any)
  
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



* ```js
  Manager.prototype.asyncMethodCall()

	/**
	 * Asynchronously calls a method for all items that are currently in it's list, similar to methodCall
	 *
	 * @param {string} method
	 * @param {Array<any>} [args=[]]
	 * @returns Promise<Manager<K, V>>
	 * @memberof Manager
	 */

  // Example:
  const manager = new Manager();
  manager.set("x", { 
    print: async () => fetch("https://google.com")
  });
  manager.set("y", { 
    print: async () => fetch("https://github.com")
  });
  manager.asyncMethodCall("print", Date.now()); //=
  ```
