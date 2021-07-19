import { PJAX, App, TransitionManager, HistoryManager, PageManager } from "@okikio/native";
import { timeline, ApplyCustomEasing, Timeline, CustomEasing, ParseTransformableCSSProperties } from "@okikio/animate";

import type { TypePlayStates } from "@okikio/animate";

import { Fade } from "./transitions/Fade";
const app = new App({
    transitions: [
        ["default", Fade],
    ]
});

app
    .set("HistoryManager", new HistoryManager())
    .set("PageManager", new PageManager())
    .set("TransitionManager", new TransitionManager())

    .add(new PJAX());

try {
    app.boot();

    let containerSel = "#simple-demo";
    let el = document.querySelector(`${containerSel} .animated-box`);
    let parentEl = el.parentNode as HTMLElement;

    let boundingRect = el.getBoundingClientRect();
    let parentBoundingRect = parentEl.getBoundingClientRect();

    let { width, height } = boundingRect;
    let { width: parentWidth, height: parentHeight } = parentBoundingRect;

    let motionWidth = parentWidth - width;
    let motionHeight = parentHeight - height;

    let timelineInst = timeline();
    timelineInst.add({
        target: el,
        translateX: [0, motionWidth], // CustomEasing([0, motionWidth], "linear"),
        ...ApplyCustomEasing({
            translateY: [0, motionHeight],
            easing: "out-bounce",
            duration: 3000,
        }),
        // composite: "accumulate",
        fillMode: "both",
        loop: 5,
        easing: "out-back",
        direction: "alternate"
    });

    // timelineInst.add({
    //     target: el,
    //     translateY: CustomEasing([0, motionHeight], "linear"),
    //     ...ApplyCustomEasing({
    //         translateX: [0, motionWidth],
    //         easing: "out-bounce",
    //         duration: 3000,
    //     }),
    //     fillMode: "both",
    //     loop: 5,
    //     easing: "linear",
    //     direction: "alternate"
    // });

    let oldMotionWidth = motionWidth;
    let oldMotionHeight = motionHeight;

    app.on("resize", () => {
        boundingRect = el.getBoundingClientRect();
        parentBoundingRect = parentEl.getBoundingClientRect();

        width = boundingRect.width;
        height = boundingRect.height;

        parentWidth = parentBoundingRect.width;
        parentHeight = parentBoundingRect.height;

        motionWidth = parentWidth - width;
        motionHeight = parentHeight - height;

        if (oldMotionWidth != motionWidth || oldMotionHeight != motionHeight) {
            timelineInst.allInstances(anim => {
                let opts = Object.assign({},

                    oldMotionWidth != motionWidth ? {
                        translateX: CustomEasing([0, motionWidth], "linear"),
                    } : null,

                    oldMotionHeight != motionHeight ? ApplyCustomEasing({
                        translateY: [0, motionHeight],
                        easing: "out-bounce",
                        duration: 3000,
                    }) : null
                );

                let running = anim.is("running");
                let progress = anim.getProgress();
                anim.updateOptions(opts);
                if (!running) {
                    anim.pause();
                    anim.setProgress(progress);
                }
            });

            oldMotionWidth = motionWidth;
            oldMotionHeight = motionHeight;
        }
    });

    playbackFn(containerSel, timelineInst);
} catch (err) {
    console.warn("[App] boot failed,", err);
}

let playStates = {
    "running": "play",
    "paused": "pause",
    "finished": "replay",
    "idle": "pause",
    "pending": "play"
}

// I added extra code to the demo to support Chrome 77 and below
function playbackFn(containerSel: string, timelineInst: Timeline) {
    let container = document.querySelector(containerSel);

    let controlBtn = container.querySelector(`.control-btn`) as HTMLInputElement;
    let playbackEl = container.querySelector(`.playback`) as HTMLInputElement;
    let progressBar = container.querySelector(`.progress-bar`) as HTMLInputElement;
    let progressOutputEl = container.querySelector(`.progress-output`) as HTMLElement;

    let oldState: "pending" | TypePlayStates = timelineInst.getPlayState();
    let updatePlayState = () => {
        oldState = timelineInst.getPlayState() as "pending" | TypePlayStates;
        playbackEl.setAttribute("data-state", playStates[oldState]);
    };

    const clickFn = () => {
        if (timelineInst.is("running"))
            timelineInst.pause();
        else if (timelineInst.is("finished"))
            timelineInst.reset();
        else
            timelineInst.play();

        updatePlayState();
    };

    const inputFn = () => {
        let percent = Number(progressBar.value);
        timelineInst.pause();
        timelineInst.setProgress(percent);
    };

    const changeFn = () => {
        if (oldState !== "paused")
            timelineInst.play();
        else
            timelineInst.pause();

        updatePlayState();
    };

    controlBtn.addEventListener("click", clickFn);
    progressBar.addEventListener("input", inputFn);
    progressBar.addEventListener("change", changeFn);

    timelineInst
        .on("finish begin", updatePlayState)
        .on({
            update: (progress: number) => {
                progress = +(progress.toFixed(4));
                progressBar.value = `` + progress;
                progressOutputEl.textContent = `${Math.round(progress)}%`;
            },
            stop() {
                controlBtn.removeEventListener("click", clickFn);
                progressBar.removeEventListener("input", inputFn);
                progressBar.removeEventListener("change", changeFn);
                timelineInst = null;
            }
        });
}