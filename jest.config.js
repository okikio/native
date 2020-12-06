module.exports = {
    setupFilesAfterEnv: ["jest-chain"],
    // preset: "@swc-node/jest",
    testEnvironment: "node", // "node", // jest-environment-jsdom-global
    // projects: ["<rootDir>", "<rootDir>/packages/**/tests/*"],
    // collectCoverage: true,
    // rootDir: "/",
    // collectCoverageFrom: ["src/**/*.ts"],
    resetMocks: true,
    verbose: false,
    // watchPlugins: ["jest-watch-lerna-packages"],
    transform: {
        // "^.+\\.(t|j)sx?$": ["@swc-node/jest"],

        "^.+\\.ts$": "esbuild-jest",
    },
    testRegex: "./tests/.*",
    moduleFileExtensions: ["ts", "js", "json", "node"],
    // globals: {
    //     "ts-jest": {
    //         isolatedModules: true,
    //     },
    // },
};
