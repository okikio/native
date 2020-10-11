import { EventEmitter, ListenerCallback, EventInput } from "./emitter";
import { TransitionManager, Transition } from "./transition";
import { HistoryManager, IState } from "./history";
import { ServiceManager, Service } from "./service";
import { PageManager } from "./page";
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
        this.history = new HistoryManager();
        this.pages = new PageManager(this);
        this.emitter = new EventEmitter();

        let handler = (() => {
            document.removeEventListener("DOMContentLoaded", handler);
            window.removeEventListener("load", handler);
            this.emitter.emit("READY");
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
     * Based on the type, it will return either a Transition, a Service, or a State from their respective Managers
     *
     * @param {("service" | "transition" | "state" | string)} type
     * @param {any} key
     * @returns Service | Transition | State
     * @memberof App
     */
    public get(type: "service" | "transition" | "state" | string, key: any): Service | Transition | IState {
        switch (type.toLowerCase()) {
            case "service":
                return this.services.get(key);
            case "transition":
                return this.transitions.get(key);
            case "state":
                return this.history.get(key);
            default:
                throw `Error: can't get type '${type}', it is not a recognized type. Did you spell it correctly.`;
        }
    }

    /**
     * Based on the type, it will return load either Page a Transition, a Service, a State, or a Page from their respective Managers
     *
     * @param {("page" | string)} type
     * @param {any} key
     * @returns App
     * @memberof App
     */
    public async load(type: "page" | string, key: any): Promise<any> {
        switch (type.toLowerCase()) {
            case "page":
                return await this.pages.load(key);
            default:
                return Promise.resolve(this.get(type, key));
        }
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
     * Based on the type, it will add either a Transition, a Service, or a State to their respective Managers
     *
     * @param {("service" | "transition" | "state")} type
     * @param {any} value
     * @returns App
     * @memberof App
     */
    public add(type: "service" | "transition" | "state", value: any): App {
        switch (type.toLowerCase()) {
            case "service":
                this.services.add(value);
                break;
            case "transition":
                this.transitions.add(value);
                break;
            case "state":
                this.history.add(value);
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
        return this;
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
