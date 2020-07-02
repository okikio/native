import { AdvancedManager, ManagerItem } from "./manager";
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
		this.methodCall("init", this.getApp());
		return this;
	}

	/**
	 * Call the boot method for all Services
	 *
	 * @returns ServiceManager
	 * @memberof ServiceManager
	 */
	public boot(): ServiceManager {
		this.methodCall("boot");
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