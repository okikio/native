!(function (t, e) {
    "object" == typeof exports && "undefined" != typeof module
        ? e(exports, require("managerjs"))
        : "function" == typeof define && define.amd
        ? define(["exports", "managerjs"], e)
        : e(((t = t || self).eventEmitter = {}), t.managerjs);
})(this, function (t, e) {
    function n(t, e) {
        (t.prototype = Object.create(e.prototype)),
            (t.prototype.constructor = t),
            (t.__proto__ = e);
    }
    e = e && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
    var i = (function () {
            function t(t) {
                var e = t.callback,
                    n = t.scope,
                    i = t.name;
                this.listener = {
                    callback: void 0 === e ? function () {} : e,
                    scope: void 0 === n ? null : n,
                    name: void 0 === i ? "event" : i,
                };
            }
            var e = t.prototype;
            return (
                (e.getCallback = function () {
                    return this.listener.callback;
                }),
                (e.getScope = function () {
                    return this.listener.scope;
                }),
                (e.getEventName = function () {
                    return this.listener.name;
                }),
                (e.toJSON = function () {
                    return this.listener;
                }),
                t
            );
        })(),
        r = (function (t) {
            function e(e) {
                var n;
                return (
                    void 0 === e && (e = "event"),
                    ((n = t.call(this) || this).name = e),
                    n
                );
            }
            return n(e, t), e;
        })(e),
        o = (function (t) {
            function e() {
                return t.call(this) || this;
            }
            n(e, t);
            var o = e.prototype;
            return (
                (o.getEvent = function (t) {
                    var e = this.get(t);
                    return e instanceof r
                        ? e
                        : (this.set(t, new r(t)), this.get(t));
                }),
                (o.newListener = function (t, e, n) {
                    var r = this.getEvent(t);
                    return r.add(new i({ name: t, callback: e, scope: n })), r;
                }),
                (o.on = function (t, e, n) {
                    var i,
                        r,
                        o,
                        c = this;
                    return (
                        void 0 === t ||
                            ("string" == typeof t && (t = t.split(/\s/g)),
                            Object.keys(t).forEach(function (s) {
                                "object" != typeof t || Array.isArray(t)
                                    ? ((i = t[s]), (r = e), (o = n))
                                    : ((i = s), (r = t[s]), (o = e)),
                                    c.newListener(i, r, o);
                            }, this)),
                        this
                    );
                }),
                (o.removeListener = function (t, e, n) {
                    var r = this.getEvent(t);
                    if (e) {
                        for (
                            var o,
                                c = 0,
                                s = r.size,
                                a = new i({ name: t, callback: e, scope: n });
                            c < s &&
                            ((o = r.get(c)),
                            console.log(o),
                            o.getCallback() !== a.getCallback() ||
                                o.getScope() !== a.getScope());
                            c++
                        );
                        r.delete(c);
                    }
                    return r;
                }),
                (o.off = function (t, e, n) {
                    var i,
                        r,
                        o,
                        c = this;
                    return (
                        void 0 === t ||
                            ("string" == typeof t && (t = t.split(/\s/g)),
                            Object.keys(t).forEach(function (s) {
                                "object" != typeof t || Array.isArray(t)
                                    ? ((i = t[s]), (r = e), (o = n))
                                    : ((i = s), (r = t[s]), (o = e)),
                                    r ? c.removeListener(i, r, o) : c.delete(i);
                            }, this)),
                        this
                    );
                }),
                (o.once = function (t, e, n) {
                    var i = this;
                    return (
                        void 0 === t ||
                            ("string" == typeof t && (t = t.split(/\s/g)),
                            this.on(
                                t,
                                function r() {
                                    i.off(t, r, n),
                                        e.apply(n, [].slice.call(arguments));
                                },
                                n
                            )),
                        this
                    );
                }),
                (o.emit = function (t) {
                    var e = this,
                        n = [].slice.call(arguments, 1);
                    return (
                        void 0 === t ||
                            ("string" == typeof t && (t = t.split(/\s/g)),
                            t.forEach(function (t) {
                                var i = e.getEvent(t),
                                    r = new CustomEvent(t, { detail: n });
                                window.dispatchEvent(r),
                                    i.forEach(function (t) {
                                        var e = t.toJSON();
                                        e.callback.apply(e.scope, n);
                                    });
                            }, this)),
                        this
                    );
                }),
                e
            );
        })(e);
    (t.Event = r), (t.EventEmitter = o), (t.Listener = i);
});
//# sourceMappingURL=api.umd.js.map
