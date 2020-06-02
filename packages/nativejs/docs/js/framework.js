import PJAX from "./pjax.js";
import { App, _URL } from "./api.js";
import InViewBlockIntent from "./blocks.js";
import { Splashscreen, IntroAnimation } from "./services.js";
import { Fade, Slide, SlideLeft, SlideRight, BigTransition } from "./transitions.js";
const app = new App();
app
    .add("service", new PJAX())
    .add("service", new Splashscreen())
    .add("service", new IntroAnimation())
    .add("block", InViewBlockIntent)
    // .add("service", new InView())
    .add("transition", new Fade())
    .add("transition", new BigTransition())
    .add("transition", new Slide())
    .add("transition", new SlideLeft())
    .add("transition", new SlideRight());
(async () => {
    let navbarLinks = () => {
        let { href } = window.location;
        let navLink = document.querySelectorAll(".navbar .nav-link");
        for (let item of navLink) {
            let URLmatch = _URL.equal(item.href, href);
            let isActive = item.classList.contains("active");
            if (!(URLmatch && isActive)) {
                item.classList[URLmatch ? "add" : "remove"]("active");
            }
        }
    };
    try {
        await app.boot();
    }
    catch (err) {
        console.warn("App boot failed", err);
    }
    app.on({
        "ready": navbarLinks,
        "go": navbarLinks
    });
})();
//# sourceMappingURL=framework.js.map