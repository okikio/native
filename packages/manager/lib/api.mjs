class t{constructor(t){this.map=new Map(t)}getMap(){return this.map}get(t){return this.map.get(t)}keys(){return Array.from(this.map.keys())}values(){return Array.from(this.map.values())}set(t,e){return this.map.set(t,e),this}add(t){let e=this.size;return this.set(e,t),this}get size(){return this.map.size}get length(){return this.map.size}last(t=1){let e=this.keys()[this.size-t];return this.get(e)}delete(t){return this.map.delete(t)}remove(t){return this.map.delete(t),this}clear(){return this.map.clear(),this}has(t){return this.map.has(t)}entries(){return this.map.entries()}forEach(t,e){return this.map.forEach(t,e),this}[Symbol.iterator](){return this.entries()}}const e=(t,e,...r)=>{t.forEach((t=>{t[e](...r)}))};export{t as Manager,t as default,e as methodCall};