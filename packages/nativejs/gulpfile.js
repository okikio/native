// Import external modules
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const { terser } = require("rollup-plugin-terser");
const { init, write } = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const { rollup } = require("rollup");
const bs = require("browser-sync");
const size = require("gulp-size");
const sass = require("gulp-sass");
const swig = require("gulp-swig");

// Gulp utilities
const { stream, task, parallelFn, watch, tasks, parallel, series, seriesFn } = require('./util');

// Origin folders (source and destination folders)
const srcFolder = `test`;
const destFolder = `docs`;

// Source file folders
const sassFolder = `${srcFolder}/sass`;
const tsFolder = `${srcFolder}/ts`;
const swigFolder = `${srcFolder}/html`;

// Destination file folders
const jsFolder = `${destFolder}/js`;
const cssFolder = `${destFolder}/css`;
const htmlFolder = `${destFolder}`;

// HTML Task
task("html", () => {
    return stream(`${swigFolder}/pages/**/*.html`, {
        pipes: [
            // Compile src html using Swig
            swig()
        ],
        dest: htmlFolder
    });
});

// CSS Tasks
const { logError } = sass;
tasks([
    ["base-css", () => {
        return stream(`${sassFolder}/base/base.scss`, {
            pipes: [
                // Minify scss to css
                sass({ outputStyle: "compressed" }).on("error", logError),
            ],
            dest: cssFolder,
            end: [browserSync.stream()],
        })
    }],

    ["app-css", () => {
        return stream(`${sassFolder}/*.scss`, {
            pipes: [
                // Minify scss to css
                sass({ outputStyle: "compressed" }).on("error", logError)
            ],
            dest: cssFolder,
            end: [browserSync.stream()],
        })
    }],

    ["css", parallelFn("base-css", "app-css")]
]);

// JS Tasks
const tsProject = ts.createProject('tsconfig.json');
task("lib", () => {
    return stream(`src/*.ts`, {
        pipes: [
            // Sourcemaps Initialize
            init(),

            // Compile typescript
            tsProject(),

            // Sourcemaps Write
            write('ts'),
        ],
        dest: "lib"
    });
});

task("js", () => {
    return stream(`${tsFolder}/*.ts`, {
        pipes: [
            // Sourcemaps Initialize
            init(),

            // Compile typescript
            tsProject(),

            // Sourcemaps Write
            write('ts'),
        ],
        dest: jsFolder
    });
});

const date = new Date();
const { name, version, min, cjs, umd, es } = require("./package.json");
const banner = `/*!
 * ${name} v${version}
 * (c) ${date.getFullYear()} Okiki Ojo
 * Released under the MIT license
 */
`;
tasks([
    ["rollup-lib", async () => {
        const bun = await rollup({
            input: `lib/core.js`,
            treeshake: true,
            plugins: [
                ts(),
                nodeResolve(), // Bundle all Modules
            ]
        });

        bun.write({
            banner,
            format: 'es',
            file: es
        });

        bun.write({
            banner,
            format: 'cjs',
            file: cjs
        });

        bun.write({
            banner,
            file: umd,
            format: 'umd',
            name
        });

        return await bun.write({
            banner,
            name,
            format: 'umd',
            file: min,
            plugins: [
                terser({
                    output: {
                        comments: "some"
                    }
                })
            ]
        });
    }],

    ["rollup-js", async () => {
        const bun = await rollup({
            input: `${jsFolder}/framework.js`,
            treeshake: true,
            plugins: [
                ts(),
                nodeResolve({
                    dedupe: ['@okikio/event-emitter', 'managerjs', 'walijs']
                }), // Bundle all Modules
            ]
        });

        return await bun.write({
            format: 'es',
            file: `${jsFolder}/framework.js`,
            plugins: [
                terser({
                    output: {
                        comments: "some"
                    }
                })
            ]
        });
    }],

    ["info", () => {
        return stream(min, {
            pipes: [
                size({ gzip: true })
            ],
            dest: "lib"
        })
    }],

    ["build-js", seriesFn("lib", "rollup-lib", "info", "js", "rollup-js")]
]);


// Build & Watch Tasks
const browserSync = bs.create();
task("build", parallel("html", "css", "build-js"));
task("watch", () => {
    browserSync.init(
        { server: [`./${destFolder}`, `./lib`, `./src`] },
        (_err, bs) => {
            bs.addMiddleware("*", (_req, res) => {
                res.writeHead(302, {
                    location: `/404.html`
                });

                res.end("Redirecting!");
            });
        }
    );

    watch(`${swigFolder}/**/*.html`, series("html"));

    watch(`${sassFolder}/*.scss`, series("app-css"));
    watch(`${sassFolder}/base/*.scss`, series("base-css"));

    watch(`src/*.ts`, series("build-js"));
    watch(`${tsFolder}/*.ts`, series("js", "rollup-js"));
    watch(`${jsFolder}/*.js`).on('change', browserSync.reload);
});

task("default", series("build", "watch"));