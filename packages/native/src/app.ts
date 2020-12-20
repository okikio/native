import { EventEmitter, ListenerCallback, EventInput } from "./emitter";
import { ServiceManager, Service } from "./service";
import { newConfig, ICONFIG } from "./config";

/**
 * The App class starts the entire process, it controls all managers and all services
 *
 * @export
 * @class App
 */
export class App {
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
     * The current Configuration's for the framework
     *
     * @public
     * @type ICONFIG
     * @memberof App
     */
    public config: ICONFIG;

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
     * @param {(ICONFIG)} [config={}]
     * @returns App
     * @memberof App
     */
    public register(config: ICONFIG = {}): App {
        this.config = newConfig(config);
        this.emitter = new EventEmitter();
        this.services = new ServiceManager(this);

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
     * Based on the type, it will return either a Transition, a Service, or a State from their respective Managers
     *
     * @param {string} key
     * @returns Service | Transition | State
     * @memberof App
     */
    public get(key: string): Service {
        return this.services.get(key);
    }

    /**
     * Adds a Service to the App's instance of the ServiceManager, with a name
     *
     * @param {string} key
     * @param {Service} service
     * @returns App
     * @memberof App
     */
    public set(key: string, service: Service): App {
        this.services.set(key, service);
        return this;
    }

    /**
     * Based on the type, it will add either a Transition, a Service, or a State to their respective Managers
     *
     * @param {Service} value
     * @returns App
     * @memberof App
     */
    public add(value: Service): App {
        this.services.add(value);
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
