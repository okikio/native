// Import external modules
const mode = process.argv.includes("--watch") ? "watch" : "build";

// Gulp utilities
const { stream, task, watch, parallel, series } = require("./util");

// Origin folders (source and destination folders)
const srcFolder = `build`;
const destFolder = `demo`;

// Source file folders
const tsFolder = `${srcFolder}/ts`;
const sassFolder = `${srcFolder}/sass`;
const pugFolder = `${srcFolder}/pug`;

// Destination file folders
const jsFolder = `${destFolder}/js`;
const cssFolder = `${destFolder}/css`;
const htmlFolder = `${destFolder}`;

let browserSync;

// HTML Tasks
task("html", async () => {
    const [{ default: pug }, { default: plumber }] = await Promise.all([
        import("gulp-pug"),
        import("gulp-plumber"),
    ]);
    return stream(`${pugFolder}/*.pug`, {
        pipes: [
            plumber(),
            pug({
                basedir: pugFolder,
                self: true,
            }),
        ],
        dest: htmlFolder,
    });
});

// CSS Tasks
task("css", async () => {
    const { default: sass } = await import("gulp-sass");
    const { logError } = sass;
    return stream(`${sassFolder}/**/*.scss`, {
        pipes: [
            // Minify scss to css
            sass({ outputStyle: "compressed" }).on("error", logError),
        ],
        dest: cssFolder,
        end: browserSync ? [browserSync.stream()] : null,
    });
});

// JS Tasks
task("js", async () => {
    const [
        { default: gulpEsBuild, createGulpEsbuild },
        { default: gzipSize },
        { default: prettyBytes },
        { default: rename },
    ] = await Promise.all([
        import("gulp-esbuild"),
        import("gzip-size"),
        import("pretty-bytes"),
        import("gulp-rename"),
    ]);

    const esbuild = gulpEsBuild; // mode == "watch" ? createGulpEsbuild() :
    return stream(`${tsFolder}/*.ts`, {
        pipes: [
            // Bundle Modules
            esbuild({
                bundle: true,
                format: "esm",
                target: ["chrome71"],
            }),
            rename({ extname: ".js" }), // Rename
        ],
        dest: jsFolder, // Output
        async end() {
            console.log(
                `=> Gzip size - ${prettyBytes(
                    await gzipSize.file(`${jsFolder}/main.js`)
                )}\n`
            );
        },
    });
});

// Build & Watch Tasks
task("build", parallel("html", "css", "js"));
task("watch", async () => {
    const { default: bs } = await import("browser-sync");
    browserSync = bs.create();
    browserSync.init(
        {
            server: destFolder,
            serveStatic: [
                {
                    route: "/lib",
                    dir: ["./lib"],
                },
            ],
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
    watch(`${sassFolder}/**/*.scss`, series("css"));
    watch(
        [
            `${tsFolder}/**/*.ts`,
            `packages/native/src/**/*.ts`,
            `packages/animate/src/**/*.ts`,
            `packages/manager/src/**/*.ts`,
            `packages/emitter/src/**/*.ts`,
        ],
        series("js")
    );

    watch([`${htmlFolder}/**/*.html`, `${jsFolder}/**/*.js`]).on(
        "change",
        browserSync.reload
    );
});

task("default", series("build", "watch"));
