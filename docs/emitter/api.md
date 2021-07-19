## API

#### EventEmitter#on(events, callback, scope) & EventEmitter#emit(events, ...args)

```ts
/**
 * Adds a listener for a given event
 *
 * @param {EventInput} events
 * @param {ListenerCallback | object} callback
 * @param {object} scope
 * @returns EventEmitter
 * @memberof EventEmitter
 */

EventEmitter.prototype.on(events: EventInput, callback?: ListenerCallback | object, scope?: object);

/**
 * Call all listeners within an event
 *
 * @param {(string | Array<any>)} events
 * @param {...any} args
 * @returns EventEmitter
 * @memberof EventEmitter
 */

EventEmitter.prototype.emit(events: string | Array<any>, ...args: any);


// Example:
import EventEmitter from "@okikio/emitter";
const emitter = new EventEmitter();

let test = false;
let obj = { bool: false };
let counter = 0;
let on = emitter.on(
    "test",
    function (key, value) {
        test = [key, value];

        // `this` comes from `obj`, since it was set as the scope of this listener
        console.log(this.bool); //= false
    },
    obj // Binds the callback to the `obj` scope
)

// You can chain methods
.on(
    // You can listen for multiple events at the same time
    "test test1 test2", // You can also use arrays ["test", "test1", "test2"]
    function (key, value) {
        test = [value, key];
        counter++;
        console.log(this.bool); //= undefined
    }
    // You can also bind all event listener callbacks to the same scope, in this example I didn't
);

on.emit("test", 1, "true");
console.log(test); //= [1, "true"]

on.emit(
    "test test1 test2", // You can also use arrays ["test", "test1", "test2"]
    1, "true");
console.log(test); //= ["true", 1]
console.log(counter); //= 3

counter = 0;
let fn = function (i = 1) {
    return function (key, value) {
        test = [key, value];
        counter += i;
        console.log(this.bool); //= false
    };
};

// You can also use an object to listen for events
emitter.on(
    {
        play1: fn(),
        play2: fn(2),
        play3: fn(4)
    },
    obj // Bind all callbacks to the `obj` scope
);

// You can emit multiple events back to back
on.emit("play1 play2 play3 play1", "true", 1)
    .emit(["play1", "play2", "play3"], 1, "true");
console.log(test); //= [1, "true"]
console.log(counter); //= 15
```

#### EventEmitter#off(events, callback, scope)

```ts
EventEmitter.prototype.off(events: EventInput, callback?: ListenerCallback | object, scope?: object);

/**
 * Removes a listener from a given event, or completely removes an event
 *
 * @param {EventInput} events
 * @param {ListenerCallback | object} [callback]
 * @param {object} [scope]
 * @returns EventEmitter
 * @memberof EventEmitter
 */

// Example:
import EventEmitter from "@okikio/emitter";
const emitter = new EventEmitter();

/*
    `EventEmitter.prototype.off(...)` literally does the opposite of what `EventEmitter.prototype.on(...)` does,
    `EventEmitter.prototype.off(...)` removes Events and Event Listeners
*/
let counter = 0, fn, scope = { bool: false };
let on = emitter.on(
    // You can listen for multiple events at the same time
    "test test1 test2", // You can also use arrays ["test", "test1", "test2"]
    fn = function () {
        counter++;
    },
    scope
);

// To remove an entire Event, or multiple Events
emitter.off("test1 test2");

// To remove a specific listener you need the scope (if you didn't put anything as the scope when listening for an Event then you don't need a scope) and callback
emitter.off("test", fn, scope);

on.emit("test test1 test2"); // Nothing happens, there are no Events or listeners, so, it can't emit anything
console.log(counter); //= 0
```

#### EventEmitter#once(events, callback, scope)

```ts
/**
 * Adds a one time event listener for an event
 *
 * @param {EventInput} events
 * @param {ListenerCallback | object} callback
 * @param {object} scope
 * @returns EventEmitter
 * @memberof EventEmitter
 */

EventEmitter.prototype.once(events: EventInput, callback?: ListenerCallback | object, scope?: object);


// Example:
import EventEmitter from "@okikio/emitter";
const emitter = new EventEmitter();

/**
 * `EventEmitter#once(...)` supports everything `EventEmitter#on(...)` supports
 * except the event listeners can only be fired once
 * */
let test: boolean | any = false;
let obj = { bool: false };
let counter = 0;
let on: EventEmitter = emitter.once(
    "test test1 test2",
    function (key, value) {
        test = [key, value];
        counter++;

        // `this` comes from `obj`, since it was set as the scope of this listener
        console.log(this.bool); //= false
    },
    obj
);

on.emit("test test1 test2", 1, "true");
console.log(test); //= [1, "true"]
console.log(counter); //= 3

// Since event listeners registered using the `once` method can only be emitted once\
// The second `emit` actually does nothing
on.emit("test test1 test2", 1, "true");
console.log(test); //= [1, "true"]
console.log(counter); //= 3

// The "test" event has no listeners registered since, they have already been removed
console.log(on.get("test").size) //= 0
```

### Complete API Documentation

You can also go through the full [API documentation](https://okikio.github.io/native/api/modules/_okikio_emitter.html), for a more detailed documentation of the API.