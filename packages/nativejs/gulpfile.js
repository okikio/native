// Import external modules
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const { terser } = require("rollup-plugin-terser");
const { init, write } = require("gulp-sourcemaps");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const ts = require("gulp-typescript");
const { rollup } = require("rollup");
const bs = require("browser-sync");
const sass = require("gulp-sass");
const swig = require("gulp-swig");

// Gulp utilities
const { stream, task, parallelFn, watch, tasks, parallel, series } = require('./util');

// Origin folders (source and destination folders)
const srcFolder = `src`;
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
                postcss([
                    // ...
                    autoprefixer,
                    // ...
                ]),
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
task("js", () => {
    return stream(tsProject.src(), {
        pipes: [
            // Sourcemaps Initialize
            // init(),

            // Compile typescript
            tsProject(),

            // Sourcemaps Write
            // write('ts'),
        ],
        dest: jsFolder
    });
});

task("web-js", async () => {
    const bun = await rollup({
        input: `${jsFolder}/modules.js`,
        treeshake: true,
        plugins: [
            ts(),
            nodeResolve(), // Bundle all Modules
        ]
    });

    return await bun.write({
        format: 'es',
        file: `${jsFolder}/modules.js`,
        // plugins: [
        //     terser({
        //         output: {
        //             comments: "some"
        //         }
        //     })
        // ]
    });
});


// Build & Watch Tasks
const browserSync = bs.create();
task("build", parallel("html", "css", series("js", "web-js")));
task("watch", () => {
    browserSync.init(
        { server: `./${destFolder}` },
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

    watch([`${sassFolder}/blocks/*.scss`, `${sassFolder}/*.scss`], series("app-css"));
    watch(`${sassFolder}/base/*.scss`, series("base-css"));

    watch(`${tsFolder}/*.ts`, series("js", "web-js"));
    watch(`${jsFolder}/*.js`).on('change', browserSync.reload);
});

task("default", series("build", "watch"));