import { Service } from "./api.js";

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

        await new Promise(resolve => {
            let elInner = this.innerEl.animate([
                { opacity: '1' },
                { opacity: '0' },
            ], {
                duration: 500,
                fill: "forwards"
            });
            // elInner.onfinish = () => {
            //     this.innerEl.style.opacity = '0';
            // };

            this.EventEmitter.emit("START_SPLASHSCREEN_HIDE");

            let rootEl = this.rootElement.animate([
                { transform: "translateY(0%)" },
                { transform: "translateY(100%)" }
            ], {
                duration: 1200,
                fill: "forwards",
                easing: "cubic-bezier(0.65, 0, 0.35, 1)" // ease-in-out-cubic
            });
            rootEl.onfinish = () => {
                this.rootElement.style.visibility = "hidden";
                this.rootElement.style.pointerEvents = "none";
                // this.rootElement.style.transform = "translateY(100%)";
                this.EventEmitter.emit("AFTER_SPLASHSCREEN_HIDE");

                resolve();
            };
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
        // this.EventEmitter.on("BEFORE_TRANSITION_IN", () => {
        //     this.boot();
        //     this.prepareToShow();
        // });
        // this.EventEmitter.on("AFTER_TRANSITION_IN", this.show);
    }

    public stopEvents() {
        this.EventEmitter.off("BEFORE_SPLASHSCREEN_HIDE", this.prepareToShow);
        this.EventEmitter.off("START_SPLASHSCREEN_HIDE", this.show);
        this.EventEmitter.off("BEFORE_TRANSITION_IN", () => {
            this.boot();
            this.prepareToShow();
        });
        this.EventEmitter.off("AFTER_TRANSITION_IN", this.show);
    }

    public prepareToShow() {
        for (let el of this.elements) {
            (el as HTMLElement).style.transform = "translateY(200px)";
            (el as HTMLElement).style.opacity = '0';
        }
    }

    public show() {
        let count = 1;
        for (let el of this.elements) {
            let animation = (el as HTMLElement).animate([
                { transform: "translateY(200px)", opacity: 0 },
                { transform: "translateY(0px)", opacity: 1 },
            ], {
                duration: 1200,
                delay: 200 * count,
                fill: "forwards",
                easing: "cubic-bezier(0.33, 1, 0.68, 1)" // ease-out-cubic
            });
            // animation.onfinish = () => {
            //     // (el as HTMLElement).style.opacity = '1';
            //     // (el as HTMLElement).style.transform = "translateY(0)";
            // }
            count++;
        }
    }
}

// export class InView extends Service {
//     protected rootElements: Node[];
//     protected observers: IntersectionObserver[];
//     protected observerOptions: { root: any; rootMargin: string; threshold: number; };
//     protected imgs: Manager<number, Node[]>;
//     protected direction: string[];
//     protected xPercent: number[];
//     public onScreenEl: boolean[];

//     public boot() {
//         this.rootElements = [...document.querySelectorAll('[data-node-type="InViewBlock"]')];

//         // Values
//         this.observers = [];
//         this.observerOptions = {
//             root: null,
//             rootMargin: '0px',
//             threshold: 0.1
//         };

//         // Bind method
//         this.onIntersectionCallback = this.onIntersectionCallback.bind(this);

//         // Create observers
//         for (let i = 0, len = this.rootElements.length; i < len; i++) {
//             this.observers[i] = new IntersectionObserver(entries => {
//                 this.onIntersectionCallback([i, entries]);
//             }, this.observerOptions);
//         }

//         // Add block rootElement in the observer
//         this.observe();

//         // Prepare values
//         this.imgs = new Manager<number, Node[]>();
//         this.onScreenEl = [];
//         this.direction = [];
//         this.xPercent = [];

//         for (let i = 0, len = this.rootElements.length; i < len; i++) {
//             let rootElement = this.rootElements[i] as HTMLElement;
//             if (rootElement.hasAttribute('data-direction')) {
//                 this.direction[i] = rootElement.getAttribute('data-direction');
//             } else {
//                 this.direction[i] = "right";
//             }

//             if (this.direction[i] === 'left') {
//                 this.xPercent[i] = -(typeof this.xPercent[i] === "undefined" ? 30 : this.xPercent[i]);
//             } else {
//                 this.xPercent[i] = typeof this.xPercent[i] === "undefined" ? 30 : this.xPercent[i];
//             }

//             // Find elements
//             this.imgs.set(i, [...rootElement.querySelectorAll('img')]);
//         }
//     }

//     public initEvents() {
//         this.EventEmitter.on("BEFORE_TRANSITION_OUT", () => {
//             this.unobserve();
//         });
//         this.EventEmitter.on("BEFORE_TRANSITION_IN", () => {
//             this.boot();
//         });
//     }

//     observe() {
//         for (let i = 0, len = this.rootElements.length; i < len; i++) {
//             this.observers[i].observe(this.rootElements[i] as HTMLElement);
//         }
//     }

//     unobserve() {
//         for (let i = 0, len = this.rootElements.length; i < len; i++) {
//             this.observers[i].unobserve(this.rootElements[i] as HTMLElement);
//         }
//     }

//     stopEvents() {
//         this.unobserve();
//     }

//     onIntersectionCallback([i, entries]) {
//         for (let entry of entries) {
//             if (!this.onScreenEl[i]) {
//                 if (entry.intersectionRatio > 0) {
//                     this.onScreen([i, entry])
//                 } else {
//                     this.offScreen([i, entry])
//                 }
//             }
//         }
//     }

//     onScreen([i, { target }]) {
//         let animation = target.animate([
//             { transform: `translateX(${this.xPercent[i]}%)`, opacity: 0 },
//             { transform: "translateX(0%)", opacity: 1 },
//         ], {
//             duration: 1500,
//             delay: 0.15,
//             easing: "cubic-bezier(0.22, 1, 0.36, 1)" // ease-out-quint
//         });
//         animation.onfinish = () => {
//             target.style.transform = "translateX(0%)";
//             target.style.opacity = "1";
//             this.onScreenEl[i] = true;
//         };
//     }

//     offScreen([i, { target }]) {
//         target.style.transform = `translateX(${this.xPercent[i]}%)`;
//         target.style.opacity = "0";
//     }
// }
