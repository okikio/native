import { init, inFocus } from "./sidebar";

class NavigationDemoController {
  private booted = false;

  boot() {
    if (this.booted) {
      return;
    }

    init();
    inFocus();
    window.addEventListener("resize", this.handleResize, { passive: true });
    this.booted = true;
  }

  stop() {
    if (!this.booted) {
      return;
    }

    window.removeEventListener("resize", this.handleResize);
    this.booted = false;
  }

  private handleResize = () => {
    console.log("App resizing");
  };
}

let navigationDemo: NavigationDemoController | null = null;

export function startNavigationDemo() {
  if (!navigationDemo) {
    navigationDemo = new NavigationDemoController();
  }

  navigationDemo.boot();
  return navigationDemo;
}
