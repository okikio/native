class t{constructor(t){this.map=new Map(t)}getMap(){return this.map}get(t){return this.map.get(t)}keys(){return Array.from(this.map.keys())}values(){return[...this.map.values()]}set(t,e){return this.map.set(t,e),this}add(t){return this.set(this.size,t),this}get size(){return this.map.size}last(t=1){let e=this.keys()[this.size-t];return this.get(e)}prev(){return this.last(2)}delete(t){return this.map.delete(t),this}clear(){return this.map.clear(),this}has(t){return this.map.has(t)}entries(){return this.map.entries()}forEach(t=((...t)=>{}),e){return this.map.forEach(t,e),this}[Symbol.iterator](){return this.entries()}methodCall(t,...e){return this.forEach(r=>{r[t](...e)}),this}async asyncMethodCall(t,...e){for await(let[,r]of this.map)await r[t](...e);return this}}export{t as Manager};
//# sourceMappingURL=api.modern.js.map
