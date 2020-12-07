// Import external modules
const mode = process.argv.includes("--watch") ? "watch" : "build";
const bs = require("browser-sync");

const sass = require("gulp-sass");
const pug = require("gulp-pug");
const gulpEsBuild = require("gulp-esbuild");
const { createGulpEsbuild } = gulpEsBuild;
const esbuild = mode == "watch" ? createGulpEsbuild() : gulpEsBuild;

// Gulp utilities
const { stream, task, watch, parallel, series } = require("../../util");

// Origin folders (source and destination folders)
const srcFolder = `build-src`;
const destFolder = `docs`;

// Source file folders
const tsFolder = `${srcFolder}/ts`;
const sassFolder = `${srcFolder}/sass`;
const pugFolder = `${srcFolder}/pug`;

// Destination file folders
const jsFolder = `${destFolder}/js`;
const cssFolder = `${destFolder}/css`;
const htmlFolder = `${destFolder}`;

// HTML Tasks
task("html", () => {
    return stream(`${pugFolder}/*.pug`, {
        pipes: [
            pug({
                basedir: pugFolder,
                self: true,
            }),
        ],
        dest: htmlFolder,
    });
});

// CSS Tasks
const { logError } = sass;
task("css", () => {
    return stream(`${sassFolder}/**/*.scss`, {
        pipes: [
            // Minify scss to css
            sass({ outputStyle: "compressed" }).on("error", logError),
        ],
        dest: cssFolder,
        end: [browserSync.stream()],
    });
});

// JS Tasks
task("js", () => {
    return stream(`${tsFolder}/main.ts`, {
        pipes: [
            // Bundle Modules
            esbuild({
                bundle: true,
                minify: true,
                sourcemap: true,
                outfile: "main.js",
                format: "esm",
                target: ["chrome71"],
            }),
        ],
        dest: jsFolder, // Output
    });
});

// Build & Watch Tasks
const browserSync = bs.create();
task("build", parallel("html", "css", "js"));
task("watch", () => {
    browserSync.init(
        {
            server: destFolder,
        },
        (_err, bs) => {
            bs.addMiddleware("*", (_req, res) => {
                res.writeHead(302, {
                    location: `/404.html`,
                });
                res.end();
            });
        }
    );

    watch(`${pugFolder}/**/*.pug`, series("html"));
    watch(`${sassFolder}/*.scss`, series("css"));
    watch([`${tsFolder}/**/*.ts`, `src/*.ts`], series("js"));

    watch([`${htmlFolder}/**/*.html`, `${jsFolder}/**/*.js`]).on(
        "change",
        browserSync.reload
    );
});

task("default", series("build", "watch"));
