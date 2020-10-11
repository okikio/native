import { Block, IBlockInit, animate } from "../../../src/api";

//== Blocks
export class InViewBlock extends Block {
    public observer: IntersectionObserver;
    public observerOptions: { root: any; rootMargin: string; threshold?: number, thresholds?: Array<number>; };
    public imgs: HTMLElement[];
    public direction: string;
    public xPercent: number;
    public inView: boolean = false;

    public init(value: IBlockInit) {
        super.init(value);

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

    public observe() {
        this.observer.observe(this.rootElement);
    }

    public unobserve() {
        this.observer.unobserve(this.rootElement);
    }

    public onScreen() {
        animate({
            target: this.rootElement,
            transform: [`translateX(${this.xPercent}%)`, "translateX(0%)"],
            opacity: [0, 1],
            duration: 1500,
            delay: 0.15,
            easing: "out-quint",
            onfinish(el) {
                requestAnimationFrame(() => {
                    el.style.transform = "translateX(0%)";
                    el.style.opacity = "1";
                });
            },
        });
    }

    public offScreen() {
        requestAnimationFrame(() => {
            this.rootElement.style.transform = `translateX(${this.xPercent}%)`;
            this.rootElement.style.opacity = "0";
        });
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
