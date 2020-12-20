import { ITransition, ITransitionData, animate } from "../../../src/api";
// import { ITransition, ITransitionData } from "../../../src/transition";
// import { animate } from "../../../src/animate";

//== Transitions
export const BigTransition: ITransition = {
    name: "big",
    delay: 200,
    durationPerAnimation: 700,
    scrollable: true,

    init() {
        this.mainElement = document.getElementById('big-transition');
        this.spinnerElement = this.mainElement.querySelector('.spinner');
        this.horizontalElements = [...this.mainElement.querySelector('#big-transition-horizontal').querySelectorAll('div')];
        this.maxLength = this.horizontalElements.length;
    },

    out({ from, scroll }: ITransitionData) {
        let { durationPerAnimation: duration, delay } = this;
        let fromWrapper = from.wrapper;

        window.scroll(scroll.x, scroll.y);
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

            anim1.then(function () { this.stop() });

            let anim2 = animate({
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

            await anim2;
            this.spinnerElement.style.visibility = "visible";

            let loaderDuration = 500;
            let anim3 = animate({
                target: this.spinnerElement,
                opacity: [0, 1],
                duration: loaderDuration,
                onfinish(el: { style: { opacity: string; }; }) {
                    el.style.opacity = `1`;
                },
            });

            let options = await anim3;
            let anim4 = animate({
                options,
                opacity: [1, 0],
                onfinish(el: { style: { opacity: string; }; }) {
                    el.style.opacity = `0`;
                },
                delay: 1500
            });

            await anim4;
            this.spinnerElement.style.visibility = "hidden";
            // anim2.stop() // -> anim2.stop() Breaks the Animation
            anim3.stop();
            anim4.stop();
            resolve();
        });
    },

    in({ to, scroll }: ITransitionData) {
        let { durationPerAnimation: duration, delay } = this;
        let toWrapper = to.wrapper;
        toWrapper.style.transform = "translateX(0%)";

        window.scroll(scroll.x, scroll.y);

        return new Promise<void>(async resolve => {
            let anim1 = animate({
                target: toWrapper,
                opacity: [0, 1],
                onfinish(el: { style: { opacity: string; }; }) {
                    el.style.opacity = `1`;
                },
                duration
            }).then(() => {
                anim1.stop();
            });

            let anim2 = animate({
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

            await anim2;

            this.mainElement.style.opacity = "0";
            this.mainElement.style.visibility = "hidden";
            anim2.stop();
            resolve();
        });
    }
}
