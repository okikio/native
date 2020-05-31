import gulp from "gulp";
import sass from "gulp-sass";
import stream from "./stream";
import bs from "browser-sync";
import postcss from "gulp-postcss";
import nunjuck from "gulp-nunjucks-render";

const { series, watch: sentry } = gulp;
const browserSync = bs.create();
// const { task, src, dest, watch } = require("gulp");
// const nunjucks = require("gulp-nunjucks-render");
// const sass = require("gulp-sass");

// let { logError } = sass;

// task("sass", () => {
//     return src("sass/*.scss")
//         .pipe(// Minify scss to css
//             sass({ outputStyle: dev ? "expanded" : "compressed" }).on(
//                 "error",
//                 logError
//             ),)
//         .pipe(dest("docs"));
// });

export const nunjucks = () => {
    return stream("pages/*.njk", {
        pipes: [
            nunjuck({
                path: ["templates/"]
            })
        ],
        dest: "docs"
    });
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
    sentry(["templates/**/*.njk", "pages/*.njk"], { delay: 1000 }, nunjucks);
    sentry("docs/**/*.html").on('change', browserSync.reload);
};
export default nunjucks;