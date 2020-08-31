import { Transition, ITransitionData } from "../../../src/api";
import { animate } from "@okikio/animate";

//== Transitions
export class Fade extends Transition {
    public name = "default";
    public duration = 500;

    out({ from }: ITransitionData) {
        let { duration } = this;
        let fromWrapper = from.getWrapper();
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
    }

    in({ to }: ITransitionData) {
        let { duration } = this;
        let toWrapper = to.getWrapper();
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
}
