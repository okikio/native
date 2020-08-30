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
export class App {
    /**
     * A new instance of the HistoryManager
     *
     * @protected
     * @type HistoryManager
     * @memberof App
     */
    protected history: HistoryManager;

    /**
     * A new instance of the TransitionManager
     *
     * @protected
     * @type TransitionManager
     * @memberof App
     */
    protected transitions: TransitionManager;

    /**
     * A new instance of the ServiceManager
     *
     * @protected
     * @type ServiceManager
     * @memberof App
     */
    protected services: ServiceManager;

    /**
     * A new instance of the BlockManager
     *
     * @protected
     * @type BlockManager
     * @memberof App
     */
    protected blocks: BlockManager;

    /**
     * A new instance of an EventEmitter
     *
     * @protected
     * @type EventEmitter
     * @memberof App
     */
    protected emitter: EventEmitter;

    /**
     * A new instance of the PageManager
     *
     * @protected
     * @type PageManager
     * @memberof App
     */
    protected pages: PageManager;

    /**
     * The current Configuration's for the framework
     *
     * @protected
     * @type CONFIG
     * @memberof App
     */
    protected config: CONFIG;

    /**
     * Creates an instance of App.
     *
     * @param {(ICONFIG | CONFIG)} [config={}]
     * @memberof App
     */
    constructor(config: object = {}) {
        this.register(config);
    }

    /**
     * For registering all managers and the configurations
     *
     * @param {(ICONFIG | CONFIG)} [config={}]
     * @returns App
     * @memberof App
     */
    public register(config: ICONFIG | CONFIG = {}): App {
        this.config = config instanceof CONFIG ? config : new CONFIG(config);
        this.transitions = new TransitionManager(this);
        this.services = new ServiceManager(this);
        this.blocks = new BlockManager(this);
        this.history = new HistoryManager();
        this.pages = new PageManager(this);
        this.emitter = new EventEmitter();

        let handler = (() => {
            document.removeEventListener("DOMContentLoaded", handler);
            window.removeEventListener("load", handler);
            this.emitter.emit("READY ready");
        }).bind(this);

        document.addEventListener("DOMContentLoaded", handler);
        window.addEventListener("load", handler);
        return this;
    }

    /**
     * Returns the current configurations for the framework
     *
     * @param {ConfigKeys} [value]
     * @param {boolean} [brackets=true]
     * @returns {*}
     * @memberof App
     */
    public getConfig(value?: ConfigKeys, brackets: boolean = true): any {
        return this.config.getConfig(value, brackets);
    }

    /**
     * Return the App's EventEmitter
     *
     * @returns EventEmitter
     * @memberof App
     */
    public getEmitter(): EventEmitter {
        return this.emitter;
    }

    /**
     * Returns the App's BlockManager
     *
     * @returns BlockManager
     * @memberof App
     */
    public getBlocks(): BlockManager {
        return this.blocks;
    }

    /**
     * Return the App's ServiceManager
     *
     * @returns ServiceManager
     * @memberof App
     */
    public getServices(): ServiceManager {
        return this.services;
    }

    /**
     * Return the App's PageManager
     *
     * @returns PageManager
     * @memberof App
     */
    public getPages(): PageManager {
        return this.pages;
    }

    /**
     * Return the App's TransitionManager
     *
     * @returns TransitionManager
     * @memberof App
     */
    public getTransitions(): TransitionManager {
        return this.transitions;
    }

    /**
     * Return the App's HistoryManager
     *
     * @returns HistoryManager
     * @memberof App
     */
    public getHistory(): HistoryManager {
        return this.history;
    }

    /**
     * Returns a Block Intent Object from the App's instance of the BlockManager
     *
     * @param {number} key
     * @returns IBlockIntent
     * @memberof App
     */
    public getBlock(key: number): BlockIntent {
        return this.blocks.get(key);
    }

    /**
     * Returns an instance of a Block from the App's instance of the BlockManager
     *
     * @param {string} name
     * @param {number} key
     * @returns Block
     * @memberof App
     */
    public getActiveBlock(name: string, key: number): Block {
        return this.blocks.getActiveBlocks().get(name).get(key);
    }

    /**
     * Returns a Service from the App's instance of the ServiceManager
     *
     * @param {string} key
     * @returns Service
     * @memberof App
     */
    public getService(key: string): Service {
        return this.services.get(key);
    }

    /**
     * Returns a Transition from the App's instance of the TransitionManager
     *
     * @param {string} key
     * @returns Transition
     * @memberof App
     */
    public getTransition(key: string): Transition {
        return this.transitions.get(key);
    }

    /**
     * Returns a State from the App's instance of the HistoryManager
     *
     * @param {number} key
     * @returns State
     * @memberof App
     */
    public getState(key: number): State {
        return this.history.get(key);
    }

