import { jest, describe, expect, test, beforeEach } from '@jest/globals';
import { Manager, methodCall } from "../src/api";

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

    describe("#size or #length", () => {
        test("expect size/length of manager to be 5", () => {
            expect(manager.size).toBe(5);
            expect(manager.length).toBe(manager.size);
        });
    });

    describe("#has()", () => {
        test("has index 3 but not 7", () => {
            expect(manager.has(3)).toBe(true);
            expect(manager.has(7)).toBe(false);
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
            expect(manager.delete(0)).toBe(true);
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

    describe("#remove()", () => {
        test("remove the first and last elements", () => {
            expect(manager.remove(0).remove(4)).toBeInstanceOf(Manager);
            expect(manager.size).toBe(3);
            expect(manager.get(0)).toBe(undefined);
            expect(manager.get(4)).toBe(undefined);
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

    describe("#entries()", function () {
        test("test Manager#entries()", () => {
            let value = manager.entries();
            expect(value).toHaveProperty("next");
            expect(value).toBeDefined();
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
                expect(obj).toBeInstanceOf(Map);
                expect(obj).toEqual(manager.getMap());
                expect(this).not.toHaveProperty("clear");
            }, manager);
        });

        test("forEach in a normal function", () => {
            let entries = manager.entries();
            manager.forEach(function (value, key, obj) {
                let [$key, $value] = entries.next().value;
                expect([key, value]).toEqual([$key, $value]);
                expect(obj).toBeInstanceOf(Map);
                expect(obj).toEqual(manager.getMap());
                expect(this).toHaveProperty("clear");
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
            methodCall(manager, "print", 2);
            expect(num).toBe(8);
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

