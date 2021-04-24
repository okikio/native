import { PJAX, App, TransitionManager, Router, HistoryManager, PageManager, animate, Animate } from "@okikio/native";
import { IntroAnimation } from "./services/IntroAnimation";

import { Fade } from "./transitions/Fade";
import { BigTransition } from "./transitions/BigTransition";
import { Slide, SlideLeft, SlideRight } from "./transitions/Slide";

import { toArr } from "./toArr";
import { Navbar } from "./services/Navbar";

let router: Router, pjax: PJAX;
const app: App = new App();
app
    .add(new IntroAnimation())
    .set("HistoryManager", new HistoryManager())
    .set("PageManager", new PageManager())
    .set("TransitionManager", new TransitionManager([
        ["default", Fade],
        ["BigTransition", BigTransition],
        ["Slide", Slide],
        ["SlideLeft", SlideLeft],
        ["SlideRight", SlideRight]
    ]))
    .add(new Navbar())
    .set("router", router = new Router())
    .add(pjax = new PJAX());

try {
    router = app.get("router") as Router;

    // This isn't nessceary, but it changes the nav link in focus depending on the page
    let navLink: HTMLElement[] = toArr(document.querySelectorAll(".navbar .nav-link"));
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

    router.add({
        path: /(index|\/$)(\.html)?/,
        method() { }
    });

    // app.on("AFTER_SPLASHSCREEN_HIDE", () => {
    //     anim?.play();
    // });

    app.boot();
} catch (err) {
    console.warn("[App] boot failed,", err);
}
