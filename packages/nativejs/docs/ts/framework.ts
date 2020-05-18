import { App, Service, LinkEvent, _URL, Page, Trigger, IState, Coords, StateEvent, State, Transition, ITransitionData } from "./api.js";
const app = new App();

export type IgnoreURLsList = Array<RegExp | string>;

/**
 * Creates a Barba JS like PJAX Service, for the Framework
 *
 * @export
 * @class PJAX
 * @extends {Service}
 */
// Based on Barba JS and StartingBlocks
export class PJAX extends Service {
    /**
     * URL's to ignore when prefetching
     *
     * @private
     * @type {IgnoreURLsList}
     * @memberof PJAX
     */
    private ignoreURLs: IgnoreURLsList = [];

    /**
     * Whether or not to disable prefetching
     *
     * @private
     * @type {boolean}
     * @memberof PJAX
     */
    private prefetchIgnore: boolean = false;

    /**
     * Current state or transitions
     *
     * @private
     * @type {boolean}
     * @memberof PJAX
     */
    private isTransitioning: boolean = false;

    /**
     * Ignore extra clicks of an anchor element if a transition has already started
     *
     * @private
     * @type {boolean}
     * @memberof PJAX
     */
    private stopOnTransitioning: boolean = false;
    stickyScroll: boolean;

    /**
     * Sets the transition state, sets isTransitioning to true
     *
     * @private
     * @memberof PJAX
     */
    private transitionStart() {
        this.isTransitioning = true;
    }

    /**
     * Sets the transition state, sets isTransitioning to false
     *
     * @private
     * @memberof PJAX
     */
    private transitionStop() {
        this.isTransitioning = false;
    }

    /**
     * Starts the PJAX Service
     *
     * @memberof PJAX
     */
    public boot() {
        let current = new State();
        this.HistoryManager.add(current);
        window.history && window.history.replaceState(current.toJSON(), '', current.getCleanURL());
    }

    /**
     * Returns the href or an Anchor element
     *
     * @param {HTMLAnchorElement} el
     * @returns {(string | null)}
     * @memberof PJAX
     */
    public getHref(el: HTMLAnchorElement): string | null {
        if (el && el.tagName && el.tagName.toLowerCase() === 'a' && typeof el.href === 'string')
            return el.href;
        return null;
    }

    /**
     * Gets the transition to use for a certain anchor
     *
     * @param {HTMLAnchorElement} el
     * @returns {(string | null)}
     * @memberof PJAX
     */
    public getTransitionName (el: HTMLAnchorElement): string | null {
        if (!el) return null;
        let transitionAttr = el.getAttribute( this.getConfig("transitionAttr", false) );
        if (typeof transitionAttr === 'string')
            return transitionAttr;
        return null;
    }

