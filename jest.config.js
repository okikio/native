module.exports = {
    setupFilesAfterEnv: ["jest-chain"],
    testEnvironment: "node",
    resetMocks: true,
    verbose: false,
    transform: {
        "^.+\\.ts$": "esbuild-jest",
    },
    testRegex: "./tests/.*",
    moduleFileExtensions: ["ts", "js", "json", "node"],
};
