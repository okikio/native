import { Manager, methodCall, asyncMethodCall } from "@okikio/manager";
import { ICONFIG } from "./config";
import { IApp } from "./app";
import { EventEmitter } from "./emitter";
export declare type IAdvancedManager = AdvancedManager<any, ManagerItem>;
/**
 * The base class for all AdvancedManager and AdvancedStorage items
 *
 * @export
 * @class ManagerItem
 */
export declare class ManagerItem {
    /**
     * The AdvancedManager the ManagerItem is attached to
     *
     * @public
     * @type IAdvancedManager
     * @memberof ManagerItem
     */
    manager: IAdvancedManager;
    /**
     * The App the ManagerItem is attached to
     *
     * @public
     * @type IApp
     * @memberof ManagerItem
    */
    app: IApp;
    /**
     * The Config of the App the ManagerItem is attached to
     *
     * @public
     * @type ICONFIG
     * @memberof ManagerItem
    */
    config: ICONFIG;
    emitter: EventEmitter;
    key: any;
    /**
     * Creates an instance of ManagerItem.
     *
     * @memberof ManagerItem
     */
    constructor();
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
    register(manager: IAdvancedManager, key: any): ManagerItem;
    uninstall(): any;
    unregister(): void;
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
     * @type App
     * @memberof AdvancedManager
     */
    app: IApp;
    /**
     * The Config of the App the AdvancedManager is attached to
     *
     * @public
     * @type ICONFIG
     * @memberof AdvancedManager
    */
    config: ICONFIG;
    /**
     * The EventEmitter class of the App the AdvancedManager is attached to
     *
     * @public
     * @type EventEmitter
     * @memberof AdvancedManager
    */
    emitter: EventEmitter;
    /**
     * Creates an instance of AdvancedManager.
     *
     * @param {App} app - The instance of the App class, the Manager is instantiated in
     * @memberof AdvancedManager
     */
    constructor(app: IApp);
    /**
     * Set a value stored in the Manager
     *
     * @public
     * @param  {K} key - The key where the value will be stored
     * @param  {V} value - The value to store
     * @returns AdvancedManager<K, V>
     */
    set(key: K, value: V): this;
}
export { Manager, methodCall, asyncMethodCall };
