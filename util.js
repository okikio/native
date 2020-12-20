const gulp = require("gulp");
const mergeStream = require("merge-stream");
const { src, dest, parallel, watch, task, series } = gulp;

// Streamline Gulp Tasks
const stream = (_src, _opt = {}) => {
    let _end = _opt.end;
    let host =
            typeof _src !== "string" && !Array.isArray(_src)
                ? _src
                : src(_src, _opt.opts),
        _pipes = _opt.pipes || [],
        _dest = _opt.dest === undefined ? "." : _opt.dest,
        _log = _opt.log || (() => {});

    _pipes.forEach((val) => {
        if (val !== undefined && val !== null) {
            host = host.pipe(val);
        }
    });

    if (_dest !== null) host = host.pipe(dest(_dest));
    host = host.on("data", _log);
    host = host.on("end", (...args) => {
        if (typeof _end === "function") _end(...args);
    }); // Output

    if (Array.isArray(_end)) {
        _end.forEach((val) => {
            if (val !== undefined && val !== null) {
                host = host.pipe(val);
            }
        });
    }
    return host;
};

// A list of streams
const streamList = (...args) => {
    //
    return mergeStream(
        (Array.isArray(args[0]) ? args[0] : args).map((_stream) => {
            return Array.isArray(_stream) ? stream(..._stream) : _stream;
        })
    );
};

// A list of gulp tasks
const tasks = (list) => {
    let entries = Object.entries(list);
    for (let [name, fn] of entries) {
        task(name, (...args) => fn(...args));
    }
};

module.exports = {
    parallelFn(...args) {
        let tasks = args.filter((x) => x !== undefined && x !== null);
        return (done) => parallel(...tasks)(done);
    },
    seriesFn(...args) {
        let tasks = args.filter((x) => x !== undefined && x !== null);
        return (done) => series(...tasks)(done);
    },
    src,
    dest,
    watch,
    task,
    parallel,
    series,
    stream,
    streamList,
    tasks,
    gulp,
};
