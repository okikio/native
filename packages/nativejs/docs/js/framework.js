import { App, Service, _URL } from "./api.js";
const app = new App();
export class PJAX extends Service {
    constructor() {
        super(...arguments);
        this.ignoreURLs = [];
        this.transitions = {
            isRunning: false
        };
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
    getLink(e) {
        let el = e.target;
        let href;
        do {
            el = el.parentNode;
            href = this.getHref(el);
        } while (el && !href);
        // Check prevent
        if (!el || this.preventLink(el, e, href))
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
        try {
            let page = await this.PageManager.load(url);
            console.log(page.getURL().clean());
        }
        catch (err) {
            console.warn(err);
        }
    }
    force(url) {
        window.location.assign(url);
    }
    async go(href, trigger = 'HistoryManager', e) {
        // If animation running, force reload
        if (this.transitions.isRunning) {
            this.force(href);
            return;
        }
        let url = new _URL(href);
        let current = this.HistoryManager.last();
        if (current.getURL().compare(url))
            return;
        if (e && e.state) {
            // If popstate, move to existing state
            // and get back/forward direction.
            const { state } = e;
            const { index } = state;
            const diff = this._pointer - index;
            trigger = this._getDirection(diff);
            // Work with previous states
            this.replace(state.states);
            this._pointer = index;
        }
        else {
            // Add new state
            this.add(url, trigger);
        }
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        const currentPosition = window.scrollY;
        window.history.pushState(null, null, url);
        window.scrollTo(0, currentPosition);
        this.onStateChange(transitionName, true, element, cursorPosition);
    }
    async onClick(event) {
        event.preventDefault();
        let el = this.getLink(event);
        if (!el)
            return;
        if (this.transitions.isRunning) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        this.go(this.getHref(el), el, e);
    }
    onStateChange(e) {
        // this.go(this.url.getHref(), 'popstate', e);
    }
    initEvents() {
        if (this.prefetchIgnore !== true) {
            document.addEventListener('mouseover', this.onHover.bind(this));
            document.addEventListener('touchstart', this.onHover.bind(this));
        }
        document.addEventListener('click', this.onClick.bind(this));
        // window.addEventListener('popstate', onStateChange.bind(this));
    }
}
app.add("service", new PJAX());
(async () => {
    try {
        await app.boot();
    }
    catch (err) {
        console.warn("App boot failed");
    }
    try {
        let page = await app.load("page", "./other.html");
        console.log(page.getURL().clean());
        page = await app.load("page", "./about.html");
        console.log(page.getURL().clean());
    }
    catch (err) {
        console.warn("Page loading failed");
    }
})();
//# sourceMappingURL=framework.js.map