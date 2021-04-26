var Q=Object.defineProperty;var gt=r=>Q(r,"__esModule",{value:!0});var dt=(r,t)=>{for(var e in t)Q(r,e,{get:t[e],enumerable:!0})};gt(exports);dt(exports,{AdvancedManager:()=>R,Animate:()=>M,App:()=>lt,CONFIG_DEFAULTS:()=>tt,DefaultAnimationOptions:()=>V,Event:()=>k,EventEmitter:()=>O,HistoryManager:()=>rt,Manager:()=>g,ManagerItem:()=>S,PARSER:()=>st,PJAX:()=>pt,Page:()=>z,PageManager:()=>ot,Router:()=>ct,Service:()=>y,ServiceManager:()=>K,Timeline:()=>mt,TransitionManager:()=>at,animate:()=>At,asyncMethodCall:()=>it,changeState:()=>nt,clean:()=>X,computeValue:()=>j,easings:()=>ht,equal:()=>N,getConfig:()=>c,getEase:()=>Z,getElements:()=>ut,getHash:()=>ft,getHashedPath:()=>E,getTargets:()=>U,hashAction:()=>F,mapObject:()=>_,methodCall:()=>x,newConfig:()=>W,newCoords:()=>w,newListener:()=>J,newState:()=>D,newURL:()=>u,toAttr:()=>et});var tt={wrapperAttr:"wrapper",noAjaxLinkAttr:"no-ajax-link",noPrefetchAttr:"no-prefetch",headers:[["x-partial","true"]],preventSelfAttr:'prevent="self"',preventAllAttr:'prevent="all"',transitionAttr:"transition",blockAttr:"block",timeout:3e4,maxPages:5,resizeDelay:100},W=r=>Object.assign({...tt},r),et=(r,t,e=!0)=>{let{prefix:i}=r,n=`data${i?"-"+i:""}-${t}`;return e?`[${n}]`:n},c=(r,t,e=!0)=>{if(typeof t!="string")return r;let i=r[t];return typeof i=="string"?et(r,i,e):i};var g=class{constructor(t){this.map=new Map(t)}getMap(){return this.map}get(t){return this.map.get(t)}keys(){return Array.from(this.map.keys())}values(){return Array.from(this.map.values())}set(t,e){return this.map.set(t,e),this}add(t){let i=this.size;return this.set(i,t),this}get size(){return this.map.size}get length(){return this.map.size}last(t=1){let e=this.keys()[this.size-t];return this.get(e)}delete(t){return this.map.delete(t)}remove(t){return this.map.delete(t),this}clear(){return this.map.clear(),this}has(t){return this.map.has(t)}entries(){return this.map.entries()}forEach(t,e){return this.map.forEach(t,e),this}[Symbol.iterator](){return this.entries()}},x=(r,t,...e)=>{r.forEach(i=>{i[t](...e)})},it=async(r,t,...e)=>{for(let[,i]of r)await i[t](...e)};var S=class{constructor(){}install(){}register(t,e){return this.manager=t,this.app=t.app,this.config=t.config,this.emitter=t.emitter,this.key=e,this.install(),this}uninstall(){}unregister(){this.uninstall(),this.manager.remove(this.key),this.key=void 0,this.manager=void 0,this.app=void 0,this.config=void 0,this.emitter=void 0}},R=class extends g{constructor(t){super();this.app=t,this.config=t.config,this.emitter=t.emitter}set(t,e){return super.set(t,e),e.register(this,t),this}};var u=(r=window.location.href)=>r instanceof URL?r:new URL(r,window.location.origin),E=r=>{let t=u(r);return`${t.pathname}${t.hash}`},ft=r=>u(r).hash.slice(1),X=r=>u(r).toString().replace(/(\/#.*|\/|#.*)$/,""),N=(r,t)=>X(r)===X(t);var y=class extends S{init(){}boot(){this.initEvents()}initEvents(){}stopEvents(){}stop(){this.stopEvents(),this.unregister()}},K=class extends R{constructor(t){super(t)}init(){return x(this,"init"),this}boot(){return x(this,"boot"),this}stop(){return x(this,"stop"),this}};var w=(r=window.scrollX,t=window.scrollY)=>({x:r,y:t}),D=(r={url:E(u()),index:0,transition:"default",data:{scroll:w(),trigger:"HistoryManager"}})=>r,rt=class extends y{constructor(){super(...arguments);this.pointer=-1}init(){this.states=[];let t=D();this.add(t,"replace")}get(t){return this.states[t]}add(t,e="push"){let i=D(t),n=this.length;this.states.push({...i}),this.pointer=n;let s={index:this.pointer,states:[...this.states]};return nt(e,i,s),this}remove(t){return t?this.states.splice(t,1):this.states.pop(),this.pointer--,this}replace(t){return this.states=t,this}set(t,e){return this.states[t]=e}get current(){return this.get(this.pointer)}get last(){return this.get(this.length-1)}get previous(){return this.pointer<1?null:this.get(this.pointer-1)}get length(){return this.states.length}},nt=(r,t,e)=>{let i=E(t.url),n=[e,"",i];if(window.history)switch(r){case"push":window.history.pushState.apply(window.history,n);break;case"replace":window.history.replaceState.apply(window.history,n);break}};var st=new DOMParser,z=class extends S{constructor(t=u(),e=document){super();this.url=t,typeof e=="string"?this.data=e:this.dom=e||document}build(){if(this.dom instanceof Node||(this.dom=st.parseFromString(this.data,"text/html")),!(this.body instanceof Node)){let{title:t,head:e,body:i}=this.dom;this.title=t,this.head=e,this.body=i,this.wrapper=this.body.querySelector(this.wrapperAttr)}}install(){this.wrapperAttr=c(this.config,"wrapperAttr")}uninstall(){this.url=void 0,this.title=void 0,this.head=void 0,this.body=void 0,this.dom=void 0,this.wrapper=void 0,this.data=void 0,this.wrapperAttr=void 0}},ot=class extends y{constructor(){super(...arguments);this.loading=new g}install(){this.pages=new R(this.app);let t=u().pathname;this.set(t,new z),t=void 0}get(t){return this.pages.get(t)}add(t){return this.pages.add(t),this}set(t,e){return this.pages.set(t,e),this}remove(t){return this.pages.remove(t),this}has(t){return this.pages.has(t)}clear(){return this.pages.clear(),this}get size(){return this.pages.size}keys(){return this.pages.keys()}async load(t=u()){let e=u(t),i=e.pathname,n,s;if(this.has(i))return n=this.get(i),Promise.resolve(n);this.loading.has(i)?s=this.loading.get(i):(s=this.request(i),this.loading.set(i,s));let a=await s;if(this.loading.remove(i),n=new z(e,a),this.set(i,n),this.size>c(this.config,"maxPages")){let l=u(),o=this.keys(),p=N(l,o[0])?o[1]:o[0],d=this.get(p);d.unregister(),d=void 0,o=void 0,l=void 0,p=void 0}return n}async request(t){let e=new Headers(c(this.config,"headers")),i=window.setTimeout(()=>{throw window.clearTimeout(i),"Request Timed Out!"},c(this.config,"timeout"));try{let n=await fetch(t,{mode:"same-origin",method:"GET",headers:e,cache:"default",credentials:"same-origin"});if(window.clearTimeout(i),n.status>=200&&n.status<300)return await n.text();throw new Error(n.statusText||""+n.status)}catch(n){throw window.clearTimeout(i),n}}};var J=({callback:r=()=>{},scope:t=null,name:e="event"})=>({callback:r,scope:t,name:e}),k=class extends g{constructor(t="event"){super();this.name=t}},O=class extends g{constructor(){super()}getEvent(t){let e=this.get(t);return e instanceof k?e:(this.set(t,new k(t)),this.get(t))}newListener(t,e,i){let n=this.getEvent(t);return n.add(J({name:t,callback:e,scope:i})),n}on(t,e,i){if(typeof t=="undefined")return this;typeof t=="string"&&(t=t.trim().split(/\s/g));let n,s,a=typeof t=="object"&&!Array.isArray(t),l=a?e:i;return a||(s=e),Object.keys(t).forEach(o=>{a?(n=o,s=t[o]):n=t[o],this.newListener(n,s,l)},this),this}removeListener(t,e,i){let n=this.get(t);if(n instanceof k&&e){let s=J({name:t,callback:e,scope:i});n.forEach((a,l)=>{if(a.callback===s.callback&&a.scope===s.scope)return n.remove(l)})}return n}off(t,e,i){if(typeof t=="undefined")return this;typeof t=="string"&&(t=t.trim().split(/\s/g));let n,s,a=typeof t=="object"&&!Array.isArray(t),l=a?e:i;return a||(s=e),Object.keys(t).forEach(o=>{a?(n=o,s=t[o]):n=t[o],typeof s=="function"?this.removeListener(n,s,l):this.remove(n)},this),this}emit(t,...e){return typeof t=="undefined"?this:(typeof t=="string"&&(t=t.trim().split(/\s/g)),t.forEach(i=>{let n=this.get(i);n instanceof k&&n.forEach(s=>{let{callback:a,scope:l}=s;a.apply(l,e)})},this),this)}clear(){return x(this,"clear"),super.clear(),this}};var F=(r,t=window.location.hash)=>{try{let e=t[0]=="#"?t:u(t).hash;if(e.length>1){let i=document.getElementById(e.slice(1));if(i){let{left:n,top:s}=i.getBoundingClientRect(),a=window.scrollX,l=window.scrollY,o=n+a,p=s+l;return console.log(o,p),w(o,p)}}}catch(e){console.warn("[hashAction] error",e)}return r??w(0,0)},bt={name:"default",scrollable:!0,out({done:r}){r()},in({scroll:r,done:t}){window.scroll(r.x,r.y),t()}},at=class extends y{constructor(t){super();this._arg=t}install(){super.install();let t=this._arg&&this._arg.length?this._arg:c(this.config,"transitions")??[];t=[["default",bt]].concat(t),this.transitions=new g(t)}get(t){return this.transitions.get(t)}set(t,e){return this.transitions.set(t,e),this}add(t){return this.transitions.add(t),this}has(t){return this.transitions.has(t)}async animate(t,e){let i=this.transitions.get(t),n=e.scroll,s=e.ignoreHashAction;if(!("wrapper"in e.oldPage)||!("wrapper"in e.newPage))throw`[Page] either oldPage or newPage aren't instances of the Page Class.
 ${{newPage:e.newPage,oldPage:e.oldPage}}`;document.title=""+e.newPage.title;let a=e.oldPage.wrapper,l=e.newPage.wrapper;if(!(a instanceof Node)||!(l instanceof Node))throw`[Wrapper] the wrapper from the ${l instanceof Node?"current":"next"} page cannot be found. The wrapper must be an element that has the attribute ${c(this.config,"wrapperAttr")}.`;return i.init&&i?.init(e),this.emitter.emit("BEFORE_TRANSITION_OUT"),i.out&&await new Promise(o=>{i.out.call(i,{...e,from:e.oldPage,trigger:e.trigger,done:o})?.then(o)}),this.emitter.emit("AFTER_TRANSITION_OUT"),await new Promise(o=>{a.insertAdjacentElement("beforebegin",l),this.emitter.emit("CONTENT_INSERT"),!s&&!/back|popstate|forward/.test(e.trigger)&&(n=F(n)),o()}),await new Promise(o=>{a.remove(),a=void 0,l=void 0,this.emitter.emit("CONTENT_REPLACED"),o()}),this.emitter.emit("BEFORE_TRANSITION_IN"),i.in&&await new Promise(async o=>{i.in.call(i,{...e,from:e.oldPage,to:e.newPage,trigger:e.trigger,scroll:n,done:o})?.then(o)}),this.emitter.emit("AFTER_TRANSITION_IN"),i}};var lt=class{constructor(t={}){this.canResize=!0;this.canScroll=!0;this._resize=this._resize.bind(this),this._scroll=this._scroll.bind(this),this._ready=this._ready.bind(this),this.register(t)}register(t={}){return this.config=W(t),this.emitter=new O,this.services=new K(this),document.addEventListener("DOMContentLoaded",this._ready),window.addEventListener("load",this._ready),window.addEventListener("resize",this._resize,{passive:!0}),window.addEventListener("scroll",this._scroll,{passive:!0}),this}_ready(){document.removeEventListener("DOMContentLoaded",this._ready),window.removeEventListener("load",this._ready),this.emitter.emit("READY ready")}_resize(){if(this.canResize){let t,e;this.canResize=!1,e=window.requestAnimationFrame(()=>{this.emitter.emit("RESIZE resize"),t=window.setTimeout(()=>{this.canResize=!0,t=window.clearTimeout(t),e=window.cancelAnimationFrame(e)},c(this.config,"resizeDelay"))})}}_scroll(){if(this.canScroll){let t;this.canScroll=!1,t=requestAnimationFrame(()=>{this.emitter.emit("SCROLL scroll"),this.canScroll=!0,t=window.cancelAnimationFrame(t)})}}get(t){return this.services.get(t)}set(t,e){return this.services.set(t,e),this}add(t){return this.services.add(t),this}boot(){return this.services.init(),this.services.boot(),this}stop(){return this.services.stop(),this.emitter.clear(),this}on(t,e){return this.emitter.on(t,e,this),this}off(t,e){return this.emitter.off(t,e,this),this}emit(t,...e){return this.emitter.emit(t,...e),this}};var pt=class extends y{install(){super.install(),this.ignoreURLs=c(this.config,"ignoreURLs")??[],this.prefetchIgnore=c(this.config,"prefetchIgnore")??!1,this.stopOnTransitioning=c(this.config,"stopOnTransitioning")??!1,this.stickyScroll=c(this.config,"stickyScroll")??!1,this.forceOnError=c(this.config,"forceOnError")??!1,this.ignoreHashAction=c(this.config,"ignoreHashAction")??!1}transitionStart(){this.isTransitioning=!0}transitionStop(){this.isTransitioning=!1}init(){this.onHover=this.onHover.bind(this),this.onClick=this.onClick.bind(this),this.onStateChange=this.onStateChange.bind(this)}boot(){"scrollRestoration"in window.history&&(window.history.scrollRestoration="manual"),super.boot()}getTransitionName(t){if(!t||!t.getAttribute)return null;let e=t.getAttribute(c(this.config,"transitionAttr",!1));return typeof e=="string"?e:null}validLink(t,e,i){let n=!window.history.pushState,s=!t||!i,a=e.metaKey||e.ctrlKey||e.shiftKey||e.altKey,l=t.hasAttribute("target")&&t.target==="_blank",o=t.protocol!==location.protocol||t.hostname!==location.hostname,p=typeof t.getAttribute("download")=="string",d=t.matches(c(this.config,"preventSelfAttr")),P=Boolean(t.closest(c(this.config,"preventAllAttr"))),T=E(u())===E(u(i));return!(s||n||a||l||o||p||d||P||T)}getHref(t){return t&&t.tagName&&t.tagName.toLowerCase()==="a"&&typeof t.href=="string"?t.href:null}getLink(t){let e=t.target,i=this.getHref(e);for(;e&&!i;)e=e.parentNode,i=this.getHref(e);if(!(!e||!this.validLink(e,t,i)))return e}onClick(t){let e=this.getLink(t);if(!e)return;if(this.isTransitioning&&this.stopOnTransitioning){t.preventDefault(),t.stopPropagation();return}let i=this.getHref(e);this.emitter.emit("ANCHOR_CLICK CLICK",t),this.go({href:i,trigger:e,event:t})}getDirection(t){return Math.abs(t)>1?t>0?"forward":"back":t===0?"popstate":t>0?"back":"forward"}force(t){window.location.assign(t)}go({href:t,trigger:e="HistoryManager",event:i}){if(this.isTransitioning&&this.stopOnTransitioning||!(this.manager.has("TransitionManager")&&this.manager.has("HistoryManager")&&this.manager.has("PageManager"))){this.force(t);return}let n=this.manager.get("HistoryManager"),s=w(0,0),a=n.current,l=a.url;if(N(l,t))return;let o;if(i&&i.state){this.emitter.emit("POPSTATE",i);let{state:p}=i,{index:d}=p,T=a.index-d;n.replace(p.states),n.pointer=d;let v=n.get(d);o=v.transition,s=v.data.scroll,e=this.getDirection(T),console.log(e=="forward"&&n),this.emitter.emit(e==="back"?"POPSTATE_BACK":"POPSTATE_FORWARD",i)}else{o=this.getTransitionName(e),s=w();let p=D({url:t,transition:o,data:{scroll:s}});!this.stickyScroll&&(s=w(0,0)),n.add(p),this.emitter.emit("HISTORY_NEW_ITEM",i)}return i&&(i.stopPropagation(),i.preventDefault()),this.emitter.emit("GO",i),this.load({oldHref:l,href:t,trigger:e,transitionName:o,scroll:s})}async load({oldHref:t,href:e,trigger:i,transitionName:n="default",scroll:s={x:0,y:0}}){try{let a=this.manager.get("PageManager"),l,o;this.emitter.emit("NAVIGATION_START",{oldHref:t,href:e,trigger:i,transitionName:n});try{this.transitionStart(),o=await a.load(t),!(o.dom instanceof Element)&&o.build(),this.emitter.emit("PAGE_LOADING",{href:e,oldPage:o,trigger:i}),l=await a.load(e),await l.build(),this.emitter.emit("PAGE_LOAD_COMPLETE",{newPage:l,oldPage:o,trigger:i})}catch(p){console.warn(`[PJAX] Page load error: ${p}`)}try{let p=this.manager.get("TransitionManager");this.emitter.emit("TRANSITION_START",n);let d=await p.animate(p.has(n)?n:"default",{oldPage:o,newPage:l,trigger:i,scroll:s,ignoreHashAction:this.ignoreHashAction});d.scrollable||(!this.ignoreHashAction&&!/back|popstate|forward/.test(i)&&(s=F(s)),window.scroll(s.x,s.y)),this.emitter.emit("TRANSITION_END",{transition:d})}catch(p){console.warn(`[PJAX] Transition error: ${p}`)}this.emitter.emit("NAVIGATION_END",{oldPage:o,newPage:l,trigger:i,transitionName:n})}catch(a){this.forceOnError?this.force(e):console.warn(a)}finally{this.transitionStop()}}ignoredURL({pathname:t}){return this.ignoreURLs.length&&this.ignoreURLs.some(e=>typeof e=="string"?e===t:e.exec(t)!==null)}onHover(t){let e=this.getLink(t);if(!e||!this.manager.has("PageManager"))return;let i=this.manager.get("PageManager"),n=u(this.getHref(e)),s=n.pathname;if(!(this.ignoredURL(n)||i.has(s))){this.emitter.emit("ANCHOR_HOVER HOVER",t);try{i.load(n)}catch(a){console.warn("[PJAX] prefetch error,",a)}}}onStateChange(t){this.go({href:window.location.href,trigger:"popstate",event:t})}initEvents(){this.prefetchIgnore!==!0&&(document.addEventListener("mouseover",this.onHover),document.addEventListener("touchstart",this.onHover)),document.addEventListener("click",this.onClick),window.addEventListener("popstate",this.onStateChange)}stopEvents(){this.prefetchIgnore!==!0&&(document.removeEventListener("mouseover",this.onHover),document.removeEventListener("touchstart",this.onHover)),document.removeEventListener("click",this.onClick),window.removeEventListener("popstate",this.onStateChange)}};var ct=class extends y{constructor(t=[]){super();this.routes=new g;for(let e of t)this.add(e)}add({path:t,method:e}){let i=this.parse(t);return this.routes.set(i,e),this}parsePath(t){if(typeof t=="string")return new RegExp(t,"i");if(t instanceof RegExp||typeof t=="boolean")return t;throw"[Router] only regular expressions, strings and booleans are accepted as paths."}isPath(t){return typeof t=="string"||t instanceof RegExp||typeof t=="boolean"}parse(t){let e=t,i={from:/(.*)/g,to:/(.*)/g};if(this.isPath(t))i={from:!0,to:t};else if(this.isPath(e.from)&&this.isPath(e.to))i=e;else throw"[Router] path is neither a string, regular expression, or a { from, to } object.";let{from:n,to:s}=i;return{from:this.parsePath(n),to:this.parsePath(s)}}route(){if(this.manager.has("HistoryManager")){let t=this.manager.get("HistoryManager"),e=E(u((t.length>1?t.previous:t.current).url)),i=E(u());this.routes.forEach((n,s)=>{let a=s.from,l=s.to;if(typeof a=="boolean"&&typeof l=="boolean")throw`[Router] path ({ from: ${a}, to: ${l} }) is not valid, remember paths can only be strings, regular expressions, or a boolean; however, both the from and to paths cannot be both booleans.`;let o=a,p=l;a instanceof RegExp&&a.test(e)&&(o=a.exec(e)),l instanceof RegExp&&l.test(i)&&(p=l.exec(i)),(Array.isArray(p)&&Array.isArray(o)||Array.isArray(p)&&typeof o=="boolean"&&o||Array.isArray(o)&&typeof p=="boolean"&&p)&&n({from:o,to:p,path:{from:e,to:i}})})}else console.warn("[Route] HistoryManager is missing.")}initEvents(){this.emitter.on("READY",this.route,this),this.emitter.on("CONTENT_REPLACED",this.route,this)}stopEvents(){this.emitter.off("READY",this.route,this),this.emitter.off("CONTENT_REPLACED",this.route,this)}};var ut=r=>typeof r=="string"?Array.from(document.querySelectorAll(r)):[r],yt=r=>[].concat(...r),U=r=>Array.isArray(r)?yt(r.map(U)):typeof r=="string"||r instanceof Node?ut(r):r instanceof NodeList||r instanceof HTMLCollection?Array.from(r):[],j=(r,t,e)=>typeof r=="function"?r.apply(e,t):r,_=(r,t,e)=>{let i,n,s={},a=Object.keys(r);for(let l=0,o=a.length;l<o;l++)i=a[l],n=r[i],s[i]=j(n,t,e);return s},ht={in:"ease-in",out:"ease-out","in-out":"ease-in-out","in-sine":"cubic-bezier(0.47, 0, 0.745, 0.715)","out-sine":"cubic-bezier(0.39, 0.575, 0.565, 1)","in-out-sine":"cubic-bezier(0.445, 0.05, 0.55, 0.95)","in-quad":"cubic-bezier(0.55, 0.085, 0.68, 0.53)","out-quad":"cubic-bezier(0.25, 0.46, 0.45, 0.94)","in-out-quad":"cubic-bezier(0.455, 0.03, 0.515, 0.955)","in-cubic":"cubic-bezier(0.55, 0.055, 0.675, 0.19)","out-cubic":"cubic-bezier(0.215, 0.61, 0.355, 1)","in-out-cubic":"cubic-bezier(0.645, 0.045, 0.355, 1)","in-quart":"cubic-bezier(0.895, 0.03, 0.685, 0.22)","out-quart":"cubic-bezier(0.165, 0.84, 0.44, 1)","in-out-quart":"cubic-bezier(0.77, 0, 0.175, 1)","in-quint":"cubic-bezier(0.755, 0.05, 0.855, 0.06)","out-quint":"cubic-bezier(0.23, 1, 0.32, 1)","in-out-quint":"cubic-bezier(0.86, 0, 0.07, 1)","in-expo":"cubic-bezier(0.95, 0.05, 0.795, 0.035)","out-expo":"cubic-bezier(0.19, 1, 0.22, 1)","in-out-expo":"cubic-bezier(1, 0, 0, 1)","in-circ":"cubic-bezier(0.6, 0.04, 0.98, 0.335)","out-circ":"cubic-bezier(0.075, 0.82, 0.165, 1)","in-out-circ":"cubic-bezier(0.785, 0.135, 0.15, 0.86)","in-back":"cubic-bezier(0.6, -0.28, 0.735, 0.045)","out-back":"cubic-bezier(0.175, 0.885, 0.32, 1.275)","in-out-back":"cubic-bezier(0.68, -0.55, 0.265, 1.55)"},Z=r=>/^(in|out)/.test(r)?ht[r]:r,V={keyframes:[],loop:1,delay:0,speed:1,endDelay:0,easing:"ease",autoplay:!0,duration:1e3,fillMode:"auto",direction:"normal",extend:{}},M=class{constructor(t={}){this.options={};this.targets=[];this.properties={};this.animations=new g;this.totalDuration=0;this.minDelay=0;this.computedOptions=new g;this.emitter=new O;try{let{options:e,...i}=t,n=e instanceof M?e.getOptions():Array.isArray(e)?e?.[0]?.getOptions():e;this.options=Object.assign({},V,n,i),this.loop=this.loop.bind(this);let{loop:s,delay:a,speed:l,easing:o,endDelay:p,duration:d,direction:P,fillMode:T,onfinish:v,target:G,keyframes:q,autoplay:$,extend:B,...Y}=this.options;this.mainElement=document.createElement("div"),this.targets=U(G),this.properties=Y;let C=[],b=this.targets.length,I;for(let m=0;m<b;m++){let f=this.targets[m],h={easing:typeof o=="string"?Z(o):o,iterations:s===!0?Infinity:s,direction:P,endDelay:p,duration:d,delay:a,fill:T,...B},L=j(q,[m,b,f],this);I=L.length?L:this.properties,h=_(h,[m,b,f],this),L.length>0||(I=_(I,[m,b,f],this));let H=h.delay+h.duration*h.iterations+h.endDelay;this.totalDuration<H&&(this.totalDuration=H);let A=f.animate(I,h);A.onfinish=()=>{typeof v=="function"&&v.call(this,f,m,b,A),this.emit("finish",f,m,b,A)},this.computedOptions.set(A,h),this.animations.set(f,A),C.push(h.delay)}this.mainAnimation=this.mainElement.animate([{opacity:"0"},{opacity:"1"}],{duration:this.totalDuration,easing:"linear"}),this.minDelay=Math.min(...C),this.setSpeed(l),$?this.play():this.pause(),this.promise=this.newPromise(),this.mainAnimation.onfinish=()=>{this.emit("complete",this),this.stopLoop()}}catch(e){this.emit("error",e)}}newPromise(){return new Promise((t,e)=>{this.on("complete",()=>t([this])),this.on("error",i=>e(i))})}then(t,e){return t=t?.bind(this),e=e?.bind(this),this.promise.then(t,e),this}catch(t){return t=t?.bind(this),this.promise.catch(t),this}finally(t){return t=t?.bind(this),this.promise.finally(t),this}loop(){this.stopLoop(),this.emit("update",this.getProgress(),this),this.animationFrame=window.requestAnimationFrame(this.loop)}stopLoop(){window.cancelAnimationFrame(this.animationFrame)}all(t){return t(this.mainAnimation,this.mainElement),this.animations.forEach(t),this}beginEvent(){if(this.getProgress()==0){let t=window.setTimeout(()=>{this.emit("begin",this),t=window.clearTimeout(t)},this.minDelay)}}play(){let t=this.getPlayState();return this.beginEvent(),this.all(e=>e.play()),this.emit("play",t,this),this.loop(),this}pause(){let t=this.getPlayState();return this.all(e=>e.pause()),this.emit("pause",t,this),this.stopLoop(),this.animationFrame=void 0,this}reset(){return this.setProgress(0),this.beginEvent(),this.options.autoplay?this.play():this.pause(),this}cancel(){return this.all(t=>t.cancel()),this.stopLoop(),this}finish(){return this.all(t=>t.finish()),this.stopLoop(),this}stop(){for(this.cancel(),this.animations.clear();this.targets.length;)this.targets.pop();this.mainElement=void 0,this.emit("stop")}getTargets(){return this.targets}getAnimation(t){return this.animations.get(t)}getTiming(t){let e=t instanceof Animation?t:this.getAnimation(t),i=this.computedOptions.get(e)??{},n=e.effect?.getTiming()??{},s=this.getOptions();return{...V,...s,...n,...i}}getTotalDuration(){return this.totalDuration}getCurrentTime(){return this.mainAnimation.currentTime}getProgress(){return this.getCurrentTime()/this.totalDuration*100}getSpeed(){return this.mainAnimation.playbackRate}getPlayState(){return this.mainAnimation.playState}getOptions(){return this.options}setCurrentTime(t){return this.all(e=>{e.currentTime=t}),this.emit("update",this.getProgress()),this}setProgress(t){let e=t/100*this.totalDuration;return this.setCurrentTime(e),this}setSpeed(t=1){return this.all(e=>{e.playbackRate=t}),this}on(t,e,i){return this.emitter.on(t,e,i??this),this}off(t,e,i){return this.emitter.off(t,e,i??this),this}emit(t,...e){return this.emitter.emit(t,...e),this}toJSON(){return this.getOptions()}get[Symbol.toStringTag](){return"Animate"}},At=(r={})=>new M(r),mt=class extends M{constructor(t={}){super();this.animations=new g;try{let{options:e,...i}=t,n=e instanceof M?e.getOptions():Array.isArray(e)?e?.[0]?.getOptions():e;this.options=Object.assign({},V,n,i),this.loop=this.loop.bind(this);let{loop:s,delay:a,speed:l,easing:o,endDelay:p,duration:d,direction:P,fillMode:T,onfinish:v,target:G,keyframes:q,autoplay:$,extend:B,...Y}=this.options;this.mainElement=document.createElement("div"),this.targets=U(G),this.properties=Y;let C=[],b=this.targets.length,I;for(let m=0;m<b;m++){let f=this.targets[m],h={easing:typeof o=="string"?Z(o):o,iterations:s===!0?Infinity:s,direction:P,endDelay:p,duration:d,delay:a,fill:T,...B},L=j(q,[m,b,f],this);I=L.length?L:this.properties,h=_(h,[m,b,f],this),L.length>0||(I=_(I,[m,b,f],this));let H=h.delay+h.duration*h.iterations+h.endDelay;this.totalDuration<H&&(this.totalDuration=H);let A=f.animate(I,h);A.onfinish=()=>{typeof v=="function"&&v.call(this,f,m,b,A),this.emit("finish",f,m,b,A)},this.computedOptions.set(A,h),this.animations.set(f,A),C.push(h.delay)}this.mainAnimation=this.mainElement.animate([{opacity:"0"},{opacity:"1"}],{duration:this.totalDuration,easing:"linear"}),this.minDelay=Math.min(...C),this.setSpeed(l),$?this.play():this.pause(),this.promise=this.newPromise(),this.mainAnimation.onfinish=()=>{this.emit("complete",this),this.stopLoop()}}catch(e){this.emit("error",e)}}add(t){return this}};0&&(module.exports={AdvancedManager,Animate,App,CONFIG_DEFAULTS,DefaultAnimationOptions,Event,EventEmitter,HistoryManager,Manager,ManagerItem,PARSER,PJAX,Page,PageManager,Router,Service,ServiceManager,Timeline,TransitionManager,animate,asyncMethodCall,changeState,clean,computeValue,easings,equal,getConfig,getEase,getElements,getHash,getHashedPath,getTargets,hashAction,mapObject,methodCall,newConfig,newCoords,newListener,newState,newURL,toAttr});
//# sourceMappingURL=api.cjs.js.map
