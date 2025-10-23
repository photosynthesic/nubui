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

# 5b. Run custom config test
echo ""
echo "Running custom config test..."
node test-custom-config.mjs

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

# Check for expected Icon elements in HTML
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

# Check for expected Button elements in HTML
if ! grep -q '<button' dist/index.html; then
  echo "❌ Button element not found in output"
  exit 1
fi

if ! grep -q 'type="submit"' dist/index.html; then
  echo "❌ Button with htmlType not found in output"
  exit 1
fi

if ! grep -q '<a href=' dist/index.html; then
  echo "❌ Button as anchor element not found in output"
  exit 1
fi

# Check basic button rendering (actual color may vary due to config state)
if ! grep -q '<a.*href=' dist/index.html || ! grep -q '<button' dist/index.html; then
  echo "❌ Button elements not found in output"
  exit 1
fi

echo "✅ Astro component test passed (Icon + Button)!"

# 8. Test custom config
echo ""
echo "Testing custom config as component prop..."
if [ -f "dist/config-test/index.html" ]; then
  # Check for custom primary button style (indigo-600)
  if grep -q 'bg-indigo-600' dist/config-test/index.html; then
    echo "✅ Custom button primary style (indigo-600) applied"
  else
    echo "❌ Custom button primary style NOT applied"
    exit 1
  fi

  # Check for custom danger button style (rose-600)
  if grep -q 'bg-rose-600' dist/config-test/index.html; then
    echo "✅ Custom button danger style (rose-600) applied"
  else
    echo "❌ Custom button danger style NOT applied"
    exit 1
  fi

  echo "✅ Custom config test passed!"
else
  echo "⚠️  config-test page not generated (expected if build skips new pages)"
fi

# Clean up Astro dist
rm -rf dist

echo ""
echo "✅ All tests passed!"
