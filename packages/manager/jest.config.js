import jestBase from "../../jest.config.js";

/** @type {import('@jest/types').Config.InitialOptions} */
export default {
    ...jestBase,
    testEnvironment: "node",
};
