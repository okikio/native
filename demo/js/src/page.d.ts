import { Manager, ManagerItem, AdvancedManager } from "./manager";
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
     * @type Document
     * @memberof Page
     */
    dom: Document;
    /**
     * Holds the wrapper element to be swapped out of each Page
     *
     * @type HTMLElement
     * @memberof Page
     */
    wrapper: HTMLElement;
    /**
     * Holds the title of each page
     *
     * @type string
     * @memberof Page
     */
    title: string;
    /**
     * Holds the head element of each page
     *
     * @type Element
     * @memberof Page
     */
    head: Element;
    /**
     * Holds the body element of each page
     *
     * @type Element
     * @memberof Page
     */
    body: Element;
    /**
     * The URL of the current page
     *
     * @type URL
     * @memberof Page
     */
    url: URL;
    /**
     * Creates an instance of Page, it also creates a new page from response text, or a Document Object
     *
     * @param {URL} [url=newURL()]
     * @param {(string | Document)} [dom=document]
     * @memberof Page
     */
    constructor(url?: URL, dom?: string | Document);
    /**
     * Runs once the the manager and config have been registered
     *
     * @returns void
     * @memberof Page
     */
    install(): void;
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
    loading: Manager<string, Promise<string>>;
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
     * @param {(URL | string)} [_url=newURL()]
     * @returns Promise<Page>
     * @memberof PageManager
     */
    load(_url?: URL | string): Promise<Page>;
    /**
     * Starts a fetch request
     *
     * @param {string} url
     * @returns Promise<string>
     * @memberof PageManager
     */
    request(url: string): Promise<string>;
}
