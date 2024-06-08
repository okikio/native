function _assert_this_initialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
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
function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
        _get = Reflect.get;
    } else {
        _get = function get(target, property, receiver) {
            var base = _super_prop_base(target, property);
            if (!base) return;
            var desc = Object.getOwnPropertyDescriptor(base, property);
            if (desc.get) {
                return desc.get.call(receiver || target);
            }
            return desc.value;
        };
    }
    return _get(target, property, receiver || target);
}
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assert_this_initialized(self);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _super_prop_base(object, property) {
    while(!Object.prototype.hasOwnProperty.call(object, property)){
        object = _get_prototype_of(object);
        if (object === null) break;
    }
    return object;
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _is_native_reflect_construct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function _create_super(Derived) {
    var hasNativeReflectConstruct = _is_native_reflect_construct();
    return function _createSuperInternal() {
        var Super = _get_prototype_of(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _get_prototype_of(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possible_constructor_return(this, result);
    };
}
(function(g, f) {
    if ("object" == (typeof exports === "undefined" ? "undefined" : _type_of(exports)) && "object" == (typeof module === "undefined" ? "undefined" : _type_of(module))) {
        module.exports = f();
    } else if ("function" == typeof define && define.amd) {
        define("emitter", [], f);
    } else if ("object" == (typeof exports === "undefined" ? "undefined" : _type_of(exports))) {
        exports["emitter"] = f();
    } else {
        g["emitter"] = f();
    }
})(this, function() {
    "use strict";
    var isObject = function isObject(value) {
        return value !== null && (typeof value === "undefined" ? "undefined" : _type_of(value)) === "object" && !Array.isArray(value);
    };
    var on = function on(target, events, callback, opts) {
        if (target === void 0 || target === null) return null;
        if (events === void 0 || events === null) return target;
        if (typeof events === "string") events = events.trim().split(/\s+/);
        var _name;
        var _callback;
        var isObj = isObject(events);
        var _opts = isObj ? callback : opts;
        if (!isObj) _callback = callback;
        Object.keys(events).forEach(function(key) {
            var evts = events;
            _name = isObj ? key : evts[key];
            if (isObj) _callback = evts[key];
            target.addEventListener(_name, _callback, _opts);
        }, target);
        return target;
    };
    var off = function off(target, events, callback, opts) {
        if (target === void 0 || target === null) return null;
        if (events === void 0 || events === null) return target;
        if (typeof events === "string") events = events.trim().split(/\s+/);
        var _name;
        var _callback;
        var isObj = isObject(events);
        var _opts = isObj ? callback : opts;
        if (!isObj) _callback = callback;
        Object.keys(events).forEach(function(key) {
            var evts = events;
            _name = isObj ? key : evts[key];
            if (isObj) _callback = evts[key];
            target.removeEventListener(_name, _callback, _opts);
        }, target);
        return target;
    };
    var emit = function emit(target, events) {
        if (target === void 0 || target === null) return null;
        if (events === void 0 || events === null) return target;
        if (typeof events === "string") events = events.trim().split(/\s+/);
        if (_instanceof(events, globalThis.Event)) events = [
            events
        ];
        events.forEach(function(event) {
            var _event = _instanceof(event, globalThis.Event) ? event : new globalThis.Event(event);
            target.dispatchEvent(_event);
        }, target);
        return target;
    };
    var toCustomEvents = function toCustomEvents(events, detail) {
        if (typeof events === "string") events = events.trim().split(/\s+/);
        return events.map(function(evt) {
            return new CustomEvent(evt, {
                detail: detail
            });
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
        Event: function() {
            return Event;
        },
        EventEmitter: function() {
            return EventEmitter;
        },
        default: function() {
            return src_default;
        },
        emit: function() {
            return emit;
        },
        isObject: function() {
            return isObject;
        },
        newListener: function() {
            return newListener;
        },
        off: function() {
            return off;
        },
        on: function() {
            return on;
        },
        toCustomEvents: function() {
            return toCustomEvents;
        }
    });
    module1.exports = __toCommonJS(src_exports);
    var import_src = require("@okikio/manager/src/index.ts");
    var newListener = function(param) {
        var _param_callback = param.callback, callback = _param_callback === void 0 ? function() {} : _param_callback, _param_scope = param.scope, scope = _param_scope === void 0 ? null : _param_scope, _param_name = param.name, name = _param_name === void 0 ? "event" : _param_name;
        return {
            callback: callback,
            scope: scope,
            name: name
        };
    };
    var Event = /*#__PURE__*/ function(_import_src_Manager) {
        _inherits(Event, _import_src_Manager);
        var _super = _create_super(Event);
        function Event() {
            var name = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "event";
            _class_call_check(this, Event);
            var _this;
            _this = _super.call(this);
            /** The name of the event */ __publicField(_assert_this_initialized(_this), "name");
            _this.name = name;
            return _this;
        }
        return Event;
    }(import_src.Manager);
    var EventEmitter = /*#__PURE__*/ function(_import_src_Manager) {
        _inherits(EventEmitter, _import_src_Manager);
        var _super = _create_super(EventEmitter);
        function EventEmitter() {
            _class_call_check(this, EventEmitter);
            return _super.call(this);
        }
        _create_class(EventEmitter, [
            {
                /** Gets event, if event doesn't exist create a new one */ key: "getEvent",
                value: function getEvent(name) {
                    var event = this.get(name);
                    if (!_instanceof(event, Event)) {
                        this.set(name, new Event(name));
                        return this.get(name);
                    }
                    return event;
                }
            },
            {
                /** Creates a listener and adds it to an event */ key: "newListener",
                value: function newListener1(name, callback, scope) {
                    var event = this.getEvent(name);
                    if (!event) throw new Error("Can't add listener to event \"".concat(name, '", as event "').concat(name, '" does not exist.'));
                    event.add(newListener({
                        name: name,
                        callback: callback,
                        scope: scope
                    }));
                    return event;
                }
            },
            {
                /** Adds a listener to a given event */ key: "on",
                value: function on(events, callback, scope) {
                    var _this = this;
                    if (events === void 0 || events === null) return this;
                    if (typeof events === "string") events = events.trim().split(/\s+/);
                    var _name;
                    var _callback;
                    var isObj = isObject(events);
                    var _scope = isObj ? callback : scope;
                    if (!isObj) _callback = callback;
                    Object.keys(events).forEach(function(key) {
                        var evts = events;
                        _name = isObj ? key : evts[key];
                        if (isObj) _callback = evts[key];
                        _this.newListener(_name, _callback, _scope);
                    }, this);
                    return this;
                }
            },
            {
                /** Removes a listener from an event */ key: "removeListener",
                value: function removeListener(name, callback, scope) {
                    var event = this.get(name);
                    if (!callback) throw new Error("Callback is required to remove a listener");
                    if (!event) throw new Error("Can't remove listener from event \"".concat(name, '", as event "').concat(name, '" does not exist.'));
                    if (_instanceof(event, Event)) {
                        var listener = newListener({
                            name: name,
                            callback: callback,
                            scope: scope
                        });
                        event.forEach(function(value, i) {
                            if (value && typeof i === "number" && value.callback === listener.callback && value.scope === listener.scope) return event.remove(i);
                        });
                    }
                    return event;
                }
            },
            {
                /** Remove a listener from a given event, or just completely remove an event */ key: "off",
                value: function off(events, callback, scope) {
                    var _this = this;
                    if (events === void 0 || events === null) return this;
                    if (typeof events === "string") events = events.trim().split(/\s+/);
                    var _name;
                    var _callback;
                    var isObj = isObject(events);
                    var _scope = isObj ? callback : scope;
                    if (!isObj) _callback = callback;
                    Object.keys(events).forEach(function(key) {
                        var evts = events;
                        _name = isObj ? key : evts[key];
                        if (isObj) _callback = evts[key];
                        if (typeof _callback === "function") {
                            _this.removeListener(_name, _callback, _scope);
                        } else _this.remove(_name);
                    }, this);
                    return this;
                }
            },
            {
                /**
   * Adds a one time event listener for an event
   */ key: "once",
                value: function once(events, callback, scope) {
                    var _this = this;
                    if (events === void 0 || events === null) return this;
                    if (typeof events == "string") events = events.trim().split(/\s+/);
                    var isObj = isObject(events);
                    Object.keys(events).forEach(function(key) {
                        var _this1 = _this;
                        var evts = events;
                        var _name = isObj ? key : evts[key];
                        var _callback = isObj ? evts[key] : callback;
                        var _scope = isObj ? callback : scope;
                        var onceFn = function() {
                            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                                args[_key] = arguments[_key];
                            }
                            _callback.apply(_scope, args);
                            _this1.removeListener(_name, onceFn, _scope);
                        };
                        _this.newListener(_name, onceFn, _scope);
                    }, this);
                    return this;
                }
            },
            {
                /** Call all listeners within an event */ key: "emit",
                value: function emit(events) {
                    var _this = this;
                    for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
                        args[_key - 1] = arguments[_key];
                    }
                    if (events === void 0 || events === null) return this;
                    if (typeof events == "string") events = events.trim().split(/\s+/);
                    events.forEach(function(event) {
                        var _event = _this.get(event);
                        if (_instanceof(_event, Event)) {
                            _event.forEach(function(listener) {
                                if (!listener) return;
                                var callback = listener.callback, scope = listener.scope;
                                callback.apply(scope, args);
                            });
                        }
                    }, this);
                    return this;
                }
            },
            {
                /** Clears events and event listeners */ key: "clear",
                value: function clear() {
                    (0, import_src.methodCall)(this, "clear");
                    _get(_get_prototype_of(EventEmitter.prototype), "clear", this).call(this);
                    return this;
                }
            }
        ]);
        return EventEmitter;
    }(import_src.Manager);
    var src_default = EventEmitter;
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