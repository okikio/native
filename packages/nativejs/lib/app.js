import { EventEmitter } from "@okikio/event-emitter";
import { TransitionManager } from "./transition.js";
import { BlockManager } from "./block.js";
import { HistoryManager } from "./history.js";
import { ServiceManager } from "./service.js";
import { PageManager } from "./page.js";
import { CONFIG } from "./config.js";
/**
 * The App class starts the entire process, it controls all managers and all services
 *
 * @export
 * @class App
 */
export class App {
    /**
     * Creates an instance of App.
     *
     * @param {(ICONFIG | CONFIG)} [config={}]
     * @memberof App
     */
    constructor(config = {}) {
        this.register(config);
    }
    /**
     * For registering all managers and the configurations
     *
     * @param {(ICONFIG | CONFIG)} [config={}]
     * @returns App
     * @memberof App
     */
    register(config = {}) {
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
     * @param {...any} args
     * @returns any
     * @memberof App
     */
    getConfig(...args) {
        return this.config.getConfig(...args);
    }
    /**
     * Return the App's EventEmitter
     *
     * @returns EventEmitter
     * @memberof App
     */
    getEmitter() {
        return this.emitter;
    }
    /**
     * Returns the App's BlockManager
     *
     * @returns BlockManager
     * @memberof App
     */
    getBlocks() {
        return this.blocks;
    }
    /**
     * Return the App's ServiceManager
     *
     * @returns ServiceManager
     * @memberof App
     */
    getServices() {
        return this.services;
    }
    /**
     * Return the App's PageManager
     *
     * @returns PageManager
     * @memberof App
     */
    getPages() {
        return this.pages;
    }
    /**
     * Return the App's TransitionManager
     *
     * @returns TransitionManager
     * @memberof App
     */
    getTransitions() {
        return this.transitions;
    }
    /**
     * Return the App's HistoryManager
     *
     * @returns HistoryManager
     * @memberof App
     */
    getHistory() {
        return this.history;
    }
    /**
     * Returns a Block Intent Object from the App's instance of the BlockManager
     *
     * @param {number} key
     * @returns IBlockIntent
     * @memberof App
     */
    getBlock(key) {
        return this.blocks.get(key);
    }
    /**
     * Returns an instance of a Block from the App's instance of the BlockManager
     *
     * @param {number} key
     * @returns Block
     * @memberof App
     */
    getActiveBlock(key) {
        return this.blocks.getActiveBlocks().get(key);
    }
    /**
     * Returns a Service from the App's instance of the ServiceManager
     *
     * @param {number} key
     * @returns Service
     * @memberof App
     */
    getService(key) {
        return this.services.get(key);
    }
    /**
     * Returns a Transition from the App's instance of the TransitionManager
     *
     * @param {string} key
     * @returns Transition
     * @memberof App
     */
    getTransition(key) {
        return this.transitions.get(key);
    }
    /**
     * Returns a State from the App's instance of the HistoryManager
     *
     * @param {number} key
     * @returns State
     * @memberof App
     */
    getState(key) {
        return this.history.get(key);
    }
    /**
     * Based on the type, it will return either a Transition, a Service, or a State from their respective Managers
     *
     * @param {("service" | "transition" | "state" | "block" | string)} type
     * @param {any} key
     * @returns App
     * @memberof App
     */
    get(type, key) {
        switch (type.toLowerCase()) {
            case "service":
                this.getService(key);
                break;
            case "transition":
                this.getTransition(key);
                break;
            case "state":
                this.getState(key);
                break;
            case "block":
                this.getActiveBlock(key);
                break;
            default:
                throw `Error: can't get type '${type}', it is not a recognized type. Did you spell it correctly.`;
        }
        return this;
    }
    /**
     * Returns a Page
     *
     * @param {string} url
     * @returns Promise<Page>
     * @memberof App
     */
    async loadPage(url) {
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
    async load(type, key) {
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
    addBlock(blockIntent) {
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
    addService(service) {
        this.services.add(service);
        return this;
    }
    /**
     * Adds a Transition to the App's instance of the TransitionManager
     *
     * @param {Transition} transition
     * @returns App
     * @memberof App
     */
    addTransition(transition) {
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
    addState(state) {
        this.history.addState(state);
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
    add(type, value) {
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
     * @returns Promise<App>
     * @memberof App
     */
    async boot() {
        this.blocks.init();
        await this.services.boot();
        await this.blocks.boot();
        this.services.initEvents();
        this.blocks.initEvents();
        this.transitions.initEvents();
        return Promise.resolve(this);
    }
    /**
     * Stop the App and the ServiceManager
     *
     * @returns App
     * @memberof App
     */
    stop() {
        this.services.stop();
        this.blocks.stop();
        this.transitions.stopEvents();
        return this;
    }
    /**
     * Returns the current page in the PageManager
     *
     * @returns Page
     * @memberof App
     */
    currentPage() {
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
    on(events, callback) {
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
    off(events, callback) {
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
    once(events, callback) {
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
    emit(events, ...args) {
        this.emitter.emit(events, ...args);
        return this;
    }
}
//# sourceMappingURL=ts/app.js.map
