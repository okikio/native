import { Block, BlockIntent } from "../../lib/core.js";
import { animate } from "walijs";
//== Blocks
export class InViewBlock extends Block {
    constructor() {
        super(...arguments);
        this.inView = false;
    }
    boot() {
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
    observe() {
        this.observer.observe(this.rootElement);
    }
    unobserve() {
        this.observer.unobserve(this.rootElement);
    }
    onScreen() {
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
    offScreen() {
        this.rootElement.style.transform = `translateX(${this.xPercent}%)`;
        this.rootElement.style.opacity = "0";
    }
    onIntersectionCallback(entries) {
        if (!this.inView) {
            for (let entry of entries) {
                if (entry.intersectionRatio > 0) {
                    this.onScreen();
                    this.inView = true;
                }
                else {
                    this.offScreen();
                }
            }
        }
    }
    stopEvents() {
        this.unobserve();
    }
}
export const InViewBlockIntent = new BlockIntent("InViewBlock", InViewBlock);
//# sourceMappingURL=ts/blocks.js.map
