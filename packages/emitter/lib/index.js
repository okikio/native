// src/index.ts
import { Manager, methodCall } from "@okikio/manager/src/index.ts";
var newListener = ({
  callback = () => {
  },
  scope = null,
  name = "event"
}) => ({ callback, scope, name });
var Event = class extends Manager {
  /** The name of the event */
  name;
  constructor(name = "event") {
    super();
    this.name = name;
  }
};
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
var EventEmitter = class extends Manager {
  constructor() {
    super();
  }
  /** Gets event, if event doesn't exist create a new one */
  getEvent(name) {
    let event = this.get(name);
    if (!(event instanceof Event)) {
      this.set(name, new Event(name));
      return this.get(name);
    }
    return event;
  }
  /** Creates a listener and adds it to an event */
  newListener(name, callback, scope) {
    const event = this.getEvent(name);
    if (!event) throw new Error(`Can't add listener to event "${name}", as event "${name}" does not exist.`);
    event.add(newListener({ name, callback, scope }));
    return event;
  }
  /** Adds a listener to a given event */
  on(events, callback, scope) {
    if (events === void 0 || events === null) return this;
    if (typeof events === "string") events = events.trim().split(/\s+/);
    let _name;
    let _callback;
    let isObj = isObject(events);
    let _scope = isObj ? callback : scope;
    if (!isObj) _callback = callback;
    Object.keys(events).forEach((key) => {
      const evts = events;
      _name = isObj ? key : evts[key];
      if (isObj) _callback = evts[key];
      this.newListener(_name, _callback, _scope);
    }, this);
    return this;
  }
  /** Removes a listener from an event */
  removeListener(name, callback, scope) {
    let event = this.get(name);
    if (!callback) throw new Error("Callback is required to remove a listener");
    if (!event) throw new Error(`Can't remove listener from event "${name}", as event "${name}" does not exist.`);
    if (event instanceof Event) {
      let listener = newListener({ name, callback, scope });
      event.forEach((value, i) => {
        if (value && typeof i === "number" && value.callback === listener.callback && value.scope === listener.scope) return event.remove(i);
      });
    }
    return event;
  }
  /** Remove a listener from a given event, or just completely remove an event */
  off(events, callback, scope) {
    if (events === void 0 || events === null) return this;
    if (typeof events === "string") events = events.trim().split(/\s+/);
    let _name;
    let _callback;
    let isObj = isObject(events);
    let _scope = isObj ? callback : scope;
    if (!isObj) _callback = callback;
    Object.keys(events).forEach((key) => {
      const evts = events;
      _name = isObj ? key : evts[key];
      if (isObj) _callback = evts[key];
      if (typeof _callback === "function") {
        this.removeListener(_name, _callback, _scope);
      } else this.remove(_name);
    }, this);
    return this;
  }
  /**
   * Adds a one time event listener for an event
   */
  once(events, callback, scope) {
    if (events === void 0 || events === null) return this;
    if (typeof events == "string") events = events.trim().split(/\s+/);
    let isObj = isObject(events);
    Object.keys(events).forEach((key) => {
      const evts = events;
      let _name = isObj ? key : evts[key];
      let _callback = isObj ? evts[key] : callback;
      let _scope = isObj ? callback : scope;
      let onceFn = (...args) => {
        _callback.apply(_scope, args);
        this.removeListener(_name, onceFn, _scope);
      };
      this.newListener(_name, onceFn, _scope);
    }, this);
    return this;
  }
  /** Call all listeners within an event */
  emit(events, ...args) {
    if (events === void 0 || events === null) return this;
    if (typeof events == "string") events = events.trim().split(/\s+/);
    events.forEach((event) => {
      let _event = this.get(event);
      if (_event instanceof Event) {
        _event.forEach((listener) => {
          if (!listener) return;
          let { callback, scope } = listener;
          callback.apply(scope, args);
        });
      }
    }, this);
    return this;
  }
  /** Clears events and event listeners */
  clear() {
    methodCall(this, "clear");
    super.clear();
    return this;
  }
};
function on(target, events, callback, opts) {
  if (target === void 0 || target === null) return null;
  if (events === void 0 || events === null) return target;
  if (typeof events === "string") events = events.trim().split(/\s+/);
  let _name;
  let _callback;
  let isObj = isObject(events);
  let _opts = isObj ? callback : opts;
  if (!isObj) _callback = callback;
  Object.keys(events).forEach((key) => {
    const evts = events;
    _name = isObj ? key : evts[key];
    if (isObj) _callback = evts[key];
    target.addEventListener(_name, _callback, _opts);
  }, target);
  return target;
}
function off(target, events, callback, opts) {
  if (target === void 0 || target === null) return null;
  if (events === void 0 || events === null) return target;
  if (typeof events === "string") events = events.trim().split(/\s+/);
  let _name;
  let _callback;
  let isObj = isObject(events);
  let _opts = isObj ? callback : opts;
  if (!isObj) _callback = callback;
  Object.keys(events).forEach((key) => {
    const evts = events;
    _name = isObj ? key : evts[key];
    if (isObj) _callback = evts[key];
    target.removeEventListener(_name, _callback, _opts);
  }, target);
  return target;
}
function emit(target, events) {
  if (target === void 0 || target === null) return null;
  if (events === void 0 || events === null) return target;
  if (typeof events === "string") events = events.trim().split(/\s+/);
  if (events instanceof globalThis.Event) events = [events];
  events.forEach((event) => {
    const _event = event instanceof globalThis.Event ? event : new globalThis.Event(event);
    target.dispatchEvent(_event);
  }, target);
  return target;
}
function toCustomEvents(events, detail) {
  if (typeof events === "string") events = events.trim().split(/\s+/);
  return events.map((evt) => {
    return new CustomEvent(evt, { detail });
  });
}
var src_default = EventEmitter;
export {
  Event,
  EventEmitter,
  src_default as default,
  emit,
  isObject,
  newListener,
  off,
  on,
  toCustomEvents
};
//# sourceMappingURL=index.js.map