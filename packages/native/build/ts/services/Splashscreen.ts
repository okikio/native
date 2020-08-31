import { Service } from "../../../src/api";
import { animate } from "@okikio/animate";

export class Splashscreen extends Service {
    public rootElement: HTMLElement;
    public innerEl: HTMLElement;
    public bgEl: HTMLElement;
    public minimalDuration: number = 1000; // ms

    public init() {
        super.init();

        // Elements
        this.rootElement = document.getElementById('splashscreen');
        if (this.rootElement) {
            this.innerEl = this.rootElement.querySelector('.splashscreen-inner');
            this.bgEl = this.rootElement.querySelector('.splashscreen-bg');
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
        await new Promise(resolve => {
            window.setTimeout(() => {
                this.EventEmitter.emit("BEFORE_SPLASHSCREEN_HIDE");
                resolve();
            }, this.minimalDuration);
        });

        await new Promise(async resolve => {
            animate({
                target: this.innerEl,
                opacity: [1, 0],
                autoplay: true,
                duration: 500,
                onfinish(el) {
                    el.style.opacity = "0";
                }
            });

            this.EventEmitter.emit("START_SPLASHSCREEN_HIDE");

            await this.show();
            resolve();
        });
    }

    public async show() {
        await animate({
            target: this.rootElement,
            transform: ["translateY(0%)", "translateY(100%)"],
            duration: 1200,
            easing: "in-out-cubic" // in-out-cubic
        });

        this.rootElement.style.transform = "translateY(100%)";
        this.rootElement.style.visibility = "hidden";
        this.rootElement.style.pointerEvents = "none";
    }
}
