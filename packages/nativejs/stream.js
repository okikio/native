import gulp, { src, dest } from "gulp";

// Streamline Gulp Tasks
export const stream = (_src, _opt = {}) => {
    let _end = _opt.end || [];
    let host = typeof _src !== "string" && !Array.isArray(_src) ? _src : src(_src, _opt.opts),
        _pipes = _opt.pipes || [],
        _dest = _opt.dest || ".",
        _log = _opt.log || (() => { });

    return new Promise((resolve, reject) => {
        _pipes.forEach((val) => {
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

// A list of streams
export const streamList = (...args) => {
    return Promise.all(
        (Array.isArray(args[0]) ? args[0] : args).map((_stream) => {
            return Array.isArray(_stream) ? stream(..._stream) : _stream;
        })
    );
};

export default stream;