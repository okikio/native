import { animate } from "@okikio/native";
let anim = animate({
    target: ".div",
    keyframes(index, total) {
        return [
            { transform: "translateX(0px)", opacity: 0.1 },
            { transform: "translateX(300px)", opacity: 0.2 + ((index + 1) / total) }
        ]
    },
    // transform: ["translateX(0px)", "translateX(300px)"],
    // opacity(index, total, element) {
    //     return [0, ((index + 1) / total)];
    // },

    // It is best to use the onfinish() method, but in this situation fillMode works best
    fillMode: "both",
    // onfinish(element, index, total) {
    //     element.style.opacity = `${((index + 1) / total)}`;
    //     element.style.transform = "translateX(300px)";
    // },

    easing: "out-cubic",
    duration(index: number) {
        return (index + 1) * 500;
    },
    loop: 5,
    speed: 1.5,
    direction: "alternate",
    delay(index: number) {
        return ((index + 1) * 500) / 2;
    },
    autoplay: true
});

let el: HTMLElement = document.querySelector(".info");
let backupInfo = el.textContent;
let info = backupInfo;
anim.on({
    begin() {
        if (el) {
            info = backupInfo;
            el.textContent = info;
            el.style.color = "initial";
        }
    }
})
anim.on("complete", () => {
    if (el) {
        info = "Done.";
        el.textContent = info;
        el.style.color = "red";

        console.log(info);
    }
});

let scrub = document.getElementById('scrub') as HTMLInputElement;
scrub.addEventListener('input', e => {
    var percent = +(e.target as HTMLInputElement).value;
    anim.setProgress(percent);
    anim.pause();
});

let progressSpan = document.querySelector(".progress");
anim.on("update", progress => {
    scrub.value = `` + progress;
    progressSpan && (progressSpan.textContent = `${Math.round(progress)}%`);
});

scrub.addEventListener('change', () => {
    let progress = anim.getProgress();
    anim.all((a) => {
        if (a.playState != "finished" && progress < 100) {
            console.log({ playstate: a.playState, currentTime: a.currentTime, progress });
            console.log(a.timeline);
        }
    })
    // if (Math.round(anim.getProgress()) >= 100) {
    //     anim.finish();
    //     return false;
    // }
    // anim.play();
});


let playtoggle = document.querySelector(".playtoggle");
if (playtoggle) {
    playtoggle.addEventListener("click", () => {
        let state = anim.getPlayState();
        if (state === "running") anim.pause();
        else if (state === "finished") anim.reset();
        else {
            anim.play();
        }
        console.log(state);
    });
}

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
