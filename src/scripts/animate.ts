type PlaybackState = "idle" | "running" | "paused" | "finished";
type PlaybackDatasetState = "play" | "pause" | "replay";

const PLAYBACK_STATES: Record<PlaybackState, PlaybackDatasetState> = {
  idle: "pause",
  running: "play",
  paused: "pause",
  finished: "replay",
};

interface DemoElements {
  canvas: HTMLElement;
  boxes: [HTMLElement, HTMLElement];
  controlButton: HTMLButtonElement;
  playback: HTMLElement;
  progressBar: HTMLInputElement;
  progressOutput: HTMLElement;
}

class PlaybackTimeline {
  private readonly animations: [Animation, Animation];
  private readonly totalDuration: number;

  constructor(animations: [Animation, Animation]) {
    this.animations = animations;
    this.totalDuration = Math.max(...animations.map((animation) => this.getAnimationEndTime(animation)));
    this.pause();
    this.setProgress(0);
  }

  play() {
    this.animations.forEach((animation) => animation.play());
  }

  pause() {
    this.animations.forEach((animation) => animation.pause());
  }

  reset() {
    this.animations.forEach((animation) => {
      animation.cancel();
      animation.pause();
      animation.currentTime = 0;
    });
  }

  setProgress(percent: number) {
    const currentTime = this.totalDuration * (percent / 100);
    this.animations.forEach((animation) => {
      animation.pause();
      animation.currentTime = currentTime;
    });
  }

  getProgress() {
    const currentTime = Math.max(...this.animations.map((animation) => this.toNumber(animation.currentTime)));
    return (currentTime / this.totalDuration) * 100;
  }

  getState(): PlaybackState {
    const [firstAnimation] = this.animations;
    const state = firstAnimation.playState;

    if (state === "running") {
      return "running";
    }

    if (state === "paused" && this.toNumber(firstAnimation.currentTime) > 0) {
      return "paused";
    }

    if (state === "finished") {
      return "finished";
    }

    return "idle";
  }

  private getAnimationEndTime(animation: Animation) {
    if (animation.effect instanceof KeyframeEffect) {
      return this.toNumber(animation.effect.getComputedTiming().endTime);
    }

    return 0;
  }

  private toNumber(value: CSSNumberish | null | undefined) {
    return typeof value === "number" ? value : 0;
  }
}

function getDemoElements(): DemoElements | null {
  const container = document.querySelector<HTMLElement>("#simple-demo");
  const canvas = container?.querySelector<HTMLElement>(".playback-canvas");
  const boxes = container?.querySelectorAll<HTMLElement>(".animated-box");
  const controlButton = container?.querySelector<HTMLButtonElement>(".control-btn");
  const playback = container?.querySelector<HTMLElement>(".playback");
  const progressBar = container?.querySelector<HTMLInputElement>(".progress-bar");
  const progressOutput = container?.querySelector<HTMLElement>(".progress-output");

  if (
    !(canvas instanceof HTMLElement) ||
    !boxes ||
    boxes.length < 2 ||
    !(controlButton instanceof HTMLButtonElement) ||
    !(playback instanceof HTMLElement) ||
    !(progressBar instanceof HTMLInputElement) ||
    !(progressOutput instanceof HTMLElement)
  ) {
    return null;
  }

  return {
    canvas,
    boxes: [boxes[0], boxes[1]],
    controlButton,
    playback,
    progressBar,
    progressOutput,
  };
}

function createAnimation(box: HTMLElement, x: number, y: number, delay = 0) {
  return box.animate(
    [
      { transform: "translate(0px, 0px)" },
      { transform: `translate(${x}px, ${y}px)` },
    ],
    {
      delay,
      duration: 3000,
      direction: "alternate",
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      fill: "both",
      iterations: 5,
    }
  );
}

function updatePlaybackUi(elements: DemoElements, timeline: PlaybackTimeline) {
  const progress = Math.max(0, Math.min(100, timeline.getProgress()));
  elements.progressBar.value = `${progress}`;
  elements.progressOutput.textContent = `${Math.round(progress)}%`;
  elements.playback.dataset.state = PLAYBACK_STATES[timeline.getState()];
}

export function startPlaybackDemo() {
  const elements = getDemoElements();
  if (!elements) {
    return null;
  }

  const [primaryBox, secondaryBox] = elements.boxes;
  const motionWidth = Math.max(elements.canvas.clientWidth - primaryBox.offsetWidth, 0);
  const motionHeight = Math.max(elements.canvas.clientHeight - primaryBox.offsetHeight, 0);

  const timeline = new PlaybackTimeline([
    createAnimation(primaryBox, motionWidth, motionHeight),
    createAnimation(secondaryBox, motionWidth, motionHeight, 400),
  ]);

  let previousState = timeline.getState();
  let rafId = 0;

  const tick = () => {
    updatePlaybackUi(elements, timeline);

    if (timeline.getState() === "running") {
      rafId = window.requestAnimationFrame(tick);
    }
  };

  const handleClick = () => {
    const state = timeline.getState();

    if (state === "running") {
      timeline.pause();
    } else if (state === "finished") {
      timeline.reset();
      timeline.play();
    } else {
      timeline.play();
    }

    window.cancelAnimationFrame(rafId);
    rafId = window.requestAnimationFrame(tick);
    previousState = timeline.getState();
    updatePlaybackUi(elements, timeline);
  };

  const handleInput = () => {
    timeline.setProgress(Number(elements.progressBar.value));
    updatePlaybackUi(elements, timeline);
  };

  const handleChange = () => {
    if (previousState === "running") {
      timeline.play();
      rafId = window.requestAnimationFrame(tick);
    } else {
      timeline.pause();
    }

    updatePlaybackUi(elements, timeline);
  };

  elements.controlButton.addEventListener("click", handleClick);
  elements.progressBar.addEventListener("input", handleInput);
  elements.progressBar.addEventListener("change", handleChange);
  updatePlaybackUi(elements, timeline);

  return timeline;
}
