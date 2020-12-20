import { ITransition, ITransitionData, animate } from "../../../src/api";
// import { ITransition, ITransitionData } from "../../../src/transition";
// import { animate } from "../../../src/animate";

//== Transition
export const Fade: ITransition = {
    name: "default",
    duration: 500,
    scrollable: true,

    out({ from }: ITransitionData) {
        let { duration } = this;
        let fromWrapper = from.wrapper;
        return animate({
            target: fromWrapper,
            opacity: [1, 0],
            duration,
            onfinish(el: { style: { opacity: string } }) {
                requestAnimationFrame(() => {
                    el.style.opacity = "0";
                });
            }
        }).on("finish", function () {
            this.stop();
        });
    },

    in({ to, scroll }: ITransitionData) {
        let { duration } = this;
        let toWrapper = to.wrapper;
        requestAnimationFrame(() => {
            toWrapper.style.transform = "translateX(0%)";
        });

        window.scroll(scroll.x, scroll.y);

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
        }).then(function () {
            this.stop();
        });
    }
};
