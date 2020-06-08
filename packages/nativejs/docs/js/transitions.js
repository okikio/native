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
                fill: "forwards",
                easing: "ease"
            });
            animation.onfinish = () => {
                // fromWrapper.style.opacity = "0";
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
                fill: "forwards",
                easing: "ease"
            });
            animation.onfinish = () => {
                // toWrapper.style.opacity = "1";
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
                // fill: "forwards",
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
        return new Promise(resolve => {
            let wrapperAnim = fromWrapper.animate([
                { opacity: 1 },
                { opacity: 0 },
            ], {
                duration,
                fill: "forwards",
                easing: "ease"
            });
            // wrapperAnim.onfinish = () => {
            //     fromWrapper.style.opacity = "0";
            // };
            this.mainElement.style.opacity = "1";
            this.mainElement.style.visibility = "visible";
            let count = 1;
            for (let el of this.horizontalElements) {
                let animation = el.animate([
                    { transform: "scaleX(0)" },
                    { transform: "scaleX(1)" },
                ], {
                    duration,
                    fill: "forwards",
                    delay: delay * count,
                    easing: "ease"
                });
                // animation.onfinish = () => {
                //     el.style.transform = "scaleX(1)";
                // };
                count++;
            }
            window.setTimeout(() => {
                let loaderDuration = 500;
                this.spinnerElement.style.visibility = "visible";
                let animation = this.spinnerElement.animate([
                    { opacity: 0 },
                    { opacity: 1 },
                ], {
                    duration: loaderDuration,
                    fill: "forwards",
                    easing: "ease"
                });
                animation.onfinish = () => {
                    // this.spinnerElement.style.opacity = "1";
                    let animation = this.spinnerElement.animate([
                        { opacity: 1 },
                        { opacity: 0 },
                    ], {
                        duration: loaderDuration,
                        fill: "forwards",
                        delay: 3000,
                        easing: "ease"
                    });
                    animation.onfinish = () => {
                        // this.spinnerElement.style.opacity = "0";
                        this.spinnerElement.style.visibility = "hidden";
                        resolve();
                    };
                };
            }, this.maxLength * delay + duration);
        });
    }
    in({ to }) {
        let { durationPerAnimation: duration, delay } = this;
        let toWrapper = to.getWrapper();
        return new Promise(resolve => {
            let wrapperAnim = toWrapper.animate([
                { opacity: 0 },
                { opacity: 1 },
            ], {
                duration,
                fill: "forwards",
                easing: "ease"
            });
            wrapperAnim.onfinish = () => {
                // toWrapper.style.opacity = "1";
            };
            let count = 1;
            for (let el of this.horizontalElements) {
                let animation = el.animate([
                    { transform: "scaleX(1)" },
                    { transform: "scaleX(0)" },
                ], {
                    duration,
                    fill: "forwards",
                    delay: delay * count,
                    easing: "ease"
                });
                animation.onfinish = () => {
                    // el.style.transform = "scaleX(0)";
                };
                count++;
            }
            window.setTimeout(() => {
                this.mainElement.style.opacity = "0";
                this.mainElement.style.visibility = "hidden";
                resolve();
            }, this.maxLength * delay + duration);
        });
    }
}

//# sourceMappingURL=transitions.js.map
