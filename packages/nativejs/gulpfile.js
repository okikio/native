// Import external modules
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const ts = require("rollup-plugin-typescript2");
const { rollup } = require("rollup");

const bs = require("browser-sync");
const sass = require("gulp-sass");
const swig = require("gulp-swig");

// Gulp utilities
const { stream, task, watch, parallel, series } = require("./util");

// Origin folders (source and destination folders)
const srcFolder = `build`;
const destFolder = `docs`;

// Source file folders
const tsFolder = `${srcFolder}/ts`;
const sassFolder = `${srcFolder}/sass`;
const swigFolder = `${srcFolder}/html`;

// Destination file folders
const jsFolder = `${destFolder}/js`;
const cssFolder = `${destFolder}/css`;
const htmlFolder = `${destFolder}`;

// HTML Tasks
task("html", () => {
    return stream(`${swigFolder}/pages/**/*.html`, {
        pipes: [
            // Compile src html using Swig
            swig({
                defaults: { cache: false },
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
task("js", async () => {
    const bun = await rollup({
        input: `${tsFolder}/framework.ts`,
        treeshake: true,
        plugins: [
            ts({
                tsconfigOverride: {
                    compilerOptions: {
                        declaration: false,
                    },
                },
            }),
            nodeResolve({
                dedupe: ["@okikio/event-emitter", "managerjs", "walijs"],
            }), // Bundle all Modules
        ],
    });

    return await bun.write({
        format: "es",
        sourcemap: true,
        file: `${jsFolder}/framework.js`,
    });
});

// Build & Watch Tasks
const browserSync = bs.create();
task("build", parallel("html", "css", "js"));
task("watch", () => {
    browserSync.init(
        { server: [`./${destFolder}`, `./lib`, `./src`] },
        (_err, bs) => {
            bs.addMiddleware("*", (_req, res) => {
                res.writeHead(302, {
                    location: `/404.html`,
                });

                res.end("Redirecting!");
            });
        }
    );

    watch(`${swigFolder}/**/*.html`, series("html"));
    watch(`${sassFolder}/*.scss`, series("css"));
    watch(`${tsFolder}/*.ts`, series("js"));

    watch([`${jsFolder}/*.js`, `src/*.ts`]).on("change", browserSync.reload);
    watch(`${htmlFolder}/*.html`).on("change", browserSync.reload);
});

task("default", series("build", "watch"));
