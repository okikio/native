import { EventEmitter, ListenerCallback, EventInput } from "./emitter";
import { ServiceManager, Service } from "./service";
import { newConfig, ICONFIG } from "./config";

export interface IApp {
    services: ServiceManager,
    emitter: EventEmitter,
    config: ICONFIG,
    register(config: ICONFIG): App,
    get(key: string): Service,
    set(key: string, service: Service): App,
    add(value: Service): App,
    boot(): App,
    stop(): App,
    on(events: EventInput, callback?: ListenerCallback): App,
    off(events: EventInput, callback?: ListenerCallback): App,
    emit(events: string | any[], ...args: any): App,
}

/** The App class starts the entire process, it controls all managers and all services */
export class App implements IApp {
    /** An instance of the ServiceManager */
    public services: ServiceManager;

    /** An instance of an EventEmitter */
    public emitter: EventEmitter;

    /** The current Configuration's for the App */
    public config: ICONFIG;
    constructor(config: object = {}) {
        this.register(config);
    }

    /** Create new instances of the ServiceManager, EventEmitter and the configurations */
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

    /** Shortcuts to adding, setting, and getting Services */
    public get(key: string): Service {
        return this.services.get(key);
    }

    public set(key: string, service: Service): App {
        this.services.set(key, service);
        return this;
    }

    public add(value: Service): App {
        this.services.add(value);
        return this;
    }

    /** Initialize and boot all Services */
    public boot(): App {
        this.services.init();
        this.services.boot();
        return this;
    }

    /** Stop all Services */
    public stop(): App {
        this.services.stop();
        return this;
    }

    /** Shortcuts to the App EventEmitter on, off, and emit methods */
    public on(events: EventInput, callback?: ListenerCallback): App {
        this.emitter.on(events, callback, this);
        return this;
    }

    public off(events: EventInput, callback?: ListenerCallback): App {
        this.emitter.off(events, callback, this);
        return this;
    }

    public emit(events: string | any[], ...args: any): App {
        this.emitter.emit(events, ...args);
        return this;
    }
}
