class d{constructor(a){this.map=new Map(a)}getMap(){return this.map}get(a){return this.map.get(a)}keys(){return Array.from(this.map.keys())}values(){return Array.from(this.map.values())}set(a,b){return this.map.set(a,b),this}add(a){return this.set(this.size,a),this}get size(){return this.map.size}last(a=1){let b=this.keys()[this.size-a];return this.get(b)}prev(){return this.last(2)}delete(a){return this.map.delete(a),this}clear(){return this.map.clear(),this}has(a){return this.map.has(a)}entries(){return this.map.entries()}forEach(a=(...c)=>{},b){return this.map.forEach(a,b),this}[Symbol.iterator](){return this.entries()}methodCall(a,...b){return this.forEach(c=>{c[a](...b)}),this}async asyncMethodCall(a,...b){for(let[,c]of this.map)await c[a](...b);return this}}export{d as Manager};
//# sourceMappingURL=api.mjs.map
