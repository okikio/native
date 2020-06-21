import Manager from "managerjs";
/**
 * The base class for all AdvancedManager and AdvancedStorage items
 *
 * @export
 * @class ManagerItem
 */
export class ManagerItem {
    /**
     * Creates an instance of ManagerItem.
     *
     * @memberof ManagerItem
     */
    constructor() { }
    /**
     * The getConfig method for accessing the Configuration of the current App
     *
     * @param {ConfigKeys} [value]
     * @param {boolean} [brackets]
     * @returns any
     * @memberof ManagerItem
     */
    getConfig(value, brackets) {
        return this.manager.getConfig(value, brackets);
    }
    ;
    /**
     * Run after the Manager Item has been registered
     *
     * @returns any
     * @memberof ManagerItem
     */
    install() { }
    /**
     * Register the current Manager Item's manager
     *
     * @param {IAdvancedManager} manager
     * @returns ManagerItem
     * @memberof ManagerItem
     */
    register(manager) {
        this.manager = manager;
        this.install();
        return this;
    }
}
/**
 * A tweak to the Manager class that makes it self aware of the App class it's instantiated in
 *
 * @export
 * @class AdvancedManager
 * @extends {Manager<K, V>}
 * @template K
 * @template V
 */
export class AdvancedManager extends Manager {
    /**
     * Creates an instance of AdvancedManager.
     *
     * @param {App} app - The instance of the App class, the Manager is instantiated in
     * @memberof AdvancedManager
     */
    constructor(app) {
        super();
        this.app = app;
    }
    /**
     * Set a value stored in the Manager
     *
     * @public
     * @param  {K} key - The key where the value will be stored
     * @param  {V} value - The value to store
     * @returns AdvancedManager<K, V>
     */
    set(key, value) {
        super.set(key, value);
        typeof value.register === "function" && value.register(this);
        return this;
    }
    /**
     * Returns the instance the App class
     *
     * @returns App
     * @memberof AdvancedManager
     */
    getApp() {
        return this.app;
    }
    /**
     * Returns the App config
     *
     * @param {...any} args
     * @returns any
     * @memberof AdvancedManager
     */
    getConfig(...args) {
        return this.app.getConfig(...args);
    }
}
export { Manager };
//# sourceMappingURL=ts/manager.js.map
