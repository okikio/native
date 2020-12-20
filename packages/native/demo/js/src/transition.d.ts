import { AdvancedManager } from "./manager";
import { EventEmitter } from "./emitter";
import { Trigger } from "./history";
import { Service } from "./service";
import { Page } from "./page";
import { App } from "./app";
/**
 * The async function type, allows for smooth transition between Promises
 */
export declare type asyncFn = (err?: any, value?: any) => void;
export interface ITransition {
    oldPage: Page;
    newPage: Page;
    trigger: Trigger;
}
export interface ITransitionData {
    from?: Page;
    to?: Page;
    trigger?: Trigger;
    done: asyncFn;
}
/**
 * Controls the animation between pages
 *
 * @export
 * @class Transition
 */
export declare class Transition extends Service {
    /**
     * Transition name
     *
     * @public
     * @type string
     * @memberof Transition
     */
    name: string;
    /**
     * The page to transition from
     *
     * @public
     * @type Page
     * @memberof Transition
     */
    oldPage: Page;
    /**
     * Page to transition to
     *
     * @public
     * @type Page
     * @memberof Transition
     */
    newPage: Page;
    /**
     * What triggered the transition to occur
     *
     * @public
     * @type Trigger
     * @memberof Transition
     */
    trigger: Trigger;
    /**
     * Creates an instance of Transition.
     *
     * @memberof Transition
     */
    constructor();
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
    init({ oldPage, newPage, trigger }: ITransition): void;
    /**
     * Transition from current page
     *
     * @param {ITransitionData} { from, trigger, done }
     * @memberof Transition
     */
    out({ done }: ITransitionData): any;
    /**
     * Transition into the next page
     *
     * @param {ITransitionData} { from, to, trigger, done }
     * @memberof Transition
     */
    in({ done }: ITransitionData): any;
    /**
     * Starts the transition
     *
     * @returns Promise<Transition>
     * @memberof Transition
     */
    start(EventEmitter: EventEmitter): Promise<Transition>;
}
/**
 * Controls which animation between pages to use
 *
 * @export
 * @class TransitionManager
 * @extends {AdvancedManager<string, Transition>}
 */
export declare class TransitionManager extends AdvancedManager<string, Transition> {
    /**
     * Creates an instance of the TransitionManager
     *
     * @param {App} app
     * @memberof TransitionManager
     */
    constructor(app: App);
    /**
     * Quick way to add a Transition to the TransitionManager
     *
     * @param {Transition} value
     * @returns TransitionManager
     * @memberof TransitionManager
     */
    add(value: Transition): TransitionManager;
    /**
     * Runs a transition
     *
     * @param {{ name: string, oldPage: Page, newPage: Page, trigger: Trigger }} { name, oldPage, newPage, trigger }
     * @returns Promise<Transition>
     * @memberof TransitionManager
     */
    boot({ name, oldPage, newPage, trigger }: {
        name: string;
        oldPage: Page;
        newPage: Page;
        trigger: Trigger;
    }): Promise<Transition>;
}
