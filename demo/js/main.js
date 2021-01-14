// packages/native/src/config.ts
var CONFIG_DEFAULTS = {
  wrapperAttr: "wrapper",
  noAjaxLinkAttr: "no-ajax-link",
  noPrefetchAttr: "no-prefetch",
  headers: [
    ["x-partial", "true"]
  ],
  preventSelfAttr: `prevent="self"`,
  preventAllAttr: `prevent="all"`,
  transitionAttr: "transition",
  blockAttr: `block`,
  timeout: 3e4
};
var newConfig = (config) => {
  return Object.assign({...CONFIG_DEFAULTS}, config);
};
var toAttr = (config, value, brackets = true) => {
  let {prefix} = config;
  let attr = `data${prefix ? "-" + prefix : ""}-${value}`;
  return brackets ? `[${attr}]` : attr;
};
var getConfig = (config, value, brackets = true) => {
  if (typeof value !== "string")
    return config;
  let prop = config[value];
  if (typeof prop === "string")
    return toAttr(config, prop, brackets);
  return prop;
};

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

// packages/native/src/manager.ts
var ManagerItem = class {
  constructor() {
  }
  install() {
  }
  register(manager, key) {
    this.manager = manager;
    this.app = manager.app;
    this.config = manager.config;
    this.emitter = manager.emitter;
    this.key = key;
    this.install();
    return this;
  }
  uninstall() {
  }
  unregister() {
    this.uninstall();
    this.manager.remove(this.key);
    this.key = void 0;
    this.manager = void 0;
    this.app = void 0;
    this.config = void 0;
    this.emitter = void 0;
  }
};
var AdvancedManager = class extends Manager {
  constructor(app2) {
    super();
    this.app = app2;
    this.config = app2.config;
    this.emitter = app2.emitter;
  }
  set(key, value) {
    super.set(key, value);
    value.register(this, key);
    return this;
  }
};

