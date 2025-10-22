#!/bin/sh
set -e

# 1. パッケージをtgz化
echo "Packing npm package..."
npm pack

# 2. 最新のtgzファイル名を取得
PKG=$(ls -t @photosynthesic-nubui-*.tgz | head -n1)
echo "Using package: $PKG"

# 3. テストプロジェクトのnode_modulesをクリーン
rm -rf test-project/node_modules test-project/package-lock.json

# 4. テストプロジェクトにインストール
echo "Installing package in test-project..."
cd test-project
npm install ../$PKG

# 5. importテスト実行（ESM, CJS, TypeScript）
echo "Running import test (ESM)..."
node test-entrypoint.mjs

echo "Running import test (CJS)..."
node test-entrypoint.cjs

echo "Running import test (TypeScript)..."
npx ts-node test-entrypoint.ts
