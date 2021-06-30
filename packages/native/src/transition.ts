import { Manager } from "./manager";
import { newCoords } from "./history";
import { toAttr } from "./config";
import { Service } from "./service";
import { newURL } from "./url";

import type { ICoords, TypeTrigger } from "./history";
import type { IPage } from "./page";

/**
 * The async function type, allows for smooth transition between Promises
 */
export type TypeAsyncFn = (value?: any) => void;
export interface ITransition {
    oldPage?: IPage;
    newPage?: IPage;
    trigger?: TypeTrigger;
    scroll?: { x: number; y: number };
    manualScroll?: boolean;
    init?: (data: IInitialTransitionData) => void;
    in?: (data: ITransitionData) => any;
    out?: (data: ITransitionData) => any;
    [key: string]: any;
}

export interface IInitialTransitionData {
    trigger?: TypeTrigger;
    scroll?: ICoords;
    oldPage: IPage;
    newPage: IPage;
    ignoreHashAction: boolean;
}

export interface ITransitionData extends IInitialTransitionData {
    from?: IPage;
    to?: IPage;
    done: TypeAsyncFn;
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

                return newCoords(x, y);
            }
        }
    } catch (e) {
        console.warn("[hashAction] error", e);
    }

    return coords ?? newCoords(0, 0);
};

/** The Default Transition, it replaces the container with the new page container */
export const TRANSITION_REPLACE: ITransition = { name: "replace" };

/** Controls which Transition between pages to use */
export class TransitionManager extends Service {
    public transitions: Manager<string, ITransition>;
    private _arg: Array<[string, ITransition]>;
    constructor(transitions?: Array<[string, ITransition]>) {
        super();
        this._arg = transitions;
    }

    /** On Service install set Config */
    public install() {
        super.install();

        let transitions = this._arg && this._arg.length ? this._arg : this.config.transitions;

        // Manager like Maps use the most recent [key, value] Array it knows, replacing the default transition
        // with any other transitions called ["default", ...]
        this.transitions = new Manager([
            ["default", TRANSITION_REPLACE],
            ["replace", TRANSITION_REPLACE],
        ].concat(transitions) as Array<[string, ITransition]>);
    }

    get(key: string) { return this.transitions.get(key); }
    set(key: string, value: ITransition) { this.transitions.set(key, value); return this; }
    add(value: ITransition) { this.transitions.add(value); return this; }
    has(key: string) { return this.transitions.has(key); }

    /** Starts a transition */
    public async start(name: string, data: IInitialTransitionData): Promise<IInitialTransitionData> {
        let transition: ITransition = this.transitions.get(name);
        let { oldPage, newPage, ignoreHashAction, trigger } = data;
        this.emitter.emit("TRANSITION_START", { transitionName: name, ...data });

        if (!("wrapper" in oldPage) || !("wrapper" in newPage))
            throw `[TransitionManager] either oldPage or newPage aren't instances of the Page Class.\n ${{ newPage, oldPage }}`;

        // Replace the title
        document.title = `` + newPage.title;

        let fromWrapper = oldPage.wrapper;
        let toWrapper = newPage.wrapper;
        if (!(fromWrapper instanceof Node) || !(toWrapper instanceof Node))
            throw `[TransitionManager] the wrapper from the ${!(toWrapper instanceof Node) ? "next" : "current"
            } page cannot be found. The wrapper must be an element that has the attribute ${toAttr(this.config, "wrapperAttr")}.`;

        // Give the Transition all the background data it may require
        transition.init && transition?.init(data);
        this.emitter.emit("BEFORE_TRANSITION_OUT", data);

        // Start the out point of the Transition
        if (transition.out) {
            await new Promise(done => {
                let outMethod: Promise<any> = transition.out.call(transition,
                    { ...data, from: oldPage, done, }
                );

                outMethod?.then(done);
            });
        }

        this.emitter.emit("AFTER_TRANSITION_OUT", data);

        // Add the new wrapper before the old one
        await new Promise<void>(done => {
            fromWrapper.insertAdjacentElement("beforebegin", toWrapper);
            this.emitter.emit("CONTENT_INSERT", data);
            done();
        });

        // Replace the old wrapper with the new one
        await new Promise<void>(done => {
            fromWrapper.remove();
            fromWrapper = null;
            toWrapper = null;

            this.emitter.emit("CONTENT_REPLACED", data);

            if (!ignoreHashAction && !/back|popstate|forward/.test(trigger as string))
                data.scroll = hashAction(data.scroll);
            done();
        });

        this.emitter.emit("BEFORE_TRANSITION_IN", data);

        // Start the `in` point of the Transition (only the `in` method has access to the hashAction's scroll position)
        if (transition.in) {
            await new Promise(done => {
                let inMethod: Promise<any> = transition.in.call(transition,
                    { ...data, from: oldPage, to: newPage, done }
                );

                inMethod?.then(done);
            });
        }

        this.emitter.emit("AFTER_TRANSITION_IN", data);

        // If the transition doesn't handle scroll itself, fallback on the transition manager handling it after the fact
        if (!transition.manualScroll) {
            if (!ignoreHashAction && !/back|popstate|forward/.test(trigger as string))
                data.scroll = hashAction(data.scroll);

            window.scroll(data.scroll.x, data.scroll.y);
        }

        this.emitter.emit("TRANSITION_END", { transitionName: name, ...data });
        return data;
    }
}

export interface ITransitionManager extends TransitionManager { }