var Q=Object.defineProperty;var R=Object.prototype.hasOwnProperty;var A=Object.getOwnPropertySymbols,O=Object.prototype.propertyIsEnumerable;var C=(i,t,e)=>t in i?Q(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e,u=(i,t)=>{for(var e in t||(t={}))R.call(t,e)&&C(i,e,t[e]);if(A)for(var e of A(t))O.call(t,e)&&C(i,e,t[e]);return i};var S=(i,t)=>{var e={};for(var r in i)R.call(i,r)&&t.indexOf(r)<0&&(e[r]=i[r]);if(i!=null&&A)for(var r of A(i))t.indexOf(r)<0&&O.call(i,r)&&(e[r]=i[r]);return e};var p=class{constructor(t){this.map=new Map(t)}getMap(){return this.map}get(t){return this.map.get(t)}keys(){return Array.from(this.map.keys())}values(){return Array.from(this.map.values())}set(t,e){return this.map.set(t,e),this}add(t){let r=this.size;return this.set(r,t),this}get size(){return this.map.size}get length(){return this.map.size}last(t=1){let e=this.keys()[this.size-t];return this.get(e)}delete(t){return this.map.delete(t)}remove(t){return this.map.delete(t),this}clear(){return this.map.clear(),this}has(t){return this.map.has(t)}entries(){return this.map.entries()}forEach(t,e){return this.map.forEach(t,e),this}[Symbol.iterator](){return this.entries()}},E=(i,t,...e)=>{i.forEach(r=>{r[t](...e)})};var wt=new DOMParser;var D=({callback:i=()=>{},scope:t=null,name:e="event"})=>({callback:i,scope:t,name:e}),d=class extends p{constructor(t="event"){super();this.name=t}},v=class extends p{constructor(){super()}getEvent(t){let e=this.get(t);return e instanceof d?e:(this.set(t,new d(t)),this.get(t))}newListener(t,e,r){let n=this.getEvent(t);return n.add(D({name:t,callback:e,scope:r})),n}on(t,e,r){if(typeof t=="undefined")return this;typeof t=="string"&&(t=t.trim().split(/\s/g));let n,s,a=typeof t=="object"&&!Array.isArray(t),o=a?e:r;return a||(s=e),Object.keys(t).forEach(l=>{a?(n=l,s=t[l]):n=t[l],this.newListener(n,s,o)},this),this}removeListener(t,e,r){let n=this.get(t);if(n instanceof d&&e){let s=D({name:t,callback:e,scope:r});n.forEach((a,o)=>{if(a.callback===s.callback&&a.scope===s.scope)return n.remove(o)})}return n}off(t,e,r){if(typeof t=="undefined")return this;typeof t=="string"&&(t=t.trim().split(/\s/g));let n,s,a=typeof t=="object"&&!Array.isArray(t),o=a?e:r;return a||(s=e),Object.keys(t).forEach(l=>{a?(n=l,s=t[l]):n=t[l],typeof s=="function"?this.removeListener(n,s,o):this.remove(n)},this),this}emit(t,...e){return typeof t=="undefined"?this:(typeof t=="string"&&(t=t.trim().split(/\s/g)),t.forEach(r=>{let n=this.get(r);n instanceof d&&n.forEach(s=>{let{callback:a,scope:o}=s;a.apply(o,e)})},this),this)}clear(){return E(this,"clear"),super.clear(),this}};var rt=i=>typeof i=="string"?Array.from(document.querySelectorAll(i)):[i],nt=i=>[].concat(...i),K=i=>Array.isArray(i)?nt(i.map(K)):typeof i=="string"||i instanceof Node?rt(i):i instanceof NodeList||i instanceof HTMLCollection?Array.from(i):[],_=(i,t,e)=>typeof i=="function"?i.apply(e,t):i,U=(i,t,e)=>{let r,n,s={},a=Object.keys(i);for(let o=0,l=a.length;o<l;o++)r=a[o],n=i[r],s[r]=_(n,t,e);return s},st={in:"ease-in",out:"ease-out","in-out":"ease-in-out","in-sine":"cubic-bezier(0.47, 0, 0.745, 0.715)","out-sine":"cubic-bezier(0.39, 0.575, 0.565, 1)","in-out-sine":"cubic-bezier(0.445, 0.05, 0.55, 0.95)","in-quad":"cubic-bezier(0.55, 0.085, 0.68, 0.53)","out-quad":"cubic-bezier(0.25, 0.46, 0.45, 0.94)","in-out-quad":"cubic-bezier(0.455, 0.03, 0.515, 0.955)","in-cubic":"cubic-bezier(0.55, 0.055, 0.675, 0.19)","out-cubic":"cubic-bezier(0.215, 0.61, 0.355, 1)","in-out-cubic":"cubic-bezier(0.645, 0.045, 0.355, 1)","in-quart":"cubic-bezier(0.895, 0.03, 0.685, 0.22)","out-quart":"cubic-bezier(0.165, 0.84, 0.44, 1)","in-out-quart":"cubic-bezier(0.77, 0, 0.175, 1)","in-quint":"cubic-bezier(0.755, 0.05, 0.855, 0.06)","out-quint":"cubic-bezier(0.23, 1, 0.32, 1)","in-out-quint":"cubic-bezier(0.86, 0, 0.07, 1)","in-expo":"cubic-bezier(0.95, 0.05, 0.795, 0.035)","out-expo":"cubic-bezier(0.19, 1, 0.22, 1)","in-out-expo":"cubic-bezier(1, 0, 0, 1)","in-circ":"cubic-bezier(0.6, 0.04, 0.98, 0.335)","out-circ":"cubic-bezier(0.075, 0.82, 0.165, 1)","in-out-circ":"cubic-bezier(0.785, 0.135, 0.15, 0.86)","in-back":"cubic-bezier(0.6, -0.28, 0.735, 0.045)","out-back":"cubic-bezier(0.175, 0.885, 0.32, 1.275)","in-out-back":"cubic-bezier(0.68, -0.55, 0.265, 1.55)"},at=i=>/^(in|out)/.test(i)?st[i]:i,z={keyframes:[],loop:1,delay:0,speed:1,endDelay:0,easing:"ease",autoplay:!0,duration:1e3,fillMode:"auto",direction:"normal",extend:{}},w=class{constructor(t={}){this.options={};this.targets=[];this.properties={};this.animations=new p;this.totalDuration=0;this.minDelay=0;this.computedOptions=new p;this.emitter=new v;var r;try{let e=t,{options:s}=e,a=S(e,["options"]),o=s instanceof w?s.getOptions():Array.isArray(s)?(r=s==null?void 0:s[0])==null?void 0:r.getOptions():s;this.options=Object.assign({},z,o,a),this.loop=this.loop.bind(this);let n=this.options,{loop:l,delay:q,speed:F,easing:T,endDelay:V,duration:G,direction:j,fillMode:$,onfinish:P,target:X,keyframes:B,autoplay:W,extend:Y}=n,J=S(n,["loop","delay","speed","easing","endDelay","duration","direction","fillMode","onfinish","target","keyframes","autoplay","extend"]);this.mainElement=document.createElement("div"),this.targets=K(X),this.properties=J;let M=[],f=this.targets.length,y;for(let h=0;h<f;h++){let m=this.targets[h],c=u({easing:typeof T=="string"?at(T):T,iterations:l===!0?Infinity:l,direction:j,endDelay:V,duration:G,delay:q,fill:$},Y),L=_(B,[h,f,m],this);y=L.length?L:this.properties,c=U(c,[h,f,m],this),L.length>0||(y=U(y,[h,f,m],this));let k=c.delay+c.duration*c.iterations+c.endDelay;this.totalDuration<k&&(this.totalDuration=k);let b=m.animate(y,c);b.onfinish=()=>{typeof P=="function"&&P.call(this,m,h,f,b),this.emit("finish",m,h,f,b)},this.computedOptions.set(b,c),this.animations.set(m,b),M.push(c.delay)}this.mainAnimation=this.mainElement.animate([{opacity:"0"},{opacity:"1"}],{duration:this.totalDuration,easing:"linear"}),this.minDelay=Math.min(...M),this.setSpeed(F),W?this.play():this.pause(),this.promise=this.newPromise(),this.mainAnimation.onfinish=()=>{this.emit("complete",this),this.stopLoop()}}catch(s){this.emit("error",s)}}newPromise(){return new Promise((t,e)=>{this.on("complete",()=>t([this])),this.on("error",r=>e(r))})}then(t,e){return t=t==null?void 0:t.bind(this),e=e==null?void 0:e.bind(this),this.promise.then(t,e),this}catch(t){return t=t==null?void 0:t.bind(this),this.promise.catch(t),this}finally(t){return t=t==null?void 0:t.bind(this),this.promise.finally(t),this}loop(){this.stopLoop(),this.emit("update",this.getProgress(),this),this.animationFrame=window.requestAnimationFrame(this.loop)}stopLoop(){window.cancelAnimationFrame(this.animationFrame)}all(t){return t(this.mainAnimation),this.animations.forEach(e=>t(e)),this}beginEvent(){if(this.getProgress()==0){let t=window.setTimeout(()=>{this.emit("begin",this),t=window.clearTimeout(t)},this.minDelay)}}play(){let t=this.getPlayState();return this.beginEvent(),this.all(e=>e.play()),this.emit("play",t,this),this.loop(),this}pause(){let t=this.getPlayState();return this.all(e=>e.pause()),this.emit("pause",t,this),this.stopLoop(),this.animationFrame=void 0,this}reset(){return this.setProgress(0),this.beginEvent(),this.options.autoplay?this.play():this.pause(),this}cancel(){return this.all(t=>t.cancel()),this.stopLoop(),this}finish(){return this.all(t=>t.finish()),this.stopLoop(),this}stop(){for(this.cancel(),this.animations.clear();this.targets.length;)this.targets.pop();this.mainElement=void 0,this.emit("stop")}getTargets(){return this.targets}getAnimation(t){return this.animations.get(t)}getTiming(t){var a,o,l;let e=t instanceof Animation?t:this.getAnimation(t),r=(a=this.computedOptions.get(e))!=null?a:{},n=(l=(o=e.effect)==null?void 0:o.getTiming())!=null?l:{},s=this.getOptions();return u(u(u(u({},z),s),n),r)}getTotalDuration(){return this.totalDuration}getCurrentTime(){return this.mainAnimation.currentTime}getProgress(){return this.getCurrentTime()/this.totalDuration*100}getSpeed(){return this.mainAnimation.playbackRate}getPlayState(){return this.mainAnimation.playState}getOptions(){return this.options}setCurrentTime(t){return this.all(e=>{e.currentTime=t}),this.emit("update",this.getProgress()),this}setProgress(t){let e=t/100*this.totalDuration;return this.setCurrentTime(e),this}setSpeed(t=1){return this.all(e=>{e.playbackRate=t}),this}on(t,e,r){return this.emitter.on(t,e,r!=null?r:this),this}off(t,e,r){return this.emitter.off(t,e,r!=null?r:this),this}emit(t,...e){return this.emitter.emit(t,...e),this}toJSON(){return this.getOptions()}get[Symbol.toStringTag](){return"Animate"}},g=(i={})=>new w(i);(()=>{let i=".css-selector-demo",t=g({target:`${i} .el`,transform:["translateX(0px)","translateX(250px)"],onfinish(r){r.style.transform="translateX(250px)"},duration:500,autoplay:!1});document.querySelector(i).addEventListener("click",()=>{t.reset(),t.play()})})();(()=>{let i=".dom-node-demo",t=document.querySelectorAll(`${i} .el`),e=g({target:t,transform:["translateX(0px)","translateX(250px)"],onfinish(n){n.style.transform="translateX(250px)"},duration:500,autoplay:!1});document.querySelector(i).addEventListener("click",()=>{e.reset(),e.play()})})();(()=>{let i=".array-demo",t=n=>`${i} .el-0${n}`,e=g({target:[`${i} .el-01`,t(2),t(3),t(4),t(5)],transform:["translateX(0px)","translateX(250px)"],onfinish(n){n.style.transform="translateX(250px)"},autoplay:!1});document.querySelector(i).addEventListener("click",()=>{e.reset(),e.play()})})();(()=>{let i=".css-properties-demo",t=g({target:`${i} .el`,backgroundColor:["#616aff","#fff"],left:["0px","240px"],borderRadius:["0%","50%"],onfinish(r){let{style:n}=r;n.backgroundColor="#fff",n.left="240px",n.borderRadius="50%"},easing:"in-out-quad",autoplay:!1});document.querySelector(i).addEventListener("click",()=>{t.reset(),t.play()})})();(()=>{let i=".css-transform-demo",t=g({target:`${i} .el`,transform:["translateX(0) scale(1) rotate(0)","translateX(250px) scale(2) rotate(1turn)"],onfinish(r){r.style.transform="translateX(250px) scale(2) rotate(1turn)"},easing:"in-out-quad",autoplay:!1});document.querySelector(i).addEventListener("click",()=>{t.reset(),t.play()})})();(()=>{let i=".svg-attributes-demo";var t=document.querySelector(`${i} path`);let e=g({target:t,strokeDashoffset:[4e3,0],loop:!0,direction:"alternate",easing:"in-out-expo",autoplay:!1});document.querySelector(i).addEventListener("click",()=>{e.getPlayState()==="running"?e.pause():e.play()}),e.on("update",()=>{console.log("Go")})})();
