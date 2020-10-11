
import { getTheme, setTheme, mediaTheme } from "./theme";
import { PJAX, App, BlockIntent, Router } from "../../src/api";

import { InViewBlock } from "./blocks/InViewBlock";
import { Splashscreen } from "./services/Splashscreen";
import { IntroAnimation } from "./services/IntroAnimation";

import { Fade } from "./transitions/Fade";
import { BigTransition } from "./transitions/BigTransition";
import { Slide, SlideLeft, SlideRight } from "./transitions/Slide";

const html = document.querySelector("html");
try {
    let theme = getTheme();
    if (theme === null) theme = mediaTheme();
    theme && html.setAttribute("theme", theme);
} catch (e) {
    console.warn("Theming isn't available on this browser.");
}

// Set theme in localStorage, as well as in the html tag
let themeSet = (theme: string) => {
    html.setAttribute("theme", theme);
    setTheme(theme);
};

window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
    themeSet(e.matches ? "dark" : "light");
});

const app: App = new App();
let splashscreen: Splashscreen;
let router: Router, pjax: PJAX;

app
    .addService(new IntroAnimation())
    .addService(splashscreen = new Splashscreen())
    .setService("router", new Router())
    .add("service", new PJAX())

    .add("transition", new Fade())
    .addTransition(new BigTransition())
    .addTransition(new Slide())
    .add("transition", new SlideLeft())
    .add("transition", new SlideRight())

    .add("block", new BlockIntent({
        name: "InViewBlock",
        block: InViewBlock
    }));

try {
    app.boot();
    router = app.getService("router") as Router;

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
} catch (err) {
    splashscreen.show();
    console.warn("[App] boot failed,", err);
}
