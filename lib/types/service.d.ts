import { AdvancedManager, ManagerItem } from "./manager";
import { EventEmitter } from "./emitter";
import { IApp } from "./app";
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
     * @public
     * @type EventEmitter
     * @memberof Service
     */
    emitter: EventEmitter;
    /**
     * Stores the ServiceManager the service is install on
     *
     * @public
     * @type ServiceManager
     * @memberof Service
     */
    ServiceManager: ServiceManager;
    /**
     * Method is run once when Service is installed on a ServiceManager
     *
     * @memberof Service
     */
    install(): void;
    init(...args: any): any;
    boot(...args: any): any;
    initEvents(): void;
    stopEvents(): void;
    uninstall(): void;
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
     * @param {IApp} app
     * @memberof ServiceManager
     */
    constructor(app: IApp);
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
