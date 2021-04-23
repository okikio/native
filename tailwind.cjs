const destFolder = `demo`;
module.exports = {
    mode: "jit",
    purge: {
        enabled: false,
        content: [`${destFolder}/**/*.html`]
    }
};