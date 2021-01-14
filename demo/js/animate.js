// packages/manager/src/api.ts
var Manager = class {
  constructor(value) {
    this.map = new Map(value);
  }
  getMap() {
    return this.map;
  }
  get(key) {
    return this.map.get(key);
  }
  keys() {
    return Array.from(this.map.keys());
  }
  values() {
    return Array.from(this.map.values());
  }
  set(key, value) {
    this.map.set(key, value);
    return this;
  }
  add(value) {
    let size = this.size;
    let num = size;
    this.set(num, value);
    return this;
  }
  get size() {
    return this.map.size;
  }
  get length() {
    return this.map.size;
  }
  last(distance = 1) {
    let key = this.keys()[this.size - distance];
    return this.get(key);
  }
  delete(key) {
    return this.map.delete(key);
  }
  remove(key) {
    this.map.delete(key);
    return this;
  }
  clear() {
    this.map.clear();
    return this;
  }
  has(key) {
    return this.map.has(key);
  }
  entries() {
    return this.map.entries();
  }
  forEach(callback, context) {
    this.map.forEach(callback, context);
    return this;
  }
  [Symbol.iterator]() {
    return this.entries();
  }
};
var methodCall = (manager, method, ...args) => {
  manager.forEach((item) => {
    item[method](...args);
  });
};

// packages/native/src/page.ts
var PARSER = new DOMParser();

// packages/emitter/src/api.ts
var newListener = ({
  callback = () => {
  },
  scope = null,
  name = "event"
}) => ({callback, scope, name});
var Event = class extends Manager {
  constructor(name = "event") {
    super();
    this.name = name;
  }
};
var EventEmitter = class extends Manager {
  constructor() {
    super();
  }
  getEvent(name) {
    let event = this.get(name);
    if (!(event instanceof Event)) {
      this.set(name, new Event(name));
      return this.get(name);
    }
    return event;
  }
  newListener(name, callback, scope) {
    let event = this.getEvent(name);
    event.add(newListener({name, callback, scope}));
    return event;
  }
  on(events, callback, scope) {
    if (typeof events == "undefined")
      return this;
    if (typeof events == "string")
      events = events.trim().split(/\s/g);
    let _name;
    let _callback;
    let isObject = typeof events == "object" && !Array.isArray(events);
    let _scope = isObject ? callback : scope;
    if (!isObject)
      _callback = callback;
    Object.keys(events).forEach((key) => {
      if (isObject) {
        _name = key;
        _callback = events[key];
      } else {
        _name = events[key];
      }
      this.newListener(_name, _callback, _scope);
    }, this);
    return this;
  }
  removeListener(name, callback, scope) {
    let event = this.get(name);
    if (event instanceof Event && callback) {
      let listener = newListener({name, callback, scope});
      event.forEach((value, i) => {
        if (value.callback === listener.callback && value.scope === listener.scope) {
          return event.remove(i);
        }
      });
    }
    return event;
  }
  off(events, callback, scope) {
    if (typeof events == "undefined")
      return this;
    if (typeof events == "string")
      events = events.trim().split(/\s/g);
    let _name;
    let _callback;
    let isObject = typeof events == "object" && !Array.isArray(events);
    let _scope = isObject ? callback : scope;
    if (!isObject)
      _callback = callback;
    Object.keys(events).forEach((key) => {
      if (isObject) {
        _name = key;
        _callback = events[key];
      } else {
        _name = events[key];
      }
      if (typeof _callback === "function") {
        this.removeListener(_name, _callback, _scope);
      } else
        this.remove(_name);
    }, this);
    return this;
  }
  emit(events, ...args) {
    if (typeof events == "undefined")
      return this;
    if (typeof events == "string")
      events = events.trim().split(/\s/g);
    events.forEach((event) => {
      let _event = this.get(event);
      if (_event instanceof Event) {
        _event.forEach((listener) => {
          let {callback, scope} = listener;
          callback.apply(scope, args);
        });
      }
    }, this);
    return this;
  }
  clear() {
    methodCall(this, "clear");
    super.clear();
    return this;
  }
};

