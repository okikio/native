/** @type {import('@jest/types').Config.InitialOptions} */
export default {
    setupFilesAfterEnv: ["jest-extended", "jest-chain"],
    testEnvironment: "node",
    resetMocks: true,
    verbose: false,
    transform: {
        "^.+\\.ts$": "esbuild-jest",
    },
    testRegex: "./tests/.*",
    moduleFileExtensions: ["ts", "js", "json", "node"],
};
