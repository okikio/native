import { ITransition, ITransitionData, animate } from "../../../packages/native/src/api";

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
        }).on("finish", function () {
            this.stop();
        });
    },

    in({ to, scroll }: ITransitionData) {
        let { duration } = this;
        let toWrapper = to.wrapper;

        window.scroll(scroll.x, scroll.y);
        return animate({
            target: toWrapper,
            opacity: [0, 1],
            duration
        }).then(function () {
            this.stop();
        });
    }
};
