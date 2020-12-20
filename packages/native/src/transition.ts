import { Manager } from "./manager";
import { ICoords, Trigger } from "./history";
import { IPage } from "./page";
import { getConfig } from "./config";
import { hashAction } from "./pjax";
import { Service } from "./service";

/**
 * The async function type, allows for smooth transition between Promises
 */
export type asyncFn = (err?: any, value?: any) => void;
export interface ITransition {
    oldPage?: IPage;
    newPage?: IPage;
    trigger?: Trigger;
    scroll?: { x: number; y: number };
    scrollable?: boolean;
    in: (data: ITransitionData) => any;
    out: (data: ITransitionData) => any;
    [key: string]: any;
}
export interface ITransitionData {
    from?: IPage;
    to?: IPage;
    trigger?: Trigger;
    scroll?: ICoords;
    done: asyncFn;
}
export interface ITransitionManager extends Service {
    transitions: Manager<string, ITransition>,

    get(key: string): ITransition,
    set(key: string, value: ITransition): TransitionManager,
    add(value: ITransition): TransitionManager,

    boot(): any,
    animate(name: string, data: any): Promise<ITransition>,
}

/**
 * Controls which animation between pages to use
 *
 * @export
 * @class TransitionManager
 * @extends {Manager<string, ITransition>}
 */
export class TransitionManager extends Service implements ITransitionManager {
    transitions: Manager<string, ITransition>;
    constructor(transitions?) {
        super();
        this.transitions = new Manager(transitions);
    }

    get(key: string) { return this.transitions.get(key); }
    set(key: string, value: ITransition) { this.transitions.set(key, value); return this; }
    add(value: ITransition) { this.transitions.add(value); return this; }

    boot() {
        super.boot();
    }

    /**
     * Runs a transition
     *
     * @param {{ name: string, oldPage: Page, newPage: Page, trigger: Trigger }} data
     * @returns Promise<Transition>
     * @memberof TransitionManager
     */
    public async animate(name: string, data: any): Promise<ITransition> {
        let transition: ITransition = this.transitions.get(name);
        let scroll = data.scroll;
        if (!("wrapper" in data.oldPage) || !("wrapper" in data.newPage))
            throw `[Page] either oldPage or newPage aren't instances of the Page Class.\n ${{
                newPage: data.newPage,
                oldPage: data.oldPage,
            }}`;

        let fromWrapper = data.oldPage.wrapper;
        let toWrapper = data.newPage.wrapper;
        document.title = `` + data.newPage.title;

        if (!(fromWrapper instanceof Node) || !(toWrapper instanceof Node))
            throw `[Wrapper] the wrapper from the ${!(toWrapper instanceof Node) ? "next" : "current"
            } page cannot be found. The wrapper must be an element that has the attribute ${getConfig(this.config,
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
