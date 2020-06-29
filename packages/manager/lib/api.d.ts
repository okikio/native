/**
 * Manages complex lists of named data, eg. A page can be stored in a list by of other pages with the url being how the page is stored in the list. Managers use Maps to store data.
 *
 * @export
 * @class Manager
 * @template K
 * @template V
 */
export declare class Manager<K, V> {
    /**
     * The complex list of named data, to which the Manager controls
     *
     * @protected
     * @type Map<K, V>
     * @memberof Manager
     */
    protected map: Map<K, V>;
    /**
     * Creates an instance of Manager.
     *
     * @param {Array<[K, V]>} [value]
     * @memberof Manager
     */
    constructor(value?: Array<[K, V]>);
    /**
     * Returns the Manager class's list
     *
     * @returns Map<K, V>
     * @memberof Manager
     */
    getMap(): Map<K, V>;
    /**
     * Get a value stored in the Manager
     *
     * @public
     * @param  {K} key - The key to find in the Manager's list
     * @returns V
     */
    get(key: K): V;
    /**
     * Returns the keys of all items stored in the Manager as an Array
     *
     * @returns Array<K>
     * @memberof Manager
     */
    keys(): Array<K>;
    /**
     * Returns the values of all items stored in the Manager as an Array
     *
     * @returns Array<V>
     * @memberof Manager
     */
    values(): Array<V>;
    /**
     * Set a value stored in the Manager
     *
     * @public
     * @param  {K} key - The key where the value will be stored
     * @param  {V} value - The value to store
     * @returns Manager<K, V>
     */
    set(key: K, value: V): Manager<K, V>;
    /**
     * Adds a value to Manager, and uses the current size of the Manager as it's key, it works best when all the key in the Manager are numbers
     *
     * @public
     * @param  {V} value
     * @returns Manager<K, V>
     */
    add(value: V): Manager<K, V>;
    /**
     * Returns the total number of items stored in the Manager
     *
     * @public
     * @returns Number
     */
    get size(): number;
    /**
     * Returns the last item in the Manager who's index is a certain distance from the last item in the Manager
     *
     * @param {number} [distance=1]
     * @returns V | undefined
     * @memberof Manager
     */
    last(distance?: number): V | undefined;
    /**
     * Returns the second last item in the Manager
     *
     * @public
     * @returns V
     */
    prev(): V;
    /**
     * Removes a value stored in the Manager, via the key
     *
     * @public
     * @param  {K} key - The key for the key value pair to be removed
     * @returns Manager<K, V>
     */
    delete(key: K): Manager<K, V>;
    /**
     * Clear the Manager of all its contents
     *
     * @public
     * @returns Manager<K, V>
     */
    clear(): Manager<K, V>;
    /**
     * Checks if the Manager contains a certain key
     *
     * @public
     * @param {K} key
     * @returns boolean
     */
    has(key: K): boolean;
    /**
     * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
     *
     * @public
     * @returns IterableIterator<[K, V]>
     */
    entries(): IterableIterator<[K, V]>;
    /**
     * Iterates through the Managers contents, calling a callback function every iteration
     *
     * @param {*} [callback=(...args: any): void => { }]
     * @param {object} context
     * @returns Manager<K, V>
     * @memberof Manager
     */
    forEach(callback?: any, context?: object): Manager<K, V>;
    /**
     * Allows iteration via the for..of, learn more: [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators]
     *
     * @returns IterableIterator<[K, V]>
     * @memberof Manager
     */
    [Symbol.iterator](): IterableIterator<[K, V]>;
    /**
     * Calls the method of a certain name for all items that are currently installed
     *
     * @param {string} method
     * @param {Array<any>} [args=[]]
     * @returns Manager<K, V>
     * @memberof Manager
     */
    methodCall(method: string, ...args: any): Manager<K, V>;
    /**
     * Asynchronously calls the method of a certain name for all items that are currently installed, similar to methodCall
     *
     * @param {string} method
     * @param {Array<any>} [args=[]]
     * @returns Promise<Manager<K, V>>
     * @memberof Manager
     */
    asyncMethodCall(method: string, ...args: any): Promise<Manager<K, V>>;
}
export default Manager;
