"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const t=t=>[].concat(...t),e=t=>"object"==typeof t&&!Array.isArray(t)&&"function"!=typeof t,i=(t,e)=>{let i,s,n=Object.keys(t),r={};for(let a=0,o=n.length;a<o;a++)i=n[a],s=t[i],r[i]=e(s,i,t);return r},s=t=>""+t,n=t=>{let e=parseFloat(t);return s(t).replace(s(e),"")},r=t=>s(t).trim(),a=t=>Array.isArray(t)||"string"==typeof t?("string"==typeof t&&(t=t.split(/\s+/)),t):[t],o=t=>Array.isArray(t)||"string"==typeof t?Boolean(t.length):null!=t&&null!=t&&!Number.isNaN(t),l=t=>"-"==(t=t.replace(/([A-Z])/g,(t=>`-${t.toLowerCase()}`))).charAt(0)?t.substr(1):t,u=t=>t.includes("--")?t:`${t}`.replace(/-([a-z])/g,((t,e)=>e.toUpperCase())),p=(t,e)=>{let i=[...t],s={...e};for(;i.length;){let{[i.pop()]:t,...e}=s;s=e}return s},h=(t,e)=>{let i=[...t],s={};for(let t of i)o(e[t])&&(s[t]=e[t]);return s},c=(...t)=>{let e=0,i=[],s=(t=t.map((t=>{let i=a(t),s=i.length;return s>e&&(e=s),i}))).length;for(let n=0;n<e;n++){i[n]=[];for(let e=0;e<s;e++){let s=t[e][n];o(s)&&(i[n][e]=s)}}return i},m=t=>"string"==typeof t?t.includes("%")?parseFloat(t)/100:"from"==t?0:"to"==t?1:parseFloat(t):t,f=t=>{let e=new Set,i=Object.keys(t),s=i.length;for(let n=0;n<s;n++){let s=""+i[n],r=t[s],a=s.split(","),o=a.length;for(let t=0;t<o;t++){let i=m(a[t]);e.add({...r,offset:i})}}return[...e].sort(((t,e)=>t.offset-e.offset))};class d{constructor(t){this.map=new Map(t)}getMap(){return this.map}get(t){return this.map.get(t)}keys(){return Array.from(this.map.keys())}values(){return Array.from(this.map.values())}set(t,e){return this.map.set(t,e),this}add(t){let e=this.size;return this.set(e,t),this}get size(){return this.map.size}get length(){return this.map.size}last(t=1){let e=this.keys()[this.size-t];return this.get(e)}delete(t){return this.map.delete(t)}remove(t){return this.map.delete(t),this}clear(){return this.map.clear(),this}has(t){return this.map.has(t)}entries(){return this.map.entries()}forEach(t,e){return this.map.forEach(t,e),this}[Symbol.iterator](){return this.entries()}}const g=(t="")=>e=>"string"==typeof e?e:`${e}${t}`,y=g(),b=g("px"),x=g("deg"),E=t=>e=>o(e)?a(e).map((e=>{if("number"!=typeof e&&"string"!=typeof e)return e;let i=Number(e),s=Number.isNaN(i)?"string"==typeof e?e.trim():e:i;return t(s)})):[],S=(t,e)=>a(t).map(E(e)),O=E(y),A=E(b),k=E(x),w=new d,D=(t="transparent")=>{if(t=t.trim(),w.has(t))return w.get(t);if(!CSS.supports("background-color",t))return t;let e=document.createElement("div");e.style.backgroundColor=t,document.body.appendChild(e);let{backgroundColor:i}=getComputedStyle(e);e.remove();let s=/\(([^)]+)\)?/.exec(i)?.[1].split(","),n=(3==s.length?[...s,"1"]:s).map((t=>parseFloat(t)));return w.set(t,n),n},I={translate3d:["--translate3d0","--translate3d1","--translate3d2"],translate:["--translate0","--translate1"],translateX:"--translateX",translateY:"--translateY",translateZ:"--translateZ",rotate3d:["--rotate3d0","--rotate3d1","--rotate3d2","--rotate3d3"],rotate:"--rotate",rotateX:"--rotateX",rotateY:"--rotateY",rotateZ:"--rotateZ",scale3d:["--scale3d0","--scale3d1","--scale3d2"],scale:["--scale0","--scale1"],scaleX:"--scaleX",scaleY:"--scaleY",scaleZ:"--scaleZ",skew:["--skew0","--skew1"],skewX:"--skewX",skewY:"--skewY",perspective:"--perspective"},C="registerProperty"in CSS,P=Object.keys(I),M=(t={})=>Object.keys(t).filter((t=>P.includes(t))).map((t=>{if(!C)return"";let e=[].concat(I[t]);return e.forEach((t=>{if(globalThis.RegisteredCSSVars?.[t])return;let e={name:t,inherits:!1};/translate|perspective/i.test(t)?CSS.registerProperty({...e,syntax:"<length-percentage>",initialValue:"0px"}):/rotate3d3|skew/i.test(t)?CSS.registerProperty({...e,syntax:"<angle>",initialValue:"0deg"}):/scale|rotate3d/i.test(t)?CSS.registerProperty({...e,syntax:"<number>",initialValue:/rotate3d/i.test(t)?0:1}):/rotate/i.test(t)&&CSS.registerProperty({...e,syntax:"<angle>",initialValue:"0deg"}),globalThis.RegisteredCSSVars??={},globalThis.RegisteredCSSVars[t]=!0})),`${t}(${e.map((t=>`var(${t})`))})`})).join(" "),T=(t={})=>{let e={};return P.forEach((i=>{if(!(i in t))return;let s=[].concat(t[i]).filter((t=>o(t))).map((t=>"string"==typeof t&&/\s/.test(t.trim())?t.split(/\s+/):t));if(0==s.length)return;let n=[].concat(I[i]),r=s.every((t=>Array.isArray(t))),a=1==s.length&&"scale"==i;n.forEach(((t,i)=>{let n=a?0:i,l=r?c(...s)[n]:s;if(o(l)){let i=t;/translate|perspective/i.test(i)?l=A(l):/rotate3d3|skew/i.test(i)?l=k(l):/scale|rotate3d/i.test(i)||/rotate/i.test(i)&&(l=k(l)),e[t]=l}}))})),e},v="function"==typeof Float32Array,N=(t,e)=>1-3*e+3*t,F=(t,e)=>3*e-6*t,j=t=>3*t,z=(t,e,i)=>((N(e,i)*t+F(e,i))*t+j(e))*t,R=(t,e,i)=>3*N(e,i)*t*t+2*F(e,i)*t+j(e),q=(t,e,i,s)=>{if(!(0<=t&&t<=1&&0<=i&&i<=1))throw new Error("bezier x values must be in [0, 1] range");if(t===e&&i===s)return t=>t;for(var n=v?new Float32Array(11):new Array(11),r=0;r<11;++r)n[r]=z(.1*r,t,i);const a=e=>{let s=0,r=1;for(;10!==r&&n[r]<=e;++r)s+=.1;--r;let a=s+.1*((e-n[r])/(n[r+1]-n[r])),o=R(a,t,i);return o>=.001?((t,e,i,s)=>{for(var n=0;n<4;++n){let n=R(e,i,s);if(0===n)return e;e-=(z(e,i,s)-t)/n}return e})(e,a,t,i):0===o?a:((t,e,i,s,n)=>{let r,a,o=0;do{a=e+(i-e)/2,r=z(a,s,n)-t,r>0?i=a:e=a}while(Math.abs(r)>1e-7&&++o<10);return a})(e,s,s+.1,t,i)};return t=>0===t||1===t?t:z(a(t),e,s)},L=(t,e,i)=>Math.min(Math.max(t,e),i),_=t=>Math.pow(t,2),V=t=>Math.pow(t,3),K=t=>Math.pow(t,4),U=t=>Math.pow(t,5),X=t=>Math.pow(t,6),Y=t=>1-Math.cos(t*Math.PI/2),G=t=>1-Math.sqrt(1-t*t),Z=t=>t*t*(3*t-2),$=t=>{let e,i=4;for(;t<((e=Math.pow(2,--i))-1)/11;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((3*e-2)/22-t,2)},B=(t,e=[])=>{let[i=1,s=.5]=e;const n=L(i,1,10),r=L(s,.1,2);return 0===t||1===t?t:-n*Math.pow(2,10*(t-1))*Math.sin((t-1-r/(2*Math.PI)*Math.asin(1/n))*(2*Math.PI)/r)},W=(t,e=[],i)=>{let[s=1,n=100,r=10,a=0]=e;s=L(s,.1,1e3),n=L(n,.1,1e3),r=L(r,.1,1e3),a=L(a,.1,1e3);const o=Math.sqrt(n/s),l=r/(2*Math.sqrt(n*s)),u=l<1?o*Math.sqrt(1-l*l):0,p=l<1?(l*o-a)/u:-a+o;let h=i?i*t/1e3:t;return h=l<1?Math.exp(-h*l*o)*(1*Math.cos(u*h)+p*Math.sin(u*h)):(1+p*h)*Math.exp(-h*o),0===t||1===t?t:1-h},H=new Map,Q=(t="spring")=>{if(H.has(t))return H.get(t);const e="function"==typeof t?t:ot(t),i="function"==typeof t?[]:lt(t),s=1/6;let n=0,r=0,a=0;for(;++a<1e4;)if(n+=s,1===e(n,i,null)){if(r++,r>=16)break}else r=0;const o=n*s*1e3;return H.set(t,o),o},J=(t,e=[])=>{let[i=10,s]=e;return("start"==s?Math.ceil:Math.floor)(L(t,0,1)*i)/i},tt=(t,e=[])=>{let[i,s,n,r]=e;return q(i,s,n,r)(t)},et=q(.42,0,1,1),it=t=>(e,i=[],s)=>1-t(1-e,i,s),st=t=>(e,i=[],s)=>e<.5?t(2*e,i,s)/2:1-t(-2*e+2,i,s)/2,nt=t=>(e,i=[],s)=>e<.5?(1-t(1-2*e,i,s))/2:(t(2*e-1,i,s)+1)/2,rt={steps:J,"step-start":t=>J(t,[1,"start"]),"step-end":t=>J(t,[1,"end"]),linear:t=>t,"cubic-bezier":tt,ease:t=>tt(t,[.25,.1,.25,1]),in:et,out:it(et),"in-out":st(et),"out-in":nt(et),"in-quad":_,"out-quad":it(_),"in-out-quad":st(_),"out-in-quad":nt(_),"in-cubic":V,"out-cubic":it(V),"in-out-cubic":st(V),"out-in-cubic":nt(V),"in-quart":K,"out-quart":it(K),"in-out-quart":st(K),"out-in-quart":nt(K),"in-quint":U,"out-quint":it(U),"in-out-quint":st(U),"out-in-quint":nt(U),"in-expo":X,"out-expo":it(X),"in-out-expo":st(X),"out-in-expo":nt(X),"in-sine":Y,"out-sine":it(Y),"in-out-sine":st(Y),"out-in-sine":nt(Y),"in-circ":G,"out-circ":it(G),"in-out-circ":st(G),"out-in-circ":nt(G),"in-back":Z,"out-back":it(Z),"in-out-back":st(Z),"out-in-back":nt(Z),"in-bounce":$,"out-bounce":it($),"in-out-bounce":st($),"out-in-bounce":nt($),"in-elastic":B,"out-elastic":it(B),"in-out-elastic":st(B),"out-in-elastic":nt(B),spring:W,"spring-in":W,"spring-out":it(W),"spring-in-out":st(W),"spring-out-in":nt(W)};exports.EasingFunctionKeys=Object.keys(rt);const at=t=>l(t).replace(/^ease-/,"").replace(/(\(|\s).+/,"").toLowerCase().trim(),ot=t=>{let e=at(s(t));return exports.EasingFunctionKeys.includes(e)?rt[e]:null},lt=t=>{const e=/(\(|\s)([^)]+)\)?/.exec(s(t));return e?e[2].split(",").map((t=>{let e=parseFloat(t);return Number.isNaN(e)?t.trim():e})):[]},ut=(t,e,i)=>e+(i-e)*t,pt=(t,e)=>Math.round(t*10**e)/10**e,ht=(t,e,i=3)=>{let s=e.length-1,n=L(Math.floor(t*s),0,s-1),r=e[n],a=e[n+1];return pt(ut((t-n/s)*s,r,a),i)},ct=t=>{let e=parseFloat(t);return"number"==typeof e&&!Number.isNaN(e)},mt=(t,e)=>{t=L(t,0,1);let i=e.length-1;return e[Math.round(t*i)]},ft=(t,e,i=3)=>{let s="";return ct(e[0])&&(s=n(e[0])),ht(t,e.map((t=>"number"==typeof t?t:parseFloat(t))),i)+s},dt=(t,e,i=3)=>c(...e.map((t=>D(t)))).map(((e,s)=>{let n=ht(t,e);return s<3?Math.round(n):pt(n,i)})),gt=t=>r(t).replace(/(\d|\)|\w)\s/g,(t=>t[0]+"__")).split("__").map(r).filter(o),yt=(t,e,i=3)=>e.every((t=>"number"==typeof t))?ht(t,e,i):e.every((t=>CSS.supports("color",s(t))))?`rgba(${dt(t,e,i)})`:e.some((t=>"string"==typeof t))?e.some((t=>/(\d|\)|\w)\s/.test(r(t))))?c(...e.map(gt)).map((e=>yt(t,e,i))).join(" "):e.every((t=>ct(t)))?ft(t,e,i):mt(t,e):void 0,bt=(t={})=>{let e="string"==typeof t||"function"==typeof t,{easing:i="spring(1, 100, 10, 0)",numPoints:s=100,decimal:n=3,duration:r}=e?{easing:t}:t;return{easing:i,numPoints:s,decimal:n,duration:r}},xt=new Map,Et=({easing:t,numPoints:e,duration:i}={})=>{const s=[],n=`${t}${e}`;if(xt.has(n))return xt.get(n);const r="function"==typeof t?t:ot(t),a="function"==typeof t?[]:lt(t);for(let t=0;t<e;t++)s[t]=r(t/(e-1),a,i);return xt.set(n,s),s},St=(t={})=>{if("string"==typeof t.easing){let e=at(t.easing);/(spring|spring-in)$/i.test(e)&&(t.duration=Q(t.easing))}},Ot=(t,e={})=>{let i=bt(e);return St(i),Et(i).map((e=>yt(e,t,i.decimal)))},At=(t={})=>{let{easing:e,numPoints:s,decimal:n,duration:r,...a}=t,l={easing:e,numPoints:s,decimal:n,duration:r};St(l);let u=i(a,(t=>Ot(t,l))),p={};return o(r)?p={duration:r}:o(l.duration)&&(p={duration:l.duration}),Object.assign({},u,p)},kt={translate:t=>S(t,b),translate3d:t=>S(t,b),translateX:t=>A(t),translateY:t=>A(t),translateZ:t=>A(t),rotate:t=>S(t,x),rotate3d:t=>S(t,y),rotateX:t=>k(t),rotateY:t=>k(t),rotateZ:t=>k(t),scale:t=>S(t,y),scale3d:t=>S(t,y),scaleX:t=>O(t),scaleY:t=>O(t),scaleZ:t=>O(t),skew:t=>S(t,x),skewX:t=>k(t),skewY:t=>k(t),perspective:t=>A(t)},wt=Object.keys(kt),Dt=t=>{let e,i,s=Object.keys(t),n={};for(let r=0,a=s.length;r<a;r++)e=u(s[r]),i=t[s[r]],n[e]=i;return n},It=(t,e)=>{let i="",s=t.length;for(let n=0;n<s;n++){let s=t[n],r=e[n];o(r)&&(i+=`${s}(${Array.isArray(r)?r.join(", "):r}) `)}return i.trim()},Ct=["margin","padding","size","width","height","left","right","top","bottom","radius","gap","basis","inset","outline-offset","translate","perspective","thickness","position","distance","spacing"].map(u).join("|"),Pt=(t,e)=>(e=e??Math.max(...t.map((t=>t.length))),t.map((t=>{let i=t.length;return t.every((t=>Array.isArray(t)))?c(...Pt(c(...t),e)):i!==e?Array.from(Array(e),((s,n)=>{let r=1==i?Array(2).fill(t[0]):t;return ft(n/(e-1),r)})):t}))),Mt=t=>{let e,n,a=Dt(t);if(C)e=Object.assign({},T(a),p(P,a));else{let t=Object.keys(a).filter((t=>wt.includes(t))),i=t.map((t=>kt[t](a[t])));i=Pt(i),n=c(...i).filter(o).map((e=>It(t,e))),e=p(wt,a)}return e=i(e,((t,e)=>{let i;if(!/color|shadow/i.test(e)){let s=/rotate/i.test(e),n=new RegExp(Ct,"i").test(e)||CSS.supports(l(e),"1px");if(s||n)return s?i=k:n&&(i=A),i(t).map((t=>{let e=r(t).split(/\s+/);return i(e).join(" ")}))}return[].concat(t).map(s)})),Object.assign({},o(n)?{transform:n}:null,e)},Tt=t=>t.map((t=>{let e=Dt(t);if(C)return{rest:Object.assign({},T(e),p(P,e)),transformFunctions:null};let{translate:i,translate3d:s,translateX:n,translateY:r,translateZ:a,rotate:o,rotate3d:l,rotateX:u,rotateY:h,rotateZ:c,scale:m,scale3d:f,scaleX:d,scaleY:g,scaleZ:y,skew:b,skewX:x,skewY:E,perspective:S,...w}=e;return i=A(i),s=A(s),n=A(n)[0],r=A(r)[0],a=A(a)[0],o=k(o),l=O(l),u=k(u)[0],h=k(h)[0],c=k(c)[0],m=O(m),f=O(f),d=O(d)[0],g=O(g)[0],y=O(y)[0],b=k(b),x=k(x)[0],E=k(E)[0],S=A(S)[0],{rest:w,transformFunctions:[s,i,n,r,a,l,o,u,h,c,f,m,d,g,y,b,x,E,S]}})).map((({rest:t,transformFunctions:e})=>{let n=C?null:It(wt,e);return t=i(t,((t,e)=>{let i;if(t=s(t),!/color|shadow/i.test(e)){let s=/rotate/i.test(e),n=new RegExp(Ct,"i").test(e);if(s||n)return s?i=k:n&&(i=A),i(t).join(" ")}return t})),Object.assign({},o(n)?{transform:n}:null,t)})),vt=({callback:t=(()=>{}),scope:e=null,name:i="event"})=>({callback:t,scope:e,name:i});class Nt extends d{constructor(t="event"){super(),this.name=t}}const Ft=t=>"object"==typeof t&&!Array.isArray(t)&&"function"!=typeof t;class jt extends d{constructor(){super()}getEvent(t){let e=this.get(t);return e instanceof Nt?e:(this.set(t,new Nt(t)),this.get(t))}newListener(t,e,i){let s=this.getEvent(t);return s.add(vt({name:t,callback:e,scope:i})),s}on(t,e,i){if(null==t||null==t)return this;"string"==typeof t&&(t=t.trim().split(/\s+/));let s,n,r=Ft(t),a=r?e:i;return r||(n=e),Object.keys(t).forEach((e=>{s=r?e:t[e],r&&(n=t[e]),this.newListener(s,n,a)}),this),this}removeListener(t,e,i){let s=this.get(t);if(s instanceof Nt&&e){let n=vt({name:t,callback:e,scope:i});s.forEach(((t,e)=>{if(t.callback===n.callback&&t.scope===n.scope)return s.remove(e)}))}return s}off(t,e,i){if(null==t||null==t)return this;"string"==typeof t&&(t=t.trim().split(/\s+/));let s,n,r=Ft(t),a=r?e:i;return r||(n=e),Object.keys(t).forEach((e=>{s=r?e:t[e],r&&(n=t[e]),"function"==typeof n?this.removeListener(s,n,a):this.remove(s)}),this),this}once(t,e,i){if(null==t||null==t)return this;"string"==typeof t&&(t=t.trim().split(/\s+/));let s=Ft(t);return Object.keys(t).forEach((n=>{let r=s?n:t[n],a=s?t[n]:e,o=s?e:i,l=(...t)=>{a.apply(o,t),this.removeListener(r,l,o)};this.newListener(r,l,o)}),this),this}emit(t,...e){return null==t||null==t||("string"==typeof t&&(t=t.trim().split(/\s+/)),t.forEach((t=>{let i=this.get(t);i instanceof Nt&&i.forEach((t=>{let{callback:i,scope:s}=t;i.apply(s,e)}))}),this)),this}clear(){return((t,e,...i)=>{t.forEach((t=>{t[e](...i)}))})(this,"clear"),super.clear(),this}}const zt=t=>"string"==typeof t?Array.from(document.querySelectorAll(t)):[t],Rt=e=>Array.isArray(e)?t(e.map(Rt)):"string"==typeof e||e instanceof Node?zt(e):e instanceof NodeList||e instanceof HTMLCollection?Array.from(e):[],qt=(t,e,i)=>"function"==typeof t?t.apply(i,e):t,Lt=(t,e,s)=>i(t,(t=>qt(t,e,s))),_t={in:"ease-in",out:"ease-out","in-out":"ease-in-out","in-sine":"cubic-bezier(0.47, 0, 0.745, 0.715)","out-sine":"cubic-bezier(0.39, 0.575, 0.565, 1)","in-out-sine":"cubic-bezier(0.445, 0.05, 0.55, 0.95)","in-quad":"cubic-bezier(0.55, 0.085, 0.68, 0.53)","out-quad":"cubic-bezier(0.25, 0.46, 0.45, 0.94)","in-out-quad":"cubic-bezier(0.455, 0.03, 0.515, 0.955)","in-cubic":"cubic-bezier(0.55, 0.055, 0.675, 0.19)","out-cubic":"cubic-bezier(0.215, 0.61, 0.355, 1)","in-out-cubic":"cubic-bezier(0.645, 0.045, 0.355, 1)","in-quart":"cubic-bezier(0.895, 0.03, 0.685, 0.22)","out-quart":"cubic-bezier(0.165, 0.84, 0.44, 1)","in-out-quart":"cubic-bezier(0.77, 0, 0.175, 1)","in-quint":"cubic-bezier(0.755, 0.05, 0.855, 0.06)","out-quint":"cubic-bezier(0.23, 1, 0.32, 1)","in-out-quint":"cubic-bezier(0.86, 0, 0.07, 1)","in-expo":"cubic-bezier(0.95, 0.05, 0.795, 0.035)","out-expo":"cubic-bezier(0.19, 1, 0.22, 1)","in-out-expo":"cubic-bezier(1, 0, 0, 1)","in-circ":"cubic-bezier(0.6, 0.04, 0.98, 0.335)","out-circ":"cubic-bezier(0.075, 0.82, 0.165, 1)","in-out-circ":"cubic-bezier(0.785, 0.135, 0.15, 0.86)","in-back":"cubic-bezier(0.6, -0.28, 0.735, 0.045)","out-back":"cubic-bezier(0.175, 0.885, 0.32, 1.275)","in-out-back":"cubic-bezier(0.68, -0.55, 0.265, 1.55)"},Vt=Object.keys(_t),Kt=(t="ease")=>{let e=l(t).replace(/^ease-/,"");return Vt.includes(e)?_t[e]:t},Ut={keyframes:[],offset:[],loop:1,delay:0,speed:1,endDelay:0,easing:"ease",timelineOffset:0,autoplay:!0,duration:1e3,fillMode:"none",direction:"normal",padEndDelay:!1,timeline:document.timeline,extend:{}},Xt=t=>{let{options:e,...i}=t,s=e instanceof Bt?e.options:Array.isArray(e)?e?.[0]?.options:e;return Object.assign({},s,i)},Yt=["easing","loop","endDelay","duration","speed","delay","timelineOffset","direction","extend","fillMode","composite"],Gt=["keyframes","padEndDelay","onfinish","oncancel","autoplay","target","targets","timeline"],Zt=[...Yt,...Gt],$t=class{constructor(t={}){this.options={},this.initialOptions={},this.properties={},this.totalDuration=0,this.totalDurationOptions={},this.maxDuration=0,this.minDelay=1/0,this.maxSpeed=1/0,this.maxEndDelay=0,this.timelineOffset=0,this.emitter=new jt,this.targets=new d,this.targetIndexes=new WeakMap,this.keyframeEffects=new WeakMap,this.computedOptions=new WeakMap,this.animations=new WeakMap,this.computedKeyframes=new WeakMap,this.loop=this.loop.bind(this),this.onVisibilityChange=this.onVisibilityChange.bind(this),this.on("error",console.error),this.updateOptions(t),this.mainAnimation&&(this.visibilityPlayState=this.getPlayState(),$t.pauseOnPageHidden&&document.addEventListener("visibilitychange",this.onVisibilityChange,!1)),this.newPromise()}static requestFrame(t=0){let e=1e3/$t.FRAME_RATE,i=t-$t.FRAME_START_TIME;i>e&&($t.FRAME_START_TIME=t-i%e,$t.RUNNING.forEach((t=>{t.emitter.getEvent("update").length<=0?t.stopLoop():t.loop()}))),$t.RUNNING.size>0?$t.animationFrame=window.requestAnimationFrame($t.requestFrame):$t.cancelFrame()}static cancelFrame(){window.cancelAnimationFrame($t.animationFrame),$t.animationFrame=null}loop(){this.emit("update",this.getProgress(),this)}stopLoop(){$t.RUNNING.delete(this)}onVisibilityChange(){document.hidden?(this.visibilityPlayState=this.getPlayState(),this.is("running")&&(this.loop(),this.pause())):"running"==this.visibilityPlayState&&this.is("paused")&&this.play()}newPromise(){return this.promise=new Promise(((t,e)=>{this.emitter?.once?.("finish",(()=>t([this]))),this.emitter?.once?.("error",(t=>e(t)))})),this.promise}then(t,e){return t=t?.bind(this),e=e?.bind(this),this.promise?.then?.(t,e),this}catch(t){return t=t?.bind(this),this.promise?.catch?.(t),this}finally(t){return t=t?.bind(this),this.promise?.finally?.(t),this}allAnimations(t){return this.targets.forEach((e=>{let i=this.keyframeEffects.get(e),s=this.animations.get(i);return t(s,e)})),this}all(t){return this.mainAnimation&&t(this.mainAnimation,this.mainElement),this.allAnimations(t),this}beginEvent(){0==this.getProgress()&&this.emit("begin",this)}play(){let t=this.getPlayState();return this.beginEvent(),this.all((t=>t.play())),this.emit("play",t,this),this.emit("playstate-change",t,this),this.loop(),$t.RUNNING.add(this),$t.requestFrame(),this}pause(){let t=this.getPlayState();return this.all((t=>t.pause())),this.emit("pause",t,this),this.emit("playstate-change",t,this),this.stopLoop(),this}reverse(){return this.all((t=>t.reverse())),this}reset(){return this.setProgress(0),this.options.autoplay?this.play():this.pause(),this}commitStyles(){return this.all((t=>t?.commitStyles())),this}persist(){return this.all((t=>t?.persist())),this}cancel(){return this.all((t=>t.cancel())),this}finish(){return this.all((t=>t.finish())),this}stop(){this.cancel(),this.stopLoop(),document.removeEventListener("visibilitychange",this.onVisibilityChange,!1),this.targets.forEach((t=>this.removeTarget(t))),this.emit("stop"),this.emitter.clear(),this.mainkeyframeEffect=null,this.mainAnimation=null,this.mainElement?.remove?.(),this.mainElement=null,this.promise=null,this.computedOptions=null,this.animations=null,this.keyframeEffects=null,this.emitter=null,this.targets=null,this.options=null,this.properties=null}getAnimation(t){let e=this.keyframeEffects.get(t);return this.animations.get(e)}getTiming(t){return{...this.computedOptions.get(t)??{},...this.keyframeEffects.get(t).getTiming?.()??{}}}getCurrentTime(){return this.mainAnimation.currentTime}getProgress(){return this.getCurrentTime()/this.totalDuration*100}getSpeed(){return this.mainAnimation.playbackRate}getPlayState(){return this.mainAnimation.playState}is(t){return this.getPlayState()==t}setCurrentTime(t){return this.all((e=>e.currentTime=t)),this.emit("update",this.getProgress()),this}setProgress(t){let e=t/100*this.totalDuration;return this.setCurrentTime(e),this}setSpeed(t=1){return this.maxSpeed=t,this.all((e=>{e.updatePlaybackRate?e.updatePlaybackRate(t):e.playbackRate=t})),this}createArrayOfComputedOptions(t,e){let i=[],s=t=>Object.assign({easing:t("easing"),iterations:t("loop"),direction:t("direction"),endDelay:t("endDelay"),duration:t("duration"),speed:t("speed"),delay:t("delay"),timelineOffset:t("timelineOffset"),keyframes:t("keyframes"),fill:t("fillMode"),composite:t("composite")},t("extend")??{});if(0==this.targets.size){let{delay:e,duration:i,iterations:n,endDelay:r,speed:a,timelineOffset:o}=s((e=>{let i=t[e]??this.options[e]??Ut[e];return"function"!=typeof i?i:Ut[e]}));o=Number(o),n=Number(n),i=Number(i),r=Number(r),a=Number(a),e=Number(e),this.timelineOffset=o,this.minDelay=e,this.maxSpeed=a,this.maxDuration=i,this.maxEndDelay=r,this.totalDuration=e+o+i*n+r,this.totalDurationOptions={delay:e,duration:i,iterations:n,endDelay:r,speed:a,timelineOffset:o,totalDuration:this.totalDuration}}return this.targets.forEach(((n,r)=>{let a=this.computedOptions.get(n)??{},o=s((e=>{let i=e;return"loop"==e&&(i="iterations"),"fillMode"==e&&(i="fill"),t[e]??a[i]??this.options[e]??Ut[e]})),l=Lt(o,[r,e,n],this);if("string"==typeof l.easing||Array.isArray(l.easing)){let{easing:t}=l;l.easing=Array.isArray(t)?t.map((t=>Kt(t))):Kt(t)}!0===l.iterations&&(l.iterations=1/0);let{timelineOffset:u,speed:p,endDelay:h,delay:c,duration:m,iterations:f,...d}=l;u=Number(u),f=Number(f),m=Number(m),h=Number(h),p=Number(p),c=Number(c),this.timelineOffset=u??this.timelineOffset,this.minDelay>c&&(this.minDelay=c),this.maxSpeed>p&&(this.maxSpeed=p),this.maxDuration<m&&(this.maxDuration=m),this.maxEndDelay<h&&(this.maxEndDelay=h);let g=c+u+m*f+h;this.totalDuration<g&&(this.totalDuration=g,this.totalDurationOptions={delay:c,duration:m,totalDuration:g,iterations:f,endDelay:h,speed:p,timelineOffset:u}),i[r]={...d,speed:p,tempDurations:g,endDelay:h,delay:c+u,duration:m,iterations:f,timelineOffset:u}}),this),i}createAnimations(t,s){let{arrOfComputedOptions:n,padEndDelay:r,oldCSSProperties:a,onfinish:l,oncancel:u,timeline:h}=t;this.targets.forEach(((t,c)=>{let d,{speed:g,keyframes:y,tempDurations:b,timelineOffset:x,...E}=n[c];r&&0==E.endDelay&&Math.abs(E.iterations)!=Math.abs(1/0)&&(E.endDelay=this.totalDuration-b);let S,O,A=y;e(A)&&(A=f(A));let k,w,D=this.computedKeyframes.get(t)??{},P="transform"in this.properties?D:p(["transform"],D),T=Object.assign({},a,P),v=i(T,((t,e)=>this.properties[e]??t));if(O=o(A)?A:v,Array.isArray(O))S=O.map((t=>{let{easing:e,offset:i,...s}=p(["speed","loop"],t);return Object.assign({},s,"string"==typeof e?{easing:Kt(e)}:null,"string"==typeof i||"number"==typeof i?{offset:m(i)}:null)})),d=M(I),S=Tt(S);else{let e=p(["keyframes"],O),{offset:i,...n}=Lt(e,[c,s,t],this);d=M(Dt(n)),n=Mt(n);let r=i;S=Object.assign({},n,o(r)?{offset:r.map(m)}:null)}this.keyframeEffects.has(t)?(w=this.keyframeEffects.get(t),k=this.animations.get(w),w?.setKeyframes?.(S),w?.updateTiming?.(E)):(w=new KeyframeEffect(t,S,E),k=new Animation(w,h),this.keyframeEffects.set(t,w),this.animations.set(w,k)),k.updatePlaybackRate?k.updatePlaybackRate(g):k.playbackRate=g,k.onfinish=()=>{"function"==typeof l&&l.call(this,t,c,s,k)},k.oncancel=()=>{"function"==typeof u&&u.call(this,t,c,s,k)},C&&Object.assign(t.style,{transform:d}),this.computedOptions.set(t,E),this.computedKeyframes.set(t,S)}))}updateOptions(t={}){try{let e=Xt(t);this.initialOptions=e,this.options=Object.assign({},Ut,this.options,e);let{padEndDelay:i,autoplay:s,target:n,targets:r,timeline:a,onfinish:o,oncancel:l,...u}=p(Yt,this.options);this.properties=p(Zt,e);let h=this.targets.values(),c=[...new Set([...h,...Rt(r),...Rt(n)])];this.targets.clear(),c.forEach(((t,e)=>{this.targets.set(e,t),this.targetIndexes.set(t,e)}));let m=this.targets.size,f=this.createArrayOfComputedOptions(e,m);if(this.createAnimations({arrOfComputedOptions:f,padEndDelay:i,oldCSSProperties:u,onfinish:o,oncancel:l,timeline:a},m),this.mainAnimation?(this.mainkeyframeEffect?.updateTiming?.({duration:this.totalDuration}),(!this.mainkeyframeEffect.setKeyframes||!this.mainkeyframeEffect.updateTiming)&&console.warn("@okikio/animate - `KeyframeEffect.setKeyframes` and/or `KeyframeEffect.updateTiming` are not supported in this browser.")):(this.mainkeyframeEffect=new KeyframeEffect(this.mainElement,null,{duration:this.totalDuration}),this.mainAnimation=new Animation(this.mainkeyframeEffect,a)),this.mainAnimation.updatePlaybackRate?this.mainAnimation.updatePlaybackRate(this.maxSpeed):this.mainAnimation.playbackRate=this.maxSpeed,this.mainAnimation.onfinish=()=>{if(this.mainAnimation){let t=this.getPlayState();this.emit("playstate-change",t,this),this.loop(),this.stopLoop()}this.emit("finish",this)},this.mainAnimation.oncancel=()=>{if(this.mainAnimation){let t=this.getPlayState();this.emit("playstate-change",t,this),this.loop(),this.stopLoop()}this.emit("cancel",this)},s){let t=window.setTimeout((()=>{this.emit("begin",this);let e=this.getPlayState();this.emit("playstate-change",e,this),t=window.clearTimeout(t)}),0);this.play()}else this.pause()}catch(t){this.emit("error",t)}}add(t){let e=this.getProgress(),i=this.is("running"),s=this.is("paused");return this.updateOptions({target:t}),this.setProgress(e),i?this.play():s&&this.pause(),this}removeTarget(t){let e=this.keyframeEffects.get(t);this.animations.delete(e),e=null,this.computedKeyframes.delete(t),this.computedOptions.delete(t),this.keyframeEffects.delete(t);let i=this.targetIndexes.get(t);return this.targets.delete(i),this.targetIndexes.delete(t),this}remove(t){this.removeTarget(t);let e=new Set([].concat(this.targets.values()));this.options.target=[...e],this.options.targets=[],e.clear(),e=null;let i=this.getProgress(),s=this.is("running"),n=this.is("paused");return this.updateOptions(),s?this.play():n&&this.pause(),this.setProgress(i),this}on(t,e,i){return i=i??this,this.emitter?.on?.(t,e??i,i),this.emitter.getEvent("update").length>0&&($t.RUNNING.add(this),null==$t.animationFrame&&$t.requestFrame()),this}off(t,e,i){return i=i??this,this.emitter?.off?.(t,e??i,i),this}emit(t,...e){return this.emitter?.emit?.(t,...e),this}toJSON(){return this.options}get[Symbol.toStringTag](){return"Animate"}};let Bt=$t;Bt.RUNNING=new Set,Bt.FRAME_RATE=60,Bt.FRAME_START_TIME=0,Bt.pauseOnPageHidden=!0;exports.UIDCount=0;const Wt=document.createElement("div"),Ht=()=>{o(Wt.id)||(Wt.id="empty-tween-el-container",Wt.style.setProperty("display","none"),Wt.style.setProperty("contain","paint layout size"),document.body.appendChild(Wt));let t=document.createElement("div");return t.id="empty-animate-el-"+exports.UIDCount++,t.style.setProperty("display","none"),Wt.appendChild(t),t};class Qt extends Bt{stop(){this.targets.forEach((t=>t?.remove?.())),super.stop()}}const Jt=(t={})=>{let{easing:e,decimal:i,numPoints:s,opacity:n,...r}=Xt(t),a=h(Zt,r),o=e;if("string"==typeof e){let t=at(e);o=Vt.includes(t)||["linear","steps","step-start","step-end"].includes(t)?Kt(e):exports.EasingFunctionKeys.includes(t)?ot(e):e}return{..."function"==typeof o?At({opacity:[0,1],easing:e,decimal:i,numPoints:s}):{opacity:[0,1],easing:e},...a}};class te extends Qt{constructor(){super(...arguments),this.updateListeners=new d}updateOptions(t={}){let e=Xt(t),s=this.targets.size>1?null:{target:Ht()},n=Object.assign({},Jt(p(["target","targets"],e)),s);super.updateOptions(n);let r=p(Zt,e);try{this.updateListeners=this.updateListeners??new d,this.updateListeners.forEach(((t,e)=>{this.off("update",t),this.updateListeners.remove(e)}),this);let{target:t,targets:s}=e,n=[...new Set([...Rt(s),...Rt(t)])],a=n.length,o=this.targets.get(0),l=window.getComputedStyle(o);n.forEach(((t,s)=>{i(r,((i,n)=>{let r,o=t.getAttribute(n);this.on("update",r=()=>{let r,u=Number(l.getPropertyValue("opacity"));r="function"==typeof i?i(u,s,a,t):yt(u,Array.isArray(i)?i:[o,i],e.decimal),t.setAttribute(n,""+r)}),this.updateListeners.add(r)}))}),this)}catch(t){this?.stopLoop(),this?.emit?.("error",t)}return this}}const ee=(t,e={})=>{const{grid:i,axis:s,from:r=0,easing:a,direction:o="normal"}=e,l=Array.isArray(t),u=l?t.length-1:null,p=parseFloat(l?t[0]:t),h=l?parseFloat(t[u]):0,{start:c=(l?p:0)}=e,m=n(l?t[u]:t)||0,f="function"==typeof a?a:ot(a),d="function"==typeof a?[]:lt(a);let g,y=[],b=0,x=r;return/from/i.test(r)&&(x=0),(t,e)=>{if(/center/i.test(r)&&(x=(e-1)/2),/last/i.test(r)&&(x=e-1),0==y.length){for(let t=0;t<e;t++)if(Array.isArray(i)){const e="center"!==r?x%i[0]:(i[0]-1)/2,n="center"!==r?Math.floor(x/i[0]):(i[1]-1)/2,a=e-t%i[0],o=n-Math.floor(t/i[0]);let l;l="x"===s?-a:"y"===s?-o:Math.sqrt(a*a+o*o),y.push(l)}else y.push(Math.abs(x-t));b=Math.max(...y),g=l?(h-p)/b:p,"function"==typeof f&&(y=y.map((t=>f(t/b,d)*b))),/reverse/i.test(o)&&y.reverse()}return c+g*(Math.round(100*y[t])/100)+m}},ie=(t,e)=>"string"==typeof t?/^\=/.test(t)?parseFloat(t.replace("=","")):parseFloat(t)+e:t+e;class se{constructor(t={}){this.animateInstances=new d,this.initialOptions={},this.mainInstance=new Bt({duration:0}),this.initialOptions=Object.assign({},Ut,Xt(t)),this.totalDuration=0,this.maxDuration=0}get totalDuration(){return this.mainInstance.totalDuration}set totalDuration(t){this.mainInstance.totalDuration=t}get maxDuration(){return this.mainInstance.maxDuration}set maxDuration(t){this.mainInstance.maxDuration=t}get minDelay(){return this.mainInstance.minDelay}set minDelay(t){this.mainInstance.minDelay=t}get maxSpeed(){return this.mainInstance.maxSpeed}set maxSpeed(t){this.mainInstance.maxSpeed=t}get maxEndDelay(){return this.mainInstance.maxEndDelay}set maxEndDelay(t){this.mainInstance.maxEndDelay=t}get timelineOffset(){return this.mainInstance.timelineOffset}set timelineOffset(t){this.mainInstance.timelineOffset=t}get options(){return this.mainInstance.options}set options(t){this.mainInstance.options=Xt(t)}get emitter(){return this.mainInstance.emitter}get promise(){return this.mainInstance.promise}add(t={},e=0){let i,s=Object.assign({},Ut,this.initialOptions,t instanceof Bt?t.initialOptions:Xt(t));return s.timelineOffset=ie(e,this.totalDuration),s.autoplay=this.initialOptions.autoplay,t instanceof Bt?(i=t,i.updateOptions(s)):i=new Bt(s),this.animateInstances.add(i),this.updateTiming(),this}updateTiming(){let t=this.animateInstances.values(),e=Math.max(...t.map((t=>t.totalDuration)));return this.mainInstance.updateOptions({autoplay:this.initialOptions.autoplay,duration:e,delay:Math.max(...t.map((t=>t.minDelay))),endDelay:e-Math.max(...t.map((t=>t.totalDuration-t.maxEndDelay)))}),this}remove(t){let e=this.animateInstances.size;if(this.animateInstances.has(t)){let i=this.animateInstances.get(t),{totalDuration:s,timelineOffset:n}=i.totalDurationOptions,r=Number(s)-Number(n);for(let i=t;i<e;i++){let t=this.animateInstances.get(i);t.updateOptions({timelineOffset:t.timelineOffset-r})}return this.animateInstances.remove(t),this.updateTiming(),i}return null}then(t,e){return t=t?.bind(this),e=e?.bind(this),this.mainInstance?.then?.(t,e),this}catch(t){return t=t?.bind(this),this.mainInstance?.catch?.(t),this}finally(t){return t=t?.bind(this),this.mainInstance?.finally?.(t),this}allInstances(t){return this.animateInstances.forEach(t),this}all(t){return this.mainInstance&&t(this.mainInstance),this.allInstances(t),this}play(){return this.all((t=>t.play())),this}pause(){return this.all((t=>t.pause())),this}reverse(){return this.all((t=>t.reverse())),this}reset(){return this.all((t=>t.reset())),this}cancel(){return this.all((t=>t.cancel())),this}finish(){return this.all((t=>t.finish())),this}stop(){this.all((t=>t.stop())),this.animateInstances.clear(),this.mainInstance=null,this.animateInstances=null}getCurrentTime(){return this.mainInstance.getCurrentTime()}getProgress(){return this.mainInstance.getProgress()}getPlayState(){return this.mainInstance.getPlayState()}is(t){return this.mainInstance.is(t)}setCurrentTime(t){return this.all((e=>e.setCurrentTime(t))),this}setProgress(t){return this.all((e=>e.setProgress(t))),this}setSpeed(t=1){return this.all((e=>e.setSpeed(t))),this}on(t,e,i){return i=i??this,this.mainInstance?.on?.(t,e??i,i),this}off(t,e,i){return i=i??this,this.mainInstance?.off?.(t,e??i,i),this}emit(t,...e){return this.mainInstance?.emit?.(t,...e),this}toJSON(){return this.options}get[Symbol.toStringTag](){return"Timeline"}}exports.ALL_TIMING_KEYS=Zt,exports.Animate=Bt,exports.AnimateAttributes=te,exports.ApplyCustomEasing=At,exports.Back=Z,exports.Bezier=tt,exports.Bounce=$,exports.CSSArrValue=S,exports.CSSCamelCase=Dt,exports.CSSPXDataType=Ct,exports.CSSValue=E,exports.CSSVarSupport=C,exports.CSS_CACHE=w,exports.Circ=G,exports.ComplexEasingSyntax=at,exports.ComplexStrtoArr=gt,exports.Cubic=V,exports.CustomEasing=Ot,exports.CustomEasingOptions=bt,exports.DefaultAnimationOptions=Ut,exports.DestroyableAnimate=Qt,exports.EASINGS=_t,exports.EFFECTS={},exports.EaseInOut=st,exports.EaseOut=it,exports.EaseOutIn=nt,exports.EasingDurationCache=H,exports.EasingFunctions=rt,exports.EasingKeys=Vt,exports.EasingPts=Et,exports.Elastic=B,exports.EmptyTweenElContainer=Wt,exports.Expo=X,exports.FUNCTION_SUPPORTED_TIMING_KEYS=Yt,exports.GetEase=Kt,exports.GetEasingFunction=ot,exports.INTINITE_LOOP_LIMIT=1e4,exports.KeyframeParse=f,exports.NOT_FUNCTION_SUPPORTED_TIMING_KEYS=Gt,exports.ParseTransformableCSSKeyframes=Tt,exports.ParseTransformableCSSProperties=Mt,exports.Quad=_,exports.Quart=K,exports.Quint=U,exports.Sine=Y,exports.Spring=W,exports.SpringEasing=(t,e={})=>{let i=bt(e),{duration:s}=i;return St(i),[Ot(t,i),o(s)?s:i.duration]},exports.StaggerCustomEasing=(t,e={})=>{let i=e.stagger??{};return(s,n)=>{let r=t.map(((e,r)=>{let a=t[Math.max(0,r-1)];return ee([a,e],i)(s,n)}));return Ot(r,e)}},exports.Steps=J,exports.Timeline=se,exports.TransformFunctionNames=wt,exports.TransformFunctions=kt,exports.TweenCache=xt,exports.UnitDEG=x,exports.UnitDEGCSSValue=k,exports.UnitLess=y,exports.UnitLessCSSValue=O,exports.UnitPX=b,exports.UnitPXCSSValue=A,exports.addCSSUnit=g,exports.animate=(t={})=>new Bt(t),exports.arrFill=Pt,exports.camelCase=u,exports.computeOption=qt,exports.convertToDash=l,exports.createEmptyEl=Ht,exports.createTransformProperty=It,exports.createTransformValue=M,exports.createTweenOptions=Jt,exports.easein=et,exports.flatten=t,exports.getEasingDuration=Q,exports.getElements=zt,exports.getTargets=Rt,exports.getUnit=n,exports.interpolateColor=dt,exports.interpolateComplex=yt,exports.interpolateNumber=ht,exports.interpolateString=ft,exports.interpolateUsingIndex=mt,exports.isEmpty=t=>{for(let e in t)return!1;return!0},exports.isNumberLike=ct,exports.isObject=e,exports.isValid=o,exports.limit=L,exports.mapAnimationOptions=Lt,exports.mapObject=i,exports.omit=p,exports.parseEasingParameters=lt,exports.parseOffset=m,exports.parseOptions=Xt,exports.pick=h,exports.random=(t,e)=>Math.floor(Math.random()*(e-t+1))+t,exports.registerEasingFunction=(t,e)=>{Object.assign(rt,{[t]:e}),exports.EasingFunctionKeys=Object.keys(rt)},exports.registerEasingFunctions=(...t)=>{Object.assign(rt,...t),exports.EasingFunctionKeys=Object.keys(rt)},exports.relativeTo=ie,exports.scale=ut,exports.stagger=ee,exports.timeline=(t={})=>new se(t),exports.toArr=a,exports.toCSSVars=T,exports.toFixed=pt,exports.toRGBAArr=D,exports.toStr=s,exports.transformCSSVars=I,exports.transformProperyNames=P,exports.transpose=c,exports.trim=r,exports.tweenAttr=(t={})=>new te(t);