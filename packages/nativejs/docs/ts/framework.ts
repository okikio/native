import { App, Service, LinkEvent, _URL, Page, Trigger, IState, Coords, StateEvent, State, Transition, ITransitionData } from "./api.js";
const app = new App();

export type IgnoreURLsList = Array<RegExp | string>;

// Based on Barba JS and StartingBlocks
export class PJAX extends Service {
    private ignoreURLs: IgnoreURLsList = [];
    private prefetchIgnore: boolean = false;
    private isTransitioning: boolean = false;
    private stopOnTransitioning: boolean = false;

    private transitionStart() {
        this.isTransitioning = true;
    }

    private transitionStop() {
        this.isTransitioning = false;
    }

    public boot() {
        let current = new State();
        this.HistoryManager.add(current);
        window.history && window.history.replaceState(current.toJSON(), '', current.getCleanURL());
    }

    public getHref(el: HTMLAnchorElement): string | null {
        if (el && el.tagName && el.tagName.toLowerCase() === 'a' && typeof el.href === 'string')
            return el.href;
        return null;
    }

    public getTransitionName (el: HTMLAnchorElement): string | null {
        if (!el) return null;
        let transitionAttr = el.getAttribute( this.getConfig("transitionAttr", false) );
        if (typeof transitionAttr === 'string')
            return transitionAttr;
        return null;
    }

    // Based on barbajs
    public preventLink (el: HTMLAnchorElement, event: LinkEvent | KeyboardEvent, href: string): boolean {
        let location = new _URL();
        let url = new _URL(href);
        let eventMutate =
            (event as KeyboardEvent).which > 1 ||
            (event as KeyboardEvent).metaKey ||
            (event as KeyboardEvent).ctrlKey ||
            (event as KeyboardEvent).shiftKey ||
            (event as KeyboardEvent).altKey;
        let newTab = el.hasAttribute('target') && (el as HTMLAnchorElement).target === '_blank';
        let crossOrigin =
            ((el as HTMLAnchorElement).protocol !== location.protocol) ||
            ((el as HTMLAnchorElement).hostname !== location.hostname);
        let download = typeof el.getAttribute('download') === 'string';
        let preventSelf = el.hasAttribute(this.getConfig("preventSelfAttr", false));
        let preventAll = Boolean(
            el.closest( this.getConfig("preventAllAttr") )
        );
        let prevent = preventSelf && preventAll;
        let sameURL = location.compare(url);
        return eventMutate && newTab && crossOrigin && download && prevent && sameURL;
    }

    public ignoredURL ({ pathname }: _URL): boolean {
        return this.ignoreURLs.length && this.ignoreURLs.some(url => {
            return typeof url === "string" ? url == pathname : (url as RegExp).exec(pathname) !== null;
        });
    }

    public getLink (event: LinkEvent): HTMLAnchorElement {
        let el = event.target as HTMLAnchorElement;
        let href: string = this.getHref(el);

        while (el && !href) {
            el = (el as HTMLElement).parentNode as HTMLAnchorElement;
            href = this.getHref(el);
        }

        // Check prevent
        if (!el || this.preventLink(el, event, href)) return;
        return el;
    }

    public async onHover (event: LinkEvent): Promise<void> {
        let el = this.getLink(event);
        if (!el) return;

        const url = new _URL(this.getHref(el));
        // If Url is ignored or already in cache, don't do any think
        if (this.ignoredURL(url) || this.PageManager.has(url.clean())) return;

        this.EventEmitter.emit("Anchor:Hover Hover", event);
        try {
            let page = await this.PageManager.load(url);
            console.log("Prefetch: ", page.getURL().clean());
        } catch (err) {
            console.warn(err);
        }
    }

    public async load(oldHref: string, href: string, trigger: Trigger, transition: string = "default"): Promise<any> {
        let oldPage = this.PageManager.get(oldHref);
        this.EventEmitter.emit("Page:Loading");
        let newPage: Page;

        try {
            newPage = await this.PageManager.load(href);
            this.transitionStart();
            this.EventEmitter.emit("Page:Loaded");
        } catch (err) {
            this.EventEmitter.emit("Page:Loading--Failed");
            console.error(err);
            this.force(href);
        }

        try {
            if (!this.TransitionManager.has(transition)) throw `PJAX: Transition with name '${transition}' doesn't exist, using 'default'.`;
        } catch (err) {
            transition = "default";
            console.warn(err);
        }

        try {
            this.EventEmitter.emit("Transition:Start");
            await this.TransitionManager.boot({
                name: transition,
                oldPage,
                newPage,
                trigger
            });
            this.EventEmitter.emit("Transition:End");
            this.transitionStop();
        } catch (err) {
            console.error(err);
            this.force(href);
        }
    }

