import { newState, Trigger, IState, newCoords, IHistoryItem } from "./history";
import { Service } from "./service";
import { Page } from "./page";
import { newURL, getHashedPath, equal } from "./url";

export type LinkEvent = MouseEvent | TouchEvent;
export type StateEvent = LinkEvent | PopStateEvent;
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
     * URLs to ignore when prefetching
     *
     * @private
     * @type boolean
     * @memberof PJAX
     */
    protected ignoreURLs: IgnoreURLsList = [];

    /**
     * Whether or not to disable prefetching
     *
     * @private
     *
     * @memberof PJAX
     */
    protected prefetchIgnore: boolean = false;

    /**
     * Current state or transitions
     *
     * @public
     * @type boolean
     * @memberof PJAX
     */
    public isTransitioning: boolean = false;

    /**
     * Ignore extra clicks of an anchor element if a transition has already started
     *
     * @private
     * @type boolean
     * @memberof PJAX
     */
    protected stopOnTransitioning: boolean = false;

    /**
     * On page change (excluding popstate event) keep current scroll position
     *
     * @private
     * @type boolean
     * @memberof PJAX
     */
    protected stickyScroll: boolean = false;

    /**
     * Force load a page if an error occurs
     *
     * @private
     * @type boolean
     * @memberof PJAX
     */
    protected forceOnError: boolean = false;

    /**
     * Dictates whether to auto scroll if an hash is present in the window URL
     *
     * @protected
     * @type boolean
     * @memberof PJAX
     */
    protected autoScrollOnHash: boolean = true;

    /**
     * Disables all extra scroll effects of PJAX, however, it won't affect scroll on hash,
     * since scrolling when an hash is in the URL is the default behavior
     *
     * @private
     * @type boolean
     * @memberof PJAX
     */
    protected dontScroll: boolean = true;

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

    public init() {
        super.init();

        /**
         * Bind the event listeners to the PJAX class
         *
         * @memberof PJAX
         */
        this.onHover = this.onHover.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
    }

    /**
     * Starts the PJAX Service
     *
     * @memberof PJAX
     */
    public boot() {
        if ("scrollRestoration" in window.history) {
            // Back off, browser, I got this...
            window.history.scrollRestoration = "manual";
        }

        super.boot();
    }

    /**
     * Gets the transition to use for a certain anchor
     *
     * @param {HTMLAnchorElement} el
     * @returns {(string | null)}
     * @memberof PJAX
     */
    public getTransitionName(el: HTMLAnchorElement): string | null {
        if (!el || !el.getAttribute) return null;
        let transitionAttr = el.getAttribute(
            this.config.getConfig("transitionAttr", false)
        );
        if (typeof transitionAttr === "string") return transitionAttr;
        return null;
    }

    /**
     * Checks to see if the anchor is valid
     *
     * @param {HTMLAnchorElement} el
     * @param {(LinkEvent | KeyboardEvent)} event
     * @param {string} href
     *
     * @memberof PJAX
     */
    public validLink(
        el: HTMLAnchorElement,
        event: LinkEvent | KeyboardEvent,
        href: string
    ): boolean {
        let pushStateSupport = !window.history.pushState;
        let exists = !el || !href;
        let eventMutate =
            (event as KeyboardEvent).metaKey ||
            (event as KeyboardEvent).ctrlKey ||
            (event as KeyboardEvent).shiftKey ||
            (event as KeyboardEvent).altKey;
        let newTab =
            el.hasAttribute("target") &&
            (el as HTMLAnchorElement).target === "_blank";
        let crossOrigin =
            (el as HTMLAnchorElement).protocol !== location.protocol ||
            (el as HTMLAnchorElement).hostname !== location.hostname;
        let download = typeof el.getAttribute("download") === "string";
        let preventSelf = el.hasAttribute(this.config.getConfig("preventSelfAttr", false));
        let preventAll = Boolean(
            el.closest(this.config.getConfig("preventAllAttr"))
        );
        let prevent = preventSelf && preventAll;
        let sameURL = getHashedPath(newURL()) === getHashedPath(newURL(href));
        return !(
            exists ||
            pushStateSupport ||
            eventMutate ||
            newTab ||
            crossOrigin ||
            download ||
            prevent ||
            sameURL
        );
    }

    /**
     * Returns the href or an Anchor element
     *
     * @param {HTMLAnchorElement} el
     * @returns {(string | null)}
     * @memberof PJAX
     */
    public getHref(el: HTMLAnchorElement): string | null {
        if (
            el &&
            el.tagName &&
            el.tagName.toLowerCase() === "a" &&
            typeof el.href === "string"
        )
            return el.href;
        return null;
    }

    /**
     * Check if event target is a valid anchor with an href, if so, return the link
     *
     * @param {LinkEvent} event
     *
     * @memberof PJAX
     */
    public getLink(event: LinkEvent): HTMLAnchorElement {
        let el = event.target as HTMLAnchorElement;
        let href: string = this.getHref(el);

        while (el && !href) {
            el = (el as HTMLElement).parentNode as HTMLAnchorElement;
            href = this.getHref(el);
        }

        // Check for a valid link
        if (!el || !this.validLink(el, event, href)) return;
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
    public onClick(event: LinkEvent) {
        let el = this.getLink(event);
        if (!el) return;

        if (this.isTransitioning && this.stopOnTransitioning) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        let href = this.getHref(el);
        this.emitter.emit("ANCHOR_CLICK CLICK", event);
        this.go({ href, trigger: el, event });
    }

    /**
     * Returns the direction of the State change as a String, either the Back button or the Forward button
     *
     * @param {number} value
     *
     * @memberof PJAX
     */
    public getDirection(value: number): Trigger {
        if (Math.abs(value) > 1) {
            // Ex 6-0 > 0 -> forward, 0-6 < 0 -> back
            return value > 0 ? "forward" : "back";
        } else {
            if (value === 0) {
                return "popstate";
            } else {
                // Ex 6-5 > 0 -> back, 5-6 < 0 -> forward
                return value > 0 ? "back" : "forward";
            }
        }
    }

    /**
     * Force a page to go to a certain URL
     *
     * @param {string} href
     * @memberof PJAX
     */
    public force(href: string): void {
        window.location.assign(href);
    }

    /**
     * If transition is running force load page.
     * Stop if currentURL is the same as new url.
     * On state change, change the current state history,
     * to reflect the direction of said state change
     * Load page and page transition.
     *
     * @param {string} href
     * @param {Trigger} [trigger='HistoryManager']
     * @param {StateEvent} [event]
     * @memberof PJAX
     */
    public go({
        href,
        trigger = "HistoryManager",
        event,
    }: {
        href: string;
        trigger?: Trigger;
        event?: StateEvent;
    }): Promise<void> {
        // If transition is already running and the go method is called again, force load page
        if (this.isTransitioning && this.stopOnTransitioning) {
            this.force(href);
            return;
        }

        let scroll = { x: 0, y: 0 };
        let currentState = this.HistoryManager.current;
        let currentURL = currentState.url;
        if (equal(currentURL, href)) {
            return;
        }

        let transitionName: string;
        if (event && (event as PopStateEvent).state) {
            this.emitter.emit("POPSTATE", event);

            // If popstate, get back/forward direction.
            let { state }: { state: IHistoryItem } = event as PopStateEvent;
            let { index } = state;
            let currentIndex = currentState.index;
            let difference = currentIndex - index;

            trigger = this.getDirection(difference);

            // Based on the direction of the state change either remove or add a state
            this.HistoryManager.replace(state.states);
            this.HistoryManager.pointer = index;
            if (trigger === "back") {
                // this.HistoryManager.remove(currentIndex);
                this.emitter.emit(`POPSTATE_BACK`, event);
            } else if (trigger === "forward") {
                // this.HistoryManager.add({ url: href, transition, data });
                this.emitter.emit(`POPSTATE_FORWARD`, event);
            }

            let _state = this.HistoryManager.get(index);
            transitionName = _state.transition;

            // If the page remains on the same history state DO NOT scroll, it's pointless
            if (trigger !== "popstate") {
                // Keep scroll position
                scroll = _state.data.scroll;
            }
        } else {
            // Add new state
            transitionName = this.getTransitionName(trigger as HTMLAnchorElement) ||
                "default";
            let scrollCoords = newCoords();

            if (!this.dontScroll && this.stickyScroll) {
                // Keep scroll position
                let { x, y } = scrollCoords;
                scroll = { x, y };
            } else {
                scroll = {
                    x: 0,
                    y: 0
                };
            }

            let state = newState({
                url: href,
                transition: transitionName,
                data: { scroll: scrollCoords },
            });

            this.HistoryManager.add(state);
            this.emitter.emit("HISTORY_NEW_ITEM", event);
        }

        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        this.emitter.emit("GO", event);
        return this.load({
            oldHref: currentURL,
            href,
            trigger,
            transitionName,
            scroll,
        });
    }

    /**
     * Load the new Page as well as a Transition; run the Transition
     *
     * @param {string} oldHref
     * @param {string} href
     * @param {Trigger} trigger
     * @param {string} [transitionName="default"]
     *
     * @memberof PJAX
     */
    public async load({
        oldHref,
        href,
        trigger,
        transitionName = "default",
        scroll = { x: 0, y: 0 },
    }: {
        oldHref: string;
        href: string;
        trigger: Trigger;
        transitionName?: string;
        scroll: { x: number; y: number };
    }): Promise<any> {
        try {
            let oldPage = await this.PageManager.load(oldHref);
            await oldPage.build();
            let newPage: Page;

            this.emitter.emit("PAGE_LOADING", { href, oldPage, trigger });
            try {
                try {
                    newPage = await this.PageManager.load(href);
                    await newPage.build();
                    this.transitionStart();
                    this.emitter.emit("PAGE_LOAD_COMPLETE", {
                        newPage,
                        oldPage,
                        trigger,
                    });
                } catch (err) {
                    console.error(`[PJAX] page load error: ${err}`);
                }

                // --
                // --

                this.emitter.emit("NAVIGATION_START", {
                    oldPage,
                    newPage,
                    trigger,
                    transitionName,
                });

                try {
                    this.emitter.emit("TRANSITION_START", transitionName);
                    let transition = await this.TransitionManager.boot(transitionName, {
                        oldPage,
                        newPage,
                        trigger,
                        scroll,
                    });

                    if (!transition.scrollable) {
                        if (!/back|popstate|forward/.test(trigger as string)) scroll = hashAction(href);
                        window.scroll(scroll.x, scroll.y);
                    }

                    this.emitter.emit("TRANSITION_END", { transition });

                } catch (err) {
                    console.error(`[PJAX] transition error: ${err}`);
                }

                this.emitter.emit("NAVIGATION_END", {
                    oldPage,
                    newPage,
                    trigger,
                    transitionName,
                });
            } catch (err) {
                this.transitionStop();
                throw err;
            }

            this.transitionStop(); // Sets isTransitioning to false
        } catch (err) {
            if (this.forceOnError) this.force(href);
            else console.error(err);
        }
    }

    /**
     * Check to see if the URL is to be ignored, uses either RegExp of Strings to check
     *
     * @param {URL} { pathname }
     *
     * @memberof PJAX
     */
    public ignoredURL({ pathname }: URL): boolean {
        return (
            this.ignoreURLs.length &&
            this.ignoreURLs.some((url) => {
                return typeof url === "string"
                    ? url === pathname
                    : (url as RegExp).exec(pathname) !== null;
            })
        );
    }

    /**
     * When you hover over an anchor, prefetch the event target's href
     *
     * @param {LinkEvent} event
     * @memberof PJAX
     */
    public onHover(event: LinkEvent): Promise<void> {
        let el = this.getLink(event);
        if (!el) return;

        let url = newURL(this.getHref(el));
        let urlString: string = url.pathname;
        // If Url is ignored or already in cache, don't do any think
        if (this.ignoredURL(url) || this.PageManager.has(urlString)) return;
        this.emitter.emit("ANCHOR_HOVER HOVER", event);

        try {
            this.PageManager.load(url);
        } catch (err) {
            console.warn("[PJAX] prefetch error,", err);
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
        this.go({ href: window.location.href, trigger: "popstate", event });
    }

    /**
     * Initialize DOM Events
     *
     * @memberof PJAX
     */
    public initEvents() {
        if (this.prefetchIgnore !== true) {
            document.addEventListener("mouseover", this.onHover);
            document.addEventListener("touchstart", this.onHover);
        }

        document.addEventListener("click", this.onClick);
        window.addEventListener("popstate", this.onStateChange);
    }

    /**
     * Stop DOM Events
     *
     * @memberof PJAX
     */
    public stopEvents() {
        if (this.prefetchIgnore !== true) {
            document.removeEventListener("mouseover", this.onHover);
            document.removeEventListener("touchstart", this.onHover);
        }

        document.removeEventListener("click", this.onClick);
        window.removeEventListener("popstate", this.onStateChange);
    }
}


/**
 * Auto scrolls to an elements position if the element has an hash
 *
 * @param {string} [hash=window.location.hash]
 * @memberof PJAX
 */
export const hashAction = (hash: string = window.location.hash) => {
    try {
        let _hash = hash[0] == "#" ? hash : newURL(hash).hash;
        if (_hash.length > 1) {
            let el = document.querySelector(_hash) as HTMLElement;

            if (el) {
                return { x: el.offsetLeft, y: el.offsetTop };
            }
        }
    } catch (e) {
        console.warn("hashAction error", e);
    }

    return { x: 0, y: 0 };
};
