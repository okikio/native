import { App, Service, _URL, Coords, State, Transition } from "./api.js";
const app = new App();
/**
 * Creates a Barba JS like PJAX Service, for the Framework
 *
 * @export
 * @class PJAX
 * @extends {Service}
 */
// Based on Barba JS and StartingBlocks
export class PJAX extends Service {
    constructor() {
        super(...arguments);
        /**
         * URL's to ignore when prefetching
         *
         * @private
         *
         * @memberof PJAX
         */
        this.ignoreURLs = [];
        /**
         * Whether or not to disable prefetching
         *
         * @private
         *
         * @memberof PJAX
         */
        this.prefetchIgnore = false;
        /**
         * Current state or transitions
         *
         * @private
         *
         * @memberof PJAX
         */
        this.isTransitioning = false;
        /**
         * Ignore extra clicks of an anchor element if a transition has already started
         *
         * @private
         *
         * @memberof PJAX
         */
        this.stopOnTransitioning = false;
        /**
         * On page change (excluding popstate event) keep current scroll position
         *
         * @private
         * @memberof PJAX
         */
        this.stickyScroll = true;
        /**
         * Force load a page if an error occurs
         *
         * @private
         * @type {boolean}
         * @memberof PJAX
         */
        this.forceOnError = false;
        /**
         * Dictates whether to auto scroll if an hash is present in the window URL
         *
         * @protected
         * @type {boolean}
         * @memberof PJAX
         */
        this.autoScrollOnHash = true;
    }
    /**
     * Sets the transition state, sets isTransitioning to true
     *
     * @private
     * @memberof PJAX
     */
    transitionStart() {
        this.isTransitioning = true;
    }
    /**
     * Sets the transition state, sets isTransitioning to false
     *
     * @private
     * @memberof PJAX
     */
    transitionStop() {
        this.isTransitioning = false;
    }
    /**
     * Starts the PJAX Service
     *
     * @memberof PJAX
     */
    boot() {
        let current = new State();
        this.HistoryManager.add(current);
        this.changeState("replace", current);
    }
    /**
     * Gets the transition to use for a certain anchor
     *
     * @param {HTMLAnchorElement} el
     * @returns {(string | null)}
     * @memberof PJAX
     */
    getTransitionName(el) {
        if (!el && !el.getAttribute)
            return null;
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
    validLink(el, event, href) {
        let pushStateSupport = !window.history.pushState;
        let exists = !el || !href;
        let eventMutate = event.which > 1 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey;
        let newTab = el.hasAttribute('target') && el.target === '_blank';
        let crossOrigin = (el.protocol !== location.protocol) ||
            (el.hostname !== location.hostname);
        let download = typeof el.getAttribute('download') === 'string';
        let preventSelf = el.hasAttribute(this.getConfig("preventSelfAttr", false));
        let preventAll = Boolean(el.closest(this.getConfig("preventAllAttr")));
        let prevent = preventSelf && preventAll;
        let sameURL = _URL.equal(window.location.href, href);
        return !(exists || pushStateSupport || eventMutate || newTab || crossOrigin || download || prevent || sameURL);
    }
    /**
     * Returns the href or an Anchor element
     *
     * @param {HTMLAnchorElement} el
     * @returns {(string | null)}
     * @memberof PJAX
     */
    getHref(el) {
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
    getLink(event) {
        let el = event.target;
        let href = this.getHref(el);
        while (el && !href) {
            el = el.parentNode;
            href = this.getHref(el);
        }
        // Check for a valid link
        if (!el || !this.validLink(el, event, href))
            return;
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
    onClick(event) {
        let el = this.getLink(event);
        if (!el)
            return;
        if (this.isTransitioning && this.stopOnTransitioning) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        let href = this.getHref(el);
        this.EventEmitter.emit("anchor--click click", event);
        this.go({ href, trigger: el, event });
    }
    /**
     * Returns the direction of the State change as a String, either the Back button or the Forward button
     *
     * @param {number} value
     *
     * @memberof PJAX
     */
    getDirection(value) {
        if (Math.abs(value) > 1) {
            // Ex 6-0 > 0 -> forward, 0-6 < 0 -> back
            return value > 0 ? 'forward' : 'back';
        }
        else {
            if (value === 0) {
                return 'popstate';
            }
            else {
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
    force(href) {
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
     * @param {AnchorEvent} [event]
     * @memberof PJAX
     */
    go({ href, trigger = 'HistoryManager', event }) {
        // If transition is already running and the go method is called again, force load page
        if (this.isTransitioning) {
            this.force(href);
            return;
        }
        let url = new _URL(href);
        let currentState = this.HistoryManager.last();
        let currentURL = currentState.getURL();
        if (currentURL.equalTo(url))
            return;
        let transitionName;
        if (event && event.state) {
            this.EventEmitter.emit("popstate", event);
            // If popstate, get back/forward direction.
            let { state } = event;
            let { index, transition, data } = state;
            let currentIndex = currentState.getIndex();
            let difference = currentIndex - index;
            trigger = this.getDirection(difference);
            transitionName = transition;
            // If page remains the same on state change DO NOT run this, it's pointless
            if (trigger !== "popstate") {
                // Keep scroll position
                let { x, y } = data.scroll;
                window.scroll({
                    top: y, left: x,
                    behavior: 'smooth' // 👈 
                });
            }
            // Based on the direction of the state change either remove or add a state
            if (trigger === "back") {
                this.HistoryManager.remove(currentIndex);
                this.EventEmitter.emit(`popstate--back`, event);
            }
            else if (trigger === "forward") {
                this.HistoryManager.addState({ url, transition, data });
                this.EventEmitter.emit(`popstate--forward`, event);
            }
        }
        else {
            // Add new state
            transitionName = this.getTransitionName(trigger) || "default";
            const scroll = new Coords();
            const index = this.HistoryManager.size();
            const state = new State({
                url, index,
                transition: transitionName,
                data: { scroll }
            });
            if (this.stickyScroll) {
                // Keep scroll position
                let { x, y } = scroll;
                window.scroll({
                    top: y, left: x,
                    behavior: 'smooth' // 👈 
                });
            }
            else {
                window.scroll({
                    top: 0, left: 0,
                    behavior: 'smooth' // 👈 
                });
            }
            this.HistoryManager.add(state);
            this.changeState("push", state);
            this.EventEmitter.emit("hstory--new-item", event);
        }
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        this.EventEmitter.emit("go", event);
        return this.load({ oldHref: currentURL.getPathname(), href, trigger, transitionName });
    }
    /**
     * Either push or replace history state
     *
     * @param {("push" | "replace")} action
     * @param {IState} state
     * @param {_URL} url
     * @memberof PJAX
     */
    changeState(action, state) {
        let url = state.getURL();
        let href = url.getFullPath();
        let json = state.toJSON();
        let args = [json, '', href];
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
     *
     * @memberof PJAX
     */
    async load({ oldHref, href, trigger, transitionName = "default" }) {
        try {
            let oldPage = this.PageManager.get(oldHref);
            let newPage;
            this.EventEmitter.emit("page--loading", { href, oldPage, trigger });
            try {
                try {
                    newPage = await this.PageManager.load(href);
                    this.transitionStart();
                    this.EventEmitter.emit("page--loading-complete", { newPage, oldPage, trigger });
                }
                catch (err) {
                    throw `Page loading failed, ${err}`;
                }
                // --
                // --
                this.EventEmitter.emit("transition--before", { oldPage, newPage, trigger, transitionName });
                try {
                    this.EventEmitter.emit("transition--start", transitionName);
                    let transition = await this.TransitionManager.boot({
                        name: transitionName,
                        oldPage,
                        newPage,
                        trigger
                    });
                    this.EventEmitter.emit("transition--end", { transition });
                }
                catch (err) {
                    throw err;
                }
                this.EventEmitter.emit("transition--after", { oldPage, newPage, trigger, transitionName });
                this.autoScrollOnHash && this.hashAction({ href, oldHref, trigger, transitionName });
            }
            catch (err) {
                this.transitionStop();
                throw `Transition Error ${err}`;
            }
            this.transitionStop(); // Sets isTransitioning to false
        }
        catch (err) {
            if (this.forceOnError)
                this.force(href);
            else
                console.error(err);
        }
    }
    /**
     * Auto scrolls to an elements position if the element has an hash
     *
     * @param {{ href: string, oldHref: string, trigger: Trigger, transitionName: string }} { }
     * @memberof PJAX
     */
    hashAction({}) {
        let { hash } = window.location;
        let hashID = hash.slice(1);
        if (hashID.length) {
            let el = document.getElementById(hashID);
            if (el) {
                if (el.scrollIntoView) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
                else {
                    let { left, top } = el.getBoundingClientRect();
                    window.scrollTo(left, top);
                }
            }
        }
    }
    /**
     * Check to see if the URL is to be ignored, uses either RegExp of Strings to check
     *
     * @param {_URL} { pathname }
     *
     * @memberof PJAX
     */
    ignoredURL({ pathname }) {
        return this.ignoreURLs.length && this.ignoreURLs.some(url => {
            return typeof url === "string" ? url === pathname : url.exec(pathname) !== null;
        });
    }
    /**
     * When you hover over an anchor, prefech the event target's href
     *
     * @param {LinkEvent} event
     * @memberof PJAX
     */
    onHover(event) {
        let el = this.getLink(event);
        if (!el)
            return;
        const url = new _URL(this.getHref(el));
        const urlString = url.getPathname();
        // If Url is ignored or already in cache, don't do any think
        if (this.ignoredURL(url) || this.PageManager.has(urlString))
            return;
        this.EventEmitter.emit("anchor--hover hover", event);
        (async () => {
            try {
                await this.PageManager.load(url);
            }
            catch (err) {
                console.warn("Prefetch Error", err);
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
    onStateChange(event) {
        this.go({ href: window.location.href, trigger: 'popstate', event });
    }
    /**
     * Bind the event listeners to the PJAX class
     *
     * @memberof PJAX
     */
    bindEvents() {
        this.onHover = this.onHover.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
    }
    /**
     * Initialize DOM Events
     *
     * @memberof PJAX
     */
    initEvents() {
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
    stopEvents() {
        if (this.prefetchIgnore !== true) {
            document.removeEventListener('mouseover', this.onHover);
            document.removeEventListener('touchstart', this.onHover);
        }
        document.removeEventListener('click', this.onClick);
        window.removeEventListener('popstate', this.onStateChange);
    }
}
export class Fade extends Transition {
    constructor() {
        super(...arguments);
        this.name = "default";
        this.duration = 500;
    }
    out({ from }) {
        let { duration } = this;
        let fromWrapper = from.getWrapper();
        return new Promise(resolve => {
            let animation = fromWrapper.animate([
                { opacity: 1 },
                { opacity: 0 },
            ], {
                duration,
                easing: "ease"
            });
            animation.onfinish = resolve;
        });
    }
    in({ to }) {
        let { duration } = this;
        let toWrapper = to.getWrapper();
        // window.scroll({
        //     top: 0,
        //     behavior: 'smooth'  // 👈 
        // });
        return new Promise(resolve => {
            let animation = toWrapper.animate([
                { opacity: 0 },
                { opacity: 1 },
            ], {
                duration,
                easing: "ease"
            });
            animation.onfinish = resolve;
        });
    }
}
app.add("service", new PJAX());
app.add("transition", new Fade());
(async () => {
    try {
        await app.boot();
    }
    catch (err) {
        console.warn("App boot failed", err);
    }
    let navbarLinks = () => {
        let { href } = window.location;
        let navLink = document.querySelectorAll(".nav-link");
        for (let item of navLink) {
            let URLmatch = _URL.equal(item.href, href);
            let isActive = item.classList.contains("active");
            if (!(URLmatch && isActive)) {
                item.classList[URLmatch ? "add" : "remove"]("active");
            }
        }
    };
    app
        .on({
        "ready": navbarLinks,
        "go": navbarLinks
    });
})();
//# sourceMappingURL=framework.js.map