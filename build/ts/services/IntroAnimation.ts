import { Service, animate } from "../../../packages/native/src/api";
import toArr from "../toArr";

export class IntroAnimation extends Service {
    public elements: Array<Element>;
    public rootElement: HTMLElement;

    public init() {
        super.init();

        // Elements
        this.elements = toArr(document.querySelectorAll('.intro-animation'));
    }

    public newPage() {
        this.init();
        this.prepareToShow();
    }

    public initEvents() {
        this.emitter.on("CONTENT_REPLACED", this.newPage, this);
        this.emitter.on("BEFORE_TRANSITION_IN", this.show, this);
    }

    public stopEvents() {
        this.emitter.off("CONTENT_REPLACED", this.newPage, this);
        this.emitter.off("BEFORE_TRANSITION_IN", this.show, this);
    }

    public stop() {
        requestAnimationFrame(() => {
            for (let el of this.elements) {
                (el as HTMLElement).style.opacity = '1';
            }
        });

        super.stop();
    }

    public prepareToShow() {
        requestAnimationFrame(() => {
            for (let el of this.elements) {
                (el as HTMLElement).style.opacity = '0';
            }
        });
    }

    public async show() {
        let [anim] = await animate({
            target: (this.elements as HTMLElement[]),
            opacity: [0, 1],
            // @ts-ignore
            delay(i: number) {
                return 300 * (i + 1);
            },
            onfinish(el: { style: { transform: string; opacity: string; }; }) {
                requestAnimationFrame(() => {
                    el.style.opacity = "1";
                });
            },
            easing: "ease",
            duration: 850
        });
        anim.stop();
        return anim;
    }
}
