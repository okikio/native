import { Manager, methodCall, asyncMethodCall } from "@okikio/manager";
import { ICONFIG } from "./config";
import { IApp } from "./app";
import { EventEmitter } from "@okikio/emitter";

export type IAdvancedManager = AdvancedManager<any, ManagerItem>;

/** The base class for AdvancedManager items */
export class ManagerItem {
    /** The AdvancedManager the ManagerItem is attached to */
    public manager: IAdvancedManager;

    /** The App the ManagerItem is attached to */
    public app: IApp;

    /** The Config of the App the ManagerItem is attached to */
    public config: ICONFIG;

    /** The EventEmitter of the App the ManagerItem is attached to */
    public emitter: EventEmitter;

    /** The key to where ManagerItem is stored in an AdvancedManager */
    public key: any;

    constructor() { }

    /** Run after the Manager Item has been registered */
    public install(): any { }

    /** Register the current Manager Item's manager */
    public register(manager: IAdvancedManager, key: any): ManagerItem {
        this.manager = manager;
        this.app = manager.app;
        this.config = manager.config;
        this.emitter = manager.emitter;
        this.key = key;
        this.install();
        return this;
    }

    /** Run before the ManagerItem has been unregistered */
    public uninstall(): any { }

    /** Basically removes a ManagerItem, in order to recover the ManagerItem, it needs to be re-added to an AdvancedManager */
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

/** A tweak to the Manager class that makes it self aware of the App class it's instantiated in */
export class AdvancedManager<K, V extends ManagerItem> extends Manager<K, V> {
    /** The App the AdvancedManager is attached to */
    public app: IApp;

    /** The Config of the App the AdvancedManager is attached to */
    public config: ICONFIG;

    /** The EventEmitter of the App the AdvancedManager is attached to */
    public emitter: EventEmitter;

    /** Register App details */
    constructor(app: IApp) {
        super();
        this.app = app;
        this.config = app.config;
        this.emitter = app.emitter;
    }

    /** Add a ManagerItem to AdvancedManager at a specified key */
    public set(key: K, value: V) {
        super.set(key, value);
        value.register(this, key);
        return this;
    }
}

export * from "@okikio/manager";
