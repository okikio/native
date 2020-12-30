# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.2.0](https://github.com/okikio/native/compare/@okikio/native@1.1.2...@okikio/native@1.2.0) (2020-12-30)


### Features

* **@okikio/animate:** :sparkles: ([738c4b3](https://github.com/okikio/native/commit/738c4b3beddb8139ec821c4648771e757ddb22f1))

### [1.1.2](https://github.com/okikio/native/compare/@okikio/native@1.1.1...@okikio/native@1.1.2) (2020-12-29)

### [1.1.1](https://github.com/okikio/native/compare/@okikio/native@1.1.0...@okikio/native@1.1.1) (2020-12-29)


### Bug Fixes

* **all:** :bug: fix package.json browserfield breaking module exports ([d8e9054](https://github.com/okikio/native/commit/d8e90547ee0184d103f9fa09e04676ea91759a8c))

## 1.1.0 (2020-12-28)


### Features

* **all:** :construction: finalize design for native package, update documentation and build process ([f9fdb32](https://github.com/okikio/native/commit/f9fdb32e347de2c7e48c9f10908b09242862a4fd))
* add commitlint/conventional-commits to repo ([6adc3bf](https://github.com/okikio/native/commit/6adc3bf9f4e7567d3758b77fa55a49b3b679b604))


### Bug Fixes

* **@okikio/manager:** :art: WIP try to fix/ find cause of esbuild treeshake errors ([9ded385](https://github.com/okikio/native/commit/9ded3855f3abfe944e76bfdaf1ff1a62462d2fa5))
* **all:** :bug: fix bugs, make pjax and transitionmanager support config as options, fix readme, etc ([2fa6811](https://github.com/okikio/native/commit/2fa6811a98bcaeb45ba4bf8cf1a83e10ca0c9b4c))
* **all:** :bug: seperate HistoryManager, PageManager, CONFIG, and TransitionManager from Native ([01d8190](https://github.com/okikio/native/commit/01d81908ff9bc78382c2e8d7f1df8ea1100f53cb))
* **all:** :construction: fix bugs in manger and emitter; use cypress animate and native, jest/jest-jsdom doesn't support Web Animation API; fix tests for manager and emitter; WIP tests using cypress; finalize native js api; WIP Readme for animate and native; delay work till Jabodent is complete. ([42d161a](https://github.com/okikio/native/commit/42d161a5ef3515d9e3067334aebc14d2c6bcc23f))
* **gitpod:** :bug: fix gitpod docker file ([8e8fdb8](https://github.com/okikio/native/commit/8e8fdb8fd02a5bdfd2b16e601ba94a9f1ed97d85))
* :bug: fix scrolling bug that stops scrolling during transition, and popstate ([69ba508](https://github.com/okikio/native/commit/69ba508a65155f129648f12702f4a3aecd4eba42))
* )updated release command ([b27ceb7](https://github.com/okikio/native/commit/b27ceb7de404587fa104da4f8ab662530d405e5a))
* added default exports, except for native ([b7f37c2](https://github.com/okikio/native/commit/b7f37c2b5d7287b01ecf5c793392f14c5ff3e346))
* bug fixes ([60d6edd](https://github.com/okikio/native/commit/60d6edd7629ba661d974cdffccbfaf485fe62b9a))
* forgot to make constructor arguments optional ([905c4a8](https://github.com/okikio/native/commit/905c4a80ad3760ff6b808a8d284ad3a943e9fa1d))
* lerna publish error fix ([07f86eb](https://github.com/okikio/native/commit/07f86eb7cc442c2e91bb36dbdee9061dded5ccc4))
* small layout change ([6836c0b](https://github.com/okikio/native/commit/6836c0b8eeed1db8b07ce6394c90d1fe692d830c))
* still testing lerna with pnpm ([1bcec01](https://github.com/okikio/native/commit/1bcec0121a755099362341057f79ce8fcf8286f9))
* tring to publish ([ec86224](https://github.com/okikio/native/commit/ec86224e9eaaaa822f53301aa1bc5027a9379f17))
* update package.json ([99569d5](https://github.com/okikio/native/commit/99569d5f4bfd9c8e443554c43344400b9bf1d1e5))
* wait till lerna supports workspace protocol ([6b99f8c](https://github.com/okikio/native/commit/6b99f8c2e6803531a1d6890a9708f5c6bedac054))

### [1.0.4](https://github.com/okikio/native/compare/v1.0.3...v1.0.4) (2020-12-28)

### [1.0.3](https://github.com/okikio/native/compare/v1.0.2...v1.0.3) (2020-12-28)

## [1.0.3](https://github.com/okikio/native/compare/v1.0.2...v1.0.3) (2020-12-28)

### Patch Changes

- Fix bugs with typescript definition files and rename types folder to @types
- Updated dependencies [undefined]
  - @okikio/animate@1.0.3
  - @okikio/emitter@1.0.3
  - @okikio/manager@1.0.3

## [1.0.2](https://github.com/okikio/native/compare/v1.0.1...v1.0.2) (2020-12-26)

### Patch Changes

- Update the package.json to support es2017+
- Updated dependencies [undefined]
  - @okikio/animate@1.0.2
  - @okikio/emitter@1.0.2
  - @okikio/manager@1.0.2

## [1.0.1](https://github.com/okikio/native/compare/v0.0.8...v1.0.1) (2020-12-26)

### Patch Changes

- I messed up the initial release, so, I have to rerelease it
- Updated dependencies [undefined]
  - @okikio/animate@1.0.1
  - @okikio/emitter@1.0.1
  - @okikio/manager@1.0.1

## 1.0.0

### Major Changes

- Full release

### Patch Changes

- Updated dependencies [undefined]
  - @okikio/animate@1.0.0
  - @okikio/emitter@1.0.0
  - @okikio/manager@1.0.0

## 0.0.8

### Patch Changes

- Release Candidate
- Updated dependencies [undefined]
  - @okikio/animate@0.0.8
  - @okikio/emitter@0.0.8
  - @okikio/manager@0.0.8

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
