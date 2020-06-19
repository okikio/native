// Import external modules
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const { src, dest, task, series } = require("gulp");
const { terser } = require("rollup-plugin-terser");
const ts = require("gulp-typescript");
const { rollup } = require("rollup");
const size = require("gulp-size");

// Streamline Gulp Tasks
const stream = (_src, _opt = {}) => {
    let _end = _opt.end || [];
    let host = typeof _src !== "string" && !Array.isArray(_src) ? _src : src(_src, _opt.opts),
        _pipes = _opt.pipes || [],
        _dest = _opt.dest || ".",
        _log = _opt.log || (() => { });

    return new Promise((resolve, reject) => {
        _pipes.forEach(val => {
            if (val !== undefined && val !== null) {
                host = host.pipe(val).on("error", reject);
            }
        });

        host
            .on("end", _log)
            .on("error", reject)
            .pipe(dest(_dest))
            .on("end", resolve); // Output

        _end.forEach((val) => {
            if (val !== undefined && val !== null) {
                host = host.pipe(val);
            }
        });
    });
};

const tsProject = ts.createProject('tsconfig.json');
task("ts", async () => {
    return stream(tsProject.src(), {
        pipes: [
            // Compile typescript
            tsProject(),
        ],
        dest: "lib"
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
        file: main,
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
        dest: "lib"
    })
});

task("build", series("ts", "js", "info"));
task("default", series("ts", "js", "info"));