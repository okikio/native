var De=Object.defineProperty,_e=Object.defineProperties;var ze=Object.getOwnPropertyDescriptors;var G=Object.getOwnPropertySymbols;var be=Object.prototype.hasOwnProperty,Se=Object.prototype.propertyIsEnumerable;var Te=(i,e,t)=>e in i?De(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,h=(i,e)=>{for(var t in e||(e={}))be.call(e,t)&&Te(i,t,e[t]);if(G)for(var t of G(e))Se.call(e,t)&&Te(i,t,e[t]);return i},te=(i,e)=>_e(i,ze(e));var L=(i,e)=>{var t={};for(var r in i)be.call(i,r)&&e.indexOf(r)<0&&(t[r]=i[r]);if(i!=null&&G)for(var r of G(i))e.indexOf(r)<0&&Se.call(i,r)&&(t[r]=i[r]);return t};var g=class{constructor(e){this.map=new Map(e)}getMap(){return this.map}get(e){return this.map.get(e)}keys(){return Array.from(this.map.keys())}values(){return Array.from(this.map.values())}set(e,t){return this.map.set(e,t),this}add(e){let r=this.size;return this.set(r,e),this}get size(){return this.map.size}get length(){return this.map.size}last(e=1){let t=this.keys()[this.size-e];return this.get(t)}delete(e){return this.map.delete(e)}remove(e){return this.map.delete(e),this}clear(){return this.map.clear(),this}has(e){return this.map.has(e)}entries(){return this.map.entries()}forEach(e,t){return this.map.forEach(e,t),this}[Symbol.iterator](){return this.entries()}},x=(i,e,...t)=>{i.forEach(r=>{r[e](...t)})};var dt=new DOMParser;var Ce=({callback:i=()=>{},scope:e=null,name:t="event"})=>({callback:i,scope:e,name:t}),j=class extends g{constructor(e="event"){super();this.name=e}},Y=class extends g{constructor(){super()}getEvent(e){let t=this.get(e);return t instanceof j?t:(this.set(e,new j(e)),this.get(e))}newListener(e,t,r){let n=this.getEvent(e);return n.add(Ce({name:e,callback:t,scope:r})),n}on(e,t,r){if(typeof e=="undefined")return this;typeof e=="string"&&(e=e.trim().split(/\s/g));let n,a,s=typeof e=="object"&&!Array.isArray(e),o=s?t:r;return s||(a=t),Object.keys(e).forEach(l=>{n=s?l:e[l],s&&(a=e[l]),this.newListener(n,a,o)},this),this}removeListener(e,t,r){let n=this.get(e);if(n instanceof j&&t){let a=Ce({name:e,callback:t,scope:r});n.forEach((s,o)=>{if(s.callback===a.callback&&s.scope===a.scope)return n.remove(o)})}return n}off(e,t,r){if(typeof e=="undefined")return this;typeof e=="string"&&(e=e.trim().split(/\s/g));let n,a,s=typeof e=="object"&&!Array.isArray(e),o=s?t:r;return s||(a=t),Object.keys(e).forEach(l=>{n=s?l:e[l],s&&(a=e[l]),typeof a=="function"?this.removeListener(n,a,o):this.remove(n)},this),this}once(e,t,r){if(typeof e=="undefined")return this;typeof e=="string"&&(e=e.trim().split(/\s/g));let n=typeof e=="object"&&!Array.isArray(e);return Object.keys(e).forEach(a=>{let s=n?a:e[a],o=n?e[a]:t,l=n?t:r,u=(...c)=>{o.apply(l,c),this.removeListener(s,u,l)};this.newListener(s,u,l)},this),this}emit(e,...t){return typeof e=="undefined"?this:(typeof e=="string"&&(e=e.trim().split(/\s/g)),e.forEach(r=>{let n=this.get(r);n instanceof j&&n.forEach(a=>{let{callback:s,scope:o}=a;s.apply(o,t)})},this),this)}clear(){return x(this,"clear"),super.clear(),this}};var $=i=>typeof i=="string"?i.includes("%")?parseFloat(i)/100:i=="from"?0:i=="to"?1:parseFloat(i):i,Ee=i=>{let e=new Set,t=Object.keys(i),r=t.length;for(let n=0;n<r;n++){let a=""+t[n],s=i[a],o=a.split(","),l=o.length;for(let u=0;u<l;u++){let c=$(o[u]);e.add(te(h({},s),{offset:c}))}}return[...e].sort((n,a)=>n.offset-a.offset)};var qe=i=>typeof i=="string"?Array.from(document.querySelectorAll(i)):[i],Xe=i=>[].concat(...i),re=i=>Array.isArray(i)?Xe(i.map(re)):typeof i=="string"||i instanceof Node?qe(i):i instanceof NodeList||i instanceof HTMLCollection?Array.from(i):[],Pe=(i,e,t)=>typeof i=="function"?i.apply(t,e):i,Ie=(i,e,t)=>{let r,n,a={},s=Object.keys(i);for(let o=0,l=s.length;o<l;o++)r=s[o],n=i[r],a[r]=Pe(n,e,t);return a},xe={in:"ease-in",out:"ease-out","in-out":"ease-in-out","in-sine":"cubic-bezier(0.47, 0, 0.745, 0.715)","out-sine":"cubic-bezier(0.39, 0.575, 0.565, 1)","in-out-sine":"cubic-bezier(0.445, 0.05, 0.55, 0.95)","in-quad":"cubic-bezier(0.55, 0.085, 0.68, 0.53)","out-quad":"cubic-bezier(0.25, 0.46, 0.45, 0.94)","in-out-quad":"cubic-bezier(0.455, 0.03, 0.515, 0.955)","in-cubic":"cubic-bezier(0.55, 0.055, 0.675, 0.19)","out-cubic":"cubic-bezier(0.215, 0.61, 0.355, 1)","in-out-cubic":"cubic-bezier(0.645, 0.045, 0.355, 1)","in-quart":"cubic-bezier(0.895, 0.03, 0.685, 0.22)","out-quart":"cubic-bezier(0.165, 0.84, 0.44, 1)","in-out-quart":"cubic-bezier(0.77, 0, 0.175, 1)","in-quint":"cubic-bezier(0.755, 0.05, 0.855, 0.06)","out-quint":"cubic-bezier(0.23, 1, 0.32, 1)","in-out-quint":"cubic-bezier(0.86, 0, 0.07, 1)","in-expo":"cubic-bezier(0.95, 0.05, 0.795, 0.035)","out-expo":"cubic-bezier(0.19, 1, 0.22, 1)","in-out-expo":"cubic-bezier(1, 0, 0, 1)","in-circ":"cubic-bezier(0.6, 0.04, 0.98, 0.335)","out-circ":"cubic-bezier(0.075, 0.82, 0.165, 1)","in-out-circ":"cubic-bezier(0.785, 0.135, 0.15, 0.86)","in-back":"cubic-bezier(0.6, -0.28, 0.735, 0.045)","out-back":"cubic-bezier(0.175, 0.885, 0.32, 1.275)","in-out-back":"cubic-bezier(0.68, -0.55, 0.265, 1.55)"},Ye=Object.keys(xe),we=i=>{let e=i.replace(/^ease-/,"");return Ye.includes(e)?xe[e]:i},ke={keyframes:[],offset:[],loop:1,delay:0,speed:1,endDelay:0,easing:"ease",timelineOffset:0,autoplay:!0,duration:1e3,fillMode:"none",direction:"normal",padEndDelay:!1,extend:{}},$e=i=>{var a;let n=i,{options:e}=n,t=L(n,["options"]),r=e instanceof ne?e.getOptions():Array.isArray(e)?(a=e==null?void 0:e[0])==null?void 0:a.getOptions():e;return Object.assign({},r,t)},ae=(i="")=>e=>typeof e=="string"?e:`${e}${i}`,Z=ae(),se=ae("px"),oe=ae("deg"),le=i=>Array.isArray(i)||typeof i=="string"?(typeof i=="string"&&(i=i.split(",")),i):[i],K=i=>Array.isArray(i)||typeof i=="string"?Boolean(i.length):i!=null&&i!=null,B=i=>e=>K(e)?le(e).map(t=>{if(typeof t!="number"&&typeof t!="string")return t;let r=Number(t),n=Number.isNaN(r)?typeof t=="string"?t.trim():t:r;return i(n)}):[],Ze=(...i)=>{let e=0;i=i.map(n=>{let a=le(n),s=a.length;return s>e&&(e=s),a});let t=[],r=i.length;for(let n=0;n<e;n++){t[n]=[];for(let a=0;a<r;a++){let s=i[a][n];K(s)&&(t[n][a]=s)}}return t},N=(i,e)=>le(i).map(B(e)),ve=["translate","translate3d","translateX","translateY","translateZ","rotate","rotate3d","rotateX","rotateY","rotateZ","scale","scale3d","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective"],Le=i=>{let e="",t=ve.length;for(let r=0;r<t;r++){let n=ve[r],a=i[r];K(a)&&(e+=`${n}(${Array.isArray(a)?a.join(", "):a}) `)}return e.trim()},O=B(Z),w=B(se),S=B(oe),Oe=i=>{for(let[e,t]of Object.entries(i))i[e]=[].concat(t).map(r=>""+r);return i},Be=i=>{let M=i,{perspective:e,rotate:t,rotate3d:r,rotateX:n,rotateY:a,rotateZ:s,translate:o,translate3d:l,translateX:u,translateY:c,translateZ:T,scale:A,scale3d:C,scaleX:f,scaleY:d,scaleZ:E,skew:P,skewX:I,skewY:k}=M,v=L(M,["perspective","rotate","rotate3d","rotateX","rotateY","rotateZ","translate","translate3d","translateX","translateY","translateZ","scale","scale3d","scaleX","scaleY","scaleZ","skew","skewX","skewY"]);o=N(o,se),l=N(l,se),u=w(u),c=w(c),T=w(T),t=N(t,oe),r=N(r,Z),n=S(n),a=S(a),s=S(s),A=N(A,Z),C=N(C,Z),f=O(f),d=O(d),E=O(E),P=N(P,oe),I=S(I),k=S(k),e=w(e);let D=Ze(o,l,u,c,T,t,r,n,a,s,A,C,f,d,E,P,I,k,e).map(Le);return v=Oe(v),Object.assign({},K(D)?{transform:D}:null,v)},We=i=>i.map(e=>{let M=e,{translate:t,translate3d:r,translateX:n,translateY:a,translateZ:s,rotate:o,rotate3d:l,rotateX:u,rotateY:c,rotateZ:T,scale:A,scale3d:C,scaleX:f,scaleY:d,scaleZ:E,skew:P,skewX:I,skewY:k,perspective:v}=M,D=L(M,["translate","translate3d","translateX","translateY","translateZ","rotate","rotate3d","rotateX","rotateY","rotateZ","scale","scale3d","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective"]);return t=w(t),r=w(r),n=w(n)[0],a=w(a)[0],s=w(s)[0],o=S(o),l=O(l),u=S(u)[0],c=S(c)[0],T=S(T)[0],A=O(A),C=O(C),f=O(f)[0],d=O(d)[0],E=O(E)[0],P=S(P),I=S(I)[0],k=S(k)[0],v=w(v)[0],[D,t,r,n,a,s,o,l,u,c,T,A,C,f,d,E,P,I,k,v]}).map(([e,...t])=>{let r=Le(t);return e=Oe(e),Object.assign({},K(r)?{transform:r}:null,e)}),ne=class{constructor(e){this.options={};this.targets=new g;this.properties={};this.animations=new g;this.keyframeEffects=new g;this.totalDuration=0;this.minDelay=0;this.maxSpeed=0;this.computedOptions=new g;this.computedKeyframes=new g;this.emitter=new Y;this.loop=this.loop.bind(this),this.updateOptions(e)}newPromise(){return this.promise=new Promise((e,t)=>{var r,n,a,s;(n=(r=this==null?void 0:this.emitter)==null?void 0:r.once)==null||n.call(r,"finish",()=>e([this])),(s=(a=this==null?void 0:this.emitter)==null?void 0:a.once)==null||s.call(a,"error",o=>t(o))}),this.promise}then(e,t){var r,n;return e=e==null?void 0:e.bind(this),t=t==null?void 0:t.bind(this),(n=(r=this==null?void 0:this.promise)==null?void 0:r.then)==null||n.call(r,e,t),this}catch(e){var t,r;return e=e==null?void 0:e.bind(this),(r=(t=this.promise)==null?void 0:t.catch)==null||r.call(t,e),this}finally(e){var t,r;return e=e==null?void 0:e.bind(this),(r=(t=this.promise)==null?void 0:t.finally)==null||r.call(t,e),this}loop(){this.stopLoop(),this.emit("update",this.getProgress(),this),this.animationFrame=window.requestAnimationFrame(this.loop)}stopLoop(){window.cancelAnimationFrame(this.animationFrame)}allAnimations(e){return this.animations.forEach(e),this}all(e){return this.mainAnimation&&e(this.mainAnimation,this.mainElement),this.allAnimations(e),this}beginEvent(){this.getProgress()==0&&this.emit("begin",this)}play(){let e=this.getPlayState();return this.beginEvent(),this.all(t=>t.play()),this.emit("play",e,this),this.is(e)||this.emit("playstate-change",e,this),this.loop(),this}pause(){let e=this.getPlayState();return this.all(t=>t.pause()),this.emit("pause",e,this),this.is(e)||this.emit("playstate-change",e,this),this.stopLoop(),this.animationFrame=void 0,this}reverse(){return this.all(e=>e.reverse()),this}reset(){return this.setProgress(0),this.options.autoplay?this.play():this.pause(),this}cancel(){return this.all(e=>e.cancel()),this}finish(){return this.all(e=>e.finish()),this}stop(){this.cancel(),this.computedOptions.clear(),this.animations.clear(),this.keyframeEffects.clear(),this.targets.clear(),this.mainkeyframeEffect=void 0,this.mainAnimation=void 0,this.mainElement=void 0,this.emit("stop"),this.emitter.clear(),this.promise=void 0,this.computedOptions=void 0,this.animations=void 0,this.keyframeEffects=void 0,this.emitter=void 0,this.targets=void 0,this.options=void 0}getTargets(){return this.targets.values()}getAnimation(e){return this.animations.get(e)}getKeyframeEffect(e){return this.keyframeEffects.get(e)}getTiming(e){var s,o,l,u;let t=e instanceof Animation?e:this.getAnimation(e),r=(s=this.computedOptions.get(t))!=null?s:{},n=(u=(l=(o=this.getKeyframeEffect(t)).getTiming)==null?void 0:l.call(o))!=null?u:{},a=this.getOptions();return h(h(h(h({},ke),a),n),r)}getTotalDuration(){return this.totalDuration}getCurrentTime(){return this.mainAnimation.currentTime}getProgress(){return this.getCurrentTime()/this.totalDuration*100}getSpeed(){return this.mainAnimation.playbackRate}getPlayState(){return this.mainAnimation.playState}getOptions(){return this.options}getComputedOption(e){let t=e instanceof Animation?e:this.getAnimation(e);return this.computedOptions.get(t)}is(e){return this.getPlayState()==e}setCurrentTime(e){return this.all(t=>{t.currentTime=e}),this.emit("update",this.getProgress()),this}setProgress(e){let t=e/100*this.totalDuration;return this.setCurrentTime(t),this}setSpeed(e=1){return this.maxSpeed=e,this.all(t=>{t.updatePlaybackRate?t.updatePlaybackRate(e):t.playbackRate=e}),this}updateOptions(e={}){var r,n;try{this.options=Object.assign({},ke,this.options,$e(e));let t=this.options,{loop:a,delay:s,speed:o,easing:l,timelineOffset:u,endDelay:c,duration:T,direction:A,fillMode:C,onfinish:f,oncancel:d,keyframes:E,autoplay:P,target:I,targets:k,padEndDelay:v,extend:D}=t,M=L(t,["loop","delay","speed","easing","timelineOffset","endDelay","duration","direction","fillMode","onfinish","oncancel","keyframes","autoplay","target","targets","padEndDelay","extend"]),Re=new Set([...this.getTargets(),...re(k),...re(I)]);this.targets=new g,this.properties=M,Re.forEach(p=>this.targets.add(p));let pe=[],ue=[],_=this.targets.size,ce=[],Ve=this.totalDuration,He=h({easing:typeof l=="string"?we(l):l,iterations:a===!0?Infinity:a,direction:A,endDelay:c,duration:T,speed:o,delay:s,timelineOffset:u,fill:C},D);if(this.targets.forEach((p,R)=>{let V=Ie(He,[R,_,p],this),{timelineOffset:J}=V,m=L(V,["timelineOffset"]);m.delay+=J,m.tempDurations=+m.delay+ +m.duration*+m.iterations+ +m.endDelay,this.totalDuration<+m.tempDurations&&(this.totalDuration=+m.tempDurations),ce[R]=m,pe.push(m.delay),ue.push(m.speed)}),this.targets.forEach((p,R)=>{var ye,fe;let he=ce[R],{speed:me,tempDurations:J}=he,m=L(he,["speed","tempDurations"]),V,H;v&&m.endDelay==0&&Math.abs(+m.iterations)!=Math.abs(Infinity)&&(m.endDelay=this.totalDuration-J);let z=Pe(E,[R,_,p],this);if(typeof z=="object"&&(z=Ee(z)),V=K(z)?z:M,Array.isArray(V))H=V.map(Q=>{let de=Q,{speed:F,loop:U,easing:ee,offset:Ke}=de,Ne=L(de,["speed","loop","easing","offset"]);return h({easing:typeof ee=="string"?we(ee):ee,iterations:U===!0?Infinity:U,offset:$(Ke)},Ne)}),H=We(H);else{let ge=Ie(V,[R,_,p],this),{offset:Q}=ge,F=L(ge,["offset"]),U=Q;F=Be(F),H=Object.assign({},K(U)?{offset:U.map($)}:null,F)}let b,y;this.animations.has(p)?(b=this.getAnimation(p),y=this.getKeyframeEffect(b),(ye=y==null?void 0:y.setKeyframes)==null||ye.call(y,H),(fe=y==null?void 0:y.updateTiming)==null||fe.call(y,m)):(y=new KeyframeEffect(p,H,m),b=new Animation(y,m.timeline),this.animations.set(p,b),this.keyframeEffects.set(b,y)),b.playbackRate=me,b.onfinish=()=>{typeof f=="function"&&f.call(this,p,R,_,b)},b.oncancel=()=>{typeof d=="function"&&d.call(this,p,R,_,b)},this.computedOptions.set(b,m),this.computedKeyframes.set(b,H)}),this.mainAnimation?Ve!==this.totalDuration&&((n=(r=this.mainkeyframeEffect)==null?void 0:r.updateTiming)==null||n.call(r,{duration:this.totalDuration}),(!this.mainkeyframeEffect.setKeyframes||!this.mainkeyframeEffect.updateTiming)&&console.error("@okikio/animate - `KeyframeEffect.setKeyframes` and/or `KeyframeEffect.updateTiming` are not supported in this browser.")):(this.mainkeyframeEffect=new KeyframeEffect(this.mainElement,[{opacity:"0"},{opacity:"1"}],{duration:this.totalDuration,easing:"linear"}),this.mainAnimation=new Animation(this.mainkeyframeEffect,this.options.timeline),this.mainAnimation.onfinish=()=>{let p=this.getPlayState();this.emit("finish",p,this),this.is(p)||this.emit("playstate-change",p,this),this.stopLoop()},this.mainAnimation.oncancel=()=>{let p=this.getPlayState();this.emit("cancel",p,this),this.is(p)||this.emit("playstate-change",p,this),this.stopLoop()}),this.minDelay=Math.min(...pe),this.maxSpeed=Math.min(...ue),this.mainAnimation.playbackRate=this.maxSpeed,P){let p=window.setTimeout(()=>{this.emit("begin",this),p=window.clearTimeout(p)},0);this.play()}else this.pause();this.newPromise()}catch(a){this.emit("error",a)}}on(e,t,r){var n;return(n=this==null?void 0:this.emitter)==null||n.on(e,t,r!=null?r:this),this}off(e,t,r){var n;return(n=this==null?void 0:this.emitter)==null||n.off(e,t,r!=null?r:this),this}emit(e,...t){var r;return(r=this==null?void 0:this.emitter)==null||r.emit(e,...t),this}toJSON(){return this.getOptions()}get[Symbol.toStringTag](){return"Animate"}},W=(i={})=>new ne(i);var Me=(i,e)=>{let t=document.querySelector(`${i} #playstate-toggle`),r=document.querySelector(`${i} #progress`),n=document.querySelector(`${i} #progress-output`),a,s=()=>{a=e[0].getPlayState(),t.setAttribute("data-playstate",a)};e[0].on("finish begin",s).on("update",o=>{r.value=""+o.toFixed(2),n.textContent=`${Math.round(o)}%`}),t.addEventListener("click",()=>{e[0].is("running")?x(e,"pause"):e[0].is("finished")?x(e,"reset"):x(e,"play"),s()}),r.addEventListener("input",o=>{let l=+r.value;x(e,"pause"),x(e,"setProgress",l)}),r.addEventListener("change",()=>{a!=="paused"?x(e,"play"):x(e,"pause"),s()})};(()=>{let i=".playback-demo",e=document.querySelectorAll(`${i} .el`),t=W({target:e,translateX:300,opacity(r,n){return[.5,.5+Math.min((r+1)/n,.5)]},fillMode:"both",easing:"out-cubic",loop:2,speed:1.5,direction:"alternate",delay(r){return(r+1)*500/2},duration(r){return(r+1)*500},padEndDelay:!0,autoplay:!0});setTimeout(()=>{console.log("updateOptions"),t.updateOptions({backgroundColor:["#fff","red"],speed:r=>1.5-r*.125})},500),Me(i,[t])})();(()=>{let i={padEndDelay:!0,easing:"linear",duration:2e3,loop:4,speed:1},e=".motion-path-demo",t=document.querySelector(".motion-path .el-1"),r=W(h({target:t,offsetDistance:["0%","100%"]},i)),n=document.querySelector(".motion-path path"),a=document.querySelector(".motion-path .el-2"),s=new Set,o=[],l=n.getTotalLength(),u=n.getPointAtLength(0);for(var c=0;c<l;c++){let{x:A,y:C}=n.getPointAtLength(c);s.add([A,C]);let{x:f,y:d}=c-1>=1?n.getPointAtLength(c-1):u,{x:E,y:P}=c+1>=1?n.getPointAtLength(c+1):u,I=+(Math.atan2(P-d,E-f)*180/Math.PI);o.push(I)}let T=W(h({target:a,translate:[...s],rotate:o,fillMode:"both"},i));Me(e,[r,T])})();
//# sourceMappingURL=animate.js.map
