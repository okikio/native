function n(n){var t;if("undefined"!=typeof Symbol){if(Symbol.asyncIterator&&null!=(t=n[Symbol.asyncIterator]))return t.call(n);if(Symbol.iterator&&null!=(t=n[Symbol.iterator]))return t.call(n)}throw new TypeError("Object is not async iterable")}function t(n,e,i){if(!n.s){if(i instanceof r){if(!i.s)return void(i.o=t.bind(null,n,e));1&e&&(e=i.s),i=i.v}if(i&&i.then)return void i.then(t.bind(null,n,e),t.bind(null,n,2));n.s=e,n.v=i;var u=n.o;u&&u(n)}}var r=function(){function n(){}return n.prototype.then=function(r,e){var i=new n,u=this.s;if(u){var o=1&u?r:e;if(o){try{t(i,1,o(this.v))}catch(n){t(i,2,n)}return i}return this}return this.o=function(n){try{var u=n.v;1&n.s?t(i,1,r?r(u):u):e?t(i,1,e(u)):t(i,2,u)}catch(n){t(i,2,n)}},i},n}();function e(n){return n instanceof r&&1&n.s}function i(n,i,u){for(var o;;){var f=n();if(e(f)&&(f=f.v),!f)return h;if(f.then){o=0;break}var h=u();if(h&&h.then){if(!e(h)){o=1;break}h=h.s}if(i){var a=i();if(a&&a.then&&!e(a)){o=2;break}}}var c=new r,s=t.bind(null,c,2);return(0===o?f.then(v):1===o?h.then(l):a.then(d)).then(void 0,s),c;function l(r){h=r;do{if(i&&(a=i())&&a.then&&!e(a))return void a.then(d).then(void 0,s);if(!(f=n())||e(f)&&!f.v)return void t(c,1,h);if(f.then)return void f.then(v).then(void 0,s);e(h=u())&&(h=h.v)}while(!h||!h.then);h.then(l).then(void 0,s)}function v(n){n?(h=u())&&h.then?h.then(l).then(void 0,s):l(h):t(c,1,h)}function d(){(f=n())?f.then?f.then(v).then(void 0,s):v(f):t(c,1,h)}}function u(n,t){try{var r=n()}catch(n){return t(n)}return r&&r.then?r.then(void 0,t):r}function o(n,t){try{var r=n()}catch(n){return t(!0,n)}return r&&r.then?r.then(t.bind(null,!1),t.bind(null,!0)):t(!1,r)}exports.Manager=function(){function t(n){this.map=new Map(n)}var r,e=t.prototype;return e.getMap=function(){return this.map},e.get=function(n){return this.map.get(n)},e.keys=function(){return Array.from(this.map.keys())},e.values=function(){return Array.from(this.map.values())},e.set=function(n,t){return this.map.set(n,t),this},e.add=function(n){return this.set(this.size,n),this},e.last=function(n){void 0===n&&(n=1);var t=this.keys()[this.size-n];return this.get(t)},e.prev=function(){return this.last(2)},e.delete=function(n){return this.map.delete(n),this},e.clear=function(){return this.map.clear(),this},e.has=function(n){return this.map.has(n)},e.entries=function(){return this.map.entries()},e.forEach=function(n,t){return void 0===n&&(n=function(){}),this.map.forEach(n,t),this},e[Symbol.iterator]=function(){return this.entries()},e.methodCall=function(n){var t=arguments;return this.forEach(function(r){r[n].apply(r,[].slice.call(t,1))}),this},e.asyncMethodCall=function(t){try{var r,e,f,h,a,c=this,s=arguments,l=!0,v=!1,d=o(function(){return u(function(){e=n(c.map);var r=i(function(){return!!Promise.resolve(e.next()).then(function(n){return l=f.done,f=n,Promise.resolve(f.value).then(function(n){return h=n,!l})})},function(){return!!(l=!0)},function(){var n=h[1];return Promise.resolve(n[t].apply(n,[].slice.call(s,1))).then(function(){})});if(r&&r.then)return r.then(function(){})},function(n){v=!0,a=n})},function(n,t){function i(e){if(r)return e;if(n)throw t;return t}var u=o(function(){var n=function(){if(!l&&null!=e.return)return Promise.resolve(e.return()).then(function(){})}();if(n&&n.then)return n.then(function(){})},function(n,t){if(v)throw a;if(n)throw t;return t});return u&&u.then?u.then(i):i(u)});return Promise.resolve(d&&d.then?d.then(function(n){return r?n:c}):r?d:c)}catch(n){return Promise.reject(n)}},(r=[{key:"size",get:function(){return this.map.size}}])&&function(n,t){for(var r=0;r<t.length;r++){var e=t[r];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(n,e.key,e)}}(t.prototype,r),t}();
//# sourceMappingURL=api.js.map
