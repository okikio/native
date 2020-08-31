import { Transition, ITransitionData, ITransition } from "../../../src/api";
import { animate } from "@okikio/animate";

//== Transitions
export class Slide extends Transition {
    public name = "slide";
    public duration = 500;
    public direction: string = "right";

    init(value: ITransition) {
        super.init(value);

        let trigger = (value.trigger as HTMLElement);
        if (trigger instanceof Node && trigger.hasAttribute("data-direction")) {
            this.direction = trigger.getAttribute("data-direction");
        } else {
            this.direction = "right";
        }
    }

    out({ from }: ITransitionData) {
        let { duration, direction } = this;
        let fromWrapper = from.getWrapper();
        // window.scroll({
        //     top: 0,
        //     behavior: 'smooth'  // 👈
        // });
        return animate({
            target: fromWrapper,
            keyframes: [
                { transform: "translateX(0%)", opacity: 1 },
                { transform: `translateX(${direction === "left" ? "-" : ""}25%)`, opacity: 0 },
            ],
            duration,
            easing: "in-quint",
            onfinish: (el: { style: { opacity: string; transform: string; }; }) => {
                requestAnimationFrame(() => {
                    el.style.opacity = '0';
                    el.style.transform = `translateX(${direction === "left" ? "-" : ""}25%)`;
                });
            }
        });
    }

    in({ to }: ITransitionData) {
        let { duration } = this;
        let toWrapper = to.getWrapper();
        return animate({
            target: toWrapper,
            keyframes: [
                { transform: `translateX(${this.direction === "right" ? "-" : ""}25%)`, opacity: 0 },
                { transform: "translateX(0%)", opacity: 1 },
            ],
            duration,
            easing: "out-quint",
            onfinish(el: { style: { opacity: string; transform: string; }; }) {
                requestAnimationFrame(() => {
                    el.style.opacity = '1';
                    el.style.transform = `translateX(0%)`;
                });
            }
        });
    }
}

export class SlideLeft extends Slide {
    public name = "slide-left";
    public duration = 500;
    public direction: string = "left";
}

export class SlideRight extends Slide {
    public name = "slide-right";
    public duration = 500;
    public direction: string = "right";
}