    /**
     * Checks to see if the anchor is valid
     *
     * @param {HTMLAnchorElement} el
     * @param {(LinkEvent | KeyboardEvent)} event
     * @param {string} href
     * @returns {boolean}
     * @memberof PJAX
     */
    public validLink (el: HTMLAnchorElement, event: LinkEvent | KeyboardEvent, href: string): boolean {
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

    public getLink (event: LinkEvent): HTMLAnchorElement {
        let el = event.target as HTMLAnchorElement;
        let href: string = this.getHref(el);

        while (el && !href) {
            el = (el as HTMLElement).parentNode as HTMLAnchorElement;
            href = this.getHref(el);
        }

        // Check for a valid link
        if (!el || this.validLink(el, event, href)) return;
        return el;
    }

    /**
     * When an element is clicked.
     *
     * Get valid anchor element.
     * Go for a transition.
     *
     * @param {LinkEvent} event
     * @returns
     * @memberof PJAX
     */
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

    /**
     * Returns the direction of the State change as a String, either the Back button or the Forward button
     *
     * @param {number} value
     * @returns {Trigger}
     * @memberof PJAX
     */
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

    /**
     * Force a page to go to a certain URL
     *
     * @param {string} url
     * @memberof PJAX
     */
    public force(url: string): void {
        window.location.assign(url);
    }

    /**
     *
     *
     * @param {string} href
     * @param {Trigger} [trigger='HistoryManager']
     * @param {StateEvent} [event]
     * @returns {Promise<void>}
     * @memberof PJAX
     */
    public go(
        href: string,
        trigger: Trigger = 'HistoryManager',
        event?: StateEvent
    ): Promise<void> {
        // If transition running, force reload
        if (this.isTransitioning) {
            this.force(href);
            return;
        }

        let url = new _URL(href);
        let currentState = this.HistoryManager.last();
        let currentURL = currentState.getURL();
        if (currentURL.compare(url)) return;

        let transitionName: string;
        if (event && (event as PopStateEvent).state) {
            this.EventEmitter.emit("Popstate", event);

            // If popstate, get back/forward direction.
            let { state }: { state: IState } = event as PopStateEvent;
            let { index, transition, data } = state;
            let currentIndex = currentState.getIndex();
            let difference = currentIndex - index;

            trigger = this.getDirection(difference);
            transitionName = transition;

            // If page remains the same on state change DO NOT run this, it's pointless
            if (trigger !== "popstate" && this.stickyScroll) {
                // Keep scroll position
                let { x, y } = data.scroll;
                window.scrollTo(x, y);
            } else window.scrollTo(0, 0);

            // Based on the direction of the state change either remove or add a state
            if (trigger === "back") {
                this.HistoryManager.remove(currentIndex);
                this.EventEmitter.emit(`Popstate:Back`, event);
            } else if (trigger === "forward") {
                this.HistoryManager.addState({ url, transition, data });
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

    /**
     * Load the new Page as well as a Transition; run the Transition
     *
     * @param {string} oldHref
     * @param {string} href
     * @param {Trigger} trigger
     * @param {string} [transitionName="default"]
     * @returns {Promise<any>}
     * @memberof PJAX
     */
    public async load(oldHref: string, href: string, trigger: Trigger, transitionName: string = "default"): Promise<any> {
        let oldPage = this.PageManager.get(oldHref);
        this.EventEmitter.emit("Page:Loading", oldPage, trigger);
        let newPage: Page;

        try {
            newPage = await this.PageManager.load(href);
            this.transitionStart(); // Sets isTransitioning to true
            this.EventEmitter.emit("Page:Loaded", newPage, trigger);
        } catch (err) {
            this.EventEmitter.emit("Page:Loading--Failed", trigger);
            console.error(err);
            this.force(href);
        }

        try {
            if (!this.TransitionManager.has(transitionName)) throw `PJAX: Transition with name '${transitionName}' doesn't exist, using 'default'.`;
        } catch (err) {
            transitionName = "default";
            console.warn(err);
        }

        try {
            this.EventEmitter.emit("Transition:Start", transitionName);
            let transition = await this.TransitionManager.boot({
                name: transitionName,
                oldPage,
                newPage,
                trigger
            });
            this.EventEmitter.emit("Transition:End", transition);
            this.transitionStop(); // Sets isTransitioning to false
        } catch (err) {
            console.error(err);
            this.force(href);
        }
    }

    /**
     * Check to see if the URL is to be ignored, uses either RegExp of Strings to check
     *
     * @param {_URL} { pathname }
     * @returns {boolean}
     * @memberof PJAX
     */
    public ignoredURL ({ pathname }: _URL): boolean {
        return this.ignoreURLs.length && this.ignoreURLs.some(url => {
            return typeof url === "string" ? url === pathname : (url as RegExp).exec(pathname) !== null;
        });
    }

    /**
     * When you hover over an anchor
     *
     * @param {LinkEvent} event
     * @returns {Promise<void>}
     * @memberof PJAX
     */
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

    /**
     * When History state changes.
     *
     * Get url from State
     * Go for a Barba transition.
     *
     * @param {PopStateEvent} event
     * @memberof PJAX
     */
    public onStateChange(event: PopStateEvent): void {
        let { state } = event;
        this.go(state.url, 'popstate', event);
    }

    /**
     * Bind the event listeners to the PJAX class
     *
     * @memberof PJAX
     */
    public bindEvents() {
        this.onHover = this.onHover.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
    }

    /**
     * Initialize DOM Events
     *
     * @memberof PJAX
     */
    public initEvents() {
        this.bindEvents();

        if (this.prefetchIgnore !== true) {
            document.addEventListener('mouseover', this.onHover);
            document.addEventListener('touchstart', this.onHover);
        }

        document.addEventListener('click', this.onClick);
        window.addEventListener('popstate', this.onStateChange);
    }

    /**
     * Stop DOM Events
     *
     * @memberof PJAX
     */
    public stopEvents() {
        if (this.prefetchIgnore !== true) {
            document.removeEventListener('mouseover', this.onHover);
            document.removeEventListener('touchstart', this.onHover);
        }

        document.removeEventListener('click', this.onClick);
        window.removeEventListener('popstate', this.onStateChange);
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

    app.on("Page:Loaded", (newPage: Page) => {
        let navLink = document.querySelectorAll(".nav-link");
        for (let item of navLink) {
            let url = new _URL((item as HTMLAnchorElement).href);
            if (url.compare(newPage.getURL())) {
                item.className = "nav-link active";
            } else {
                item.className = "nav-link";
            }
        }
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