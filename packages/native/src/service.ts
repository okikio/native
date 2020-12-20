import { AdvancedManager, ManagerItem, methodCall } from "./manager";
import { EventEmitter } from "./emitter";
import { IApp } from "./app";

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
	public emitter: EventEmitter;

	/**
	 * Stores the ServiceManager the service is install on
	 *
	 * @public
	 * @type ServiceManager
	 * @memberof Service
	 */
	public ServiceManager: ServiceManager;

	/**
	 * Method is run once when Service is installed on a ServiceManager
	 *
	 * @memberof Service
	 */
	public install(): void {
		let { app } = this.manager;
		this.ServiceManager = app.services;
	}

	// Called before the start of a Service, represents a constructor of sorts
	public init(...args: any): any;
	public init(): any { }

	// Called on start of Service
	public boot(...args: any): any;
	public boot(): any {
		this.initEvents();
	}

	// Initialize events
	public initEvents(): void { }

	// Stop events
	public stopEvents(): void { }

	public uninstall() {
		this.ServiceManager = undefined;
	}

	// Stop services
	public stop(): void {
		this.stopEvents();
		this.unregister();
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
	 * @param {IApp} app
	 * @memberof ServiceManager
	 */
	constructor(app: IApp) {
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
