import { InViewBlockIntent } from "./blocks.js";
import { PJAX, App, _URL } from "../../lib/core.js";
import { getTheme, setTheme, mediaTheme } from "./theme.js";
import { Splashscreen, IntroAnimation } from "./services.js";
import { Fade, Slide, SlideLeft, SlideRight, BigTransition } from "./transitions.js";

const html = document.querySelector("html");
try {
    let theme = getTheme();
    if (theme === null) theme = mediaTheme();
    theme && html.setAttribute("theme", theme);
} catch (e) {
    console.warn("Theming isn't available on this browser.");
}

// Get theme from html tag, if it has a theme or get it from localStorage
let themeGet = () => {
    let themeAttr = html.getAttribute("theme");
    if (themeAttr && themeAttr.length) {
        return themeAttr;
    }

    return getTheme();
};

// Set theme in localStorage, as well as in the html tag
let themeSet = (theme: string) => {
    html.setAttribute("theme", theme);
    setTheme(theme);
};

// On theme switcher button click (mouseup is a tiny bit more efficient) toggle the theme between dark and light mode
// on(_themeSwitcher, "mouseup", () => {
//     themeSet(themeGet() === "dark" ? "light" : "dark");
// });

window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
    themeSet(e.matches ? "dark" : "light");
});

const app = new App();
app
    .add("service", new PJAX())
    .add("service", new Splashscreen())
    .add("service", new IntroAnimation())
    .add("block", InViewBlockIntent)
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
            let URLmatch = _URL.equal((item as HTMLAnchorElement).href, href);
            let isActive = item.classList.contains("active");
            if (!(URLmatch && isActive)) {
                item.classList[URLmatch ? "add" : "remove"]("active");
            }
        }
    };

    try {
        await app.boot();
    } catch (err) {
        console.warn("App boot failed", err);
    }

    app.on({
        "READY": navbarLinks,
        "GO": navbarLinks
    });
})();