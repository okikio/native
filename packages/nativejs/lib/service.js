import { AdvancedManager, ManagerItem } from "./manager.js";
/**
 * Controls specific kinds of actions that require JS
 *
 * @export
 * @class Service
 */
export class Service extends ManagerItem {
    /**
     * Method is run once when Service is installed on a ServiceManager
     *
     * @memberof Service
     */
    install() {
        let app = this.manager.getApp();
        this.PageManager = app.getPages();
        this.EventEmitter = app.getEmitter();
        this.HistoryManager = app.getHistory();
        this.ServiceManager = app.getServices();
        this.TransitionManager = app.getTransitions();
    }
    // Called on start of Service
    boot() { }
    // Initialize events
    initEvents() { }
    // Stop events
    stopEvents() { }
    // Stop services
    stop() {
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
export class ServiceManager extends AdvancedManager {
    /**
     * Creates an instance of ServiceManager.
     *
     * @param {App} app
     * @memberof ServiceManager
     */
    constructor(app) {
        super(app);
    }
    /**
     * Call the boot method for all Services
     *
     * @returns Promise<void>
     * @memberof ServiceManager
     */
    async boot() {
        await this.asyncMethodCall("boot");
    }
    /**
     * Call the initEvents method for all Services
     *
     * @returns ServiceManager
     * @memberof ServiceManager
     */
    initEvents() {
        this.methodCall("initEvents");
        return this;
    }
    /**
     * Call the stopEvents method for all Services
     *
     * @returns ServiceManager
     * @memberof ServiceManager
     */
    stopEvents() {
        this.methodCall("stopEvents");
        return this;
    }
    /**
     * Call the stop method for all Services
     *
     * @returns ServiceManager
     * @memberof ServiceManager
     */
    stop() {
        this.methodCall("stop");
        return this;
    }
}
//# sourceMappingURL=ts/service.js.map
