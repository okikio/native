var be=Object.create;var D=Object.defineProperty;var Te=Object.getOwnPropertyDescriptor;var Ee=Object.getOwnPropertyNames;var ve=Object.getPrototypeOf,Ie=Object.prototype.hasOwnProperty;var Z=i=>D(i,"__esModule",{value:!0});var xe=(i,e)=>()=>(e||i((e={exports:{}}).exports,e),e.exports),Ae=(i,e)=>{Z(i);for(var t in e)D(i,t,{get:e[t],enumerable:!0})},Re=(i,e,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of Ee(e))!Ie.call(i,r)&&r!=="default"&&D(i,r,{get:()=>e[r],enumerable:!(t=Te(e,r))||t.enumerable});return i},ee=i=>Re(Z(D(i!=null?be(ve(i)):{},"default",i&&i.__esModule&&"default"in i?{get:()=>i.default,enumerable:!0}:{value:i,enumerable:!0})),i);var B=xe(d=>{"use strict";Object.defineProperty(d,"__esModule",{value:!0});d.pathToRegexp=d.tokensToRegexp=d.regexpToFunction=d.match=d.tokensToFunction=d.compile=d.parse=void 0;function Le(i){for(var e=[],t=0;t<i.length;){var r=i[t];if(r==="*"||r==="+"||r==="?"){e.push({type:"MODIFIER",index:t,value:i[t++]});continue}if(r==="\\"){e.push({type:"ESCAPED_CHAR",index:t++,value:i[t++]});continue}if(r==="{"){e.push({type:"OPEN",index:t,value:i[t++]});continue}if(r==="}"){e.push({type:"CLOSE",index:t,value:i[t++]});continue}if(r===":"){for(var n="",s=t+1;s<i.length;){var o=i.charCodeAt(s);if(o>=48&&o<=57||o>=65&&o<=90||o>=97&&o<=122||o===95){n+=i[s++];continue}break}if(!n)throw new TypeError("Missing parameter name at "+t);e.push({type:"NAME",index:t,value:n}),t=s;continue}if(r==="("){var c=1,a="",s=t+1;if(i[s]==="?")throw new TypeError('Pattern cannot start with "?" at '+s);for(;s<i.length;){if(i[s]==="\\"){a+=i[s++]+i[s++];continue}if(i[s]===")"){if(c--,c===0){s++;break}}else if(i[s]==="("&&(c++,i[s+1]!=="?"))throw new TypeError("Capturing groups are not allowed at "+s);a+=i[s++]}if(c)throw new TypeError("Unbalanced pattern at "+t);if(!a)throw new TypeError("Missing pattern at "+t);e.push({type:"PATTERN",index:t,value:a}),t=s;continue}e.push({type:"CHAR",index:t,value:i[t++]})}return e.push({type:"END",index:t,value:""}),e}function z(i,e){e===void 0&&(e={});for(var t=Le(i),r=e.prefixes,n=r===void 0?"./":r,s="[^"+M(e.delimiter||"/#?")+"]+?",o=[],c=0,a=0,l="",p=function(x){if(a<t.length&&t[a].type===x)return t[a++].value},u=function(x){var _=p(x);if(_!==void 0)return _;var Q=t[a],de=Q.type,ye=Q.index;throw new TypeError("Unexpected "+de+" at "+ye+", expected "+x)},m=function(){for(var x="",_;_=p("CHAR")||p("ESCAPED_CHAR");)x+=_;return x};a<t.length;){var g=p("CHAR"),T=p("NAME"),I=p("PATTERN");if(T||I){var h=g||"";n.indexOf(h)===-1&&(l+=h,h=""),l&&(o.push(l),l=""),o.push({name:T||c++,prefix:h,suffix:"",pattern:I||s,modifier:p("MODIFIER")||""});continue}var E=g||p("ESCAPED_CHAR");if(E){l+=E;continue}l&&(o.push(l),l="");var S=p("OPEN");if(S){var h=m(),k=p("NAME")||"",w=p("PATTERN")||"",j=m();u("CLOSE"),o.push({name:k||(w?c++:""),pattern:k&&!w?s:w,prefix:h,suffix:j,modifier:p("MODIFIER")||""});continue}u("END")}return o}d.parse=z;function Se(i,e){return ne(z(i,e),e)}d.compile=Se;function ne(i,e){e===void 0&&(e={});var t=$(e),r=e.encode,n=r===void 0?function(a){return a}:r,s=e.validate,o=s===void 0?!0:s,c=i.map(function(a){if(typeof a=="object")return new RegExp("^(?:"+a.pattern+")$",t)});return function(a){for(var l="",p=0;p<i.length;p++){var u=i[p];if(typeof u=="string"){l+=u;continue}var m=a?a[u.name]:void 0,g=u.modifier==="?"||u.modifier==="*",T=u.modifier==="*"||u.modifier==="+";if(Array.isArray(m)){if(!T)throw new TypeError('Expected "'+u.name+'" to not repeat, but got an array');if(m.length===0){if(g)continue;throw new TypeError('Expected "'+u.name+'" to not be empty')}for(var I=0;I<m.length;I++){var h=n(m[I],u);if(o&&!c[p].test(h))throw new TypeError('Expected all "'+u.name+'" to match "'+u.pattern+'", but got "'+h+'"');l+=u.prefix+h+u.suffix}continue}if(typeof m=="string"||typeof m=="number"){var h=n(String(m),u);if(o&&!c[p].test(h))throw new TypeError('Expected "'+u.name+'" to match "'+u.pattern+'", but got "'+h+'"');l+=u.prefix+h+u.suffix;continue}if(!g){var E=T?"an array":"a string";throw new TypeError('Expected "'+u.name+'" to be '+E)}}return l}}d.tokensToFunction=ne;function Pe(i,e){var t=[],r=q(i,t,e);return se(r,t,e)}d.match=Pe;function se(i,e,t){t===void 0&&(t={});var r=t.decode,n=r===void 0?function(s){return s}:r;return function(s){var o=i.exec(s);if(!o)return!1;for(var c=o[0],a=o.index,l=Object.create(null),p=function(m){if(o[m]===void 0)return"continue";var g=e[m-1];g.modifier==="*"||g.modifier==="+"?l[g.name]=o[m].split(g.prefix+g.suffix).map(function(T){return n(T,g)}):l[g.name]=n(o[m],g)},u=1;u<o.length;u++)p(u);return{path:c,index:a,params:l}}}d.regexpToFunction=se;function M(i){return i.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1")}function $(i){return i&&i.sensitive?"":"i"}function Ce(i,e){if(!e)return i;for(var t=/\((?:\?<(.*?)>)?(?!\?)/g,r=0,n=t.exec(i.source);n;)e.push({name:n[1]||r++,prefix:"",suffix:"",modifier:"",pattern:""}),n=t.exec(i.source);return i}function Me(i,e,t){var r=i.map(function(n){return q(n,e,t).source});return new RegExp("(?:"+r.join("|")+")",$(t))}function Oe(i,e,t){return oe(z(i,t),e,t)}function oe(i,e,t){t===void 0&&(t={});for(var r=t.strict,n=r===void 0?!1:r,s=t.start,o=s===void 0?!0:s,c=t.end,a=c===void 0?!0:c,l=t.encode,p=l===void 0?function(x){return x}:l,u="["+M(t.endsWith||"")+"]|$",m="["+M(t.delimiter||"/#?")+"]",g=o?"^":"",T=0,I=i;T<I.length;T++){var h=I[T];if(typeof h=="string")g+=M(p(h));else{var E=M(p(h.prefix)),S=M(p(h.suffix));if(h.pattern)if(e&&e.push(h),E||S)if(h.modifier==="+"||h.modifier==="*"){var k=h.modifier==="*"?"?":"";g+="(?:"+E+"((?:"+h.pattern+")(?:"+S+E+"(?:"+h.pattern+"))*)"+S+")"+k}else g+="(?:"+E+"("+h.pattern+")"+S+")"+h.modifier;else g+="("+h.pattern+")"+h.modifier;else g+="(?:"+E+S+")"+h.modifier}}if(a)n||(g+=m+"?"),g+=t.endsWith?"(?="+u+")":"$";else{var w=i[i.length-1],j=typeof w=="string"?m.indexOf(w[w.length-1])>-1:w===void 0;n||(g+="(?:"+m+"(?="+u+"))?"),j||(g+="(?="+m+"|"+u+")")}return new RegExp(g,$(t))}d.tokensToRegexp=oe;function q(i,e,t){return i instanceof RegExp?Ce(i,e):Array.isArray(i)?Me(i,e,t):Oe(i,e,t)}d.pathToRegexp=q});Ae(exports,{AdvancedManager:()=>C,App:()=>he,CONFIG_DEFAULTS:()=>te,HistoryManager:()=>re,Manager:()=>y,ManagerItem:()=>P,PARSER:()=>le,PJAX:()=>ge,Page:()=>K,PageManager:()=>pe,Router:()=>fe,Service:()=>b,ServiceManager:()=>F,TRANSITION_REPLACE:()=>Y,TransitionManager:()=>ce,changeState:()=>ie,clean:()=>G,equal:()=>N,getHash:()=>we,getHashedPath:()=>v,hashAction:()=>W,ignoreURLs:()=>O,methodCall:()=>L,newConfig:()=>V,newCoords:()=>R,newState:()=>H,newURL:()=>f,toAttr:()=>A});var te={wrapperAttr:"wrapper",headers:[],preventSelfAttr:'prevent="self"',preventAllAttr:'prevent="all"',transitionAttr:"transition",timeout:2e3,maxPages:5,resizeDelay:100,onTransitionPreventClick:!0,cacheIgnore:!1,prefetchIgnore:!1,preventURLs:[],stickyScroll:!1,forceOnError:!0,ignoreHashAction:!1,transitions:[]},V=i=>Object.assign({...te},i),A=(i,e,t=!0)=>{let{prefix:r}=i,n=i[e],s=`data${r?"-"+r:""}-${n}`;return t?`[${s}]`:s};var y=class{constructor(e){this.map=new Map(e)}getMap(){return this.map}get(e){return this.map.get(e)}keys(){return Array.from(this.map.keys())}values(){return Array.from(this.map.values())}set(e,t){return this.map.set(e,t),this}add(e){let r=this.size;return this.set(r,e),this}get size(){return this.map.size}get length(){return this.map.size}last(e=1){let t=this.keys()[this.size-e];return this.get(t)}delete(e){return this.map.delete(e)}remove(e){return this.map.delete(e),this}clear(){return this.map.clear(),this}has(e){return this.map.has(e)}entries(){return this.map.entries()}forEach(e,t){return this.map.forEach(e,t),this}[Symbol.iterator](){return this.entries()}},L=(i,e,...t)=>{i.forEach(r=>{r[e](...t)})};var P=class{constructor(){}install(){}register(e,t){return this.manager=e,this.app=e.app,this.config=e.config,this.emitter=e.emitter,this.key=t,this.install(),this}uninstall(){}unregister(){this.uninstall(),this.manager.remove(this.key),this.key=null,this.manager=null,this.app=null,this.config=null,this.emitter=null}},C=class extends y{constructor(e){super();this.app=e,this.config=e.config,this.emitter=e.emitter}set(e,t){return super.set(e,t),t.register(this,e),this}};var f=(i=window.location.href)=>i instanceof URL?i:new URL(i,window.location.origin),v=i=>{let e=f(i);return`${e.pathname}${e.hash}`},we=i=>f(i).hash.slice(1),G=i=>f(i).toString().replace(/(\/#.*|\/|#.*)$/,""),N=(i,e)=>G(i)===G(e);var b=class extends P{init(){}boot(){this.initEvents()}initEvents(){}stopEvents(){}stop(){this.stopEvents(),this.unregister()}},F=class extends C{constructor(e){super(e)}init(){return L(this,"init"),this}boot(){return L(this,"boot"),this}stop(){return L(this,"stop"),this}};var R=(i=window.scrollX,e=window.scrollY)=>({x:i,y:e}),H=(i={url:v(f()),index:0,transition:"default",data:{scroll:R(),trigger:"HistoryManager"}})=>i,re=class extends b{constructor(){super(...arguments);this.pointer=-1}init(){this.states=[];let e=H();this.add(e,"replace")}get(e){return this.states[e]}add(e,t="push"){let r=H(e),n=this.length;this.states.push({...r}),this.pointer=n;let s={index:this.pointer,states:[...this.states]};return ie(t,r,s),this}remove(e){return e?this.states.splice(e,1):this.states.pop(),this.pointer--,this}replace(e){return this.states=e,this}set(e,t){return this.states[e]=t}get current(){return this.get(this.pointer)}get last(){return this.get(this.length-1)}get previous(){return this.pointer<1?null:this.get(this.pointer-1)}get length(){return this.states.length}},ie=(i,e,t)=>{let r=v(e.url),n=[t,"",r];if(window.history)switch(i){case"push":window.history.pushState.apply(window.history,n);break;case"replace":window.history.replaceState.apply(window.history,n);break}};var ae=ee(B()),le=new DOMParser,K=class extends P{constructor(e=f(),t=document){super();this.url=f(e),typeof t=="string"?this.data=t:this.dom=t||document}async build(){if(this.dom instanceof Node||(this.dom=le.parseFromString(this.data,"text/html")),!(this.body instanceof Node)){let{title:e,head:t,body:r}=this.dom;this.title=e,this.head=t,this.body=r,this.wrapper=this.body.querySelector(this.wrapperAttr)}}install(){this.wrapperAttr=A(this.config,"wrapperAttr")}uninstall(){this.url=null,this.title=null,this.head=null,this.body=null,this.dom=null,this.wrapper=null,this.data=null,this.wrapperAttr=null}},pe=class extends b{constructor(){super();this.loading=new y}install(){this.pages=new C(this.app),this.cacheIgnore=this.config.cacheIgnore;let e=f().pathname;this.set(e,new K),e=null}get(e){return this.pages.get(e)}add(e){return this.pages.add(e),this}set(e,t){return this.pages.set(e,t),this}remove(e){return this.pages.remove(e),this}has(e){return this.pages.has(e)}clear(){return this.pages.clear(),this}get size(){return this.pages.size}keys(){return this.pages.keys()}async load(e=f()){let t=f(e),r=t.pathname,n,s;if(this.has(r)&&!O(r,this.cacheIgnore))return n=this.get(r),Promise.resolve(n);this.loading.has(r)?s=this.loading.get(r):(s=this.request(r),this.loading.set(r,s));let o=await s;if(this.loading.remove(r),n=new K(t,o),this.set(r,n),this.size>this.config.maxPages){let c=f(),a=this.keys(),l=N(c,a[0])?a[1]:a[0],p=this.get(l);p.unregister(),p=null,a=null,c=null,l=null}return n}async request(e){let t=new Headers(this.config.headers),r=window.setTimeout(()=>{window.clearTimeout(r);let n=new Error("Request Timed Out!");throw this.emitter.emit("TIMEOUT_ERROR",n,e),n},this.config.timeout);try{let n=await fetch(e,{mode:"same-origin",method:"GET",headers:t,cache:"default",credentials:"same-origin"});if(window.clearTimeout(r),n.status>=200&&n.status<300)return await n.text();let s=new Error(n.statusText||""+n.status);throw this.emitter.emit("REQUEST_ERROR",s,e),s}catch(n){throw window.clearTimeout(r),n}}},O=(i,e)=>{if(typeof e=="boolean")return e;let t=[];return!e.every(r=>(0,ae.pathToRegexp)(r,t,{start:!1,end:!1}).exec(i)==null)};var W=(i,e=window.location.hash)=>{try{let t=e[0]=="#"?e:f(e).hash;if(t.length>1){let r=document.getElementById(t.slice(1));if(r){let{left:n,top:s}=r.getBoundingClientRect(),o=window.scrollX,c=window.scrollY,a=n+o,l=s+c;return R(a,l)}}}catch(t){console.warn("[hashAction] error",t)}return i??R(0,0)},Y={name:"replace"},ce=class extends b{constructor(e){super();this._arg=e}install(){super.install();let e=this._arg&&this._arg.length?this._arg:this.config.transitions;this.transitions=new y([["default",Y],["replace",Y]].concat(e))}get(e){return this.transitions.get(e)}set(e,t){return this.transitions.set(e,t),this}add(e){return this.transitions.add(e),this}has(e){return this.transitions.has(e)}async start(e,t){let r=this.transitions.get(e),{oldPage:n,newPage:s,ignoreHashAction:o,trigger:c}=t;if(this.emitter.emit("TRANSITION_START",{transitionName:e,...t}),!("wrapper"in n)||!("wrapper"in s))throw`[TransitionManager] either oldPage or newPage aren't instances of the Page Class.
 ${{newPage:s,oldPage:n}}`;document.title=""+s.title;let a=n.wrapper,l=s.wrapper;if(!(a instanceof Node)||!(l instanceof Node))throw`[TransitionManager] the wrapper from the ${l instanceof Node?"current":"next"} page cannot be found. The wrapper must be an element that has the attribute ${A(this.config,"wrapperAttr")}.`;return r.init&&r?.init(t),this.emitter.emit("BEFORE_TRANSITION_OUT",t),r.out&&await new Promise(p=>{r.out.call(r,{...t,from:n,done:p})?.then(p)}),this.emitter.emit("AFTER_TRANSITION_OUT",t),await new Promise(p=>{a.insertAdjacentElement("beforebegin",l),this.emitter.emit("CONTENT_INSERT",t),p()}),await new Promise(p=>{a.remove(),a=null,l=null,this.emitter.emit("CONTENT_REPLACED",t),!o&&!/back|popstate|forward/.test(c)&&(t.scroll=W(t.scroll)),p()}),this.emitter.emit("BEFORE_TRANSITION_IN",t),r.in&&await new Promise(p=>{r.in.call(r,{...t,from:n,to:s,done:p})?.then(p)}),this.emitter.emit("AFTER_TRANSITION_IN",t),r.manualScroll||(!o&&!/back|popstate|forward/.test(c)&&(t.scroll=W(t.scroll)),window.scroll(t.scroll.x,t.scroll.y)),this.emitter.emit("TRANSITION_END",{transitionName:e,...t}),t}};var ue=({callback:i=()=>{},scope:e=null,name:t="event"})=>({callback:i,scope:e,name:t}),U=class extends y{constructor(e="event"){super();this.name=e}},X=i=>typeof i=="object"&&!Array.isArray(i)&&typeof i!="function",J=class extends y{constructor(){super()}getEvent(e){let t=this.get(e);return t instanceof U?t:(this.set(e,new U(e)),this.get(e))}newListener(e,t,r){let n=this.getEvent(e);return n.add(ue({name:e,callback:t,scope:r})),n}on(e,t,r){if(e==null||e==null)return this;typeof e=="string"&&(e=e.trim().split(/\s/g));let n,s,o=X(e),c=o?t:r;return o||(s=t),Object.keys(e).forEach(a=>{n=o?a:e[a],o&&(s=e[a]),this.newListener(n,s,c)},this),this}removeListener(e,t,r){let n=this.get(e);if(n instanceof U&&t){let s=ue({name:e,callback:t,scope:r});n.forEach((o,c)=>{if(o.callback===s.callback&&o.scope===s.scope)return n.remove(c)})}return n}off(e,t,r){if(e==null||e==null)return this;typeof e=="string"&&(e=e.trim().split(/\s/g));let n,s,o=X(e),c=o?t:r;return o||(s=t),Object.keys(e).forEach(a=>{n=o?a:e[a],o&&(s=e[a]),typeof s=="function"?this.removeListener(n,s,c):this.remove(n)},this),this}once(e,t,r){if(e==null||e==null)return this;typeof e=="string"&&(e=e.trim().split(/\s/g));let n=X(e);return Object.keys(e).forEach(s=>{let o=n?s:e[s],c=n?e[s]:t,a=n?t:r,l=(...p)=>{c.apply(a,p),this.removeListener(o,l,a)};this.newListener(o,l,a)},this),this}emit(e,...t){return e==null||e==null?this:(typeof e=="string"&&(e=e.trim().split(/\s/g)),e.forEach(r=>{let n=this.get(r);n instanceof U&&n.forEach(s=>{let{callback:o,scope:c}=s;o.apply(c,t)})},this),this)}clear(){return L(this,"clear"),super.clear(),this}};var he=class{constructor(e={}){this.canResize=!0;this.canScroll=!0;this._resize=this._resize.bind(this),this._scroll=this._scroll.bind(this),this._ready=this._ready.bind(this),this.register(e)}register(e={}){return this.config=V(e),this.emitter=new J,this.services=new F(this),this}_ready(){document.removeEventListener("DOMContentLoaded",this._ready),window.removeEventListener("load",this._ready),this.emitter.emit("READY ready")}_resize(){if(this.canResize){let e;this.canResize=!1,window.requestAnimationFrame(()=>{this.emitter.emit("RESIZE resize"),e=window.setTimeout(()=>{this.canResize=!0,e=window.clearTimeout(e)},this.config.resizeDelay)})}}_scroll(){this.canScroll&&(this.canScroll=!1,window.requestAnimationFrame(()=>{this.emitter.emit("SCROLL scroll"),this.canScroll=!0}))}get(e){return this.services.get(e)}set(e,t){return this.services.set(e,t),this}add(e){return this.services.add(e),this}boot(){return document.addEventListener("DOMContentLoaded",this._ready),window.addEventListener("load",this._ready),window.addEventListener("resize",this._resize,{passive:!0}),window.addEventListener("scroll",this._scroll,{passive:!0}),this.services.init(),this.services.boot(),this}stop(){return window.removeEventListener("resize",this._resize),window.removeEventListener("scroll",this._scroll),this.services.stop(),this.emitter.clear(),this}on(e,t){return this.emitter.on(e,t,this),this}off(e,t){return this.emitter.off(e,t,this),this}emit(e,...t){return this.emitter.emit(e,...t),this}};var ge=class extends b{install(){super.install(),this.preventURLs=this.config.preventURLs,this.prefetchIgnore=this.config.prefetchIgnore,this.onTransitionPreventClick=this.config.onTransitionPreventClick,this.stickyScroll=this.config.stickyScroll,this.forceOnError=this.config.forceOnError,this.ignoreHashAction=this.config.ignoreHashAction}transitionStart(){this.isTransitioning=!0}transitionStop(){this.isTransitioning=!1}init(){this.onHover=this.onHover.bind(this),this.onClick=this.onClick.bind(this),this.onStateChange=this.onStateChange.bind(this)}boot(){super.boot()}getTransitionName(e){if(!e||!e.getAttribute)return null;let t=e.getAttribute(A(this.config,"transitionAttr",!1));return typeof t=="string"?t:null}validLink(e,t,r){let n=!window.history.pushState,s=!e||!r,o=t.metaKey||t.ctrlKey||t.shiftKey||t.altKey,c=e.hasAttribute("target")&&e.target==="_blank",a=e.protocol!==location.protocol||e.hostname!==location.hostname,l=typeof e.getAttribute("download")=="string",p=e.matches(A(this.config,"preventSelfAttr")),u=Boolean(e.closest(A(this.config,"preventAllAttr"))),m=O(f(r).pathname,this.preventURLs),g=v(f())===v(f(r));return!(s||n||o||c||a||l||p||u||m||g)}getHref(e){return e&&e.tagName&&e.tagName.toLowerCase()==="a"&&typeof e.href=="string"?e.href:null}getLink(e){let t=e.target,r=this.getHref(t);for(;t&&!r;)t=t.parentNode,r=this.getHref(t);if(!(!t||!this.validLink(t,e,r)))return t}onClick(e){let t=this.getLink(e);if(!t)return;if(this.isTransitioning&&this.onTransitionPreventClick){e.preventDefault(),e.stopPropagation();return}let r=this.getHref(t);this.emitter.emit("ANCHOR_CLICK CLICK",e),this.go({href:r,trigger:t,event:e})}getDirection(e){return Math.abs(e)>1?e>0?"forward":"back":e===0?"popstate":e>0?"back":"forward"}force(e){window.location.assign(e)}go({href:e,trigger:t="HistoryManager",event:r}){if(this.isTransitioning&&!this.onTransitionPreventClick||!(this.manager.has("TransitionManager")&&this.manager.has("HistoryManager")&&this.manager.has("PageManager"))){this.force(e);return}let n=this.manager.get("HistoryManager"),s=R(0,0),o=n.current,c=o.url;if(N(c,e))return;let a;if(r&&r.state){this.emitter.emit("POPSTATE",r);let{state:l}=r,{index:p}=l,m=o.index-p;n.replace(l.states),n.pointer=p;let g=n.get(p);a=g.transition,s=g.data.scroll,t=this.getDirection(m),this.emitter.emit(t==="back"?"POPSTATE_BACK":"POPSTATE_FORWARD",r)}else{a=this.getTransitionName(t),s=R();let l=H({url:e,transition:a,data:{scroll:s}});!this.stickyScroll&&(s=R(0,0)),n.add(l),this.emitter.emit("HISTORY_NEW_ITEM",r)}return r&&(r.stopPropagation(),r.preventDefault()),this.emitter.emit("GO",r),this.load({oldHref:c,href:e,trigger:t,transitionName:a,scroll:s})}async load({oldHref:e,href:t,trigger:r,transitionName:n="default",scroll:s={x:0,y:0}}){try{let o=this.manager.get("TransitionManager"),c=this.manager.get("PageManager"),a=this.ignoreHashAction,l,p;this.emitter.emit("NAVIGATION_START",{oldHref:e,href:t,trigger:r,transitionName:n,scroll:s}),o.has(n)||(console.log(`[PJAX] transition name "${n}" doesn't exist, switching to the "default" transition`),n="default");try{this.transitionStart(),this.emitter.emit("PAGE_LOADING",{href:t,oldHref:e,trigger:r,scroll:s}),p=await c.load(e),l=await c.load(t),this.emitter.emit("PAGE_LOAD_COMPLETE",{newPage:l,oldPage:p,trigger:r,scroll:s}),p.dom instanceof Element||p.build(),l.build()}catch(u){console.warn("[PJAX] Page load error",u)}try{s=(await o.start(n,{oldPage:p,newPage:l,trigger:r,scroll:s,ignoreHashAction:a})).scroll}catch(u){console.warn("[PJAX] Transition error",u)}this.emitter.emit("NAVIGATION_END",{oldPage:p,newPage:l,trigger:r,transitionName:n,scroll:s})}catch(o){this.forceOnError?this.force(t):console.warn(o)}finally{this.transitionStop()}}onHover(e){let t=this.getLink(e);if(!t||!this.manager.has("PageManager"))return;let r=this.manager.get("PageManager"),n=f(this.getHref(t)),s=n.pathname;if(this.emitter.emit("ANCHOR_HOVER HOVER",e),!O(n.pathname,this.prefetchIgnore)&&!(r.has(s)&&!O(s,r.cacheIgnore)))try{r.load(n),this.emitter.emit("PREFETCH",e)}catch(o){console.warn("[PJAX] Prefetch error",o)}}onStateChange(e){this.go({href:window.location.href,trigger:"popstate",event:e})}initEvents(){this.prefetchIgnore!==!0&&(document.addEventListener("mouseover",this.onHover),document.addEventListener("touchstart",this.onHover)),document.addEventListener("click",this.onClick),window.addEventListener("popstate",this.onStateChange)}stopEvents(){this.prefetchIgnore!==!0&&(document.removeEventListener("mouseover",this.onHover),document.removeEventListener("touchstart",this.onHover)),document.removeEventListener("click",this.onClick),window.removeEventListener("popstate",this.onStateChange)}};var me=ee(B()),fe=class extends b{constructor(e=[]){super();this.routes=new y;for(let t of e)this.add(t)}add({path:e,method:t}){let r=this.parse(e);return this.routes.set(r,t),this}parsePath(e){if(typeof e=="string"||e instanceof RegExp||Array.isArray(e))return(0,me.pathToRegexp)(e,[],{start:!1,end:!1});if(typeof e=="boolean")return e&&/.*/;throw"[Router] only regular expressions, strings, booleans and arrays of regular expressions and strings are accepted as paths."}isPath(e){return typeof e=="string"||e instanceof RegExp||typeof e=="boolean"||Array.isArray(e)}parse(e){let t=e,r={from:/.*/,to:/.*/};if(this.isPath(e))r={from:!0,to:e};else if(this.isPath(t.from)&&this.isPath(t.to))r=Object.assign({},r,t);else throw"[Router] path is neither a string, regular expression, or a { from, to } object.";let{from:n,to:s}=r;return{from:this.parsePath(n),to:this.parsePath(s)}}route(){if(this.manager.has("HistoryManager")){let e=this.manager.get("HistoryManager"),t=v(f((e.length>1?e.previous:e.current).url)),r=v(f());this.routes.forEach((n,s)=>{let o=s.from,c=s.to;if(typeof o=="boolean"&&typeof c=="boolean")throw`[Router] path ({ from: ${o}, to: ${c} }) is not valid, remember paths can only be strings, regular expressions, or a boolean; however, both the from and to paths cannot be both booleans.`;let a=o,l=c;o instanceof RegExp&&o.test(t)&&(a=o.exec(t)),c instanceof RegExp&&c.test(r)&&(l=c.exec(r)),(Array.isArray(l)&&Array.isArray(a)||Array.isArray(l)&&a==!1&&!c.test(t)||Array.isArray(a)&&l==!1&&!o.test(r))&&n({from:a,to:l,path:{from:t,to:r}})})}else console.warn("[Route] HistoryManager is missing.")}initEvents(){this.emitter.on("READY",this.route,this),this.emitter.on("CONTENT_REPLACED",this.route,this)}stopEvents(){this.emitter.off("READY",this.route,this),this.emitter.off("CONTENT_REPLACED",this.route,this)}};0&&(module.exports={AdvancedManager,App,CONFIG_DEFAULTS,HistoryManager,Manager,ManagerItem,PARSER,PJAX,Page,PageManager,Router,Service,ServiceManager,TRANSITION_REPLACE,TransitionManager,changeState,clean,equal,getHash,getHashedPath,hashAction,ignoreURLs,methodCall,newConfig,newCoords,newState,newURL,toAttr});