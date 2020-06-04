import { Transition, ITransitionData } from "./api.js";

//== Transitions
export class Fade extends Transition {
    protected name = "default";
    protected duration = 500;

    out({ from }: ITransitionData) {
        let { duration } = this;
        let fromWrapper = from.getWrapper();
        window.scroll({
            top: 0,
            behavior: 'smooth'  // 👈 
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

    in({ to }: ITransitionData) {
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
    protected name = "slide";
    protected duration = 500;
    protected direction: string = "right";

    out({ from }: ITransitionData) {
        let { duration } = this;
        let fromWrapper = from.getWrapper();
        window.scroll({
            top: 0,
            behavior: 'smooth'  // 👈 
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

    in({ to }: ITransitionData) {
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
    protected name = "slide-left";
    protected duration = 500;
    protected direction: string = "left";
}

export class SlideRight extends Slide {
    protected name = "slide-right";
    protected duration = 500;
    protected direction: string = "right";
}

export class BigTransition extends Transition {
    protected name = "big";
    protected duration = 500;
    protected mainElement: HTMLElement;
    protected verticalElements: HTMLDivElement[];
    protected horizontalElements: HTMLDivElement[];
    protected maxLength: number;

    public boot() {
        this.mainElement = document.getElementById('big-transition');
        this.verticalElements = [...document.getElementById('big-transition-vertical').querySelectorAll('div')];
        this.horizontalElements = [...document.getElementById('big-transition-horizontal').querySelectorAll('div')];
        this.maxLength = Math.max(this.verticalElements.length, this.horizontalElements.length);
    }

    out({ from }: ITransitionData) {
        let { duration } = this;
        let fromWrapper = from.getWrapper();
        window.scroll({
            top: 0,
            behavior: 'smooth'  // 👈 
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
            let delay = 50;
            for (let el of this.horizontalElements) {
                let animation = el.animate([
                    { transform: "scaleX(0)" },
                    { transform: "scaleX(1)" },
                ], {
                    duration,
                    delay: delay * count,
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
                    delay: delay * count,
                    easing: "linear"
                });
                animation.onfinish = () => {
                    el.style.transform = "scaleY(1)";
                };
                count++;
            }

            window.setTimeout(resolve, this.maxLength * delay + duration);
        });
    }

    in({ to }: ITransitionData) {
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
            let delay = 50;
            for (let el of this.horizontalElements) {
                let animation = el.animate([
                    { transform: "scaleX(1)" },
                    { transform: "scaleX(0)" },
                ], {
                    duration,
                    delay: delay * count
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
                    delay: delay * count
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
            }, this.maxLength * delay + duration);
        });
    }
}

