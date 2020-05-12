/**
 * A service that interacts with the DOM
 *
 * @abstract
 * @extends {Component}
 */
// export class AnchorLink extends Component {
// 	linkHash: any;
// 	/**
// 	 * Creates an instance of the Component AnchorLink
// 	 *
// 	 * @memberof AnchorLink
// 	 * @constructor
// 	 */
// 	constructor() {
// 		super(Config.anchorLink);
// 	}
// 	/**
// 	 * Callback called from click event.
// 	 *
// 	 * @private
// 	 * @param {MouseEvent} evt
// 	 */
// 	onClick(evt: LinkEvent) {
// 		/**
// 		 * @type {HTMLElement|Node|EventTarget}
// 		 */
// 		let el: HTMLElement | Node | EventTarget = (evt as MouseEvent | TouchEvent)
// 			.target;
// 		// Go up in the node list until we  find something with an href
// 		while (el && !this.getHref(el)) {
// 			el = el.parentNode;
// 		}
// 		if (this.preventCheck(evt, el)) {
// 			evt.preventDefault();
// 			this.linkHash = el.hash.split("#")[1];
// 			const href = this.getHref(el);
// 			const transitionName = this.getTransitionName(el);
// 			const cursorPosition: Coords = new Coords(evt.clientX, evt.clientY);
// 			this.goTo(href, transitionName, el, cursorPosition);
// 			this.EventEmitter.emit("anchor:click", [evt, this]);
// 		}
// 	}
// 	getHref(el: HTMLElement | Node | EventTarget) {
// 		throw new Error("Method not implemented.");
// 	}
// 	preventCheck(evt: LinkEvent, el: HTMLElement | Node | EventTarget) {
// 		throw new Error("Method not implemented.");
// 	}
// 	getTransitionName(el: HTMLElement | Node | EventTarget) {
// 		throw new Error("Method not implemented.");
// 	}
// 	goTo(
// 		href: any,
// 		transitionName: any,
// 		el: HTMLElement | Node | EventTarget,
// 		cursorPosition: { x: number; y: number }
// 	) {
// 		throw new Error("Method not implemented.");
// 	}
// 	/**
// 	 * Callback called from click event.
// 	 *
// 	 */
// 	// Initialize events
// 	initEvents() {
// 		// If the browser starts
// 		document.addEventListener("click", this.onClick.bind(this));
// 	}
// 	// Stop events
// 	stopEvents() { }
// }
//# sourceMappingURL=framework.js.map