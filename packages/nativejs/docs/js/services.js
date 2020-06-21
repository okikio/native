import { Service } from "../../lib/core.js";
import { animate } from "walijs";
//== Services
export class Splashscreen extends Service {
    constructor() {
        super(...arguments);
        this.minimalDuration = 1000; // ms
    }
    boot() {
        // Elements
        this.rootElement = document.getElementById('splashscreen');
        if (this.rootElement) {
            this.innerEl = this.rootElement.querySelector('.splashscreen-inner');
            this.bgEl = this.rootElement.querySelector('.splashscreen-bg');
        }
        this.rootElement.style.visibility = "visible";
        this.rootElement.style.pointerEvents = "auto";
    }
    initEvents() {
        if (this.rootElement) {
            this.hide();
        }
    }
    // You need to override this method
    async hide() {
        await new Promise(resolve => {
            window.setTimeout(() => {
                this.EventEmitter.emit("BEFORE_SPLASHSCREEN_HIDE");
                resolve();
            }, this.minimalDuration);
        });
        await new Promise(async (resolve) => {
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
            await animate({
                target: this.rootElement,
                transform: ["translateY(0%)", "translateY(100%)"],
                duration: 1200,
                easing: "in-out-cubic" // in-out-cubic
            });
            this.rootElement.style.transform = "translateY(100%)";
            this.rootElement.style.visibility = "hidden";
            this.rootElement.style.pointerEvents = "none";
            this.EventEmitter.emit("AFTER_SPLASHSCREEN_HIDE");
            resolve();
        });
    }
}
export class IntroAnimation extends Service {
    boot() {
        // Elements
        this.elements = [...document.querySelectorAll('[data-block="IntroBlock"]')];
        // Bind methods
        this.prepareToShow = this.prepareToShow.bind(this);
        this.show = this.show.bind(this);
    }
    initEvents() {
        this.EventEmitter.on("BEFORE_SPLASHSCREEN_HIDE", this.prepareToShow);
        this.EventEmitter.on("START_SPLASHSCREEN_HIDE", this.show);
    }
    stopEvents() {
        this.EventEmitter.off("BEFORE_SPLASHSCREEN_HIDE", this.prepareToShow);
        this.EventEmitter.off("START_SPLASHSCREEN_HIDE", this.show);
    }
    prepareToShow() {
        for (let el of this.elements) {
            el.style.transform = "translateY(200px)";
            el.style.opacity = '0';
        }
    }
    show() {
        animate({
            target: this.elements,
            keyframes: [
                { transform: "translateY(200px)", opacity: 0 },
                { transform: "translateY(0px)", opacity: 1 },
            ],
            // @ts-ignore
            delay(i) {
                return 200 * (i + 1);
            },
            onfinish(el) {
                el.style.transform = "translateY(0px)";
                el.style.opacity = "1";
            },
            easing: "out-cubic",
            duration: 500
        });
    }
}
//# sourceMappingURL=ts/services.js.map
