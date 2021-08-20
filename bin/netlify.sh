#!/bin/bash
set -xeuo pipefail
test "$CI" = true || exit 1
npx pnpm install -r --store-dir=node_modules/.pnpm-store
pnpm docs
# other build scripts