// packages/native/src/url.ts
var newURL = (url = window.location.href) => {
  return url instanceof URL ? url : new URL(url, window.location.origin);
};
var getHashedPath = (url) => `${url.pathname}${url.hash}`;
var clean = (url) => url.toString().replace(/(\/#.*|\/|#.*)$/, "");
var equal = (a, b) => {
  let urlA = newURL(a);
  let urlB = newURL(b);
  return clean(urlA) === clean(urlB);
};

// packages/native/src/service.ts
var Service = class extends ManagerItem {
  init() {
  }
  boot() {
    this.initEvents();
  }
  initEvents() {
  }
  stopEvents() {
  }
  stop() {
    this.stopEvents();
    this.unregister();
  }
};
var ServiceManager = class extends AdvancedManager {
  constructor(app2) {
    super(app2);
  }
  init() {
    methodCall(this, "init");
    return this;
  }
  boot() {
    methodCall(this, "boot");
    return this;
  }
  stop() {
    methodCall(this, "stop");
    return this;
  }
};

// packages/native/src/history.ts
var newCoords = (x = window.scrollX, y = window.scrollY) => ({x, y});
var newState = (state = {
  url: getHashedPath(newURL()),
  index: 0,
  transition: "default",
  data: {
    scroll: newCoords(),
    trigger: "HistoryManager"
  }
}) => state;
var HistoryManager = class extends Service {
  constructor() {
    super(...arguments);
    this.pointer = -1;
  }
  init() {
    this.states = [];
    let state = newState();
    this.add(state, "replace");
  }
  get(index) {
    return this.states[index];
  }
  add(value, historyAction = "push") {
    let state = newState(value);
    let len = this.length;
    this.states.push({...state});
    this.pointer = len;
    let item = {
      index: this.pointer,
      states: [...this.states]
    };
    changeState(historyAction, state, item);
    return this;
  }
  remove(index) {
    if (index) {
      this.states.splice(index, 1);
    } else {
      this.states.pop();
    }
    this.pointer--;
    return this;
  }
  replace(newStates) {
    this.states = newStates;
    return this;
  }
  set(i, state) {
    return this.states[i] = state;
  }
  get current() {
    return this.get(this.pointer);
  }
  get last() {
    return this.get(this.length - 1);
  }
  get previous() {
    return this.pointer < 1 ? null : this.get(this.pointer - 1);
  }
  get length() {
    return this.states.length;
  }
};
var changeState = (action, state, item) => {
  let href = getHashedPath(newURL(state.url));
  let args = [item, "", href];
  if (window.history) {
    switch (action) {
      case "push":
        window.history.pushState.apply(window.history, args);
        break;
      case "replace":
        window.history.replaceState.apply(window.history, args);
        break;
    }
  }
};

// packages/native/src/page.ts
var PARSER = new DOMParser();
var Page = class extends ManagerItem {
  constructor(url = newURL(), dom = document) {
    super();
    this.url = url;
    if (typeof dom === "string") {
      this.data = dom;
    } else
      this.dom = dom || document;
  }
  build() {
    if (!(this.dom instanceof Node)) {
      this.dom = PARSER.parseFromString(this.data, "text/html");
    }
    if (!(this.body instanceof Node)) {
      let {title, head, body} = this.dom;
      this.title = title;
      this.head = head;
      this.body = body;
      this.wrapper = this.body.querySelector(this.wrapperAttr);
    }
  }
  install() {
    this.wrapperAttr = getConfig(this.config, "wrapperAttr");
  }
  uninstall() {
    this.url = void 0;
    this.title = void 0;
    this.head = void 0;
    this.body = void 0;
    this.dom = void 0;
    this.wrapper = void 0;
    this.data = void 0;
    this.wrapperAttr = void 0;
  }
};
var PageManager = class extends Service {
  constructor() {
    super(...arguments);
    this.loading = new Manager();
  }
  install() {
    var _a;
    this.pages = new AdvancedManager(this.app);
    this.maxPages = (_a = this.config.maxPages) != null ? _a : 5;
    let URLString = newURL().pathname;
    this.set(URLString, new Page());
    URLString = void 0;
  }
  get(key) {
    return this.pages.get(key);
  }
  add(value) {
    this.pages.add(value);
    return this;
  }
  set(key, value) {
    this.pages.set(key, value);
    return this;
  }
  remove(key) {
    this.pages.remove(key);
    return this;
  }
  has(key) {
    return this.pages.has(key);
  }
  clear() {
    this.pages.clear();
    return this;
  }
  get size() {
    return this.pages.size;
  }
  keys() {
    return this.pages.keys();
  }
  async load(_url = newURL()) {
    let url = newURL(_url);
    let urlString = url.pathname;
    let page, request;
    if (this.has(urlString)) {
      page = this.get(urlString);
      return Promise.resolve(page);
    }
    if (!this.loading.has(urlString)) {
      request = this.request(urlString);
      this.loading.set(urlString, request);
    } else
      request = this.loading.get(urlString);
    let response = await request;
    this.loading.remove(urlString);
    page = new Page(url, response);
    this.set(urlString, page);
    if (this.size > this.maxPages) {
      let currentUrl = newURL();
      let keys = this.keys();
      let first = equal(currentUrl, keys[0]) ? keys[1] : keys[0];
      let page2 = this.get(first);
      page2.unregister();
      page2 = void 0;
      keys = void 0;
      currentUrl = void 0;
      first = void 0;
    }
    return page;
  }
  async request(url) {
    const headers = new Headers(getConfig(this.config, "headers"));
    const timeout = window.setTimeout(() => {
      window.clearTimeout(timeout);
      throw "Request Timed Out!";
    }, getConfig(this.config, "timeout"));
    try {
      let response = await fetch(url, {
        mode: "same-origin",
        method: "GET",
        headers,
        cache: "default",
        credentials: "same-origin"
      });
      window.clearTimeout(timeout);
      if (response.status >= 200 && response.status < 300) {
        return await response.text();
      }
      const err = new Error(response.statusText || "" + response.status);
      throw err;
    } catch (err) {
      window.clearTimeout(timeout);
      throw err;
    }
  }
};

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

// packages/native/src/transition.ts
var hashAction = (coords, hash = window.location.hash) => {
  try {
    let _hash = hash[0] == "#" ? hash : newURL(hash).hash;
    if (_hash.length > 1) {
      let el = document.getElementById(_hash.slice(1));
      if (el) {
        return newCoords(el.offsetLeft, el.offsetTop);
      }
    }
  } catch (e) {
    console.warn("[hashAction] error", e);
  }
  return coords != null ? coords : newCoords(0, 0);
};
var Default = {
  name: "default",
  scrollable: true,
  out({done}) {
    done();
  },
  in({scroll, done}) {
    window.scroll(scroll.x, scroll.y);
    done();
  }
};
var TransitionManager = class extends Service {
  constructor(transitions) {
    super();
    this._arg = transitions;
  }
  install() {
    var _a;
    super.install();
    let transitions = this._arg && this._arg.length ? this._arg : (_a = getConfig(this.config, "transitions")) != null ? _a : [];
    transitions = [["default", Default]].concat(transitions);
    this.transitions = new Manager(transitions);
  }
  get(key) {
    return this.transitions.get(key);
  }
  set(key, value) {
    this.transitions.set(key, value);
    return this;
  }
  add(value) {
    this.transitions.add(value);
    return this;
  }
  has(key) {
    return this.transitions.has(key);
  }
  async animate(name, data) {
    let transition = this.transitions.get(name);
    let scroll = data.scroll;
    let ignoreHashAction = data.ignoreHashAction;
    if (!("wrapper" in data.oldPage) || !("wrapper" in data.newPage))
      throw `[Page] either oldPage or newPage aren't instances of the Page Class.
 ${{
        newPage: data.newPage,
        oldPage: data.oldPage
      }}`;
    document.title = `` + data.newPage.title;
    let fromWrapper = data.oldPage.wrapper;
    let toWrapper = data.newPage.wrapper;
    if (!(fromWrapper instanceof Node) || !(toWrapper instanceof Node))
      throw `[Wrapper] the wrapper from the ${!(toWrapper instanceof Node) ? "next" : "current"} page cannot be found. The wrapper must be an element that has the attribute ${getConfig(this.config, "wrapperAttr")}.`;
    transition.init && (transition == null ? void 0 : transition.init(data));
    this.emitter.emit("BEFORE_TRANSITION_OUT");
    if (transition.out) {
      await new Promise((done) => {
        let outMethod = transition.out.call(transition, {
          ...data,
          from: data.oldPage,
          trigger: data.trigger,
          done
        });
        outMethod == null ? void 0 : outMethod.then(done);
      });
    }
    this.emitter.emit("AFTER_TRANSITION_OUT");
    await new Promise((done) => {
      fromWrapper.insertAdjacentElement("beforebegin", toWrapper);
      this.emitter.emit("CONTENT_INSERT");
      if (!ignoreHashAction && !/back|popstate|forward/.test(data.trigger)) {
        scroll = hashAction(scroll);
      }
      done();
    });
    await new Promise((done) => {
      fromWrapper.remove();
      fromWrapper = void 0;
      toWrapper = void 0;
      this.emitter.emit("CONTENT_REPLACED");
      done();
    });
    this.emitter.emit("BEFORE_TRANSITION_IN");
    if (transition.in) {
      await new Promise(async (done) => {
        let inMethod = transition.in.call(transition, {
          ...data,
          from: data.oldPage,
          to: data.newPage,
          trigger: data.trigger,
          scroll,
          done
        });
        inMethod == null ? void 0 : inMethod.then(done);
      });
    }
    this.emitter.emit("AFTER_TRANSITION_IN");
    return transition;
  }
};

// packages/native/src/app.ts
var App = class {
  constructor(config = {}) {
    this.register(config);
  }
  register(config = {}) {
    this.config = newConfig(config);
    this.emitter = new EventEmitter();
    this.services = new ServiceManager(this);
    let handler = (() => {
      document.removeEventListener("DOMContentLoaded", handler);
      window.removeEventListener("load", handler);
      this.emitter.emit("READY ready");
    }).bind(this);
    document.addEventListener("DOMContentLoaded", handler);
    window.addEventListener("load", handler);
    return this;
  }
  get(key) {
    return this.services.get(key);
  }
  set(key, value) {
    this.services.set(key, value);
    return this;
  }
  add(value) {
    this.services.add(value);
    return this;
  }
  boot() {
    this.services.init();
    this.services.boot();
    return this;
  }
  stop() {
    this.services.stop();
    this.emitter.clear();
    return this;
  }
  on(events, callback) {
    this.emitter.on(events, callback, this);
    return this;
  }
  off(events, callback) {
    this.emitter.off(events, callback, this);
    return this;
  }
  emit(events, ...args) {
    this.emitter.emit(events, ...args);
    return this;
  }
};

// packages/native/src/pjax.ts
var PJAX = class extends Service {
  install() {
    var _a, _b, _c, _d, _e, _f;
    super.install();
    this.ignoreURLs = (_a = getConfig(this.config, "ignoreURLs")) != null ? _a : [];
    this.prefetchIgnore = (_b = getConfig(this.config, "prefetchIgnore")) != null ? _b : false;
    this.stopOnTransitioning = (_c = getConfig(this.config, "stopOnTransitioning")) != null ? _c : false;
    this.stickyScroll = (_d = getConfig(this.config, "stickyScroll")) != null ? _d : false;
    this.forceOnError = (_e = getConfig(this.config, "forceOnError")) != null ? _e : false;
    this.ignoreHashAction = (_f = getConfig(this.config, "ignoreHashAction")) != null ? _f : false;
  }
  transitionStart() {
    this.isTransitioning = true;
  }
  transitionStop() {
    this.isTransitioning = false;
  }
  init() {
    this.onHover = this.onHover.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
  }
  boot() {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    super.boot();
  }
  getTransitionName(el) {
    if (!el || !el.getAttribute)
      return null;
    let transitionAttr = el.getAttribute(getConfig(this.config, "transitionAttr", false));
    if (typeof transitionAttr === "string")
      return transitionAttr;
    return null;
  }
  validLink(el, event, href) {
    let pushStateSupport = !window.history.pushState;
    let exists = !el || !href;
    let eventMutate = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    let newTab = el.hasAttribute("target") && el.target === "_blank";
    let crossOrigin = el.protocol !== location.protocol || el.hostname !== location.hostname;
    let download = typeof el.getAttribute("download") === "string";
    let preventSelf = el.matches(getConfig(this.config, "preventSelfAttr"));
    let preventAll = Boolean(el.closest(getConfig(this.config, "preventAllAttr")));
    let sameURL = getHashedPath(newURL()) === getHashedPath(newURL(href));
    return !(exists || pushStateSupport || eventMutate || newTab || crossOrigin || download || preventSelf || preventAll || sameURL);
  }
  getHref(el) {
    if (el && el.tagName && el.tagName.toLowerCase() === "a" && typeof el.href === "string")
      return el.href;
    return null;
  }
  getLink(event) {
    let el = event.target;
    let href = this.getHref(el);
    while (el && !href) {
      el = el.parentNode;
      href = this.getHref(el);
    }
    if (!el || !this.validLink(el, event, href))
      return;
    return el;
  }
  onClick(event) {
    let el = this.getLink(event);
    if (!el)
      return;
    if (this.isTransitioning && this.stopOnTransitioning) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    let href = this.getHref(el);
    this.emitter.emit("ANCHOR_CLICK CLICK", event);
    this.go({href, trigger: el, event});
  }
  getDirection(value) {
    if (Math.abs(value) > 1) {
      return value > 0 ? "forward" : "back";
    } else {
      if (value === 0) {
        return "popstate";
      } else {
        return value > 0 ? "back" : "forward";
      }
    }
  }
  force(href) {
    window.location.assign(href);
  }
  go({
    href,
    trigger = "HistoryManager",
    event
  }) {
    if (this.isTransitioning && this.stopOnTransitioning || !(this.manager.has("TransitionManager") && this.manager.has("HistoryManager") && this.manager.has("PageManager"))) {
      this.force(href);
      return;
    }
    const history = this.manager.get("HistoryManager");
    let scroll = newCoords(0, 0);
    let currentState = history.current;
    let currentURL = currentState.url;
    if (equal(currentURL, href)) {
      return;
    }
    let transitionName;
    if (event && event.state) {
      this.emitter.emit("POPSTATE", event);
      let {state} = event;
      let {index} = state;
      let currentIndex = currentState.index;
      let difference = currentIndex - index;
      let _state = history.get(history.pointer);
      transitionName = _state.transition;
      scroll = _state.data.scroll;
      history.replace(state.states);
      history.pointer = index;
      trigger = this.getDirection(difference);
      this.emitter.emit(trigger === "back" ? `POPSTATE_BACK` : `POPSTATE_FORWARD`, event);
    } else {
      transitionName = this.getTransitionName(trigger);
      scroll = newCoords();
      let state = newState({
        url: href,
        transition: transitionName,
        data: {scroll}
      });
      !this.stickyScroll && (scroll = newCoords(0, 0));
      history.add(state);
      this.emitter.emit("HISTORY_NEW_ITEM", event);
    }
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.emitter.emit("GO", event);
    return this.load({
      oldHref: currentURL,
      href,
      trigger,
      transitionName,
      scroll
    });
  }
  async load({
    oldHref,
    href,
    trigger,
    transitionName = "default",
    scroll = {x: 0, y: 0}
  }) {
    try {
      const pages = this.manager.get("PageManager");
      let newPage, oldPage;
      this.emitter.emit("NAVIGATION_START", {
        oldHref,
        href,
        trigger,
        transitionName
      });
      try {
        this.transitionStart();
        oldPage = await pages.load(oldHref);
        !(oldPage.dom instanceof Element) && oldPage.build();
        this.emitter.emit("PAGE_LOADING", {href, oldPage, trigger});
        newPage = await pages.load(href);
        await newPage.build();
        this.emitter.emit("PAGE_LOAD_COMPLETE", {
          newPage,
          oldPage,
          trigger
        });
      } catch (err) {
        throw `[PJAX] page load error: ${err}`;
      }
      try {
        const TransitionManager2 = this.manager.get("TransitionManager");
        this.emitter.emit("TRANSITION_START", transitionName);
        let transition = await TransitionManager2.animate(TransitionManager2.has(transitionName) ? transitionName : "default", {
          oldPage,
          newPage,
          trigger,
          scroll,
          ignoreHashAction: this.ignoreHashAction
        });
        if (!transition.scrollable) {
          if (!this.ignoreHashAction && !/back|popstate|forward/.test(trigger))
            scroll = hashAction(scroll);
          window.scroll(scroll.x, scroll.y);
        }
        this.emitter.emit("TRANSITION_END", {transition});
      } catch (err) {
        throw `[PJAX] transition error: ${err}`;
      }
      this.emitter.emit("NAVIGATION_END", {
        oldPage,
        newPage,
        trigger,
        transitionName
      });
    } catch (err) {
      if (this.forceOnError)
        this.force(href);
      else
        console.warn(err);
    } finally {
      this.transitionStop();
    }
  }
  ignoredURL({pathname}) {
    return this.ignoreURLs.length && this.ignoreURLs.some((url) => {
      return typeof url === "string" ? url === pathname : url.exec(pathname) !== null;
    });
  }
  onHover(event) {
    let el = this.getLink(event);
    if (!el || !this.manager.has("PageManager"))
      return;
    const pages = this.manager.get("PageManager");
    let url = newURL(this.getHref(el));
    let urlString = url.pathname;
    if (this.ignoredURL(url) || pages.has(urlString))
      return;
    this.emitter.emit("ANCHOR_HOVER HOVER", event);
    try {
      pages.load(url);
    } catch (err) {
      console.warn("[PJAX] prefetch error,", err);
    }
  }
  onStateChange(event) {
    this.go({href: window.location.href, trigger: "popstate", event});
  }
  initEvents() {
    if (this.prefetchIgnore !== true) {
      document.addEventListener("mouseover", this.onHover);
      document.addEventListener("touchstart", this.onHover);
    }
    document.addEventListener("click", this.onClick);
    window.addEventListener("popstate", this.onStateChange);
  }
  stopEvents() {
    if (this.prefetchIgnore !== true) {
      document.removeEventListener("mouseover", this.onHover);
      document.removeEventListener("touchstart", this.onHover);
    }
    document.removeEventListener("click", this.onClick);
    window.removeEventListener("popstate", this.onStateChange);
  }
};

// packages/native/src/router.ts
var Router = class extends Service {
  constructor(routes = []) {
    super();
    this.routes = new Manager();
    for (let route of routes) {
      this.add(route);
    }
  }
  add({path, method}) {
    let key = this.parse(path);
    this.routes.set(key, method);
    return this;
  }
  parsePath(path) {
    if (typeof path === "string")
      return new RegExp(path, "i");
    else if (path instanceof RegExp || typeof path === "boolean")
      return path;
    throw "[Router] only regular expressions, strings and booleans are accepted as paths.";
  }
  isPath(input) {
    return typeof input === "string" || input instanceof RegExp || typeof input === "boolean";
  }
  parse(input) {
    let route = input;
    let toFromPath = {
      from: /(.*)/g,
      to: /(.*)/g
    };
    if (this.isPath(input))
      toFromPath = {
        from: true,
        to: input
      };
    else if (this.isPath(route.from) && this.isPath(route.to))
      toFromPath = route;
    else
      throw "[Router] path is neither a string, regular expression, or a { from, to } object.";
    let {from, to} = toFromPath;
    return {
      from: this.parsePath(from),
      to: this.parsePath(to)
    };
  }
  route() {
    if (this.manager.has("HistoryManager")) {
      let history = this.manager.get("HistoryManager");
      let from = getHashedPath(newURL((history.length > 1 ? history.previous : history.current).url));
      let to = getHashedPath(newURL());
      this.routes.forEach((method, path) => {
        let fromRegExp = path.from;
        let toRegExp = path.to;
        if (typeof fromRegExp === "boolean" && typeof toRegExp === "boolean") {
          throw `[Router] path ({ from: ${fromRegExp}, to: ${toRegExp} }) is not valid, remember paths can only be strings, regular expressions, or a boolean; however, both the from and to paths cannot be both booleans.`;
        }
        let fromParam = fromRegExp;
        let toParam = toRegExp;
        if (fromRegExp instanceof RegExp && fromRegExp.test(from))
          fromParam = fromRegExp.exec(from);
        if (toRegExp instanceof RegExp && toRegExp.test(to))
          toParam = toRegExp.exec(to);
        if (Array.isArray(toParam) && Array.isArray(fromParam) || Array.isArray(toParam) && typeof fromParam == "boolean" && fromParam || Array.isArray(fromParam) && typeof toParam == "boolean" && toParam)
          method({from: fromParam, to: toParam, path: {from, to}});
      });
    } else {
      console.warn("[Route] HistoryManager is missing.");
    }
  }
  initEvents() {
    this.emitter.on("READY", this.route, this);
    this.emitter.on("CONTENT_REPLACED", this.route, this);
  }
  stopEvents() {
    this.emitter.off("READY", this.route, this);
    this.emitter.off("CONTENT_REPLACED", this.route, this);
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
        window.cancelAnimationFrame(this.animationFrame);
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
    this.animationFrame = window.requestAnimationFrame(this.loop);
    this.emit("update", this.getProgress(), this);
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
    this.animationFrame = requestAnimationFrame(this.loop);
    this.all((anim) => anim.play());
    this.emit("play", playstate, this);
    return this;
  }
  pause() {
    window.cancelAnimationFrame(this.animationFrame);
    let playstate = this.getPlayState();
    this.all((anim) => anim.pause());
    this.emit("pause", playstate, this);
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
    window.cancelAnimationFrame(this.animationFrame);
    return this;
  }
  finish() {
    this.all((anim) => anim.finish());
    window.cancelAnimationFrame(this.animationFrame);
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

// build/ts/services/Splashscreen.ts
var Splashscreen = class extends Service {
  constructor() {
    super(...arguments);
    this.minimalDuration = 1e3;
  }
  init() {
    super.init();
    this.rootElement = document.getElementById("splashscreen");
    if (this.rootElement) {
      this.innerEl = this.rootElement.querySelector(".splashscreen-inner");
      this.bgEl = this.rootElement.querySelector(".splashscreen-bg");
      this.spinnerEl = [...this.rootElement.querySelectorAll(".spinner")];
    }
    this.rootElement.style.visibility = "visible";
    this.rootElement.style.pointerEvents = "auto";
  }
  boot() {
    if (this.rootElement) {
      this.hide();
    }
  }
  async hide() {
    await new Promise((resolve) => {
      window.setTimeout(() => {
        this.emitter.emit("BEFORE_SPLASHSCREEN_HIDE");
        resolve();
      }, this.minimalDuration);
    });
    await new Promise(async (resolve) => {
      animate({
        target: this.innerEl,
        opacity: [1, 0],
        autoplay: true,
        duration: 500,
        onfinish(el) {
          el.style.opacity = "0";
        }
      }).then(function() {
        this.stop();
      });
      this.emitter.emit("START_SPLASHSCREEN_HIDE");
      await this.show();
      resolve();
    });
  }
  async show() {
    let [anim] = await animate({
      target: this.rootElement,
      transform: ["translateY(0%)", "translateY(100%)"],
      duration: 1200,
      easing: "in-out-cubic"
    });
    this.emitter.emit("AFTER_SPLASHSCREEN_HIDE");
    anim.stop();
    this.rootElement.style.transform = "translateY(100%)";
    this.rootElement.style.visibility = "hidden";
    this.rootElement.style.pointerEvents = "none";
  }
};

// build/ts/services/IntroAnimation.ts
var IntroAnimation = class extends Service {
  init() {
    super.init();
    this.elements = [...document.querySelectorAll(".intro-animation")];
  }
  newPage() {
    this.init();
    this.prepareToShow();
  }
  initEvents() {
    this.emitter.on("BEFORE_SPLASHSCREEN_HIDE", this.prepareToShow, this);
    this.emitter.on("CONTENT_REPLACED", this.newPage, this);
    this.emitter.on("START_SPLASHSCREEN_HIDE BEFORE_TRANSITION_IN", this.show, this);
  }
  stopEvents() {
    this.emitter.off("BEFORE_SPLASHSCREEN_HIDE", this.prepareToShow, this);
    this.emitter.off("CONTENT_REPLACED", this.newPage, this);
    this.emitter.off("START_SPLASHSCREEN_HIDE BEFORE_TRANSITION_IN", this.show, this);
  }
  stop() {
    requestAnimationFrame(() => {
      for (let el of this.elements) {
        el.style.transform = "translateY(0px)";
        el.style.opacity = "1";
      }
    });
    super.stop();
  }
  prepareToShow() {
    requestAnimationFrame(() => {
      for (let el of this.elements) {
        el.style.transform = "translateY(200px)";
        el.style.opacity = "0";
      }
    });
  }
  async show() {
    let [anim] = await animate({
      target: this.elements,
      keyframes: [
        {transform: "translateY(200px)", opacity: 0},
        {transform: "translateY(0px)", opacity: 1}
      ],
      delay(i) {
        return 300 * (i + 1);
      },
      onfinish(el) {
        requestAnimationFrame(() => {
          el.style.transform = "translateY(0px)";
          el.style.opacity = "1";
        });
      },
      easing: "out-cubic",
      duration: 650
    });
    anim.stop();
    return anim;
  }
};

// build/ts/transitions/Fade.ts
var Fade = {
  name: "default",
  duration: 500,
  scrollable: true,
  out({from}) {
    let {duration} = this;
    let fromWrapper = from.wrapper;
    return animate({
      target: fromWrapper,
      opacity: [1, 0],
      duration
    }).on("finish", function() {
      this.stop();
    });
  },
  in({to, scroll}) {
    let {duration} = this;
    let toWrapper = to.wrapper;
    window.scroll(scroll.x, scroll.y);
    return animate({
      target: toWrapper,
      opacity: [0, 1],
      duration
    }).then(function() {
      this.stop();
    });
  }
};

// build/ts/transitions/BigTransition.ts
var BigTransition = {
  name: "big",
  delay: 200,
  durationPerAnimation: 700,
  scrollable: true,
  init() {
    this.mainElement = document.getElementById("big-transition");
    this.spinnerElement = this.mainElement.querySelector(".spinner");
    this.horizontalElements = [...this.mainElement.querySelector("#big-transition-horizontal").querySelectorAll("div")];
    this.maxLength = this.horizontalElements.length;
  },
  out({from, scroll}) {
    let {durationPerAnimation: duration, delay} = this;
    let fromWrapper = from.wrapper;
    window.scroll(scroll.x, scroll.y);
    let wrapperStyle = Object.assign({}, fromWrapper.style);
    return new Promise(async (resolve) => {
      this.mainElement.style.opacity = "1";
      this.mainElement.style.visibility = "visible";
      let anim1 = animate({
        target: fromWrapper,
        opacity: [1, 0],
        duration,
        onfinish(el) {
          el.style.opacity = "0";
        }
      });
      anim1.then(function() {
        this.stop();
      });
      let [anim2] = await animate({
        target: this.horizontalElements,
        keyframes: [
          {transform: "scaleX(0)"},
          {transform: "scaleX(1)"}
        ],
        delay(i) {
          return delay * (i + 1);
        },
        onfinish(el) {
          el.style.transform = `scaleX(1)`;
        },
        easing: "out-cubic",
        duration: 500
      });
      fromWrapper.style.opacity = "1";
      Object.assign(fromWrapper.style, wrapperStyle);
      this.spinnerElement.style.visibility = "visible";
      let loaderDuration = 500;
      let [anim3] = await animate({
        target: this.spinnerElement,
        opacity: [0, 1],
        duration: loaderDuration,
        onfinish(el) {
          el.style.opacity = `1`;
        }
      });
      let [anim4] = await animate({
        options: anim3,
        opacity: [1, 0],
        onfinish(el) {
          el.style.opacity = `0`;
        },
        delay: 1500
      });
      this.spinnerElement.style.visibility = "hidden";
      anim3.stop();
      anim4.stop();
      resolve();
    });
  },
  in({to, scroll}) {
    let {durationPerAnimation: duration, delay} = this;
    let toWrapper = to.wrapper;
    window.scroll(scroll.x, scroll.y);
    return new Promise(async (resolve) => {
      let anim1 = animate({
        target: toWrapper,
        opacity: [0, 1],
        duration
      }).then(() => {
        anim1.stop();
      });
      let [anim2] = await animate({
        target: this.horizontalElements,
        keyframes: [
          {transform: "scaleX(1)"},
          {transform: "scaleX(0)"}
        ],
        delay(i) {
          return delay * (i + 1);
        },
        onfinish(el) {
          el.style.transform = `scaleX(0)`;
        },
        easing: "out-cubic",
        duration: 500
      });
      this.mainElement.style.opacity = "0";
      this.mainElement.style.visibility = "hidden";
      anim2.stop();
      resolve();
    });
  }
};

// build/ts/transitions/Slide.ts
var Slide = {
  name: "slide",
  duration: 500,
  direction: "right",
  scrollable: true,
  init(data) {
    let trigger = data.trigger;
    if (trigger instanceof Node && trigger.hasAttribute("data-direction")) {
      this.direction = trigger.getAttribute("data-direction");
    } else {
      this.direction = "right";
    }
  },
  out({from}) {
    let {duration, direction} = this;
    let fromWrapper = from.wrapper;
    return animate({
      target: fromWrapper,
      keyframes: [
        {transform: "translateX(0%)", opacity: 1},
        {transform: `translateX(${direction === "left" ? "-" : ""}25%)`, opacity: 0}
      ],
      duration,
      easing: "in-quint"
    }).then(function() {
      this.stop();
    });
  },
  in({to, scroll}) {
    let {duration} = this;
    let toWrapper = to.wrapper;
    window.scroll(scroll.x, scroll.y);
    return animate({
      target: toWrapper,
      keyframes: [
        {transform: `translateX(${this.direction === "right" ? "-" : ""}25%)`, opacity: 0},
        {transform: "translateX(0%)", opacity: 1}
      ],
      duration,
      easing: "out-quint"
    }).then(function() {
      this.stop();
    });
  }
};
var SlideLeft = {
  ...Slide,
  name: "slide-left",
  direction: "left"
};
var SlideRight = {
  ...Slide,
  name: "slide-right",
  direction: "right"
};

// build/ts/main.ts
var splashscreen;
var router;
var pjax;
var app = new App();
app.add(new IntroAnimation()).add(splashscreen = new Splashscreen()).set("HistoryManager", new HistoryManager()).set("PageManager", new PageManager()).set("TransitionManager", new TransitionManager([
  ["default", Fade],
  ["BigTransition", BigTransition],
  ["Slide", Slide],
  ["SlideLeft", SlideLeft],
  ["SlideRight", SlideRight]
])).set("router", router = new Router()).add(pjax = new PJAX());
try {
  router = app.get("router");
  let navLink = document.querySelectorAll(".navbar .nav-link");
  for (let item of navLink) {
    let navItem = item;
    router.add({
      path: navItem.getAttribute("data-path") || navItem.pathname,
      method() {
        let isActive = navItem.classList.contains("active");
        if (!isActive)
          navItem.classList.add("active");
        for (let nav of navLink) {
          if (nav !== navItem)
            nav.classList.remove("active");
        }
      }
    });
  }
  let anim;
  router.add({
    path: /(index|\/$)(\.html)?/,
    method() {
      anim = animate({
        target: ".div",
        keyframes(index, total) {
          return [
            {transform: "translateX(0px)", opacity: 0.1},
            {transform: "translateX(300px)", opacity: 0.2 + (index + 1) / total}
          ];
        },
        fillMode: "both",
        easing: "out-cubic",
        duration(index) {
          return (index + 1) * 500;
        },
        loop: 5,
        speed: 1.5,
        direction: "alternate",
        delay(index) {
          return (index + 1) * 500 / 2;
        },
        autoplay: false
      });
      let el = document.querySelector(".info");
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
      });
      anim.on("complete", () => {
        if (el) {
          info = "Done.";
          el.textContent = info;
          el.style.color = "red";
          console.log(info);
        }
      });
      let scrub = document.getElementById("scrub");
      scrub.addEventListener("input", (e) => {
        var percent = +e.target.value;
        anim.setProgress(percent);
        anim.pause();
      });
      let progressSpan = document.querySelector(".progress");
      anim.on("update", (progress) => {
        scrub.value = `` + progress;
        progressSpan && (progressSpan.textContent = `${Math.round(progress)}%`);
      });
      scrub.addEventListener("change", () => {
        if (Math.round(anim.getProgress()) >= 100) {
          anim.finish();
          return false;
        }
        anim.play();
      });
      let playtoggle = document.querySelector(".playtoggle");
      if (playtoggle) {
        playtoggle.addEventListener("click", () => {
          let state = anim.getPlayState();
          if (state === "running")
            anim.pause();
          else if (state === "finished")
            anim.reset();
          else
            anim.play();
          console.log(state);
        });
      }
    }
  });
  app.on("AFTER_SPLASHSCREEN_HIDE", () => {
    anim == null ? void 0 : anim.play();
  });
  app.boot();
} catch (err) {
  splashscreen.show();
  console.warn("[App] boot failed,", err);
}
