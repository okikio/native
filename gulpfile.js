// Import external modules
const mode = process.argv.includes("--watch") ? "watch" : "build";

// Gulp utilities
import { watch, task, series, parallel, stream, tasks, parallelFn } from "./util.js";

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

// Main ts file bane
const tsFile = `main.ts`;

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
    const [
        { default: postcss },
        { default: tailwind },
        { default: scss },
        { default: sass },
        { default: rename }
    ] = await Promise.all([
        import("gulp-postcss"),
        import("tailwindcss"),
        import("postcss-scss"),
        import("@csstools/postcss-sass"),
        import("gulp-rename")
    ]);

    return stream(`${sassFolder}/**/*.scss`, {
        pipes: [
            // Minify scss to css
            postcss([
                sass({ outputStyle: "compressed" }),
                tailwind("./tailwind.cjs"),
            ], { syntax: scss }),

            rename({ extname: ".css" }),
        ],
        dest: cssFolder,
        end: browserSync ? [browserSync.stream()] : null,
    });
});

task("minify-css", async () => {
    const [
        { default: postcss },
        { default: autoprefixer },
        { default: csso },
    ] = await Promise.all([
        import("gulp-postcss"),
        import("autoprefixer"),
        import("postcss-csso"),
    ]);

    return stream(`${cssFolder}/**/*.css`, {
        pipes: [
            // Minify scss to css
            postcss([
                csso(),
                autoprefixer(),
            ])
        ],
        dest: cssFolder,
        end: browserSync ? [browserSync.stream()] : null,
    });
});

// JS Tasks
tasks({
    "modern-js": async () => {
        const [
            { default: gulpEsBuild, createGulpEsbuild },
            { default: size },
        ] = await Promise.all([
            import("gulp-esbuild"),
            import("gulp-size"),
        ]);

        const esbuild = mode == "watch" ? createGulpEsbuild() : gulpEsBuild;
        return stream(`${tsFolder}/${tsFile}`, {
            pipes: [
                // Bundle Modules
                esbuild({
                    bundle: true,
                    minify: true,
                    sourcemap: true,
                    format: "esm",
                    platform: "browser",
                    target: ["es2018"],
                    entryNames: '[name].min',
                }),
                size({ gzip: true, showFiles: true, showTotal: false })
            ],
            dest: jsFolder, // Output
        });
    },

    "legacy-js": async () => {
        let [
            { default: gulpEsBuild, createGulpEsbuild },
            { default: typescript },
            { default: terser },
            { default: size },
        ] = await Promise.all([
            import("gulp-esbuild"),
            import("gulp-typescript"),
            import("gulp-terser"),
            import("gulp-size"),
        ]);

        let esbuild = mode == "watch" ? createGulpEsbuild() : gulpEsBuild;
        return stream([`${tsFolder}/${tsFile}`], {
            pipes: [
                // Bundle Modules
                esbuild({
                    bundle: true,
                    minify: false,
                    sourcemap: false,
                    format: "iife",
                    platform: "browser",
                    target: ["es6"],
                    outfile: "legacy.min.js",
                }),

                // Support for es5
                typescript({
                    target: "ES5",
                    allowJs: true,
                    checkJs: false,
                    noEmit: true,
                    noEmitOnError: true,
                    sourceMap: false,
                    declaration: false,
                    isolatedModules: true,
                }),

                // Minify
                terser({
                    keep_fnames: false, // change to true here
                    toplevel: true,
                    compress: {
                        dead_code: true,
                    },
                    ecma: 5,
                }),

                size({ gzip: true, showFiles: true, showTotal: false  })
            ],
            dest: jsFolder, // Output
        });
    },

    "other-js": async () => {
        let [
            { default: gulpEsBuild, createGulpEsbuild },
            { default: typescript },
            { default: terser },
            { default: size },
        ] = await Promise.all([
            import("gulp-esbuild"),
            import("gulp-typescript"),
            import("gulp-terser"),
            import("gulp-size"),
        ]);

        let esbuild = mode == "watch" ? createGulpEsbuild() : gulpEsBuild;
        return stream([`${tsFolder}/*.ts`, `!${tsFolder}/${tsFile}`], {
            pipes: [
                // Bundle Modules
                esbuild({
                    bundle: true,
                    minify: false,
                    sourcemap: false,
                    format: "iife",
                    platform: "browser",
                    target: ["es6"],
                    entryNames: '[name].min',
                }),

                // Support for es5
                typescript({
                    target: "ES5",
                    allowJs: true,
                    checkJs: false,
                    noEmit: true,
                    noEmitOnError: true,
                    sourceMap: true,
                    declaration: false,
                    isolatedModules: true,
                }),

                // Minify
                terser({
                    keep_fnames: false, // change to true here
                    toplevel: true,
                    compress: {
                        dead_code: true,
                    },
                    ecma: 5,
                }),
                size({ gzip: true, showFiles: true, showTotal: false  })
            ],
            dest: jsFolder, // Output
        });
    },
    "js": parallelFn("modern-js", "legacy-js", "other-js")
});
// BrowserSync
task("reload", (resolve) => {
    if (browserSync) browserSync.reload();
    resolve();
});

// Delete destFolder for added performance
task("clean", async () => {
    const { default: fn } = await import("fs");
    if (!fn.existsSync(destFolder)) return Promise.resolve();

    const { default: del } = await import("del");
    return del(destFolder);
});

// Build & Watch Tasks
task("watch", async () => {
    const { default: bs } = await import("browser-sync");
    browserSync = bs.create();
    browserSync.init(
        {
            notify: true,
            server: {
                baseDir: destFolder,
                serveStaticOptions: {
                    cacheControl: false,
                    extensions: ["html"],
                },
            },

            // I use Chrome canary for development
            browser: "chrome",
            serveStatic: [
                {
                    route: "/lib",
                    dir: ["./lib"],
                },
                {
                    route: "/docs",
                    dir: ["./docs"],
                },
            ],
            reloadOnRestart: true,
            scrollThrottle: 250
        },
        (_err, bs) => {
            bs.addMiddleware("*", (_req, res) => {
                res.writeHead(302, {
                    location: `/404`,
                });
                res.end();
            });
        }
    );

    watch(`${pugFolder}/**/*.pug`, series("html", "css", "reload"));
    watch([`${sassFolder}/**/*.scss`, `./tailwind.cjs`], series("css"));
    watch(
        [
            `${tsFolder}/**/*.ts`,
            `packages/native/src/**/*.ts`,
            `packages/animate/src/**/*.ts`,
            `packages/manager/src/**/*.ts`,
            `packages/emitter/src/**/*.ts`,
        ],
        { delay: 300 },
        series("js", "reload")
    );
});

task("build", series("clean", parallel("html", "css", "js"), "minify-css"));
task("default", series("clean", parallel("html", "css", "js"), "watch"));
