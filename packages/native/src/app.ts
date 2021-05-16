import { EventEmitter, TypeListenerCallback, TypeEventInput } from "@okikio/emitter";
import { ServiceManager, Service } from "./service";
import { newConfig, ICONFIG, getConfig } from "./config";

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
    on(events: TypeEventInput, callback?: TypeListenerCallback): App,
    off(events: TypeEventInput, callback?: TypeListenerCallback): App,
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

    private canResize = true;
    private canScroll = true;
    constructor(config: object = {}) {
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

        document.addEventListener("DOMContentLoaded", this._ready);
        window.addEventListener("load", this._ready);
        window.addEventListener("resize", this._resize, { passive: true });
        window.addEventListener("scroll", this._scroll, { passive: true });
        return this;
    }

    private _ready() {
        document.removeEventListener("DOMContentLoaded", this._ready);
        window.removeEventListener("load", this._ready);
        this.emitter.emit("READY ready");
    }

    private _resize() {
        if (this.canResize) {
            let timer: number | void, raf: number | void;
            this.canResize = false;
            raf = window.requestAnimationFrame(() => {
                this.emitter.emit("RESIZE resize");

                // set a timeout to un-throttle
                timer = window.setTimeout(() => {
                    this.canResize = true;
                    timer = window.clearTimeout(timer as number);
                    raf = window.cancelAnimationFrame(raf as number);
                }, getConfig(this.config, "resizeDelay"));
            });
        }
    }

    private _scroll() {
        if (this.canScroll) {
            let raf: number | void;
            this.canScroll = false;
            raf = requestAnimationFrame(() => {
                this.emitter.emit("SCROLL scroll");

                this.canScroll = true;
                raf = window.cancelAnimationFrame(raf as number);
            });
        }
    }

    /** Shortcuts to adding, setting, and getting Services */
    public get(key: string): Service {
        return this.services.get(key);
    }

    public set(key: string, value: Service): App {
        this.services.set(key, value);
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

    /** Stops all Services and clears the even emitter of all events and listeners */
    public stop(): App {
        this.services.stop();
        this.emitter.clear();
        return this;
    }

    /** Shortcuts to the App EventEmitter on, off, and emit methods */
    public on(events: TypeEventInput, callback?: TypeListenerCallback): App {
        this.emitter.on(events, callback, this);
        return this;
    }

    public off(events: TypeEventInput, callback?: TypeListenerCallback): App {
        this.emitter.off(events, callback, this);
        return this;
    }

    public emit(events: string | any[], ...args: any): App {
        this.emitter.emit(events, ...args);
        return this;
    }
}
