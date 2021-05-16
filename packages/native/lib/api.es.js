var Oe={wrapperAttr:"wrapper",noAjaxLinkAttr:"no-ajax-link",noPrefetchAttr:"no-prefetch",headers:[["x-partial","true"]],preventSelfAttr:'prevent="self"',preventAllAttr:'prevent="all"',transitionAttr:"transition",blockAttr:"block",timeout:3e4,maxPages:5,resizeDelay:100},ye=r=>Object.assign({...Oe},r),Me=(r,e,t=!0)=>{let{prefix:i}=r,n=`data${i?"-"+i:""}-${e}`;return t?`[${n}]`:n},m=(r,e,t=!0)=>{if(typeof e!="string")return r;let i=r[e];return typeof i=="string"?Me(r,i,t):i};var y=class{constructor(e){this.map=new Map(e)}getMap(){return this.map}get(e){return this.map.get(e)}keys(){return Array.from(this.map.keys())}values(){return Array.from(this.map.values())}set(e,t){return this.map.set(e,t),this}add(e){let i=this.size;return this.set(i,e),this}get size(){return this.map.size}get length(){return this.map.size}last(e=1){let t=this.keys()[this.size-e];return this.get(t)}delete(e){return this.map.delete(e)}remove(e){return this.map.delete(e),this}clear(){return this.map.clear(),this}has(e){return this.map.has(e)}entries(){return this.map.entries()}forEach(e,t){return this.map.forEach(e,t),this}[Symbol.iterator](){return this.entries()}},_=(r,e,...t)=>{r.forEach(i=>{i[e](...t)})},We=async(r,e,...t)=>{for(let[,i]of r)await i[e](...t)};var j=class{constructor(){}install(){}register(e,t){return this.manager=e,this.app=e.app,this.config=e.config,this.emitter=e.emitter,this.key=t,this.install(),this}uninstall(){}unregister(){this.uninstall(),this.manager.remove(this.key),this.key=void 0,this.manager=void 0,this.app=void 0,this.config=void 0,this.emitter=void 0}},G=class extends y{constructor(e){super();this.app=e,this.config=e.config,this.emitter=e.emitter}set(e,t){return super.set(e,t),t.register(this,e),this}};var h=(r=window.location.href)=>r instanceof URL?r:new URL(r,window.location.origin),L=r=>{let e=h(r);return`${e.pathname}${e.hash}`},nt=r=>h(r).hash.slice(1),fe=r=>h(r).toString().replace(/(\/#.*|\/|#.*)$/,""),Z=(r,e)=>fe(r)===fe(e);var A=class extends j{init(){}boot(){this.initEvents()}initEvents(){}stopEvents(){}stop(){this.stopEvents(),this.unregister()}},ne=class extends G{constructor(e){super(e)}init(){return _(this,"init"),this}boot(){return _(this,"boot"),this}stop(){return _(this,"stop"),this}};var R=(r=window.scrollX,e=window.scrollY)=>({x:r,y:e}),B=(r={url:L(h()),index:0,transition:"default",data:{scroll:R(),trigger:"HistoryManager"}})=>r,Re=class extends A{constructor(){super(...arguments);this.pointer=-1}init(){this.states=[];let e=B();this.add(e,"replace")}get(e){return this.states[e]}add(e,t="push"){let i=B(e),n=this.length;this.states.push({...i}),this.pointer=n;let a={index:this.pointer,states:[...this.states]};return Ve(t,i,a),this}remove(e){return e?this.states.splice(e,1):this.states.pop(),this.pointer--,this}replace(e){return this.states=e,this}set(e,t){return this.states[e]=t}get current(){return this.get(this.pointer)}get last(){return this.get(this.length-1)}get previous(){return this.pointer<1?null:this.get(this.pointer-1)}get length(){return this.states.length}},Ve=(r,e,t)=>{let i=L(e.url),n=[t,"",i];if(window.history)switch(r){case"push":window.history.pushState.apply(window.history,n);break;case"replace":window.history.replaceState.apply(window.history,n);break}};var Ke=new DOMParser,ae=class extends j{constructor(e=h(),t=document){super();this.url=e,typeof t=="string"?this.data=t:this.dom=t||document}build(){if(this.dom instanceof Node||(this.dom=Ke.parseFromString(this.data,"text/html")),!(this.body instanceof Node)){let{title:e,head:t,body:i}=this.dom;this.title=e,this.head=t,this.body=i,this.wrapper=this.body.querySelector(this.wrapperAttr)}}install(){this.wrapperAttr=m(this.config,"wrapperAttr")}uninstall(){this.url=void 0,this.title=void 0,this.head=void 0,this.body=void 0,this.dom=void 0,this.wrapper=void 0,this.data=void 0,this.wrapperAttr=void 0}},He=class extends A{constructor(){super(...arguments);this.loading=new y}install(){this.pages=new G(this.app);let e=h().pathname;this.set(e,new ae),e=void 0}get(e){return this.pages.get(e)}add(e){return this.pages.add(e),this}set(e,t){return this.pages.set(e,t),this}remove(e){return this.pages.remove(e),this}has(e){return this.pages.has(e)}clear(){return this.pages.clear(),this}get size(){return this.pages.size}keys(){return this.pages.keys()}async load(e=h()){let t=h(e),i=t.pathname,n,a;if(this.has(i))return n=this.get(i),Promise.resolve(n);this.loading.has(i)?a=this.loading.get(i):(a=this.request(i),this.loading.set(i,a));let s=await a;if(this.loading.remove(i),n=new ae(t,s),this.set(i,n),this.size>m(this.config,"maxPages")){let l=h(),o=this.keys(),p=Z(l,o[0])?o[1]:o[0],c=this.get(p);c.unregister(),c=void 0,o=void 0,l=void 0,p=void 0}return n}async request(e){let t=new Headers(m(this.config,"headers")),i=window.setTimeout(()=>{throw window.clearTimeout(i),"Request Timed Out!"},m(this.config,"timeout"));try{let n=await fetch(e,{mode:"same-origin",method:"GET",headers:t,cache:"default",credentials:"same-origin"});if(window.clearTimeout(i),n.status>=200&&n.status<300)return await n.text();throw new Error(n.statusText||""+n.status)}catch(n){throw window.clearTimeout(i),n}}};var se=(r,e=window.location.hash)=>{try{let t=e[0]=="#"?e:h(e).hash;if(t.length>1){let i=document.getElementById(t.slice(1));if(i){let{left:n,top:a}=i.getBoundingClientRect(),s=window.scrollX,l=window.scrollY,o=n+s,p=a+l;return console.log(o,p),R(o,p)}}}catch(t){console.warn("[hashAction] error",t)}return r??R(0,0)},Ne={name:"default",scrollable:!0,out({done:r}){r()},in({scroll:r,done:e}){window.scroll(r.x,r.y),e()}},De=class extends A{constructor(e){super();this._arg=e}install(){super.install();let e=this._arg&&this._arg.length?this._arg:m(this.config,"transitions")??[];e=[["default",Ne]].concat(e),this.transitions=new y(e)}get(e){return this.transitions.get(e)}set(e,t){return this.transitions.set(e,t),this}add(e){return this.transitions.add(e),this}has(e){return this.transitions.has(e)}async animate(e,t){let i=this.transitions.get(e),n=t.scroll,a=t.ignoreHashAction;if(!("wrapper"in t.oldPage)||!("wrapper"in t.newPage))throw`[Page] either oldPage or newPage aren't instances of the Page Class.
 ${{newPage:t.newPage,oldPage:t.oldPage}}`;document.title=""+t.newPage.title;let s=t.oldPage.wrapper,l=t.newPage.wrapper;if(!(s instanceof Node)||!(l instanceof Node))throw`[Wrapper] the wrapper from the ${l instanceof Node?"current":"next"} page cannot be found. The wrapper must be an element that has the attribute ${m(this.config,"wrapperAttr")}.`;return i.init&&i?.init(t),this.emitter.emit("BEFORE_TRANSITION_OUT"),i.out&&await new Promise(o=>{i.out.call(i,{...t,from:t.oldPage,trigger:t.trigger,done:o})?.then(o)}),this.emitter.emit("AFTER_TRANSITION_OUT"),await new Promise(o=>{s.insertAdjacentElement("beforebegin",l),this.emitter.emit("CONTENT_INSERT"),!a&&!/back|popstate|forward/.test(t.trigger)&&(n=se(n)),o()}),await new Promise(o=>{s.remove(),s=void 0,l=void 0,this.emitter.emit("CONTENT_REPLACED"),o()}),this.emitter.emit("BEFORE_TRANSITION_IN"),i.in&&await new Promise(async o=>{i.in.call(i,{...t,from:t.oldPage,to:t.newPage,trigger:t.trigger,scroll:n,done:o})?.then(o)}),this.emitter.emit("AFTER_TRANSITION_IN"),i}};var be=({callback:r=()=>{},scope:e=null,name:t="event"})=>({callback:r,scope:e,name:t}),X=class extends y{constructor(e="event"){super();this.name=e}},Y=class extends y{constructor(){super()}getEvent(e){let t=this.get(e);return t instanceof X?t:(this.set(e,new X(e)),this.get(e))}newListener(e,t,i){let n=this.getEvent(e);return n.add(be({name:e,callback:t,scope:i})),n}on(e,t,i){if(typeof e=="undefined")return this;typeof e=="string"&&(e=e.trim().split(/\s/g));let n,a,s=typeof e=="object"&&!Array.isArray(e),l=s?t:i;return s||(a=t),Object.keys(e).forEach(o=>{n=s?o:e[o],s&&(a=e[o]),this.newListener(n,a,l)},this),this}removeListener(e,t,i){let n=this.get(e);if(n instanceof X&&t){let a=be({name:e,callback:t,scope:i});n.forEach((s,l)=>{if(s.callback===a.callback&&s.scope===a.scope)return n.remove(l)})}return n}off(e,t,i){if(typeof e=="undefined")return this;typeof e=="string"&&(e=e.trim().split(/\s/g));let n,a,s=typeof e=="object"&&!Array.isArray(e),l=s?t:i;return s||(a=t),Object.keys(e).forEach(o=>{n=s?o:e[o],s&&(a=e[o]),typeof a=="function"?this.removeListener(n,a,l):this.remove(n)},this),this}once(e,t,i){if(typeof e=="undefined")return this;typeof e=="string"&&(e=e.trim().split(/\s/g));let n=typeof e=="object"&&!Array.isArray(e);return Object.keys(e).forEach(a=>{let s=n?a:e[a],l=n?e[a]:t,o=n?t:i,p=(...c)=>{l.apply(o,c),this.removeListener(s,p,o)};this.newListener(s,p,o)},this),this}emit(e,...t){return typeof e=="undefined"?this:(typeof e=="string"&&(e=e.trim().split(/\s/g)),e.forEach(i=>{let n=this.get(i);n instanceof X&&n.forEach(a=>{let{callback:s,scope:l}=a;s.apply(l,t)})},this),this)}clear(){return _(this,"clear"),super.clear(),this}};var _e=class{constructor(e={}){this.canResize=!0;this.canScroll=!0;this._resize=this._resize.bind(this),this._scroll=this._scroll.bind(this),this._ready=this._ready.bind(this),this.register(e)}register(e={}){return this.config=ye(e),this.emitter=new Y,this.services=new ne(this),document.addEventListener("DOMContentLoaded",this._ready),window.addEventListener("load",this._ready),window.addEventListener("resize",this._resize,{passive:!0}),window.addEventListener("scroll",this._scroll,{passive:!0}),this}_ready(){document.removeEventListener("DOMContentLoaded",this._ready),window.removeEventListener("load",this._ready),this.emitter.emit("READY ready")}_resize(){if(this.canResize){let e,t;this.canResize=!1,t=window.requestAnimationFrame(()=>{this.emitter.emit("RESIZE resize"),e=window.setTimeout(()=>{this.canResize=!0,e=window.clearTimeout(e),t=window.cancelAnimationFrame(t)},m(this.config,"resizeDelay"))})}}_scroll(){if(this.canScroll){let e;this.canScroll=!1,e=requestAnimationFrame(()=>{this.emitter.emit("SCROLL scroll"),this.canScroll=!0,e=window.cancelAnimationFrame(e)})}}get(e){return this.services.get(e)}set(e,t){return this.services.set(e,t),this}add(e){return this.services.add(e),this}boot(){return this.services.init(),this.services.boot(),this}stop(){return this.services.stop(),this.emitter.clear(),this}on(e,t){return this.emitter.on(e,t,this),this}off(e,t){return this.emitter.off(e,t,this),this}emit(e,...t){return this.emitter.emit(e,...t),this}};var Fe=class extends A{install(){super.install(),this.ignoreURLs=m(this.config,"ignoreURLs")??[],this.prefetchIgnore=m(this.config,"prefetchIgnore")??!1,this.stopOnTransitioning=m(this.config,"stopOnTransitioning")??!1,this.stickyScroll=m(this.config,"stickyScroll")??!1,this.forceOnError=m(this.config,"forceOnError")??!1,this.ignoreHashAction=m(this.config,"ignoreHashAction")??!1}transitionStart(){this.isTransitioning=!0}transitionStop(){this.isTransitioning=!1}init(){this.onHover=this.onHover.bind(this),this.onClick=this.onClick.bind(this),this.onStateChange=this.onStateChange.bind(this)}boot(){"scrollRestoration"in window.history&&(window.history.scrollRestoration="manual"),super.boot()}getTransitionName(e){if(!e||!e.getAttribute)return null;let t=e.getAttribute(m(this.config,"transitionAttr",!1));return typeof t=="string"?t:null}validLink(e,t,i){let n=!window.history.pushState,a=!e||!i,s=t.metaKey||t.ctrlKey||t.shiftKey||t.altKey,l=e.hasAttribute("target")&&e.target==="_blank",o=e.protocol!==location.protocol||e.hostname!==location.hostname,p=typeof e.getAttribute("download")=="string",c=e.matches(m(this.config,"preventSelfAttr")),b=Boolean(e.closest(m(this.config,"preventAllAttr"))),f=L(h())===L(h(i));return!(a||n||s||l||o||p||c||b||f)}getHref(e){return e&&e.tagName&&e.tagName.toLowerCase()==="a"&&typeof e.href=="string"?e.href:null}getLink(e){let t=e.target,i=this.getHref(t);for(;t&&!i;)t=t.parentNode,i=this.getHref(t);if(!(!t||!this.validLink(t,e,i)))return t}onClick(e){let t=this.getLink(e);if(!t)return;if(this.isTransitioning&&this.stopOnTransitioning){e.preventDefault(),e.stopPropagation();return}let i=this.getHref(t);this.emitter.emit("ANCHOR_CLICK CLICK",e),this.go({href:i,trigger:t,event:e})}getDirection(e){return Math.abs(e)>1?e>0?"forward":"back":e===0?"popstate":e>0?"back":"forward"}force(e){window.location.assign(e)}go({href:e,trigger:t="HistoryManager",event:i}){if(this.isTransitioning&&this.stopOnTransitioning||!(this.manager.has("TransitionManager")&&this.manager.has("HistoryManager")&&this.manager.has("PageManager"))){this.force(e);return}let n=this.manager.get("HistoryManager"),a=R(0,0),s=n.current,l=s.url;if(Z(l,e))return;let o;if(i&&i.state){this.emitter.emit("POPSTATE",i);let{state:p}=i,{index:c}=p,f=s.index-c;n.replace(p.states),n.pointer=c;let d=n.get(c);o=d.transition,a=d.data.scroll,t=this.getDirection(f),console.log(t=="forward"&&n),this.emitter.emit(t==="back"?"POPSTATE_BACK":"POPSTATE_FORWARD",i)}else{o=this.getTransitionName(t),a=R();let p=B({url:e,transition:o,data:{scroll:a}});!this.stickyScroll&&(a=R(0,0)),n.add(p),this.emitter.emit("HISTORY_NEW_ITEM",i)}return i&&(i.stopPropagation(),i.preventDefault()),this.emitter.emit("GO",i),this.load({oldHref:l,href:e,trigger:t,transitionName:o,scroll:a})}async load({oldHref:e,href:t,trigger:i,transitionName:n="default",scroll:a={x:0,y:0}}){try{let s=this.manager.get("PageManager"),l,o;this.emitter.emit("NAVIGATION_START",{oldHref:e,href:t,trigger:i,transitionName:n});try{this.transitionStart(),o=await s.load(e),!(o.dom instanceof Element)&&o.build(),this.emitter.emit("PAGE_LOADING",{href:t,oldPage:o,trigger:i}),l=await s.load(t),await l.build(),this.emitter.emit("PAGE_LOAD_COMPLETE",{newPage:l,oldPage:o,trigger:i})}catch(p){console.warn(`[PJAX] Page load error: ${p}`)}try{let p=this.manager.get("TransitionManager");this.emitter.emit("TRANSITION_START",n);let c=await p.animate(p.has(n)?n:"default",{oldPage:o,newPage:l,trigger:i,scroll:a,ignoreHashAction:this.ignoreHashAction});c.scrollable||(!this.ignoreHashAction&&!/back|popstate|forward/.test(i)&&(a=se(a)),window.scroll(a.x,a.y)),this.emitter.emit("TRANSITION_END",{transition:c})}catch(p){console.warn(`[PJAX] Transition error: ${p}`)}this.emitter.emit("NAVIGATION_END",{oldPage:o,newPage:l,trigger:i,transitionName:n})}catch(s){this.forceOnError?this.force(t):console.warn(s)}finally{this.transitionStop()}}ignoredURL({pathname:e}){return this.ignoreURLs.length&&this.ignoreURLs.some(t=>typeof t=="string"?t===e:t.exec(e)!==null)}onHover(e){let t=this.getLink(e);if(!t||!this.manager.has("PageManager"))return;let i=this.manager.get("PageManager"),n=h(this.getHref(t)),a=n.pathname;if(!(this.ignoredURL(n)||i.has(a))){this.emitter.emit("ANCHOR_HOVER HOVER",e);try{i.load(n)}catch(s){console.warn("[PJAX] prefetch error,",s)}}}onStateChange(e){this.go({href:window.location.href,trigger:"popstate",event:e})}initEvents(){this.prefetchIgnore!==!0&&(document.addEventListener("mouseover",this.onHover),document.addEventListener("touchstart",this.onHover)),document.addEventListener("click",this.onClick),window.addEventListener("popstate",this.onStateChange)}stopEvents(){this.prefetchIgnore!==!0&&(document.removeEventListener("mouseover",this.onHover),document.removeEventListener("touchstart",this.onHover)),document.removeEventListener("click",this.onClick),window.removeEventListener("popstate",this.onStateChange)}};var ze=class extends A{constructor(e=[]){super();this.routes=new y;for(let t of e)this.add(t)}add({path:e,method:t}){let i=this.parse(e);return this.routes.set(i,t),this}parsePath(e){if(typeof e=="string")return new RegExp(e,"i");if(e instanceof RegExp||typeof e=="boolean")return e;throw"[Router] only regular expressions, strings and booleans are accepted as paths."}isPath(e){return typeof e=="string"||e instanceof RegExp||typeof e=="boolean"}parse(e){let t=e,i={from:/(.*)/g,to:/(.*)/g};if(this.isPath(e))i={from:!0,to:e};else if(this.isPath(t.from)&&this.isPath(t.to))i=t;else throw"[Router] path is neither a string, regular expression, or a { from, to } object.";let{from:n,to:a}=i;return{from:this.parsePath(n),to:this.parsePath(a)}}route(){if(this.manager.has("HistoryManager")){let e=this.manager.get("HistoryManager"),t=L(h((e.length>1?e.previous:e.current).url)),i=L(h());this.routes.forEach((n,a)=>{let s=a.from,l=a.to;if(typeof s=="boolean"&&typeof l=="boolean")throw`[Router] path ({ from: ${s}, to: ${l} }) is not valid, remember paths can only be strings, regular expressions, or a boolean; however, both the from and to paths cannot be both booleans.`;let o=s,p=l;s instanceof RegExp&&s.test(t)&&(o=s.exec(t)),l instanceof RegExp&&l.test(i)&&(p=l.exec(i)),(Array.isArray(p)&&Array.isArray(o)||Array.isArray(p)&&typeof o=="boolean"&&o||Array.isArray(o)&&typeof p=="boolean"&&p)&&n({from:o,to:p,path:{from:t,to:i}})})}else console.warn("[Route] HistoryManager is missing.")}initEvents(){this.emitter.on("READY",this.route,this),this.emitter.on("CONTENT_REPLACED",this.route,this)}stopEvents(){this.emitter.off("READY",this.route,this),this.emitter.off("CONTENT_REPLACED",this.route,this)}};var W=r=>typeof r=="string"?r.includes("%")?parseFloat(r)/100:r=="from"?0:r=="to"?1:parseFloat(r):r,de=r=>{let e=new Set,t=Object.keys(r),i=t.length;for(let n=0;n<i;n++){let a=""+t[n],s=r[a],l=a.split(","),o=l.length;for(let p=0;p<o;p++){let c=W(l[p]);e.add({...s,offset:c})}}return[...e].sort((n,a)=>n.offset-a.offset)},$t={};var Ue=r=>typeof r=="string"?Array.from(document.querySelectorAll(r)):[r],je=r=>[].concat(...r),oe=r=>Array.isArray(r)?je(r.map(oe)):typeof r=="string"||r instanceof Node?Ue(r):r instanceof NodeList||r instanceof HTMLCollection?Array.from(r):[],Se=(r,e,t)=>typeof r=="function"?r.apply(t,e):r,Te=(r,e,t)=>{let i,n,a={},s=Object.keys(r);for(let l=0,o=s.length;l<o;l++)i=s[l],n=r[i],a[i]=Se(n,e,t);return a},Ae={in:"ease-in",out:"ease-out","in-out":"ease-in-out","in-sine":"cubic-bezier(0.47, 0, 0.745, 0.715)","out-sine":"cubic-bezier(0.39, 0.575, 0.565, 1)","in-out-sine":"cubic-bezier(0.445, 0.05, 0.55, 0.95)","in-quad":"cubic-bezier(0.55, 0.085, 0.68, 0.53)","out-quad":"cubic-bezier(0.25, 0.46, 0.45, 0.94)","in-out-quad":"cubic-bezier(0.455, 0.03, 0.515, 0.955)","in-cubic":"cubic-bezier(0.55, 0.055, 0.675, 0.19)","out-cubic":"cubic-bezier(0.215, 0.61, 0.355, 1)","in-out-cubic":"cubic-bezier(0.645, 0.045, 0.355, 1)","in-quart":"cubic-bezier(0.895, 0.03, 0.685, 0.22)","out-quart":"cubic-bezier(0.165, 0.84, 0.44, 1)","in-out-quart":"cubic-bezier(0.77, 0, 0.175, 1)","in-quint":"cubic-bezier(0.755, 0.05, 0.855, 0.06)","out-quint":"cubic-bezier(0.23, 1, 0.32, 1)","in-out-quint":"cubic-bezier(0.86, 0, 0.07, 1)","in-expo":"cubic-bezier(0.95, 0.05, 0.795, 0.035)","out-expo":"cubic-bezier(0.19, 1, 0.22, 1)","in-out-expo":"cubic-bezier(1, 0, 0, 1)","in-circ":"cubic-bezier(0.6, 0.04, 0.98, 0.335)","out-circ":"cubic-bezier(0.075, 0.82, 0.165, 1)","in-out-circ":"cubic-bezier(0.785, 0.135, 0.15, 0.86)","in-back":"cubic-bezier(0.6, -0.28, 0.735, 0.045)","out-back":"cubic-bezier(0.175, 0.885, 0.32, 1.275)","in-out-back":"cubic-bezier(0.68, -0.55, 0.265, 1.55)"},Ge=Object.keys(Ae),Ce=r=>{let e=r.replace(/^ease-/,"");return Ge.includes(e)?Ae[e]:r},Ee={keyframes:[],offset:[],loop:1,delay:0,speed:1,endDelay:0,easing:"ease",timelineOffset:0,autoplay:!0,duration:1e3,fillMode:"none",direction:"normal",padEndDelay:!1,extend:{}},Xe=r=>{let{options:e,...t}=r,i=e instanceof le?e.getOptions():Array.isArray(e)?e?.[0]?.getOptions():e;return Object.assign({},i,t)},pe=(r="")=>e=>typeof e=="string"?e:`${e}${r}`,J=pe(),ce=pe("px"),ue=pe("deg"),me=r=>Array.isArray(r)||typeof r=="string"?(typeof r=="string"&&(r=r.split(",")),r):[r],H=r=>Array.isArray(r)||typeof r=="string"?Boolean(r.length):r!=null&&r!=null,Q=r=>e=>H(e)?me(e).map(t=>{if(typeof t!="number"&&typeof t!="string")return t;let i=Number(t),n=Number.isNaN(i)?typeof t=="string"?t.trim():t:i;return r(n)}):[],Ye=(...r)=>{let e=0;r=r.map(n=>{let a=me(n),s=a.length;return s>e&&(e=s),a});let t=[],i=r.length;for(let n=0;n<e;n++){t[n]=[];for(let a=0;a<i;a++){let s=r[a][n];H(s)&&(t[n][a]=s)}}return t},N=(r,e)=>me(r).map(Q(e)),Pe=["translate","translate3d","translateX","translateY","translateZ","rotate","rotate3d","rotateX","rotateY","rotateZ","scale","scale3d","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective"],Ie=r=>{let e="",t=Pe.length;for(let i=0;i<t;i++){let n=Pe[i],a=r[i];H(a)&&(e+=`${n}(${Array.isArray(a)?a.join(", "):a}) `)}return e.trim()},O=Q(J),E=Q(ce),T=Q(ue),we=r=>{for(let[e,t]of Object.entries(r))r[e]=[].concat(t).map(i=>""+i);return r},qe=r=>{let{perspective:e,rotate:t,rotate3d:i,rotateX:n,rotateY:a,rotateZ:s,translate:l,translate3d:o,translateX:p,translateY:c,translateZ:b,scale:f,scale3d:d,scaleX:P,scaleY:I,scaleZ:w,skew:x,skewX:k,skewY:C,...v}=r;l=N(l,ce),o=N(o,ce),p=E(p),c=E(c),b=E(b),t=N(t,ue),i=N(i,J),n=T(n),a=T(a),s=T(s),f=N(f,J),d=N(d,J),P=O(P),I=O(I),w=O(w),x=N(x,ue),k=T(k),C=T(C),e=E(e);let V=Ye(l,o,p,c,b,t,i,n,a,s,f,d,P,I,w,x,k,C,e).map(Ie);return v=we(v),Object.assign({},H(V)?{transform:V}:null,v)},$e=r=>r.map(e=>{let{translate:t,translate3d:i,translateX:n,translateY:a,translateZ:s,rotate:l,rotate3d:o,rotateX:p,rotateY:c,rotateZ:b,scale:f,scale3d:d,scaleX:P,scaleY:I,scaleZ:w,skew:x,skewX:k,skewY:C,perspective:v,...V}=e;return t=E(t),i=E(i),n=E(n)[0],a=E(a)[0],s=E(s)[0],l=T(l),o=O(o),p=T(p)[0],c=T(c)[0],b=T(b)[0],f=O(f),d=O(d),P=O(P)[0],I=O(I)[0],w=O(w)[0],x=T(x),k=T(k)[0],C=T(C)[0],v=E(v)[0],[V,t,i,n,a,s,l,o,p,c,b,f,d,P,I,w,x,k,C,v]}).map(([e,...t])=>{let i=Ie(t);return e=we(e),Object.assign({},H(i)?{transform:i}:null,e)}),le=class{constructor(e){this.options={};this.targets=new y;this.properties={};this.animations=new y;this.keyframeEffects=new y;this.totalDuration=0;this.minDelay=0;this.maxSpeed=0;this.computedOptions=new y;this.computedKeyframes=new y;this.emitter=new Y;this.loop=this.loop.bind(this),this.updateOptions(e)}newPromise(){return this.promise=new Promise((e,t)=>{this?.emitter?.once?.("finish",()=>e([this])),this?.emitter?.once?.("error",i=>t(i))}),this.promise}then(e,t){return e=e?.bind(this),t=t?.bind(this),this?.promise?.then?.(e,t),this}catch(e){return e=e?.bind(this),this.promise?.catch?.(e),this}finally(e){return e=e?.bind(this),this.promise?.finally?.(e),this}loop(){this.stopLoop(),this.emit("update",this.getProgress(),this),this.animationFrame=window.requestAnimationFrame(this.loop)}stopLoop(){window.cancelAnimationFrame(this.animationFrame)}allAnimations(e){return this.animations.forEach(e),this}all(e){return this.mainAnimation&&e(this.mainAnimation,this.mainElement),this.allAnimations(e),this}beginEvent(){this.getProgress()==0&&this.emit("begin",this)}play(){let e=this.getPlayState();return this.beginEvent(),this.all(t=>t.play()),this.emit("play",e,this),this.is(e)||this.emit("playstate-change",e,this),this.loop(),this}pause(){let e=this.getPlayState();return this.all(t=>t.pause()),this.emit("pause",e,this),this.is(e)||this.emit("playstate-change",e,this),this.stopLoop(),this.animationFrame=void 0,this}reverse(){return this.all(e=>e.reverse()),this}reset(){return this.setProgress(0),this.options.autoplay?this.play():this.pause(),this}cancel(){return this.all(e=>e.cancel()),this}finish(){return this.all(e=>e.finish()),this}stop(){this.cancel(),this.computedOptions.clear(),this.animations.clear(),this.keyframeEffects.clear(),this.targets.clear(),this.mainkeyframeEffect=void 0,this.mainAnimation=void 0,this.mainElement=void 0,this.emit("stop"),this.emitter.clear(),this.promise=void 0,this.computedOptions=void 0,this.animations=void 0,this.keyframeEffects=void 0,this.emitter=void 0,this.targets=void 0,this.options=void 0}getTargets(){return this.targets.values()}getAnimation(e){return this.animations.get(e)}getKeyframeEffect(e){return this.keyframeEffects.get(e)}getTiming(e){let t=e instanceof Animation?e:this.getAnimation(e),i=this.computedOptions.get(t)??{},n=this.getKeyframeEffect(t).getTiming?.()??{},a=this.getOptions();return{...Ee,...a,...n,...i}}getTotalDuration(){return this.totalDuration}getCurrentTime(){return this.mainAnimation.currentTime}getProgress(){return this.getCurrentTime()/this.totalDuration*100}getSpeed(){return this.mainAnimation.playbackRate}getPlayState(){return this.mainAnimation.playState}getOptions(){return this.options}getComputedOption(e){let t=e instanceof Animation?e:this.getAnimation(e);return this.computedOptions.get(t)}is(e){return this.getPlayState()==e}setCurrentTime(e){return this.all(t=>{t.currentTime=e}),this.emit("update",this.getProgress()),this}setProgress(e){let t=e/100*this.totalDuration;return this.setCurrentTime(t),this}setSpeed(e=1){return this.maxSpeed=e,this.all(t=>{t.updatePlaybackRate?t.updatePlaybackRate(e):t.playbackRate=e}),this}updateOptions(e={}){try{this.options=Object.assign({},Ee,this.options,Xe(e));let{loop:t,delay:i,speed:n,easing:a,timelineOffset:s,endDelay:l,duration:o,direction:p,fillMode:c,onfinish:b,oncancel:f,keyframes:d,autoplay:P,target:I,targets:w,padEndDelay:x,extend:k,...C}=this.options,v=new Set([...this.getTargets(),...oe(w),...oe(I)]);this.targets=new y,this.properties=C,v.forEach(u=>this.targets.add(u));let V=[],he=[],F=this.targets.size,ge=[],xe=this.totalDuration,ke={easing:typeof a=="string"?Ce(a):a,iterations:t===!0?Infinity:t,direction:p,endDelay:l,duration:o,speed:n,delay:i,timelineOffset:s,fill:c,...k};if(this.targets.forEach((u,M)=>{let ee=Te(ke,[M,F,u],this),{timelineOffset:te,...g}=ee;g.delay+=te,g.tempDurations=+g.delay+ +g.duration*+g.iterations+ +g.endDelay,this.totalDuration<+g.tempDurations&&(this.totalDuration=+g.tempDurations),ge[M]=g,V.push(g.delay),he.push(g.speed)}),this.targets.forEach((u,M)=>{let{speed:ee,tempDurations:te,...g}=ge[M],q,K;x&&g.endDelay==0&&Math.abs(+g.iterations)!=Math.abs(Infinity)&&(g.endDelay=this.totalDuration-te);let z=Se(d,[M,F,u],this);if(typeof z=="object"&&(z=de(z)),q=H(z)?z:C,Array.isArray(q))K=q.map(ie=>{let{speed:$,loop:U,easing:re,offset:ve,...Le}=ie;return{easing:typeof re=="string"?Ce(re):re,iterations:U===!0?Infinity:U,offset:W(ve),...Le}}),K=$e(K);else{let{offset:ie,...$}=Te(q,[M,F,u],this),U=ie;$=qe($),K=Object.assign({},H(U)?{offset:U.map(W)}:null,$)}let S,D;this.animations.has(u)?(S=this.getAnimation(u),D=this.getKeyframeEffect(S),D?.setKeyframes?.(K),D?.updateTiming?.(g)):(D=new KeyframeEffect(u,K,g),S=new Animation(D,g.timeline),this.animations.set(u,S),this.keyframeEffects.set(S,D)),S.playbackRate=ee,S.onfinish=()=>{typeof b=="function"&&b.call(this,u,M,F,S)},S.oncancel=()=>{typeof f=="function"&&f.call(this,u,M,F,S)},this.computedOptions.set(S,g),this.computedKeyframes.set(S,K)}),this.mainAnimation?xe!==this.totalDuration&&(this.mainkeyframeEffect?.updateTiming?.({duration:this.totalDuration}),(!this.mainkeyframeEffect.setKeyframes||!this.mainkeyframeEffect.updateTiming)&&console.error("@okikio/animate - `KeyframeEffect.setKeyframes` and/or `KeyframeEffect.updateTiming` are not supported in this browser.")):(this.mainkeyframeEffect=new KeyframeEffect(this.mainElement,[{opacity:"0"},{opacity:"1"}],{duration:this.totalDuration,easing:"linear"}),this.mainAnimation=new Animation(this.mainkeyframeEffect,this.options.timeline),this.mainAnimation.onfinish=()=>{let u=this.getPlayState();this.emit("finish",u,this),this.is(u)||this.emit("playstate-change",u,this),this.stopLoop()},this.mainAnimation.oncancel=()=>{let u=this.getPlayState();this.emit("cancel",u,this),this.is(u)||this.emit("playstate-change",u,this),this.stopLoop()}),this.minDelay=Math.min(...V),this.maxSpeed=Math.min(...he),this.mainAnimation.playbackRate=this.maxSpeed,P){let u=window.setTimeout(()=>{this.emit("begin",this),u=window.clearTimeout(u)},0);this.play()}else this.pause();this.newPromise()}catch(t){this.emit("error",t)}}on(e,t,i){return this?.emitter?.on(e,t,i??this),this}off(e,t,i){return this?.emitter?.off(e,t,i??this),this}emit(e,...t){return this?.emitter?.emit(e,...t),this}toJSON(){return this.getOptions()}get[Symbol.toStringTag](){return"Animate"}},ii=(r={})=>new le(r);export{G as AdvancedManager,le as Animate,_e as App,Oe as CONFIG_DEFAULTS,N as CSSArrValue,we as CSSPropertiesToArr,Q as CSSValue,Ee as DefaultAnimationOptions,Ae as EASINGS,$t as EFFECTS,Ge as EasingKeys,X as Event,Y as EventEmitter,Ce as GetEase,Re as HistoryManager,de as KeyframeParse,y as Manager,j as ManagerItem,Ke as PARSER,Fe as PJAX,ae as Page,He as PageManager,$e as ParseTransformableCSSKeyframes,qe as ParseTransformableCSSProperties,ze as Router,A as Service,ne as ServiceManager,Pe as TransformFunctionNames,De as TransitionManager,ue as UnitDEG,T as UnitDEGCSSValue,J as UnitLess,O as UnitLessCSSValue,ce as UnitPX,E as UnitPXCSSValue,pe as addCSSUnit,ii as animate,We as asyncMethodCall,Ve as changeState,fe as clean,Se as computeOption,Ie as createTransformProperty,Z as equal,je as flatten,m as getConfig,Ue as getElements,nt as getHash,L as getHashedPath,oe as getTargets,se as hashAction,H as isValid,Te as mapAnimationOptions,_ as methodCall,ye as newConfig,R as newCoords,be as newListener,B as newState,h as newURL,W as parseOffset,Xe as parseOptions,me as toArr,Me as toAttr,Ye as transpose};
