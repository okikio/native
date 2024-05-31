import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import { on, off, emit, toCustomEvents } from "../src/index.ts";

describe("EventTarget", () => {
    let target: EventTarget | null = null;

    beforeEach(() => {
        target = new EventTarget();
    });

    afterEach(() => {
        target = null;
    })

    describe("#on(event, function, context) & #emit(event, function, context)", () => {
        test("listen for one event, and one listener; emit one event listener", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            const result = on(
                target!,
                "test",
                function (this: typeof obj, event: Event) {
                    const evt = event as CustomEvent<{ key: number, value: string }>;
                    const { key, value } = evt.detail;
                    test = [key, value];

                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                }.bind(obj),
            );

            const event = new CustomEvent("test", {
                detail: { key: 1, value: "true" }
            });
            emit(target!, event);
            expect(result).toBeInstanceOf(EventTarget);
            expect(test).toEqual([1, "true"]);
        });

        test("listen for multiple events, and one listener; emit multiples events", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let counter = 0;
            const result = on(
                target!,
                "test test1 test2",
                function (this: typeof obj, event: Event) {
                    const evt = event as CustomEvent<{ key: number, value: string }>;
                    const { key, value } = evt.detail;
                    test = [key, value];
                    counter++;
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                }.bind(obj),
            );

            const events = "test test1 test2".split(" ").map(() => {
                return new CustomEvent("test", {
                    detail: { key: 1, value: "true" }
                })
            });
            emit(target!, events);
            expect(result).toBeInstanceOf(EventTarget);
            expect(test).toEqual([1, "true"]);
            expect(counter).toBe(3);
        });

        test("listen for multiple events (Array format), and one listener; emit multiples events (Array format)", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let counter = 0;
            const result = on(target!,
                "test test1 test2".split(" "),
                function (this: typeof obj, event: Event) {
                    const evt = event as CustomEvent<{ key: number, value: string }>;
                    const { key, value } = evt.detail;
                    test = [key, value];
                    counter++;
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                }.bind(obj),
            );

            const events = "test test1 test2".split(" ").map(() => {
                return new CustomEvent("test", {
                    detail: { key: 1, value: "true" }
                })
            });
            emit(target!, events);
            expect(result).toBeInstanceOf(EventTarget);
            expect(test).toEqual([1, "true"]);
            expect(counter).toBe(3);
        });

        test("listen for multiple events (Object format), and multiple listeners; emit multiples events", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let counter = 0;
            let fn = function (i = 1) {
                return function (this: typeof obj, event: Event) {
                    const evt = event as CustomEvent<{ key: number, value: string }>;
                    const { key, value } = evt.detail;
                    test = [key, value];
                    counter += i;
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                }.bind(obj);
            };
            const result = on(
                target!,
                {
                    test: fn(),
                    test1: fn(2),
                    test3: fn(4)
                }
            );

            emit(target!, toCustomEvents("test test1 test3 test", { key: 1, value: "true" }));
            emit(target!, toCustomEvents("test test1 test3", { key: 1, value: "true" }));

            expect(result).toBeInstanceOf(EventTarget);
            expect(test).toEqual([1, "true"]);
            expect(counter).toBe(15);
        });
    });

    describe("#off(event, function, context) & #emit(event, function, context)", () => {
        test("listen for one event, and one listener; emit one event listener; turn off an entire event", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let fn: EventListenerOrEventListenerObject;
            const result = on(
                target!,
                "test",
                fn = function (this: typeof obj, event: Event) {
                    const evt = event as CustomEvent<{ key: number, value: string }>;
                    const { key, value } = evt.detail;
                    test = [key, value];
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                }.bind(obj),
            );

            off(target!, "test", fn);
            emit(target!, new CustomEvent("test", { 
                detail: { key: 1, value: "true" } 
            }));

            expect(result).toBeInstanceOf(EventTarget);
            expect(test).not.toEqual([1, "true"]);
        });

        test("listen for one event and one listener; emit one event listener; turn off an event listener", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let fn = function (this: typeof obj, event: Event) {
                const evt = event as CustomEvent<{ key: number, value: string }>;
                const { key, value } = evt.detail;
                test = [key, value];
                expect(this).toHaveProperty("bool");
                expect(this.bool).toBe(false);
            }.bind(obj);

            const result = on(target!,"test", fn);

            emit(target!, new CustomEvent("test", {
                detail: { key: 1, value: "true" }
            }));

            expect(result).toBeInstanceOf(EventTarget);
            expect(test).toEqual([1, "true"]);
        });

        test("listen for one event and one listener; emit one event listener; turn off an event listener without context/scope", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let fn = function (this: typeof obj, event: Event) {
                const evt = event as CustomEvent<{ key: number, value: string }>;
                const { key, value } = evt.detail;
                test = [key, value];
                expect(obj).toHaveProperty("bool");
                expect(obj.bool).toBe(false);
            }.bind(obj);

            const result = on(target!, "test", fn);

            off(target!, "test", fn);
            emit(target!, new CustomEvent("test", {
                detail: { key: 1, value: "true" }
            }));

            expect(result).toBeInstanceOf(EventTarget);
            expect(test).not.toEqual([1, "true"]);
        });

        test("listen for multiple events, and one listener; emit multiples events; turn off multiple events", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let fn = function (this: typeof obj, event: Event) {
                const evt = event as CustomEvent<{ key: number, value: string }>;
                const { key, value } = evt.detail;
                test = [key, value];
                expect(this).toHaveProperty("bool");
                expect(this.bool).toBe(false);
            }.bind(obj);

            const result = on(target!, "test", fn);

            off(target!, "test test1 test2", fn);
            emit(target!, toCustomEvents("test test1 test2", { key: 1, value: "true" }));

            expect(result).toBeInstanceOf(EventTarget);
            expect(test).not.toEqual([1, "true"]);
        });

        test("listen for multiple events (Array format), and one listener; emit multiples events (Array format); turn off multiple event listeners (Array format)", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let fn = function (this: typeof obj, event: Event) {
                const evt = event as CustomEvent<{ key: number, value: string }>;
                const { key, value } = evt.detail;
                test = [key, value];
                expect(this).toHaveProperty("bool");
                expect(this.bool).toBe(false);
            }.bind(obj);

            const result = on(target!,"test test1 test2".split(" "), fn);

            off(target!, "test test1 test2".split(" "), fn);
            emit(target!, toCustomEvents("test test1 test2", { key: 1, value: "true" }));

            expect(result).toBeInstanceOf(EventTarget);
            expect(test).toEqual(false);
        });

        test("listen for multiple events (Object format), and one listener; emit multiples events; turn off multiple event listeners (Object format)", () => {
            let test: boolean | any = false;
            let obj = { bool: false };
            let counter = 0;
            let fn = (i = 1) => {
                return function (this: typeof obj, event: Event) {
                    const evt = event as CustomEvent<{ key: number, value: string }>;
                    const { key, value } = evt.detail;
                    test = [key, value];
                    counter += i;
                    expect(this).toHaveProperty("bool");
                    expect(this.bool).toBe(false);
                }.bind(obj);
            };

            let evtObj = {
                test: fn(),
                test1: fn(2),
                test2: fn(4)
            };
            const result = on(target!, evtObj);

            emit(target!, toCustomEvents("test test1 test2", { key: 1, value: "true" }));

            expect(result).toBeInstanceOf(EventTarget);
            expect(test).toEqual([1, "true"]);

            expect(counter).toBe(7);

            off(target!, evtObj);
            emit(target!, toCustomEvents("test test1 test2", { key: 1, value: "true" }));

            expect(counter).toBe(7);
        });
    });
});
