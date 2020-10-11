// Import external modules
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const esbuild = require("rollup-plugin-esbuild");
const { rollup } = require("rollup");

// const postcss = require("gulp-postcss");
const bs = require("browser-sync");

const sass = require("gulp-sass");
const swig = require("gulp-swig");

// Gulp utilities
const {
    stream,
    tasks,
    task,
    watch,
    parallel,
    series,
    parallelFn,
} = require("../../util");

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
        end: browserSync.reload,
    });
});

// CSS Tasks
const { logError } = sass;
task("css", () => {
    return stream(`${sassFolder}/**/*.scss`, {
        pipes: [sass({ outputStyle: "compressed" }).on("error", logError)],
        dest: cssFolder,
        end: [browserSync.stream()],
    });
});

// JS Tasks
// Rollup warnings are annoying
let ignoreLog = [
    "CIRCULAR_DEPENDENCY",
    "UNRESOLVED_IMPORT",
    "EXTERNAL_DEPENDENCY",
    "THIS_IS_UNDEFINED",
];
let onwarn = ({ loc, message, code, frame }, warn) => {
    if (ignoreLog.indexOf(code) > -1) return;
    if (loc) {
        warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`);
        if (frame) warn(frame);
    } else warn(message);
};

let js = (watching) => {
    return async () => {
        const bundle = await rollup({
            input: `${tsFolder}/main.ts`,
            treeshake: true,
            preserveEntrySignatures: false,
            plugins: [
                nodeResolve(),
                esbuild({
                    watch: watching,
                    target: "es2020", // default, or 'es20XX', 'esnext'
                }),
            ],
            onwarn,
        });

        await bundle.write({
            format: "es",
            file: `${jsFolder}/main.js`,
        });

        return new Promise((resolve) => {
            browserSync.reload();
            resolve();
        });
    };
};

task("js", js());

// Build & Watch Tasks
const browserSync = bs.create();
task("build", parallel("html", "css", "js"));
task("watch", () => {
    browserSync.init(
        {
            notify: false,
            server: destFolder,
            // middleware: [
            //     logger({
            //         format: "%date %status %method %url -- %time",
            //     }),
            // ],
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

    watch(`${swigFolder}/**/*.html`, series("html"));
    watch(`${sassFolder}/**/*.scss`, series("css"));
    watch([`${tsFolder}/**/*.ts`, `src/*.ts`, `../**/src/*.ts`], js(true));
});

task("default", series("build", "watch"));
