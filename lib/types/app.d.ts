import { EventEmitter, ListenerCallback, EventInput } from "./emitter";
import { ServiceManager, Service } from "./service";
import { ICONFIG } from "./config";
export interface IApp {
    services: ServiceManager;
    emitter: EventEmitter;
    config: ICONFIG;
    register(config: ICONFIG): App;
    get(key: string): Service;
    set(key: string, service: Service): App;
    add(value: Service): App;
    boot(): App;
    stop(): App;
    on(events: EventInput, callback?: ListenerCallback): App;
    off(events: EventInput, callback?: ListenerCallback): App;
    emit(events: string | any[], ...args: any): App;
}
/**
 * The App class starts the entire process, it controls all managers and all services
 *
 * @export
 * @class App
 */
export declare class App implements IApp {
    /**
     * A new instance of the ServiceManager
     *
     * @public
     * @type ServiceManager
     * @memberof App
     */
    services: ServiceManager;
    /**
     * A new instance of an EventEmitter
     *
     * @public
     * @type EventEmitter
     * @memberof App
     */
    emitter: EventEmitter;
    /**
     * The current Configuration's for the framework
     *
     * @public
     * @type ICONFIG
     * @memberof App
     */
    config: ICONFIG;
    /**
     * Creates an instance of App.
     *
     * @param {(ICONFIG | CONFIG)} [config={}]
     * @memberof App
     */
    constructor(config?: object);
    /**
     * For registering all managers and the configurations
     *
     * @param {(ICONFIG)} [config={}]
     * @returns App
     * @memberof App
     */
    register(config?: ICONFIG): App;
    /**
     * Based on the type, it will return either a Transition, a Service, or a State from their respective Managers
     *
     * @param {string} key
     * @returns Service | Transition | State
     * @memberof App
     */
    get(key: string): Service;
    /**
     * Adds a Service to the App's instance of the ServiceManager, with a name
     *
     * @param {string} key
     * @param {Service} service
     * @returns App
     * @memberof App
     */
    set(key: string, service: Service): App;
    /**
     * Based on the type, it will add either a Transition, a Service, or a State to their respective Managers
     *
     * @param {Service} value
     * @returns App
     * @memberof App
     */
    add(value: Service): App;
    /**
     * Start the App and the ServiceManager
     *
     * @returns App
     * @memberof App
     */
    boot(): App;
    /**
     * Stop the App and the ServiceManager
     *
     * @returns App
     * @memberof App
     */
    stop(): App;
    /**
     * A shortcut to the App EventEmitter on method
     *
     * @param {EventInput} events
     * @param {ListenerCallback} callback
     * @returns App
     * @memberof App
     */
    on(events: EventInput, callback?: ListenerCallback): App;
    /**
     * A shortcut to the App EventEmitter off method
     *
     * @param {EventInput} events
     * @param {ListenerCallback} callback
     * @returns App
     * @memberof App
     */
    off(events: EventInput, callback?: ListenerCallback): App;
    /**
     * A shortcut to the App EventEmitter emit method
     *
     * @param {(string | any[])} events
     * @param {...any} args
     * @returns App
     * @memberof App
     */
    emit(events: string | any[], ...args: any): App;
}
