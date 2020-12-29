import { newState, Trigger, newCoords, IHistoryItem, IHistoryManager } from "./history";
import { Service } from "./service";
import { IPage, IPageManager } from "./page";
import { newURL, getHashedPath, equal } from "./url";
import { getConfig } from "./config";
import { hashAction, ITransitionManager } from "./transition";

export type LinkEvent = MouseEvent | TouchEvent;
export type StateEvent = LinkEvent | PopStateEvent;
export type IgnoreURLsList = Array<RegExp | string>;
/**
 * Creates a barbajs like PJAX Service, for the native framework
 * Based on barbajs and StartingBlocks
 */
export class PJAX extends Service {
    /** URLs to ignore when prefetching */
    public ignoreURLs: IgnoreURLsList;

    /** Whether or not to disable prefetching */
    public prefetchIgnore: boolean;

    /** Current state of transitions */
    public isTransitioning: boolean;

    /** Ignore extra clicks of an anchor element if a transition has already started */
    public stopOnTransitioning: boolean;

    /** On page change (excluding popstate events) keep current scroll position */
    public stickyScroll: boolean;

    /** Force load a page if an error occurs */
    public forceOnError: boolean;

    /** Ignore hash action if set to true */
    public ignoreHashAction: boolean;

    public install() {
        super.install();

        this.ignoreURLs = getConfig(this.config, "ignoreURLs") ?? [];
        this.prefetchIgnore = getConfig(this.config, "prefetchIgnore") ?? false;
        this.stopOnTransitioning = getConfig(this.config, "stopOnTransitioning") ?? false;
        this.stickyScroll = getConfig(this.config, "stickyScroll") ?? false;
        this.forceOnError = getConfig(this.config, "forceOnError") ?? false;
        this.ignoreHashAction = getConfig(this.config, "ignoreHashAction") ?? false
    }

    /** Sets the transition state to either true or false */
    public transitionStart() {
        this.isTransitioning = true;
    }

    public transitionStop() {
        this.isTransitioning = false;
    }

    public init() {
        /**
         * Bind the event listeners to the PJAX class
         *
         * @memberof PJAX
         */
        this.onHover = this.onHover.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
    }

    /** Starts the PJAX Service */
    public boot() {
        if ("scrollRestoration" in window.history) {
            // Back off, browser, I got this...
            window.history.scrollRestoration = "manual";
        }

        super.boot();
    }

    /** Gets the transition to use for a certain anchor */
    public getTransitionName(el: HTMLAnchorElement): string | null {
        if (!el || !el.getAttribute) return null;
        let transitionAttr = el.getAttribute(
            getConfig(this.config, "transitionAttr", false)
        );

        if (typeof transitionAttr === "string") return transitionAttr;
        return null;
    }

