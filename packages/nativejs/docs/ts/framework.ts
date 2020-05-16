import { App, Service, LinkEvent, _URL, Page, Trigger, IState, Coords, StateEvent } from "./api.js";
const app = new App();

export type IgnoreURLsList = Array<RegExp | string>;
export

// Based on Barba JS and StartingBlocks
class PJAX extends Service {
    private ignoreURLs: IgnoreURLsList = [];
    private prefetchIgnore: boolean;
    private transitions = {
        isRunning: false
    };

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

    public ignoredURL({ pathname }: _URL): boolean {
        return this.ignoreURLs.length && this.ignoreURLs.some(url => {
            return typeof url === "string" ? url == pathname : (url as RegExp).exec(pathname) !== null;
        });
    }

    public getLink (e: LinkEvent): HTMLAnchorElement {
        let el = e.target as HTMLAnchorElement;
        let href: string;

        do {
            el = (el as HTMLElement).parentNode as HTMLAnchorElement;
            href = this.getHref(el);
        } while (el && !href);

        // Check prevent
        if (!el || this.preventLink(el, e, href)) return;
        return el;
    }

    public async onHover (event: LinkEvent): Promise<void> {
        let el = this.getLink(event);
        if (!el) return;

        const url = new _URL(this.getHref(el));

        // If Url is ignored or already in cache, don't do any think
        if (this.ignoredURL(url) || this.PageManager.has(url.clean())) return;

        try {
            let page = await this.PageManager.load(url);
            console.log(page.getURL().clean());
        } catch (err) {
            console.warn(err);
        }
    }

    public force(url: string): void {
        window.location.assign(url);
    }

    public async go(
        href: string,
        trigger: Trigger = 'HistoryManager',
        e?: StateEvent
    ): Promise<void> {
        // If animation running, force reload
        if (this.transitions.isRunning) {
            this.force(href);
            return;
        }

        let url = new _URL(href);
        let current = this.HistoryManager.last();
        if (current.getURL().compare(url)) return;

        if (e && (e as PopStateEvent).state) {
            // If popstate, move to existing state
            // and get back/forward direction.
            const { state }: { state: IState } = e as PopStateEvent;
            const { index } = state;
            const diff = this._pointer - index;

            trigger = this._getDirection(diff);

            // Work with previous states
            this.replace(state.states);
            this._pointer = index;
        } else {
            // Add new state
            this.HistoryManager.addItem({
                url: url.clean(),
                index: this.HistoryManager.size(),
                transition: "none",
                data: {
                    scroll: new Coords(),
                    trigger,
                    event: e
                }
            });
        }

        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        const currentPosition = window.scrollY;
        window.history.pushState(null, null, url);
        window.scrollTo(0, currentPosition);
    }

    public async onClick (event: LinkEvent) {
        event.preventDefault();
        let el = this.getLink(event);

        if (!el) return;
        if (this.transitions.isRunning) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        this.go(this.getHref(el), el, event);
    }

    public onStateChange (e: PopStateEvent): void {
        this.go(this.url.getHref(), 'popstate', e);
    }

    public initEvents() {
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
    } catch (err) {
        console.warn("App boot failed");
    }

    try {
        let page: Page = await app.load("page", "./other.html");
        console.log(page.getURL().clean());

        page = await app.load("page", "./about.html");
        console.log(page.getURL().clean());
    } catch (err) {
        console.warn("Page loading failed");
    }
})();