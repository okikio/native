import { App, PJAX, TransitionManager, HistoryManager, PageManager, Router } from "@okikio/native";
import { animate } from "@okikio/animate";
import { init, inFocus } from "./sidebar.mjs";

import type { ITransition } from "@okikio/native";

const app = new App();

//= Fade Transition
const Fade: ITransition = {
    name: "default",

    // Fade Out Old Page
    out({ from }) {
        let fromWrapper = from.wrapper;

        return animate({
            target: fromWrapper,
            opacity: [1, 0],
            duration: 500,
        })
    },

    // Fade In New Page
    async in({ to }) {
        let toWrapper = to.wrapper;

        await animate({
            target: toWrapper,
            opacity: [0, 1],
            duration: 500
        });
    }
};

app
    // Note only these 3 Services must be set under the names specified
    .set("HistoryManager", new HistoryManager())
    .set("PageManager", new PageManager())
    .set("TransitionManager", new TransitionManager([
        [Fade.name, Fade]
    ]))

    // The names of these Services don't really matter
    // .set("Router", new Router())
    .add(new PJAX());

try {
    // Router is a router, depending on the page path it will run certain tasks
    // It support regexp and paths that `path-to-regex` supports, 
    // however, I might refactor it to use the new `URLPattern` web standard in a future update. 
    // `URLPattern` accomplishes the same goal in a similar way to `path-to-regex` without needing to install `path-to-regex`. 
    // I suggest learning more about `URLPattern` on https://web.dev/urlpattern/
    // const router = app.get("Router") as Router;
    // router.add({
    //     path: "./index?(.html)?",
    //     method() {
    //         console.log("Run on Index page");
    //     }
    // })

    // Note these events are emitted by the PJAX Service
    app.on({
        HOVER() {
            console.log("Print a value on hover over link")
        },
        CLICK() {
            console.log("Print something when a link is clicked")
        },
        NAVIGATION_START() {
            console.log("Print before you start loading pages")
        },
        READY() {
            init();
            inFocus()
        },
        CONTENT_REPLACED() {
            inFocus();
        }
        // etc...
    });

    // While this event is emitted by the App
    app.on("resize", () => {
        console.log("App resizing");
    });

    app.boot();
} catch (e) {
    console.warn(e)
}