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

# 6. Test Astro integration
echo ""
echo "Testing Astro integration..."
cd ../../test-project/astro

# Clean previous builds
rm -rf dist docs node_modules package-lock.json

# Install dependencies
echo "Installing Astro dependencies..."
npm install

# Build Astro project (includes icon:build via package.json script)
echo "Building Astro project..."
npm run build

# Verify generated files
echo "Verifying generated files..."
CSS_FILE=$(ls dist/_astro/index.*.css 2>/dev/null | head -n1)
if [ -z "$CSS_FILE" ]; then
  echo "❌ CSS file not generated"
  exit 1
fi

if ! grep -q "mask-image" "$CSS_FILE"; then
  echo "❌ mask-image not found in CSS"
  exit 1
fi

if [ ! -f "docs/icon-preview.html" ]; then
  echo "❌ icon-preview.html not generated"
  exit 1
fi

echo "✅ Astro integration test passed!"