    /** Checks to see if the anchor is valid */
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
        let preventSelf = el.hasAttribute(getConfig(this.config, "preventSelfAttr", false));
        let preventAll = Boolean(
            el.closest(getConfig(this.config, "preventAllAttr"))
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

    /** Returns the href of an Anchor element */
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

    /** Check if event target is a valid anchor with an href, if so, return the anchor */
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

    /** When an element is clicked, get valid anchor element, go for a transition */
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

    /** Returns the direction of the State change as a String, either the Back button or the Forward button */
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

    /** Force a page to go to a certain URL */
    public force(href: string): void {
        window.location.assign(href);
    }

    /**
     * If transition is running force load page.
     * Stop if currentURL is the same as new url.
     * On state change, change the current state history, to reflect the direction of said state change
     * Load page and page transition.
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
        if (this.isTransitioning && this.stopOnTransitioning ||
            !(this.manager.has("TransitionManager") &&
                this.manager.has("HistoryManager") &&
                this.manager.has("PageManager"))) {
            this.force(href);
            return;
        }

        const history = this.manager.get("HistoryManager") as IHistoryManager;
        let scroll = newCoords(0, 0);
        let currentState = history.current;
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

            let _state = history.get(history.pointer);
            transitionName = _state.transition;
            scroll = _state.data.scroll;

            history.replace(state.states);
            history.pointer = index;

            trigger = this.getDirection(difference);

            // Based on the direction of the state change either remove or add a state
            this.emitter.emit(trigger === "back" ? `POPSTATE_BACK` : `POPSTATE_FORWARD`, event);
        } else {
            // Add new state
            transitionName = this.getTransitionName(trigger as HTMLAnchorElement);

            scroll = newCoords();
            let state = newState({
                url: href,
                transition: transitionName,
                data: { scroll },
            });

            !this.stickyScroll && (scroll = newCoords(0, 0));

            history.add(state);
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

    /** Load the new Page as well as a Transition; starts the Transition */
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
            const pages = this.manager.get("PageManager") as IPageManager;
            let newPage: IPage, oldPage: IPage;

            this.emitter.emit("NAVIGATION_START", {
                oldHref,
                href,
                trigger,
                transitionName,
            });

            // Load & Build both the old and new pages
            try {
                this.transitionStart();
                oldPage = await pages.load(oldHref);
                !(oldPage.dom instanceof Element) && oldPage.build();

                this.emitter.emit("PAGE_LOADING", { href, oldPage, trigger });
                newPage = await pages.load(href);
                await newPage.build();
                this.emitter.emit("PAGE_LOAD_COMPLETE", {
                    newPage,
                    oldPage,
                    trigger,
                });
            } catch (err) {
                throw `[PJAX] page load error: ${err}`;
            }

            // --
            // --

            // Start Transition
            try {
                const TransitionManager = this.manager.get("TransitionManager") as ITransitionManager;
                this.emitter.emit("TRANSITION_START", transitionName);

                let transition = await TransitionManager.animate(TransitionManager.has(transitionName) ? transitionName : "default", {
                    oldPage,
                    newPage,
                    trigger,
                    scroll,
                    ignoreHashAction: this.ignoreHashAction
                });

                if (!transition.scrollable) {
                    if (!this.ignoreHashAction && !/back|popstate|forward/.test(trigger as string)) scroll = hashAction(scroll);
                    window.scroll(scroll.x, scroll.y);
                }

                this.emitter.emit("TRANSITION_END", { transition });
            } catch (err) {
                throw `[PJAX] transition error: ${err}`;
            }

            this.emitter.emit("NAVIGATION_END", {
                oldPage,
                newPage,
                trigger,
                transitionName,
            });
        } catch (err) {
            if (this.forceOnError) this.force(href);
            else console.warn(err);
        } finally {
            this.transitionStop(); // Sets isTransitioning to false
        }
    }

    /** Check to see if the URL is to be ignored, uses either RegExp of Strings to check */
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

    /** When you hover over an anchor, prefetch the event target's href */
    public onHover(event: LinkEvent): Promise<void> {
        let el = this.getLink(event);
        if (!el || !this.manager.has("PageManager")) return;

        const pages = this.manager.get("PageManager") as IPageManager;
        let url = newURL(this.getHref(el));
        let urlString: string = url.pathname;

        // If Url is ignored or already in cache, don't do any think
        if (this.ignoredURL(url) || pages.has(urlString)) return;
        this.emitter.emit("ANCHOR_HOVER HOVER", event);

        try {
            pages.load(url);
        } catch (err) {
            console.warn("[PJAX] prefetch error,", err);
        }
    }

    /** When History state changes, get url from State, go for a Transition. */
    public onStateChange(event: PopStateEvent): void {
        this.go({ href: window.location.href, trigger: "popstate", event });
    }

    /** Initialize DOM Events */
    public initEvents() {
        if (this.prefetchIgnore !== true) {
            document.addEventListener("mouseover", this.onHover);
            document.addEventListener("touchstart", this.onHover);
        }

        document.addEventListener("click", this.onClick);
        window.addEventListener("popstate", this.onStateChange);
    }

    /** Stop DOM Events */
    public stopEvents() {
        if (this.prefetchIgnore !== true) {
            document.removeEventListener("mouseover", this.onHover);
            document.removeEventListener("touchstart", this.onHover);
        }

        document.removeEventListener("click", this.onClick);
        window.removeEventListener("popstate", this.onStateChange);
    }
}
