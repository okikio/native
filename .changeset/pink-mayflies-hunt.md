---
"@okikio/animate": minor
"@okikio/manager": minor
"@okikio/emitter": patch
"@okikio/native": major
---

#### @okikio/animate:
* add `Timeline` class & `timeline` method to `@okikio/animate`. It's a very light wrapper around the `Animate` class, it functions very similarly to animejs's timeline method. It allows you to add a bunch of Animate instances you want to run in a specific order together and allows you to set the progress, play, pause, etc... of the timeline, which will then get passed to the `Animate` instances connected to the timeline.
* update typescript types for better intellisense
* add `stagger`, `random`, & `StaggerCustomEasing` to @okikio/animate
  * **stagger**: Creates complex staggered animations, it does it by creating a closure function and using it as an AnimationOption
  * **random**: Generates random numbers within a range of values
  * **StaggerCustomEasing**: Allows you to create custom easings for the stagger function; note that it returns a function
* replace `tween` with `AnimateAttributes` class, it gains the ability to update tweens via the `updateOptions` method, but losses the ability to animate the style attribute of an element
* add `arrFill` to make transform property animations smooth, in browsers that don't support `CSS.registerProperty`
* fix `offset`, and `composite` animation options not working properly
* set `Animate` constructor's parameters to an empty object to avoid errors
* add `initialOptions`, `maxEndDelay`, `totalDurationOptions`, and `timelineOffset` to `Animate` class 
* add a frame rate limit for raf (requestAnimationFrame) and the `update` event, by default the limit is 60fps
* make `Animate.prototype.visibilityPlayState` public 
* fix bugs with `playstate-change` event
* add `commitStyles` and `persist` methods to the `Animate` class
* set `totalDuration`, `minDelay`, `maxSpeed`, `maxDuration`, `maxEndDelay`, etc.. on the Animate class even if no targets are given
* add support for array easings 
* fix bug with computed transforms by excluding transforms not found in `initialOptions` 
* use updatePlaybackRate for change playback rate by default, if the browser doesn't support it set the playbackRate manually 
* add better comments & update documentaion (WIP, I am currently working on updating the documentation)
* update `toArr()` to only convert strings with spaces to arrays. This is for animation options like this, `translate: ["50px 60px", "60px 70px"]`, it replaces the old functionallity of using commas & it's easier on the eyes
* remove color-rgba.ts & replace it with DOM colors. Move all unit conversions including colors to a new unit-conversion.ts file
* use DOM colors for custom easing interpolation
* remove matrix & matrix3d from animation options
* use CSS variables (via `CSS.registerProperty`) for animating transform functions. CSS vars are smoother and allows you to use multiple animations on the same individul transform property and have them just work with little to no hassle. Only Chromium based browsers support it at the moment, if the browser doesn't support it @okikio/animate will fallback to the old method of animating transform properties.

#### @okikio/native: 
* remove `@okikio/animate` from `@okikio/native`, it added bulk that I feel would be better seperate. This is a major change, because this change will break multiple projects if devs are not careful.
* update `@okikio/native` to better use raf during scroll and resize events. During my testing I determined that cancel raf was using up compute time, but wasn't actually helping performance.

#### @okikio/manager:
* remove `asyncMethodCall` from `@okikio/manager`. I don't see many devs using it, and it's a confusing method, I feel it would be better for each person who needs the functionality to just create their own custom method.

#### @okikio/emitter:
* fix event listener scope bugs. Fixed errors where event listeners scope wasn't being applied properly.
* fix bug with event selection when specifing multiple events. Prior to this fix, if you did this `...on("event1     event2    event3")`, `@okikio/emitter` would create an array of with event{1, 2, & 3} but would also include empty events
