import { ITransition, ITransitionData, animate } from "../../../src/api";
// import { ITransition, ITransitionData } from "../../../src/transition";
// import { animate } from "../../../src/animate";

//== Transitions
export const Slide: ITransition = {
    name: "slide",
    duration: 500,
    direction: "right",
    scrollable: true,

    init(data: ITransition) {
        let trigger = (data.trigger as HTMLElement);
        if (trigger instanceof Node && trigger.hasAttribute("data-direction")) {
            this.direction = trigger.getAttribute("data-direction");
        } else {
            this.direction = "right";
        }
    },

    out({ from }: ITransitionData) {
        let { duration, direction } = this;
        let fromWrapper = from.wrapper;

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
        }).then(function () {
            this.stop();
        });
    },

    in({ to, scroll }: ITransitionData) {
        let { duration } = this;
        let toWrapper = to.wrapper;

        window.scroll(scroll.x, scroll.y);

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
        }).then(function () {
            this.stop();
        });
    }
};

export const SlideLeft: ITransition = {
    ...Slide,

    name: "slide-left",
    direction: "left",
};

export const SlideRight: ITransition = {
    ...Slide,

    name: "slide-right",
    direction: "right",
};
