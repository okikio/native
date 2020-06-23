import { InViewBlock } from "./blocks";
import { getTheme, setTheme, mediaTheme } from "./theme";
import { Splashscreen, IntroAnimation } from "./services";
import { PJAX, App, _URL, BlockIntent, Router } from "../../src/api";
import { Fade, Slide, SlideLeft, SlideRight, BigTransition } from "./transitions";

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
const router = new Router();
app
    .add("service", new PJAX())
    .add("service", new Splashscreen())
    .add("service", new IntroAnimation())
    .add("service", router)

    .add("transition", new Fade())
    .add("transition", new BigTransition())
    .add("transition", new Slide())
    .add("transition", new SlideLeft())
    .add("transition", new SlideRight())

    .add("block", new BlockIntent("InViewBlock", InViewBlock));

(async () => {

    try {
        await app.boot();
    } catch (err) {
        console.warn("App boot failed", err);
    }

    // app.on({
    //     "READY": navbarLinks,
    //     "GO": navbarLinks
    // });
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
})();