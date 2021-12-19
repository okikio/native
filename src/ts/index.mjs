import { App, PJAX, TransitionManager, HistoryManager, PageManager } from "@okikio/native";
import { animate } from "@okikio/animate";
import { init, inFocus } from "./sidebar.mjs";
const app = new App();
const Fade = {
  name: "default",
  out({ from }) {
    let fromWrapper = from.wrapper;
    return animate({
      target: fromWrapper,
      opacity: [1, 0],
      duration: 500
    });
  },
  async in({ to }) {
    let toWrapper = to.wrapper;
    await animate({
      target: toWrapper,
      opacity: [0, 1],
      duration: 500
    });
  }
};
app.set("HistoryManager", new HistoryManager()).set("PageManager", new PageManager()).set("TransitionManager", new TransitionManager([
  [Fade.name, Fade]
])).add(new PJAX());
try {
  app.on({
    HOVER() {
      console.log("Print a value on hover over link");
    },
    CLICK() {
      console.log("Print something when a link is clicked");
    },
    NAVIGATION_START() {
      console.log("Print before you start loading pages");
    },
    READY() {
      init();
      inFocus();
    },
    CONTENT_REPLACED() {
      inFocus();
    }
  });
  app.on("resize", () => {
    console.log("App resizing");
  });
  app.boot();
} catch (e) {
  console.warn(e);
}