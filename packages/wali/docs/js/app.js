import { animate } from "../../lib/api.es.js";

let anim = animate({
    target: ".div",
    /* NOTE: If you turn this on you have to comment out the transform property. The keyframes property is a different format for animation you cannot you both styles of formatting in the same animation */
    // keyframes: [
    //     { transform: "translateX(0px)" },
    //     { transform: "translateX(300px)" }
    // ],
    transform: ["translateX(0px)", "translateX(300px)"],
    easing: "out-cubic",
    duration(i) {
        return (i + 1) * 500;
    },
    loop: 4,
    speed: 1,
    direction: "alternate",
    delay(i) {
        return i * 200;
    },
    autoplay: true,
    endDelay: 500
});

anim.then((animation) => {
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
