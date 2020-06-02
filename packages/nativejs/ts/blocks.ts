import { Block, BlockIntent } from "./api.js";

//== Blocks
export class InViewBlock extends Block {
    protected observer: IntersectionObserver;
    protected observerOptions: { root: any; rootMargin: string; threshold: number; };
    protected imgs: HTMLElement[];
    protected direction: string;
    protected xPercent: number;
    protected inView: boolean = false;

    public boot() {
        // Values
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        // Create observer
        this.observer = new IntersectionObserver(entries => {
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
        let animation = this.rootElement.animate([
            { transform: `translateX(${this.xPercent}%)`, opacity: 0 },
            { transform: "translateX(0%)", opacity: 1 },
        ], {
            duration: 1500,
            delay: 0.15,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)" // ease-out-quint
        });
        animation.onfinish = () => {
            this.rootElement.style.transform = "translateX(0%)";
            this.rootElement.style.opacity = "1";
        };
    }

    protected offScreen() {
        this.rootElement.style.transform = `translateX(${this.xPercent}%)`;
        this.rootElement.style.opacity = "0";
    }

    public onIntersectionCallback(entries) {
        if (!this.inView) {
            for (let entry of entries) {
                if (entry.intersectionRatio > 0) {
                    this.onScreen();
                    this.inView = true;
                } else {
                    this.offScreen();
                }
            }
        }
    }

    public stopEvents() {
        this.unobserve();
    }
}

export const InViewBlockIntent: BlockIntent = new BlockIntent("InViewBlock", InViewBlock);