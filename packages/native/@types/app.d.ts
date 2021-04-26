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
/** The App class starts the entire process, it controls all managers and all services */
export declare class App implements IApp {
    /** An instance of the ServiceManager */
    services: ServiceManager;
    /** An instance of an EventEmitter */
    emitter: EventEmitter;
    /** The current Configuration's for the App */
    config: ICONFIG;
    private canResize;
    private canScroll;
    constructor(config?: object);
    /** Create new instances of the ServiceManager, EventEmitter and the configurations */
    register(config?: ICONFIG): App;
    private _ready;
    private _resize;
    private _scroll;
    /** Shortcuts to adding, setting, and getting Services */
    get(key: string): Service;
    set(key: string, value: Service): App;
    add(value: Service): App;
    /** Initialize and boot all Services */
    boot(): App;
    /** Stops all Services and clears the even emitter of all events and listeners */
    stop(): App;
    /** Shortcuts to the App EventEmitter on, off, and emit methods */
    on(events: EventInput, callback?: ListenerCallback): App;
    off(events: EventInput, callback?: ListenerCallback): App;
    emit(events: string | any[], ...args: any): App;
}