    public force(url: string): void {
        window.location.assign(url);
    }

    public getDirection(value: number): Trigger {
        if (Math.abs(value) > 1) {
            // Ex 6-0 > 0 -> forward, 0-6 < 0 -> back
            return value > 0 ? 'forward' : 'back';
        } else {
            if (value === 0) {
                return 'popstate';
            } else {
                // Ex 6-5 > 0 -> back, 5-6 < 0 -> forward
                return value > 0 ? 'back' : 'forward';
            }
        }
    }

    public go(
        href: string,
        trigger: Trigger = 'HistoryManager',
        event?: StateEvent
    ): Promise<void> {
        // If animation running, force reload
        if (this.isTransitioning) {
            this.force(href);
            return;
        }

        let url = new _URL(href);
        let current = this.HistoryManager.last();
        let currentURL = current.getURL();
        if (currentURL.compare(url)) return;

        let transitionName: string;
        if (event && (event as PopStateEvent).state) {
            this.EventEmitter.emit("Popstate", event);

            // If popstate, get back/forward direction.
            let { state }: { state: IState } = event as PopStateEvent;
            let { index, transition, data } = state;
            let currentIndex = current.getIndex();
            let diff = currentIndex - index;

            trigger = this.getDirection(diff);
            transitionName = transition;

            if (trigger !== "popstate") {
                let { x, y } = data.scroll;
                window.scrollTo(x, y);
            }

            if (trigger === "back") {
                this.HistoryManager.remove(currentIndex);
                this.EventEmitter.emit(`Popstate:Back`, event);
            } else if (trigger === "forward") {
                this.HistoryManager.addState({ url, transition, data })
                this.EventEmitter.emit(`Popstate:Forward`, event);
            }
        } else {
            // Add new state
            transitionName = this.getTransitionName(trigger as HTMLAnchorElement);
            const index = this.HistoryManager.size();
            const state = new State({
                url, index,
                transition: transitionName,
                data: {
                    scroll: new Coords()
                }
            });

            this.HistoryManager.add(state);
            window.history && window.history.pushState(state.toJSON(), '', url.clean());
            this.EventEmitter.emit("History:NewState", event);
        }

        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        return this.load(currentURL.clean(), href, trigger, transitionName);
    }

    public onClick (event: LinkEvent) {
        let el = this.getLink(event);
        if (!el) return;

        if (this.isTransitioning && this.stopOnTransitioning) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        this.EventEmitter.emit("Anchor:Click Click", event);
        this.go(this.getHref(el), el, event);
    }

    public onStateChange(event: PopStateEvent): void {
        let { state } = event;
        this.go(state.url, 'popstate', event);
    }

    public initEvents() {
        if (this.prefetchIgnore !== true) {
            document.addEventListener('mouseover', this.onHover.bind(this));
            document.addEventListener('touchstart', this.onHover.bind(this));
        }

        document.addEventListener('click', this.onClick.bind(this));
        window.addEventListener('popstate', this.onStateChange.bind(this));
    }
}

export class Default extends Transition {
    protected name = "default";
    in({ done }: ITransitionData) {
        done();
    }
}

app.add("service", new PJAX());
app.add("transition", new Default());

(async () => {
    try {
        await app.boot();
    } catch (err) {
        console.warn("App boot failed", err);
    }

    app.on("Page:Loading", () => {
        console.log("Page is loading");
    });

    app.on("Popstate:Back", () => {
        console.log("Popstate Back");
    });
    // try {
    //     let page: Page = await app.load("page", "./other.html");
    //     console.log(page.getURL().clean());

    //     page = await app.load("page", "./about.html");
    //     console.log(page.getURL().clean());
    // } catch (err) {
    //     console.warn("Page loading failed");
    // }
})();