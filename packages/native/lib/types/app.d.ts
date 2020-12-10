import { EventEmitter, ListenerCallback, EventInput } from "./emitter";
import { ITransition, TransitionManager } from "./transition";
import { HistoryManager, IState } from "./history";
import { ServiceManager, Service } from "./service";
import { PageManager } from "./page";
import { CONFIG, ICONFIG } from "./config";
/**
 * The App class starts the entire process, it controls all managers and all services
 *
 * @export
 * @class App
 */
export declare class App {
    /**
     * A new instance of the HistoryManager
     *
     * @public
     * @type HistoryManager
     * @memberof App
     */
    history: HistoryManager;
    /**
     * A new instance of the TransitionManager
     *
     * @public
     * @type TransitionManager
     * @memberof App
     */
    transitions: TransitionManager;
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
     * A new instance of the PageManager
     *
     * @public
     * @type PageManager
     * @memberof App
     */
    pages: PageManager;
    /**
     * The current Configuration's for the framework
     *
     * @public
     * @type CONFIG
     * @memberof App
     */
    config: CONFIG;
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
     * @param {(ICONFIG | CONFIG)} [config={}]
     * @returns App
     * @memberof App
     */
    register(config?: ICONFIG | CONFIG): App;
    /**
     * Based on the type, it will return either a Transition, a Service, or a State from their respective Managers
     *
     * @param {("service" | "transition" | "state" | string)} type
     * @param {any} key
     * @returns Service | Transition | State
     * @memberof App
     */
    get(type: "service" | "transition" | "state" | string, key: any): Service | ITransition | IState;
    /**
     * Based on the type, it will return load either Page a Transition, a Service, a State, or a Page from their respective Managers
     *
     * @param {("page" | string)} type
     * @param {any} key
     * @returns App
     * @memberof App
     */
    load(type: "page" | string, key: any): Promise<any>;
    /**
     * Adds a Service to the App's instance of the ServiceManager, with a name
     *
     * @param {string} key
     * @param {Service} service
     * @returns App
     * @memberof App
     */
    setService(key: string, service: Service): App;
    /**
     * Adds a Service to the App's instance of the ServiceManager, with a name
     *
     * @param {string} key
     * @param {ITransition} tranisition
     * @returns App
     * @memberof App
     */
    setTransition(key: string, transition: ITransition): App;
    /**
     * Based on the type, it will add either a Transition, a Service, or a State to their respective Managers
     *
     * @param {("service" | "transition" | "state")} type
     * @param {any} value
     * @returns App
     * @memberof App
     */
    add(type: "service" | "transition" | "state", value: any): App;
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