// packages/animate/src/api.ts
var getElements = (selector) => {
  return typeof selector === "string" ? Array.from(document.querySelectorAll(selector)) : [selector];
};
var flatten = (arr) => [].concat(...arr);
var getTargets = (targets) => {
  if (Array.isArray(targets)) {
    return flatten(targets.map(getTargets));
  }
  if (typeof targets == "string" || targets instanceof Node)
    return getElements(targets);
  if (targets instanceof NodeList || targets instanceof HTMLCollection)
    return Array.from(targets);
  return [];
};
var computeValue = (value, args, context) => {
  if (typeof value === "function") {
    return value.apply(context, args);
  } else {
    return value;
  }
};
var mapObject = (obj, args, options) => {
  let key, value, result = {};
  let keys = Object.keys(obj);
  for (let i = 0, len = keys.length; i < len; i++) {
    key = keys[i];
    value = obj[key];
    result[key] = computeValue(value, args, options);
  }
  return result;
};
var easings = {
  in: "ease-in",
  out: "ease-out",
  "in-out": "ease-in-out",
  "in-sine": "cubic-bezier(0.47, 0, 0.745, 0.715)",
  "out-sine": "cubic-bezier(0.39, 0.575, 0.565, 1)",
  "in-out-sine": "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
  "in-quad": "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
  "out-quad": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  "in-out-quad": "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
  "in-cubic": "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
  "out-cubic": "cubic-bezier(0.215, 0.61, 0.355, 1)",
  "in-out-cubic": "cubic-bezier(0.645, 0.045, 0.355, 1)",
  "in-quart": "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
  "out-quart": "cubic-bezier(0.165, 0.84, 0.44, 1)",
  "in-out-quart": "cubic-bezier(0.77, 0, 0.175, 1)",
  "in-quint": "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
  "out-quint": "cubic-bezier(0.23, 1, 0.32, 1)",
  "in-out-quint": "cubic-bezier(0.86, 0, 0.07, 1)",
  "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
  "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
  "in-out-expo": "cubic-bezier(1, 0, 0, 1)",
  "in-circ": "cubic-bezier(0.6, 0.04, 0.98, 0.335)",
  "out-circ": "cubic-bezier(0.075, 0.82, 0.165, 1)",
  "in-out-circ": "cubic-bezier(0.785, 0.135, 0.15, 0.86)",
  "in-back": "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
  "out-back": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "in-out-back": "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
};
var getEase = (ease) => {
  return /^(in|out)/.test(ease) ? easings[ease] : ease;
};
var DefaultAnimationOptions = {
  keyframes: [],
  loop: 1,
  delay: 0,
  speed: 1,
  endDelay: 0,
  easing: "ease",
  autoplay: true,
  duration: 1e3,
  fillMode: "auto",
  direction: "normal",
  extend: {}
};
var Animate = class {
  constructor(options = {}) {
    this.options = {};
    this.targets = [];
    this.properties = {};
    this.animations = new Manager();
    this.totalDuration = 0;
    this.minDelay = 0;
    this.computedOptions = new Manager();
    this.emitter = new EventEmitter();
    var _a;
    try {
      let {options: animation, ...rest} = options;
      let oldOptions = animation instanceof Animate ? animation.getOptions() : Array.isArray(animation) ? (_a = animation == null ? void 0 : animation[0]) == null ? void 0 : _a.getOptions() : animation;
      this.options = Object.assign({}, DefaultAnimationOptions, oldOptions, rest);
      this.loop = this.loop.bind(this);
      let {
        loop,
        delay,
        speed,
        easing,
        endDelay,
        duration,
        direction,
        fillMode,
        onfinish,
        target,
        keyframes,
        autoplay,
        extend,
        ...properties
      } = this.options;
      this.mainElement = document.createElement("div");
      this.targets = getTargets(target);
      this.properties = properties;
      let delays = [];
      let len = this.targets.length;
      let animationKeyframe;
      for (let i = 0; i < len; i++) {
        let target2 = this.targets[i];
        let animationOptions = {
          easing: typeof easing == "string" ? getEase(easing) : easing,
          iterations: loop === true ? Infinity : loop,
          direction,
          endDelay,
          duration,
          delay,
          fill: fillMode,
          ...extend
        };
        let arrKeyframes = computeValue(keyframes, [i, len, target2], this);
        animationKeyframe = arrKeyframes.length ? arrKeyframes : this.properties;
        animationOptions = mapObject(animationOptions, [i, len, target2], this);
        if (!(arrKeyframes.length > 0))
          animationKeyframe = mapObject(animationKeyframe, [i, len, target2], this);
        let tempDurations = animationOptions.delay + animationOptions.duration * animationOptions.iterations + animationOptions.endDelay;
        if (this.totalDuration < tempDurations)
          this.totalDuration = tempDurations;
        let animation2 = target2.animate(animationKeyframe, animationOptions);
        animation2.onfinish = () => {
          typeof onfinish == "function" && onfinish.call(this, target2, i, len, animation2);
          this.emit("finish", target2, i, len, animation2);
        };
        this.computedOptions.set(animation2, animationOptions);
        this.animations.set(target2, animation2);
        delays.push(animationOptions.delay);
      }
      this.mainAnimation = this.mainElement.animate([
        {opacity: "0"},
        {opacity: "1"}
      ], {
        duration: this.totalDuration,
        easing: "linear"
      });
      this.minDelay = Math.min(...delays);
      this.setSpeed(speed);
      if (autoplay)
        this.play();
      else
        this.pause();
      this.promise = this.newPromise();
      this.mainAnimation.onfinish = () => {
        this.emit("complete", this);
        this.stopLoop();
      };
    } catch (err) {
      this.emit("error", err);
    }
  }
  newPromise() {
    return new Promise((resolve, reject) => {
      this.on("complete", () => resolve([this]));
      this.on("error", (err) => reject(err));
    });
  }
  then(onFulfilled, onRejected) {
    onFulfilled = onFulfilled == null ? void 0 : onFulfilled.bind(this);
    onRejected = onRejected == null ? void 0 : onRejected.bind(this);
    this.promise.then(onFulfilled, onRejected);
    return this;
  }
  catch(onRejected) {
    onRejected = onRejected == null ? void 0 : onRejected.bind(this);
    this.promise.catch(onRejected);
    return this;
  }
  finally(onFinally) {
    onFinally = onFinally == null ? void 0 : onFinally.bind(this);
    this.promise.finally(onFinally);
    return this;
  }
  loop() {
    this.stopLoop();
    this.emit("update", this.getProgress(), this);
    this.animationFrame = window.requestAnimationFrame(this.loop);
  }
  stopLoop() {
    window.cancelAnimationFrame(this.animationFrame);
  }
  all(method) {
    method(this.mainAnimation);
    this.animations.forEach((animation) => method(animation));
    return this;
  }
  beginEvent() {
    if (this.getProgress() == 0) {
      let timer = window.setTimeout(() => {
        this.emit("begin", this);
        timer = window.clearTimeout(timer);
      }, this.minDelay);
    }
  }
  play() {
    let playstate = this.getPlayState();
    this.beginEvent();
    this.all((anim) => anim.play());
    this.emit("play", playstate, this);
    this.loop();
    return this;
  }
  pause() {
    let playstate = this.getPlayState();
    this.all((anim) => anim.pause());
    this.emit("pause", playstate, this);
    this.stopLoop();
    this.animationFrame = void 0;
    return this;
  }
  reset() {
    this.setProgress(0);
    this.beginEvent();
    if (this.options.autoplay)
      this.play();
    else
      this.pause();
    return this;
  }
  cancel() {
    this.all((anim) => anim.cancel());
    this.stopLoop();
    return this;
  }
  finish() {
    this.all((anim) => anim.finish());
    this.stopLoop();
    return this;
  }
  stop() {
    this.cancel();
    this.animations.clear();
    while (this.targets.length)
      this.targets.pop();
    this.mainElement = void 0;
    this.emit("stop");
  }
  getTargets() {
    return this.targets;
  }
  getAnimation(element) {
    return this.animations.get(element);
  }
  getTiming(target) {
    var _a, _b, _c;
    let animation = target instanceof Animation ? target : this.getAnimation(target);
    let keyframeOptions = (_a = this.computedOptions.get(animation)) != null ? _a : {};
    let timings = (_c = (_b = animation.effect) == null ? void 0 : _b.getTiming()) != null ? _c : {};
    let options = this.getOptions();
    return {...DefaultAnimationOptions, ...options, ...timings, ...keyframeOptions};
  }
  getTotalDuration() {
    return this.totalDuration;
  }
  getCurrentTime() {
    return this.mainAnimation.currentTime;
  }
  getProgress() {
    return this.getCurrentTime() / this.totalDuration * 100;
  }
  getSpeed() {
    return this.mainAnimation.playbackRate;
  }
  getPlayState() {
    return this.mainAnimation.playState;
  }
  getOptions() {
    return this.options;
  }
  setCurrentTime(time) {
    this.all((anim) => {
      anim.currentTime = time;
    });
    this.emit("update", this.getProgress());
    return this;
  }
  setProgress(percent) {
    let time = percent / 100 * this.totalDuration;
    this.setCurrentTime(time);
    return this;
  }
  setSpeed(speed = 1) {
    this.all((anim) => {
      anim.playbackRate = speed;
    });
    return this;
  }
  on(events, callback, scope) {
    this.emitter.on(events, callback, scope != null ? scope : this);
    return this;
  }
  off(events, callback, scope) {
    this.emitter.off(events, callback, scope != null ? scope : this);
    return this;
  }
  emit(events, ...args) {
    this.emitter.emit(events, ...args);
    return this;
  }
  toJSON() {
    return this.getOptions();
  }
  get [Symbol.toStringTag]() {
    return `Animate`;
  }
};
var animate = (options = {}) => {
  return new Animate(options);
};

// build/ts/animate.ts
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
(() => {
  let containerSel = ".array-demo";
  let el = (num) => `${containerSel} .el-0${num}`;
  let anim = animate({
    target: [
      `${containerSel} .el-01`,
      el(2),
      el(3),
      el(4),
      el(5)
    ],
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
(() => {
  let containerSel = ".css-properties-demo";
  let anim = animate({
    target: `${containerSel} .el`,
    backgroundColor: ["#616aff", "#fff"],
    left: ["0px", "240px"],
    borderRadius: ["0%", "50%"],
    onfinish(element) {
      let {style} = element;
      style.backgroundColor = "#fff";
      style.left = "240px";
      style.borderRadius = "50%";
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
(() => {
  let containerSel = ".svg-attributes-demo";
  var pathEl = document.querySelector(`${containerSel} path`);
  let anim = animate({
    target: pathEl,
    strokeDashoffset: [4e3, 0],
    loop: true,
    direction: "alternate",
    easing: "in-out-expo",
    autoplay: false
  });
  let container = document.querySelector(containerSel);
  container.addEventListener("click", () => {
    if (anim.getPlayState() === "running")
      anim.pause();
    else
      anim.play();
  });
  anim.on("update", () => {
    console.log("Go");
  });
})();
