import gulp, { parallel, watch as sentry } from "gulp";

import sass from "gulp-sass";
import stream from "./stream";
import bs from "browser-sync";
import { init, write } from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import nunjuck from "gulp-nunjucks-render";
import ts from "gulp-typescript";

const tsProject = ts.createProject("tsconfig.json");
const browserSync = bs.create();
const { logError } = sass;

export const html = () => {
    return stream("pages/*.njk", {
        pipes: [
            nunjuck({
                path: ["templates/"]
            })
        ],
        dest: "docs"
    });
};

export const css = () => {
    return stream("sass/app.scss", {
        pipes: [
            // Minify scss to css
            sass({ outputStyle: "compressed" }).on("error", logError)
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
        { server: "./docs", },
        (...args) => {
            let [, $this] = args;
            $this.addMiddleware("*", (...args) => {
                let [, res] = args;
                res.writeHead(302, {
                    location: "/404.html",
                });

                res.end("Redirecting!");
            });
        }
    );
    sentry(["templates/**/*.njk", "pages/*.njk"], { delay: 1000 }, html);
    sentry("sass/**/*.scss", { delay: 1000 }, css);
    // sentry("ts/**/*.ts", { delay: 1000 }, js);

    sentry("docs/**/*.html").on('change', browserSync.reload);
    // sentry("docs/**/*.js").on('change', browserSync.reload);
};
export default parallel(html, css, js);