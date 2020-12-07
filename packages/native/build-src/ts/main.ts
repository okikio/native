import { PJAX, App, Router } from "../../src/api";

import { Splashscreen } from "./services/Splashscreen";
import { IntroAnimation } from "./services/IntroAnimation";

import { Fade } from "./transitions/Fade";
import { BigTransition } from "./transitions/BigTransition";
import { Slide, SlideLeft, SlideRight } from "./transitions/Slide";

const app: App = new App();
let splashscreen: Splashscreen;
let router: Router, pjax: PJAX;

app
    .add("service", new IntroAnimation())
    .add("service", splashscreen = new Splashscreen())
    .setService("router", router = new Router())
    .add("service", pjax = new PJAX())
    .setTransition("default", Fade)
    .add("transition", BigTransition)
    .add("transition", Slide)
    .add("transition", SlideLeft)
    .add("transition", SlideRight);

try {
    router = app.get("service", "router") as Router;

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
