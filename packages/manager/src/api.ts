/**
 * Manages complex lists of named data, eg. A page can be stored in a list by of other pages with the url being how the page is stored in the list. Managers use Maps to store data.
 *
 * @export
 * @class Manager
 * @template K
 * @template V
 */
export class Manager<K, V> {
	/**
	 * The complex list of named data, to which the Manager controls
	 *
	 * @public
	 * @type Map<K, V>
	 * @memberof Manager
	 */
	public map: Map<K, V>;

    /**
     * Creates an instance of Manager.
     *
     * @param {Array<[K, V]>} [value]
     * @memberof Manager
     */
	constructor(value?: Array<[K, V]>) {
		this.map = new Map(value);
	}

	/**
	 * Returns the Manager class's list
	 *
	 * @returns Map<K, V>
	 * @memberof Manager
	 */
	public getMap(): Map<K, V> {
		return this.map;
	}

	/**
	 * Get a value stored in the Manager
	 *
	 * @public
	 * @param  {K} key - The key to find in the Manager's list
	 * @returns V
	 */
	public get(key: K): V {
		return this.map.get(key);
	}

	/**
	 * Returns the keys of all items stored in the Manager as an Array
	 *
	 * @returns Array<K>
     * @memberof Manager
     */
	public keys(): Array<K> {
		return Array.from(this.map.keys());
	}

	/**
	 * Returns the values of all items stored in the Manager as an Array
	 *
	 * @returns Array<V>
     * @memberof Manager
	 */
	public values(): Array<V> {
		return Array.from(this.map.values());
	}

	/**
	 * Set a value stored in the Manager
	 *
	 * @public
	 * @param  {K} key - The key where the value will be stored
	 * @param  {V} value - The value to store
	 * @returns Manager<K, V>
	 */
	public set(key: K, value: V): Manager<K, V> {
		this.map.set(key, value);
		return this;
	}

    /**
     * Adds a value to Manager, and uses the current size of the Manager as it's key, it works best when all the key in the Manager are numbers
     *
     * @public
     * @param  {V} value
     * @returns Manager<K, V>
     */
	public add(value: V): Manager<K, V> {
		let size = this.size;
		// @ts-ignore
		let num: K = size as K;
		this.set(num, value);
		return this;
	}

	/**
	 * Returns the total number of items stored in the Manager
	 *
	 * @public
	 * @returns Number
	 */
	public get size(): number {
		return this.map.size;
	}
	
	public get length(): number {
		return this.map.size;
	}

    /**
	 * Returns the last item in the Manager who's index is a certain distance from the last item in the Manager
     *
     * @param {number} [distance=1]
     * @returns V | undefined
     * @memberof Manager
     */
	public last(distance: number = 1): V | undefined {
		let key = this.keys()[this.size - distance];
		return this.get(key);
	}

	/**
	 * Returns the second last item in the Manager
	 *
	 * @public
	 * @returns V
	 */
	public prev(): V {
		return this.last(2);
	}

	/**
	 * Removes a value stored in the Manager, via the key
	 *
	 * @public
	 * @param  {K} key - The key for the key value pair to be removed
	 * @returns Manager<K, V>
	 */
	public delete(key: K): Manager<K, V> {
		this.map.delete(key);
		return this;
	}

	/**
	 * Clear the Manager of all its contents
	 *
	 * @public
	 * @returns Manager<K, V>
	 */
	public clear(): Manager<K, V> {
		this.map.clear();
		return this;
	}

	/**
	 * Checks if the Manager contains a certain key
	 *
	 * @public
	 * @param {K} key
	 * @returns boolean
	 */
	public has(key: K): boolean {
		return this.map.has(key);
	}

	/**
	 * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
	 *
	 * @public
	 * @returns IterableIterator<[K, V]>
	 */
	public entries(): IterableIterator<[K, V]> {
		return this.map.entries();
	}

	/**
	 * Iterates through the Managers contents, calling a callback function every iteration
	 *
	 * @param {*} [callback=(...args: any): void => { }]
	 * @param {object} context
	 * @returns Manager<K, V>
	 * @memberof Manager
	 */
	public forEach(
		callback: any = (...args: any): void => { },
		context?: object
	): Manager<K, V> {
		this.map.forEach(callback, context);
		return this;
	}

    /**
     * Allows iteration via the for..of, learn more: [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators]
     *
     * @returns IterableIterator<[K, V]>
     * @memberof Manager
     */
	public [Symbol.iterator](): IterableIterator<[K, V]> {
		return this.entries();
	}
}

/**
 * Calls the method of a certain name for all items that are currently installed
 *
 * @param {Manager<any, any>} manager
 * @param {string} method
 * @param {Array<any>} [args=[]]
 */
export const methodCall = (manager: Manager<any, any>, method: string, ...args: any): void => {
	manager.forEach((item) => {
		// @ts-ignore
		item[method](...args);
	});
};

/**
 * Asynchronously calls the method of a certain name for all items that are currently installed, similar to methodCall
 *
 * @param {Manager<any, any>} manager
 * @param {string} method
 * @param {Array<any>} [args=[]]
 */
export const asyncMethodCall = async (manager: Manager<any, any>, method: string, ...args: any): Promise<void> => {
	for (let [, item] of manager) {
		// @ts-ignore
		await item[method](...args);
	}
};

export default Manager;
