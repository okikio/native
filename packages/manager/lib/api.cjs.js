/*!
 * managerjs v1.0.0
 * (c) 2020 Okiki Ojo
 * Released under the MIT license
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Manages complex lists of named data, eg. A page can be stored in a list by of other pages with the url being how the page is stored in the list.
 *
 * @export
 * @class Manager
 * @extends {Map<K, V>}
 * @template K
 * @template V
 */
class Manager extends Map {
    /**
     * Creates an instance of Manager.
     *
     * @param {...any} args
     * @memberof Manager
     */
    constructor(...args) {
        super(...args);
    }
    /**
     * Returns the keys of all items stored in the Manager as an Array
     *
     * @returns Array<K>
     * @memberof Manager
     */
    // @ts-expect-error
    keys() {
        return Array.from(super.keys.call(this));
    }
    /**
     * Returns the values of all items stored in the Manager as an Array
     *
     * @returns Array<V>
     * @memberof Manager
     */
    // @ts-expect-error
    values() {
        return Array.from(this.values());
    }
    /**
     * Returns the last item in the Manager who's index is a certain distance from the last item in the Manager
     *
     * @param {number} [distance=1]
     * @returns V
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
     * @returns V
     */
    prev() {
        return this.last(2);
    }
    /**
     * Adds a value to Manager, and uses the current size of the Manager as it's key, it works best when all the key in the Manager are numbers
     *
     * @public
     * @param  {V} value
     * @returns Manager<K, V>
     */
    add(value) {
        // @ts-expect-error
        this.set(this.size, value);
        return this;
    }
    /**
     * Calls a method for all items that are currently in it's list
     *
     * @param {string} method
     * @param {Array<any>} [args=[]]
     * @returns Manager<K, V>
     * @memberof Manager
     */
    methodCall(method, ...args) {
        this.forEach((item) => {
            // @ts-ignore
            item[method](...args);
        });
        return this;
    }
    /**
     * Asynchronously calls a method for all items that are currently in it's list, similar to methodCall except the loop waits for the asynchronous method to run, before the loop continues on to the the next method
     *
     * @param {string} method
     * @param {Array<any>} [args=[]]
     * @returns Promise<Manager<K, V>>
     * @memberof Manager
     */
    async asyncMethodCall(method, ...args) {
        for await (let [, item] of this) {
            // @ts-ignore
            await item[method](...args);
        }
        return this;
    }
}

exports.Manager = Manager;
exports.default = Manager;
