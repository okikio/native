import { animate } from "@okikio/native";

/* Properties Section */
// Playback Controls Demo
(() => {
    let containerSel = ".playback-demo";

    let playstateEl = document.querySelector("#playstate-toggle") as HTMLInputElement;
    let progressEl = document.querySelector("#progress") as HTMLInputElement;

    let progressOutputEl = document.querySelector("#progress-output");
    let oldState: AnimationPlayState;

    let DOMNodes = document.querySelectorAll(`${containerSel} .el`);
    let anim = animate({
        target: DOMNodes,

        // keyframes(index, total) {
        //     return [
        //         { transform: "translateX(0px)", opacity: 0.1 },
        //         { transform: "translateX(400px)", opacity: 0.2 + ((index + 1) / total) }
        //     ]
        // },

        transform: ["translateX(0px)", "translateX(300px)"],
        opacity(index, total) {
            return [0, (index + 1) / total];
        },

        // It is best to use the onfinish() method, but in this situation fillMode works best
        fillMode: "both",
        // onfinish(element, index, total) {
        //     element.style.opacity = `${((index + 1) / total)}`;
        //     element.style.transform = "translateX(300px)";
        // },

        easing: "out-cubic",
        loop: 5,
        speed: 1.5,
        direction: "alternate",

        delay(index) {
            return ((index + 1) * 500) / 2;
        },
        duration(index: number) {
            return (index + 1) * 500;
        },

        padEndDelay: true,
        autoplay: true
    });

    let updatePlayState = () => {
        oldState = anim.getPlayState();
        playstateEl.setAttribute("data-playstate", oldState);
    };

    anim
        .on("finish begin", updatePlayState)
        .on("update", (progress) => {
            progressEl.value = `` + progress.toFixed(2);
            progressOutputEl.textContent = `${Math.round(progress)}%`;
        });

    playstateEl.addEventListener("click", () => {
        if (anim.is("running")) anim.pause();
        else if (anim.is("finished")) anim.reset();
        else anim.play();

        updatePlayState();
    });

    progressEl.addEventListener("input", (e) => {
        let percent = +progressEl.value;
        anim.pause();
        anim.setProgress(percent);
    });

    progressEl.addEventListener("change", () => {
        oldState !== "paused" ? anim.play() : anim.pause();

        updatePlayState();
    });
})();
