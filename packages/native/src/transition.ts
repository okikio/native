import { AdvancedManager } from "./manager";
import { EventEmitter } from "./emitter";
import { Trigger } from "./history";
import { Service } from "./service";
import { Page } from "./page";
import { App } from "./app";

/**
 * The async function type, allows for smooth transition between Promises
 */
export type asyncFn = (err?: any, value?: any) => void;
export interface ITransition {
    oldPage: Page,
    newPage: Page,
    trigger: Trigger
}
export interface ITransitionData {
    from?: Page,
    to?: Page,
    trigger?: Trigger,
    done: asyncFn
}

/**
 * Controls the animation between pages
 *
 * @export
 * @class Transition
 */
export class Transition extends Service {
	/**
	 * Transition name
	 *
	 * @public
	 * @type string
	 * @memberof Transition
	 */
    public name: string = "Transition";

	/**
	 * The page to transition from
	 *
	 * @public
	 * @type Page
	 * @memberof Transition
	 */
    public oldPage: Page;

	/**
	 * Page to transition to
	 *
	 * @public
	 * @type Page
	 * @memberof Transition
	 */
    public newPage: Page;

	/**
	 * What triggered the transition to occur
	 *
	 * @public
	 * @type Trigger
	 * @memberof Transition
	 */
    public trigger: Trigger;

    /**
     * Creates an instance of Transition.
     *
     * @memberof Transition
     */
    constructor() { super(); }

	/**
	 * Initialize the transition
	 *
	 * @param {ITransition} {
	 * 		oldPage,
	 * 		newPage,
	 * 		trigger
	 * 	}
     * @returns void
	 * @memberof Transition
	 */
    public init({
        oldPage,
        newPage,
        trigger
    }: ITransition): void {
        super.init();
        this.oldPage = oldPage;
        this.newPage = newPage;
        this.trigger = trigger;
        this.boot();
    }

    // Based off the highwayjs Transition class
	/**
	 * Transition from current page
	 *
	 * @param {ITransitionData} { from, trigger, done }
	 * @memberof Transition
	 */
    public out({ done }: ITransitionData): any {
        done();
    }

	/**
	 * Transition into the next page
	 *
	 * @param {ITransitionData} { from, to, trigger, done }
	 * @memberof Transition
	 */
    public in({ done }: ITransitionData): any {
        done();
    }

    /**
     * Starts the transition
     *
     * @returns Promise<Transition>
     * @memberof Transition
     */
    public async start(EventEmitter: EventEmitter): Promise<Transition> {
        let fromWrapper = this.oldPage.wrapper;
        let toWrapper = this.newPage.wrapper;
        document.title = this.newPage.title;

        if (!(fromWrapper instanceof Node) || !(toWrapper instanceof Node))
            throw `[Wrapper] the wrapper from the ${!(toWrapper instanceof Node) ? "next" : "current"} page cannot be found. The wrapper must be an element that has the attribute ${this.getConfig("wrapperAttr")}.`;

        EventEmitter.emit("BEFORE_TRANSITION_OUT");
        await new Promise(done => {
            let outMethod: Promise<any> = this.out({
                from: this.oldPage,
                trigger: this.trigger,
                done
            });

            if (outMethod.then)
                outMethod.then(done);
        });

        EventEmitter.emit("AFTER_TRANSITION_OUT");

        await new Promise(done => {
            fromWrapper.insertAdjacentElement('beforebegin', toWrapper);
            fromWrapper.remove();
            EventEmitter.emit("CONTENT_REPLACED");
            done();
        });

        EventEmitter.emit("BEFORE_TRANSITION_IN");

        await new Promise(done => {
            let inMethod: Promise<any> = this.in({
                from: this.oldPage,
                to: this.newPage,
                trigger: this.trigger,
                done
            });

            if (inMethod.then)
                inMethod.then(done);
        });

        EventEmitter.emit("AFTER_TRANSITION_IN");
        return this;
    }
}

/**
 * Controls which animation between pages to use
 *
 * @export
 * @class TransitionManager
 * @extends {AdvancedManager<string, Transition>}
 */
export class TransitionManager extends AdvancedManager<string, Transition> {
	/**
	 * Creates an instance of the TransitionManager
	 *
     * @param {App} app
	 * @memberof TransitionManager
	 */
    constructor(app: App) { super(app); }

	/**
	 * Quick way to add a Transition to the TransitionManager
	 *
	 * @param {Transition} value
	 * @returns TransitionManager
	 * @memberof TransitionManager
	 */
    public add(value: Transition): TransitionManager {
        let name = value.name;
        this.set(name, value);
        return this;
    }

    /**
     * Runs a transition
     *
     * @param {{ name: string, oldPage: Page, newPage: Page, trigger: Trigger }} { name, oldPage, newPage, trigger }
     * @returns Promise<Transition>
     * @memberof TransitionManager
     */
    public async boot({ name, oldPage, newPage, trigger }: { name: string, oldPage: Page, newPage: Page, trigger: Trigger }): Promise<Transition> {
        let transition: Transition = this.get(name);
        transition.init({
            oldPage,
            newPage,
            trigger
        });

        let EventEmitter = this.app.emitter;
        return await transition.start(EventEmitter);
    }
}
