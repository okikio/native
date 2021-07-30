import chalk from "chalk";
import { rollup } from "rollup";
import { terser } from "rollup-plugin-terser";

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";

import bundleSize from "rollup-plugin-bundle-size";
import esbuild from "rollup-plugin-esbuild";

import { readFileSync } from "fs";
import { globby } from 'globby';

import path from "path";
import { fileURLToPath } from "url";

import minimist from "minimist";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @param {string}[scope] - packages to only build (if you don't
 *    want to build everything)
 * @param {string}[ignore] - packages to not build
 *
 * @returns {string[]} - sorted list of Package objects that
 *    represent packages to be built.
 */
export const getSortedPackages = async (scope = [], ignore = []) => {
    scope = [].concat(scope);
    ignore = [].concat(ignore);
    return (await globby(["packages"], {
        expandDirectories: scope.length ? scope.map(v => `${v.replace("@okikio/", "")}/package.json`) : ["package.json"],
        ignore: ignore.length ? ignore.map(v => `packages/${v.replace("@okikio/", "")}/package.json`) : [],
        deep: 2
    })).map(file => ({
        file: file,
        location: file.replace("package.json", ""),
        json: JSON.parse(readFileSync(file, "utf-8"))
    }))
};

export const rollupConfig = async ({ scope, ignore } = {}) => {
    /**
     * @type {import('rollup').RollupOptions}
     */
    const config = [];
    const packages = await getSortedPackages(scope, ignore);

    packages.forEach((pkg) => {
        /* Absolute path to package directory */
        const basePath = path.relative(__dirname, pkg.location);

        let pkgObj = pkg.json;

        /* Absolute path to input file */
        const input = path.join(basePath, pkgObj.main);

        /* "main" & "module" field from package.json file. */
        const { main, module, umd: name, legacy } = pkgObj.publishConfig;

        /* Push build config for this package. */
        config.push({
            input,
            output: [
                {
                    file: path.join(basePath, module),
                    exports: "named",
                    format: "es"
                },
                {
                    file: path.join(basePath, main),
                    exports: "named",
                    format: "cjs",
                },
                {
                    file: path.join(basePath, legacy),
                    exports: "named",
                    name,
                    format: "umd",
                },
            ],
        });
    });

    return config;
};

// Support --scope and --ignore globs if passed in via commandline
const args = minimist(process.argv.slice(2));
const configs = await rollupConfig(args);

export async function build() {
    for (let { input, output } of configs) {
        let title = chalk`{gray Bundled in}`;
        console.time(title);
        console.log(`\n` + chalk`Building {red ${input}}`)

        // Create a bundle
        const bundle = await rollup({
            input,
            plugins: [
                esbuild({
                    target: "es2021", // default, or 'es20XX', 'esnext'
                    logLevel: "info",
                
                    color: true,
                    bundle: true,
                    minify: true,
                
                    sourcemap: false,
                    platform: "browser",
                    tsconfig: "./tsconfig.json",
                }),
                nodeResolve(),
                commonjs(),
                bundleSize(),
                terser({
                    ecma: 2021,
                    compress: true, mangle: true
                })
            ]
        });

        // or write the bundle to disk
        for (let outputOption of output) {
            await bundle.write(outputOption);
        }

        // closes the bundle
        await bundle.close();
        console.timeEnd(title);
    }
}

build();
