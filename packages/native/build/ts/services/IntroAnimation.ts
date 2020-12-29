import { Service, animate } from "../../../src/api";

export class IntroAnimation extends Service {
    public elements: Array<Element>;
    public rootElement: HTMLElement;

    public init() {
        super.init();

        // Elements
        this.elements = [...document.querySelectorAll('.intro-animation')];
    }

    public newPage() {
        this.init();
        this.prepareToShow();
    }

    public initEvents() {
        this.emitter.on("BEFORE_SPLASHSCREEN_HIDE", this.prepareToShow, this);
        this.emitter.on("CONTENT_REPLACED", this.newPage, this);
        this.emitter.on("START_SPLASHSCREEN_HIDE BEFORE_TRANSITION_IN", this.show, this);
    }

    public stopEvents() {
        this.emitter.off("BEFORE_SPLASHSCREEN_HIDE", this.prepareToShow, this);
        this.emitter.off("CONTENT_REPLACED", this.newPage, this);
        this.emitter.off("START_SPLASHSCREEN_HIDE BEFORE_TRANSITION_IN", this.show, this);
    }

    public stop() {
        requestAnimationFrame(() => {
            for (let el of this.elements) {
                (el as HTMLElement).style.transform = "translateY(0px)";
                (el as HTMLElement).style.opacity = '1';
            }
        });

        super.stop();
    }

    public prepareToShow() {
        requestAnimationFrame(() => {
            for (let el of this.elements) {
                (el as HTMLElement).style.transform = "translateY(200px)";
                (el as HTMLElement).style.opacity = '0';
            }
        });
    }

    public async show() {
        let anim = animate({
            target: (this.elements as HTMLElement[]),
            keyframes: [
                { transform: "translateY(200px)", opacity: 0 },
                { transform: "translateY(0px)", opacity: 1 },
            ],
            // @ts-ignore
            delay(i: number) {
                return 300 * (i + 1);
            },
            onfinish(el: { style: { transform: string; opacity: string; }; }) {
                requestAnimationFrame(() => {
                    el.style.transform = "translateY(0px)";
                    el.style.opacity = "1";
                });
            },
            easing: "out-cubic",
            duration: 650
        });
        let result = await anim;
        anim.stop();
        return result;
    }
}
