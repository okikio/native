module.exports = {
    setupFilesAfterEnv: ["jest-chain"],
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom-global", //"node", // jest-environment-jsdom-global
    // projects: ["<rootDir>", "<rootDir>/packages/**/tests/*"],
    // collectCoverage: true,
    collectCoverageFrom: ["src/**/*.ts"],
    resetMocks: true,
    verbose: true,
    watchPlugins: ["jest-watch-lerna-packages"],
};
