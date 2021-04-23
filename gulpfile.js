// Import external modules
const mode = process.argv.includes("--watch") ? "watch" : "build";

// Gulp utilities
import { gulpSass as sass, watch, task, series, parallel, stream } from "./util.js";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

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
    const [
        { default: postcss },
        { default: autoprefixer },
        { default: tailwind },
        { default: csso }
    ] = await Promise.all([
        import("gulp-postcss"),
        import("autoprefixer"),
        import("tailwindcss"),
        import("postcss-csso")
    ]);
    const { logError } = sass;
    return stream(`${sassFolder}/**/*.scss`, {
        pipes: [
            // Minify scss to css
            sass({ outputStyle: "compressed" }).on("error", logError),
            postcss([
                tailwind("./tailwind.cjs"),
                csso(),
                autoprefixer(),
            ])
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
    ] = await Promise.all([
        import("gulp-esbuild"),
        import("gzip-size"),
        import("pretty-bytes"),
    ]);

    const esbuild = mode == "watch" ? createGulpEsbuild() : gulpEsBuild; //
    return stream(`${tsFolder}/*.ts`, {
        pipes: [
            // Bundle Modules
            esbuild({
                bundle: true,
                minify: true,
                format: "esm",
                target: ["chrome71"],
            }),
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
            notify: true,
            server: {
                baseDir: destFolder,
                serveStaticOptions: {
                    cacheControl: false,
                    extensions: ["html"],
                },
            },
            serveStatic: [
                {
                    route: "/lib",
                    dir: ["./lib"],
                },
            ],
            online: true,
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
