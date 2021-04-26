import { Manager } from "./manager";
import { ICoords, newCoords, Trigger } from "./history";
import { IPage } from "./page";
import { getConfig } from "./config";
import { Service } from "./service";
import { newURL } from "./url";

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
    has(key: string): boolean,

    boot(): any,
    animate(name: string, data: any): Promise<ITransition>,
}

/** Auto scrolls to an elements position if the element has an hash */
export const hashAction = (coords?: ICoords, hash: string = window.location.hash) => {
    try {
        let _hash = hash[0] == "#" ? hash : newURL(hash).hash;
        if (_hash.length > 1) {
            let el = document.getElementById(_hash.slice(1));
            if (el) {
                let { left, top } = el.getBoundingClientRect();
                let scrollLeft = window.scrollX;
                let scrollTop = window.scrollY;
                let x = left + scrollLeft;
                let y = top + scrollTop;

                console.log(x, y);
                return newCoords(x, y);
            }
        }
    } catch (e) {
        console.warn("[hashAction] error", e);
    }

    return coords ?? newCoords(0, 0);
};

// The Default Transition
const Default: ITransition = {
    name: "default",
    scrollable: true,

    out({ done }: ITransitionData) {
        done();
    },
    in({ scroll, done }: ITransitionData) {
        window.scroll(scroll.x, scroll.y);
        done();
    }
};

/** Controls which Transition between pages to use */
export class TransitionManager extends Service implements ITransitionManager {
    transitions: Manager<string, ITransition>;
    private _arg: Array<[string, ITransition]>;
    constructor(transitions?: Array<[string, ITransition]>) {
        super();
        this._arg = transitions;
    }

    /** On Service install set Config */
    public install() {
        super.install();

        let transitions = this._arg && this._arg.length ? this._arg : (getConfig(this.config, "transitions") ?? []);

        // Manager like Maps use the most recent [key, value] Array it knows, replacing the default transition
        // With any other transitions called ["default", ...]
        transitions = [["default", Default]].concat(transitions);
        this.transitions = new Manager(transitions);
    }

    get(key: string) { return this.transitions.get(key); }
    set(key: string, value: ITransition) { this.transitions.set(key, value); return this; }
    add(value: ITransition) { this.transitions.add(value); return this; }
    has(key: string) { return this.transitions.has(key); }

    /** Starts a transition */
    public async animate(name: string, data: any): Promise<ITransition> {
        let transition: ITransition = this.transitions.get(name);
        let scroll = data.scroll;
        let ignoreHashAction = data.ignoreHashAction;
        if (!("wrapper" in data.oldPage) || !("wrapper" in data.newPage))
            throw `[Page] either oldPage or newPage aren't instances of the Page Class.\n ${{
                newPage: data.newPage,
                oldPage: data.oldPage,
            }}`;

        // Replace the title
        document.title = `` + data.newPage.title;

        let fromWrapper = data.oldPage.wrapper;
        let toWrapper = data.newPage.wrapper;

        if (!(fromWrapper instanceof Node) || !(toWrapper instanceof Node))
            throw `[Wrapper] the wrapper from the ${!(toWrapper instanceof Node) ? "next" : "current"
            } page cannot be found. The wrapper must be an element that has the attribute ${getConfig(this.config,
                "wrapperAttr"
            )}.`;

        // Give the Transition all the background data it may require
        transition.init && transition?.init(data);

        this.emitter.emit("BEFORE_TRANSITION_OUT");

        // Start the out point of the Transition
        if (transition.out) {
            await new Promise((done) => {
                let outMethod: Promise<any> = transition.out.call(transition, {
                    ...data,
                    from: data.oldPage,
                    trigger: data.trigger,
                    done,
                });

                outMethod?.then(done);
            });
        }

        this.emitter.emit("AFTER_TRANSITION_OUT");

        // Add the new wrapper before the old one
        await new Promise<void>((done) => {
            fromWrapper.insertAdjacentElement("beforebegin", toWrapper);
            this.emitter.emit("CONTENT_INSERT");

            if (!ignoreHashAction && !/back|popstate|forward/.test(data.trigger as string)) {
                scroll = hashAction(scroll);
            }
            done();
        });

        // Replace the old wrapper with the new one
        await new Promise<void>((done) => {
            fromWrapper.remove();
            fromWrapper = undefined;
            toWrapper = undefined;
            this.emitter.emit("CONTENT_REPLACED");
            done();
        });

        this.emitter.emit("BEFORE_TRANSITION_IN");

        // Start the in point of the Transition (only the in method has access to the hashAction's scroll position)
        if (transition.in) {
            await new Promise(async (done) => {
                let inMethod: Promise<any> = transition.in.call(transition, {
                    ...data,
                    from: data.oldPage,
                    to: data.newPage,
                    trigger: data.trigger,
                    scroll,
                    done,
                });

                inMethod?.then(done);
            });
        }

        this.emitter.emit("AFTER_TRANSITION_IN");
        return transition;
    }
}
