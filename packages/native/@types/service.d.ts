import { AdvancedManager, ManagerItem } from "./manager";
import { IApp } from "./app";
/** Controls specific kinds of actions that require JS */
export declare class Service extends ManagerItem {
    /** Called before the start of a Service, represents a constructor of sorts */
    init(...args: any): any;
    /** Called on start of Service */
    boot(...args: any): any;
    /** Initialize events */
    initEvents(): void;
    /** Stop events */
    stopEvents(): void;
    /** Stop Service */
    stop(): void;
}
/** The Service Manager controls the lifecycle of all Services in an App */
export declare class ServiceManager extends AdvancedManager<string, Service> {
    constructor(app: IApp);
    /** Call the init method for all Services */
    init(): ServiceManager;
    /** Call the boot method for all Services */
    boot(): ServiceManager;
    /** Call the stop method for all Services */
    stop(): ServiceManager;
}
