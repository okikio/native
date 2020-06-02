import { Transition } from "./api.js";
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
        return new Promise(resolve => {
            let animation = fromWrapper.animate([
                { opacity: 1 },
                { opacity: 0 },
            ], {
                duration,
                easing: "ease"
            });
            animation.onfinish = () => {
                fromWrapper.style.opacity = "0";
                window.scrollTo(0, 0);
                resolve();
            };
        });
    }
    in({ to }) {
        let { duration } = this;
        let toWrapper = to.getWrapper();
        return new Promise(resolve => {
            let animation = toWrapper.animate([
                { opacity: 0 },
                { opacity: 1 },
            ], {
                duration,
                easing: "ease"
            });
            animation.onfinish = () => {
                toWrapper.style.opacity = "1";
                resolve();
            };
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
        let { duration } = this;
        let fromWrapper = from.getWrapper();
        window.scroll({
            top: 0,
            behavior: 'smooth' // 👈 
        });
        return new Promise(resolve => {
            let animation = fromWrapper.animate([
                { transform: "translateX(0%)", opacity: 1 },
                { transform: `translateX(${this.direction === "left" ? "-" : ""}25%)`, opacity: 0 },
            ], {
                duration,
                easing: "cubic-bezier(0.64, 0, 0.78, 0)" // ease-in-quint
            });
            animation.onfinish = () => {
                fromWrapper.style.opacity = "0";
                resolve();
            };
        });
    }
    in({ to }) {
        let toWrapper = to.getWrapper();
        return new Promise(resolve => {
            let animation = toWrapper.animate([
                { transform: `translateX(${this.direction === "left" ? "" : "-"}25%)`, opacity: 0 },
                { transform: "translateX(0%)", opacity: 1 },
            ], {
                duration: 750,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)" // ease-out-quint
            });
            animation.onfinish = () => {
                toWrapper.style.opacity = "1";
                resolve();
            };
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
        this.duration = 500;
    }
    boot() {
        this.mainElement = document.getElementById('big-transition');
        this.verticalElements = [...document.getElementById('big-transition-vertical').querySelectorAll('div')];
        this.horizontalElements = [...document.getElementById('big-transition-horizontal').querySelectorAll('div')];
        this.maxLength = Math.max(this.verticalElements.length, this.horizontalElements.length);
    }
    out({ from }) {
        let { duration } = this;
        let fromWrapper = from.getWrapper();
        window.scroll({
            top: 0,
            behavior: 'smooth' // 👈 
        });
        return new Promise(resolve => {
            let wrapperAnim = fromWrapper.animate([
                { opacity: 1 },
                { opacity: 0 },
            ], {
                duration,
                easing: "ease"
            });
            wrapperAnim.onfinish = () => {
                fromWrapper.style.opacity = "0";
            };
            this.mainElement.style.opacity = "1";
            this.mainElement.style.visibility = "visible";
            let count = 1;
            for (let el of this.horizontalElements) {
                let animation = el.animate([
                    { transform: "scaleX(0)" },
                    { transform: "scaleX(1)" },
                ], {
                    duration,
                    delay: 100 * count,
                    easing: "linear"
                });
                animation.onfinish = () => {
                    el.style.transform = "scaleX(1)";
                };
                count++;
            }
            count = 1;
            for (let el of this.verticalElements.reverse()) {
                let animation = el.animate([
                    { transform: "scaleY(0)" },
                    { transform: "scaleY(1)" },
                ], {
                    duration,
                    delay: 100 * count,
                    easing: "linear"
                });
                animation.onfinish = () => {
                    el.style.transform = "scaleY(1)";
                };
                count++;
            }
            window.setTimeout(resolve, this.maxLength * 100 + duration);
        });
    }
    in({ to }) {
        let { duration } = this;
        let toWrapper = to.getWrapper();
        return new Promise(resolve => {
            let wrapperAnim = toWrapper.animate([
                { opacity: 0 },
                { opacity: 1 },
            ], {
                duration,
                easing: "ease"
            });
            wrapperAnim.onfinish = () => {
                toWrapper.style.opacity = "1";
            };
            let count = 0;
            for (let el of this.horizontalElements) {
                let animation = el.animate([
                    { transform: "scaleX(1)" },
                    { transform: "scaleX(0)" },
                ], {
                    duration,
                    delay: 100 * count
                });
                animation.onfinish = () => {
                    el.style.transform = "scaleX(0)";
                };
                count++;
            }
            count = 0;
            for (let el of this.verticalElements) {
                let animation = el.animate([
                    { transform: "scaleY(1)" },
                    { transform: "scaleY(0)" },
                ], {
                    duration,
                    delay: 100 * count
                });
                animation.onfinish = () => {
                    el.style.transform = "scaleY(0)";
                };
                count++;
            }
            window.setTimeout(() => {
                this.mainElement.style.opacity = "0";
                this.mainElement.style.visibility = "hidden";
                resolve();
            }, this.maxLength * 100 + duration);
        });
    }
}
//# sourceMappingURL=transitions.js.map