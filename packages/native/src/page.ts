
import { Manager, ManagerItem, AdvancedManager } from "./manager";
import { equal, newURL } from "./url";
import { Service } from "./service";
import { toAttr } from "./config";

import { pathToRegexp } from "path-to-regexp";

import type { TypeIgnoreURLsList } from "./pjax";

/**
 * Parses strings to DOM
 */
export const PARSER: DOMParser = new DOMParser();

/** A page represents the DOM elements that create each page */
export class Page extends ManagerItem {
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

    constructor(url: string | URL = newURL(), dom: string | Document = document) {
        super();
        this.url = newURL(url);

        if (typeof dom === "string") {
            this.data = dom;
        } else this.dom = dom || document;
    }

    /** Builds the page's dom, and sets the title, head, body, and wrapper properties of the Page class */
    public async build() {
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
        this.wrapperAttr = toAttr(this.config, "wrapperAttr");
    }

    public uninstall() {
        this.url = null;
        this.title = null;
        this.head = null;
        this.body = null;
        this.dom = null;
        this.wrapper = null;
        this.data = null;
        this.wrapperAttr = null;
    }
}

export interface IPage extends Page { }

/** Controls which page to load */
export class PageManager extends Service {
    /** Stores all fetch requests that are currently loading */
    public loading: Manager<string, Promise<string>> = new Manager();
    public pages: AdvancedManager<string, Page>;

    /** URLs to ignore caching */
    public cacheIgnore: TypeIgnoreURLsList | boolean;

    constructor() {
        super();
    }

    /** Instantiate pages, and add the current page to pages */
    install() {
        this.pages = new AdvancedManager(this.app);
        this.cacheIgnore = this.config.cacheIgnore;

        let URLString = newURL().pathname;
        this.set(URLString, new Page());
        URLString = null;
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

        if (this.has(urlString) && !ignoreURLs(urlString, this.cacheIgnore)) {
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

        if (this.size > this.config.maxPages) {
            let currentUrl = newURL();
            let keys = this.keys();
            let first = equal(currentUrl, keys[0]) ? keys[1] : keys[0];
            let page = this.get(first);
            page.unregister();
            page = null;
            keys = null;
            currentUrl = null;
            first = null;
        }

        return page;
    }

    /** Starts a fetch request */
    public async request(url: string): Promise<string> {
        const headers = new Headers(this.config.headers);
        const timeout = window.setTimeout(() => {
            window.clearTimeout(timeout);

            const err = new Error("Request Timed Out!");
            this.emitter.emit("TIMEOUT_ERROR", err, url);
            throw err;
        }, this.config.timeout);

        try {
            let response = await fetch(url, {
                mode: 'same-origin',
                method: "GET",
                headers,
                cache: "default",
                credentials: "same-origin",
            });

            window.clearTimeout(timeout);
            if (response.status >= 200 && response.status < 300)
                return await response.text();

            const err = new Error(response.statusText || "" + response.status);
            this.emitter.emit("REQUEST_ERROR", err, url);
            throw err;
        } catch (err) {
            window.clearTimeout(timeout);
            throw err;
        }
    }
}


/** Check if url is supposed to be ignored */
export const ignoreURLs = (urlString: string, ignoreList: boolean | TypeIgnoreURLsList) => {
    if (typeof ignoreList == "boolean")
        return ignoreList;

    let _keys = [];
    return !(ignoreList as TypeIgnoreURLsList)
        .every(val => pathToRegexp(val, _keys, {
            start: false,
            end: false
        }).exec(urlString) == null);
}

export interface IPageManager extends PageManager { }