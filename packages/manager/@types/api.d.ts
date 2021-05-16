/**
 * Acts as an enhanced version of the Map class with new features and changed behavior for convenience
 *
 * @typeParam K - the type of keys to store use to store values
 * @typeParam V - the type of values to store
 * */
export declare class Manager<K, V> {
    /** For backward compatability and performance reasons Manager use Map to store data */
    map: Map<K, V>;
    constructor(value?: Array<[K, V]>);
    /** Returns the Manager classes base Map */
    getMap(): Map<K, V>;
    /** Get a value stored in the Manager */
    get(key: K): V;
    /** Returns the keys of all items stored in the Manager as an Array */
    keys(): Array<K>;
    /** Returns the values of all items stored in the Manager as an Array */
    values(): Array<V>;
    /** Set a value to the Manager using a key */
    set(key: K, value: V): Manager<K, V>;
    /** Adds a value to Manager, and uses the current size of the Manager as it's key, it works best when all the key in the Manager are numbers */
    add(value: V): Manager<K, V>;
    /** Returns the total number of items stored in the Manager */
    get size(): number;
    /** An alias for size */
    get length(): number;
    /** Returns the last item in the Manager who's index is a certain distance from the last item in the Manager */
    last(distance?: number): V | undefined;
    /** Removes a value stored in the Manager via a key, returns true if an element in the Map object existed and has been removed, or false if the element does not exist */
    delete(key: K): boolean;
    /** Removes a value stored in the Manager via a key, returns the Manager class, allowing for chains */
    remove(key: K): Manager<K, V>;
    /** Clear the Manager of all its contents */
    clear(): Manager<K, V>;
    /** Checks if the Manager contains a certain key */
    has(key: K): boolean;
    /** Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order. */
    entries(): IterableIterator<[K, V]>;
    /** Iterates through the Managers contents, calling a callback function every iteration */
    forEach(callback: (value?: V, key?: K, map?: Map<K, V>) => void, context?: object): Manager<K, V>;
    /** Allows for iteration via for..of, learn more: [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators] */
    [Symbol.iterator](): IterableIterator<[K, V]>;
}
/**
 * Calls the method of a certain name for all items that are currently installed
 */
export declare const methodCall: (manager: Manager<any, any>, method: string, ...args: any) => void;
/**
 * Asynchronously calls the method of a certain name for all items that are currently installed, similar to methodCall
 */
export declare const asyncMethodCall: (manager: Manager<any, any>, method: string, ...args: any) => Promise<void>;
export default Manager;
