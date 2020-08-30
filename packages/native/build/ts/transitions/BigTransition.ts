import { Transition, ITransitionData } from "../../../src/api";
import { animate } from "@okikio/animate";

//== Transitions
export class BigTransition extends Transition {
    protected name = "big";
    protected delay = 200;
    protected durationPerAnimation = 700;
    protected mainElement: HTMLElement;
    protected verticalElements: HTMLDivElement[];
    protected horizontalElements: HTMLDivElement[];
    protected maxLength: number;
    protected spinnerElement: HTMLElement;

    public boot() {
        this.mainElement = document.getElementById('big-transition');
        this.spinnerElement = this.mainElement.querySelector('.spinner');
        this.horizontalElements = [...this.mainElement.querySelector('#big-transition-horizontal').querySelectorAll('div')];
        this.maxLength = this.horizontalElements.length;
        console.log(this.mainElement);
    }

    out({ from }: ITransitionData) {
        let { durationPerAnimation: duration, delay } = this;
        let fromWrapper = from.getWrapper();
        window.scroll({
            top: 0,
            behavior: 'smooth'  // 👈
        });

        return new Promise(async resolve => {
            animate({
                target: fromWrapper,
                opacity: [1, 0],
                duration,
                onfinish(el: { style: { opacity: string; }; }) {
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
                delay(i: number) {
                    return delay * (i + 1);
                },
                onfinish(el: { style: { transform: string; }; }) {
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
                onfinish(el: { style: { opacity: string; }; }) {
                    el.style.opacity = `1`;
                },
            });

            await animate({
                options,
                opacity: [1, 0],
                onfinish(el: { style: { opacity: string; }; }) {
                    el.style.opacity = `0`;
                },
                delay: 1500
            });

            this.spinnerElement.style.visibility = "hidden";
            resolve();
        });
    }

    in({ to }: ITransitionData) {
        let { durationPerAnimation: duration, delay } = this;
        let toWrapper = to.getWrapper();
        toWrapper.style.transform = "translateX(0%)";
        return new Promise(async resolve => {
            animate({
                target: toWrapper,
                opacity: [0, 1],
                onfinish(el: { style: { opacity: string; }; }) {
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
                delay(i: number) {
                    return delay * (i + 1);
                },
                onfinish(el: { style: { transform: string; }; }) {
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
