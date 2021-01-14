import { animate } from "@okikio/native";

/* Target Section */
// CSS Selector Demo
(() => {
    let containerSel = ".css-selector-demo";
    let anim = animate({
        target: `${containerSel} .el`,
        transform: ["translateX(0px)", "translateX(250px)"],
        onfinish(element) {
            element.style.transform = "translateX(250px)";
        },
        duration: 500,
        autoplay: false
    });

    let container = document.querySelector(containerSel);
    container.addEventListener("click", () => {
        anim.reset();
        anim.play();
    });
})();

// DOM Node / Nodelist Demo
(() => {
    let containerSel = ".dom-node-demo";
    let DOMNodes = document.querySelectorAll(`${containerSel} .el`);
    let anim = animate({
        target: DOMNodes,
        transform: ["translateX(0px)", "translateX(250px)"],
        onfinish(element) {
            element.style.transform = "translateX(250px)";
        },
        duration: 500,
        autoplay: false
    });

    let container = document.querySelector(containerSel);
    container.addEventListener("click", () => {
        anim.reset();
        anim.play();
    });
})();


// Array Demo
(() => {
    let containerSel = ".array-demo";
    let el = (num: number) => `${containerSel} .el-0${num}`;
    let anim = animate({
        target: [`${containerSel} .el-01`, el(2), el(3),
        // These two elements don't exist, so, @okikio/animate ignores theme
        el(4), el(5)],
        transform: ["translateX(0px)", "translateX(250px)"],
        onfinish(element) {
            element.style.transform = "translateX(250px)";
        },
        autoplay: false
    });

    let container = document.querySelector(containerSel);
    container.addEventListener("click", () => {
        anim.reset();
        anim.play();
    });
})();



/* Properties Section */
// CSS Properties Demo
(() => {
    let containerSel = ".css-properties-demo";
    let anim = animate({
        target: `${containerSel} .el`,
        backgroundColor: ["#616aff", "#fff"],
        left: ["0px", "240px"],
        borderRadius: ['0%', '50%'],
        onfinish(element) {
            let { style } = element;
            style.backgroundColor = "#fff";
            style.left = "240px";
            style.borderRadius = '50%';
        },
        easing: "in-out-quad",
        autoplay: false
    });

    let container = document.querySelector(containerSel);
    container.addEventListener("click", () => {
        anim.reset();
        anim.play();
    });
})();

// CSS Transforms Demo
(() => {
    let containerSel = ".css-transform-demo";
    let anim = animate({
        target: `${containerSel} .el`,
        transform: [`translateX(0) scale(1) rotate(0)`, `translateX(250px) scale(2) rotate(1turn)`],
        onfinish(element) {
            element.style.transform = `translateX(250px) scale(2) rotate(1turn)`;
        },
        easing: "in-out-quad",
        autoplay: false
    });

    let container = document.querySelector(containerSel);
    container.addEventListener("click", () => {
        anim.reset();
        anim.play();
    });
})();


// SVG Attributes Demo
(() => {
    let containerSel = ".svg-attributes-demo";
    var pathEl = document.querySelector(`${containerSel} path`);

    let anim = animate({
        target: pathEl,
        strokeDashoffset: [4000, 0],
        loop: true,
        direction: "alternate",
        easing: "in-out-expo",
        autoplay: false
    });

    let container = document.querySelector(containerSel);
    container.addEventListener("click", () => {
        // anim.reset(); // You can't reset an infinitely looped animation
        if (anim.getPlayState() === "running") anim.pause();
        else anim.play();
    });

    anim.on("update", () => {
        console.log("Go")
    });
})();