    /**
     * Based on the type, it will return either a Transition, a Service, or a State from their respective Managers
     *
     * @param {("service" | "transition" | "state" | string)} type
     * @param {any} key
     * @returns Service | Transition | State
     * @memberof App
     */
    public get(type: "service" | "transition" | "state" | string, key: any): Service | Transition | State {
        switch (type.toLowerCase()) {
            case "service":
                return this.getService(key);
            case "transition":
                return this.getTransition(key);
            case "state":
                return this.getState(key);
            default:
                throw `Error: can't get type '${type}', it is not a recognized type. Did you spell it correctly.`;
        }
    }

    /**
     * Returns a Page
     *
     * @param {string} url
     * @returns Promise<Page>
     * @memberof App
     */
    public async loadPage(url: string): Promise<Page> {
        return await this.pages.load(url);
    }

    /**
     * Based on the type, it will return load a Transition, a Service, a State, or a Page from their respective Managers
     *
     * @param {("page" | string)} type
     * @param {any} key
     * @returns App
     * @memberof App
     */
    public async load(type: "page" | string, key: any): Promise<any> {
        switch (type.toLowerCase()) {
            case "page":
                return await this.loadPage(key);
            default:
                return Promise.resolve(this.get(type, key));
        }
    }

    /**
     * Adds a Block Intent to the App's instance of the BlockManager
     *
     * @param {BlockIntent} blockIntent
     * @returns App
     * @memberof App
     */
    public addBlock(blockIntent: BlockIntent): App {
        this.blocks.add(blockIntent);
        return this;
    }

    /**
     * Adds a Service to the App's instance of the ServiceManager
     *
     * @param {Service} service
     * @returns App
     * @memberof App
     */
    public addService(service: Service): App {
        this.services.add(service);
        return this;
    }

    /**
     * Adds a Service to the App's instance of the ServiceManager, with a name
     *
     * @param {string} key
     * @param {Service} service
     * @returns App
     * @memberof App
     */
    public setService(key: string, service: Service): App {
        this.services.set(key, service);
        return this;
    }

    /**
     * Adds a Transition to the App's instance of the TransitionManager
     *
     * @param {Transition} transition
     * @returns App
     * @memberof App
     */
    public addTransition(transition: Transition): App {
        this.transitions.add(transition);
        return this;
    }

    /**
     * Adds a State to the App's instance of the HistoryManager
     *
     * @param {(IState | State)} state
     * @returns App
     * @memberof App
     */
    public addState(state: IState | State): App {
        this.history.addState(state);
        return this;
    }

    /**
     * Based on the type, it will add either a Transition, a Service, or a State to their respective Managers
     *
     * @param {("service" | "transition" | "state" | "block")} type
     * @param {any} value
     * @returns App
     * @memberof App
     */
    public add(type: "service" | "transition" | "state" | "block", value: any): App {
        switch (type.toLowerCase()) {
            case "service":
                this.addService(value);
                break;
            case "transition":
                this.addTransition(value);
                break;
            case "state":
                this.addState(value);
                break;
            case "block":
                this.addBlock(value);
                break;
            default:
                throw `Error: can't add type '${type}', it is not a recognized type. Did you spell it correctly.`;
        }

        return this;
    }

    /**
     * Start the App and the ServiceManager
     *
     * @returns App
     * @memberof App
     */
    public boot(): App {
        this.services.init();
        this.services.boot();

        this.blocks.init();
        this.blocks.boot();
        return this;
    }

    /**
     * Stop the App and the ServiceManager
     *
     * @returns App
     * @memberof App
     */
    public stop(): App {
        this.services.stop();
        this.blocks.stop();
        return this;
    }

    /**
     * Returns the current page in the PageManager
     *
     * @returns Page
     * @memberof App
     */
    public currentPage(): Page {
        let currentState = this.history.last();
        return this.pages.get(currentState.getURLPathname());
    }

    /**
     * A shortcut to the App EventEmitter on method
     *
     * @param {EventInput} events
     * @param {ListenerCallback} callback
     * @returns App
     * @memberof App
     */
    public on(events: EventInput, callback?: ListenerCallback): App {
        this.emitter.on(events, callback, this);
        return this;
    }

    /**
     * A shortcut to the App EventEmitter off method
     *
     * @param {EventInput} events
     * @param {ListenerCallback} callback
     * @returns App
     * @memberof App
     */
    public off(events: EventInput, callback?: ListenerCallback): App {
        this.emitter.off(events, callback, this);
        return this;
    }

    /**
     * A shortcut to the App EventEmitter once method
     *
     * @param {string} events
     * @param {ListenerCallback} callback
     * @returns App
     * @memberof App
     */
    public once(events: string, callback: ListenerCallback): App {
        this.emitter.once(events, callback, this);
        return this;
    }

    /**
     * A shortcut to the App EventEmitter emit method
     *
     * @param {(string | any[])} events
     * @param {...any} args
     * @returns App
     * @memberof App
     */
    public emit(events: string | any[], ...args: any): App {
        this.emitter.emit(events, ...args);
        return this;
    }
}
