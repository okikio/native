/// <reference types="jest" />
import { Manager } from "../src/api";
import "jest-chain";

/*
    Find: @(returns|type) \{([\w_-{,<[\]\s>]+)\}
    Replace: @$1 $2
*/

describe("Native", () => {
    let arr = [1, 2, 3, 4, 5];
    let entries = Array.from(arr.entries());
    let manager: Manager<number | string, any>;

    beforeEach(() => {
        manager = new Manager(entries);
    });

    describe("#get()", () => {
        test("get index 2 which is expected to be 3", () => {
            expect(manager.get(2)).toEqual(3);
        });
    });
});
