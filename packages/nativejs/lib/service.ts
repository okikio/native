import { AdvancedManager, ManagerItem } from "./manager.js";
import { EventEmitter } from "@okikio/event-emitter";
import { TransitionManager } from "./transition.js";
import { HistoryManager } from "./history.js";
import { PageManager } from "./page.js";
import { App } from "./app.js";

/**
 * Controls specific kinds of actions that require JS
 *
 * @export
 * @class Service
 */
export class Service extends ManagerItem {
	/**
	 * Stores access to the App class's EventEmitter
	 *
	 * @protected
	 * @type EventEmitter
	 * @memberof Service
	 */
    protected EventEmitter: EventEmitter;

	/**
	 * Stores access to the App class's PageManager
	 *
	 * @protected
	 * @type PageManager
	 * @memberof Service
	 */
    protected PageManager: PageManager;

	/**
	 * Stores access to the App class's HistoryManager
	 *
	 * @protected
	 * @type HistoryManager
	 * @memberof Service
	 */
    protected HistoryManager: HistoryManager;

	/**
	 * Stores the ServiceManager the service is install on
	 *
	 * @protected
	 * @type ServiceManager
	 * @memberof Service
	 */
    protected ServiceManager: ServiceManager;

	/**
	 * Stores access to the App's TransitionManager
	 *
	 * @protected
	 * @type TransitionManager
	 * @memberof Service
	 */
    protected TransitionManager: TransitionManager;

	/**
	 * Method is run once when Service is installed on a ServiceManager
     *
	 * @memberof Service
	 */
    public install(): void {
        let app = this.manager.getApp();
        this.PageManager = app.getPages();
        this.EventEmitter = app.getEmitter();
        this.HistoryManager = app.getHistory();
        this.ServiceManager = app.getServices();
        this.TransitionManager = app.getTransitions();
    }

    // Called on start of Service
    public boot(): void { }

    // Initialize events
    public initEvents(): void { }

    // Stop events
    public stopEvents(): void { }

    // Stop services
    public stop(): void {
        this.stopEvents();
    }
}

/**
 * The Service Manager controls the lifecycle of all services in an App
 *
 * @export
 * @class ServiceManager
 * @extends {AdvancedManager<number, Service>}
 */
export class ServiceManager extends AdvancedManager<number, Service> {
    /**
     * Creates an instance of ServiceManager.
     *
     * @param {App} app
     * @memberof ServiceManager
     */
    constructor(app: App) {
        super(app);
    }

	/**
	 * Call the boot method for all Services
	 *
	 * @returns Promise<void>
	 * @memberof ServiceManager
	 */
    public async boot(): Promise<void> {
        await this.asyncMethodCall("boot");
    }

	/**
	 * Call the initEvents method for all Services
	 *
	 * @returns ServiceManager
	 * @memberof ServiceManager
	 */
    public initEvents(): ServiceManager {
        this.methodCall("initEvents");
        return this;
    }

	/**
	 * Call the stopEvents method for all Services
	 *
	 * @returns ServiceManager
	 * @memberof ServiceManager
	 */
    public stopEvents(): ServiceManager {
        this.methodCall("stopEvents");
        return this;
    }

	/**
	 * Call the stop method for all Services
	 *
	 * @returns ServiceManager
	 * @memberof ServiceManager
	 */
    public stop(): ServiceManager {
        this.methodCall("stop");
        return this;
    }
}