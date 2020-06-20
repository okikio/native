import { animate } from "../../lib/api.es.js";
let anim = animate({
    target: ".div",
    keyframes(index, total, element) {
        console.log(element);
        return [
            { transform: "translateX(0px)", opacity: 0 },
            { transform: "translateX(300px)", opacity: ((index + 1) / total) }
        ]
    },
    // transform: ["translateX(0px)", "translateX(300px)"],
    easing: "out-cubic",
    // opacity(index, total, element) {
    //     console.log(element);
    //     return [0, ((index + 1) / total)];
    // },
    duration(index) {
        return (index + 1) * 500;
    },
    onfinish(element, index, total) {
        element.style.opacity = `${((index + 1) / total)}`;
        element.style.transform = "translateX(300px)";
    },
    loop: 5,
    speed: 1,
    direction: "alternate",
    delay(i) {
        return i * 200;
    },
    autoplay: true,
    // endDelay: 500
});

anim.then(() => {
    let el = document.querySelector(".info");
    let info = "Done, it was delayed because of the endDelay property.";
    el.textContent = info;
    el.style = "color: red";

    console.log(info);
});

let progressSpan = document.querySelector(".progress");
anim.on("change", () => {
    progressSpan.textContent = `${Math.round(anim.getProgress() * 100)}%`;
});

let body = document.querySelector("body");
body.addEventListener("click", () => {
    let state = anim.getPlayState();
    if (state === "running") anim.pause();
    else if (state === "finished") anim.reset();
    else anim.play();
    console.log(state);
});