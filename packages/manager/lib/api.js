/*!
 * managerjs v1.0.8
 * (c) 2020 Okiki Ojo
 * Released under the MIT license
 */

'use strict';

/**
 * Manages complex lists of named data, eg. A page can be stored in a list by of other pages with the url being how the page is stored in the list. Managers use Maps to store data.
 *
 * @export
 * @class Manager
 * @template K
 * @template V
 */
class Manager {
    /**
     * Creates an instance of Manager.
     *
     * @param {Array<[K, V]>} value
     * @memberof Manager
     */
    constructor(value) {
        this.map = new Map(value);
    }
    /**
     * Returns the Manager class's list
     *
     * @returns Map<K, V>
     * @memberof Manager
     */
    getMap() {
        return this.map;
    }
    /**
     * Get a value stored in the Manager
     *
     * @public
     * @param  {K} key - The key to find in the Manager's list
     * @returns V
     */
    get(key) {
        return this.map.get(key);
    }
    /**
     * Returns the keys of all items stored in the Manager as an Array
     *
     * @returns Array<K>
     * @memberof Manager
     */
    keys() {
        return [...this.map.keys()];
    }
    /**
     * Returns the values of all items stored in the Manager as an Array
     *
     * @returns Array<V>
     * @memberof Manager
     */
    values() {
        return [...this.map.values()];
    }
    /**
     * Set a value stored in the Manager
     *
     * @public
     * @param  {K} key - The key where the value will be stored
     * @param  {V} value - The value to store
     * @returns Manager<K, V>
     */
    set(key, value) {
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
    add(value) {
        // @ts-ignore
        this.map.set(this.size, value);
        return this;
    }
    /**
     * Returns the total number of items stored in the Manager
     *
     * @public
     * @returns Number
     */
    get size() {
        return this.map.size;
    }
    /**
     * Returns the last item in the Manager who's index is a certain distance from the last item in the Manager
     *
     * @param {number} [distance=1]
     * @returns V | undefined
     * @memberof Manager
     */
    last(distance = 1) {
        let key = this.keys()[this.size - distance];
        return this.get(key);
    }
    /**
     * Returns the second last item in the Manager
     *
     * @public
     * @returns V | undefined
     */
    prev() {
        return this.last(2);
    }
    /**
     * Removes a value stored in the Manager, via the key
     *
     * @public
     * @param  {K} key - The key for the key value pair to be removed
     * @returns Manager<K, V>
     */
    delete(key) {
        this.map.delete(key);
        return this;
    }
    /**
     * Clear the Manager of all its contents
     *
     * @public
     * @returns Manager<K, V>
     */
    clear() {
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
    has(key) {
        return this.map.has(key);
    }
    /**
     * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
     *
     * @public
     * @returns IterableIterator<[K, V]>
     */
    entries() {
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
    forEach(callback = (...args) => { }, context) {
        this.map.forEach(callback, context);
        return this;
    }
    /**
     * Allows iteration via the for..of, learn more: [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators]
     *
     * @returns
     * @memberof Manager
     */
    [Symbol.iterator]() {
        return this.entries();
    }
    /**
     * Calls the method of a certain name for all items that are currently installed
     *
     * @param {string} method
     * @param {Array<any>} [args=[]]
     * @returns Manager<K, V>
     * @memberof Manager
     */
    methodCall(method, ...args) {
        this.forEach((item) => {
            item[method](...args);
        });
        return this;
    }
    /**
     * Asynchronously calls the method of a certain name for all items that are currently installed, similar to methodCall
     *
     * @param {string} method
     * @param {Array<any>} [args=[]]
     * @returns Promise<Manager<K, V>>
     * @memberof Manager
     */
    async asyncMethodCall(method, ...args) {
        for await (let [, item] of this.map) {
            await item[method](...args);
        }
        return this;
    }
}

module.exports = Manager;
