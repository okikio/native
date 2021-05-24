import { EventEmitter, TypeEventInput } from "@okikio/emitter";
import { ServiceManager, Service } from "./service";
import { ICONFIG } from "./config";
import { ITransitionData } from "./transition";
import { StateEvent } from "./pjax";
export interface IApp extends App {
}
export declare type TypeAllEvents = "REQUEST_ERROR" | "TIMEOUT_ERROR" | "ANCHOR_HOVER" | "HOVER" | "ANCHOR_CLICK" | "CLICK" | "PREFETCH" | "POPSTATE" | "POPSTATE_BACK" | "POPSTATE_FORWARD" | "HISTORY_NEW_ITEM" | "GO" | "NAVIGATION_START" | "PAGE_LOADING" | "PAGE_LOAD_COMPLETE" | "NAVIGATION_END" | "TRANSITION_START" | "TRANSITION_END" | "BEFORE_TRANSITION_OUT" | "AFTER_TRANSITION_OUT" | "CONTENT_INSERT" | "CONTENT_REPLACED" | "BEFORE_TRANSITION_IN" | "AFTER_TRANSITION_IN" | "READY" | "ready" | "SCROLL" | "scroll" | "RESIZE" | "resize";
export declare type TypeEmitArgs = ((ITransitionData & {
    oldHref: string;
    href: string;
    transitionName: string;
}) | StateEvent | Error | void | any)[];
export declare type TypeAppListenerCallback = (...args: TypeEmitArgs) => void;
/** The App class starts the entire process, it controls all managers and all services */
export declare class App {
    /** An instance of the ServiceManager */
    services: ServiceManager;
    /** An instance of an EventEmitter */
    emitter: EventEmitter;
    /** The current Configuration's for the App */
    config: ICONFIG;
    protected canResize: boolean;
    protected canScroll: boolean;
    constructor(config?: ICONFIG);
    /** Create new instances of the ServiceManager, EventEmitter and the configurations */
    register(config?: ICONFIG): App;
    protected _ready(): void;
    protected _resize(): void;
    protected _scroll(): void;
    /** Shortcuts for getting Services */
    get(key: string): Service;
    /** Shortcuts for setting Services */
    set(key: string, value: Service): App;
    /** Shortcuts for adding Services */
    add(value: Service): App;
    /** Initialize and boot all Services */
    boot(): App;
    /** Stops all Services and clears the even emitter of all events and listeners */
    stop(): App;
    /** Shortcuts to the App EventEmitter on method */
    on(events: TypeAllEvents | TypeEventInput, callback?: TypeAppListenerCallback): App;
    /** Shortcuts to the App EventEmitter off method */
    off(events: TypeAllEvents | TypeEventInput, callback?: TypeAppListenerCallback): App;
    /** Shortcuts to the App EventEmitter emit method */
    emit(events: TypeAllEvents | string | string[], ...args: TypeEmitArgs): App;
}
