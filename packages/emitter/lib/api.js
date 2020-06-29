var EventEmitter=function(j){"use strict";class l{constructor(a){this.map=new Map(a)}getMap(){return this.map}get(a){return this.map.get(a)}keys(){return Array.from(this.map.keys())}values(){return Array.from(this.map.values())}set(a,b){return this.map.set(a,b),this}add(a){return this.set(this.size,a),this}get size(){return this.map.size}last(a=1){let b=this.keys()[this.size-a];return this.get(b)}prev(){return this.last(2)}delete(a){return this.map.delete(a),this}clear(){return this.map.clear(),this}has(a){return this.map.has(a)}entries(){return this.map.entries()}forEach(a=(...e)=>{},b){return this.map.forEach(a,b),this}[Symbol.iterator](){return this.entries()}methodCall(a,...b){return this.forEach(e=>{e[a](...b)}),this}async asyncMethodCall(a,...b){for(let[,e]of this.map)await e[a](...b);return this}}class k{constructor({callback:a=()=>{},scope:b=null,name:e="event"}){this.listener={callback:a,scope:b,name:e}}getCallback(){return this.listener.callback}getScope(){return this.listener.scope}getEventName(){return this.listener.name}toJSON(){return this.listener}}class i extends l{constructor(a="event"){super();this.name=a}}class n extends l{constructor(){super()}getEvent(a){let b=this.get(a);return b instanceof i?b:(this.set(a,new i(a)),this.get(a))}newListener(a,b,e){let c=this.getEvent(a);return c.add(new k({name:a,callback:b,scope:e})),c}on(a,b,e){if(typeof a=="undefined")return this;typeof a=="string"&&(a=a.split(/\s/g));let c,d,g=typeof a=="object"&&!Array.isArray(a),h=g?b:e;return g||(d=b),Object.keys(a).forEach(f=>{g?(c=f,d=a[f]):c=a[f],this.newListener(c,d,h)},this),this}removeListener(a,b,e){let c=this.get(a);if(c instanceof i&&b){let d=0,g=c.size,h,f=new k({name:a,callback:b,scope:e});for(;d<g;d++){h=c.get(d);if(h.getCallback()===f.getCallback()&&h.getScope()===f.getScope())break}c.delete(d)}return c}off(a,b,e){if(typeof a=="undefined")return this;typeof a=="string"&&(a=a.split(/\s/g));let c,d,g=typeof a=="object"&&!Array.isArray(a),h=g?b:e;return g||(d=b),Object.keys(a).forEach(f=>{g?(c=f,d=a[f]):c=a[f],d?this.removeListener(c,d,h):this.delete(c)},this),this}once(a,b,e){if(typeof a=="undefined")return this;typeof a=="string"&&(a=a.split(/\s/g));let c,d,g=typeof a==="object"&&!Array.isArray(a),h=g?b:e;return g||(d=b),Object.keys(a).forEach(f=>{g?(c=f,d=a[f]):c=a[f];let m=(...o)=>{g?(c=f,d=a[f]):c=a[f],this.off(c,m,h),d.apply(h,o)};this.on(c,m,h)},this),this}emit(a,...b){return typeof a=="undefined"?this:(typeof a=="string"&&(a=a.split(/\s/g)),a.forEach(e=>{let c=this.get(e);c instanceof i&&c.forEach(d=>{let{callback:g,scope:h}=d.toJSON();g.apply(h,b)})},this),this)}}return j.Event=i,j.EventEmitter=n,j.Listener=k,j}({});
//# sourceMappingURL=api.js.map
