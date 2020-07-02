const getTheme = () => {
  const theme = window.localStorage.getItem("theme");
  if (typeof theme === "string")
    return theme;
  return null;
};
const setTheme = (theme) => {
  if (typeof theme === "string")
    window.localStorage.setItem("theme", theme);
};
const mediaTheme = () => {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const hasMediaQueryPreference = typeof mql.matches === "boolean";
  if (hasMediaQueryPreference)
    return mql.matches ? "dark" : "light";
  return null;
};

const CONFIG_DEFAULTS = {
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
class CONFIG {
  constructor(config) {
    this.config = Object.assign({...CONFIG_DEFAULTS}, config);
  }
  toAttr(value, brackets = true) {
    let {prefix} = this.config;
    let attr = `data${prefix ? "-" + prefix : ""}-${value}`;
    return brackets ? `[${attr}]` : attr;
  }
  getConfig(value, brackets = true) {
    if (typeof value !== "string")
      return this.config;
    let config = this.config[value];
    if (typeof config === "string")
      return this.toAttr(config, brackets);
    return config;
  }
}

class Manager {
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
  last(distance = 1) {
    let key = this.keys()[this.size - distance];
    return this.get(key);
  }
  prev() {
    return this.last(2);
  }
  delete(key) {
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
  forEach(callback = (...args) => {
  }, context) {
    this.map.forEach(callback, context);
    return this;
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  methodCall(method, ...args) {
    this.forEach((item) => {
      item[method](...args);
    });
    return this;
  }
  async asyncMethodCall(method, ...args) {
    for (let [, item] of this.map) {
      await item[method](...args);
    }
    return this;
  }
}

class ManagerItem {
  constructor() {
  }
  getConfig(value, brackets) {
    return this.manager.getConfig(value, brackets);
  }
  install() {
  }
  register(manager2) {
    this.manager = manager2;
    this.install();
    return this;
  }
}
class AdvancedManager extends Manager {
  constructor(app2) {
    super();
    this.app = app2;
  }
  set(key, value) {
    super.set(key, value);
    typeof value.register === "function" && value.register(this);
    return this;
  }
  getApp() {
    return this.app;
  }
  getConfig(...args) {
    return this.app.getConfig(...args);
  }
}

class _URL extends URL {
  constructor(url = window.location.href) {
    super(url instanceof URL ? url.href : url, window.location.origin);
  }
  getFullPath() {
    return `${this.pathname}${this.hash}`;
  }
  getHash() {
    return this.hash.slice(1);
  }
  clean() {
    return this.toString().replace(/(\/#.*|\/|#.*)$/, "");
  }
  getPathname() {
    return this.pathname;
  }
  equalTo(url) {
    return this.clean() == url.clean();
  }
  static equal(a, b) {
    let urlA = a instanceof _URL ? a : new _URL(a);
    let urlB = b instanceof _URL ? b : new _URL(b);
    return urlA.equalTo(urlB);
  }
}

class Coords {
  constructor(x = window.scrollX, y = window.scrollY) {
    this.x = x;
    this.y = y;
  }
}
class State {
  constructor(state = {
    url: new _URL(),
    index: 0,
    transition: "default",
    data: {
      scroll: new Coords(),
      trigger: "HistoryManager"
    }
  }) {
    this.state = state;
  }
  getIndex() {
    return this.state.index;
  }
  setIndex(index) {
    this.state.index = index;
    return this;
  }
  getURL() {
    return this.state.url;
  }
  getURLPathname() {
    return this.state.url.getPathname();
  }
  getTransition() {
    return this.state.transition;
  }
  getData() {
    return this.state.data;
  }
  toJSON() {
    const {url: url2, index, transition, data} = this.state;
    return {
      url: url2.getFullPath(),
      index,
      transition,
      data
    };
  }
}
class HistoryManager extends Manager {
  constructor() {
    super();
  }
  add(value) {
    let state = value;
    let index = this.size;
    super.add(state);
    state.setIndex(index);
    return this;
  }
  addState(value) {
    let state = value instanceof State ? value : new State(value);
    this.add(state);
    return this;
  }
}

const PARSER = new DOMParser();
class Page extends ManagerItem {
  constructor(url2 = new _URL(), dom = document) {
    super();
    this.url = url2;
    if (typeof dom === "string") {
      this.dom = PARSER.parseFromString(dom, "text/html");
    } else
      this.dom = dom || document;
    const {title, head, body} = this.dom;
    this.title = title;
    this.head = head;
    this.body = body;
  }
  install() {
    this.wrapper = this.body.querySelector(this.getConfig("wrapperAttr"));
  }
  getURL() {
    return this.url;
  }
  getPathname() {
    return this.url.pathname;
  }
  getTitle() {
    return this.title;
  }
  getHead() {
    return this.head;
  }
  getBody() {
    return this.body;
  }
  getWrapper() {
    return this.wrapper;
  }
  getDOM() {
    return this.dom;
  }
}
class PageManager extends AdvancedManager {
  constructor(app2) {
    super(app2);
    this.loading = new Manager();
    let URLString = new _URL().getPathname();
    this.set(URLString, new Page());
  }
  getLoading() {
    return this.loading;
  }
  async load(_url = new _URL()) {
    let url2 = _url instanceof URL ? _url : new _URL(_url);
    let urlString = url2.getPathname();
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
    this.loading.delete(urlString);
    page = new Page(url2, response);
    this.set(urlString, page);
    return page;
  }
  async request(url2) {
    const headers = new Headers(this.getConfig("headers"));
    const timeout = window.setTimeout(() => {
      window.clearTimeout(timeout);
      throw "Request Timed Out!";
    }, this.getConfig("timeout"));
    try {
      let response = await fetch(url2, {
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
}

class Listener {
  constructor({
    callback = () => {
    },
    scope = null,
    name = "event"
  }) {
    this.listener = {callback, scope, name};
  }
  getCallback() {
    return this.listener.callback;
  }
  getScope() {
    return this.listener.scope;
  }
  getEventName() {
    return this.listener.name;
  }
  toJSON() {
    return this.listener;
  }
}
class Event extends Manager {
  constructor(name = "event") {
    super();
    this.name = name;
  }
}
class EventEmitter extends Manager {
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
    event.add(new Listener({name, callback, scope}));
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
      let listener = new Listener({name, callback, scope});
      event.forEach((value, i) => {
        if (value.getCallback() === listener.getCallback() && value.getScope() === listener.getScope()) {
          return event.delete(i);
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
        this.delete(_name);
    }, this);
    return this;
  }
  once(events, callback, scope) {
    if (typeof events == "undefined")
      return this;
    if (typeof events == "string")
      events = events.trim().split(/\s/g);
    let _name;
    let _callback;
    let isObject = typeof events === "object" && !Array.isArray(events);
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
      let onceFn = (...args) => {
        if (isObject) {
          _name = key;
          _callback = events[key];
        } else {
          _name = events[key];
        }
        this.off(_name, onceFn, _scope);
        _callback.apply(_scope, args);
      };
      this.on(_name, onceFn, _scope);
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
          let {callback, scope} = listener.toJSON();
          callback.apply(scope, args);
        });
      }
    }, this);
    return this;
  }
}

class Service extends ManagerItem {
  install() {
    let app2 = this.manager.getApp();
    this.PageManager = app2.getPages();
    this.EventEmitter = app2.getEmitter();
    this.HistoryManager = app2.getHistory();
    this.ServiceManager = app2.getServices();
    this.TransitionManager = app2.getTransitions();
  }
  init(...args) {
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
  }
}
class ServiceManager extends AdvancedManager {
  constructor(app2) {
    super(app2);
  }
  init() {
    this.methodCall("init", this.getApp());
    return this;
  }
  boot() {
    this.methodCall("boot");
    return this;
  }
  stop() {
    this.methodCall("stop");
    return this;
  }
}

class Transition extends Service {
  constructor() {
    super();
    this.name = "Transition";
  }
  init({
    oldPage,
    newPage,
    trigger
  }) {
    this.oldPage = oldPage;
    this.newPage = newPage;
    this.trigger = trigger;
    super.init();
    this.boot();
    return this;
  }
  getName() {
    return this.name;
  }
  getOldPage() {
    return this.oldPage;
  }
  getNewPage() {
    return this.newPage;
  }
  getTrigger() {
    return this.trigger;
  }
  out({done}) {
    done();
  }
  in({done}) {
    done();
  }
  async start(EventEmitter2) {
    let fromWrapper = this.oldPage.getWrapper();
    let toWrapper = this.newPage.getWrapper();
    document.title = this.newPage.getTitle();
    EventEmitter2.emit("BEFORE_TRANSITION_OUT");
    await new Promise((done) => {
      let outMethod = this.out({
        from: this.oldPage,
        trigger: this.trigger,
        done
      });
      if (outMethod.then)
        outMethod.then(done);
    });
    EventEmitter2.emit("AFTER_TRANSITION_OUT");
    await new Promise((done) => {
      fromWrapper.insertAdjacentElement("beforebegin", toWrapper);
      fromWrapper.remove();
      EventEmitter2.emit("CONTENT_REPLACED");
      done();
    });
    EventEmitter2.emit("BEFORE_TRANSITION_IN");
    await new Promise((done) => {
      let inMethod = this.in({
        from: this.oldPage,
        to: this.newPage,
        trigger: this.trigger,
        done
      });
      if (inMethod.then)
        inMethod.then(done);
    });
    EventEmitter2.emit("AFTER_TRANSITION_IN");
    return this;
  }
}
class TransitionManager extends AdvancedManager {
  constructor(app2) {
    super(app2);
  }
  add(value) {
    let name = value.getName();
    this.set(name, value);
    return this;
  }
  async boot({name, oldPage, newPage, trigger}) {
    let transition = this.get(name);
    transition.init({
      oldPage,
      newPage,
      trigger
    });
    let EventEmitter2 = this.getApp().getEmitter();
    return await transition.start(EventEmitter2);
  }
}

class Block extends Service {
  init({name, rootElement, selector, index, length}) {
    this.rootElement = rootElement;
    this.name = name;
    this.selector = selector;
    this.index = index;
    this.length = length;
  }
  getRootElement() {
    return this.rootElement;
  }
  getSelector() {
    return this.selector;
  }
  getLength() {
    return this.length;
  }
  getIndex() {
    return this.index;
  }
  getID() {
    return this.id;
  }
  setID(id) {
    this.id = id;
    return this;
  }
  getName() {
    return this.name;
  }
}
class BlockIntent extends ManagerItem {
  constructor({name, block}) {
    super();
    this.name = name;
    this.block = block;
  }
  getName() {
    return this.name;
  }
  getBlock() {
    return this.block;
  }
}
class BlockManager extends AdvancedManager {
  constructor(app2) {
    super(app2);
    this.activeBlocks = new Manager();
    this.activeIDs = new Manager();
  }
  build(full) {
    let app2 = this.getApp();
    for (let [, intent] of this) {
      let name = intent.getName();
      let selector = `[${this.getConfig("blockAttr", false)}="${name}"]`;
      let rootElements = [
        ...document.querySelectorAll(selector)
      ];
      if (!Array.isArray(this.activeIDs[name]))
        this.activeIDs[name] = [];
      let manager2 = new AdvancedManager(app2);
      let block = intent.getBlock();
      for (let i = 0, len = rootElements.length; i < len; i++) {
        let rootElement = rootElements[i];
        let id = rootElement.id;
        let activeID = this.activeIDs[name][i];
        if (activeID !== "" && activeID !== id || full) {
          let newInstance = new block();
          newInstance.init({name, rootElement, selector, index: i, length: len});
          newInstance.setID(id);
          this.activeIDs[name][i] = id;
          manager2.set(i, newInstance);
        }
      }
      this.activeBlocks.set(name, manager2);
    }
  }
  init() {
    this.build(true);
    return this;
  }
  initEvents() {
    let app2 = this.getApp();
    let rootElement = app2.getPages().last().getWrapper();
    this.domObserver = new window.MutationObserver(() => {
      this.build(false);
    });
    this.observe(rootElement);
    const EventEmitter = app2.getEmitter();
    EventEmitter.on("CONTENT_REPLACED", this.reload, this);
    return this;
  }
  flush() {
    this.activeBlocks.forEach((blockManager) => {
      blockManager.methodCall("stop");
    });
    this.activeBlocks.clear();
    return this;
  }
  reload() {
    let app2 = this.getApp();
    let rootElement = app2.getPages().last().getWrapper();
    this.domObserver.disconnect();
    this.flush();
    this.init();
    this.bootBlocks();
    this.observe(rootElement);
    return this;
  }
  observe(rootElement) {
    this.domObserver.observe(rootElement, {
      childList: true,
      attributes: false,
      characterData: false,
      subtree: true
    });
  }
  bootBlocks() {
    this.activeBlocks.forEach((blockManager) => {
      blockManager.methodCall("boot");
    });
    return this;
  }
  boot() {
    this.initEvents();
    this.bootBlocks();
    return this;
  }
  stopEvents() {
    this.activeBlocks.forEach((blockManager) => {
      blockManager.methodCall("stopEvents");
    });
    let app2 = this.getApp();
    this.domObserver.disconnect();
    const EventEmitter = app2.getEmitter();
    EventEmitter.off("BEFORE_TRANSITION_IN", this.reload, this);
    return this;
  }
  stop() {
    this.flush();
    this.stopEvents();
    return this;
  }
  getActiveBlocks() {
    return this.activeBlocks;
  }
}

class App {
  constructor(config2 = {}) {
    this.register(config2);
  }
  register(config2 = {}) {
    this.config = config2 instanceof CONFIG ? config2 : new CONFIG(config2);
    this.transitions = new TransitionManager(this);
    this.services = new ServiceManager(this);
    this.blocks = new BlockManager(this);
    this.history = new HistoryManager();
    this.pages = new PageManager(this);
    this.emitter = new EventEmitter();
    let handler = (() => {
      document.removeEventListener("DOMContentLoaded", handler);
      window.removeEventListener("load", handler);
      this.emitter.emit("READY ready");
    }).bind(this);
    document.addEventListener("DOMContentLoaded", handler);
    window.addEventListener("load", handler);
    return this;
  }
  getConfig(...args) {
    return this.config.getConfig(...args);
  }
  getEmitter() {
    return this.emitter;
  }
  getBlocks() {
    return this.blocks;
  }
  getServices() {
    return this.services;
  }
  getPages() {
    return this.pages;
  }
  getTransitions() {
    return this.transitions;
  }
  getHistory() {
    return this.history;
  }
  getBlock(key) {
    return this.blocks.get(key);
  }
  getActiveBlock(name, key) {
    return this.blocks.getActiveBlocks().get(name).get(key);
  }
  getService(key) {
    return this.services.get(key);
  }
  getTransition(key) {
    return this.transitions.get(key);
  }
  getState(key) {
    return this.history.get(key);
  }
  get(type, key) {
    switch (type.toLowerCase()) {
      case "service":
        return this.getService(key);
      case "transition":
        return this.getTransition(key);
      case "state":
        return this.getState(key);
      default:
        throw `Error: can't get type '${type}', it is not a recognized type. Did you spell it correctly.`;
    }
  }
  async loadPage(url) {
    return await this.pages.load(url);
  }
  async load(type, key) {
    switch (type.toLowerCase()) {
      case "page":
        return await this.loadPage(key);
      default:
        return Promise.resolve(this.get(type, key));
    }
  }
  addBlock(blockIntent) {
    this.blocks.add(blockIntent);
    return this;
  }
  addService(service2) {
    this.services.add(service2);
    return this;
  }
  setService(key, service2) {
    this.services.set(key, service2);
    return this;
  }
  addTransition(transition2) {
    this.transitions.add(transition2);
    return this;
  }
  addState(state) {
    this.history.addState(state);
    return this;
  }
  add(type, value) {
    switch (type.toLowerCase()) {
      case "service":
        this.addService(value);
        break;
      case "transition":
        this.addTransition(value);
        break;
      case "state":
        this.addState(value);
        break;
      case "block":
        this.addBlock(value);
        break;
      default:
        throw `Error: can't add type '${type}', it is not a recognized type. Did you spell it correctly.`;
    }
    return this;
  }
  boot() {
    this.services.init();
    this.services.boot();
    this.blocks.init();
    this.blocks.boot();
    return this;
  }
  stop() {
    this.services.stop();
    this.blocks.stop();
    return this;
  }
  currentPage() {
    let currentState = this.history.last();
    return this.pages.get(currentState.getURLPathname());
  }
  on(events, callback) {
    this.emitter.on(events, callback, this);
    return this;
  }
  off(events, callback) {
    this.emitter.off(events, callback, this);
    return this;
  }
  once(events, callback) {
    this.emitter.once(events, callback, this);
    return this;
  }
  emit(events, ...args) {
    this.emitter.emit(events, ...args);
    return this;
  }
}

class PJAX extends Service {
  constructor() {
    super(...arguments);
    this.ignoreURLs = [];
    this.prefetchIgnore = false;
    this.isTransitioning = false;
    this.stopOnTransitioning = false;
    this.stickyScroll = true;
    this.forceOnError = false;
    this.autoScrollOnHash = true;
  }
  transitionStart() {
    this.isTransitioning = true;
  }
  transitionStop() {
    this.isTransitioning = false;
  }
  boot() {
    super.boot();
    let current = new State();
    this.HistoryManager.add(current);
    this.changeState("replace", current);
  }
  getTransitionName(el) {
    if (!el || !el.getAttribute)
      return null;
    let transitionAttr = el.getAttribute(this.getConfig("transitionAttr", false));
    if (typeof transitionAttr === "string")
      return transitionAttr;
    return null;
  }
  validLink(el, event, href) {
    let pushStateSupport = !window.history.pushState;
    let exists = !el || !href;
    let eventMutate = event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    let newTab = el.hasAttribute("target") && el.target === "_blank";
    let crossOrigin = el.protocol !== location.protocol || el.hostname !== location.hostname;
    let download = typeof el.getAttribute("download") === "string";
    let preventSelf = el.hasAttribute(this.getConfig("preventSelfAttr", false));
    let preventAll = Boolean(el.closest(this.getConfig("preventAllAttr")));
    let prevent = preventSelf && preventAll;
    let sameURL = new _URL().getFullPath() === new _URL(href).getFullPath();
    return !(exists || pushStateSupport || eventMutate || newTab || crossOrigin || download || prevent || sameURL);
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
    this.EventEmitter.emit("ANCHOR_CLICK CLICK", event);
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
  go({href, trigger = "HistoryManager", event}) {
    if (this.isTransitioning && this.stopOnTransitioning) {
      this.force(href);
      return;
    }
    let url2 = new _URL(href);
    let currentState = this.HistoryManager.last();
    let currentURL = currentState.getURL();
    if (currentURL.equalTo(url2)) {
      this.hashAction(url2.hash);
      return;
    }
    let transitionName;
    if (event && event.state) {
      this.EventEmitter.emit("POPSTATE", event);
      let {state} = event;
      let {index, transition, data} = state;
      let currentIndex = currentState.getIndex();
      let difference = currentIndex - index;
      trigger = this.getDirection(difference);
      transitionName = transition;
      if (trigger !== "popstate") {
        let {x, y} = data.scroll;
        window.scroll({
          top: y,
          left: x,
          behavior: "smooth"
        });
      }
      if (trigger === "back") {
        this.HistoryManager.delete(currentIndex);
        this.EventEmitter.emit(`POPSTATE_BACK`, event);
      } else if (trigger === "forward") {
        this.HistoryManager.addState({url: url2, transition, data});
        this.EventEmitter.emit(`POPSTATE_FORWARD`, event);
      }
    } else {
      transitionName = this.getTransitionName(trigger) || "default";
      const scroll = new Coords();
      const index = this.HistoryManager.size;
      const state = new State({
        url: url2,
        index,
        transition: transitionName,
        data: {scroll}
      });
      if (this.stickyScroll) {
        let {x, y} = scroll;
        window.scroll({
          top: y,
          left: x,
          behavior: "smooth"
        });
      } else {
        window.scroll({
          top: 0,
          left: 0,
          behavior: "smooth"
        });
      }
      this.HistoryManager.add(state);
      this.changeState("push", state);
      this.EventEmitter.emit("HISTORY_NEW_ITEM", event);
    }
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.EventEmitter.emit("GO", event);
    return this.load({oldHref: currentURL.getPathname(), href, trigger, transitionName});
  }
  changeState(action, state) {
    let url2 = state.getURL();
    let href = url2.getFullPath();
    let json = state.toJSON();
    let args = [json, "", href];
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
  }
  async load({oldHref, href, trigger, transitionName = "default"}) {
    try {
      let oldPage = this.PageManager.get(oldHref);
      let newPage;
      this.EventEmitter.emit("PAGE_LOADING", {href, oldPage, trigger});
      try {
        try {
          newPage = await this.PageManager.load(href);
          this.transitionStart();
          this.EventEmitter.emit("PAGE_LOAD_COMPLETE", {newPage, oldPage, trigger});
        } catch (err) {
          throw `[PJAX] Page load error: ${err}`;
        }
        this.EventEmitter.emit("NAVIGATION_START", {oldPage, newPage, trigger, transitionName});
        try {
          this.EventEmitter.emit("TRANSITION_START", transitionName);
          let transition = await this.TransitionManager.boot({
            name: transitionName,
            oldPage,
            newPage,
            trigger
          });
          this.hashAction();
          this.EventEmitter.emit("TRANSITION_END", {transition});
        } catch (err) {
          throw `[PJAX] Transition error: ${err}`;
        }
        this.EventEmitter.emit("NAVIGATION_END", {oldPage, newPage, trigger, transitionName});
      } catch (err) {
        this.transitionStop();
        throw err;
      }
      this.transitionStop();
    } catch (err) {
      if (this.forceOnError)
        this.force(href);
      else
        console.error(err);
    }
  }
  hashAction(hash = window.location.hash) {
    if (this.autoScrollOnHash) {
      let hashID = hash.slice(1);
      if (hashID.length) {
        let el = document.getElementById(hashID);
        if (el) {
          if (el.scrollIntoView) {
            el.scrollIntoView({behavior: "smooth"});
          } else {
            let {left, top} = el.getBoundingClientRect();
            window.scroll({left, top, behavior: "smooth"});
          }
        }
      }
    }
  }
  ignoredURL({pathname}) {
    return this.ignoreURLs.length && this.ignoreURLs.some((url2) => {
      return typeof url2 === "string" ? url2 === pathname : url2.exec(pathname) !== null;
    });
  }
  onHover(event) {
    let el = this.getLink(event);
    if (!el)
      return;
    const url2 = new _URL(this.getHref(el));
    const urlString = url2.getPathname();
    if (this.ignoredURL(url2) || this.PageManager.has(urlString))
      return;
    this.EventEmitter.emit("ANCHOR_HOVER HOVER", event);
    (async () => {
      try {
        await this.PageManager.load(url2);
      } catch (err) {
        console.warn("[PJAX] prefetch error,", err);
      }
    })();
  }
  onStateChange(event) {
    this.go({href: window.location.href, trigger: "popstate", event});
  }
  bindEvents() {
    this.onHover = this.onHover.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
  }
  initEvents() {
    this.bindEvents();
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
}

class Router extends Service {
  constructor(routes = []) {
    super();
    this.routes = new Manager();
    for (const route of routes) {
      this.add(route);
    }
  }
  add({path, method}) {
    const key = this.parse(path);
    this.routes.set(key, method);
    return this;
  }
  parsePath(path) {
    if (typeof path === "string")
      return new RegExp(path, "i");
    else if (path instanceof RegExp)
      return path;
    throw "[Router] only regular expressions and strings are accepted as paths.";
  }
  isPath(input) {
    return typeof input === "string" || input instanceof RegExp;
  }
  parse(input) {
    let route = input;
    let toFromPath = {
      from: /(.*)/g,
      to: /(.*)/g
    };
    if (this.isPath(input))
      toFromPath = {
        from: input,
        to: /(.*)/g
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
    let from = this.HistoryManager.last().getURLPathname();
    let to = window.location.pathname;
    this.routes.forEach((method, path) => {
      let fromRegExp = path.from;
      let toRegExp = path.to;
      if (fromRegExp.test(from) && toRegExp.test(to)) {
        let fromExec = fromRegExp.exec(from);
        let toExec = toRegExp.exec(to);
        method({from: fromExec, to: toExec});
      }
    });
  }
  initEvents() {
    this.EventEmitter.on("READY", this.route, this);
    this.EventEmitter.on("PAGE_LOADING", this.route, this);
  }
  stopEvents() {
    this.EventEmitter.off("READY", this.route, this);
    this.EventEmitter.off("PAGE_LOADING", this.route, this);
  }
}

const getElements = (selector) => {
  return typeof selector === "string" ? Array.from(document.querySelectorAll(selector)) : [selector];
};
const getTargets = (targets) => {
  if (Array.isArray(targets))
    return targets;
  if (typeof targets == "string" || targets instanceof Node)
    return getElements(targets);
  if (targets instanceof NodeList || targets instanceof HTMLCollection)
    return Array.from(targets);
  return [];
};
const computeValue = (value, args) => {
  if (typeof value === "function") {
    return value(...args);
  } else {
    return value;
  }
};
const mapObject = (obj, args) => {
  let key, value, result = {};
  let keys = Object.keys(obj);
  for (let i = 0, len = keys.length; i < len; i++) {
    key = keys[i];
    value = obj[key];
    result[key] = computeValue(value, args);
  }
  return result;
};
const easings = {
  ease: "ease",
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
const getEase = (ease) => {
  return /^(ease|in|out)/.test(ease) ? easings[ease] : ease;
};
const DefaultAnimationOptions = {
  keyframes: [],
  loop: 1,
  delay: 0,
  speed: 1,
  endDelay: 0,
  easing: "ease",
  autoplay: true,
  duration: 1e3,
  onfinish() {
  },
  fillMode: "auto",
  direction: "normal"
};
class Animate {
  constructor(options = {}) {
    this.options = {};
    this.targets = [];
    this.properties = {};
    this.animations = new Map();
    this.duration = 0;
    this.emitter = new EventEmitter();
    let {options: animation, ...rest} = options;
    this.options = Object.assign({}, DefaultAnimationOptions, animation, rest);
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
      ...properties
    } = this.options;
    this.mainElement = document.createElement("span");
    this.targets = getTargets(target);
    this.properties = properties;
    let animationKeyframe;
    for (let i = 0, len = this.targets.length; i < len; i++) {
      let target2 = this.targets[i];
      let animationOptions = {
        easing: getEase(easing),
        iterations: loop === true ? Infinity : loop,
        direction,
        endDelay,
        duration,
        delay,
        fill: fillMode
      };
      let arrKeyframes = computeValue(keyframes, [i, len, target2]);
      animationKeyframe = arrKeyframes.length ? arrKeyframes : this.properties;
      animationOptions = mapObject(animationOptions, [i, len, target2]);
      if (!(arrKeyframes.length > 0))
        animationKeyframe = mapObject(animationKeyframe, [i, len, target2]);
      let tempDuration = animationOptions.delay + animationOptions.duration * animationOptions.iterations + animationOptions.endDelay;
      if (this.duration < tempDuration)
        this.duration = tempDuration;
      let animation2 = target2.animate(animationKeyframe, animationOptions);
      animation2.onfinish = () => {
        onfinish(target2, i, len);
      };
      this.animations.set(target2, animation2);
    }
    this.mainAnimation = this.mainElement.animate([
      {opacity: "0"},
      {opacity: "1"}
    ], {
      duration: this.duration,
      easing: "linear"
    });
    this.setSpeed(speed);
    if (autoplay)
      this.play();
    else
      this.pause();
    this.promise = this.newPromise();
    this.mainAnimation.onfinish = () => {
      this.finish(this.options);
      window.cancelAnimationFrame(this.animationFrame);
    };
  }
  getTargets() {
    return this.targets;
  }
  newPromise() {
    return new Promise((resolve, reject) => {
      try {
        this.finish = (options) => {
          this.emit("finish", options);
          return resolve(options);
        };
      } catch (err) {
        reject(err);
      }
    });
  }
  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }
  catch(onRejected) {
    return this.promise.catch(onRejected);
  }
  finally(onFinally) {
    return this.promise.finally(onFinally);
  }
  loop() {
    this.animationFrame = window.requestAnimationFrame(this.loop);
    this.emit("tick change", this.getCurrentTime());
  }
  on(events, callback, scope) {
    this.emitter.on(events, callback, scope);
    return this;
  }
  off(events, callback, scope) {
    this.emitter.off(events, callback, scope);
    return this;
  }
  emit(events, ...args) {
    this.emitter.emit(events, ...args);
    return this;
  }
  getAnimation(element) {
    return this.animations.get(element);
  }
  play() {
    if (this.mainAnimation.playState !== "finished") {
      this.mainAnimation.play();
      this.animationFrame = requestAnimationFrame(this.loop);
      this.animations.forEach((animation) => {
        if (animation.playState !== "finished")
          animation.play();
      });
      this.emit("play");
    }
    return this;
  }
  pause() {
    if (this.mainAnimation.playState !== "finished") {
      this.mainAnimation.pause();
      window.cancelAnimationFrame(this.animationFrame);
      this.animations.forEach((animation) => {
        if (animation.playState !== "finished")
          animation.pause();
      });
      this.emit("pause");
    }
    return this;
  }
  getDuration() {
    return this.duration;
  }
  getCurrentTime() {
    return this.mainAnimation.currentTime;
  }
  setCurrentTime(time) {
    this.mainAnimation.currentTime = time;
    this.animations.forEach((animation) => {
      animation.currentTime = time;
    });
    return this;
  }
  getProgress() {
    return this.getCurrentTime() / this.duration;
  }
  setProgress(percent) {
    this.mainAnimation.currentTime = percent * this.duration;
    this.animations.forEach((animation) => {
      animation.currentTime = percent * this.duration;
    });
    return this;
  }
  getSpeed() {
    return this.mainAnimation.playbackRate;
  }
  setSpeed(speed = 1) {
    this.mainAnimation.playbackRate = speed;
    this.animations.forEach((animation) => {
      animation.playbackRate = speed;
    });
    return this;
  }
  reset() {
    this.setCurrentTime(0);
    this.promise = this.newPromise();
    if (this.options.autoplay)
      this.play();
    else
      this.pause();
  }
  getPlayState() {
    return this.mainAnimation.playState;
  }
  getOptions() {
    return this.options;
  }
  toJSON() {
    return this.getOptions();
  }
}
const animate = (options = {}) => {
  return new Animate(options);
};

class InViewBlock extends Block {
  constructor() {
    super(...arguments);
    this.inView = false;
  }
  init(value) {
    super.init(value);
    this.observerOptions = {
      root: null,
      rootMargin: "0px",
      thresholds: Array.from(Array(20), (_nul, x) => (x + 1) / 20)
    };
    this.observer = new IntersectionObserver((entries) => {
      this.onIntersectionCallback(entries);
    }, this.observerOptions);
    this.imgs = [];
    this.direction = "right";
    this.xPercent = 30;
    if (this.rootElement.hasAttribute("data-direction")) {
      this.direction = this.rootElement.getAttribute("data-direction");
    }
    if (this.direction === "left") {
      this.xPercent = -this.xPercent;
    }
    this.imgs = [...this.rootElement.querySelectorAll("img")];
    this.observe();
  }
  observe() {
    this.observer.observe(this.rootElement);
  }
  unobserve() {
    this.observer.unobserve(this.rootElement);
  }
  onScreen() {
    animate({
      target: this.rootElement,
      transform: [`translateX(${this.xPercent}%)`, "translateX(0%)"],
      opacity: [0, 1],
      duration: 1500,
      delay: 0.15,
      easing: "out-quint",
      onfinish(el) {
        el.style.transform = "translateX(0%)";
        el.style.opacity = "1";
      }
    });
  }
  offScreen() {
    this.rootElement.style.transform = `translateX(${this.xPercent}%)`;
    this.rootElement.style.opacity = "0";
  }
  onIntersectionCallback(entries) {
    for (let entry of entries) {
      if (entry.intersectionRatio > 0) {
        this.onScreen();
      } else {
        this.offScreen();
      }
    }
  }
  stopEvents() {
    this.unobserve();
  }
}

class Splashscreen extends Service {
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
        this.EventEmitter.emit("BEFORE_SPLASHSCREEN_HIDE");
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
      });
      this.EventEmitter.emit("START_SPLASHSCREEN_HIDE");
      await this.show();
      resolve();
    });
  }
  async show() {
    await animate({
      target: this.rootElement,
      transform: ["translateY(0%)", "translateY(100%)"],
      duration: 1200,
      easing: "in-out-cubic"
    });
    this.rootElement.style.transform = "translateY(100%)";
    this.rootElement.style.visibility = "hidden";
    this.rootElement.style.pointerEvents = "none";
  }
}

class IntroAnimation extends Service {
  init() {
    super.init();
    this.elements = [...document.querySelectorAll(".intro-animation")];
  }
  newPage() {
    this.init();
    this.prepareToShow();
  }
  initEvents() {
    this.EventEmitter.on("BEFORE_SPLASHSCREEN_HIDE", this.prepareToShow, this);
    this.EventEmitter.on("CONTENT_REPLACED", this.newPage, this);
    this.EventEmitter.on("START_SPLASHSCREEN_HIDE BEFORE_TRANSITION_IN", this.show, this);
  }
  stopEvents() {
    this.EventEmitter.off("BEFORE_SPLASHSCREEN_HIDE", this.prepareToShow, this);
    this.EventEmitter.off("CONTENT_REPLACED", this.newPage, this);
    this.EventEmitter.off("START_SPLASHSCREEN_HIDE BEFORE_TRANSITION_IN", this.show, this);
  }
  stop() {
    for (let el of this.elements) {
      el.style.transform = "translateY(0px)";
      el.style.opacity = "1";
    }
    super.stop();
  }
  prepareToShow() {
    for (let el of this.elements) {
      el.style.transform = "translateY(200px)";
      el.style.opacity = "0";
    }
    window.scroll(0, 0);
  }
  async show() {
    return await animate({
      target: this.elements,
      keyframes: [
        {transform: "translateY(200px)", opacity: 0},
        {transform: "translateY(0px)", opacity: 1}
      ],
      delay(i) {
        return 200 * (i + 1);
      },
      onfinish(el) {
        el.style.transform = "translateY(0px)";
        el.style.opacity = "1";
      },
      easing: "out-cubic",
      duration: 500
    });
  }
}

class Fade extends Transition {
  constructor() {
    super(...arguments);
    this.name = "default";
    this.duration = 500;
  }
  out({from}) {
    let {duration} = this;
    let fromWrapper = from.getWrapper();
    window.scroll({
      top: 0,
      behavior: "smooth"
    });
    return new Promise(async (resolve) => {
      await animate({
        target: fromWrapper,
        opacity: [1, 0],
        duration,
        onfinish(el) {
          el.style.opacity = "0";
        }
      });
      window.scrollTo(0, 0);
      resolve();
    });
  }
  in({to}) {
    let {duration} = this;
    let toWrapper = to.getWrapper();
    toWrapper.style.transform = "translateX(0%)";
    return animate({
      target: toWrapper,
      opacity: [0, 1],
      duration,
      onfinish(el) {
        el.style.opacity = "1";
      }
    });
  }
}

class BigTransition extends Transition {
  constructor() {
    super(...arguments);
    this.name = "big";
    this.delay = 200;
    this.durationPerAnimation = 700;
  }
  boot() {
    this.mainElement = document.getElementById("big-transition");
    this.spinnerElement = this.mainElement.querySelector(".spinner");
    this.horizontalElements = [...this.mainElement.querySelector("#big-transition-horizontal").querySelectorAll("div")];
    this.maxLength = this.horizontalElements.length;
  }
  out({from}) {
    let {durationPerAnimation: duration, delay} = this;
    let fromWrapper = from.getWrapper();
    window.scroll({
      top: 0,
      behavior: "smooth"
    });
    return new Promise(async (resolve) => {
      animate({
        target: fromWrapper,
        opacity: [1, 0],
        duration,
        onfinish(el) {
          el.style.opacity = "0";
        }
      });
      this.mainElement.style.opacity = "1";
      this.mainElement.style.visibility = "visible";
      await animate({
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
      let loaderDuration = 500;
      this.spinnerElement.style.visibility = "visible";
      let options = await animate({
        target: this.spinnerElement,
        opacity: [0, 1],
        duration: loaderDuration,
        onfinish(el) {
          el.style.opacity = `1`;
        }
      });
      await animate({
        options,
        opacity: [1, 0],
        onfinish(el) {
          el.style.opacity = `0`;
        },
        delay: 1500
      });
      this.spinnerElement.style.visibility = "hidden";
      resolve();
    });
  }
  in({to}) {
    let {durationPerAnimation: duration, delay} = this;
    let toWrapper = to.getWrapper();
    toWrapper.style.transform = "translateX(0%)";
    return new Promise(async (resolve) => {
      animate({
        target: toWrapper,
        opacity: [0, 1],
        onfinish(el) {
          el.style.opacity = `1`;
        },
        duration
      });
      await animate({
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
      resolve();
    });
  }
}

class Slide extends Transition {
  constructor() {
    super(...arguments);
    this.name = "slide";
    this.duration = 500;
    this.direction = "right";
  }
  out({from}) {
    let {duration, direction} = this;
    let fromWrapper = from.getWrapper();
    window.scroll({
      top: 0,
      behavior: "smooth"
    });
    return animate({
      target: fromWrapper,
      keyframes: [
        {transform: "translateX(0%)", opacity: 1},
        {transform: `translateX(${direction === "left" ? "-" : ""}25%)`, opacity: 0}
      ],
      duration,
      easing: "in-quint",
      onfinish: (el) => {
        el.style.opacity = "0";
        el.style.transform = `translateX(${direction === "left" ? "-" : ""}25%)`;
      }
    });
  }
  in({to}) {
    let {duration} = this;
    let toWrapper = to.getWrapper();
    return animate({
      target: toWrapper,
      keyframes: [
        {transform: `translateX(${this.direction === "right" ? "-" : ""}25%)`, opacity: 0},
        {transform: "translateX(0%)", opacity: 1}
      ],
      duration,
      easing: "out-quint",
      onfinish(el) {
        el.style.opacity = "1";
        el.style.transform = `translateX(0%)`;
      }
    });
  }
}
class SlideLeft extends Slide {
  constructor() {
    super(...arguments);
    this.name = "slide-left";
    this.duration = 500;
    this.direction = "left";
  }
}
class SlideRight extends Slide {
  constructor() {
    super(...arguments);
    this.name = "slide-right";
    this.duration = 500;
    this.direction = "right";
  }
}

const html = document.querySelector("html");
try {
  let theme2 = getTheme();
  if (theme2 === null)
    theme2 = mediaTheme();
  theme2 && html.setAttribute("theme", theme2);
} catch (e) {
  console.warn("Theming isn't available on this browser.");
}
let themeSet = (theme2) => {
  html.setAttribute("theme", theme2);
  setTheme(theme2);
};
window.matchMedia("(prefers-color-scheme: dark)").addListener((e) => {
  themeSet(e.matches ? "dark" : "light");
});
const app = new App();
let splashscreen;
let router;
app.addService(new IntroAnimation()).addService(splashscreen = new Splashscreen()).setService("router", new Router()).add("service", new PJAX()).add("transition", new Fade()).addTransition(new BigTransition()).addTransition(new Slide()).add("transition", new SlideLeft()).add("transition", new SlideRight()).add("block", new BlockIntent({
  name: "InViewBlock",
  block: InViewBlock
}));
try {
  app.boot();
  router = app.getService("router");
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
} catch (err) {
  splashscreen.show();
  console.warn("[App] boot failed,", err);
}
