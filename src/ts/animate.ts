import { animate, tweenAttr, random, queue, AnimateAttributes, SpringEasing } from "@okikio/animate";
import { interpolate } from "polymorph-js";

import type { IAnimationOptions, TypePlayStates, Queue, Animate } from "@okikio/animate";

// Based on an example by animateplus
/**
( () => {
    let containerSel = ".morph-demo";
    let queueInst = queue({
        duration: 1800,
        easing: "ease",
        loop: 4,
        fillMode: "both",
        direction: "alternate"
    });

    queueInst.add(((): IAnimationOptions => {
        let usingDPathEl = document.querySelector(`${containerSel} #using-d`);
        let InitialStyle = window.getComputedStyle(usingDPathEl);

        return {
            target: usingDPathEl,
            "d": [
                InitialStyle.getPropertyValue("d"),
                `path("M2,5 S2,14 4,5 S7,8 8,4")`
            ],
            stroke: [
                InitialStyle.getPropertyValue("stroke"),
                `rgb(96, 165, 250)`
            ],
        }
    })(), "= 0");

    queueInst.add(((): IAnimationOptions => {
        let usingPolymorphPathEl = document.querySelector(`${containerSel} #using-polymorph-js`);
        let InitialStyle = window.getComputedStyle(usingPolymorphPathEl);

        return {
            target: usingPolymorphPathEl,
            fill: [
                InitialStyle.getPropertyValue("stroke"),
                `rgb(96, 165, 250)`
            ],

            // You can also use custom properties when animating
            // I chose to use them for this example
            // Read more here [https://css-tricks.com/a-complete-guide-to-custom-properties/]
            "--stroke": [
                InitialStyle.getPropertyValue("stroke"),
                `rgb(96, 165, 250)`
            ],
        };
    })(), "= 0");

    queueInst.add(((): AnimateAttributes => {
        let usingPolymorphPathEl = document.querySelector(`${containerSel} #using-polymorph-js`);
        let startPath = usingPolymorphPathEl.getAttribute("d");
        let endPath =
            "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z";

        let morph = interpolate([startPath, endPath], {
            addPoints: 0,
            origin: { x: 0, y: 0 },
            optimize: "fill",
            precision: 3
        });

        return tweenAttr({
            target: usingPolymorphPathEl,
            d: progress => morph(progress),
            easing: "linear"
        });
    })(), "= 0");

    playbackFn(containerSel, queueInst);
})();

(() => {
    let containerSel = ".playback-demo";
    let queueInst = queue();

    queueInst.add(((): Animate => {
        let DOMNodes = document.querySelectorAll(`${containerSel} .el`);
        let anim = animate({
            target: DOMNodes,
            "background-color": (...args) => {
                let [, , target] = args;
                let [r, g, b] = [
                    random(0, 255),
                    random(0, 255),
                    random(0, 255)
                ]
                return [
                    window.getComputedStyle(target).getPropertyValue("background-color"),
                    `rgb(${r}, ${g}, ${b})`
                ];
            },

            "translate-x": () => [0, random(50, 400)],
            translateY(...args) {
                let [, total] = args;
                return [0, (random(-50, 50) * total)];
            },
            scale() {
                return [1, 1 + random(0.025, 1.75)];
            },
            opacity(...args) {
                let [, total] = args;
                return [0.5, 0.5 + Math.min(random(0.025, total) / total, 0.5)];
            },
            rotate: () => [0, random(-360, 360)],
            borderRadius: () => ["3px", `${random(10, 35)}%`],
            duration: () => random(1200, 1800),
            delay: () => random(0, 400),

            loop: 2,
            speed: (i) => 1.5 - (i * 0.125),

            // You can't use `fillMode` if you want to have a queue of animations on the same target,
            // instead you can use `onfinish: () => {}`
            // fillMode: "both",

            onfinish(...args) {
                let [, , , anim] = args;
                anim.commitStyles();
            },

            direction: "alternate",
            easing: "in-out-back",
            padEndDelay: true,
            autoplay: true
        });

        let addBtn = document.querySelector("#add-el") as HTMLElement;
        let removeBtn = document.querySelector("#remove-el") as HTMLElement;
        let elPlacement = document.querySelector(".el-placement") as HTMLElement;

        let contain = document.createElement("div");
        contain.className = "contain";
        contain.innerHTML = `
            <div class="el"></div>
            <div class="el-initial"></div>`.trim();

        addBtn.onclick = () => {
            let _contain = contain.cloneNode(true) as HTMLElement;
            let el = _contain.querySelector(".el") as HTMLElement;
            elPlacement.appendChild(_contain);

            anim.add(el);

            // To support older browsers I can't use partial keyframes
            let transition = animate({
                target: _contain,
                opacity: [0, 1],
                height: [0, "4vmin"],
                marginBottom: [0, 5],
                fillMode: "forwards",
                duration: 400,
                easing: "out"
            }).then(() => {
                transition.stop();
                transition = null;
                _contain = null;
                el = null;
            });

        };

        removeBtn.onclick = () => {
            let contain = elPlacement.querySelector(".contain") as HTMLElement;
            let el = contain?.querySelector(".el") as HTMLElement;

            anim.remove(el);

            // To support older browsers I can't use partial keyframes
            let style = window.getComputedStyle(contain);
            let marginBottom = style.getPropertyValue("margin-bottom");
            let height = style.getPropertyValue("height");
            let transition = animate({
                target: contain,
                opacity: [1, 0],
                height: [height, 0],
                "margin-bottom": [marginBottom, 0],
                fillMode: "forwards",
                duration: 400,
                easing: "out"
            }).then(() => {
                contain?.remove();
                transition.stop();

                transition = null;
                contain = null;
                el = null;
            });
        };

        return anim;
    })(), "= 0");

    playbackFn(containerSel, queueInst);
})();

(() => {
    let containerSel = ".motion-path-demo";
    let queueInst = queue({
        padEndDelay: true,
        easing: "linear",
        duration: 2000,
        loop: 4,
        speed: 1,
    });

    queueInst.add(((): IAnimationOptions => {
        let el = document.querySelector('.motion-path .el-1') as HTMLElement;

        // To support older browsers I can't use partial keyframes
        return {
            target: el,
            "offsetDistance": ["0%", "100%"]
        };
    })(), "= 0");

    queueInst.add(((): IAnimationOptions => {
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
            let calc = +(Math.atan2(y0 - y1, x0 - x1) * 180 / Math.PI);
            rotateArr.push(calc);
        }

        return {
            target: el2,
            translate: [...pts],
            rotate: rotateArr,
            fillMode: "both",
        };
    })(), "= 0");

    playbackFn(containerSel, queueInst);
})();

// I added extra code to the demo to support Chrome 77 and below
function playbackFn(containerSel: string, queueInst: Queue) {
    let container = document.querySelector(containerSel);

    let playstateEl = container.querySelector(`#playstate-toggle`) as HTMLInputElement;
    let progressEl = container.querySelector(`#progress`) as HTMLInputElement;
    let progressOutputEl = container.querySelector(`#progress-output`) as HTMLElement;

    let oldState: "pending" | TypePlayStates;

    let updatePlayState = () => {
        oldState = queueInst.getPlayState() as TypePlayStates | "pending";
        if (oldState == "idle") oldState = "paused";
        else if (oldState == "pending") oldState = "running";
        playstateEl.setAttribute("data-playstate", oldState);
    };

    const clickFn = () => {
        if (queueInst.is("running"))
            queueInst.pause();
        else if (queueInst.is("finished"))
            queueInst.reset();
        else
            queueInst.play();

        updatePlayState();
    };

    const inputFn = () => {
        let percent = Number(progressEl.value);
        queueInst.pause();
        queueInst.setProgress(percent);
    };

    const changeFn = () => {
        if (oldState !== "paused")
            queueInst.play();
        else
            queueInst.pause();

        updatePlayState();
    };

    playstateEl.addEventListener("click", clickFn);
    progressEl.addEventListener("input", inputFn);
    progressEl.addEventListener("change", changeFn);

    queueInst
        .on("finish begin", updatePlayState)
        .on({
            update: (progress: number) => {
                progress = +(progress.toFixed(4));
                progressEl.value = `` + progress;
                progressOutputEl.textContent = `${Math.round(progress)}%`;
            },
            stop() {

                updatePlayState();
                playstateEl.removeEventListener("click", clickFn);
                progressEl.removeEventListener("input", inputFn);
                progressEl.removeEventListener("change", changeFn);
                queueInst = null;
            }
        });
} 
*/

