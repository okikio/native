"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Manager: () => Manager,
  default: () => src_default,
  methodCall: () => methodCall
});
module.exports = __toCommonJS(src_exports);
var Manager = class {
  /** For backward compatability and performance reasons Manager use Map to store data */
  map;
  constructor(value) {
    this.map = new Map(value);
  }
  /** Returns the Manager classes base Map */
  getMap() {
    return this.map;
  }
  /** Get a value stored in the Manager */
  get(key) {
    return this.map.get(key);
  }
  /** Returns the keys of all items stored in the Manager as an Array */
  keys() {
    return Array.from(this.map.keys());
  }
  /** Returns the values of all items stored in the Manager as an Array */
  values() {
    return Array.from(this.map.values());
  }
  /** Set a value to the Manager using a key */
  set(key, value) {
    this.map.set(key, value);
    return this;
  }
  /** Adds a value to Manager, and uses the current size of the Manager as it's key, it works best when all the key in the Manager are numbers */
  add(value) {
    const size = this.size;
    const num = size;
    this.set(num, value);
    return this;
  }
  /** Returns the total number of items stored in the Manager */
  get size() {
    return this.map.size;
  }
  /** An alias for size */
  get length() {
    return this.map.size;
  }
  /** Returns the last item in the Manager who's index is a certain distance from the last item in the Manager */
  last(distance = 1) {
    const key = this.keys()[this.size - distance];
    return this.get(key);
  }
  /** Removes a value stored in the Manager via a key, returns true if an element in the Map object existed and has been removed, or false if the element does not exist */
  delete(key) {
    return this.map.delete(key);
  }
  /** Removes a value stored in the Manager via a key, returns the Manager class, allowing for chains */
  remove(key) {
    this.map.delete(key);
    return this;
  }
  /** Clear the Manager of all its contents */
  clear() {
    this.map.clear();
    return this;
  }
  /** Checks if the Manager contains a certain key */
  has(key) {
    return this.map.has(key);
  }
  /** Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order. */
  entries() {
    return this.map.entries();
  }
  /** Iterates through the Managers contents, calling a callback function every iteration */
  forEach(callback, context) {
    this.map.forEach(callback, context);
    return this;
  }
  /** Allows for iteration via for..of, learn more: [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators] */
  [Symbol.iterator]() {
    return this.entries();
  }
};
function methodCall(manager, method, ...args) {
  manager.forEach((item) => {
    if (!item) return;
    if (typeof item !== "object") return;
    if (!(method in item)) return;
    const fn = item[method];
    if (typeof fn !== "function") return;
    fn?.(...args);
  });
}
var src_default = Manager;
//# sourceMappingURL=index.cjs.map