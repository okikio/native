import { Manager } from "./manager";
import { EventEmitter } from "./emitter";
import { ICoords, Trigger } from "./history";
import { Page } from "./page";
import { App } from "./app";
import { CONFIG } from "./config";
import { hashAction } from "./pjax";

/**
 * The async function type, allows for smooth transition between Promises
 */
export type asyncFn = (err?: any, value?: any) => void;
export interface ITransition {
    oldPage?: Page;
    newPage?: Page;
    trigger?: Trigger;
    scroll?: { x: number; y: number };
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
export class TransitionManager extends Manager<string, ITransition> {
    /**
     * The instance of the App class, the Manager is instantiated in
     *
     * @type App
     * @memberof AdvancedManager
     */
    public app: App;

    /**
     * The Config class of the App the AdvancedManager is attached to
     *
     * @public
     * @type CONFIG
     * @memberof AdvancedManager
    */
    public config: CONFIG;

    /**
     * The EventEmitter class of the App the AdvancedManager is attached to
     *
     * @public
     * @type EventEmitter
     * @memberof AdvancedManager
    */
    public emitter: EventEmitter;

    /**
     * Creates an instance of the TransitionManager
     *
     * @param {App} app
     * @memberof TransitionManager
     */
    constructor(app: App) {
        super();
        this.app = app;
        this.config = app.config;
        this.emitter = app.emitter;
    }

    /**
     * Runs a transition
     *
     * @param {{ name: string, oldPage: Page, newPage: Page, trigger: Trigger }} data
     * @returns Promise<Transition>
     * @memberof TransitionManager
     */
    public async boot(name: string, data: any): Promise<ITransition> {
        let transition: ITransition = this.get(name);
        let scroll = data.scroll;
        if (!(data.oldPage instanceof Page) || !(data.newPage instanceof Page))
            throw `[Page] either oldPage or newPage aren't instances of the Page Class.\n ${{
                newPage: data.newPage,
                oldPage: data.oldPage,
            }}`;

        let fromWrapper = data.oldPage.wrapper;
        let toWrapper = data.newPage.wrapper;
        document.title = `` + data.newPage.title;

        if (!(fromWrapper instanceof Node) || !(toWrapper instanceof Node))
            throw `[Wrapper] the wrapper from the ${!(toWrapper instanceof Node) ? "next" : "current"
            } page cannot be found. The wrapper must be an element that has the attribute ${this.config.getConfig(
                "wrapperAttr"
            )}.`;
        transition.init && transition?.init(data);

        this.emitter.emit("BEFORE_TRANSITION_OUT");
        await new Promise((done) => {
            let outMethod: Promise<any> = transition.out.call(transition, {
                ...data,
                from: data.oldPage,
                trigger: data.trigger,
                done,
            });

            if (outMethod.then) outMethod.then(done);
        });

        this.emitter.emit("AFTER_TRANSITION_OUT");
        await new Promise<void>((done) => {
            fromWrapper.insertAdjacentElement("beforebegin", toWrapper);
            this.emitter.emit("CONTENT_INSERT");

            if (!/back|popstate|forward/.test(data.trigger as string)) {
                scroll = hashAction();
            }
            done();
        });

        await new Promise<void>((done) => {
            fromWrapper.remove();
            fromWrapper = undefined;
            toWrapper = undefined;
            this.emitter.emit("CONTENT_REPLACED");
            done();
        });

        this.emitter.emit("BEFORE_TRANSITION_IN");

        await new Promise(async (done) => {
            let inMethod: Promise<any> = transition.in.call(transition, {
                ...data,
                from: data.oldPage,
                to: data.newPage,
                trigger: data.trigger,
                scroll,
                done,
            });

            if (inMethod.then) inMethod.then(done);
        });

        this.emitter.emit("AFTER_TRANSITION_IN");
        return transition;
    }
}
