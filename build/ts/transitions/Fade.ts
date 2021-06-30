import { animate } from "@okikio/animate";

import type { ITransition, ITransitionData } from "@okikio/native";

//== Transition
export const Fade: ITransition = {
    name: "default",
    duration: 500,
    manualScroll: true,

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
