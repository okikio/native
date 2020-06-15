/**
 * Manages complex lists of named data, eg. A page can be stored in a list by of other pages with the url being how the page is stored in the list.
 *
 * @export
 * @class Manager
 * @extends {Map<K, V>}
 * @template K
 * @template V
*/
export declare class Manager<K, V> extends Map<K, V> {
    /**
     * Creates an instance of Manager.
     *
     * @param {...any} args
     * @memberof Manager
     */
    constructor(...args: any);
    /**
     * Returns the keys of all items stored in the Manager as an Array
     *
     * @returns Array<K>
     * @memberof Manager
     */
    keys(): any;
    /**
     * Returns the values of all items stored in the Manager as an Array
     *
     * @returns Array<V>
     * @memberof Manager
     */
    values(): any;
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
     * @returns V | undefined
     */
    prev(): V | undefined;
    /**
     * Adds a value to Manager, and uses the current size of the Manager as it's key, it works best when all the key in the Manager are numbers
     *
     * @public
     * @param  {V} value
     * @returns Manager<K, V>
     */
    add(value: V): Manager<K, V>;
    /**
     * Calls a method for all items that are currently in it's list
     *
     * @param {string} method
     * @param {Array<any>} [args=[]]
     * @returns Manager<K, V>
     * @memberof Manager
     */
    methodCall(method: string, ...args: any): Manager<K, V>;
    /**
     * Asynchronously calls a method for all items that are currently in it's list, similar to methodCall except the loop waits for the asynchronous method to run, before the loop continues on to the the next method
     *
     * @param {string} method
     * @param {Array<any>} [args=[]]
     * @returns Promise<Manager<K, V>>
     * @memberof Manager
     */
    asyncMethodCall(method: string, ...args: any): Promise<Manager<K, V>>;
}
export default Manager;
