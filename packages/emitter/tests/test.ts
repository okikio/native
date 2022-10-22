import { describe, expect, test, beforeEach } from 'vitest';
import { EventEmitter, Event } from "../src";

describe("EventEmitter", () => {
    let emitter: EventEmitter;

    beforeEach(() => {
        emitter = new EventEmitter();
    });

    describe("#on(event, function, context) & #emit(event, function, context)", () => {
        test("listen for one event, and one listener; emit one event listener", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let on: EventEmitter = emitter.on(
                "test",
                function (key, value) {
                    test = [key, value];
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                },
                obj
            );

            on.emit("test", 1, "true");
            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).toEqual([1, "true"]);
        });

        test("listen for multiple events, and one listener; emit multiples events", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let counter = 0;
            let on: EventEmitter = emitter.on(
                "test test1 test2",
                function (key, value) {
                    test = [key, value];
                    counter++;
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                },
                obj
            );

            on.emit("test test1 test2", 1, "true");
            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).toEqual([1, "true"]);
            expect(counter).toBe(3);
        });

        test("listen for multiple events (Array format), and one listener; emit multiples events (Array format)", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let counter = 0;
            let on: EventEmitter = emitter.on(
                "test test1 test2".split(" "),
                function (key, value) {
                    test = [key, value];
                    counter++;
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                },
                obj
            );

            on.emit("test test1 test2".split(" "), 1, "true");
            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).toEqual([1, "true"]);
            expect(counter).toBe(3);
        });

        test("listen for multiple events (Object format), and multiple listeners; emit multiples events", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let counter = 0;
            let fn = function (i = 1) {
                return function (key, value) {
                    test = [key, value];
                    counter += i;
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                };
            };
            let on: EventEmitter = emitter.on(
                {
                    test: fn(),
                    test1: fn(2),
                    test3: fn(4)
                },
                obj
            );

            on.emit("test test1 test3 test", 1, "true")
                .emit("test test1 test3", 1, "true");
            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).toEqual([1, "true"]);
            expect(counter).toBe(15);
        });
    });

    describe("#off(event, function, context) & #emit(event, function, context)", () => {
        test("listen for one event, and one listener; emit one event listener; turn off an entire event", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let on: EventEmitter = emitter.on(
                "test",
                function (key, value) {
                    test = [key, value];
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                },
                obj
            );

            on.off("test");
            on.emit("test", 1, "true");

            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).not.toEqual([1, "true"]);
            expect(on.get("test")).not.toBeInstanceOf(Event);
        });

        test("listen for one event and one listener; emit one event listener; turn off an event listener", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let fn = function (key, value) {
                test = [key, value];
                expect(this).toHaveProperty("bool");
                expect(this.bool).toBe(false);
            };

            let on: EventEmitter = emitter.on("test", fn, obj);

            on.off("test", fn);
            on.emit("test", 1, "true");

            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).toEqual([1, "true"]);
            expect(on.get("test")).toBeInstanceOf(Event);

            on.off("test", fn, obj);
            on.emit("test", 1, "true");

            expect(on.get("test")).toBeInstanceOf(Event);
            expect(on.get("test").size).toBe(0);
        });

        test("listen for one event and one listener; emit one event listener; turn off an event listener without context/scope", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let fn = function (key, value) {
                test = [key, value];
                expect(obj).toHaveProperty("bool");
                expect(obj.bool).toBe(false);
            };

            let on: EventEmitter = emitter.on("test", fn);

            on.off("test", fn);
            on.emit("test", 1, "true");

            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).not.toEqual([1, "true"]);

            expect(on.get("test")).toBeInstanceOf(Event);
            expect(on.get("test").size).toBe(0);
        });

        test("listen for multiple events, and one listener; emit multiples events; turn off multiple events", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let fn = function (key, value) {
                test = [key, value];
                expect(this).toHaveProperty("bool");
                expect(this.bool).toBe(false);
            };

            let on: EventEmitter = emitter.on("test", fn, obj);

            on.off("test test1 test2");
            on.emit("test test1 test2", 1, "true");

            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).not.toEqual([1, "true"]);

            expect(on.get("test")).not.toBeInstanceOf(Event);
            expect(on.get("test1")).not.toBeInstanceOf(Event);
            expect(on.get("test2")).not.toBeInstanceOf(Event);
        });

        test("listen for multiple events (Array format), and one listener; emit multiples events (Array format); turn off multiple event listeners (Array format)", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let fn = function (key, value) {
                test = [key, value];
                expect(this).toHaveProperty("bool");
                expect(this.bool).toBe(false);
            };

            let on: EventEmitter = emitter.on("test test1 test2".split(" "), fn, obj);

            on.off("test test1 test2".split(" "), fn);
            on.emit("test test1 test2", 1, "true");

            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).toEqual([1, "true"]);
            expect(on.get("test")).toBeInstanceOf(Event);

            on.off("test test1 test2".split(" "), fn, obj);
            on.emit("test test1 test2".split(" "), 1, "true");

            expect(on.get("test")).toBeInstanceOf(Event);
            expect(on.get("test").size).toBe(0);

            expect(on.get("test1")).toBeInstanceOf(Event);
            expect(on.get("test1").size).toBe(0);

            expect(on.get("test2")).toBeInstanceOf(Event);
            expect(on.get("test2").size).toBe(0);
        });

        test("listen for multiple events (Object format), and one listener; emit multiples events; turn off multiple event listeners (Object format)", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let counter = 0;
            let fn = (i = 1) => {
                return function (key, value) {
                    test = [key, value];
                    counter += i;
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                };
            };

            let emit = {
                test: fn(),
                test1: fn(2),
                test2: fn(4)
            };
            let on: EventEmitter = emitter.on(emit, obj);

            on.off(emit);
            on.emit("test test1 test2", 1, "true");

            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).toEqual([1, "true"]);
            expect(on.get("test")).toBeInstanceOf(Event);

            on.off(emit, obj);
            on.emit("test test1 test2", 1, "true");

            expect(counter).toBe(7);

            expect(on.get("test")).toBeInstanceOf(Event);
            expect(on.get("test").size).toBe(0);

            expect(on.get("test1")).toBeInstanceOf(Event);
            expect(on.get("test1").size).toBe(0);

            expect(on.get("test2")).toBeInstanceOf(Event);
            expect(on.get("test2").size).toBe(0);
        });
    });

    describe("#once(event, function, context) & #emit(event, function, context)", () => {
        test("listen for one event and one listener once; emit one event listener once", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let counter = 0;
            let on: EventEmitter = emitter.once(
                "test",
                function (key, value) {
                    test = [key, value];
                    counter++;
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                },
                obj
            );

            on.emit("test", 1, "true");
            on.emit("test", 1, "true");
            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).toEqual([1, "true"]);
            expect(counter).toBe(1);

            expect(on.get("test")).toBeInstanceOf(Event);
            expect(on.get("test").size).toBe(0);
        });

        test("listen for multiple events and one listener once; emit multiples events once", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let counter = 0;
            let on: EventEmitter = emitter.once(
                "test test1 test2",
                function (key, value) {
                    test = [key, value];
                    counter++;
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                },
                obj
            );

            on.emit("test test1 test2", 1, "true");
            on.emit("test test1 test2", 1, "true");
            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).toEqual([1, "true"]);

            expect(on.get("test")).toBeInstanceOf(Event);
            expect(on.get("test").size).toBe(0);

            expect(on.get("test1")).toBeInstanceOf(Event);
            expect(on.get("test1").size).toBe(0);

            expect(on.get("test2")).toBeInstanceOf(Event);
            expect(on.get("test2").size).toBe(0);

            expect(counter).toBe(3);
        });

        test("listen for multiple events (Array format) and one listener once; emit multiples events (Array format) once", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let counter = 0;
            let on: EventEmitter = emitter.once(
                "test test1 test2".split(" "),
                function (key, value) {
                    test = [key, value];
                    counter++;
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                },
                obj
            );

            on.emit("test test1 test2".split(" "), 1, "true");
            on.emit("test test1 test2".split(" "), 1, "true");
            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).toEqual([1, "true"]);

            expect(on.get("test")).toBeInstanceOf(Event);
            expect(on.get("test").size).toBe(0);

            expect(on.get("test1")).toBeInstanceOf(Event);
            expect(on.get("test1").size).toBe(0);

            expect(on.get("test2")).toBeInstanceOf(Event);
            expect(on.get("test2").size).toBe(0);

            expect(counter).toBe(3);
        });

        test("listen for multiple events (String format) once; emit only one event listener once", () => {
            let test = false;
            let obj = { bool: false };
            let counter = 0;
            let on: EventEmitter = emitter.once(
                "test test1 test2",
                function () {
                    test = true;
                    counter++;
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                },
                obj
            );

            on.emit("test2");
            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).toEqual(true);

            expect(on.get("test")).toBeInstanceOf(Event);
            expect(on.get("test").size).toBe(1);

            expect(on.get("test1")).toBeInstanceOf(Event);
            expect(on.get("test1").size).toBe(1);

            expect(on.get("test2")).toBeInstanceOf(Event);
            expect(on.get("test2").size).toBe(0);

            expect(counter).toBe(1);
        });

        test("listen for multiple event listeners (String format) on one event; emit only one event listener once; expect only the listener registed once to be removed", () => {
            let test = false;
            let obj = { bool: false };
            let counter = 0;
            let fn = function () {
                test = true;
                counter++;
                expect(this).toHaveProperty("bool");
                expect(this.bool).toBe(false);
            };
            let on: EventEmitter = emitter.once("test test1 test2", fn, obj);
            emitter.on("test2", fn, obj);

            expect(on.get("test2").size).toBe(2);
            on.emit("test2");
            on.emit("test2");
            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).toEqual(true);

            expect(on.get("test")).toBeInstanceOf(Event);
            expect(on.get("test").size).toBe(1);

            expect(on.get("test1")).toBeInstanceOf(Event);
            expect(on.get("test1").size).toBe(1);

            expect(on.get("test2")).toBeInstanceOf(Event);
            expect(on.get("test2").size).toBe(1);

            expect(counter).toBe(3);
        });

        test("listen for multiple events (Object format) and multiple listeners once; emit multiples events once", () => {
            let test: boolean | (boolean | number)[] = false;
            let obj = { bool: false };
            let counter = 0;
            let fn = function (i = 1) {
                return function (key, value) {
                    test = [key, value];
                    counter += i;
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                };
            };

            let on: EventEmitter = emitter.once(
                {
                    test: fn(),
                    test1: fn(2),
                    test3: fn(4)
                },
                obj
            );

            on.emit("test test1 test3", 1, "true");
            on.emit("test test1 test3", 1, "true");
            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).toEqual([1, "true"]);

            expect(on.get("test")).toBeInstanceOf(Event);
            expect(on.get("test").size).toBe(0);

            expect(on.get("test1")).toBeInstanceOf(Event);
            expect(on.get("test1").size).toBe(0);

            expect(on.get("test3")).toBeInstanceOf(Event);
            expect(on.get("test3").size).toBe(0);

            expect(counter).toBe(7);
        });

        test("listen for multiple events (Object format) and multiple listeners once; turn off all event listeners (turn off the entire test event) before emit; emit multiples events once", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let counter = 0;
            let fn = function (i = 1) {
                return function (key, value) {
                    test = [key, value];
                    counter += i;
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                };
            };

            let emit = {
                test: fn(),
                test1: fn(2),
                test3: fn(4)
            };
            let on: EventEmitter = emitter.once(emit, obj);

            on.off("test", emit.test, obj);
            on.off("test1", emit.test1, obj);
            on.off("test3", emit.test3, obj);

            expect(on.get("test")).toBeInstanceOf(Event);
            expect(on.get("test").size).toBe(1);

            expect(on.get("test1")).toBeInstanceOf(Event);
            expect(on.get("test1").size).toBe(1);

            expect(on.get("test3")).toBeInstanceOf(Event);
            expect(on.get("test3").size).toBe(1);

            on.off("test");
            on.off("test1", on.get("test1").get(0).callback, obj);
            on.off("test3", on.get("test3").get(0).callback, obj);

            on.emit("test test1 test3", 1, "true");
            on.emit("test test1 test3", 1, "true");
            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).toEqual(false);

            expect(on.get("test")).toBe(undefined);

            expect(on.get("test1")).toBeInstanceOf(Event);
            expect(on.get("test1").size).toBe(0);

            expect(on.get("test3")).toBeInstanceOf(Event);
            expect(on.get("test3").size).toBe(0);

            expect(counter).toBe(0);
        });
    });

    describe("#emit(event, function, context) & #on(event, function, context)", () => {
        test("listen for one event and one listener; emit one wrong event listener", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let counter = 0;
            let on: EventEmitter = emitter.on(
                "test",
                function (key, value) {
                    test = [key, value];
                    counter++;
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                },
                obj
            );

            on.emit("test2", 1, "true");
            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).toEqual(false);
            expect(counter).toBe(0);

            expect(on.get("test")).toBeInstanceOf(Event);
            expect(on.get("test").size).toBe(1);
        });

        test("listen for one event and one listener; emit an event listener with no arguments", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let counter = 0;
            let on: EventEmitter = emitter.on(
                "test",
                function (key, value) {
                    counter++;
                    expect([key, value]).toEqual([undefined, undefined]);
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                },
                obj
            );

            on.emit("test");
            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).toBe(false);
            expect(counter).toBe(1);

            expect(on.get("test")).toBeInstanceOf(Event);
            expect(on.get("test").size).toBe(1);
        });

        test("listen for multiple events (Array format) and one listener; emit multiples events (Array format) with no arguments", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let counter = 0;
            let on: EventEmitter = emitter.on(
                "test test1 test2".split(" "),
                function (key, value) {
                    counter++;
                    expect([key, value]).toEqual([undefined, undefined]);
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                },
                obj
            );

            on.emit("test test1 test2".split(" "));
            on.emit("test test1 test2".split(" "));
            expect(on).toBeInstanceOf(EventEmitter);
            expect(test).toBe(false);

            expect(on.get("test")).toBeInstanceOf(Event);
            expect(on.get("test").size).toBe(1);

            expect(on.get("test1")).toBeInstanceOf(Event);
            expect(on.get("test1").size).toBe(1);

            expect(on.get("test2")).toBeInstanceOf(Event);
            expect(on.get("test2").size).toBe(1);

            expect(counter).toBe(6);
        });
    });
});
