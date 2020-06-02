import { Block } from "./api.js";
//== Blocks
export class InViewBlock extends Block {
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
    stopEvents() {
        this.unobserve();
    }
    onIntersectionCallback(entries) {
        for (let entry of entries) {
            if (entry.intersectionRatio > 0) {
                this.onScreen(entry);
            }
            else {
                this.offScreen(entry);
            }
        }
    }
    onScreen({ target }) {
        let animation = target.animate([
            { transform: `translateX(${this.xPercent}%)`, opacity: 0 },
            { transform: "translateX(0%)", opacity: 1 },
        ], {
            duration: 1500,
            delay: 0.15,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)" // ease-out-quint
        });
        animation.onfinish = () => {
            target.style.transform = "translateX(0%)";
            target.style.opacity = "1";
        };
    }
    offScreen({ target }) {
        target.style.transform = `translateX(${this.xPercent}%)`;
        target.style.opacity = "0";
    }
}
export default {
    name: "InViewBlock",
    block: InViewBlock
};
//# sourceMappingURL=blocks.js.map