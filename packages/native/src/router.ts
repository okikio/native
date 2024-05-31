import { Service } from "./service";
import { Manager } from "./manager";
import { newURL, getHashedPath } from "./url";
import { Path, pathToRegexp } from "path-to-regexp";
import "urlpattern-polyfill";

import type { IHistoryManager } from "./history";

export type TypeRouteMethod = (...args: any) => any;
export type TypeRouteStyle = string | RegExp | boolean | TypeRouteStyle[];
export interface IRouteToFrom {
    to?: TypeRouteStyle,
    from?: TypeRouteStyle
}

export type TypeRoutePath = IRouteToFrom & ({ to: TypeRouteStyle } | { from: TypeRouteStyle }) | TypeRouteStyle;
export interface IRoute {
    path: TypeRoutePath,
    method: TypeRouteMethod
}

/** Controls what happens when certain url paths match a set of criteria */
export class Router extends Service {
    /** List of routes */
    protected routes: Manager<IRouteToFrom, TypeRouteMethod>;
    constructor(routes: IRoute[] = []) {
        super();
        this.routes = new Manager();
        for (let route of routes) {
            this.add(route);
        }
    }

    /** Add a new route to watch for */
    public add({ path, method }: IRoute): Router {
        let key = this.parse(path);
        this.routes.set(key, method);
        return this;
    }

    /** Convert strings into path match functions */
    public parsePath(path: TypeRouteStyle): RegExp | boolean {
        if (typeof path === "string" || path instanceof RegExp || Array.isArray(path)) {
            let _keys = [];
            return pathToRegexp(path as Path, _keys, {
                start: false,
                end: false
            });
        } else if (typeof path === "boolean")
            return path ? /.*/ : path;

        throw "[Router] only regular expressions, strings, booleans and arrays of regular expressions and strings are accepted as paths.";
    }

    /** Determines if a strings counts has a path */
    public isPath(input: TypeRouteStyle): boolean {
        return (
            typeof input === "string" ||
            input instanceof RegExp ||
            typeof input === "boolean" ||
            Array.isArray(input)
        );
    }

    /** Parse the multiple different formats for paths, into a { from, to } object */
    public parse(input: TypeRoutePath): IRouteToFrom {
        let route = input as IRouteToFrom;
        let toFromPath: IRouteToFrom = {
            from: /.*/,
            to: /.*/,
        };

        if (this.isPath(input as TypeRouteStyle))
            toFromPath = {
                from: true,
                to: input as TypeRouteStyle,
            };
        else if (this.isPath(route.from) && this.isPath(route.to as TypeRouteStyle))
            toFromPath = Object.assign({}, toFromPath, route);
        else
            throw "[Router] path is neither a string, regular expression, or a { from, to } object.";

        let { from, to } = toFromPath;
        return {
            from: this.parsePath(from),
            to: this.parsePath(to),
        };
    }

    /** Test if route paths are true, if so run their methods */
    public route() {
        if (this.manager.has("HistoryManager")) {
            let history = this.manager.get("HistoryManager") as IHistoryManager;
            let from: string = getHashedPath(newURL((history.length > 1 ? history.previous : history.current).url));
            let to: string = getHashedPath(newURL());

            this.routes.forEach((method: TypeRouteMethod, path: IRouteToFrom) => {
                let fromRegExp = path.from as RegExp | boolean;
                let toRegExp = path.to as RegExp | boolean;

                if (
                    typeof fromRegExp === "boolean" &&
                    typeof toRegExp === "boolean"
                )
                    throw `[Router] path ({ from: ${fromRegExp}, to: ${toRegExp} }) is not valid, remember paths can only be strings, regular expressions, or a boolean; however, both the from and to paths cannot be both booleans.`;

                let fromParam: RegExpExecArray | RegExp | boolean = fromRegExp;
                let toParam: RegExpExecArray | RegExp | boolean = toRegExp;

                if (fromRegExp instanceof RegExp && fromRegExp.test(from))
                    fromParam = fromRegExp.exec(from);

                if (toRegExp instanceof RegExp && toRegExp.test(to))
                    toParam = toRegExp.exec(to);

                // If fromParam or toParam are `false`, then negate the other param's RegEx
                if (
                    (Array.isArray(toParam) && Array.isArray(fromParam)) ||
                    (Array.isArray(toParam) &&
                        fromParam == false && !(toRegExp as RegExp).test(from)) ||
                    (Array.isArray(fromParam) &&
                        toParam == false && !(fromRegExp as RegExp).test(to))
                )
                    method({
                        from: fromParam,
                        to: toParam,
                        path: { from, to }
                    });
            });
        } else {
            console.warn("[Route] HistoryManager is missing.");
        }
    }

    /** Add listeners for PJAX Events */
    public initEvents() {
        this.emitter.on("READY", this.route, this);
        this.emitter.on("CONTENT_REPLACED", this.route, this);
    }

    /** Remove listeners for PJAX Events */
    public stopEvents() {
        this.emitter.off("READY", this.route, this);
        this.emitter.off("CONTENT_REPLACED", this.route, this);
    }
}
