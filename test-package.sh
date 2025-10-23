#!/bin/sh
set -e

# 1. Pack the package
echo "Packing npm package..."
npm pack

# 2. Get the latest tgz file
PKG=$(ls -t @photosynthesic-nubui-*.tgz | head -n1)
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

# 6. Build Astro test project
echo ""
echo "Building Astro test project..."
cd ../astro
rm -rf dist node_modules package-lock.json
npm install ../../$PKG
npm run build

# 7. Verify Astro build output
echo "Verifying Astro build output..."
if [ ! -f "dist/index.html" ]; then
  echo "❌ Astro build failed: dist/index.html not found"
  exit 1
fi

# Check for expected elements in HTML
if ! grep -q 'class="mask-icon-heart' dist/index.html; then
  echo "❌ Mask mode icon not found in output"
  exit 1
fi

if ! grep -q '<svg' dist/index.html; then
  echo "❌ Inline SVG not found in output"
  exit 1
fi

if ! grep -q '<img' dist/index.html; then
  echo "❌ IMG mode icon not found in output"
  exit 1
fi

echo "✅ Astro component test passed!"

# Clean up Astro dist
rm -rf dist

echo ""
echo "✅ All tests passed!"