(() => {
    let [translateX, duration] = SpringEasing(["0vw", "50vw"], "spring(5, 100, 10, 1)");
    // let translateX = ["0vw", "50vw"];
    // let duration = 1000;
    // let el = document.querySelector('#block-2') as HTMLElement;
    // let opts = await animate({
    //     target: el,
    //     "translate-x": ["0vw", "50vw"],
    //     // translateX,
    //     // translateY: [0, 500],
    //     // padEndDelay: true,
    //     easing: "linear",
    //     // duration,
    //     // loop: true,
    //     speed: 1,
    //     direction: "alternate"
    // });
    // await animate({
    //     options: opts,
    //     "translate-x": ["0vw", "50vw"].reverse(),
    // });
    
    let queueInst = queue({
        // padEndDelay: true,
        easing: "ease",
        duration: 2000,
        loop: 1,
        speed: 1,
        direction: "alternate"
    });

    queueInst.add(((): IAnimationOptions => {
        let el = document.querySelector('#block') as HTMLElement;

        // To support older browsers I can't use partial keyframes
        return {
            target: el,
            "translate-x": translateX,
        };
    })(), "= 0");

    queueInst.add(((): IAnimationOptions => {
        let el = document.querySelector('#block-2') as HTMLElement;

        // To support older browsers I can't use partial keyframes
        return {
            target: el,
            "translate-x": translateX,
        };
    })());

    queueInst.add(((): IAnimationOptions => {
        let el = document.querySelector('#block-3') as HTMLElement;

        // To support older browsers I can't use partial keyframes
        return {
            target: el,
            "translate-x": translateX,
        };
    })(), "^50");
})();