import { animate, IAnimationOptions, methodCall, TypePlayStates, UnitPXCSSValue } from "@okikio/native";
import { interpolate } from "flubber";

// I added extra code to the demo to support Chrome 77 and below
let playbackFn = (containerSel, anims) => {
    let playstateEl = document.querySelector(`${containerSel} #playstate-toggle`) as HTMLInputElement;
    let progressEl = document.querySelector(`${containerSel} #progress`) as HTMLInputElement;

    let progressOutputEl = document.querySelector(`${containerSel} #progress-output`);
    let oldState: "pending" | TypePlayStates;

    let updatePlayState = () => {
        oldState = anims[0].getPlayState();
        if (oldState == "idle") oldState = "paused";
        else if (oldState == "pending") oldState = "running";
        playstateEl.setAttribute("data-playstate", oldState);
    };

    anims[0]
        .on("finish begin", updatePlayState)
        .on("update", (progress) => {
            progress = progress.toFixed(4);
            progressEl.value = `` + progress;
            progressOutputEl.textContent = `${Math.round(progress)}%`;
        });

    let clickFn = () => {
        if (anims[0].is("running")) methodCall(anims, "pause");
        else if (anims[0].is("finished")) methodCall(anims, "reset");
        else methodCall(anims, "play");

        updatePlayState();
    };

    let inputFn = () => {
        let percent = Number(progressEl.value);
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
    });

}

let random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/* Properties Section */
// Playback Controls Demo
export let svgAnim1, svgAnim2, empty, anim, motionPath, getTotalLength;
export let run = () => {
    // Based on an example by animateplus
    (() => {
        let containerSel = ".morph-demo";
        let usingDPathEl = document.querySelector(`${containerSel} #using-d`);
        let usingFlubberPathEl = document.querySelector(`${containerSel} #using-flubber`);

        if (usingDPathEl) {
            let InitialStyle = getComputedStyle(usingDPathEl);
            svgAnim1 = animate({
                target: usingDPathEl,
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
        }

        if (usingDPathEl && usingFlubberPathEl) {
            let InitialStyle = getComputedStyle(usingFlubberPathEl);
            let startPath = usingFlubberPathEl.getAttribute("d");
            let endPath =
                "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z";
            let emptyEl = document.querySelector(".empty");

            let options: IAnimationOptions = {
                duration: 1800,
                easing: "ease",
                loop: 4,
                fillMode: "both",
                direction: "alternate",
            };

            empty = animate({
                target: emptyEl,
                options,
                opacity: [0, 1],
            });

            svgAnim2 = animate({
                target: usingFlubberPathEl,
                options,
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
            });

            let morph = interpolate(startPath, endPath, {
                maxSegmentLength: 0.1
            });

            try {
                let style = getComputedStyle(emptyEl);
                empty.on("update", () => {
                    let progress = Number(style.getPropertyValue("opacity"));
                    let currentPath = morph(progress);
                    usingFlubberPathEl.setAttribute("d", `` + currentPath);
                });
            } catch (e) {
                empty?.stopLoop();
                console.log(e);
            }

            playbackFn(containerSel, [empty, svgAnim1, svgAnim2]);
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

                // To support older browsers I can't use partial keyframes
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

                // To support older browsers I can't use partial keyframes
                let style = getComputedStyle(contain);
                let marginBottom = style.getPropertyValue("margin-bottom");
                let height = style.getPropertyValue("height");
                let transition = animate({
                    target: contain,
                    opacity: [1, 0],
                    height: [height, `0px`],
                    marginBottom: [marginBottom, `0px`],
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
            // To support older browsers I can't use partial keyframes
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
    svgAnim1?.stop();
    svgAnim2?.stop();
    empty?.stop();
    anim?.stop();
    motionPath?.stop();
    getTotalLength?.stop();

}
