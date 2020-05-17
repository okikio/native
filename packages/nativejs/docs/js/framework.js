import { App, Service, _URL, Coords, State, Transition } from "./api.js";
const app = new App();
// Based on Barba JS and StartingBlocks
export class PJAX extends Service {
    constructor() {
        super(...arguments);
        this.ignoreURLs = [];
        this.prefetchIgnore = false;
        this.isTransitioning = false;
        this.stopOnTransitioning = false;
    }
    transitionStart() {
        this.isTransitioning = true;
    }
    transitionStop() {
        this.isTransitioning = false;
    }
    boot() {
        let current = new State();
        this.HistoryManager.add(current);
        window.history && window.history.replaceState(current.toJSON(), '', current.getCleanURL());
    }
    getHref(el) {
        if (el && el.tagName && el.tagName.toLowerCase() === 'a' && typeof el.href === 'string')
            return el.href;
        return null;
    }
    getTransitionName(el) {
        if (!el)
            return null;
        let transitionAttr = el.getAttribute(this.getConfig("transitionAttr", false));
        if (typeof transitionAttr === 'string')
            return transitionAttr;
        return null;
    }
    // Based on barbajs
    preventLink(el, event, href) {
        let location = new _URL();
        let url = new _URL(href);
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
        let sameURL = location.compare(url);
        return eventMutate && newTab && crossOrigin && download && prevent && sameURL;
    }
    ignoredURL({ pathname }) {
        return this.ignoreURLs.length && this.ignoreURLs.some(url => {
            return typeof url === "string" ? url == pathname : url.exec(pathname) !== null;
        });
    }
    getLink(event) {
        let el = event.target;
        let href = this.getHref(el);
        while (el && !href) {
            el = el.parentNode;
            href = this.getHref(el);
        }
        // Check prevent
        if (!el || this.preventLink(el, event, href))
            return;
        return el;
    }
    async onHover(event) {
        let el = this.getLink(event);
        if (!el)
            return;
        const url = new _URL(this.getHref(el));
        // If Url is ignored or already in cache, don't do any think
        if (this.ignoredURL(url) || this.PageManager.has(url.clean()))
            return;
        this.EventEmitter.emit("Anchor:Hover Hover", event);
        try {
            let page = await this.PageManager.load(url);
            console.log("Prefetch: ", page.getURL().clean());
        }
        catch (err) {
            console.warn(err);
        }
    }
    async load(oldHref, href, trigger, transition = "default") {
        let oldPage = this.PageManager.get(oldHref);
        this.EventEmitter.emit("Page:Loading");
        let newPage;
        try {
            newPage = await this.PageManager.load(href);
            this.transitionStart();
            this.EventEmitter.emit("Page:Loaded");
        }
        catch (err) {
            this.EventEmitter.emit("Page:Loading--Failed");
            console.error(err);
            this.force(href);
        }
        try {
            if (!this.TransitionManager.has(transition))
                throw `PJAX: Transition with name '${transition}' doesn't exist, using 'default'.`;
        }
        catch (err) {
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
        }
        catch (err) {
            console.error(err);
            this.force(href);
        }
    }
    force(url) {
        window.location.assign(url);
    }
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
    go(href, trigger = 'HistoryManager', event) {
        // If animation running, force reload
        if (this.isTransitioning) {
            this.force(href);
            return;
        }
        let url = new _URL(href);
        let current = this.HistoryManager.last();
        let currentURL = current.getURL();
        if (currentURL.compare(url))
            return;
        let transitionName;
        if (event && event.state) {
            this.EventEmitter.emit("Popstate", event);
            // If popstate, get back/forward direction.
            let { state } = event;
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
            }
            else if (trigger === "forward") {
                this.HistoryManager.addState({ url, transition, data });
                this.EventEmitter.emit(`Popstate:Forward`, event);
            }
        }
        else {
            // Add new state
            transitionName = this.getTransitionName(trigger);
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
    onClick(event) {
        let el = this.getLink(event);
        if (!el)
            return;
        if (this.isTransitioning && this.stopOnTransitioning) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        this.EventEmitter.emit("Anchor:Click Click", event);
        this.go(this.getHref(el), el, event);
    }
    onStateChange(event) {
        let { state } = event;
        this.go(state.url, 'popstate', event);
    }
    initEvents() {
        if (this.prefetchIgnore !== true) {
            document.addEventListener('mouseover', this.onHover.bind(this));
            document.addEventListener('touchstart', this.onHover.bind(this));
        }
        document.addEventListener('click', this.onClick.bind(this));
        window.addEventListener('popstate', this.onStateChange.bind(this));
    }
}
export class Default extends Transition {
    constructor() {
        super(...arguments);
        this.name = "default";
    }
    in({ done }) {
        done();
    }
}
app.add("service", new PJAX());
app.add("transition", new Default());
(async () => {
    try {
        await app.boot();
    }
    catch (err) {
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
//# sourceMappingURL=framework.js.map