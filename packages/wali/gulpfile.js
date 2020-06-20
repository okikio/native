// Import external modules
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const { terser } = require("rollup-plugin-terser");
const ts = require("gulp-typescript");
const { rollup } = require("rollup");
const size = require("gulp-size");

const bs = require("browser-sync");
const sass = require("gulp-sass");
const swig = require("gulp-swig");

// Gulp utilities
const { stream, task, watch, parallel, series } = require('./util');

// Origin folders (source and destination folders)
const srcFolder = `docs`;
const destFolder = `test`;

// Source file folders
const libFolder = `lib`;
const jsFolder = `${srcFolder}/js`;
const sassFolder = `${srcFolder}/sass`;
const swigFolder = `${srcFolder}/html`;

// Destination file folders
const jsDestFolder = `${destFolder}/js`;
const cssFolder = `${destFolder}/css`;
const htmlFolder = `${destFolder}`;

// HTML Tasks
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
task("css", () => {
    return stream(`${sassFolder}/*.scss`, {
        pipes: [
            // Minify scss to css
            sass({ outputStyle: "compressed" }).on("error", logError)
        ],
        dest: cssFolder,
        end: [browserSync.stream()],
    })
});

// JS Tasks
const tsProject = ts.createProject('tsconfig.json');
task("ts", () => {
    return stream(tsProject.src(), {
        pipes: [
            // Compile typescript
            tsProject(),
        ],
        dest: libFolder
    });
});

const date = new Date();
const { name, version, main, min, cjs, umd, es } = require("./package.json");
const banner = `/*!
 * ${name} v${version}
 * (c) ${date.getFullYear()} Okiki Ojo
 * Released under the MIT license
 */
`;

task("js", async () => {
    const bun = await rollup({
        input: 'lib/api.js',
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
});

task("info", () => {
    return stream(min, {
        pipes: [
            size({ gzip: true })
        ],
        dest: libFolder
    })
});

task("test-js", async () => {
    const bun = await rollup({
        input: `${jsFolder}/app.js`,
        treeshake: true,
        plugins: [
            ts(),
            nodeResolve(), // Bundle all Modules
        ]
    });

    return await bun.write({
        format: 'es',
        file: `${jsDestFolder}/app.js`,
    });
});

// Build & Watch Tasks
const browserSync = bs.create();
task("build-js", series("ts", "js", parallel("info", "test-js")));
task("build", parallel("html", "css", "build-js"));
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
    watch([`${sassFolder}/*.scss`], series("css"));

    watch([`src/*.ts`, `docs/js/app.js`], series("build-js"));
    watch(`${jsDestFolder}/*.js`).on('change', browserSync.reload);
    watch(`${htmlFolder}/*.html`).on('change', browserSync.reload);
});

task("default", series("build", "watch"));