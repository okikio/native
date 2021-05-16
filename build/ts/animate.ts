import { animate, IAnimationOptions, methodCall } from "@okikio/native";

let playbackFn = (containerSel, anims) => {
    let playstateEl = document.querySelector(`${containerSel} #playstate-toggle`) as HTMLInputElement;
    let progressEl = document.querySelector(`${containerSel} #progress`) as HTMLInputElement;

    let progressOutputEl = document.querySelector(`${containerSel} #progress-output`);
    let oldState: AnimationPlayState;

    let updatePlayState = () => {
        oldState = anims[0].getPlayState();
        playstateEl.setAttribute("data-playstate", oldState);
    };

    anims[0]
        .on("finish begin", updatePlayState)
        .on("update", (progress) => {
            progressEl.value = `` + progress.toFixed(2);
            progressOutputEl.textContent = `${Math.round(progress)}%`;
        });

    playstateEl.addEventListener("click", () => {
        if (anims[0].is("running")) methodCall(anims, "pause");
        else if (anims[0].is("finished")) methodCall(anims, "reset");
        else methodCall(anims, "play");

        updatePlayState();
    });

    progressEl.addEventListener("input", (e) => {
        let percent = +progressEl.value;
        methodCall(anims, "pause");
        methodCall(anims, "setProgress", percent);
    });

    progressEl.addEventListener("change", () => {
        oldState !== "paused" ? methodCall(anims, "play") : methodCall(anims, "pause");

        updatePlayState();
    });

}

/* Properties Section */
// Playback Controls Demo
(() => {
    let containerSel = ".playback-demo";

    let DOMNodes = document.querySelectorAll(`${containerSel} .el`);
    let anim = animate({
        target: DOMNodes,

        // keyframes(index, total) {
        //     return [
        //         { transform: "translateX(0px)", opacity: 0.1 },
        //         { transform: "translateX(400px)", opacity: 0.2 + ((index + 1) / total) }
        //     ]
        // },
        // keyframes(index, total) {
        //     return {
        //         "from": {
        //             // transform: "translateX(0px)",
        //             // translateX: 0,
        //             opacity: 0.1,
        //         },
        //         "to": {
        //             // transform: "translateX(400px)",
        //             // translate: 400,
        //             translateX: 400,
        //             opacity: 0.2 + ((index + 1) / total)
        //         }
        //     };
        // },

        // transform: ["translateX(0px)", "translateX(300px)"],
        translateX: 300,
        opacity(index, total) {
            return [0.5, 0.5 + Math.min((index + 1) / total, 0.5)];
        },

        // It is best to use the onfinish() method, but in this situation fillMode works best
        fillMode: "both",
        // onfinish(element, index, total) {
        //     element.style.opacity = `${((index + 1) / total)}`;
        //     element.style.transform = "translateX(300px)";
        // },

        easing: "out-cubic",
        loop: 2,
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

    setTimeout(() => {
        console.log("updateOptions");

        anim.updateOptions({
            backgroundColor: ["#fff", "red"],
            speed: (i) => 1.5 - (i * 0.125),
        });
    }, 500)

    playbackFn(containerSel, [anim]);
})();

(() => {
    let options: IAnimationOptions = {
        padEndDelay: true,
        easing: "linear",
        duration: 2000,
        loop: 4,
        speed: 1,
    };

    let containerSel = ".motion-path-demo";
    let el = document.querySelector('.motion-path .el-1') as HTMLElement;
    let motionPath = animate({
        target: el,
        "offsetDistance": ["0%", "100%"],
        ...options
    });

    let path = document.querySelector('.motion-path path') as SVGPathElement;
    let el2 = document.querySelector('.motion-path .el-2') as HTMLElement;

    let pts: Set<number[]> = new Set();
    let rotateArr: number[] = [];
    let len = path.getTotalLength();

    let ptAtZero = path.getPointAtLength(0);
    for (var i = 0; i < len; i++) {
        let { x, y } = path.getPointAtLength(i);
        pts.add([x, y]);

        let { x: x0, y: y0 } = i - 1 >= 1 ? path.getPointAtLength(i - 1) : ptAtZero;
        let { x: x1, y: y1 } = i + 1 >= 1 ? path.getPointAtLength(i + 1) : ptAtZero;
        let calc = +(Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI);
        rotateArr.push(calc);
    }

    let getTotalLength = animate({
        target: el2,
        translate: [...pts],
        rotate: rotateArr,
        fillMode: "both",
        ...options
    });

    playbackFn(containerSel, [motionPath, getTotalLength]);
})();
