import { ITransition, ITransitionData, animate } from "../../../packages/native/src/api";
import toArr from "../toArr";

//== Transitions
export const BigTransition: ITransition = {
    name: "big",
    delay: 200,
    durationPerAnimation: 700,
    scrollable: true,

    init() {
        this.mainElement = document.getElementById('big-transition');
        this.logoElement = this.mainElement.querySelector('#logo');
        this.horizontalElements = toArr(this.mainElement.querySelectorAll('#big-transition-horizontal div'));
        this.maxLength = this.horizontalElements.length;
    },

    out({ from, scroll }: ITransitionData) {
        let { durationPerAnimation: duration, delay } = this;
        let fromWrapper = from.wrapper;

        let wrapperStyle = Object.assign({}, fromWrapper.style);
        return new Promise<void>(async resolve => {
            this.mainElement.style.opacity = "1";
            this.mainElement.style.visibility = "visible";
            let anim1 = animate({
                target: fromWrapper,
                opacity: [1, 0],
                duration,
                onfinish(el: { style: { opacity: string; }; }) {
                    el.style.opacity = '0';
                }
            });

            anim1.then(function () { this.stop(); });

            let [anim2] = await animate({
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

            fromWrapper.style.opacity = '1';
            Object.assign(fromWrapper.style, wrapperStyle);
            this.logoElement.style.visibility = "visible";

            let loaderDuration = 500;
            let [anim3] = await animate({
                target: this.logoElement,
                opacity: [0, 1],
                duration: loaderDuration,
                onfinish(el: { style: { opacity: string; }; }) {
                    el.style.opacity = `1`;
                },
            });

            let [anim4] = await animate({
                options: anim3,
                opacity: [1, 0],
                onfinish(el: { style: { opacity: string; }; }) {
                    el.style.opacity = `0`;
                },
                delay: 1500
            });
            this.logoElement.style.visibility = "hidden";
            // anim2.stop() // -> anim2.stop() Breaks the Animation
            anim3.stop();
            anim4.stop();
            resolve();
        });
    },

    in({ to, scroll }: ITransitionData) {
        let { durationPerAnimation: duration, delay } = this;
        let toWrapper = to.wrapper;

        window.scroll(scroll.x, scroll.y);
        return new Promise<void>(async resolve => {
            let anim1 = animate({
                target: toWrapper,
                opacity: [0, 1],
                duration
            }).then(() => {
                anim1.stop();
            });

            let [anim2] = await animate({
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
            anim2.stop();
            resolve();
        });
    }
}
