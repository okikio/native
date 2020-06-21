import { AdvancedManager, ManagerItem } from "./manager.js";
/**
 * Controls the animation between pages
 *
 * @export
 * @class Transition
 */
export class Transition extends ManagerItem {
    /**
     * Creates an instance of Transition.
     *
     * @memberof Transition
     */
    constructor() {
        super();
        /**
         * Transition name
         *
         * @protected
         * @type string
         * @memberof Transition
         */
        this.name = "Transition";
    }
    /**
     * Initialize the transition
     *
     * @param {ITransition} {
     * 		oldPage,
     * 		newPage,
     * 		trigger
     * 	}
     * @returns Transition
     * @memberof Transition
     */
    init({ oldPage, newPage, trigger }) {
        this.oldPage = oldPage;
        this.newPage = newPage;
        this.trigger = trigger;
        this.boot();
        return this;
    }
    // Called on start of Transition
    boot() { }
    // Initialize events
    initEvents() { }
    // Stop events
    stopEvents() { }
    // Stop services
    stop() {
        this.stopEvents();
    }
    /**
     * Returns the Transition's name
     *
     * @returns string
     * @memberof Transition
     */
    getName() {
        return this.name;
    }
    /**
     * Returns the Transition's old page
     *
     * @returns Page
     * @memberof Transition
     */
    getOldPage() {
        return this.oldPage;
    }
    /**
     * Returns the Transition's new page
     *
     * @returns Page
     * @memberof Transition
     */
    getNewPage() {
        return this.newPage;
    }
    /**
     * Returns the Transition's trigger
     *
     * @returns Trigger
     * @memberof Transition
     */
    getTrigger() {
        return this.trigger;
    }
    // Based off the highwayjs Transition class
    /**
     * Transition from current page
     *
     * @param {ITransitionData} { from, trigger, done }
     * @memberof Transition
     */
    out({ done }) {
        done();
    }
    /**
     * Transition into the next page
     *
     * @param {ITransitionData} { from, to, trigger, done }
     * @memberof Transition
     */
    in({ done }) {
        done();
    }
    /**
     * Starts the transition
     *
     * @returns Promise<Transition>
     * @memberof Transition
     */
    async start(EventEmitter) {
        let fromWrapper = this.oldPage.getWrapper();
        let toWrapper = this.newPage.getWrapper();
        document.title = this.newPage.getTitle();
        return new Promise(async (finish) => {
            EventEmitter.emit("BEFORE-TRANSITION-OUT");
            await new Promise(done => {
                let outMethod = this.out({
                    from: this.oldPage,
                    trigger: this.trigger,
                    done
                });
                if (outMethod.then)
                    outMethod.then(done);
            });
            EventEmitter.emit("AFTER-TRANSITION-OUT");
            await new Promise(done => {
                fromWrapper.insertAdjacentElement('beforebegin', toWrapper);
                fromWrapper.remove();
                done();
            });
            EventEmitter.emit("BEFORE-TRANSITION-IN");
            await new Promise(done => {
                let inMethod = this.in({
                    from: this.oldPage,
                    to: this.newPage,
                    trigger: this.trigger,
                    done
                });
                if (inMethod.then)
                    inMethod.then(done);
            });
            EventEmitter.emit("AFTER_TRANSITION_IN");
            finish();
        });
    }
}
/**
 * Controls which animation between pages to use
 *
 * @export
 * @class TransitionManager
 * @extends {AdvancedManager<string, Transition>}
 */
export class TransitionManager extends AdvancedManager {
    /**
     * Creates an instance of the TransitionManager
     *
     * @param {App} app
     * @memberof TransitionManager
     */
    constructor(app) { super(app); }
    /**
     * Quick way to add a Transition to the TransitionManager
     *
     * @param {Transition} value
     * @returns TransitionManager
     * @memberof TransitionManager
     */
    add(value) {
        let name = value.getName();
        this.set(name, value);
        return this;
    }
    /**
     * Runs a transition
     *
     * @param {{ name: string, oldPage: Page, newPage: Page, trigger: Trigger }} { name, oldPage, newPage, trigger }
     * @returns Promise<void>
     * @memberof TransitionManager
     */
    async boot({ name, oldPage, newPage, trigger }) {
        let transition = this.get(name);
        transition.init({
            oldPage,
            newPage,
            trigger
        });
        let EventEmitter = this.getApp().getEmitter();
        return await transition.start(EventEmitter);
    }
    /**
     * Call the initEvents method for all Transitions
     *
     * @returns TransitionManager
     * @memberof TransitionManager
     */
    initEvents() {
        this.methodCall("initEvents");
        return this;
    }
    /**
     * Call the stopEvents method for all Transitions
     *
     * @returns TransitionManager
     * @memberof TransitionManager
     */
    stopEvents() {
        this.methodCall("stopEvents");
        return this;
    }
}
//# sourceMappingURL=ts/transition.js.map
