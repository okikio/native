var animate=function(i){"use strict";class u{constructor(a){this.map=new Map(a)}getMap(){return this.map}get(a){return this.map.get(a)}keys(){return Array.from(this.map.keys())}values(){return Array.from(this.map.values())}set(a,b){return this.map.set(a,b),this}add(a){return this.set(this.size,a),this}get size(){return this.map.size}last(a=1){let b=this.keys()[this.size-a];return this.get(b)}prev(){return this.last(2)}delete(a){return this.map.delete(a),this}clear(){return this.map.clear(),this}has(a){return this.map.has(a)}entries(){return this.map.entries()}forEach(a=(...c)=>{},b){return this.map.forEach(a,b),this}[Symbol.iterator](){return this.entries()}methodCall(a,...b){return this.forEach(c=>{c[a](...b)}),this}async asyncMethodCall(a,...b){for(let[,c]of this.map)await c[a](...b);return this}}class v{constructor({callback:a=()=>{},scope:b=null,name:c="event"}){this.listener={callback:a,scope:b,name:c}}getCallback(){return this.listener.callback}getScope(){return this.listener.scope}getEventName(){return this.listener.name}toJSON(){return this.listener}}class n extends u{constructor(a="event"){super();this.name=a}}class E extends u{constructor(){super()}getEvent(a){let b=this.get(a);return b instanceof n?b:(this.set(a,new n(a)),this.get(a))}newListener(a,b,c){let d=this.getEvent(a);return d.add(new v({name:a,callback:b,scope:c})),d}on(a,b,c){if(typeof a=="undefined")return this;typeof a=="string"&&(a=a.split(/\s/g));let d,e,f=typeof a=="object"&&!Array.isArray(a),h=f?b:c;return f||(e=b),Object.keys(a).forEach(g=>{f?(d=g,e=a[g]):d=a[g],this.newListener(d,e,h)},this),this}removeListener(a,b,c){let d=this.get(a);if(d instanceof n&&b){let e=0,f=d.size,h,g=new v({name:a,callback:b,scope:c});for(;e<f;e++){h=d.get(e);if(h.getCallback()===g.getCallback()&&h.getScope()===g.getScope())break}d.delete(e)}return d}off(a,b,c){if(typeof a=="undefined")return this;typeof a=="string"&&(a=a.split(/\s/g));let d,e,f=typeof a=="object"&&!Array.isArray(a),h=f?b:c;return f||(e=b),Object.keys(a).forEach(g=>{f?(d=g,e=a[g]):d=a[g],e?this.removeListener(d,e,h):this.delete(d)},this),this}once(a,b,c){if(typeof a=="undefined")return this;typeof a=="string"&&(a=a.split(/\s/g));let d,e,f=typeof a==="object"&&!Array.isArray(a),h=f?b:c;return f||(e=b),Object.keys(a).forEach(g=>{f?(d=g,e=a[g]):d=a[g];let o=(...s)=>{f?(d=g,e=a[g]):d=a[g],this.off(d,o,h),e.apply(h,s)};this.on(d,o,h)},this),this}emit(a,...b){return typeof a=="undefined"?this:(typeof a=="string"&&(a=a.split(/\s/g)),a.forEach(c=>{let d=this.get(c);d instanceof n&&d.forEach(e=>{let{callback:f,scope:h}=e.toJSON();f.apply(h,b)})},this),this)}}const w=a=>typeof a==="string"?Array.from(document.querySelectorAll(a)):[a],x=a=>Array.isArray(a)?a:typeof a=="string"||a instanceof Node?w(a):a instanceof NodeList||a instanceof HTMLCollection?Array.from(a):[],q=(a,b)=>typeof a==="function"?a(...b):a,r=(a,b)=>{let c,d,e={},f=Object.keys(a);for(let h=0,g=f.length;h<g;h++)c=f[h],d=a[c],e[c]=q(d,b);return e},y={ease:"ease",in:"ease-in",out:"ease-out","in-out":"ease-in-out","in-sine":"cubic-bezier(0.47, 0, 0.745, 0.715)","out-sine":"cubic-bezier(0.39, 0.575, 0.565, 1)","in-out-sine":"cubic-bezier(0.445, 0.05, 0.55, 0.95)","in-quad":"cubic-bezier(0.55, 0.085, 0.68, 0.53)","out-quad":"cubic-bezier(0.25, 0.46, 0.45, 0.94)","in-out-quad":"cubic-bezier(0.455, 0.03, 0.515, 0.955)","in-cubic":"cubic-bezier(0.55, 0.055, 0.675, 0.19)","out-cubic":"cubic-bezier(0.215, 0.61, 0.355, 1)","in-out-cubic":"cubic-bezier(0.645, 0.045, 0.355, 1)","in-quart":"cubic-bezier(0.895, 0.03, 0.685, 0.22)","out-quart":"cubic-bezier(0.165, 0.84, 0.44, 1)","in-out-quart":"cubic-bezier(0.77, 0, 0.175, 1)","in-quint":"cubic-bezier(0.755, 0.05, 0.855, 0.06)","out-quint":"cubic-bezier(0.23, 1, 0.32, 1)","in-out-quint":"cubic-bezier(0.86, 0, 0.07, 1)","in-expo":"cubic-bezier(0.95, 0.05, 0.795, 0.035)","out-expo":"cubic-bezier(0.19, 1, 0.22, 1)","in-out-expo":"cubic-bezier(1, 0, 0, 1)","in-circ":"cubic-bezier(0.6, 0.04, 0.98, 0.335)","out-circ":"cubic-bezier(0.075, 0.82, 0.165, 1)","in-out-circ":"cubic-bezier(0.785, 0.135, 0.15, 0.86)","in-back":"cubic-bezier(0.6, -0.28, 0.735, 0.045)","out-back":"cubic-bezier(0.175, 0.885, 0.32, 1.275)","in-out-back":"cubic-bezier(0.68, -0.55, 0.265, 1.55)"},z=a=>/^(ease|in|out)/.test(a)?y[a]:a,A={keyframes:[],loop:1,delay:0,speed:1,endDelay:0,easing:"ease",autoplay:!0,duration:1e3,onfinish(){},fillMode:"auto",direction:"normal"};class B{constructor(a={}){this.options={},this.targets=[],this.properties={},this.animations=new Map(),this.duration=0,this.emitter=new E();let{options:b,...c}=a;this.options=Object.assign({},A,b,c);let{loop:d,delay:e,speed:f,easing:h,endDelay:g,duration:o,direction:s,fillMode:G,onfinish:H,target:I,keyframes:J,autoplay:K,...L}=this.options;this.mainElement=document.createElement("span"),this.targets=x(I),this.properties=L;let p;for(let j=0,m=this.targets.length;j<m;j++){let l=this.targets[j],k={easing:z(h),iterations:d===!0?Infinity:d,direction:s,endDelay:g,duration:o,delay:e,fill:G},t=q(J,[j,m,l]);p=t.length?t:this.properties,k=r(k,[j,m,l]),t.length>0||(p=r(p,[j,m,l]));let C=k.delay+k.duration*k.iterations+k.endDelay;this.duration<C&&(this.duration=C);let D=l.animate(p,k);D.onfinish=()=>{H(l,j,m)},this.animations.set(l,D)}this.mainAnimation=this.mainElement.animate([{opacity:"0"},{opacity:"1"}],{duration:this.duration,easing:"linear"}),this.setSpeed(f),K?this.play():this.pause(),this.promise=this.newPromise(),this.mainAnimation.onfinish=()=>{this.finish(this.options),window.cancelAnimationFrame(this.animationFrame)}}newPromise(){return new Promise((a,b)=>{try{this.finish=c=>(this.emit("finish",c),a(c))}catch(c){b(c)}})}then(a,b){return this.promise.then(a,b)}catch(a){return this.promise.catch(a)}finally(a){return this.promise.finally(a)}loop(){this.animationFrame=window.requestAnimationFrame(this.loop.bind(this)),this.emit("tick change",this.getCurrentTime())}on(a,b,c){return this.emitter.on(a,b,c),this}off(a,b,c){return this.emitter.off(a,b,c),this}emit(a,...b){return this.emitter.emit(a,...b),this}getAnimation(a){return this.animations.get(a)}play(){return this.mainAnimation.playState!=="finished"&&(this.mainAnimation.play(),this.animationFrame=requestAnimationFrame(this.loop.bind(this)),this.animations.forEach(a=>{a.playState!=="finished"&&a.play()}),this.emit("play")),this}pause(){return this.mainAnimation.playState!=="finished"&&(this.mainAnimation.pause(),window.cancelAnimationFrame(this.animationFrame),this.animations.forEach(a=>{a.playState!=="finished"&&a.pause()}),this.emit("pause")),this}getDuration(){return this.duration}getCurrentTime(){return this.mainAnimation.currentTime}setCurrentTime(a){return this.mainAnimation.currentTime=a,this.animations.forEach(b=>{b.currentTime=a}),this}getProgress(){return this.getCurrentTime()/this.duration}setProgress(a){return this.mainAnimation.currentTime=a*this.duration,this.animations.forEach(b=>{b.currentTime=a*this.duration}),this}getSpeed(){return this.mainAnimation.playbackRate}setSpeed(a=1){return this.mainAnimation.playbackRate=a,this.animations.forEach(b=>{b.playbackRate=a}),this}reset(){this.setCurrentTime(0),this.promise=this.newPromise(),this.options.autoplay?this.play():this.pause()}getPlayState(){return this.mainAnimation.playState}getOptions(){return this.options}toJSON(){return this.getOptions()}}const F=(a={})=>new B(a);return i.Animate=B,i.DefaultAnimationOptions=A,i.animate=F,i.computeValue=q,i.easings=y,i.getEase=z,i.getElements=w,i.getTargets=x,i.mapObject=r,i}({});
//# sourceMappingURL=api.js.map
