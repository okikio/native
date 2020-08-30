import { Service } from "./service";
import { Manager } from "./manager";
import { _URL } from "./url";

export type RouteMethod = (...args: any) => any;
export type RouteStyle = string | RegExp | boolean;
export interface IRouteToFrom {
    to: RouteStyle,
    from: RouteStyle
}
export type RoutePath = IRouteToFrom | RouteStyle;
export interface IRoute {
    path: RoutePath,
    method: RouteMethod
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
     * @type {Manager<IRouteToFrom, RouteMethod>}
     * @memberof Router
     */
    protected routes: Manager<IRouteToFrom, RouteMethod>;

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
     * @param {RouteStyle} path
     * @returns {RegExp | boolean}
     * @memberof Router
     */
    public parsePath(path: RouteStyle): RegExp | boolean {
        if (typeof path === "string")
            return new RegExp(path, "i");
        else if (path instanceof RegExp || typeof path === "boolean")
            return path;
        throw "[Router] only regular expressions, strings and booleans are accepted as paths.";
    }

    /**
     * Determines if a strings counts has a path
     *
     * @param {RouteStyle} input
     * @returns boolean
     * @memberof Router
     */
    public isPath(input: RouteStyle): boolean {
        return typeof input === "string" || input instanceof RegExp || typeof input === "boolean";
    }

    /**
     * Parse the multiple different formats for paths, into a { from, to } object
     *
     * @param {RouteStyle} input
     * @returns {IRouteToFrom}
     * @memberof Router
     */
    public parse(input: RoutePath): IRouteToFrom {
        let route = (input as IRouteToFrom);
        let toFromPath: IRouteToFrom = {
            from: /(.*)/g,
            to: /(.*)/g
        };

        if (this.isPath(input as RouteStyle))
            toFromPath = {
                from: true,
                to: input as RouteStyle
            };
        else if (this.isPath(route.from) && this.isPath(route.to as RouteStyle))
            toFromPath = route;
        else
            throw "[Router] path is neither a string, regular expression, or a { from, to } object.";

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
        let from: string = this.HistoryManager[this.HistoryManager.size > 1 ? "prev" : "last"]().getURL().getFullPath();
        let to: string = new _URL().getFullPath();

        this.routes.forEach((method: RouteMethod, path: IRouteToFrom) => {
            let fromRegExp = (path.from as RegExp | boolean);
            let toRegExp = (path.to as RegExp | boolean);

            if (typeof fromRegExp === "boolean" && typeof toRegExp === "boolean") {
                throw `[Router] path ({ from: ${fromRegExp}, to: ${toRegExp} }) is not valid, remember paths can only be strings, regular expressions, or a boolean; however, both the from and to paths cannot be both booleans.`;
            }

            let fromParam: RegExpExecArray | RegExp | boolean = fromRegExp;
            let toParam: RegExpExecArray | RegExp | boolean = toRegExp;

            if (fromRegExp instanceof RegExp && fromRegExp.test(from))
                fromParam = fromRegExp.exec(from);
            if (toRegExp instanceof RegExp && toRegExp.test(to))
                toParam = toRegExp.exec(to);

            if (
                (Array.isArray(toParam) && Array.isArray(fromParam)) ||
                (Array.isArray(toParam) && (typeof fromParam == "boolean" && fromParam)) ||
                (Array.isArray(fromParam) && (typeof toParam == "boolean" && toParam))
            ) method({ from: fromParam, to: toParam, path: { from, to } });
        });
    }

    /**
     * Add listeners for PJAX Events
     *
     * @memberof Router
     */
    public initEvents() {
        this.EventEmitter.on("READY", this.route, this);
        this.EventEmitter.on("CONTENT_REPLACED", this.route, this);
    }

    /**
     * Remove listeners for PJAX Events
     *
     * @memberof Router
     */
    public stopEvents() {
        this.EventEmitter.off("READY", this.route, this);
        this.EventEmitter.off("CONTENT_REPLACED", this.route, this);
    }
}
