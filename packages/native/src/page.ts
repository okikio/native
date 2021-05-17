import { Manager, ManagerItem, AdvancedManager } from "./manager";
import { equal, newURL } from "./url";
import { getConfig } from "./config";
import { Service } from "./service";

export interface IPage extends ManagerItem {
    dom: Document,
    wrapper: HTMLElement,
    title: string,
    head: Element,
    body: Element,
    url: URL,
    data: string,
    wrapperAttr: string,

    build(): any,
    install(): void,
    uninstall(): any,
}

/**
 * Parses strings to DOM
 */
export const PARSER: DOMParser = new DOMParser();

/** A page represents the DOM elements that create each page */
export class Page extends ManagerItem implements IPage {
    /** Holds the DOM of the current page */
    public dom: Document;

    /** Holds the wrapper element to be swapped out of each Page */
    public wrapper: HTMLElement;

    /** Holds the title of each page */
    public title: string;

    /** Holds the head element of each page */
    public head: Element;

    /** Holds the body element of each page */
    public body: Element;

    /** The URL of the current page */
    public url: URL;

    /** The payload of a page request */
    public data: string;

    /** Attr that identifies the wrapper */
    public wrapperAttr: string;

    constructor(url: URL = newURL(), dom: string | Document = document) {
        super();
        this.url = url;

        if (typeof dom === "string") {
            this.data = dom;
        } else this.dom = dom || document;
    }

    /** Builds the page's dom, and sets the title, head, body, and wrapper properties of the Page class */
    public build() {
        if (!(this.dom instanceof Node)) {
            this.dom = PARSER.parseFromString(this.data, "text/html");
        }

        if (!(this.body instanceof Node)) {
            let { title, head, body } = this.dom;
            this.title = title;
            this.head = head;
            this.body = body;
            this.wrapper = this.body.querySelector(this.wrapperAttr);
        }
    }

    public install() {
        this.wrapperAttr = getConfig(this.config, "wrapperAttr");
    }

    public uninstall() {
        this.url = undefined;
        this.title = undefined;
        this.head = undefined;
        this.body = undefined;
        this.dom = undefined;
        this.wrapper = undefined;
        this.data = undefined;
        this.wrapperAttr = undefined;
    }
}

export interface IPageManager extends Service {
    loading: Manager<string, Promise<string>>,
    pages: AdvancedManager<string, Page>;

    install(): any,

    get(key: string): Page,
    add(value: IPage): PageManager,
    set(key: string, value: IPage): PageManager,
    remove(key: string): PageManager,
    has(key: string): boolean,
    clear(): PageManager,
    size: number,
    keys(): any[],

    load(_url: URL | string): Promise<Page>,
    request(url: string): Promise<string>,
}

/** Controls which page to load */
export class PageManager extends Service implements IPageManager {
    /** Stores all fetch requests that are currently loading */
    public loading: Manager<string, Promise<string>> = new Manager();

    pages: AdvancedManager<string, Page>;

    /** Instantiate pages, and add the current page to pages */
    install() {
        this.pages = new AdvancedManager(this.app);

        let URLString = newURL().pathname;
        this.set(URLString, new Page());
        URLString = undefined;
    }

    get(key: string) { return this.pages.get(key); }
    add(value: IPage) { this.pages.add(value); return this; }
    set(key: string, value: IPage) { this.pages.set(key, value); return this; }
    remove(key: string) { this.pages.remove(key); return this; }
    has(key: string) { return this.pages.has(key); }
    clear() { this.pages.clear(); return this; }
    get size() { return this.pages.size; }
    keys() { return this.pages.keys(); }

    /** Load from cache or by requesting URL via a fetch request, avoid requesting for the same thing twice by storing the fetch request in "this.loading" */
    public async load(_url: URL | string = newURL()): Promise<Page> {
        let url: URL = newURL(_url);
        let urlString: string = url.pathname;
        let page: Page, request: Promise<string>;

        if (this.has(urlString)) {
            page = this.get(urlString);
            return Promise.resolve(page);
        }

        if (!this.loading.has(urlString)) {
            request = this.request(urlString);
            this.loading.set(urlString, request);
        } else request = this.loading.get(urlString);

        let response = await request;
        this.loading.remove(urlString);

        page = new Page(url, response);
        this.set(urlString, page);

        if (this.size > getConfig(this.config, "maxPages")) {
            let currentUrl = newURL();
            let keys = this.keys();
            let first = equal(currentUrl, keys[0]) ? keys[1] : keys[0];
            let page = this.get(first);
            page.unregister();
            page = undefined;
            keys = undefined;
            currentUrl = undefined;
            first = undefined;
        }

        return page;
    }

    /** Starts a fetch request */
    public async request(url: string): Promise<string> {
        const headers = new Headers(getConfig(this.config, "headers"));
        const timeout = window.setTimeout(() => {
            window.clearTimeout(timeout);
            throw "Request Timed Out!";
        }, getConfig(this.config, "timeout"));

        try {
            let response = await fetch(url, {
                mode: 'same-origin',
                method: "GET",
                headers,
                cache: "default",
                credentials: "same-origin",
            });

            window.clearTimeout(timeout);
            if (response.status >= 200 && response.status < 300) {
                return await response.text();
            }

            const err = new Error(response.statusText || "" + response.status);
            throw err;
        } catch (err) {
            window.clearTimeout(timeout);
            throw err;
        }
    }
}
