const { Manager } = require("../lib/api");
const fetch = require("node-fetch");
const { expect } = require("chai");

describe("Manager", () => {
    let arr = [1, 2, 3, 4, 5];
    let entries = Array.from(arr.entries());
    let manager;

    beforeEach(() => {
        manager = new Manager(entries);
    });

    describe("#get()", () => {
        it("get index 2 which is expected to be 3", () => {
            expect(manager.get(2)).to.equal(3);
        });
    });

    describe("#set()", () => {
        it("set index 5 to be 6, and the set index 6 to be 7; check if add is an instanceof Manager; and if the size is 7", () => {
            expect(manager.set(5, 6).set(6, 7)).instanceOf(Manager);
            expect(manager.size).to.be.a("number").that.equals(7);
            expect(manager.get(5)).to.equal(6);
        });
    });

    describe("#size", () => {
        it("set index 5 to be 6, and the set index 6 to be 7; expect the size to be 5", () => {
            expect(manager.size).to.be.a("number").that.equals(5);
        });
    });

    describe("#getMap()", () => {
        it("returns instance of Map", () => {
            expect(manager.getMap()).instanceOf(Map);
            console.log(manager.getMap());
        });
    });

    describe("#delete()", () => {
        it("delete the first element", () => {
            expect(manager.delete(0)).instanceOf(Manager);
            expect(manager.size).to.equal(4);
            expect(manager.get(0)).to.be.undefined;
        });
    });

    describe("#clear()", () => {
        it("clear all elements", () => {
            expect(manager.clear()).instanceOf(Manager);
            expect(manager.size).to.equal(0);
            expect(manager.get(0)).to.be.undefined;
            expect(manager.last()).to.be.undefined;
        });
    });

    describe("#add()", () => {
        it("add 6, and 7 to the list; check if add is an instanceof Manager; and if the size is 7", () => {
            expect(manager.add(6).add(7)).instanceOf(Manager);
            expect(manager.size).to.be.a("number").that.equals(7);
            expect(manager.get(5)).to.equal(6);
        });
    });

    describe("#keys()", function () {
        it("array of keys are a length of 5, and are return expected value", () => {
            expect(manager.keys()).a.lengthOf(5);
            expect(manager.keys()).to.be.deep.equal([0, 1, 2, 3, 4]);
        });
    });

    describe("#values()", function () {
        it("array of keys are a length of 5, and are return expected value", () => {
            expect(manager.values()).a.lengthOf(5);
            expect(manager.values()).to.be.deep.equal(arr);
        });
    });

    describe("#last()", function () {
        it("test the last value", () => {
            expect(manager.last()).to.equal(5);
        });

        it("test the 3rd last value", () => {
            expect(manager.last(3)).to.equal(3);
        });
    });

    describe("#prev()", function () {
        it("test the 2nd last value", () => {
            expect(manager.prev()).to.equal(4);
        });
    });

    describe("#entries()", function () {
        it("test Manager#entries()", () => {
            let value = manager.entries();
            expect(value).to.have.property("next").a("function");
            expect(value.next().value).to.be.an("array");
            expect(value.next().value).to.be.deep.equal([1, 2]);
        });
    });

    describe("#forEach()", function () {
        it("forEach in an arrow function", () => {
            let entries = manager.entries();
            manager.forEach((value, key, obj) => {
                let [$key, $value] = entries.next().value;
                expect([key, value]).to.deep.equal([$key, $value]);
                expect(obj)
                    .to.be.instanceOf(Map)
                    .to.deep.equal(manager.getMap());
                expect(this)
                    .to.be.an("object")
                    .and.does.not.have.property("methodCall");
            }, manager);
        });

        it("forEach in a normal function", () => {
            let entries = manager.entries();
            manager.forEach(function (value, key, obj) {
                let [$key, $value] = entries.next().value;
                expect([key, value]).to.deep.equal([$key, $value]);
                expect(obj)
                    .to.be.instanceOf(Map)
                    .to.deep.equal(manager.getMap());
                expect(this)
                    .to.be.an("object")
                    .and.does.have.property("methodCall");
                expect(this.get(key)).to.equal(value);
            }, manager);
        });
    });

    describe("#methodCall()", function () {
        it("test whether methodCall is calling methods properly", () => {
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
            expect(num).to.equal(8);
        });
    });

    describe("#asyncMethodCall()", function () {
        it("test whether asyncMethodCall is calling methods properly", async () => {
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

            await manager.asyncMethodCall("print", "/favicon.ico");
            expect(list).to.deep.equal([
                "https://www.google.com/favicon.ico",
                "https://github.com/favicon.ico",
            ]);
            console.log(list);
        });
    });
});
