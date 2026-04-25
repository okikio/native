const MOBILE_MEDIA_QUERY = "(max-width: 40rem)";

interface SidebarElements {
  aside: HTMLElement;
  toggle: HTMLButtonElement;
  overlay: HTMLButtonElement;
}

class Accordion {
  private readonly el: HTMLDetailsElement;
  private readonly summary: HTMLElement;
  private readonly content: HTMLElement;
  private animation: Animation | null = null;
  private isClosing = false;
  private isExpanding = false;

  constructor(el: HTMLDetailsElement) {
    const summary = el.querySelector("summary");
    const content = el.querySelector<HTMLElement>(".content");

    if (!(summary instanceof HTMLElement) || !(content instanceof HTMLElement)) {
      throw new Error("Accordion markup is missing its summary or content element.");
    }

    this.el = el;
    this.summary = summary;
    this.content = content;
    this.summary.addEventListener("click", this.onClick);
  }

  // These listeners live on the static sidebar elements for the full page lifecycle,
  // so there is no intermediate teardown step before the page unloads.
  private onClick = (event: MouseEvent) => {
    event.preventDefault();
    this.el.style.overflow = "hidden";

    if (this.isClosing || !this.el.open) {
      this.open();
      return;
    }

    if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  };

  private shrink() {
    this.isClosing = true;

    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight}px`;

    this.animation?.cancel();
    this.animation = this.el.animate(
      { height: [startHeight, endHeight] },
      { duration: 400, easing: "ease-out" }
    );

    this.animation.onfinish = () => this.onAnimationFinish(false);
    this.animation.oncancel = () => {
      this.isClosing = false;
    };
  }

  private open() {
    this.el.style.height = `${this.el.offsetHeight}px`;
    this.el.open = true;
    window.requestAnimationFrame(() => this.expand());
  }

  private expand() {
    this.isExpanding = true;

    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

    this.animation?.cancel();
    this.animation = this.el.animate(
      { height: [startHeight, endHeight] },
      { duration: 400, easing: "ease-out" }
    );

    this.animation.onfinish = () => this.onAnimationFinish(true);
    this.animation.oncancel = () => {
      this.isExpanding = false;
    };
  }

  private onAnimationFinish(open: boolean) {
    this.el.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.el.style.height = "";
    this.el.style.overflow = "";
  }
}

function getSidebar() {
  return document.querySelector<HTMLElement>("[data-sidebar]");
}

function getSidebarElements(): SidebarElements | null {
  const aside = getSidebar();
  const toggle = document.querySelector<HTMLButtonElement>("[data-sidebar-toggle]");
  const overlay = document.querySelector<HTMLButtonElement>("[data-sidebar-overlay]");

  if (!(aside instanceof HTMLElement) || !(toggle instanceof HTMLButtonElement) || !(overlay instanceof HTMLButtonElement)) {
    return null;
  }

  return { aside, toggle, overlay };
}

function isMobileViewport() {
  return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
}

function setSidebarOpen(elements: SidebarElements, open: boolean) {
  const shouldOpen = isMobileViewport() ? open : true;

  elements.aside.dataset.open = String(shouldOpen);
  elements.overlay.dataset.open = String(shouldOpen);
  elements.toggle.setAttribute("aria-expanded", String(shouldOpen));
  elements.toggle.setAttribute(
    "aria-label",
    shouldOpen ? "Close documentation navigation" : "Open documentation navigation"
  );
  elements.overlay.setAttribute("aria-hidden", String(!(shouldOpen && isMobileViewport())));

  document.body.dataset.sidebarOpen = String(shouldOpen && isMobileViewport());

  if (shouldOpen && isMobileViewport()) {
    const firstFocusable = elements.aside.querySelector<HTMLAnchorElement | HTMLButtonElement>(
      "a[href], button:not([disabled])"
    );

    firstFocusable?.focus();
  }
}

function cleanURL(value: string | URL) {
  return new URL(value, window.location.href).pathname.replace(/\/$/, "").replace(/\/index$/, "");
}

export function inFocus(aside: HTMLElement | null = getSidebar()) {
  if (!(aside instanceof HTMLElement)) {
    return;
  }

  const currentPath = cleanURL(window.location.href);

  aside.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((anchor) => {
    anchor.classList.remove("active");

    if (cleanURL(anchor.href) !== currentPath) {
      return;
    }

    anchor.classList.add("active");

    let parent: HTMLElement | null = anchor.parentElement;
    while (parent && parent !== aside) {
      if (parent instanceof HTMLDetailsElement && !parent.open) {
        parent.open = true;
      }

      parent = parent.parentElement;
    }

    anchor.scrollIntoView({ behavior: "smooth" });
  });
}

export function init(aside: HTMLElement | null = getSidebar()) {
  if (!(aside instanceof HTMLElement)) {
    return;
  }

  aside.querySelectorAll<HTMLDetailsElement>("details").forEach((details) => {
    if (details.dataset.accordionReady === "true") {
      return;
    }

    details.dataset.accordionReady = "true";
    new Accordion(details);
  });
}

export function startSidebar() {
  const elements = getSidebarElements();
  if (!elements) {
    return;
  }

  init(elements.aside);
  inFocus(elements.aside);
  setSidebarOpen(elements, false);

  if (elements.toggle.dataset.bound === "true") {
    return;
  }

  const syncViewportState = () => setSidebarOpen(elements, elements.aside.dataset.open === "true");
  const closeSidebar = () => setSidebarOpen(elements, false);
  const toggleSidebar = () => setSidebarOpen(elements, elements.aside.dataset.open !== "true");
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeSidebar();
    }
  };

  elements.toggle.addEventListener("click", toggleSidebar);
  elements.overlay.addEventListener("click", closeSidebar);
  window.addEventListener("resize", syncViewportState, { passive: true });
  document.addEventListener("keydown", onKeydown);
  elements.toggle.dataset.bound = "true";
}
