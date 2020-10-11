import { AdvancedManager, ManagerItem, methodCall } from "./manager";
import { TransitionManager } from "./transition";
import { HistoryManager } from "./history";
import { EventEmitter } from "./emitter";
import { PageManager } from "./page";
import { App } from "./app";

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
	 * @public
	 * @type EventEmitter
	 * @memberof Service
	 */
	public EventEmitter: EventEmitter;

	/**
	 * Stores access to the App class's PageManager
	 *
	 * @public
	 * @type PageManager
	 * @memberof Service
	 */
	public PageManager: PageManager;

	/**
	 * Stores access to the App class's HistoryManager
	 *
	 * @public
	 * @type HistoryManager
	 * @memberof Service
	 */
	public HistoryManager: HistoryManager;

	/**
	 * Stores the ServiceManager the service is install on
	 *
	 * @public
	 * @type ServiceManager
	 * @memberof Service
	 */
	public ServiceManager: ServiceManager;

	/**
	 * Stores access to the App's TransitionManager
	 *
	 * @public
	 * @type TransitionManager
	 * @memberof Service
	 */
	public TransitionManager: TransitionManager;

	/**
	 * Method is run once when Service is installed on a ServiceManager
     *
	 * @memberof Service
	 */
	public install(): void {
		let { app } = this.manager;
		this.PageManager = app.pages;
		this.EventEmitter = app.emitter;
		this.HistoryManager = app.history;
		this.ServiceManager = app.services;
		this.TransitionManager = app.transitions;
	}

	// Called before the start of a Service, represents a constructor of sorts
	public init(...args: any): void { }

	// Called on start of Service
	public boot(): void {
		this.initEvents();
	}

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
 * @extends {AdvancedManager<string, Service>}
 */
export class ServiceManager extends AdvancedManager<string, Service> {
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
	 * Call the init method for all Services
	 *
	 * @returns ServiceManager
	 * @memberof ServiceManager
	 */
	public init(): ServiceManager {
		methodCall(this, "init", this.app);
		return this;
	}

	/**
	 * Call the boot method for all Services
	 *
	 * @returns ServiceManager
	 * @memberof ServiceManager
	 */
	public boot(): ServiceManager {
		methodCall(this, "boot", this.app);
		return this;
	}

	/**
	 * Call the stop method for all Services
	 *
	 * @returns ServiceManager
	 * @memberof ServiceManager
	 */
	public stop(): ServiceManager {
		methodCall(this, "stop", this.app);
		return this;
	}
}
