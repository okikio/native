import { ITransition, ITransitionData, animate } from "../../../src/api";

//== Transition
export const Fade: ITransition = {
    name: "default",
    duration: 500,

    out({ from }: ITransitionData) {
        let { duration } = this;
        let fromWrapper = from.wrapper;
        return new Promise(async resolve => {
            await animate({
                target: fromWrapper,
                opacity: [1, 0],
                duration,
                onfinish(el: { style: { opacity: string } }) {
                    requestAnimationFrame(() => {
                        el.style.opacity = "0";
                    });
                }
            });
            resolve();
        });
    },

    in({ to }: ITransitionData) {
        let { duration } = this;
        let toWrapper = to.wrapper;
        requestAnimationFrame(() => {
            toWrapper.style.transform = "translateX(0%)";
        });

        return animate({
            target: toWrapper,
            opacity: [0, 1],
            duration,
            onfinish(el: { style: { opacity?: string } }) {
                requestAnimationFrame(() => {
                    el.style.opacity = "1";
                    el.style = {};
                });
            }
        });
    }
};
// export class Fade extends Transition {
//     public name = "default";
//     public duration = 500;

//     out({ from }: ITransitionData) {
//         let { duration } = this;
//         let fromWrapper = from.wrapper;
//         return new Promise(async resolve => {
//             await animate({
//                 target: fromWrapper,
//                 opacity: [1, 0],
//                 duration,
//                 onfinish(el: { style: { opacity: string } }) {
//                     requestAnimationFrame(() => {
//                         el.style.opacity = "0";
//                     });
//                 }
//             });
//             resolve();
//         });
//     }

//     in({ to }: ITransitionData) {
//         let { duration } = this;
//         let toWrapper = to.wrapper;
//         requestAnimationFrame(() => {
//             toWrapper.style.transform = "translateX(0%)";
//         });

//         return animate({
//             target: toWrapper,
//             opacity: [0, 1],
//             duration,
//             onfinish(el: { style: { opacity?: string } }) {
//                 requestAnimationFrame(() => {
//                     el.style.opacity = "1";
//                     el.style = {};
//                 });
//             }
//         });
//     }
// }
