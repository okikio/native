import { AdvancedManager, ManagerItem } from "./manager";
import { TransitionManager } from "./transition";
import { HistoryManager } from "./history";
import { EventEmitter } from "./emitter";
import { PageManager } from "./page";
import { App } from "./app";
/**
 * Controls specific kinds of actions that require JS
 *
 * @export
 * @class Service
 */
export declare class Service extends ManagerItem {
    /**
     * Stores access to the App class's EventEmitter
     *
     * @protected
     * @type EventEmitter
     * @memberof Service
     */
    protected EventEmitter: EventEmitter;
    /**
     * Stores access to the App class's PageManager
     *
     * @protected
     * @type PageManager
     * @memberof Service
     */
    protected PageManager: PageManager;
    /**
     * Stores access to the App class's HistoryManager
     *
     * @protected
     * @type HistoryManager
     * @memberof Service
     */
    protected HistoryManager: HistoryManager;
    /**
     * Stores the ServiceManager the service is install on
     *
     * @protected
     * @type ServiceManager
     * @memberof Service
     */
    protected ServiceManager: ServiceManager;
    /**
     * Stores access to the App's TransitionManager
     *
     * @protected
     * @type TransitionManager
     * @memberof Service
     */
    protected TransitionManager: TransitionManager;
    /**
     * Method is run once when Service is installed on a ServiceManager
     *
     * @memberof Service
     */
    install(): void;
    init(...args: any): void;
    boot(): void;
    initEvents(): void;
    stopEvents(): void;
    stop(): void;
}
/**
 * The Service Manager controls the lifecycle of all services in an App
 *
 * @export
 * @class ServiceManager
 * @extends {AdvancedManager<string, Service>}
 */
export declare class ServiceManager extends AdvancedManager<string, Service> {
    /**
     * Creates an instance of ServiceManager.
     *
     * @param {App} app
     * @memberof ServiceManager
     */
    constructor(app: App);
    /**
     * Call the init method for all Services
     *
     * @returns ServiceManager
     * @memberof ServiceManager
     */
    init(): ServiceManager;
    /**
     * Call the boot method for all Services
     *
     * @returns ServiceManager
     * @memberof ServiceManager
     */
    boot(): ServiceManager;
    /**
     * Call the stop method for all Services
     *
     * @returns ServiceManager
     * @memberof ServiceManager
     */
    stop(): ServiceManager;
}
