import { Manager, ManagerItem, AdvancedManager } from "./manager";
import { _URL } from "./url";
import { App } from "./app";
/**
 * Parses strings to DOM
 */
export declare const PARSER: DOMParser;
/**
 * A page represents the DOM elements that create each page
 *
 * @export
 * @class Page
 */
export declare class Page extends ManagerItem {
    /**
     * Holds the DOM of the current page
     *
     * @private
     * @type Document
     * @memberof Page
     */
    private dom;
    /**
     * Holds the wrapper element to be swapped out of each Page
     *
     * @private
     * @type HTMLElement
     * @memberof Page
     */
    private wrapper;
    /**
     * Holds the title of each page
     *
     * @private
     * @type string
     * @memberof Page
     */
    private title;
    /**
     * Holds the head element of each page
     *
     * @private
     * @type Element
     * @memberof Page
     */
    private head;
    /**
     * Holds the body element of each page
     *
     * @private
     * @type Element
     * @memberof Page
     */
    private body;
    /**
     * The URL of the current page
     *
     * @private
     * @type _URL
     * @memberof Page
     */
    private url;
    /**
     * Creates an instance of Page, it also creates a new page from response text, or a Document Object
     *
     * @param {_URL} [url=new _URL()]
     * @param {(string | Document)} [dom=document]
     * @memberof Page
     */
    constructor(url?: _URL, dom?: string | Document);
    /**
     * Runs once the the manager and config have been registered
     *
     * @returns void
     * @memberof Page
     */
    install(): void;
    /**
     * Returns the current page's URL
     *
     * @returns _URL
     * @memberof Page
     */
    getURL(): _URL;
    /**
     * Returns the current page's URL
     *
     * @returns string
     * @memberof Page
     */
    getPathname(): string;
    /**
     * The page title
     *
     * @returns string
     * @memberof Page
     */
    getTitle(): string;
    /**
     * The page's head element
     *
     * @returns Element
     * @memberof Page
     */
    getHead(): Element;
    /**
     * The page's body element
     *
     * @returns Element
     * @memberof Page
     */
    getBody(): Element;
    /**
     * The page's wrapper element
     *
     * @returns HTMLElement
     * @memberof Page
     */
    getWrapper(): HTMLElement;
    /**
     * The page's document
     *
     * @returns Document
     * @memberof Page
     */
    getDOM(): Document;
}
/**
 * Controls which page to be load
 *
 * @export
 * @class PageManager
 * @extends {AdvancedManager<string, Page>}
 */
export declare class PageManager extends AdvancedManager<string, Page> {
    /**
     * Stores all URLs that are currently loading
     *
     * @public
     * @type Manager<string, Promise<string>>
     * @memberof PageManager
     */
    public loading: Manager<string, Promise<string>>;
    /**
     * Creates an instance of the PageManager
     *
     * @param {App} app
     * @memberof PageManager
     */
    constructor(app: App);
    /**
     * Returns the loading Manager
     *
     * @returns Manager<string, Promise<string>>
     * @memberof PageManager
     */
    getLoading(): Manager<string, Promise<string>>;
    /**
     * Load from cache or by requesting URL via a fetch request, avoid requesting for the same thing twice by storing the fetch request in "this.loading"
     *
     * @param {(_URL | string)} [_url=new _URL()]
     * @returns Promise<Page>
     * @memberof PageManager
     */
    load(_url?: _URL | string): Promise<Page>;
    /**
     * Starts a fetch request
     *
     * @param {string} url
     * @returns Promise<string>
     * @memberof PageManager
     */
    request(url: string): Promise<string>;
}
