import { Block } from "../../src/api";
import { animate } from "walijs/src/api";

//== Blocks
export class InViewBlock extends Block {
    protected observer: IntersectionObserver;
    protected observerOptions: { root: any; rootMargin: string; threshold?: number, thresholds?: Array<number>; };
    protected imgs: HTMLElement[];
    protected direction: string;
    protected xPercent: number;
    protected inView: boolean = false;

    public boot() {
        // Values
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            thresholds: Array.from(Array(20), (_nul, x) => (x + 1) / 20)
        };

        // Create observer
        this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            this.onIntersectionCallback(entries);
        }, this.observerOptions);

        // Prepare values
        this.imgs = [];
        this.direction = "right";
        this.xPercent = 30;

        if (this.rootElement.hasAttribute('data-direction')) {
            this.direction = this.rootElement.getAttribute('data-direction');
        }

        if (this.direction === 'left') {
            this.xPercent = -this.xPercent;
        }

        // Find elements
        this.imgs = [...this.rootElement.querySelectorAll('img')];

        // Add block rootElement in the observer
        this.observe();
    }

    protected observe() {
        this.observer.observe(this.rootElement);
    }

    protected unobserve() {
        this.observer.unobserve(this.rootElement);
    }

    protected onScreen() {
        animate({
            target: this.rootElement,
            transform: [`translateX(${this.xPercent}%)`, "translateX(0%)"],
            opacity: [0, 1],
            duration: 1500,
            delay: 0.15,
            easing: "out-quint",
            onfinish(el) {
                el.style.transform = "translateX(0%)";
                el.style.opacity = "1";
            },
        });
    }

    protected offScreen() {
        this.rootElement.style.transform = `translateX(${this.xPercent}%)`;
        this.rootElement.style.opacity = "0";
    }

    public onIntersectionCallback(entries: IntersectionObserverEntry[]) {
        for (let entry of entries) {
            if (entry.intersectionRatio > 0) {
                this.onScreen();
            } else {
                this.offScreen();
            }
        }
    }

    public stopEvents() {
        this.unobserve();
    }
}

export class IntroBlock extends Block {
    public initEvents() {
        // Bind methods
        this.prepareToShow = this.prepareToShow.bind(this);
        this.show = this.show.bind(this);

        this.EventEmitter.on("BEFORE_SPLASHSCREEN_HIDE BEFORE_TRANSITION_IN", this.prepareToShow);
        this.EventEmitter.on("START_SPLASHSCREEN_HIDE NAVIGATION_END", this.show);
    }

    public stopEvents() {
        this.EventEmitter.off("BEFORE_SPLASHSCREEN_HIDE BEFORE_TRANSITION_IN", this.prepareToShow);
        this.EventEmitter.off("START_SPLASHSCREEN_HIDE NAVIGATION_END", this.show);
    }

    public stop() {
        super.stop();

        this.rootElement.style.transform = "translateY(0px)";
        this.rootElement.style.opacity = '1';
    }

    public prepareToShow() {
        this.rootElement.style.transform = "translateY(200px)";
        this.rootElement.style.opacity = '0';
        // this.rootElement.style.transitionDelay = `${200 * (this.index + 1)}ms`;
    }

    public async show() {
        // !this.rootElement.classList.contains("active") && this.rootElement.classList.add("active");
        return await animate({
            target: this.rootElement,
            keyframes: [
                { transform: "translateY(200px)", opacity: 0 },
                { transform: "translateY(0px)", opacity: 1 },
            ],
            // @ts-ignore
            delay: 200 * (this.index + 1),
            onfinish(el: { style: { transform: string; opacity: string; }; }) {
                el.style.transform = "translateY(0px)";
                el.style.opacity = "1";
            },
            easing: "out-cubic",
            duration: 500
        });
    }
}