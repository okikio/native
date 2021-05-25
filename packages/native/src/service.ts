import { AdvancedManager, ManagerItem, methodCall } from "./manager";
import { IApp } from "./app";

/** Controls specific kinds of actions that require JS */
export class Service extends ManagerItem {
	/** Called before the start of a Service, represents a constructor of sorts */
	public init(...args: any): any;
	public init(): any { }

	/** Called on start of Service */
	public boot(...args: any): any;
	public boot(): any {
		this.initEvents();
	}

	/** Initialize events */
	public initEvents(): void { }

	/** Stop events */
	public stopEvents(): void { }

	/** Stop Service */
	public stop(): void {
		this.stopEvents();
		this.unregister();
	}
}

/** The Service Manager controls the lifecycle of all Services in an App */
export class ServiceManager extends AdvancedManager<string, Service> {
	constructor(app: IApp) {
		super(app);
	}

	/** Call the init method for all Services */
	public init(): ServiceManager {
		methodCall(this, "init");
		return this;
	}

	/** Call the boot method for all Services */
	public boot(): ServiceManager {
		methodCall(this, "boot");
		return this;
	}

	/** Call the stop method for all Services */
	public stop(): ServiceManager {
		methodCall(this, "stop");
		return this;
	}
}
