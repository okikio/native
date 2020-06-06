import gulp, { parallel, watch as sentry } from "gulp";

import sass from "gulp-sass";
import stream from "./stream";
import bs from "browser-sync";
import { init, write } from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import nunjuck from "gulp-nunjucks-render";
import ts from "gulp-typescript";
import autoprefixer from "autoprefixer";
import newer from "gulp-newer";

const tsProject = ts.createProject("tsconfig.json");
const browserSync = bs.create();
const { logError } = sass;

export const html = () => {
    return stream("pages/**/*", {
        pipes: [
            newer("docs/*.html"),
            nunjuck({
                path: ["templates/"]
            })
        ],
        dest: "docs",
        end: [browserSync.stream()]
    });
};

export const appCss = () => {
    return stream("sass/app.scss", {
        pipes: [
            // Minify scss to css
            sass({ outputStyle: "compressed" }).on("error", logError)
        ],
        dest: "docs/css",
        end: [browserSync.stream()],
    })
};

export const baseCss = () => {
    return stream("sass/base.scss", {
        pipes: [
            // Minify scss to css
            sass({ outputStyle: "expanded" || "compressed" }).on("error", logError),
            postcss([
                // ...
                autoprefixer,
                // ...
            ]),
        ],
        dest: "docs/css",
        end: [browserSync.stream()],
    })
};

export const js = () => {
    return stream(tsProject.src(), {
        pipes: [
            // Sourcemaps Initialize
            init(),

            // Compile typescript
            tsProject(),

            // Sourcemaps Write
            write('.'),
        ],
        dest: "docs/js"
    })
};

export const watch = () => {
    browserSync.init(
        {
            server: "./",
        },
        (...args) => {
            let [, $this] = args;
            $this.addMiddleware("*", (...args) => {
                let [, res] = args;
                res.writeHead(302, {
                    location: "/docs/404.html",
                });

                res.end("Redirecting!");
            });
        }
    );

    sentry(["templates/**/*", "pages/**/*"], { delay: 1000 }, html);
    sentry(["sass/**/*.scss", "!sass/app.scss"], { delay: 1000 }, baseCss);
    sentry("sass/app.scss", { delay: 1000 }, appCss);
    // sentry("ts/**/*.ts", { delay: 1000 }, js);

    // sentry("docs/**/*.html").on('change', browserSync.reload);
    sentry("docs/js/**/*.js").on('change', browserSync.reload);
};
export default parallel(html, baseCss, appCss, js);