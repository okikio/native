import { Manager, methodCall, asyncMethodCall } from "@okikio/manager";
import { ICONFIG } from "./config";
import { IApp } from "./app";
import { EventEmitter } from "./emitter";
export declare type IAdvancedManager = AdvancedManager<any, ManagerItem>;
/** The base class for AdvancedManager items */
export declare class ManagerItem {
    /** The AdvancedManager the ManagerItem is attached to */
    manager: IAdvancedManager;
    /** The App the ManagerItem is attached to */
    app: IApp;
    /** The Config of the App the ManagerItem is attached to */
    config: ICONFIG;
    /** The EventEmitter of the App the ManagerItem is attached to */
    emitter: EventEmitter;
    /** The key to where ManagerItem is stored in an AdvancedManager */
    key: any;
    constructor();
    /** Run after the Manager Item has been registered */
    install(): any;
    /** Register the current Manager Item's manager */
    register(manager: IAdvancedManager, key: any): ManagerItem;
    /** Run before the ManagerItem has been unregistered */
    uninstall(): any;
    /** Basically removes a ManagerItem, in order to recover the ManagerItem, it needs to be re-added to an AdvancedManager */
    unregister(): void;
}
/** A tweak to the Manager class that makes it self aware of the App class it's instantiated in */
export declare class AdvancedManager<K, V extends ManagerItem> extends Manager<K, V> {
    /** The App the AdvancedManager is attached to */
    app: IApp;
    /** The Config of the App the AdvancedManager is attached to */
    config: ICONFIG;
    /** The EventEmitter of the App the AdvancedManager is attached to */
    emitter: EventEmitter;
    /** Register App details */
    constructor(app: IApp);
    /** Add a ManagerItem to AdvancedManager at a specified key */
    set(key: K, value: V): this;
}
export { Manager, methodCall, asyncMethodCall };
