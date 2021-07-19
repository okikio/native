import { PJAX, App, TransitionManager, Router, HistoryManager, PageManager } from "@okikio/native";

import { Fade } from "./transitions/Fade";
import { BigTransition } from "./transitions/BigTransition";
import { Slide, SlideLeft, SlideRight } from "./transitions/Slide";

import { Navbar } from "./services/Navbar";

const pjax = new PJAX();
const navbar = new Navbar();
const app = new App({
    // prefetchIgnore: ["/index(.html)?"],
    // preventURLs: ["/other(.html)?"],
    transitions: [
        ["default", Fade],
        ["BigTransition", BigTransition],
        ["Slide", Slide],
        ["SlideLeft", SlideLeft],
        ["SlideRight", SlideRight]
    ]
});

app
    .set("HistoryManager", new HistoryManager())
    .set("PageManager", new PageManager())
    .set("TransitionManager", new TransitionManager())

    .add(navbar)
    .add(pjax);

try {
    app.boot();
} catch (err) {
    console.warn("[App] boot failed,", err);
}
