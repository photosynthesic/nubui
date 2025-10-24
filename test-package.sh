#!/bin/sh
set -e

# 1. Pack the package
echo "Packing npm package..."
npm pack

# 2. Get the latest tgz file
PKG=$(ls -t photosynthesic-nubui-*.tgz | head -n1)
echo "Using package: $PKG"

# 3. Clean Node.js test project
rm -rf test-project/node/node_modules test-project/node/package-lock.json

# 4. Install package in Node.js test project
echo "Installing package in test-project/node..."
cd test-project/node
npm install ../../$PKG

# 5. Run import tests (ESM, CJS, TypeScript)
echo "Running import test (ESM)..."
node test-entrypoint.mjs

echo "Running import test (CJS)..."
node test-entrypoint.cjs

echo "Running import test (TypeScript)..."
npx ts-node test-entrypoint.ts

echo ""
echo "✅ All Node.js import tests passed!"
