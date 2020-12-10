import { Manager } from "./manager";
import { EventEmitter } from "./emitter";
import { ICoords, Trigger } from "./history";
import { Page } from "./page";
import { App } from "./app";
import { CONFIG } from "./config";
/**
 * The async function type, allows for smooth transition between Promises
 */
export declare type asyncFn = (err?: any, value?: any) => void;
export interface ITransition {
    oldPage?: Page;
    newPage?: Page;
    trigger?: Trigger;
    scroll?: {
        x: number;
        y: number;
    };
    scrollable?: boolean;
    in: (data: ITransitionData) => any;
    out: (data: ITransitionData) => any;
    [key: string]: any;
}
export interface ITransitionData {
    from?: Page;
    to?: Page;
    trigger?: Trigger;
    scroll?: ICoords;
    done: asyncFn;
}
/**
 * Controls which animation between pages to use
 *
 * @export
 * @class TransitionManager
 * @extends {Manager<string, ITransition>}
 */
export declare class TransitionManager extends Manager<string, ITransition> {
    /**
     * The instance of the App class, the Manager is instantiated in
     *
     * @type App
     * @memberof AdvancedManager
     */
    app: App;
    /**
     * The Config class of the App the AdvancedManager is attached to
     *
     * @public
     * @type CONFIG
     * @memberof AdvancedManager
    */
    config: CONFIG;
    /**
     * The EventEmitter class of the App the AdvancedManager is attached to
     *
     * @public
     * @type EventEmitter
     * @memberof AdvancedManager
    */
    emitter: EventEmitter;
    /**
     * Creates an instance of the TransitionManager
     *
     * @param {App} app
     * @memberof TransitionManager
     */
    constructor(app: App);
    /**
     * Runs a transition
     *
     * @param {{ name: string, oldPage: Page, newPage: Page, trigger: Trigger }} data
     * @returns Promise<Transition>
     * @memberof TransitionManager
     */
    boot(name: string, data: any): Promise<ITransition>;
}
