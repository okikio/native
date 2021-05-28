import { animate, IAnimationOptions, methodCall, UnitPXCSSValue } from "@okikio/native";

// I added extra code to the demo to support Chrome 77 and below
let playbackFn = (containerSel, anims) => {
    let playstateEl = document.querySelector(`${containerSel} #playstate-toggle`) as HTMLInputElement;
    let progressEl = document.querySelector(`${containerSel} #progress`) as HTMLInputElement;

    let progressOutputEl = document.querySelector(`${containerSel} #progress-output`);
    let oldState: AnimationPlayState;

    let updatePlayState = () => {
        oldState = anims[0].getPlayState();
        if (oldState as string == "pending") oldState = "running";
        playstateEl.setAttribute("data-playstate", oldState);

        methodCall(anims, "loop");
    };

    anims[0]
        .on("finish begin", updatePlayState)
        .on("update", (progress) => {
            progressEl.value = `` + (Math.round(progress) >= 100 ? 100 : progress.toFixed(2));
            progressOutputEl.textContent = `${Math.round(progress)}%`;
        });

    let clickFn = () => {
        if (anims[0].is("running")) methodCall(anims, "pause");
        else if (anims[0].is("finished")) methodCall(anims, "reset");
        else methodCall(anims, "play");

        updatePlayState();
    };

    let inputFn = () => {
        let percent = Math.round(+progressEl.value);
        methodCall(anims, "setProgress", percent);
        methodCall(anims, "pause");
    }

    let changeFn = () => {
        oldState !== "paused" ? methodCall(anims, "play") : methodCall(anims, "pause");

        updatePlayState();
    }

    playstateEl.addEventListener("click", clickFn);
    progressEl.addEventListener("input", inputFn);
    progressEl.addEventListener("change", changeFn);

    anims[0].on("stop", () => {
        playstateEl.removeEventListener("click", clickFn);
        progressEl.removeEventListener("input", inputFn);
        progressEl.removeEventListener("change", changeFn);
        anims = null;
    })

}

let random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/* Properties Section */
// Playback Controls Demo
export let anim, motionPath, getTotalLength;
export let run = () => {
    // Based on an example by animateplus
    (() => {
        let containerSel = ".morph-demo";
        let pathEl = document.querySelector(`${containerSel} path`);

        if (pathEl) {
            let InitialStyle = getComputedStyle(pathEl);
            let anim = animate({
                target: pathEl,
                duration: 1800,
                easing: "ease",
                loop: 4,
                direction: "alternate",
                "d": [
                    InitialStyle.getPropertyValue("d"),
                    `path("M2,5 S2,14 4,5 S7,8 8,4")`
                ],
                stroke: [
                    InitialStyle.getPropertyValue("stroke"),
                    `rgb(96, 165, 250)`
                ],
            });

            playbackFn(containerSel, [anim]);
        }
    })();

    (() => {
        let containerSel = ".playback-demo";
        let DOMNodes = document.querySelectorAll(`${containerSel} .el`);
        if (DOMNodes.length) {
            anim = animate({
                target: DOMNodes,
                // keyframes(_, total, target) {
                //     let bgColor = getComputedStyle(target).getPropertyValue("background-color");
                //     let [r, g, b] = [
                //         random(0, 255),
                //         random(0, 255),
                //         random(0, 255)
                //     ];

                //     return [
                //         {
                //             translateX: 0,
                //             translateY: 0,
                //             scale: 1,
                //             opacity: 0.5,
                //             rotate: 0,
                //             backgroundColor: bgColor
                //         },
                //         {
                //             translateX: random(50, 400),
                //             translateY: (random(-50, 50) * total),
                //             scale: 1 + random(0.025, 1.75),
                //             opacity: 0.5 + Math.min(random(0.025, total) / total, 0.5),
                //             rotate: random(-360, 360),
                //             backgroundColor: `rgb(${r}, ${g}, ${b})`
                //         }
                //     ];
                // },

                backgroundColor(...args) {
                    let [, , target] = args;
                    let [r, g, b] = [
                        random(0, 255),
                        random(0, 255),
                        random(0, 255)
                    ]
                    return [
                        getComputedStyle(target).getPropertyValue("background-color"),
                        `rgb(${r}, ${g}, ${b})`
                    ];
                },

                translateX: () => [0, random(50, 400)],
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

                // It is best to use the onfinish() method, but in this situation fillMode works best
                loop: 2,
                speed: (i) => 1.5 - (i * 0.125),

                fillMode: "both",
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
                let el = _contain.querySelector(".el");
                elPlacement.appendChild(_contain);

                anim.add(el);

                let transition = animate({
                    target: _contain,
                    opacity: [0, 1],
                    height: [0, "4vmin"],
                    marginBottom: UnitPXCSSValue([0, 5]),
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

                let transition = animate({
                    target: contain,
                    opacity: [1, 0],
                    height: [contain.style.height, 0],
                    marginBottom: [contain.style.marginBottom, 0],
                    fillMode: "forwards",
                    duration: 400,
                    easing: "out"
                }).then(() => {
                    transition.stop();
                    contain?.remove();

                    transition = null;
                    contain = null;
                    el = null;
                });
            };

            playbackFn(containerSel, [anim]);
        }
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
        if (el) {
            motionPath = animate({
                target: el,
                "offsetDistance": ["0%", "100%"],
                ...options
            });
        }

        let path = document.querySelector('.motion-path path') as SVGPathElement;
        let el2 = document.querySelector('.motion-path .el-2') as HTMLElement;
        if (path && el2) {

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

            getTotalLength = animate({
                target: el2,
                translate: [...pts],
                rotate: rotateArr,
                fillMode: "both",
                ...options,
            });

            playbackFn(containerSel, [motionPath, getTotalLength]);
        }
    })();
};

export let stop = () => {
    anim?.stop();
    motionPath?.stop();
    getTotalLength?.stop();

}
