module.exports = {
    setupFilesAfterEnv: ["jest-chain"],
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom-global", // "node",
    // projects: ["<rootDir>", "<rootDir>/packages/**/tests/*"],
    // collectCoverage: true,
    // rootDir: "/",
    collectCoverageFrom: ["src/**/*.ts"],
    resetMocks: true,
    verbose: true,
    watchPlugins: ["jest-watch-lerna-packages"],
    globals: {
        "ts-jest": {
            isolatedModules: true,
        },
    },
};
