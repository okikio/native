import { PJAX, App, TransitionManager, Router, HistoryManager, PageManager } from "../../src/api";
import { Splashscreen } from "./services/Splashscreen";
import { IntroAnimation } from "./services/IntroAnimation";

import { Fade } from "./transitions/Fade";
import { BigTransition } from "./transitions/BigTransition";
import { Slide, SlideLeft, SlideRight } from "./transitions/Slide";

const app: App = new App();
let splashscreen: Splashscreen;
let router: Router, pjax: PJAX;

app
    .add(new IntroAnimation())
    .add(splashscreen = new Splashscreen())
    .set("HistoryManager", new HistoryManager())
    .set("PageManager", new PageManager())
    .set("TransitionManager", new TransitionManager([
        ["default", Fade],
        ["BigTransition", BigTransition],
        ["Slide", Slide],
        ["SlideLeft", SlideLeft],
        ["SlideRight", SlideRight]
    ]))
    .set("router", router = new Router())
    .add(pjax = new PJAX());

try {
    router = app.get("router") as Router;

    // This isn't nessceary, but it changes the nav link in focus depending on the page
    let navLink = document.querySelectorAll(".navbar .nav-link");
    for (let item of navLink) {
        let navItem = (item as HTMLAnchorElement);
        router.add({
            path: navItem.getAttribute("data-path") || navItem.pathname,
            method() {
                let isActive = navItem.classList.contains("active");
                if (!isActive) navItem.classList.add("active");
                for (let nav of navLink) {
                    if (nav !== navItem)
                        nav.classList.remove("active");
                }
            }
        });
    }
    app.boot();
} catch (err) {
    splashscreen.show();
    console.warn("[App] boot failed,", err);
}
