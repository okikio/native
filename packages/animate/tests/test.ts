/// <reference types="jest" />
import { animate } from "../src/api";
import "jest-chain";

/*
    Find: @(returns|type) \{([\w_-{,<[\]\s>]+)\}
    Replace: @$1 $2
*/

describe("Manager", () => {
    let animation;

    beforeEach(() => {
        animation = animate;
    });

    describe("# WIP ()", () => {
        test("get index 2 which is expected to be 3", () => {
            expect(animation).not.toBe(undefined);
        });
    });

});
