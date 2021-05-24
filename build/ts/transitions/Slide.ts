import { ITransition, ITransitionData, animate } from "@okikio/native";

//== Transitions
export const Slide: ITransition = {
    name: "slide",
    duration: 500,
    direction: "right",

    init(data: ITransition) {
        document.documentElement.classList.add("no-overflow-x");
        let trigger = (data.trigger as HTMLElement);
        if (trigger instanceof Node && trigger.hasAttribute("data-direction")) {
            this.direction = trigger.getAttribute("data-direction");
        } else {
            this.direction = "right";
        }
    },

    out({ from }) {
        let { duration, direction } = this;
        let fromWrapper = from.wrapper;

        let anim = animate({
            target: fromWrapper,
            translateX: [0, `${(direction === "left" ? -1 : 1) * 25}%`],
            opacity: [1, 0],
            duration,
            easing: "in-quint"
        });

        return anim.then(function () {
            this.stop();
        });
    },

    async in({ to }) {
        let { duration } = this;
        let toWrapper = to.wrapper;

        let anim = animate({
            target: toWrapper,
            translateX: [`${(this.direction === "right" ? -1 : 1) * 25}%`, 0],
            opacity: [0, 1],
            duration,
            easing: "out-quint"
        })

        await anim;

        document.documentElement.classList.remove("no-overflow-x");
        anim.stop();
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
