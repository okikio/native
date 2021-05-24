var ee=Object.defineProperty;var ue=i=>ee(i,"__esModule",{value:!0});var ce=(i,e)=>{for(var t in e)ee(i,t,{get:e[t],enumerable:!0})};ue(exports);ce(exports,{Animate:()=>z,CSSArrValue:()=>K,CSSValue:()=>j,DefaultAnimationOptions:()=>le,EASINGS:()=>R,EFFECTS:()=>fe,EasingKeys:()=>oe,GetEase:()=>J,KeyframeParse:()=>_,ParseTransformableCSSKeyframes:()=>$,ParseTransformableCSSProperties:()=>G,TransformFunctionNames:()=>U,UnitDEG:()=>F,UnitDEGCSSValue:()=>A,UnitLess:()=>V,UnitLessCSSValue:()=>O,UnitPX:()=>X,UnitPXCSSValue:()=>C,addCSSUnit:()=>H,animate:()=>ye,computeOption:()=>ae,createTransformProperty:()=>Z,flatten:()=>re,getElements:()=>se,getTargets:()=>q,isValid:()=>k,mapAnimationOptions:()=>B,mapObject:()=>D,omit:()=>v,parseOffset:()=>w,parseOptions:()=>pe,toArr:()=>Y,transpose:()=>ne});var I=class{constructor(e){this.map=new Map(e)}getMap(){return this.map}get(e){return this.map.get(e)}keys(){return Array.from(this.map.keys())}values(){return Array.from(this.map.values())}set(e,t){return this.map.set(e,t),this}add(e){let n=this.size;return this.set(n,e),this}get size(){return this.map.size}get length(){return this.map.size}last(e=1){let t=this.keys()[this.size-e];return this.get(t)}delete(e){return this.map.delete(e)}remove(e){return this.map.delete(e),this}clear(){return this.map.clear(),this}has(e){return this.map.has(e)}entries(){return this.map.entries()}forEach(e,t){return this.map.forEach(e,t),this}[Symbol.iterator](){return this.entries()}},te=(i,e,...t)=>{i.forEach(n=>{n[e](...t)})};var ie=({callback:i=()=>{},scope:e=null,name:t="event"})=>({callback:i,scope:e,name:t}),M=class extends I{constructor(e="event"){super();this.name=e}},W=class extends I{constructor(){super()}getEvent(e){let t=this.get(e);return t instanceof M?t:(this.set(e,new M(e)),this.get(e))}newListener(e,t,n){let s=this.getEvent(e);return s.add(ie({name:e,callback:t,scope:n})),s}on(e,t,n){if(typeof e=="undefined"||e==null)return this;typeof e=="string"&&(e=e.trim().split(/\s/g));let s,r,a=typeof e=="object"&&!Array.isArray(e),o=a?t:n;return a||(r=t),Object.keys(e).forEach(l=>{s=a?l:e[l],a&&(r=e[l]),this.newListener(s,r,o)},this),this}removeListener(e,t,n){let s=this.get(e);if(s instanceof M&&t){let r=ie({name:e,callback:t,scope:n});s.forEach((a,o)=>{if(a.callback===r.callback&&a.scope===r.scope)return s.remove(o)})}return s}off(e,t,n){if(typeof e=="undefined"||e==null)return this;typeof e=="string"&&(e=e.trim().split(/\s/g));let s,r,a=typeof e=="object"&&!Array.isArray(e),o=a?t:n;return a||(r=t),Object.keys(e).forEach(l=>{s=a?l:e[l],a&&(r=e[l]),typeof r=="function"?this.removeListener(s,r,o):this.remove(s)},this),this}once(e,t,n){if(typeof e=="undefined"||e==null)return this;typeof e=="string"&&(e=e.trim().split(/\s/g));let s=typeof e=="object"&&!Array.isArray(e);return Object.keys(e).forEach(r=>{let a=s?r:e[r],o=s?e[r]:t,l=s?t:n,p=(...y)=>{o.apply(l,y),this.removeListener(a,p,l)};this.newListener(a,p,l)},this),this}emit(e,...t){return typeof e=="undefined"||e==null?this:(typeof e=="string"&&(e=e.trim().split(/\s/g)),e.forEach(n=>{let s=this.get(n);s instanceof M&&s.forEach(r=>{let{callback:a,scope:o}=r;a.apply(o,t)})},this),this)}clear(){return te(this,"clear"),super.clear(),this}};var w=i=>typeof i=="string"?i.includes("%")?parseFloat(i)/100:i=="from"?0:i=="to"?1:parseFloat(i):i,_=i=>{let e=new Set,t=Object.keys(i),n=t.length;for(let s=0;s<n;s++){let r=""+t[s],a=i[r],o=r.split(","),l=o.length;for(let p=0;p<l;p++){let y=w(o[p]);e.add({...a,offset:y})}}return[...e].sort((s,r)=>s.offset-r.offset)},fe={};var H=(i="")=>e=>typeof e=="string"?e:`${e}${i}`,V=H(),X=H("px"),F=H("deg"),Y=i=>Array.isArray(i)||typeof i=="string"?(typeof i=="string"&&(i=i.split(",")),i):[i],k=i=>Array.isArray(i)||typeof i=="string"?Boolean(i.length):i!=null&&i!=null,j=i=>e=>k(e)?Y(e).map(t=>{if(typeof t!="number"&&typeof t!="string")return t;let n=Number(t),s=Number.isNaN(n)?typeof t=="string"?t.trim():t:n;return i(s)}):[],ne=(...i)=>{let e=0;i=i.map(s=>{let r=Y(s),a=r.length;return a>e&&(e=a),r});let t=[],n=i.length;for(let s=0;s<e;s++){t[s]=[];for(let r=0;r<n;r++){let a=i[r][s];k(a)&&(t[s][r]=a)}}return t},K=(i,e)=>Y(i).map(j(e)),U=["translate","translate3d","translateX","translateY","translateZ","rotate","rotate3d","rotateX","rotateY","rotateZ","scale","scale3d","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective"],Z=i=>{let e="",t=U.length;for(let n=0;n<t;n++){let s=U[n],r=i[n];k(r)&&(e+=`${s}(${Array.isArray(r)?r.join(", "):r}) `)}return e.trim()},O=j(V),C=j(X),A=j(F),G=i=>{let{perspective:e,rotate:t,rotate3d:n,rotateX:s,rotateY:r,rotateZ:a,translate:o,translate3d:l,translateX:p,translateY:y,translateZ:h,scale:b,scale3d:u,scaleX:c,scaleY:m,scaleZ:f,skew:T,skewX:g,skewY:S,...d}=i;o=K(o,X),l=K(l,X),p=C(p),y=C(y),h=C(h),t=K(t,F),n=K(n,V),s=A(s),r=A(r),a=A(a),b=K(b,V),u=K(u,V),c=O(c),m=O(m),f=O(f),T=K(T,F),g=A(g),S=A(S),e=C(e);let E=ne(o,l,p,y,h,t,n,s,r,a,b,u,c,m,f,T,g,S,e).map(Z);return d=D(d,x=>[].concat(x).map(P=>""+P)),Object.assign({},k(E)?{transform:E}:null,d)},$=i=>i.map(e=>{let{translate:t,translate3d:n,translateX:s,translateY:r,translateZ:a,rotate:o,rotate3d:l,rotateX:p,rotateY:y,rotateZ:h,scale:b,scale3d:u,scaleX:c,scaleY:m,scaleZ:f,skew:T,skewX:g,skewY:S,perspective:d,easing:E,iterations:x,offset:P,...L}=e;return t=C(t),n=C(n),s=C(s)[0],r=C(r)[0],a=C(a)[0],o=A(o),l=O(l),p=A(p)[0],y=A(y)[0],h=A(h)[0],b=O(b),u=O(u),c=O(c)[0],m=O(m)[0],f=O(f)[0],T=A(T),g=A(g)[0],S=A(S)[0],d=C(d)[0],[L,t,n,s,r,a,o,l,p,y,h,b,u,c,m,f,T,g,S,d]}).map(([e,...t])=>{let n=Z(t);return Object.assign({},k(n)?{transform:n}:null,e)});var se=i=>typeof i=="string"?Array.from(document.querySelectorAll(i)):[i],re=i=>[].concat(...i),q=i=>Array.isArray(i)?re(i.map(q)):typeof i=="string"||i instanceof Node?se(i):i instanceof NodeList||i instanceof HTMLCollection?Array.from(i):[],ae=(i,e,t)=>typeof i=="function"?i.apply(t,e):i,D=(i,e)=>{let t=Object.keys(i),n,s,r={};for(let a=0,o=t.length;a<o;a++)n=t[a],s=i[n],r[n]=e(s,n,i);return r},B=(i,e,t)=>D(i,n=>ae(n,e,t)),R={in:"ease-in",out:"ease-out","in-out":"ease-in-out","in-sine":"cubic-bezier(0.47, 0, 0.745, 0.715)","out-sine":"cubic-bezier(0.39, 0.575, 0.565, 1)","in-out-sine":"cubic-bezier(0.445, 0.05, 0.55, 0.95)","in-quad":"cubic-bezier(0.55, 0.085, 0.68, 0.53)","out-quad":"cubic-bezier(0.25, 0.46, 0.45, 0.94)","in-out-quad":"cubic-bezier(0.455, 0.03, 0.515, 0.955)","in-cubic":"cubic-bezier(0.55, 0.055, 0.675, 0.19)","out-cubic":"cubic-bezier(0.215, 0.61, 0.355, 1)","in-out-cubic":"cubic-bezier(0.645, 0.045, 0.355, 1)","in-quart":"cubic-bezier(0.895, 0.03, 0.685, 0.22)","out-quart":"cubic-bezier(0.165, 0.84, 0.44, 1)","in-out-quart":"cubic-bezier(0.77, 0, 0.175, 1)","in-quint":"cubic-bezier(0.755, 0.05, 0.855, 0.06)","out-quint":"cubic-bezier(0.23, 1, 0.32, 1)","in-out-quint":"cubic-bezier(0.86, 0, 0.07, 1)","in-expo":"cubic-bezier(0.95, 0.05, 0.795, 0.035)","out-expo":"cubic-bezier(0.19, 1, 0.22, 1)","in-out-expo":"cubic-bezier(1, 0, 0, 1)","in-circ":"cubic-bezier(0.6, 0.04, 0.98, 0.335)","out-circ":"cubic-bezier(0.075, 0.82, 0.165, 1)","in-out-circ":"cubic-bezier(0.785, 0.135, 0.15, 0.86)","in-back":"cubic-bezier(0.6, -0.28, 0.735, 0.045)","out-back":"cubic-bezier(0.175, 0.885, 0.32, 1.275)","in-out-back":"cubic-bezier(0.68, -0.55, 0.265, 1.55)"},oe=Object.keys(R),J=i=>{let e=i.replace(/^ease-/,"");return oe.includes(e)?R[e]:i},le={keyframes:[],offset:[],loop:1,delay:0,speed:1,endDelay:0,easing:"ease",timelineOffset:0,autoplay:!0,duration:1e3,fillMode:"none",direction:"normal",padEndDelay:!1,extend:{}},pe=i=>{let{options:e,...t}=i,n=e instanceof z?e.options:Array.isArray(e)?e?.[0]?.options:e;return Object.assign({},n,t)},v=(i,e)=>{let t={...e};for(;i.length;){let{[i.pop()]:n,...s}=t;t=s}return t},Q=class{constructor(e){this.options={};this.properties={};this.totalDuration=0;this.emitter=new W;this.targets=new I;this.targetIndexes=new WeakMap;this.keyframeEffects=new WeakMap;this.computedOptions=new WeakMap;this.animations=new WeakMap;this.computedKeyframes=new WeakMap;this.loop=this.loop.bind(this),this.onVisibilityChange=this.onVisibilityChange.bind(this),this.on("error",t=>console.error(t)),this.updateOptions(e),this.visibilityPlayState=this.getPlayState(),Q.pauseOnPageHidden&&document.addEventListener("visibilitychange",this.onVisibilityChange,!1),this.newPromise()}onVisibilityChange(){document.hidden?(this.visibilityPlayState=this.getPlayState(),this.is("running")&&(this.loop(),this.pause())):this.visibilityPlayState=="running"&&this.is("paused")&&this.play()}newPromise(){return this.promise=new Promise((e,t)=>{this?.emitter?.once?.("finish",()=>e([this])),this?.emitter?.once?.("error",n=>t(n))}),this.promise}then(e,t){return e=e?.bind(this),t=t?.bind(this),this?.promise?.then?.(e,t),this}catch(e){return e=e?.bind(this),this.promise?.catch?.(e),this}finally(e){return e=e?.bind(this),this.promise?.finally?.(e),this}loop(){this.stopLoop(),this.animationFrame=window.requestAnimationFrame(this.loop),this.emit("update",this.getProgress(),this)}stopLoop(){window.cancelAnimationFrame(this.animationFrame)}allAnimations(e){return this.targets.forEach(t=>{let n=this.keyframeEffects.get(t),s=this.animations.get(n);return e(s,t)}),this}all(e){return this.mainAnimation&&e(this.mainAnimation,this.mainElement),this.allAnimations(e),this}beginEvent(){this.getProgress()==0&&this.emit("begin",this)}play(){let e=this.getPlayState();return this.beginEvent(),this.all(t=>t.play()),this.emit("play",e,this),this.is(e)||this.emit("playstate-change",e,this),this.loop(),this}pause(){let e=this.getPlayState();return this.all(t=>t.pause()),this.emit("pause",e,this),this.is(e)||this.emit("playstate-change",e,this),this.stopLoop(),this}reverse(){return this.all(e=>e.reverse()),this}reset(){return this.setProgress(0),this.options.autoplay?this.play():this.pause(),this}cancel(){return this.all(e=>e.cancel()),this}finish(){return this.all(e=>e.finish()),this}stop(){this.cancel(),this.stopLoop(),document.removeEventListener("visibilitychange",this.onVisibilityChange,!1),this.targets.forEach(e=>this.removeTarget(e)),this.emit("stop"),this.emitter.clear(),this.mainkeyframeEffect=null,this.mainAnimation=null,this.mainElement=null,this.promise=null,this.computedOptions=null,this.animations=null,this.keyframeEffects=null,this.emitter=null,this.targets=null,this.options=null,this.properties=null}getAnimation(e){let t=this.keyframeEffects.get(e);return this.animations.get(t)}getTiming(e){let t=this.computedOptions.get(e)??{},n=this.keyframeEffects.get(e).getTiming?.()??{};return{...t,...n}}getCurrentTime(){return this.mainAnimation.currentTime}getProgress(){return this.getCurrentTime()/this.totalDuration*100}getSpeed(){return this.mainAnimation.playbackRate}getPlayState(){return this.mainAnimation.playState}is(e){return this.getPlayState()==e}setCurrentTime(e){return this.all(t=>t.currentTime=e),this.emit("update",this.getProgress()),this}setProgress(e){let t=e/100*this.totalDuration;return this.setCurrentTime(t),this}setSpeed(e=1){return this.maxSpeed=e,this.all(t=>{t.updatePlaybackRate?t.updatePlaybackRate(e):t.playbackRate=e}),this}createArrayOfComputedOptions(e,t){let n=[];return this.targets.forEach((s,r)=>{let a=this.computedOptions.get(s)??{},o=g=>{let S=g;return g=="loop"&&(S="iterations"),g=="fillMode"&&(S="fill"),e[g]??a[S]??this.options[g]},l=Object.assign({easing:o("easing"),iterations:o("loop"),direction:o("direction"),endDelay:o("endDelay"),duration:o("duration"),speed:o("speed"),delay:o("delay"),timelineOffset:o("timelineOffset"),keyframes:o("keyframes")},o("extend")??{}),p=B(l,[r,t,s],this);typeof p.easing=="string"&&(p.easing=J(p.easing)),p.iterations===!0&&(p.iterations=Infinity),p.fill=o("fillMode");let{timelineOffset:y,speed:h,endDelay:b,delay:u,duration:c,iterations:m,...f}=p;m=Number(m),c=Number(c),b=Number(b),h=Number(h),u=Number(u)+Number(y);let T=u+c*m+b;this.totalDuration<T&&(this.totalDuration=T),n[r]={...f,speed:h,tempDurations:T,endDelay:b,delay:u,duration:c,iterations:m},(!k(this.minDelay)||u<this.minDelay)&&(this.minDelay=u),(!k(this.maxSpeed)||h<this.maxSpeed)&&(this.maxSpeed=h)}),n}createAnimations(e,t){let{arrOfComputedOptions:n,padEndDelay:s,oldCSSProperties:r,onfinish:a,oncancel:o}=e;this.targets.forEach((l,p)=>{let{speed:y,keyframes:h,tempDurations:b,...u}=n[p];s&&u.endDelay==0&&Math.abs(u.iterations)!=Math.abs(Infinity)&&(u.endDelay=this.totalDuration-b);let c,m,f=h;typeof f=="object"&&(f=_(f));let T=this.computedKeyframes.get(l)??{},g=Object.assign({},r,T),S=D(g,(x,P)=>this.properties[P]??x);if(m=k(f)?f:S,Array.isArray(m))c=m.map(x=>{let{loop:P,easing:L,offset:N,...me}=v(["speed"],x);return{easing:J(L),iterations:P===!0?Infinity:Number(P),offset:w(N),...me}}),c=$(c);else{let x=v(["keyframes"],m),{offset:P,...L}=B(x,[p,t,l],this);L=G(L);let N=P;c=Object.assign({},L,k(N)?{offset:N.map(w)}:null)}let d,E;this.keyframeEffects.has(l)?(E=this.keyframeEffects.get(l),d=this.animations.get(E),E?.setKeyframes?.(c),E?.updateTiming?.(u)):(E=new KeyframeEffect(l,c,u),d=new Animation(E,u.timeline),this.keyframeEffects.set(l,E),this.animations.set(E,d)),d.playbackRate=y,d.onfinish=()=>{typeof a=="function"&&a.call(this,l,p,t,d)},d.oncancel=()=>{typeof o=="function"&&o.call(this,l,p,t,d)},this.computedOptions.set(l,u),this.computedKeyframes.set(l,c)})}updateOptions(e={}){try{let t=pe(e);this.options=Object.assign({},le,this.options,t);let n=["easing","loop","endDelay","duration","speed","delay","timelineOffset","direction","extend","fillMode","offset"],{padEndDelay:s,onfinish:r,oncancel:a,autoplay:o,target:l,targets:p,...y}=v(n,this.options);this.properties=v([...n,"keyframes","padEndDelay","onfinish","oncancel","autoplay","target","targets"],t);let h=this.targets.values(),b=[...new Set([...h,...q(p),...q(l)])];this.targets.clear(),b.forEach((m,f)=>{this.targets.set(f,m),this.targetIndexes.set(m,f)});let u=this.targets.size,c=this.createArrayOfComputedOptions(t,u);if(this.createAnimations({arrOfComputedOptions:c,padEndDelay:s,oldCSSProperties:y,onfinish:r,oncancel:a},u),this.maxSpeed=this.maxSpeed??this.options.speed,this.minDelay=this.minDelay??this.options.delay,this.totalDuration=this.totalDuration??this.options.duration,this.mainAnimation?(this.mainkeyframeEffect?.updateTiming?.({duration:this.totalDuration}),(!this.mainkeyframeEffect.setKeyframes||!this.mainkeyframeEffect.updateTiming)&&console.warn("@okikio/animate - `KeyframeEffect.setKeyframes` and/or `KeyframeEffect.updateTiming` are not supported in this browser.")):(this.mainkeyframeEffect=new KeyframeEffect(this.mainElement,[{opacity:"0"},{opacity:"1"}],{duration:this.totalDuration,easing:"linear"}),this.mainAnimation=new Animation(this.mainkeyframeEffect,this.options.timeline)),this.mainAnimation.playbackRate=this.maxSpeed,this.mainAnimation.onfinish=()=>{if(this.emit("finish",this),this.mainAnimation){let m=this.getPlayState();this.is(m)||this.emit("playstate-change",m,this),this.stopLoop()}},this.mainAnimation.oncancel=()=>{if(this.emit("cancel",this),this.mainAnimation){let m=this.getPlayState();this.is(m)||this.emit("playstate-change",m,this),this.stopLoop()}},o){let m=window.setTimeout(()=>{this.emit("begin",this),m=window.clearTimeout(m)},0);this.play()}else this.pause()}catch(t){this.emit("error",t)}}add(e){let t=this.getProgress(),n=this.is("running"),s=this.is("paused");this.updateOptions({target:e}),this.setProgress(t),n?this.play():s&&this.pause()}removeTarget(e){let t=this.keyframeEffects.get(e);this.animations.delete(t),t=null,this.computedKeyframes.delete(e),this.computedOptions.delete(e),this.keyframeEffects.delete(e);let n=this.targetIndexes.get(e);this.targets.delete(n),this.targetIndexes.delete(e)}remove(e){this.removeTarget(e);let t=new Set([].concat(this.targets.values()));this.options.target=[...t],this.options.targets=[],t.clear(),t=null;let n=this.getProgress(),s=this.is("running"),r=this.is("paused");this.updateOptions(),s?this.play():r&&this.pause(),this.setProgress(n)}on(e,t,n){return this?.emitter?.on(e,t,n??this),this}off(e,t,n){return this?.emitter?.off(e,t,n??this),this}emit(e,...t){return this?.emitter?.emit(e,...t),this}toJSON(){return this.options}get[Symbol.toStringTag](){return"Animate"}},z=Q;z.pauseOnPageHidden=!0;var ye=(i={})=>new z(i);0&&(module.exports={Animate,CSSArrValue,CSSValue,DefaultAnimationOptions,EASINGS,EFFECTS,EasingKeys,GetEase,KeyframeParse,ParseTransformableCSSKeyframes,ParseTransformableCSSProperties,TransformFunctionNames,UnitDEG,UnitDEGCSSValue,UnitLess,UnitLessCSSValue,UnitPX,UnitPXCSSValue,addCSSUnit,animate,computeOption,createTransformProperty,flatten,getElements,getTargets,isValid,mapAnimationOptions,mapObject,omit,parseOffset,parseOptions,toArr,transpose});
