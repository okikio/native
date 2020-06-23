import { match, MatchFunction } from "path-to-regexp";
import { Service } from "./service";
import { Manager } from "./manager";

export type RouteMethod = (...args: any) => any;
export interface IRouteToFrom {
    to: string,
    from: string
}
export interface IRoute {
    path: IRouteToFrom | string,
    method: RouteMethod
}
export interface IRoutePath {
    to: MatchFunction<object>,
    from: MatchFunction<object>
}

/**
 * Controls what happens when certain url paths match a set of criteria
 *
 * @export
 * @class Router
 * @extends {Service}
 */
export class Router extends Service {
    /**
     * List of routes inputted
     *
     * @protected
     * @type {Manager<IRoutePath, RouteMethod>}
     * @memberof Router
     */
    protected routes: Manager<IRoutePath, RouteMethod>;

    /**
     * Creates an instance of Router.
     * 
     * @param {Array<IRoute>} [routes=[]]
     * @memberof Router
     */
    constructor(routes: IRoute[] = []) {
        super();
        this.routes = new Manager();
        for (const route of routes) {
            this.add(route);
        }
    }

    /**
     * Add a new route to watch for
     *
     * @param {IRoute} { path, method }
     * @returns {Router}
     * @memberof Router
     */
    public add({ path, method }: IRoute): Router {
        const key = this.parse(path);
        this.routes.set(key, method);
        return this;
    }

    /**
     * Convert strings into path match functions
     *
     * @param {string} path
     * @returns {MatchFunction<object>}
     * @memberof Router
     */
    public parsePath(path: string): MatchFunction<object> {
        if (typeof path === "string")
            return match(path, { decode: decodeURIComponent });
        throw "[Router] only strings are accepted as paths.";
    }

    /**
     * Determines if a strings counts has a path
     *
     * @param {string} input
     * @returns boolean
     * @memberof Router
     */
    public isPath(input: string): boolean {
        return typeof input === "string";
    }

    /**
     * Parse the multiple different formats for paths, into a { from, to } object
     *
     * @param {*} input
     * @returns {IRoutePath}
     * @memberof Router
     */
    public parse(input: any): IRoutePath {
        let toFromPath: IRouteToFrom = {
            from: "(.*)",
            to: "(.*)"
        };

        if (this.isPath(input))
            toFromPath = {
                from: input,
                to: "(.*)"
            };
        else if (this.isPath(input.from) && this.isPath(input.to))
            toFromPath = input;
        else
            throw "[Router] path is neither a string, or a { from, to } object.";

        let { from, to } = toFromPath;
        return {
            from: this.parsePath(from),
            to: this.parsePath(to)
        }
    }

    /**
     * Test if route paths are true, if so run their methods
     *
     * @memberof Router
     */
    public route() {
        let from: string = this.HistoryManager.last().getURLPathname();
        let to: string = window.location.pathname;

        this.routes.forEach((method: RouteMethod, path: IRoutePath) => {
            let fromMatch = path.from(from);
            let toMatch = path.to(to);

            if (fromMatch && toMatch) {
                method({ from: fromMatch, to: toMatch });
            }
        });
    }

    /**
     * Add listeners for PJAX Events
     *
     * @memberof Router
     */
    public initEvents() {
        this.route = this.route.bind(this);
        this.EventEmitter.on("READY", this.route);
        this.EventEmitter.on("PAGE-LOADING", this.route);
    }
}