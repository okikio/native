import { EventEmitter, ListenerCallback, EventInput } from "./emitter";
import { TransitionManager, Transition } from "./transition";
import { BlockManager, BlockIntent, Block } from "./block";
import { HistoryManager, State, IState } from "./history";
import { ServiceManager, Service } from "./service";
import { PageManager, Page } from "./page";
import { CONFIG, ICONFIG, ConfigKeys } from "./config";
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
    public history: HistoryManager;
    /**
     * A new instance of the TransitionManager
     *
     * @public
     * @type TransitionManager
     * @memberof App
     */
    public transitions: TransitionManager;
    /**
     * A new instance of the ServiceManager
     *
     * @public
     * @type ServiceManager
     * @memberof App
     */
    public services: ServiceManager;
    /**
     * A new instance of the BlockManager
     *
     * @public
     * @type BlockManager
     * @memberof App
     */
    public blocks: BlockManager;
    /**
     * A new instance of an EventEmitter
     *
     * @public
     * @type EventEmitter
     * @memberof App
     */
    public emitter: EventEmitter;
    /**
     * A new instance of the PageManager
     *
     * @public
     * @type PageManager
     * @memberof App
     */
    public pages: PageManager;
    /**
     * The current Configuration's for the framework
     *
     * @public
     * @type CONFIG
     * @memberof App
     */
    public config: CONFIG;
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
     * Returns the current configurations for the framework
     *
     * @param {ConfigKeys} [value]
     * @param {boolean} [brackets=true]
     * @returns {*}
     * @memberof App
     */
    getConfig(value?: ConfigKeys, brackets?: boolean): any;
    /**
     * Return the App's EventEmitter
     *
     * @returns EventEmitter
     * @memberof App
     */
    getEmitter(): EventEmitter;
    /**
     * Returns the App's BlockManager
     *
     * @returns BlockManager
     * @memberof App
     */
    getBlocks(): BlockManager;
    /**
     * Return the App's ServiceManager
     *
     * @returns ServiceManager
     * @memberof App
     */
    getServices(): ServiceManager;
    /**
     * Return the App's PageManager
     *
     * @returns PageManager
     * @memberof App
     */
    getPages(): PageManager;
    /**
     * Return the App's TransitionManager
     *
     * @returns TransitionManager
     * @memberof App
     */
    getTransitions(): TransitionManager;
    /**
     * Return the App's HistoryManager
     *
     * @returns HistoryManager
     * @memberof App
     */
    getHistory(): HistoryManager;
    /**
     * Returns a Block Intent Object from the App's instance of the BlockManager
     *
     * @param {number} key
     * @returns IBlockIntent
     * @memberof App
     */
    getBlock(key: number): BlockIntent;
    /**
     * Returns an instance of a Block from the App's instance of the BlockManager
     *
     * @param {string} name
     * @param {number} key
     * @returns Block
     * @memberof App
     */
    getActiveBlock(name: string, key: number): Block;
    /**
     * Returns a Service from the App's instance of the ServiceManager
     *
     * @param {string} key
     * @returns Service
     * @memberof App
     */
    getService(key: string): Service;
    /**
     * Returns a Transition from the App's instance of the TransitionManager
     *
     * @param {string} key
     * @returns Transition
     * @memberof App
     */
    getTransition(key: string): Transition;
    /**
     * Returns a State from the App's instance of the HistoryManager
     *
     * @param {number} key
     * @returns State
     * @memberof App
     */
    getState(key: number): State;
    /**
     * Based on the type, it will return either a Transition, a Service, or a State from their respective Managers
     *
     * @param {("service" | "transition" | "state" | string)} type
     * @param {any} key
     * @returns Service | Transition | State
     * @memberof App
     */
    get(type: "service" | "transition" | "state" | string, key: any): Service | Transition | State;
    /**
     * Returns a Page
     *
     * @param {string} url
     * @returns Promise<Page>
     * @memberof App
     */
    loadPage(url: string): Promise<Page>;
    /**
     * Based on the type, it will return load a Transition, a Service, a State, or a Page from their respective Managers
     *
     * @param {("page" | string)} type
     * @param {any} key
     * @returns App
     * @memberof App
     */
    load(type: "page" | string, key: any): Promise<any>;
    /**
     * Adds a Block Intent to the App's instance of the BlockManager
     *
     * @param {BlockIntent} blockIntent
     * @returns App
     * @memberof App
     */
    addBlock(blockIntent: BlockIntent): App;
    /**
     * Adds a Service to the App's instance of the ServiceManager
     *
     * @param {Service} service
     * @returns App
     * @memberof App
     */
    addService(service: Service): App;
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
     * Adds a Transition to the App's instance of the TransitionManager
     *
     * @param {Transition} transition
     * @returns App
     * @memberof App
     */
    addTransition(transition: Transition): App;
    /**
     * Adds a State to the App's instance of the HistoryManager
     *
     * @param {(IState | State)} state
     * @returns App
     * @memberof App
     */
    addState(state: IState | State): App;
    /**
     * Based on the type, it will add either a Transition, a Service, or a State to their respective Managers
     *
     * @param {("service" | "transition" | "state" | "block")} type
     * @param {any} value
     * @returns App
     * @memberof App
     */
    add(type: "service" | "transition" | "state" | "block", value: any): App;
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
     * Returns the current page in the PageManager
     *
     * @returns Page
     * @memberof App
     */
    currentPage(): Page;
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
     * A shortcut to the App EventEmitter once method
     *
     * @param {string} events
     * @param {ListenerCallback} callback
     * @returns App
     * @memberof App
     */
    once(events: string, callback: ListenerCallback): App;
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
