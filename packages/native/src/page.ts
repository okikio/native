import { Manager, ManagerItem, AdvancedManager } from "./manager";
import { newURL } from "./url";
import { App } from "./app";

/**
 * Parses strings to DOM
 */
export const PARSER: DOMParser = new DOMParser();

/**
 * A page represents the DOM elements that create each page
 *
 * @export
 * @class Page
 */
export class Page extends ManagerItem {
	/**
	 * Holds the DOM of the current page
	 *
	 * @type Document
	 * @memberof Page
	 */
    public dom: Document;

	/**
	 * Holds the wrapper element to be swapped out of each Page
	 *
	 * @type HTMLElement
	 * @memberof Page
	 */
    public wrapper: HTMLElement;

	/**
	 * Holds the title of each page
	 *
	 * @type string
	 * @memberof Page
	 */
    public title: string;

	/**
	 * Holds the head element of each page
	 *
	 * @type Element
	 * @memberof Page
	 */
    public head: Element;

	/**
	 * Holds the body element of each page
	 *
	 * @type Element
	 * @memberof Page
	 */
    public body: Element;

	/**
	 * The URL of the current page
	 *
	 * @type URL
	 * @memberof Page
	 */
    public url: URL;

	/**
	 * Creates an instance of Page, it also creates a new page from response text, or a Document Object
	 *
	 * @param {URL} [url=newURL()]
	 * @param {(string | Document)} [dom=document]
	 * @memberof Page
	 */
    constructor(url: URL = newURL(), dom: string | Document = document) {
        super();
        this.url = url;
        if (typeof dom === "string") {
            this.dom = PARSER.parseFromString(dom, "text/html");
        } else this.dom = dom || document;

        const { title, head, body } = this.dom;
        this.title = title;
        this.head = head;
        this.body = body;
    }

    /**
     * Runs once the the manager and config have been registered
     *
     * @returns void
     * @memberof Page
     */
    public install(): void {
        this.wrapper = this.body.querySelector(this.getConfig("wrapperAttr"));
    }
}

/**
 * Controls which page to be load
 *
 * @export
 * @class PageManager
 * @extends {AdvancedManager<string, Page>}
 */
export class PageManager extends AdvancedManager<string, Page> {
    /**
     * Stores all URLs that are currently loading
     *
     * @public
     * @type Manager<string, Promise<string>>
     * @memberof PageManager
     */
    public loading: Manager<string, Promise<string>> = new Manager();

	/**
	 * Creates an instance of the PageManager
	 *
     * @param {App} app
	 * @memberof PageManager
	 */
    constructor(app: App) {
        super(app);
        let URLString = newURL().pathname;
        this.set(URLString, new Page());
    }

    /**
     * Returns the loading Manager
     *
     * @returns Manager<string, Promise<string>>
     * @memberof PageManager
     */
    public getLoading(): Manager<string, Promise<string>> {
        return this.loading;
    }

    /**
     * Load from cache or by requesting URL via a fetch request, avoid requesting for the same thing twice by storing the fetch request in "this.loading"
     *
     * @param {(URL | string)} [_url=newURL()]
     * @returns Promise<Page>
     * @memberof PageManager
     */
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
        this.loading.delete(urlString);

        page = new Page(url, response);
        this.set(urlString, page);
        return page;
    }

    /**
     * Starts a fetch request
     *
     * @param {string} url
     * @returns Promise<string>
     * @memberof PageManager
     */
    public async request(url: string): Promise<string> {
        const headers = new Headers(this.getConfig("headers"));
        const timeout = window.setTimeout(() => {
            window.clearTimeout(timeout);
            throw "Request Timed Out!";
        }, this.getConfig("timeout"));

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
