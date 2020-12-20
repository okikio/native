import { Manager, methodCall, asyncMethodCall } from "@okikio/manager";
import { ICONFIG } from "./config";
import { App } from "./app";
import EventEmitter from "@okikio/emitter";

export type IAdvancedManager = AdvancedManager<any, ManagerItem>;

/**
 * The base class for all AdvancedManager and AdvancedStorage items
 *
 * @export
 * @class ManagerItem
 */
export class ManagerItem {
    /**
     * The AdvancedManager the ManagerItem is attached to
     *
     * @public
     * @type IAdvancedManager
     * @memberof ManagerItem
     */
    public manager: IAdvancedManager;

    /**
     * The App the ManagerItem is attached to
     *
     * @public
     * @type App
     * @memberof ManagerItem
    */
    public app: App;

    /**
     * The Config of the App the ManagerItem is attached to
     *
     * @public
     * @type ICONFIG
     * @memberof ManagerItem
    */
    public config: ICONFIG;
    public emitter: EventEmitter;
    public key: any;

    /**
     * Creates an instance of ManagerItem.
     *
     * @memberof ManagerItem
     */
    constructor() { }

    /**
     * Run after the Manager Item has been registered
     *
     * @returns any
     * @memberof ManagerItem
     */
    public install(): any { }

    /**
     * Register the current Manager Item's manager
     *
     * @param {IAdvancedManager} manager
     * @returns ManagerItem
     * @memberof ManagerItem
     */
    public register(manager: IAdvancedManager, key: any): ManagerItem {
        this.manager = manager;
        this.app = manager.app;
        this.config = manager.config;
        this.emitter = manager.emitter;
        this.key = key;
        this.install();
        return this;
    }

    public uninstall(): any { }

    public unregister() {
        this.uninstall();

        this.manager.remove(this.key);
        this.key = undefined;
        this.manager = undefined;
        this.app = undefined;
        this.config = undefined;
        this.emitter = undefined;
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
export class AdvancedManager<K, V extends ManagerItem> extends Manager<K, V> {
    /**
     * The instance of the App class, the Manager is instantiated in
     *
     * @type App
     * @memberof AdvancedManager
     */
    public app: App;

    /**
     * The Config of the App the AdvancedManager is attached to
     *
     * @public
     * @type ICONFIG
     * @memberof AdvancedManager
    */
    public config: ICONFIG;

    /**
     * The EventEmitter class of the App the AdvancedManager is attached to
     *
     * @public
     * @type EventEmitter
     * @memberof AdvancedManager
    */
    public emitter: EventEmitter;

    /**
     * Creates an instance of AdvancedManager.
     *
     * @param {App} app - The instance of the App class, the Manager is instantiated in
     * @memberof AdvancedManager
     */
    constructor(app: App) {
        super();
        this.app = app;
        this.config = app.config;
        this.emitter = app.emitter;
    }

    /**
     * Set a value stored in the Manager
     *
     * @public
     * @param  {K} key - The key where the value will be stored
     * @param  {V} value - The value to store
     * @returns AdvancedManager<K, V>
     */
    public set(key: K, value: V) {
        super.set(key, value);
        value.register(this, key);
        return this;
    }
}

export { Manager, methodCall, asyncMethodCall };
