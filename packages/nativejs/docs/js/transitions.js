import { Transition } from "../../lib/core.js";
import { animate } from "walijs";
//== Transitions
export class Fade extends Transition {
    constructor() {
        super(...arguments);
        this.name = "default";
        this.duration = 500;
    }
    out({ from }) {
        let { duration } = this;
        let fromWrapper = from.getWrapper();
        window.scroll({
            top: 0,
            behavior: 'smooth' // 👈 
        });
        return new Promise(async (resolve) => {
            await animate({
                target: fromWrapper,
                opacity: [1, 0],
                duration,
                onfinish(el) {
                    el.style.opacity = '0';
                }
            });
            window.scrollTo(0, 0);
            resolve();
        });
    }
    in({ to }) {
        let { duration } = this;
        let toWrapper = to.getWrapper();
        toWrapper.style.transform = "translateX(0%)";
        return animate({
            target: toWrapper,
            opacity: [0, 1],
            duration,
            onfinish(el) {
                el.style.opacity = '1';
            }
        });
    }
}
export class Slide extends Transition {
    constructor() {
        super(...arguments);
        this.name = "slide";
        this.duration = 500;
        this.direction = "right";
    }
    out({ from }) {
        let { duration, direction } = this;
        let fromWrapper = from.getWrapper();
        window.scroll({
            top: 0,
            behavior: 'smooth' // 👈 
        });
        return animate({
            target: fromWrapper,
            keyframes: [
                { transform: "translateX(0%)", opacity: 1 },
                { transform: `translateX(${direction === "left" ? "-" : ""}25%)`, opacity: 0 },
            ],
            duration,
            easing: "in-quint",
            onfinish: (el) => {
                el.style.opacity = '0';
                el.style.transform = `translateX(${direction === "left" ? "-" : ""}25%)`;
            }
        });
    }
    in({ to }) {
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
            onfinish(el) {
                el.style.opacity = '1';
                el.style.transform = `translateX(0%)`;
            }
        });
    }
}
export class SlideLeft extends Slide {
    constructor() {
        super(...arguments);
        this.name = "slide-left";
        this.duration = 500;
        this.direction = "left";
    }
}
export class SlideRight extends Slide {
    constructor() {
        super(...arguments);
        this.name = "slide-right";
        this.duration = 500;
        this.direction = "right";
    }
}
export class BigTransition extends Transition {
    constructor() {
        super(...arguments);
        this.name = "big";
        this.delay = 200;
        this.durationPerAnimation = 700;
    }
    boot() {
        this.mainElement = document.getElementById('big-transition');
        this.spinnerElement = this.mainElement.querySelector('.spinner');
        this.horizontalElements = [...this.mainElement.querySelector('#big-transition-horizontal').querySelectorAll('div')];
        this.maxLength = this.horizontalElements.length;
    }
    out({ from }) {
        let { durationPerAnimation: duration, delay } = this;
        let fromWrapper = from.getWrapper();
        window.scroll({
            top: 0,
            behavior: 'smooth' // 👈 
        });
        return new Promise(async (resolve) => {
            animate({
                target: fromWrapper,
                opacity: [1, 0],
                duration,
                onfinish(el) {
                    el.style.opacity = '0';
                }
            });
            this.mainElement.style.opacity = "1";
            this.mainElement.style.visibility = "visible";
            await animate({
                target: this.horizontalElements,
                keyframes: [
                    { transform: "scaleX(0)" },
                    { transform: "scaleX(1)" },
                ],
                // @ts-ignore
                delay(i) {
                    return delay * (i + 1);
                },
                onfinish(el) {
                    el.style.transform = `scaleX(1)`;
                },
                easing: "out-cubic",
                duration: 500
            });
            let loaderDuration = 500;
            this.spinnerElement.style.visibility = "visible";
            let options = await animate({
                target: this.spinnerElement,
                opacity: [0, 1],
                duration: loaderDuration,
                onfinish(el) {
                    el.style.opacity = `1`;
                },
            });
            await animate({
                options,
                opacity: [1, 0],
                onfinish(el) {
                    el.style.opacity = `0`;
                },
                delay: 1500
            });
            this.spinnerElement.style.visibility = "hidden";
            resolve();
        });
    }
    in({ to }) {
        let { durationPerAnimation: duration, delay } = this;
        let toWrapper = to.getWrapper();
        toWrapper.style.transform = "translateX(0%)";
        return new Promise(async (resolve) => {
            animate({
                target: toWrapper,
                opacity: [0, 1],
                onfinish(el) {
                    el.style.opacity = `1`;
                },
                duration
            });
            await animate({
                target: this.horizontalElements,
                keyframes: [
                    { transform: "scaleX(1)" },
                    { transform: "scaleX(0)" },
                ],
                // @ts-ignore
                delay(i) {
                    return delay * (i + 1);
                },
                onfinish(el) {
                    el.style.transform = `scaleX(0)`;
                },
                easing: "out-cubic",
                duration: 500
            });
            this.mainElement.style.opacity = "0";
            this.mainElement.style.visibility = "hidden";
            resolve();
        });
    }
}
//# sourceMappingURL=ts/transitions.js.map
