# Changelog

## 2.3.1

### Patch Changes

- fix(@okikio/animate): :bug: export utils

## 2.3.0

### Minor Changes

- add custom-easing with support for complex easing functions like spring, elastic, and bounce;

  the CustomEasing, SpringEasing, and ApplyCustomEasing functions generate Array's that emulate custom easing;
  add `out-in` as an extra supported easing variation for custom-easing alone;

  add support for ordered transform functions as CSS properties, so, the resulting transform depends on the order you define the transform functions;

  add `DestroyableAnimate`, a extended varient of the `Animate` class, that removes all targets from the DOM when it is stopped via the `stop()` method;

  add `tween()` & `tweenAttr()` for animating empty elements that are forced on to the DOM, which are removed when the animation is stopped.

  `tweenAttr` uses the "update" event together with an opacity animation of a hidden empty element to animate `attributes` and `styles`;

  update docs with detailed info.;
  add `Effects` section to docs;
  add `composite` to Animation Options;
  add docs on running, testing, & building locally;
  add badges to docs;
  update API docs;

  Go through the `@okikio/animate` README.md for more det

## 2.2.0

### Minor Changes

- d842a46: support dashed css properties; add more auto unit css properties

  You can now use both camelCase and dashed CSS properties; more CSS properties now support auto units by default all CSS properties with that have a name in this list ["margin", "padding", "size", "width", "height", "left", "right", "top", "bottom", "radius", "gap", "basis", "inset", "outline-offset", "perspective", "thickness", "position", "distance", "spacing"], this includes margin, padding, and inset, with thier mult value support, "5% 6 7 8", etc... Warning: all CSS properties that can accept color as a value are disallowed from auto units.

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.1.7](https://github.com/okikio/native/compare/@okikio/animate@2.1.6...@okikio/animate@2.1.7) (2021-05-28)

### Bug Fixes

- **@okikio/animate:** :bug: use -/+ Infinity as initial value for minDelay, maxSpeed, totalDuration ([9aeec2e](https://github.com/okikio/native/commit/9aeec2e249ba50ebabf30273cc0866f48e96c0e1))
- **@okikio/native:** :bug: add url to request & timeout errors event ([0be77c6](https://github.com/okikio/native/commit/0be77c613c508fc6c68151ed9ce7207760cf6f0e))

### [2.1.6](https://github.com/okikio/native/compare/@okikio/animate@2.1.5...@okikio/animate@2.1.6) (2021-05-26)

### Bug Fixes

- **@okikio/animate:** :bug: fix transfom is "" bug; use document.timeline as default timeline; ([da5e640](https://github.com/okikio/native/commit/da5e6407b468ffcf55b1c838e1189fd3ebb7fafa))

### [2.1.5](https://github.com/okikio/native/compare/@okikio/animate@2.1.4...@okikio/animate@2.1.5) (2021-05-25)

### [2.1.4](https://github.com/okikio/native/compare/@okikio/animate@2.1.3...@okikio/animate@2.1.4) (2021-05-25)

### [2.1.3](https://github.com/okikio/native/compare/@okikio/animate@2.1.2...@okikio/animate@2.1.3) (2021-05-25)

### Bug Fixes

- **@okikio/animate:** :bug: fix easing & loop bugs in animationKeyframes ([9025933](https://github.com/okikio/native/commit/9025933e207595ec3634ac99c6cf201c71de34fb))

### [2.1.2](https://github.com/okikio/native/compare/@okikio/animate@2.1.1...@okikio/animate@2.1.2) (2021-05-25)

### [2.1.1](https://github.com/okikio/native/compare/@okikio/animate@2.1.0...@okikio/animate@2.1.1) (2021-05-25)

## [2.1.0](https://github.com/okikio/native/compare/@okikio/animate@2.0.4...@okikio/animate@2.1.0) (2021-05-25)

### Features

- **@okikio/animate:** :sparkles: ([8a83f0e](https://github.com/okikio/native/commit/8a83f0e56e82ae025ddaa00becbb7f9b36310ee7))
- **@okikio/animate:** :sparkles: ([017044d](https://github.com/okikio/native/commit/017044d276740aac78b12984b1b2ad00c1f074b3))
- **@okikio/animate:** :sparkles: ([b388ff1](https://github.com/okikio/native/commit/b388ff102c89fbd974f5c1ccd163b336da48875c))
- **@okikio/animate:** :sparkles: add updateOptions method; ([382da7e](https://github.com/okikio/native/commit/382da7e51afb9538367c59b8c5a48daddf5a3940))
- **@okikio/emitter:** :sparkles: ([8bcbf61](https://github.com/okikio/native/commit/8bcbf612c6c62a132a4edb6f9284634d1025adbe))
- **@okikio/native:** :sparkles: ([e1a687b](https://github.com/okikio/native/commit/e1a687bb2a0813fc6f49a4613d58990a2a0231e1))
- **@okikio/native:** :sparkles: add support for paths; ([e5ae22b](https://github.com/okikio/native/commit/e5ae22bcf15b062b0c360b27766b41a209e4fa3a))
- **@okikio/native:** :sparkles: rename @okikio/emitter types; ([936d190](https://github.com/okikio/native/commit/936d19062e4083e8d24c0abb43259dfac25d1727))

### Bug Fixes

- **root:** :bug: add sideEffects false; ([e82fc66](https://github.com/okikio/native/commit/e82fc664bff5c3aa716c7b03bd063e21832a231f))

### [2.0.4](https://github.com/okikio/native/compare/@okikio/animate@2.0.3...@okikio/animate@2.0.4) (2021-01-23)

### [2.0.3](https://github.com/okikio/native/compare/@okikio/animate@2.0.2...@okikio/animate@2.0.3) (2021-01-23)

### Bug Fixes

- **package.json:** fix skypack and bundlephobia's issues with source field and dependencies ([5b6d057](https://github.com/okikio/native/commit/5b6d057c3ca8f36b01d64dacbdde087065abdd3d))

### [2.0.2](https://github.com/okikio/native/compare/@okikio/animate@2.0.1...@okikio/animate@2.0.2) (2021-01-14)

### [2.0.1](https://github.com/okikio/native/compare/@okikio/animate@2.0.0...@okikio/animate@2.0.1) (2021-01-14)

### Bug Fixes

- :bug: fix cancel animation frame bug ([6e7e7d2](https://github.com/okikio/native/commit/6e7e7d2546229ef816cde68a2ae6cfd98a656b1b))

## [2.0.0](https://github.com/okikio/native/compare/@okikio/animate@1.3.0...@okikio/animate@2.0.0) (2021-01-13)

### ⚠ BREAKING CHANGES

- **@okikio/animate:** Pause & Play will work the native way regardless of current player state (this may
  cause unexpected errors)

...

### Bug Fixes

- **@okikio/animate:** fix pause not working on looping animations ([20adbec](https://github.com/okikio/native/commit/20adbec8c18da39b80894c03a8ffd88aa5b11f40))

## [1.3.0](https://github.com/okikio/native/compare/@okikio/animate@1.2.0...@okikio/animate@1.3.0) (2021-01-04)

### Features

- **@okikio/animate:** :sparkles: fix bugs, ([e1d2825](https://github.com/okikio/native/commit/e1d2825619103a4385c88da0b8b99f08fb7e06ba))

## [1.2.0](https://github.com/okikio/native/compare/@okikio/animate@1.1.2...@okikio/animate@1.2.0) (2020-12-30)

### Features

- **@okikio/animate:** :sparkles: ([738c4b3](https://github.com/okikio/native/commit/738c4b3beddb8139ec821c4648771e757ddb22f1))

### [1.1.2](https://github.com/okikio/native/compare/@okikio/animate@1.1.1...@okikio/animate@1.1.2) (2020-12-29)

### [1.1.1](https://github.com/okikio/native/compare/@okikio/animate@1.1.0...@okikio/animate@1.1.1) (2020-12-29)

### Bug Fixes

- **all:** :bug: fix package.json browserfield breaking module exports ([d8e9054](https://github.com/okikio/native/commit/d8e90547ee0184d103f9fa09e04676ea91759a8c))

## 1.1.0 (2020-12-28)

### Features

- **all:** :construction: finalize design for native package, update documentation and build process ([f9fdb32](https://github.com/okikio/native/commit/f9fdb32e347de2c7e48c9f10908b09242862a4fd))
- add commitlint/conventional-commits to repo ([6adc3bf](https://github.com/okikio/native/commit/6adc3bf9f4e7567d3758b77fa55a49b3b679b604))

### Bug Fixes

- **@okikio/manager:** :art: WIP try to fix/ find cause of esbuild treeshake errors ([9ded385](https://github.com/okikio/native/commit/9ded3855f3abfe944e76bfdaf1ff1a62462d2fa5))
- **all:** :bug: fix bugs, make pjax and transitionmanager support config as options, fix readme, etc ([2fa6811](https://github.com/okikio/native/commit/2fa6811a98bcaeb45ba4bf8cf1a83e10ca0c9b4c))
- **all:** :bug: seperate HistoryManager, PageManager, CONFIG, and TransitionManager from Native ([01d8190](https://github.com/okikio/native/commit/01d81908ff9bc78382c2e8d7f1df8ea1100f53cb))
- **all:** :construction: fix bugs in manger and emitter; use cypress animate and native, jest/jest-jsdom doesn't support Web Animation API; fix tests for manager and emitter; WIP tests using cypress; finalize native js api; WIP Readme for animate and native; delay work till Jabodent is complete. ([42d161a](https://github.com/okikio/native/commit/42d161a5ef3515d9e3067334aebc14d2c6bcc23f))
- **gitpod:** :bug: fix gitpod docker file ([8e8fdb8](https://github.com/okikio/native/commit/8e8fdb8fd02a5bdfd2b16e601ba94a9f1ed97d85))
- :bug: fix scrolling bug that stops scrolling during transition, and popstate ([69ba508](https://github.com/okikio/native/commit/69ba508a65155f129648f12702f4a3aecd4eba42))
- )updated release command ([b27ceb7](https://github.com/okikio/native/commit/b27ceb7de404587fa104da4f8ab662530d405e5a))
- added default exports, except for native ([b7f37c2](https://github.com/okikio/native/commit/b7f37c2b5d7287b01ecf5c793392f14c5ff3e346))
- bug fixes ([60d6edd](https://github.com/okikio/native/commit/60d6edd7629ba661d974cdffccbfaf485fe62b9a))
- forgot to make constructor arguments optional ([905c4a8](https://github.com/okikio/native/commit/905c4a80ad3760ff6b808a8d284ad3a943e9fa1d))
- lerna publish error fix ([07f86eb](https://github.com/okikio/native/commit/07f86eb7cc442c2e91bb36dbdee9061dded5ccc4))
- small layout change ([6836c0b](https://github.com/okikio/native/commit/6836c0b8eeed1db8b07ce6394c90d1fe692d830c))
- still testing lerna with pnpm ([1bcec01](https://github.com/okikio/native/commit/1bcec0121a755099362341057f79ce8fcf8286f9))
- tring to publish ([ec86224](https://github.com/okikio/native/commit/ec86224e9eaaaa822f53301aa1bc5027a9379f17))
- update package.json ([99569d5](https://github.com/okikio/native/commit/99569d5f4bfd9c8e443554c43344400b9bf1d1e5))
- wait till lerna supports workspace protocol ([6b99f8c](https://github.com/okikio/native/commit/6b99f8c2e6803531a1d6890a9708f5c6bedac054))

### [1.0.4](https://github.com/okikio/native/compare/v1.0.3...v1.0.4) (2020-12-28)

### [1.0.3](https://github.com/okikio/native/compare/v1.0.2...v1.0.3) (2020-12-28)

## [1.0.3](https://github.com/okikio/native/compare/v1.0.2...v1.0.3) (2020-12-28)

## [1.0.2](https://github.com/okikio/native/compare/v0.0.8...v1.0.2) (2020-12-27)

## [0.0.8](https://github.com/okikio/native/compare/v0.0.7...v0.0.8) (2020-12-26)

### Bug Fixes

- **@okikio/manager:** :art: WIP try to fix/ find cause of esbuild treeshake errors ([9ded385](https://github.com/okikio/native/commit/9ded3855f3abfe944e76bfdaf1ff1a62462d2fa5))
- **all:** :bug: fix bugs, make pjax and transitionmanager support config as options, fix readme, etc ([2fa6811](https://github.com/okikio/native/commit/2fa6811a98bcaeb45ba4bf8cf1a83e10ca0c9b4c))
- **all:** :bug: seperate HistoryManager, PageManager, CONFIG, and TransitionManager from Native ([01d8190](https://github.com/okikio/native/commit/01d81908ff9bc78382c2e8d7f1df8ea1100f53cb))
- **gitpod:** :bug: fix gitpod docker file ([8e8fdb8](https://github.com/okikio/native/commit/8e8fdb8fd02a5bdfd2b16e601ba94a9f1ed97d85))
- :bug: fix scrolling bug that stops scrolling during transition, and popstate ([69ba508](https://github.com/okikio/native/commit/69ba508a65155f129648f12702f4a3aecd4eba42))
- small layout change ([6836c0b](https://github.com/okikio/native/commit/6836c0b8eeed1db8b07ce6394c90d1fe692d830c))

### Features

- **all:** :construction: finalize design for native package, update documentation and build process ([f9fdb32](https://github.com/okikio/native/commit/f9fdb32e347de2c7e48c9f10908b09242862a4fd))

## [0.0.7](https://github.com/okikio/native/compare/v0.0.6...v0.0.7) (2020-07-02)

### Bug Fixes

- **all:** :construction: fix bugs in manger and emitter; use cypress animate and native, jest/jest-jsdom doesn't support Web Animation API; fix tests for manager and emitter; WIP tests using cypress; finalize native js api; WIP Readme for animate and native; delay work till Jabodent is complete. ([42d161a](https://github.com/okikio/native/commit/42d161a5ef3515d9e3067334aebc14d2c6bcc23f))

### Features

- add commitlint/conventional-commits to repo ([6adc3bf](https://github.com/okikio/native/commit/6adc3bf9f4e7567d3758b77fa55a49b3b679b604))

## [0.0.6](https://github.com/okikio/native/compare/v0.0.5...v0.0.6) (2020-06-29)

## [0.0.5](https://github.com/okikio/native/compare/v0.0.4...v0.0.5) (2020-06-29)

### Bug Fixes

- added default exports, except for native ([b7f37c2](https://github.com/okikio/native/commit/b7f37c2b5d7287b01ecf5c793392f14c5ff3e346))
- lerna publish error fix ([07f86eb](https://github.com/okikio/native/commit/07f86eb7cc442c2e91bb36dbdee9061dded5ccc4))

## [0.0.4](https://github.com/okikio/native/compare/v0.0.3...v0.0.4) (2020-06-29)

### Bug Fixes

- )updated release command ([b27ceb7](https://github.com/okikio/native/commit/b27ceb7de404587fa104da4f8ab662530d405e5a))
- still testing lerna with pnpm ([1bcec01](https://github.com/okikio/native/commit/1bcec0121a755099362341057f79ce8fcf8286f9))
- update package.json ([99569d5](https://github.com/okikio/native/commit/99569d5f4bfd9c8e443554c43344400b9bf1d1e5))
- wait till lerna supports workspace protocol ([6b99f8c](https://github.com/okikio/native/commit/6b99f8c2e6803531a1d6890a9708f5c6bedac054))

## [0.0.3](https://github.com/okikio/native/compare/v0.0.2...v0.0.3) (2020-06-27)

### Bug Fixes

- tring to publish ([ec86224](https://github.com/okikio/native/commit/ec86224e9eaaaa822f53301aa1bc5027a9379f17))

## [0.0.2](https://github.com/okikio/native/compare/v0.0.1...v0.0.2) (2020-06-27)

## [0.0.1](https://github.com/okikio/native/compare/905c4a80ad3760ff6b808a8d284ad3a943e9fa1d...v0.0.1) (2020-06-27)

### Bug Fixes

- bug fixes ([60d6edd](https://github.com/okikio/native/commit/60d6edd7629ba661d974cdffccbfaf485fe62b9a))
- forgot to make constructor arguments optional ([905c4a8](https://github.com/okikio/native/commit/905c4a80ad3760ff6b808a8d284ad3a943e9fa1d))
