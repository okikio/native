import { animate } from "../../lib/api.es.js";
let anim = animate({
    target: ".div",
    transform: ["translateX(0px)", "translateX(300px)"],
    easing: "out-cubic",
    opacity(index, total, element) {
        console.log(element);
        return [0.05, ((index + 1) / total) + 0.05];
    },
    duration(index) {
        return (index + 1) * 500;
    },
    fillMode: "both",
    loop: 5,
    speed: 1,
    direction: "alternate",
    delay(i) {
        return i * 200;
    },
    autoplay: true,
    endDelay: 500
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