import chalk from "chalk";
import PluginError from "plugin-error";
import replaceExtension from "replace-ext";
import { obj as _obj } from "through2";
import stripAnsi from "strip-ansi";
import { cloneDeep } from "lodash-es";
import { basename, extname, dirname, join, relative } from "path";
import applySourceMap from "vinyl-sourcemaps-apply";
import sass from "sass";
import _gulp from "gulp";

export const { src, dest, parallel, task, series, watch } = _gulp;
export const gulp = _gulp;
const { underline } = chalk;

// Streamline Gulp Tasks
export const stream = (_src, _opt = {}) => {
    return new Promise((resolve) => {
        let _end = _opt.end;
        let host =
            typeof _src !== "string" && !Array.isArray(_src)
                ? _src
                : src(_src, _opt.opts),
            _pipes = _opt.pipes || [],
            _dest = _opt.dest === undefined ? "." : _opt.dest,
            _log = _opt.log || (() => { });

        _pipes.forEach((val) => {
            if (val !== undefined && val !== null) {
                host = host.pipe(val);
            }
        });

        if (_dest !== null) host = host.pipe(dest(_dest));
        host.on("data", _log);
        host = host.on("end", (...args) => {
            if (typeof _end === "function") _end(...args);
            resolve(host);
        }); // Output

        if (Array.isArray(_end)) {
            _end.forEach((val) => {
                if (val !== undefined && val !== null) {
                    host = host.pipe(val);
                }
            });
        }

        return host;
    });
};

// A list of streams
export const streamList = (...args) => {
    return Promise.all(
        (Array.isArray(args[0]) ? args[0] : args).map((_stream) => {
            return Array.isArray(_stream) ? stream(..._stream) : _stream;
        })
    );
};

// A list of gulp tasks
export const tasks = (list) => {
    let entries = Object.entries(list);
    for (let [name, fn] of entries) {
        task(name, (...args) => fn(...args));
    }
};

export const parallelFn = (...args) => {
    let tasks = args.filter((x) => x !== undefined && x !== null);
    return function parallelrun(done) {
        return parallel(...tasks)(done);
    };
};

export const seriesFn = (...args) => {
    let tasks = args.filter((x) => x !== undefined && x !== null);
    return function seriesrun(done) {
        return series(...tasks)(done);
    };
};

const PLUGIN_NAME = "gulp-sass";
//////////////////////////////
// Main Gulp Sass function
//////////////////////////////
export const gulpSass = (options, sync) =>
    _obj((file, enc, cb) => {
        // eslint-disable-line consistent-return
        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            return cb(new PluginError(PLUGIN_NAME, "Streaming not supported"));
        }

        if (basename(file.path).indexOf("_") === 0) {
            return cb();
        }

        if (!file.contents.length) {
            file.path = replaceExtension(file.path, ".css"); // eslint-disable-line no-param-reassign
            return cb(null, file);
        }

        const opts = cloneDeep(options || {});
        opts.data = file.contents.toString();

        // we set the file path here so that libsass can correctly resolve import paths
        opts.file = file.path;

        // Ensure `indentedSyntax` is true if a `.sass` file
        if (extname(file.path) === ".sass") {
            opts.indentedSyntax = true;
        }

        // Ensure file's parent directory in the include path
        if (opts.includePaths) {
            if (typeof opts.includePaths === "string") {
                opts.includePaths = [opts.includePaths];
            }
        } else {
            opts.includePaths = [];
        }

        opts.includePaths.unshift(dirname(file.path));

        // Generate Source Maps if plugin source-map present
        if (file.sourceMap) {
            opts.sourceMap = file.path;
            opts.omitSourceMapUrl = true;
            opts.sourceMapContents = true;
        }

        //////////////////////////////
        // Handles returning the file to the stream
        //////////////////////////////
        const filePush = (sassObj) => {
            let sassMap;
            let sassMapFile;
            let sassFileSrc;
            let sassFileSrcPath;
            let sourceFileIndex;

            // Build Source Maps!
            if (sassObj.map) {
                // Transform map into JSON
                sassMap = JSON.parse(sassObj.map.toString());
                // Grab the stdout and transform it into stdin
                sassMapFile = sassMap.file.replace(/^stdout$/, "stdin");
                // Grab the base file name that's being worked on
                sassFileSrc = file.relative;
                // Grab the path portion of the file that's being worked on
                sassFileSrcPath = dirname(sassFileSrc);
                if (sassFileSrcPath) {
                    // Prepend the path to all files in the sources array except the file that's being worked on
                    sourceFileIndex = sassMap.sources.indexOf(sassMapFile);
                    sassMap.sources = sassMap.sources.map((source, index) => {
                        // eslint-disable-line arrow-body-style
                        return index === sourceFileIndex
                            ? source
                            : join(sassFileSrcPath, source);
                    });
                }

                // Remove 'stdin' from souces and replace with filenames!
                sassMap.sources = sassMap.sources.filter(
                    (src) => src !== "stdin" && src
                );

                // Replace the map file with the original file name (but new extension)
                sassMap.file = replaceExtension(sassFileSrc, ".css");
                // Apply the map
                applySourceMap(file, sassMap);
            }

            file.contents = sassObj.css; // eslint-disable-line no-param-reassign
            file.path = replaceExtension(file.path, ".css"); // eslint-disable-line no-param-reassign

            if (file.stat) {
                file.stat.atime = file.stat.mtime = file.stat.ctime = new Date(); // eslint-disable-line
            }

            cb(null, file);
        };

        //////////////////////////////
        // Handles error message
        //////////////////////////////
        const errorM = (error) => {
            const filePath =
                (error.file === "stdin" ? file.path : error.file) || file.path;
            const relativePath = relative(process.cwd(), filePath);
            const message = [
                underline(relativePath),
                error.formatted,
            ].join("\n");

            error.messageFormatted = message; // eslint-disable-line no-param-reassign
            error.messageOriginal = error.message; // eslint-disable-line no-param-reassign
            error.message = stripAnsi(message); // eslint-disable-line no-param-reassign
            error.relativePath = relativePath; // eslint-disable-line no-param-reassign

            return cb(new PluginError(PLUGIN_NAME, error));
        };

        if (sync !== true) {
            //////////////////////////////
            // Async Sass render
            //////////////////////////////
            const callback = (error, obj) => {
                // eslint-disable-line consistent-return
                if (error) {
                    return errorM(error);
                }
                filePush(obj);
            };

            gulpSass.compiler.render(opts, callback);
        } else {
            //////////////////////////////
            // Sync Sass render
            //////////////////////////////
            try {
                filePush(gulpSass.compiler.renderSync(opts));
            } catch (error) {
                return errorM(error);
            }
        }
    });

//////////////////////////////
// Sync Sass render
//////////////////////////////
gulpSass.sync = (options) => gulpSass(options, true);

//////////////////////////////
// Log errors nicely
//////////////////////////////
gulpSass.logError = function logError(error) {
    const message = new PluginError("sass", error.messageFormatted).toString();
    process.stderr.write(`${message}\n`);
    this.emit("end");
};

//////////////////////////////
// Store compiler in a prop
//////////////////////////////
gulpSass.compiler = sass;