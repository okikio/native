import { Service, animate } from "./api.js";

//== Services
export class Splashscreen extends Service {
    protected rootElement: HTMLElement;
    protected innerEl: HTMLElement;
    protected bgEl: HTMLElement;
    protected minimalDuration: number = 1000; // ms

    public boot() {
        // Elements
        this.rootElement = document.getElementById('splashscreen');
        if (this.rootElement) {
            this.innerEl = this.rootElement.querySelector('.splashscreen-inner');
            this.bgEl = this.rootElement.querySelector('.splashscreen-bg');
        }

        this.rootElement.style.visibility = "visible";
        this.rootElement.style.pointerEvents = "auto";
    }

    public initEvents() {
        if (this.rootElement) {
            this.hide();
        }
    }

    // You need to override this method
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
    protected elements: Array<Element>;
    protected rootElement: HTMLElement;

    public boot() {
        // Elements
        this.elements = [...document.querySelectorAll('[data-block="IntroBlock"]')];

        // Bind methods
        this.prepareToShow = this.prepareToShow.bind(this);
        this.show = this.show.bind(this);
    }

    public initEvents() {
        this.EventEmitter.on("BEFORE_SPLASHSCREEN_HIDE", this.prepareToShow);
        this.EventEmitter.on("START_SPLASHSCREEN_HIDE", this.show);
    }

    public stopEvents() {
        this.EventEmitter.off("BEFORE_SPLASHSCREEN_HIDE", this.prepareToShow);
        this.EventEmitter.off("START_SPLASHSCREEN_HIDE", this.show);
    }

    public prepareToShow() {
        for (let el of this.elements) {
            (el as HTMLElement).style.transform = "translateY(200px)";
            (el as HTMLElement).style.opacity = '0';
        }
    }

    public show() {
        animate({
            target: (this.elements as HTMLElement[]),
            keyframes: [
                { transform: "translateY(200px)", opacity: 0 },
                { transform: "translateY(0px)", opacity: 1 },
            ],
            // @ts-ignore
            delay(i: number) {
                return 200 * (i + 1);
            },
            onfinish(el: { style: { transform: string; opacity: string; }; }) {
                el.style.transform = "translateY(0px)";
                el.style.opacity = "1";
            },
            easing: "out-cubic",
            duration: 500
        });
    }
}