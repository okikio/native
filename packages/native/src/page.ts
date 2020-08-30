import { Manager, ManagerItem, AdvancedManager } from "./manager";
import { _URL } from "./url";
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
	 * @private
	 * @type Document
	 * @memberof Page
	 */
    private dom: Document;

	/**
	 * Holds the wrapper element to be swapped out of each Page
	 *
	 * @private
	 * @type HTMLElement
	 * @memberof Page
	 */
    private wrapper: HTMLElement;

	/**
	 * Holds the title of each page
	 *
	 * @private
	 * @type string
	 * @memberof Page
	 */
    private title: string;

	/**
	 * Holds the head element of each page
	 *
	 * @private
	 * @type Element
	 * @memberof Page
	 */
    private head: Element;

	/**
	 * Holds the body element of each page
	 *
	 * @private
	 * @type Element
	 * @memberof Page
	 */
    private body: Element;

	/**
	 * The URL of the current page
	 *
	 * @private
	 * @type _URL
	 * @memberof Page
	 */
    private url: _URL;

	/**
	 * Creates an instance of Page, it also creates a new page from response text, or a Document Object
	 *
	 * @param {_URL} [url=new _URL()]
	 * @param {(string | Document)} [dom=document]
	 * @memberof Page
	 */
    constructor(url: _URL = new _URL(), dom: string | Document = document) {
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

	/**
	 * Returns the current page's URL
	 *
	 * @returns _URL
	 * @memberof Page
	 */
    public getURL(): _URL {
        return this.url;
    }

	/**
	 * Returns the current page's URL
	 *
	 * @returns string
	 * @memberof Page
	 */
    public getPathname(): string {
        return this.url.pathname;
    }

	/**
	 * The page title
	 *
	 * @returns string
	 * @memberof Page
	 */
    public getTitle(): string {
        return this.title;
    }

	/**
	 * The page's head element
	 *
	 * @returns Element
	 * @memberof Page
	 */
    public getHead(): Element {
        return this.head;
    }

	/**
	 * The page's body element
	 *
	 * @returns Element
	 * @memberof Page
	 */
    public getBody(): Element {
        return this.body;
    }

	/**
	 * The page's wrapper element
	 *
	 * @returns HTMLElement
	 * @memberof Page
	 */
    public getWrapper(): HTMLElement {
        return this.wrapper;
    }

	/**
	 * The page's document
	 *
	 * @returns Document
	 * @memberof Page
	 */
    public getDOM(): Document {
        return this.dom;
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
     * @protected
     * @type Manager<string, Promise<string>>
     * @memberof PageManager
     */
    protected loading: Manager<string, Promise<string>> = new Manager();

	/**
	 * Creates an instance of the PageManager
	 *
     * @param {App} app
	 * @memberof PageManager
	 */
    constructor(app: App) {
        super(app);
        let URLString = new _URL().pathname;
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
     * @param {(_URL | string)} [_url=new _URL()]
     * @returns Promise<Page>
     * @memberof PageManager
     */
    public async load(_url: _URL | string = new _URL()): Promise<Page> {
        let url: _URL = _url instanceof URL ? _url : new _URL(_url);
        let urlString: string = url.getPathname();
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
                headers: headers,
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
