const { task, src, series, dest, watch, parallel } = require("gulp");
const nunjucks = require("gulp-nunjucks-render");

task("default", () => {
    return src("pages/**.njk")
        .pipe(nunjucks({
            path: ["templates/"]
        }))
        .pipe(dest("docs"));
});

task("watch", () => {
    watch(["templates/**/*.njk", "pages/*.njk"], { delay: 1000 }, series("default"));
});