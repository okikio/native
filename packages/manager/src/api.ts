/**
 * Manages complex lists of named data, eg. A page can be stored in a list by of other pages with the url being how the page is stored in the list.
 *
 * @export
 * @class Manager
 * @extends {Map<K, V>}
 * @template K
 * @template V
*/
export class Manager<K, V> extends Map<K, V> {
    /**
     * Creates an instance of Manager.
     *
     * @param {...any} args
     * @memberof Manager
     */
    constructor(...args: any) {
        super(...args);
    }

	/**
	 * Returns the keys of all items stored in the Manager as an Array
	 *
	 * @returns Array<K>
     * @memberof Manager
     */
    public keys(): any {
        return Array.from(super.keys.call(this));
    }

	/**
	 * Returns the values of all items stored in the Manager as an Array
	 *
	 * @returns Array<V>
     * @memberof Manager
	 */
    public values(): any {
        return Array.from(super.values.call(this));
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
	 * @returns V | undefined
	 */
    public prev(): V | undefined {
        return this.last(2);
    }

    /**
     * Adds a value to Manager, and uses the current size of the Manager as it's key, it works best when all the key in the Manager are numbers
     *
     * @public
     * @param  {V} value
     * @returns Manager<K, V>
     */
    public add(value: V): Manager<K, V> {
        super.set.call(this, this.size, value);
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
    public methodCall(method: string, ...args: any): Manager<K, V> {
        this.forEach((item: V) => {
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
    public async asyncMethodCall(method: string, ...args: any): Promise<Manager<K, V>> {
        for await (let [, item] of this) {
            // @ts-ignore
            await item[method](...args);
        }
        return this;
    }
}

export default Manager;