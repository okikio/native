import { EventEmitter } from "@okikio/emitter";
import { ServiceManager, Service } from "./service";
import { newConfig } from "./config";

import type { TypeEventInput } from "@okikio/emitter";
import type { ICONFIG } from "./config";
import type { ITransitionData } from "./transition";
import type { TypeStateEvent } from "./pjax";

export interface IApp extends App { }

export type TypeAllEvents = "REQUEST_ERROR" | "TIMEOUT_ERROR" | "ANCHOR_HOVER" | "HOVER" | "ANCHOR_CLICK" | "CLICK" | "PREFETCH" | "POPSTATE" | "POPSTATE_BACK" | "POPSTATE_FORWARD" | "HISTORY_NEW_ITEM" | "GO" | "NAVIGATION_START" | "PAGE_LOADING" | "PAGE_LOAD_COMPLETE" | "NAVIGATION_END" | "TRANSITION_START" | "TRANSITION_END" | "BEFORE_TRANSITION_OUT" | "AFTER_TRANSITION_OUT" | "CONTENT_INSERT" | "CONTENT_REPLACED" | "BEFORE_TRANSITION_IN" | "AFTER_TRANSITION_IN" | "READY" | "ready" | "SCROLL" | "scroll" | "RESIZE" | "resize";

export type TypeEmitArgs = (
    (ITransitionData & { oldHref: string, href: string, transitionName: string })
    | TypeStateEvent | Error | void | any
)[];
export type TypeAppListenerCallback = (...args: TypeEmitArgs) => void;

/** The App class starts the entire process, it controls all managers and all services */
export class App {
    /** An instance of the ServiceManager */
    public services: ServiceManager;

    /** An instance of an EventEmitter */
    public emitter: EventEmitter;

    /** The current Configuration's for the App */
    public config: ICONFIG;

    protected canResize = true;
    protected canScroll = true;
    constructor(config: ICONFIG = {}) {
        this._resize = this._resize.bind(this);
        this._scroll = this._scroll.bind(this);
        this._ready = this._ready.bind(this);
        this.register(config);
    }

    /** Create new instances of the ServiceManager, EventEmitter and the configurations */
    public register(config: ICONFIG = {}): App {
        this.config = newConfig(config);
        this.emitter = new EventEmitter();
        this.services = new ServiceManager(this);
        return this;
    }

    protected _ready() {
        document.removeEventListener("DOMContentLoaded", this._ready);
        window.removeEventListener("load", this._ready);
        this.emitter.emit("READY ready");
    }

    protected _resize() {
        if (this.canResize) {
            let timer: number | void;
            this.canResize = false;
            window.requestAnimationFrame(() => {
                this.emitter.emit("RESIZE resize");

                // Set a timeout to un-throttle
                timer = window.setTimeout(() => {
                    this.canResize = true;
                    timer = window.clearTimeout(timer as number);
                }, this.config.resizeDelay);
            });
        }
    }

    protected _scroll() {
        if (this.canScroll) {
            this.canScroll = false;
            window.requestAnimationFrame(() => {
                this.emitter.emit("SCROLL scroll");
                this.canScroll = true;
            });
        }
    }

    /** Shortcuts for getting Services */
    public get(key: string): Service {
        return this.services.get(key);
    }

    /** Shortcuts for setting Services */
    public set(key: string, value: Service): App {
        this.services.set(key, value);
        return this;
    }

    /** Shortcuts for adding Services */
    public add(value: Service): App {
        this.services.add(value);
        return this;
    }

    /** Initialize and boot all Services */
    public boot(): App {
        document.addEventListener("DOMContentLoaded", this._ready);
        window.addEventListener("load", this._ready);

        window.addEventListener("resize", this._resize, { passive: true });
        window.addEventListener("scroll", this._scroll, { passive: true });

        this.services.init();
        this.services.boot();
        return this;
    }

    /** Stops all Services and clears the even emitter of all events and listeners */
    public stop(): App {
        window.removeEventListener("resize", this._resize);
        window.removeEventListener("scroll", this._scroll);

        this.services.stop();
        this.emitter.clear();
        return this;
    }

    /** Shortcuts to the App EventEmitter on method */
    public on(events: TypeAllEvents | TypeEventInput, callback?: TypeAppListenerCallback): App {
        this.emitter.on(events, callback, this);
        return this;
    }

    /** Shortcuts to the App EventEmitter off method */
    public off(events: TypeAllEvents | TypeEventInput, callback?: TypeAppListenerCallback): App {
        this.emitter.off(events, callback, this);
        return this;
    }

    /** Shortcuts to the App EventEmitter emit method */
    public emit(events: TypeAllEvents | string | string[], ...args: TypeEmitArgs): App {
        this.emitter.emit(events, ...args);
        return this;
    }
}
