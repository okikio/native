import { App, Service, LinkEvent, _URL, Page, Trigger, IState, Coords, StateEvent as AnchorEvent, State, Transition, ITransitionData, Manager } from "./api.js";
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
     * @type {boolean}
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
     * @private
     * @type {boolean}
     * @memberof PJAX
     */
    protected isTransitioning: boolean = false;

    /**
     * Ignore extra clicks of an anchor element if a transition has already started
     *
     * @private
     * @type {boolean}
     * @memberof PJAX
     */
    protected stopOnTransitioning: boolean = false;

    /**
     * On page change (excluding popstate event) keep current scroll position
     *
     * @private
     * @type {boolean}
     * @memberof PJAX
     */
    protected stickyScroll: boolean = true;

    /**
     * Force load a page if an error occurs
     *
     * @private
     * @type {boolean}
     * @memberof PJAX
     */
    protected forceOnError: boolean = false;

    /**
     * Dictates whether to auto scroll if an hash is present in the window URL
     *
     * @protected
     * @type {boolean}
     * @memberof PJAX
     */
    protected autoScrollOnHash: boolean = true;

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
        this.changeState("replace", current);
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
        let sameURL = new _URL().getFullPath() === new _URL(href).getFullPath();
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
     * @param {AnchorEvent} [event]
     * @memberof PJAX
     */
    public go({ href, trigger = 'HistoryManager', event }: { href: string; trigger?: Trigger; event?: AnchorEvent; }): Promise<void> {
        // If transition is already running and the go method is called again, force load page
        if (this.isTransitioning && this.stopOnTransitioning) {
            this.force(href);
            return;
        }

        let url = new _URL(href);
        let currentState = this.HistoryManager.last();
        let currentURL = currentState.getURL();
        if (currentURL.equalTo(url)) {
            this.hashAction(url.hash);
            return;
        }

        let transitionName: string;
        if (event && (event as PopStateEvent).state) {
            this.EventEmitter.emit("popstate", event);

            // If popstate, get back/forward direction.
            let { state }: { state: IState } = event as PopStateEvent;
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
                    behavior: 'smooth'  // 👈 
                });
            }

            // Based on the direction of the state change either remove or add a state
            if (trigger === "back") {
                this.HistoryManager.remove(currentIndex);
                this.EventEmitter.emit(`popstate--back`, event);
            } else if (trigger === "forward") {
                this.HistoryManager.addState({ url, transition, data });
                this.EventEmitter.emit(`popstate--forward`, event);
            }
        } else {
            // Add new state
            transitionName = this.getTransitionName(trigger as HTMLAnchorElement) || "default";
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
                    behavior: 'smooth'  // 👈 
                });
            } else {
                window.scroll({
                    top: 0, left: 0,
                    behavior: 'smooth'  // 👈 
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
    public changeState(action: "push" | "replace", state: State) {
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
    public async load({ oldHref, href, trigger, transitionName = "default" }: { oldHref: string; href: string; trigger: Trigger; transitionName?: string; }): Promise<any> {
        try {
            let oldPage = this.PageManager.get(oldHref);
            let newPage: Page;

            this.EventEmitter.emit("page--loading", { href, oldPage, trigger });
            try {
                try {
                    newPage = await this.PageManager.load(href);
                    this.transitionStart();
                    this.EventEmitter.emit("page--loading-complete", { newPage, oldPage, trigger });
                } catch (err) {
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
                } catch (err) {
                    throw err;
                }

                this.EventEmitter.emit("transition--after", { oldPage, newPage, trigger, transitionName });
                this.hashAction();
            } catch (err) {
                this.transitionStop();
                throw `Transition Error ${err}`;
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
                        el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        let { left, top } = el.getBoundingClientRect();
                        window.scroll({ left, top, behavior: 'smooth' });
                    }
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
    public ignoredURL({ pathname }: _URL): boolean {
        return this.ignoreURLs.length && this.ignoreURLs.some(url => {
            return typeof url === "string" ? url === pathname : (url as RegExp).exec(pathname) !== null;
        });
    }

    /**
     * When you hover over an anchor, prefech the event target's href
     *
     * @param {LinkEvent} event
     * @memberof PJAX
     */
    public onHover(event: LinkEvent): Promise<void> {
        let el = this.getLink(event);
        if (!el) return;

        const url = new _URL(this.getHref(el));
        const urlString: string = url.getPathname();
        // If Url is ignored or already in cache, don't do any think
        if (this.ignoredURL(url) || this.PageManager.has(urlString)) return;

        this.EventEmitter.emit("anchor--hover hover", event);

        (async () => {
            try {
                await this.PageManager.load(url);
            } catch (err) {
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

//== Transitions
export class Fade extends Transition {
    protected name = "default";
    protected duration = 500;

    out({ from }: ITransitionData) {
        let { duration } = this;
        let fromWrapper = from.getWrapper();
        window.scroll({
            top: 0,
            behavior: 'smooth'  // 👈 
        });
        return new Promise(resolve => {
            let animation = fromWrapper.animate([
                { opacity: 1 },
                { opacity: 0 },
            ], {
                duration,
                easing: "ease"
            });
            animation.onfinish = () => {
                fromWrapper.style.opacity = "0";
                window.scrollTo(0, 0);
                resolve();
            };
        });
    }

    in({ to }: ITransitionData) {
        let { duration } = this;
        let toWrapper = to.getWrapper();
        return new Promise(resolve => {
            let animation = toWrapper.animate([
                { opacity: 0 },
                { opacity: 1 },
            ], {
                duration,
                easing: "ease"
            });
            animation.onfinish = () => {
                toWrapper.style.opacity = "1";
                resolve();
            };
        });
    }
}

export class Slide extends Transition {
    protected name = "slide";
    protected duration = 500;
    protected direction: string = "right";

    out({ from }: ITransitionData) {
        let { duration } = this;
        let fromWrapper = from.getWrapper();
        window.scroll({
            top: 0,
            behavior: 'smooth'  // 👈 
        });
        return new Promise(resolve => {
            let animation = fromWrapper.animate([
                { transform: "translateX(0%)", opacity: 1 },
                { transform: `translateX(${this.direction === "left" ? "-" : ""}25%)`, opacity: 0 },
            ], {
                duration,
                easing: "cubic-bezier(0.64, 0, 0.78, 0)" // ease-in-quint
            });
            animation.onfinish = () => {
                fromWrapper.style.opacity = "0";
                resolve();
            };
        });
    }

    in({ to }: ITransitionData) {
        let toWrapper = to.getWrapper();
        return new Promise(resolve => {
            let animation = toWrapper.animate([
                { transform: `translateX(${this.direction === "left" ? "" : "-"}25%)`, opacity: 0 },
                { transform: "translateX(0%)", opacity: 1 },
            ], {
                duration: 750,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)" // ease-out-quint
            });
            animation.onfinish = () => {
                toWrapper.style.opacity = "1";
                resolve();
            };
        });
    }
}

export class SlideLeft extends Slide {
    protected name = "slide-left";
    protected duration = 500;
    protected direction: string = "left";
}

export class SlideRight extends Slide {
    protected name = "slide-right";
    protected duration = 500;
    protected direction: string = "right";
}

export class BigTransition extends Transition {
    protected name = "big";
    protected duration = 500;
    protected mainElement: HTMLElement;
    protected verticalElements: HTMLDivElement[];
    protected horizontalElements: HTMLDivElement[];
    protected maxLength: number;

    public boot() {
        this.mainElement = document.getElementById('big-transition');
        this.verticalElements = [...document.getElementById('big-transition-vertical').querySelectorAll('div')];
        this.horizontalElements = [...document.getElementById('big-transition-horizontal').querySelectorAll('div')];
        this.maxLength = Math.max(this.verticalElements.length, this.horizontalElements.length);
    }

    out({ from }: ITransitionData) {
        let { duration } = this;
        let fromWrapper = from.getWrapper();
        window.scroll({
            top: 0,
            behavior: 'smooth'  // 👈 
        });
        return new Promise(resolve => {
            let wrapperAnim = fromWrapper.animate([
                { opacity: 1 },
                { opacity: 0 },
            ], {
                duration,
                easing: "ease"
            });
            wrapperAnim.onfinish = () => {
                fromWrapper.style.opacity = "0";
            };

            this.mainElement.style.opacity = "1";
            this.mainElement.style.visibility = "visible";

            let count = 1;
            for (let el of this.horizontalElements) {
                let animation = el.animate([
                    { transform: "scaleX(0)" },
                    { transform: "scaleX(1)" },
                ], {
                    duration,
                    delay: 100 * count,
                    easing: "linear"
                });
                animation.onfinish = () => {
                    el.style.transform = "scaleX(1)";
                };
                count++;
            }

            count = 1;
            for (let el of this.verticalElements.reverse()) {
                let animation = el.animate([
                    { transform: "scaleY(0)" },
                    { transform: "scaleY(1)" },
                ], {
                    duration,
                    delay: 100 * count,
                    easing: "linear"
                });
                animation.onfinish = () => {
                    el.style.transform = "scaleY(1)";
                };
                count++;
            }

            window.setTimeout(resolve, this.maxLength * 100 + duration);
        });
    }

    in({ to }: ITransitionData) {
        let { duration } = this;
        let toWrapper = to.getWrapper();
        return new Promise(resolve => {
            let wrapperAnim = toWrapper.animate([
                { opacity: 0 },
                { opacity: 1 },
            ], {
                duration,
                easing: "ease"
            });
            wrapperAnim.onfinish = () => {
                toWrapper.style.opacity = "1";
            };

            let count = 1;
            for (let el of this.horizontalElements) {
                let animation = el.animate([
                    { transform: "scaleX(1)" },
                    { transform: "scaleX(0)" },
                ], {
                    duration,
                    delay: 100 * count
                });
                animation.onfinish = () => {
                    el.style.transform = "scaleX(0)";
                };
                count++;
            }

            count = 1;
            for (let el of this.verticalElements) {
                let animation = el.animate([
                    { transform: "scaleY(1)" },
                    { transform: "scaleY(0)" },
                ], {
                    duration,
                    delay: 100 * count
                });
                animation.onfinish = () => {
                    el.style.transform = "scaleY(0)";
                };
                count++;
            }

            window.setTimeout(() => {
                this.mainElement.style.opacity = "0";
                this.mainElement.style.visibility = "hidden";
                resolve();
            }, this.maxLength * 100 + duration);
        });
    }
}


//== Services
export class Splashscreen extends Service {
    protected rootElement: HTMLElement;
    protected innerEl: HTMLElement;
    protected bgEl: HTMLElement;
    protected minimalDuration: number = 1000; // ms

    public boot() {
        // Elements
        this.rootElement = document.getElementById('splashscreen');
        this.innerEl = this.rootElement.querySelector('.splashscreen-inner');
        this.bgEl = this.rootElement.querySelector('.splashscreen-bg');
    }


    public initEvents() {
        this.hide();
    }

    // You need to override this method
    public async hide() {
        await new Promise(resolve => {
            window.setTimeout(() => {
                this.EventEmitter.emit("BEFORE_SPLASHSCREEN_HIDE");
                resolve();
            }, this.minimalDuration);
        });

        await new Promise(resolve => {
            let elInner = this.innerEl.animate([
                { opacity: '1' },
                { opacity: '0' },
            ], 500);
            elInner.onfinish = () => {
                this.innerEl.style.opacity = '0';
            };

            this.EventEmitter.emit("START_SPLASHSCREEN_HIDE");

            let rootEl = this.rootElement.animate([
                { transform: "translateY(0%)" },
                { transform: "translateY(100%)" }
            ], {
                duration: 1200,
                easing: "cubic-bezier(0.65, 0, 0.35, 1)" // ease-in-out-cubic
            });
            rootEl.onfinish = () => {
                this.rootElement.style.visibility = "hidden";
                this.rootElement.style.pointerEvents = "none";
                this.rootElement.style.transform = "translateY(100%)";
                this.EventEmitter.emit("AFTER_SPLASHSCREEN_HIDE");

                resolve();
            };
        });
    }
}
export class IntroAnimation extends Service {
    protected elements: Array<Element>;
    protected rootElement: HTMLElement;

    public boot() {
        // Elements
        this.elements = [...document.querySelectorAll('.bg-white')];

        // Bind methods
        this.prepareToShow = this.prepareToShow.bind(this);
        this.show = this.show.bind(this);
    }

    public initEvents() {
        this.EventEmitter.on("BEFORE_SPLASHSCREEN_HIDE", this.prepareToShow);
        this.EventEmitter.on("START_SPLASHSCREEN_HIDE", this.show);
        this.EventEmitter.on("BEFORE_TRANSITION_IN", () => {
            this.boot();
            this.prepareToShow();
        });
        this.EventEmitter.on("AFTER_TRANSITION_IN", this.show);
    }

    public stopEvents() {
        this.EventEmitter.off("BEFORE_SPLASHSCREEN_HIDE", this.prepareToShow);
        this.EventEmitter.off("START_SPLASHSCREEN_HIDE", this.show);
        this.EventEmitter.off("BEFORE_TRANSITION_IN", () => {
            this.boot();
            this.prepareToShow();
        });
        this.EventEmitter.off("AFTER_TRANSITION_IN", this.show);
    }

    public prepareToShow() {
        for (let el of this.elements) {
            (el as HTMLElement).style.transform = "translateY(200px)";
            (el as HTMLElement).style.opacity = '0';
        }
    }

    public show() {
        let count = 1;
        for (let el of this.elements) {
            let animation = (el as HTMLElement).animate([
                { transform: "translateY(200px)", opacity: 0 },
                { transform: "translateY(0px)", opacity: 1 },
            ], {
                duration: 1200,
                delay: 200 * count,
                easing: "cubic-bezier(0.33, 1, 0.68, 1)" // ease-out-cubic
            });
            animation.onfinish = () => {
                (el as HTMLElement).style.opacity = '1';
                (el as HTMLElement).style.transform = "translateY(0)";
            }
            count++;
        }
    }
}

export class InView extends Service {
    protected rootElements: Node[];
    protected observers: IntersectionObserver[];
    protected observerOptions: { root: any; rootMargin: string; threshold: number; };
    protected imgs: Manager<number, Node[]>;
    protected direction: string[];
    protected xPercent: number[];
    public onScreenEl: boolean[];

    public boot() {
        this.rootElements = [...document.querySelectorAll('[data-node-type="InViewBlock"]')];

        // Values
        this.observers = [];
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        // Bind method
        this.onIntersectionCallback = this.onIntersectionCallback.bind(this);

        // Create observers
        for (let i = 0, len = this.rootElements.length; i < len; i++) {
            this.observers[i] = new IntersectionObserver(entries => {
                this.onIntersectionCallback([i, entries]);
            }, this.observerOptions);
        }

        // Add block rootElement in the observer
        this.observe();

        // Prepare values
        this.imgs = new Manager<number, Node[]>();
        this.onScreenEl = [];
        this.direction = [];
        this.xPercent = [];

        for (let i = 0, len = this.rootElements.length; i < len; i++) {
            let rootElement = this.rootElements[i] as HTMLElement;
            if (rootElement.hasAttribute('data-direction')) {
                this.direction[i] = rootElement.getAttribute('data-direction');
            } else {
                this.direction[i] = "right";
            }

            if (this.direction[i] === 'left') {
                this.xPercent[i] = -(typeof this.xPercent[i] === "undefined" ? 30 : this.xPercent[i]);
            } else {
                this.xPercent[i] = typeof this.xPercent[i] === "undefined" ? 30 : this.xPercent[i];
            }

            // Find elements
            this.imgs.set(i, [...rootElement.querySelectorAll('img')]);
        }
    }

    public initEvents() {
        this.EventEmitter.on("BEFORE_TRANSITION_OUT", () => {
            this.unobserve();
        });
        this.EventEmitter.on("BEFORE_TRANSITION_IN", () => {
            this.boot();
        });
    }

    observe() {
        for (let i = 0, len = this.rootElements.length; i < len; i++) {
            this.observers[i].observe(this.rootElements[i] as HTMLElement);
        }
    }

    unobserve() {
        for (let i = 0, len = this.rootElements.length; i < len; i++) {
            this.observers[i].unobserve(this.rootElements[i] as HTMLElement);
        }
    }

    stopEvents() {
        this.unobserve();
    }

    onIntersectionCallback([i, entries]) {
        for (let entry of entries) {
            if (!this.onScreenEl[i]) {
                if (entry.intersectionRatio > 0) {
                    this.onScreen([i, entry])
                } else {
                    this.offScreen([i, entry])
                }
            }
        }
    }

    onScreen([i, { target }]) {
        let animation = target.animate([
            { transform: `translateX(${this.xPercent[i]}%)`, opacity: 0 },
            { transform: "translateX(0%)", opacity: 1 },
        ], {
            duration: 1500,
            delay: 0.15,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)" // ease-out-quint
        });
        animation.onfinish = () => {
            target.style.transform = "translateX(0%)";
            target.style.opacity = "1";
            this.onScreenEl[i] = true;
        };
    }

    offScreen([i, { target }]) {
        target.style.transform = `translateX(${this.xPercent[i]}%)`;
        target.style.opacity = "0";
    }
}

app
    .add("service", new PJAX())
    .add("service", new Splashscreen())
    .add("service", new IntroAnimation())
    .add("service", new InView())
    .add("transition", new Fade())
    .add("transition", new BigTransition())
    .add("transition", new Slide())
    .add("transition", new SlideLeft())
    .add("transition", new SlideRight());

(async () => {
    let navbarLinks = () => {
        let { href } = window.location;
        let navLink = document.querySelectorAll(".navbar .nav-link");

        for (let item of navLink) {
            let URLmatch = _URL.equal((item as HTMLAnchorElement).href, href);
            let isActive = item.classList.contains("active");
            if (!(URLmatch && isActive)) {
                item.classList[URLmatch ? "add" : "remove"]("active");
            }
        }
    };

    try {
        await app.boot();
    } catch (err) {
        console.warn("App boot failed", err);
    }

    app.on({
        "ready": navbarLinks,
        "go": navbarLinks
    });
})();