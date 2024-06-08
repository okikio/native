function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
(function(g, f) {
    if ("object" == (typeof exports === "undefined" ? "undefined" : _type_of(exports)) && "object" == (typeof module === "undefined" ? "undefined" : _type_of(module))) {
        module.exports = f();
    } else if ("function" == typeof define && define.amd) {
        define("manager", [], f);
    } else if ("object" == (typeof exports === "undefined" ? "undefined" : _type_of(exports))) {
        exports["manager"] = f();
    } else {
        g["manager"] = f();
    }
})(this, function() {
    "use strict";
    var methodCall = function methodCall(manager, method) {
        for(var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
            args[_key - 2] = arguments[_key];
        }
        manager.forEach(function(item) {
            if (!item) return;
            if ((typeof item === "undefined" ? "undefined" : _type_of(item)) !== "object") return;
            if (!(method in item)) return;
            var fn = item[method];
            if (typeof fn !== "function") return;
            fn === null || fn === void 0 ? void 0 : fn.apply(void 0, _to_consumable_array(args));
        });
    };
    var exports1 = {};
    var module1 = {
        exports: exports1
    };
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __defNormalProp = function(obj, key, value) {
        return key in obj ? __defProp(obj, key, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: value
        }) : obj[key] = value;
    };
    var __export = function(target, all) {
        for(var name in all)__defProp(target, name, {
            get: all[name],
            enumerable: true
        });
    };
    var __copyProps = function(to, from, except, desc) {
        if (from && (typeof from === "undefined" ? "undefined" : _type_of(from)) === "object" || typeof from === "function") {
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                var _loop = function() {
                    var key = _step.value;
                    if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
                        get: function() {
                            return from[key];
                        },
                        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
                    });
                };
                for(var _iterator = __getOwnPropNames(from)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
        return to;
    };
    var __toCommonJS = function(mod) {
        return __copyProps(__defProp({}, "__esModule", {
            value: true
        }), mod);
    };
    var __publicField = function(obj, key, value) {
        return __defNormalProp(obj, (typeof key === "undefined" ? "undefined" : _type_of(key)) !== "symbol" ? key + "" : key, value);
    };
    // src/index.ts
    var src_exports = {};
    __export(src_exports, {
        Manager: function() {
            return Manager;
        },
        default: function() {
            return src_default;
        },
        methodCall: function() {
            return methodCall;
        }
    });
    module1.exports = __toCommonJS(src_exports);
    var Manager = /*#__PURE__*/ function() {
        function Manager(value) {
            _class_call_check(this, Manager);
            /** For backward compatability and performance reasons Manager use Map to store data */ __publicField(this, "map");
            this.map = new Map(value);
        }
        _create_class(Manager, [
            {
                /** Returns the Manager classes base Map */ key: "getMap",
                value: function getMap() {
                    return this.map;
                }
            },
            {
                /** Get a value stored in the Manager */ key: "get",
                value: function get(key) {
                    return this.map.get(key);
                }
            },
            {
                /** Returns the keys of all items stored in the Manager as an Array */ key: "keys",
                value: function keys() {
                    return Array.from(this.map.keys());
                }
            },
            {
                /** Returns the values of all items stored in the Manager as an Array */ key: "values",
                value: function values() {
                    return Array.from(this.map.values());
                }
            },
            {
                /** Set a value to the Manager using a key */ key: "set",
                value: function set(key, value) {
                    this.map.set(key, value);
                    return this;
                }
            },
            {
                /** Adds a value to Manager, and uses the current size of the Manager as it's key, it works best when all the key in the Manager are numbers */ key: "add",
                value: function add(value) {
                    var size = this.size;
                    var num = size;
                    this.set(num, value);
                    return this;
                }
            },
            {
                key: "size",
                get: /** Returns the total number of items stored in the Manager */ function get() {
                    return this.map.size;
                }
            },
            {
                key: "length",
                get: /** An alias for size */ function get() {
                    return this.map.size;
                }
            },
            {
                /** Returns the last item in the Manager who's index is a certain distance from the last item in the Manager */ key: "last",
                value: function last() {
                    var distance = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
                    var key = this.keys()[this.size - distance];
                    return this.get(key);
                }
            },
            {
                /** Removes a value stored in the Manager via a key, returns true if an element in the Map object existed and has been removed, or false if the element does not exist */ key: "delete",
                value: function _delete(key) {
                    return this.map.delete(key);
                }
            },
            {
                /** Removes a value stored in the Manager via a key, returns the Manager class, allowing for chains */ key: "remove",
                value: function remove(key) {
                    this.map.delete(key);
                    return this;
                }
            },
            {
                /** Clear the Manager of all its contents */ key: "clear",
                value: function clear() {
                    this.map.clear();
                    return this;
                }
            },
            {
                /** Checks if the Manager contains a certain key */ key: "has",
                value: function has(key) {
                    return this.map.has(key);
                }
            },
            {
                /** Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order. */ key: "entries",
                value: function entries() {
                    return this.map.entries();
                }
            },
            {
                /** Iterates through the Managers contents, calling a callback function every iteration */ key: "forEach",
                value: function forEach(callback, context) {
                    this.map.forEach(callback, context);
                    return this;
                }
            },
            {
                /** Allows for iteration via for..of, learn more: [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators] */ key: Symbol.iterator,
                value: function value() {
                    return this.entries();
                }
            }
        ]);
        return Manager;
    }();
    var src_default = Manager;
    if (_type_of(module1.exports) == "object" && (typeof exports1 === "undefined" ? "undefined" : _type_of(exports1)) == "object") {
        var __cp = function(to, from, except, desc) {
            if (from && (typeof from === "undefined" ? "undefined" : _type_of(from)) === "object" || typeof from === "function") {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    var _loop = function() {
                        var key = _step.value;
                        if (!Object.prototype.hasOwnProperty.call(to, key) && key !== except) Object.defineProperty(to, key, {
                            get: function() {
                                return from[key];
                            },
                            enumerable: !(desc = Object.getOwnPropertyDescriptor(from, key)) || desc.enumerable
                        });
                    };
                    for(var _iterator = Object.getOwnPropertyNames(from)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
            return to;
        };
        module1.exports = __cp(module1.exports, exports1);
    }
    return module1.exports;
});
//# sourceMappingURL=index.umd.js.map