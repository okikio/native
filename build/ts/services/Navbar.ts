import { Service, animate } from "../../../packages/native/src/api";
import { toArr } from "../toArr";

export class Navbar extends Service {
    public navbar: HTMLElement;
    public elements: HTMLElement[];
    public menu: HTMLElement;
    public collapseSection: HTMLElement;
    public navbarList: HTMLElement;
    toggleStatus: boolean;

    public init() {
        // Elements
        this.navbar = document.querySelector(".navbar") as HTMLElement;
        this.collapseSection = this.navbar.querySelector(".navbar-collapse.mobile") as HTMLElement;
        this.navbarList = this.navbar.querySelector(".navbar-list") as HTMLElement;
        this.elements = toArr(this.navbar.querySelectorAll(".navbar-list a"));
        this.menu = this.navbar.querySelector(".navbar-toggle") as HTMLElement;
        this.toggleStatus = false;

        this.toggleClick = this.toggleClick.bind(this);
    }

    public activateLink() {
        let { href } = window.location;

        for (let el of this.elements) {
            let itemHref =
                el.getAttribute("data-path") ||
                (el as HTMLAnchorElement).href;
            if (!itemHref || itemHref.length < 1) return;

            let URLmatch = new RegExp(itemHref).test(href);
            let isActive = el.classList.contains("active");
            if (!(URLmatch && isActive)) {
                el.classList.toggle("active", URLmatch);
            }
        }
    }

    public toggleClick() {
        this.collapseSection.style?.setProperty?.("--height", `${this.navbarList.clientHeight}px`);
        this.toggleStatus = !this.toggleStatus;
        this.collapseSection.classList.toggle("collapse", !this.toggleStatus);
        this.collapseSection.classList.toggle("show", this.toggleStatus);
    }

    public scroll() {
        this.navbar.classList.toggle("shadow", window.scrollY >= 5);
    }

    public initEvents() {
        this.menu.addEventListener("click", this.toggleClick);
        this.emitter.on("scroll", this.scroll, this);
        this.emitter.on("READY", this.activateLink, this);
        this.emitter.on("GO", this.activateLink, this);
    }

    public stopEvents() {
        this.navbar.removeEventListener("click", this.toggleClick);
        this.emitter.off("scroll", this.scroll, this);
        this.emitter.off("READY", this.activateLink, this);
        this.emitter.off("GO", this.activateLink, this);
    }

    public uninstall() {
        while (this.elements.length) this.elements.pop();
        this.elements = undefined;
        this.menu = undefined;
        this.navbar = undefined;
    }
}