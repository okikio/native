import { newState, Trigger, IState, newCoords } from "./history";
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
    public ignoreURLs: IgnoreURLsList = [];

    /**
     * Whether or not to disable prefetching
     *
     * @private
     *
     * @memberof PJAX
     */
    public prefetchIgnore: boolean = false;

    /**
     * Current state or transitions
     *
     * @private
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
    public stopOnTransitioning: boolean = false;

    /**
     * On page change (excluding popstate event) keep current scroll position
     *
     * @private
     * @type boolean
     * @memberof PJAX
     */
    public stickyScroll: boolean = true;

    /**
     * Force load a page if an error occurs
     *
     * @private
     * @type boolean
     * @memberof PJAX
     */
    public forceOnError: boolean = false;

    /**
     * Dictates whether to auto scroll if an hash is present in the window URL
     *
     * @public
     * @type boolean
     * @memberof PJAX
     */
    public autoScrollOnHash: boolean = true;

    /**
     * Disables all extra scroll effects of PJAX, however, it won't affect scroll on hash,
     * since scrolling when an hash is in the URL is the default behavior
     *
     * @private
     * @type boolean
     * @memberof PJAX
     */
    public dontScroll: boolean = true;

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
        let current = newState();
        this.HistoryManager.add(current);
        this.changeState("replace");

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
        let transitionAttr = el.getAttribute(this.getConfig("transitionAttr", false));
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
     *
     * @memberof PJAX
     */
    public validLink(el: HTMLAnchorElement, event: LinkEvent | KeyboardEvent, href: string): boolean {
        let pushStateSupport = !window.history.pushState;
        let exists = !el || !href;
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
            el.closest(this.getConfig("preventAllAttr"))
        );
        let prevent = preventSelf && preventAll;
        let sameURL = getHashedPath(newURL()) === getHashedPath(newURL(href));
        return !(exists || pushStateSupport || eventMutate || newTab || crossOrigin || download || prevent || sameURL);
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
        this.EventEmitter.emit("ANCHOR_CLICK CLICK", event);
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
    public go({ href, trigger = 'HistoryManager', event }: { href: string; trigger?: Trigger; event?: StateEvent; }): Promise<void> {
        // If transition is already running and the go method is called again, force load page
        if (this.isTransitioning && this.stopOnTransitioning) {
            this.force(href);
            return;
        }

        let url = newURL(href);
        let currentState = this.HistoryManager.current;
        let currentURL = currentState.url;
        if (equal(currentURL, url)) {
            this.hashAction(url.hash);
            return;
        }

        let transitionName: string;
        if (event && (event as PopStateEvent).state) {
            this.EventEmitter.emit("POPSTATE", event);

            // If popstate, get back/forward direction.
            let { state }: { state: IState } = event as PopStateEvent;
            let { index, transition, data } = state;
            let currentIndex = currentState.index;
            let difference = currentIndex - index;

            trigger = this.getDirection(difference);
            transitionName = transition;

            // If page remains the same on state change DO NOT run this, it's pointless
            if (trigger !== "popstate") {
                // Keep scroll position
                let { x, y } = data.scroll;
                window.scroll({
                    top: y, left: x,
                    behavior: 'smooth'  // 👈
                });
            }

            // Based on the direction of the state change either remove or add a state
            if (trigger === "back") {
                this.HistoryManager.remove(currentIndex);
                this.EventEmitter.emit(`POPSTATE_BACK`, event);
            } else if (trigger === "forward") {
                this.HistoryManager.add({ url: href, transition, data });
                this.EventEmitter.emit(`POPSTATE_FORWARD`, event);
            }
        } else {
            // Add new state
            transitionName = this.getTransitionName(trigger as HTMLAnchorElement) || "default";
            const scroll = newCoords();
            const index = this.HistoryManager.length;
            const state = newState({
                url: href, index,
                transition: transitionName,
                data: { scroll }
            });

            if (!this.dontScroll && this.stickyScroll) {
                // Keep scroll position
                let { x, y } = scroll;
                window.scroll({
                    top: y, left: x,
                    behavior: 'smooth'  // 👈
                });
            } else {
                window.scroll({
                    top: 0, left: 0,
                    behavior: 'smooth'  // 👈
                });
            }

            this.HistoryManager.add(state);
            this.changeState("push");
            this.EventEmitter.emit("HISTORY_NEW_ITEM", event);
        }

        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        this.EventEmitter.emit("GO", event);
        return this.load({ oldHref: newURL(currentURL).pathname, href, trigger, transitionName });
    }

    /**
     * Either push or replace history state
     *
     * @param {("push" | "replace")} action
     * @param {IState[]} state
     * @param {_URL} url
     * @memberof PJAX
     */
    public changeState(action: "push" | "replace") {
        let { states } = this.HistoryManager;
        let { url } = this.HistoryManager.current;
        let args = [{ states: [...states] }, '', url];
        if (window.history) {
            switch (action) {
                case 'push':
                    window.history.pushState.apply(window.history, args);
                    break;
                case 'replace':
                    window.history.replaceState.apply(window.history, args);
                    break;
            }
        }
    }

    /**
     * Load the new Page as well as a Transition; run the Transition
     *
     * @param {string} oldHref
     * @param {string} href
     * @param {Trigger} trigger
     * @param {string} [transitionName="default"]
     * @memberof PJAX
     */
    public async load({ oldHref, href, trigger, transitionName = "default" }: { oldHref: string; href: string; trigger: Trigger; transitionName?: string; }): Promise<any> {
        try {
            let oldPage = this.PageManager.get(oldHref);
            let newPage: Page;

            this.EventEmitter.emit("PAGE_LOADING", { href, oldPage, trigger });
            try {
                try {
                    newPage = await this.PageManager.load(href);
                    this.transitionStart();
                    this.EventEmitter.emit("PAGE_LOAD_COMPLETE", { newPage, oldPage, trigger });
                } catch (err) {
                    throw `[PJAX] page load error: ${err}`;
                }

                // --
                // --

                this.EventEmitter.emit("NAVIGATION_START", { oldPage, newPage, trigger, transitionName });
                try {
                    this.EventEmitter.emit("TRANSITION_START", transitionName);

                    let transition = await this.TransitionManager.boot({
                        name: transitionName,
                        oldPage,
                        newPage,
                        trigger
                    });

                    this.EventEmitter.emit("TRANSITION_END", { transition });
                } catch (err) {
                    throw `[PJAX] transition error: ${err}`;
                }

                this.EventEmitter.emit("NAVIGATION_END", { oldPage, newPage, trigger, transitionName });
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
     * Auto scrolls to an elements position if the element has an hash
     *
     * @param {string} [hash=window.location.hash]
     * @memberof PJAX
     */
    public hashAction(hash: string = window.location.hash) {
        if (this.autoScrollOnHash) {
            let hashID = hash.slice(1);

            if (hashID.length) {
                let el = document.getElementById(hashID);

                if (el) {
                    if (el.scrollIntoView) {
                        el.scrollIntoView();
                    } else {
                        let { left, top } = el.getBoundingClientRect();
                        window.scroll({ left, top });
                    }
                }
            }
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
        return this.ignoreURLs.length && this.ignoreURLs.some(url => {
            return typeof url === "string" ? url === pathname : (url as RegExp).exec(pathname) !== null;
        });
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

        const url = newURL(this.getHref(el));
        const urlString: string = url.pathname;
        // If Url is ignored or already in cache, don't do any think
        if (this.ignoredURL(url) || this.PageManager.has(urlString)) return;

        this.EventEmitter.emit("ANCHOR_HOVER HOVER", event);

        (async () => {
            try {
                await this.PageManager.load(url);
            } catch (err) {
                console.warn("[PJAX] prefetch error,", err);
            }
        })();
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
        this.go({ href: window.location.href, trigger: 'popstate', event });
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
        this.EventEmitter.on("CONTENT_REPLACED", this.hashAction, this);
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
