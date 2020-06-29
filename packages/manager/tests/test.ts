/// <reference types="jest" />
import { Manager } from "../src/api";
import fetch from "node-fetch";
import "jest-chain";

/*
    Find: @(returns|type) \{([\w_-{,<[\]\s>]+)\}
    Replace: @$1 $2
*/

describe("Manager", () => {
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

    describe("#set()", () => {
        test("set index 5 to be 6, and the set index 6 to be 7; check if add is an instanceof Manager; and if the size is 7", () => {
            expect(manager.set(5, 6).set(6, 7)).toBeInstanceOf(Manager);
            expect(manager.size).toBe(7);
            expect(manager.get(5)).toBe(6);
        });
    });

    describe("#size", () => {
        test("set index 5 to be 6, and the set index 6 to be 7; expect the size to be 5", () => {
            expect(manager.size).toBe(5);
        });
    });

    describe("#getMap()", () => {
        test("returns instance of Map", () => {
            expect(manager.getMap()).toBeInstanceOf(Map);
            console.log(manager.getMap());
        });
    });

    describe("#delete()", () => {
        test("delete the first element", () => {
            expect(manager.delete(0)).toBeInstanceOf(Manager);
            expect(manager.size).toBe(4);
            expect(manager.get(0)).toBe(undefined);
        });
    });

    describe("#clear()", () => {
        test("clear all elements", () => {
            expect(manager.clear()).toBeInstanceOf(Manager);
            expect(manager.size).toBe(0);
            expect(manager.get(0)).toBe(undefined);
            expect(manager.last()).toBe(undefined);
        });
    });

    describe("#add()", () => {
        test("add 6, and 7 to the list; check if add is an instanceof Manager; and if the size is 7", () => {
            expect(manager.add(6).add(7)).toBeInstanceOf(Manager);
            expect(manager.size).toBe(7);
            expect(manager.get(5)).toBe(6);
        });
    });

    describe("#keys()", function () {
        test("array of keys are a length of 5, and are return expected value", () => {
            expect(manager.keys()).toHaveLength(5);
            expect(manager.keys()).toEqual(Object.keys(arr).map(Number));
        });
    });

    describe("#values()", function () {
        test("array of keys are a length of 5, and are return expected value", () => {
            expect(manager.values()).toHaveLength(5);
            expect(manager.values()).toEqual(arr);
        });
    });

    describe("#last()", function () {
        test("test the last value", () => {
            expect(manager.last()).toBe(5);
        });

        test("test the 3rd last value", () => {
            expect(manager.last(3)).toBe(3);
        });
    });

    describe("#prev()", function () {
        test("test the 2nd last value", () => {
            expect(manager.prev()).toBe(4);
        });
    });

    describe("#entries()", function () {
        test("test Manager#entries()", () => {
            let value = manager.entries();
            expect(value).toHaveProperty("next").toBeDefined();
            expect(value.next().value).toBeInstanceOf(Array);
            expect(value.next().value).toEqual([1, 2]);
        });
    });

    describe("#forEach()", function () {
        test("forEach in an arrow function", () => {
            let entries = manager.entries();
            manager.forEach((value, key, obj) => {
                let [$key, $value] = entries.next().value;
                expect([key, value]).toEqual([$key, $value]);
                expect(obj).toBeInstanceOf(Map).toEqual(manager.getMap());
                expect(this).not.toHaveProperty("methodCall");
            }, manager);
        });

        test("forEach in a normal function", () => {
            let entries = manager.entries();
            manager.forEach(function (value, key, obj) {
                let [$key, $value] = entries.next().value;
                expect([key, value]).toEqual([$key, $value]);
                expect(obj).toBeInstanceOf(Map).toEqual(manager.getMap());
                expect(this).toHaveProperty("methodCall");
                expect(this.get(key)).toBe(value);
            }, manager);
        });
    });

    describe("#methodCall()", function () {
        test("test whether methodCall is calling methods properly", () => {
            let num = 0;
            let fn = (value = 1) => {
                return (defaultArg = 0) => {
                    num += value + defaultArg;
                };
            };
            manager = new Manager();
            manager.set("x", { print: fn() });
            manager.set("y", { print: fn(3) });
            manager.methodCall("print", 2);
            expect(num).toBe(8);
        });
    });

    describe("#asyncMethodCall()", function () {
        test("test whether asyncMethodCall is calling methods properly", async () => {
            let list = [];
            let fn = (url = "https://google.com") => {
                return async (newUrl = "") => {
                    let oldUrl = url + newUrl;
                    let data = await fetch(oldUrl);
                    list.push(`${data.url}`);
                };
            };

            manager = new Manager();
            manager.set("x", { print: fn() });
            manager.set("y", { print: fn("https://github.com") });

            let x = await manager.asyncMethodCall("print", "/favicon.ico");
            expect(x).toBeInstanceOf(Manager);
            expect(list).toEqual([
                "https://www.google.com/favicon.ico",
                "https://github.com/favicon.ico",
            ]);
            console.log(list);
        });
    });

    describe("#@@iterator", function () {
        test("test if it can be iterated over", () => {
            let entries = manager.entries();
            for (let [key, value] of manager) {
                let [$key, $value] = entries.next().value;
                expect([key, value]).toEqual([$key, $value]);
            }
        });
    });
});
