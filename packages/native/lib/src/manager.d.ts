import { Manager } from "@okikio/manager";
import { ConfigKeys } from "./config";
import { App } from "./app";
export declare type IAdvancedManager = AdvancedManager<any, ManagerItem>;
/**
 * The base class for all AdvancedManager and AdvancedStorage items
 *
 * @export
 * @class ManagerItem
 */
export declare class ManagerItem {
    /**
     * The AdvancedManager or AdvancedStorage the ManagerItem is attached to
     *
     * @protected
     * @type IAdvancedManager
     * @memberof ManagerItem
     */
    protected manager: IAdvancedManager;
    /**
     * Creates an instance of ManagerItem.
     *
     * @memberof ManagerItem
     */
    constructor();
    /**
     * The getConfig method for accessing the Configuration of the current App
     *
     * @param {ConfigKeys} [value]
     * @param {boolean} [brackets=true]
     * @returns any
     * @memberof ManagerItem
     */
    protected getConfig(value?: ConfigKeys, brackets?: boolean): any;
    /**
     * Run after the Manager Item has been registered
     *
     * @returns any
     * @memberof ManagerItem
     */
    install(): any;
    /**
     * Register the current Manager Item's manager
     *
     * @param {IAdvancedManager} manager
     * @returns ManagerItem
     * @memberof ManagerItem
     */
    register(manager: IAdvancedManager): ManagerItem;
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
export declare class AdvancedManager<K, V extends ManagerItem> extends Manager<K, V> {
    /**
     * The instance of the App class, the Manager is instantiated in
     *
     * @private
     * @type App
     * @memberof AdvancedManager
     */
    private app;
    /**
     * Creates an instance of AdvancedManager.
     *
     * @param {App} app - The instance of the App class, the Manager is instantiated in
     * @memberof AdvancedManager
     */
    constructor(app: App);
    /**
     * Set a value stored in the Manager
     *
     * @public
     * @param  {K} key - The key where the value will be stored
     * @param  {V} value - The value to store
     * @returns AdvancedManager<K, V>
     */
    set(key: K, value: V): this;
    /**
     * Returns the instance the App class
     *
     * @returns App
     * @memberof AdvancedManager
     */
    getApp(): App;
    /**
     * Returns the App config
     *
     * @param {ConfigKeys} [value]
     * @param {boolean} [brackets=true]
     * @returns *
     * @memberof AdvancedManager
     */
    getConfig(value?: ConfigKeys, brackets?: boolean): any;
}
export { Manager };
