/**
 * Acts as an enhanced version of the Map class with new features and changed behavior for convenience
 *
 * @typeParam K - the type of keys to store use to store values
 * @typeParam V - the type of values to store
 * */
export class Manager<K, V> {
	/** For backward compatability and performance reasons Manager use Map to store data */
	public map: Map<K, V>;
	constructor(value?: Array<[K, V]>) {
		this.map = new Map(value);
	}

	/** Returns the Manager classes base Map */
	public getMap(): Map<K, V> {
		return this.map;
	}

	/** Get a value stored in the Manager */
	public get(key: K): V {
		return this.map.get(key);
	}

	/** Returns the keys of all items stored in the Manager as an Array */
	public keys(): Array<K> {
		return Array.from(this.map.keys());
	}

	/** Returns the values of all items stored in the Manager as an Array */
	public values(): Array<V> {
		return Array.from(this.map.values());
	}

	/** Set a value to the Manager using a key */
	public set(key: K, value: V): Manager<K, V> {
		this.map.set(key, value);
		return this;
	}

	/** Adds a value to Manager, and uses the current size of the Manager as it's key, it works best when all the key in the Manager are numbers */
	public add(value: V): Manager<K, V> {
		let size = this.size;
		// @ts-ignore
		let num: K = size as K;
		this.set(num, value);
		return this;
	}

	/** Returns the total number of items stored in the Manager */
	public get size(): number {
		return this.map.size;
	}

	/** An alias for size */
	public get length(): number {
		return this.map.size;
	}

	/** Returns the last item in the Manager who's index is a certain distance from the last item in the Manager */
	public last(distance: number = 1): V | undefined {
		let key = this.keys()[this.size - distance];
		return this.get(key);
	}

	/** Removes a value stored in the Manager via a key, returns true if an element in the Map object existed and has been removed, or false if the element does not exist */
	public delete(key: K): boolean {
		return this.map.delete(key);
	}

	/** Removes a value stored in the Manager via a key, returns the Manager class, allowing for chains */
	public remove(key: K): Manager<K, V> {
		this.map.delete(key);
		return this;
	}

	/** Clear the Manager of all its contents */
	public clear(): Manager<K, V> {
		this.map.clear();
		return this;
	}

	/** Checks if the Manager contains a certain key */
	public has(key: K): boolean {
		return this.map.has(key);
	}

	/** Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order. */
	public entries(): IterableIterator<[K, V]> {
		return this.map.entries();
	}

	/** Iterates through the Managers contents, calling a callback function every iteration */
	public forEach(
		callback: (value?: V, key?: K, map?: Map<K, V>) => void,
		context?: object
	): Manager<K, V> {
		this.map.forEach(callback, context);
		return this;
	}

	/** Allows for iteration via for..of, learn more: [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators] */
	public [Symbol.iterator](): IterableIterator<[K, V]> {
		return this.entries();
	}
}

/**
 * Calls the method of a certain name for all items that are currently installed
 */
export const methodCall = (manager: Manager<any, any>, method: string, ...args: any): void => {
	manager.forEach((item) => {
		// @ts-ignore
		item[method](...args);
	});
};

export default Manager;
