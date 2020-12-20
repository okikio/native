import { Service, animate } from "../../../src/api";
// import { Service } from "../../../src/service";
// import { animate } from "../../../src/animate";

export class Splashscreen extends Service {
    public rootElement: HTMLElement;
    public innerEl: HTMLElement;
    public bgEl: HTMLElement;
    public minimalDuration: number = 1000; // ms
    spinnerEl: Element[];

    public init() {
        super.init();

        // Elements
        this.rootElement = document.getElementById('splashscreen');
        if (this.rootElement) {
            this.innerEl = this.rootElement.querySelector('.splashscreen-inner');
            this.bgEl = this.rootElement.querySelector('.splashscreen-bg');
            this.spinnerEl = [...this.rootElement.querySelectorAll('.spinner')];
        }

        this.rootElement.style.visibility = "visible";
        this.rootElement.style.pointerEvents = "auto";
    }

    public boot() {
        if (this.rootElement) {
            this.hide();
        }
    }

    public async hide() {
        await new Promise<void>(resolve => {
            window.setTimeout(() => {
                this.emitter.emit("BEFORE_SPLASHSCREEN_HIDE");
                resolve();
            }, this.minimalDuration);
        });

        await new Promise<void>(async resolve => {
            animate({
                target: this.innerEl,
                opacity: [1, 0],
                autoplay: true,
                duration: 500,
                onfinish(el) {
                    el.style.opacity = "0";
                }
            }).then(function () { this.stop(); });

            this.emitter.emit("START_SPLASHSCREEN_HIDE");
            await this.show();
            resolve();
        });
    }

    public async show() {
        let anim = animate({
            target: this.rootElement,
            transform: ["translateY(0%)", "translateY(100%)"],
            duration: 1200,
            easing: "in-out-cubic" // in-out-cubic
        });
        await anim;
        anim.stop();

        this.rootElement.style.transform = "translateY(100%)";
        this.rootElement.style.visibility = "hidden";
        this.rootElement.style.pointerEvents = "none";
    }
}
