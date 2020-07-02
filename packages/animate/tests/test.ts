/// <reference types="jest" />
import { Animate } from "../src/api";
import "jest-chain";

/*
    Find: @(returns|type) \{([\w_-{,<[\]\s>]+)\}
    Replace: @$1 $2
*/

describe("Animate", () => {
    let animation: Animate;

    // beforeEach(() => {
    //     animation = new Animate({
    //         target: ".div",
    //         keyframes(index: number, total: number, element: HTMLElement) {
    //             return [
    //                 { transform: "translateX(0px)", opacity: 0 },
    //                 { transform: "translateX(300px)", opacity: ((index + 1) / total) }
    //             ]
    //         },
    //         transform: ["translateX(0px)", "translateX(300px)"],
    //         easing: "out-cubic",
    //         opacity(index: number, total: number, element: HTMLElement) {
    //             return [0, ((index + 1) / total)];
    //         },
    //         duration(index: number) {
    //             return (index + 1) * 500;
    //         },
    //         onfinish(element: HTMLElement, index: number, total: number) {
    //             element.style.opacity = `${((index + 1) / total)}`;
    //             element.style.transform = "translateX(300px)";
    //         },
    //         loop: 5,
    //         speed: 1,
    //         direction: "alternate",
    //         delay(index: number) {
    //             return index * 200;
    //         },
    //         autoplay: true,
    //         endDelay: 500
    //     });
    // });

    describe("#constructor()", () => {
        test("argument and options", () => {
            let div = {
                document: true
            };
            console.log(div);
            // expect(animation).toBeInstanceOf(Animate);
            // expect(animation.getOptions()).toEqual({
            //     target: ".div",
            //     keyframes(index: number, total: number, element: HTMLElement) {
            //         return [
            //             { transform: "translateX(0px)", opacity: 0 },
            //             { transform: "translateX(300px)", opacity: ((index + 1) / total) }
            //         ]
            //     },
            //     transform: ["translateX(0px)", "translateX(300px)"],
            //     easing: "out-cubic",
            //     opacity(index: number, total: number, element: HTMLElement) {
            //         return [0, ((index + 1) / total)];
            //     },
            //     duration(index: number) {
            //         return (index + 1) * 500;
            //     },
            //     onfinish(element: HTMLElement, index: number, total: number) {
            //         element.style.opacity = `${((index + 1) / total)}`;
            //         element.style.transform = "translateX(300px)";
            //     },
            //     loop: 5,
            //     speed: 1,
            //     direction: "alternate",
            //     delay(index: number) {
            //         return index * 200;
            //     },
            //     autoplay: true,
            //     endDelay: 500
            // });
        });
    });

});
