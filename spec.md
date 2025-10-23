# @photosynthesic/nubui NPM パッケージ仕様書

## 概要

カスタム SVG アイコンを、Tailwind CSS で即使えるようにする開発ツール。フレームワーク非依存で、mask/inline/img の 3 モードに対応。

**将来的には**、アイコンだけでなく、ボタン、インプット、モーダルなど、アクセシビリティを重視した UI コンポーネントシステムへ拡張予定。

### このライブラリが解決する課題

#### 1. **カスタム SVG アイコンの管理が面倒**

**実際によくあるシチュエーション:**

- デザイナーが色んなところからアイコンを拾ってくる
- プロジェクトで使うアイコンは 10〜30 個程度（大規模アイコンセットは不要）
- SVG ファイルをそのまま読み込むのは設定が面倒
- `<img>`タグではカラー変更ができない

**nubui の解決策:**

```bash
# 1. デザイナーからもらったSVGを配置
/src/assets/icon/
  ├── logo.svg
  ├── menu.svg
  └── close.svg

# 2. 一発でTailwindで使えるCSSクラス生成（最適化SVGも自動生成）
npx @photosynthesic/nubui icon:build

# 3. HTMLで即使用（カラーも自由に変更）
<span class="mask-icon-logo w-6 h-6 text-blue-500"></span>
<span class="mask-icon-menu w-5 h-5 text-gray-700 hover:text-blue-600"></span>
```

#### 2. **フレームワーク依存からの解放**

**よくある問題:**

- 同じプロジェクトで Vue と React のページが混在
- inline-svg などのツールはビルド設定が複雑
- フレームワーク特化のアイコンライブラリは他で使えない

**nubui の解決策:**

- **CSS ユーティリティクラス**として生成するため、フレームワーク非依存
- Vue、React、Svelte、ネイティブ HTML 全てで同じように使える
- ビルドツール不要（生成した CSS を読み込むだけ）

#### 3. **3 つのモードで柔軟に対応**

**mask モード（90%のケース）:**

- Tailwind の`text-*`クラスで簡単にカラー変更
- 擬似要素（`::before`, `::after`）にも対応
- 軽量・高パフォーマンス

**inline モード（10%の特殊ケース）:**

- SVG 内部の要素を個別操作したい時
- アニメーション・複雑なインタラクション
- ローディングスピナーなど

**img モード（10%の特殊ケース）:**

- CMS 統合やブラウザキャッシュ活用時
- 大きなロゴ画像など

**重要なのは「選択肢がある」こと:**

```typescript
// 基本はmaskで実装
<span class="mask-icon-heart w-6 h-6 text-red-500"></span>;

// 後からアニメーションが必要になったら、モードを変えるだけ
createIcon({ name: "spinner", mode: "inline" });
```

### 既存ツールとの違い

| ツール          | 用途                         | nubui との違い                            |
| --------------- | ---------------------------- | ----------------------------------------- |
| **react-icons** | 大規模アイコンセット         | カスタム SVG に対応していない、React 専用 |
| **inline-svg**  | SVG インライン化             | メンテナンス停止、ビルド設定が複雑        |
| **daisyUI**     | Tailwind UI ライブラリ       | アイコン管理機能がない                    |
| **nubui**       | カスタム SVG → Tailwind 統合 | ← この領域に特化（内部で svgo 使用）      |

### 想定ユーザー

- **小〜中規模プロジェクトの開発者**: 10〜50 個程度のアイコンを管理
- **デザイナーと協業する開発者**: いろんなソースからアイコンが集まる
- **複数フレームワーク利用者**: Vue/React 両方のプロジェクトを持つ
- **Tailwind CSS 愛用者**: `text-*`クラスでカラー変更したい
- **シンプルさ重視の開発者**: 大規模アイコンライブラリは過剰だと感じる

## アイコン API 設計方針（2025/10/22 追記）

- `createIcon` は「HTML/SVG 文字列を返す」関数として設計し、Astro や SSR/ビルド時でもそのまま使えることを保証する。
- クライアントサイドで DOM 要素が必要な場合は、`createIconElement` などのオプション API を提供する。
- これにより、Astro/Next.js/React/Vue/静的 HTML など、あらゆる環境で「import { createIcon } from '@photosynthesic/nubui'」が“普通に”使える。

### API 例

```typescript
// SSR/ビルド時・Astro/React/Vue/HTMLで共通
const iconHtml = createIcon({ name: "heart", mode: "mask", ... });
/* iconHtml: <span class="mask-icon-heart ..."></span> */

// クライアントサイドでDOM要素が必要な場合
const iconElem = createIconElement({ name: "heart", ... });
/* iconElem: HTMLElement */
```

#### 注意

- 既存の`document`依存 API は「クライアント専用」として明示し、SSR/ビルド時はエラーまたは null を返す。

---

## パッケージ構成

### 開発フェーズ

#### Phase 1（現在）: シングルパッケージ

```
@photosynthesic/nubui/
├── bin/
│   └── generate-masks.js        # CLI実行ファイル
├── lib/
│   ├── icon/
│   │   ├── index.js            # アイコン関連のエクスポート
│   │   ├── icon.js             # createIcon関数
│   │   ├── types.js            # TypeScript型定義
│   │   ├── icon-loader.js      # アイコン読み込みユーティリティ
│   │   ├── svg-utils.js        # SVG処理ユーティリティ
│   │   └── icon-mask-generator.js  # SCSS生成機能
│   ├── button/
│   │   ├── index.js            # ボタン関連のエクスポート
│   │   ├── button.js           # createButton関数
│   │   └── types.js            # TypeScript型定義
│   ├── utils/
│   │   └── component-utilities.js  # 共通ユーティリティ
│   └── index.js                # メインエクスポート
├── types/
│   ├── icon.d.ts              # アイコン型定義
│   ├── button.d.ts            # ボタン型定義
│   └── index.d.ts             # メイン型定義
├── package.json
└── README.md
```

#### Phase 2: Monorepo 化（機能が安定してから）

```
nubui/
├── packages/
│   ├── icon/                    # @photosynthesic/nubui-icon
│   │   ├── bin/
│   │   │   └── generate-masks.js
│   │   ├── src/
│   │   │   ├── icon.ts
│   │   │   ├── icon-loader.ts
│   │   │   ├── svg-utils.ts
│   │   │   └── icon-mask-generator.ts
│   │   └── package.json
│   │
│   ├── button/                  # @photosynthesic/nubui-button
│   │   ├── src/
│   │   │   ├── button.ts
│   │   │   └── types.ts
│   │   └── package.json
│   │
│   └── nubui/                   # @photosynthesic/nubui（icon + button）
│       ├── src/
│       │   └── index.ts         # icon + button を再エクスポート
│       └── package.json
│
├── package.json                 # ルート（private: true）
└── README.md
```

#### Phase 3: 拡張（将来）

```
packages/
├── icon/
├── button/
├── input/                       # フォーム入力コンポーネント
├── modal/                       # モーダル・ダイアログ
├── form/                        # フォームシステム
└── nubui/                       # すべてを含むメインパッケージ
```

## 1. CLI ツール仕様

### コマンド体系

```bash
# NPMパッケージとしてインストール後
npx nubui <command> [options]

# メインコマンド
npx nubui icon:build     # アイコンのビルドとプレビュー（推奨）
npx nubui icon:masks     # マスクCSS生成のみ
npx nubui icon:preview   # プレビューHTML生成のみ
npx nubui icon:clean     # 生成ファイルの削除

# ヘルプ
npx nubui --help         # コマンド一覧表示
```

### 基本ワークフロー

```bash
# 1. パッケージインストール
npm install @photosynthesic/nubui

# 2. SVGファイルを配置
# デフォルト: ./src/assets/icon/
# 例: heart.svg, star.svg, home.svg

# 3. アイコンをビルドしてブラウザでプレビュー
npx nubui icon:build

# 生成されるファイル:
# - ./src/assets/icon/format/*.svg (最適化されたSVG)
# - ./src/assets/scss/_icon-masks.scss (マスクCSS)
# - ./docs/icon-preview.html (自動的にブラウザで開く)
```

### 個別コマンド詳細

#### `icon:masks` - マスク CSS 生成

SVG アイコンから Tailwind CSS 用のマスクユーティリティクラスを生成。最適化された SVG も同時に出力。

```bash
npx nubui icon:masks [options]
```

**オプション:**

- `--icon-dir, -i <path>`: SVG アイコンディレクトリパス (デフォルト: `./src/assets/icon`)
- `--output, -o <path>`: 出力 SCSS ファイルパス (デフォルト: `./src/assets/scss/_icon-masks.scss`)
- `--no-pseudo`: 擬似要素バリアント(`::before`, `::after`)を無効化
- `--no-optimize`: SVG 最適化（svgo）をスキップ（デフォルト: 最適化する）
- `--svgo-config <path>`: カスタム svgo 設定ファイルパス（オプション）
- `--help, -h`: ヘルプ表示

**例:**

```bash
# 基本実行
npx nubui icon:masks

# カスタム設定
npx nubui icon:masks --icons ./assets/icons --output ./styles/_icons.scss --no-pseudo
```

#### `icon:preview` - プレビュー HTML 生成

生成されたアイコンを視覚的に確認するための HTML ページを生成。

```bash
npx nubui icon:preview [options]
```

**オプション:**

- `--output, -o <path>`: 出力 HTML ファイルパス (デフォルト: `./docs/icon-preview.html`)
- `--icon-dir <path>`: アイコンディレクトリパス（自動検出）
- `--help, -h`: ヘルプ表示

**例:**

```bash
# 基本実行
npx nubui icon:preview

# カスタム出力先
npx nubui icon:preview --output public/preview.html
```

#### `icon:build` - 統合ビルド

マスク CSS 生成、プレビュー HTML 生成、ブラウザでプレビュー表示を一括実行。

```bash
npx nubui icon:build
```

**実行内容:**

1. `icon:masks` を実行して SCSS 生成
2. `icon:preview` を実行して HTML 生成
3. ブラウザで `docs/icon-preview.html` を自動的に開く

#### `icon:clean` - クリーンアップ

生成されたファイルを削除。

```bash
npx nubui icon:clean
```

**削除対象:**

- `./src/assets/scss/_icon-masks.scss`
- `./docs/icon-preview.html`

## 2. アイコンシステム

### 基本 API

```typescript
import { createIcon, getAvailableIcons } from "@photosynthesic/nubui";

// 基本使用法
const icon = createIcon({ name: "heart-line" });

// 設定可能なオプション
const customIcon = createIcon({
  name: "rocket-line",
  mode: "mask", // 'mask' | 'inline' | 'img'
  size: "lg", // 設定キー ("sm" | "md" | "lg") または任意のTailwindクラス ("w-8 h-8")
  color: "blue-500", // Tailwind色名 | hex | CSS色
  attributes: { "aria-label": "ロケットアイコン" },
  styles: { cursor: "pointer" },
  alt: "ロケットアイコン",
});

// 利用可能なアイコン一覧取得
const icons = getAvailableIcons();
```

### 型定義

```typescript
interface IconArgs {
  name: string;
  mode?: "mask" | "inline" | "img";
  size?: string; // 設定ファイルのサイズキー ("sm" | "md" | "lg") または任意のTailwindクラス ("w-8 h-8")
  color?: string;
  attributes?: Record<string, string>;
  styles?: Record<string, string>;
  alt?: string;
}

type IconOutputMode = "mask" | "inline" | "img";
```

### 3 つの出力モード

#### 1. Mask Mode (デフォルト・推奨)

```typescript
const icon = createIcon({
  name: "star-line",
  mode: "mask",
  color: "yellow-500",
});
// 出力: <span class="mask-icon-star-line text-yellow-500 w-6 h-6"></span>
```

**特徴:**

- `currentColor` による動的テーマサポート
- Tailwind CSS `text-*` クラスで色変更
- 軽量・高パフォーマンス
- 擬似要素との完全互換性

#### 2. Inline Mode (カスタマイズ重視)

```typescript
const icon = createIcon({
  name: "phone-line",
  mode: "inline",
  color: "#3b82f6",
});
// 出力: 直接SVGマークアップが挿入される
```

**特徴:**

- `:hover`, `:focus` などの擬似セレクタサポート
- SVG 属性の直接操作可能
- アニメーション適用可能

#### 3. IMG Mode (CMS 統合)

```typescript
const icon = createIcon({
  name: "gift-line",
  mode: "img",
  alt: "ギフトアイコン",
});
// 出力: <img src="/path/to/gift-line.svg" alt="ギフトアイコン" />
```

**特徴:**

- HTML 標準の `<img>` 要素
- CMS 環境での使いやすさ
- 色変更は CSS フィルタで対応

## 3. SCSS 生成機能

### 設定インターフェース

```typescript
interface MaskGeneratorConfig {
  iconDir: string; // SVGアイコンディレクトリ
  outputPath: string; // 出力SCSSファイルパス
  includePseudoElements: boolean; // 擬似要素バリアント生成
  optimizeSvg?: boolean; // SVG最適化を有効化（デフォルト: true）
  svgoConfig?: OptimizeOptions; // カスタムsvgo設定（オプション）
}
```

### 生成される SCSS 構造

```scss
// 基本mixin
@mixin mask-icon-base {
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  background-color: currentColor;
}

// アイコンデータマップ
$icon-masks: (
  "heart-line": "PHN2ZyB3aWR0aD0iMjQi...",
  "rocket-line": "PHN2ZyB3aWR0aD0iMjQi...",
);

// メインクラス生成
@each $name, $data in $icon-masks {
  .mask-icon-#{$name} {
    @include mask-icon-base;
    mask-image: url("data:image/svg+xml;base64,#{$data}");
  }
}

// 擬似要素バリアント（オプション）
@each $name, $data in $icon-masks {
  .before\:mask-icon-#{$name}::before,
  .after\:mask-icon-#{$name}::after {
    @include mask-icon-base;
    mask-image: url("data:image/svg+xml;base64,#{$data}");
    content: "";
    display: inline-block;
  }
}
```

## 4. 想定される使用パターン

### 開発ワークフロー

```bash
# 1. プロジェクトセットアップ
npm install @photosynthesic/nubui

# 2. SVGアイコン追加後
npx @photosynthesic/nubui generate-masks

# 3. SCSSインポート
# main.scss で @import './assets/css/_icon-masks';
```

### 用途別使用例

#### A. コンポーネント内での使用

```typescript
// React/Vue/Vanilla での使用
import { createIcon } from "@photosynthesic/nubui";

function MyButton() {
  const icon = createIcon({
    name: "arrow-right",
    mode: "mask",
    color: "blue-500",
  });

  return buttonElement.appendChild(icon);
}
```

#### B. Tailwind 直接使用（推奨）

```html
<!-- ボタン内でのアイコン使用 -->
<button class="flex items-center">
  <span class="mask-icon-rocket-line w-5 h-5 text-blue-500 mr-2"></span>
  Launch
</button>

<!-- 擬似要素でのアイコン -->
<a href="#" class="after:mask-icon-arrow-right after:w-4 after:h-4 after:ml-1">
  Next page
</a>
```

#### C. CMS での使用

```typescript
// CMS環境ではIMGモードを使用
const cmsIcon = createIcon({
  name: "user-profile",
  mode: "img",
  alt: "ユーザープロフィール",
});
```

## 5. 技術仕様

### 依存関係

```json
{
  "dependencies": {
    "svgo": "^3.0.0"
  },
  "peerDependencies": {
    "tailwindcss": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

### サポート環境

- **Node.js**: 18.0.0 以上
- **TypeScript**: 5.0.0 以上
- **Tailwind CSS**: 3.0.0 以上
- **ブラウザ**: モダンブラウザ（ES2020 サポート）

### ファイルサイズ最適化

- Tree-shaking 対応
- ESM モジュール形式
- TypeScript 型定義同梱
- SVGO 最適化による SVG サイズ削減

## 6. package.json 設定

```json
{
  "name": "@photosynthesic/nubui",
  "version": "1.0.0",
  "description": "Tailwind CSS based icon and button component library with SCSS generation",
  "main": "./lib/index.js",
  "module": "./lib/index.esm.js",
  "types": "./types/index.d.ts",
  "bin": {
    "generate-masks": "./bin/generate-masks.js"
  },
  "exports": {
    ".": {
      "types": "./types/index.d.ts",
      "import": "./lib/index.esm.js",
      "require": "./lib/index.js"
    },
    "./icon": {
      "types": "./types/icon.d.ts",
      "import": "./lib/icon/index.js",
      "require": "./lib/icon/index.js"
    }
  },
  "scripts": {
    "generate-masks": "node bin/generate-masks.js"
  },
  "keywords": [
    "tailwindcss",
    "icons",
    "svg",
    "components",
    "scss",
    "typescript"
  ],
  "peerDependencies": {
    "tailwindcss": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

## 7. エラーハンドリング

### よくあるエラーと対処法

```typescript
// アイコンが見つからない場合
try {
  const icon = createIcon({ name: "nonexistent-icon" });
} catch (error) {
  console.error(error.message);
  // "Icon 'nonexistent-icon' not found. Available icons: heart-line, rocket-line, ..."
}

// 不正なモード指定
try {
  const icon = createIcon({ name: "heart-line", mode: "invalid" });
} catch (error) {
  console.error(error.message);
  // "Invalid mode 'invalid'. Valid modes are: mask, inline, img"
}

// ボタンの不正なプロパティ組み合わせ
try {
  const button = createButton({
    text: "Invalid",
    element: "button",
    href: "/page",
  });
} catch (error) {
  console.error(error.message);
  // "ValidationError: 'href' cannot be used with element='button'. Use element='a' for navigation."
}

try {
  const button = createButton({
    text: "Invalid",
    element: "a",
    htmlType: "submit",
  });
} catch (error) {
  console.error(error.message);
  // "ValidationError: 'htmlType' cannot be used with element='a'. Use element='button' for form controls."
}
```

## 8. ボタンシステム

### 設計思想：アクセシビリティファースト

**問題意識:**

- 実装者が `button` と `a` タグの使い分けを理解していない
- `<div onClick={}>` などの不適切な実装が多発
- アクセシビリティ対応が後回しになりがち
- 同一チーム内でボタンデザインがバラバラになる

**解決アプローチ:**

- 実装者が何も意識しなくても適切な HTML 要素が自動選択される
- disabled 状態やキーボードナビゲーションが自動対応される
- 設定ファイルベースで全体のデザイン統一が保たれる
- 実装者教育コストを大幅削減

### 設定ファイルの型安全性

#### TypeScript 型定義

```typescript
// types/config.d.ts - エクスポートされる型定義
export interface NubuiConfig {
  button?: ButtonConfig;
  icon?: IconConfig;
}

export interface ButtonConfig {
  // 基本タイプ（拡張可能）
  [key: string]: string | ButtonSizes | ButtonShapes;

  sizes?: ButtonSizes;
  shapes?: ButtonShapes;
  disabled?: string;
  loading?: string;
}

export interface ButtonSizes {
  [key: string]: string; // "sm", "md", "lg" + カスタム
}

export interface ButtonShapes {
  [key: string]: string; // "default", "circle", "round" + カスタム
}

export interface IconConfig {
  sizes?: IconSizes;
}

export interface IconSizes {
  [key: string]: string; // "sm", "md", "lg" + カスタム
}
```

#### 型安全な設定ファイル

```typescript
// nubui.config.ts (推奨 - 型安全版)
import type { NubuiConfig } from "@photosynthesic/nubui/types";

export const nubuiConfig: NubuiConfig = {
  icon: {
    sizes: {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
      // TypeScriptにより型チェック
      // xl: 'w-10 h-10'  // OK
      // invalidKey: 123   // エラー: string型が期待される
    },
  },
  button: {
    basic: "px-4 py-2 border border-gray-300...",
    primary: "px-4 py-2 bg-blue-600 text-white...",
    // ...型安全な設定
  },
};
```

### 設定ファイル例

```typescript
// プロジェクトルートに配置する設定ファイル（nubui.config.ts）
export const nubuiConfig = {
  icon: {
    // アイコンサイズ設定（3つのデフォルト + 拡張可能）
    sizes: {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
      // 拡張例:
      // xs: 'w-3 h-3',
      // xl: 'w-10 h-10',
      // '2xl': 'w-12 h-12'
    },
  },
  button: {
    // 基本スタイル定義（3つのデフォルト + 拡張可能）
    basic:
      "px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
    primary:
      "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
    danger:
      "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
    // 拡張例:
    // secondary: 'px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700',
    // outline: 'px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50',
    // ghost: 'px-4 py-2 text-blue-600 rounded-md hover:bg-blue-50'

    // サイズバリエーション（3つのデフォルト + 拡張可能）
    sizes: {
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
      // 拡張例:
      // xs: 'px-1 py-0.5 text-xs',
      // xl: 'px-8 py-4 text-xl'
    },

    // 状態スタイル
    disabled: "opacity-50 cursor-not-allowed",
    loading: "opacity-75 cursor-wait",
  },
};
```

### 基本 API

```typescript
import { createButton, createIcon } from "@photosynthesic/nubui";
import { configureButton } from "@photosynthesic/nubui/button";

// 1. ボタン設定を初期化（アプリ起動時に一度だけ）
configureButton({
  primary: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
  danger: "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
  sizes: {
    SM: "px-2 py-1 text-sm",
    MD: "px-4 py-2 text-base",
    LG: "px-6 py-3 text-lg",
  },
});

// 2. 基本使用法（設定が自動適用）
const button = createButton({ text: "Click me" });
// → デフォルト anchor 要素、basic スタイル

const primaryButton = createButton({ text: "Submit", type: "primary" });
// → primary スタイルが自動適用

const smallButton = createButton({ text: "Small", size: "SM" });
// → basic + SM サイズが適用

// button 要素として明示的に生成
const submitButton = createButton({
  text: "Submit Form",
  element: "button",
  htmlType: "submit",
});

// カスタム設定
const customButton = createButton({
  text: "Custom Button",
  type: "primary",
  size: "LG",
  shape: "round",
  block: true,
  disabled: false,
  href: "/page", // 指定すると自動的に <a> タグ

  // クラスカスタマイズ
  classes: ["shadow-lg", "transform", "hover:scale-105"],

  // アイコン統合
  icon: "rocket",
  iconPosition: "start", // 'start' | 'end'
  iconSize: 20,
  iconMode: "mask", // 'mask' | 'inline' | 'img'
});
```

### 型定義

```typescript
interface ButtonProps {
  // 基本プロパティ
  text?: string; // ボタンテキスト

  // HTML要素選択（基本は自動判定）
  element?: "button" | "a"; // 明示的に要素タイプを指定（デフォルト: anchor）
  htmlType?: "button" | "submit" | "reset"; // button要素のtype属性
  href?: string; // 指定すると<a>タグ（既にデフォルト）
  target?: "_blank" | "_self" | "_parent" | "_top"; // anchor要素の場合のtarget属性
  rel?: string; // anchor要素のrel属性（target="_blank"で自動付与可能）
  disabled?: boolean; // 両要素タイプで適切に処理

  // セキュリティ制御
  autoSecurity?: boolean; // target="_blank"時にrel="noopener noreferrer"を自動付与（デフォルト: true）

  // 自動判定ロジック:
  // - デフォルト → <a>タグ（anchor）
  // - htmlType が指定 → <button>タグ（自動判定）
  // - element="button" 明示指定 → <button>タグ

  // スタイルカスタマイズ
  type?: string; // 設定ファイルで定義されたタイプ（"basic" | "primary" | "danger" + カスタム）
  size?: string; // 設定ファイルで定義されたサイズ（"SM" | "MD" | "LG" + カスタム）
  shape?: string; // 設定ファイルで定義された形状（"default" | "circle" | "round" + カスタム）
  block?: boolean; // 全幅ボタン（w-full を適用）
  classes?: string[]; // 追加クラス配列（設定に加えて適用）

  // アイコン統合
  icon?: string; // アイコン名
  iconPosition?: "start" | "end"; // アイコン位置（デフォルト: "start"）
  iconSize?: number; // アイコンサイズ（ピクセル）
  iconMode?: "mask" | "inline" | "img"; // アイコン出力モード

  // バリデーション
  // 以下の組み合わせはValidationエラー（実行時エラー）:
  // - element="button" かつ href が指定されている
  // - element="a" かつ htmlType が指定されている
}
```

### 設定ベースのスタイル定義

#### デフォルト設定

```typescript
// ライブラリ内蔵のデフォルト設定
const defaultButtonConfig: ButtonConfig = {
  basic:
    "px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
  primary:
    "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
  danger:
    "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",

  sizes: {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  },

  disabled: "opacity-50 cursor-not-allowed",
  loading: "opacity-75 cursor-wait",
};
```

#### プロジェクト固有の設定例

```typescript
// プロジェクトの nubui.config.js
export const nubuiConfig = {
  button: {
    // 独自のブランドカラーを使用
    basic:
      "px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors",
    primary:
      "px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-all",
    danger:
      "px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-sm transition-all",

    // カスタムサイズ定義
    sizes: {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg font-medium",
    },

    // カスタム形状定義
    shapes: {
      default: "",
      circle: "rounded-full w-12 h-12 flex items-center justify-center",
      round: "rounded-full",
      pill: "rounded-full px-8",
    },

    disabled: "opacity-40 cursor-not-allowed",
    loading: "opacity-60 cursor-wait",
  },
};
```

#### 拡張設定例

```typescript
// より詳細な設定ファイル例
export const nubuiConfig = {
  button: {
    // 基本タイプ（デフォルト3つ + プロジェクト固有拡張）
    basic: "px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50",
    primary: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
    danger: "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",

    // 追加のタイプ定義も可能
    secondary: "px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700",
    outline:
      "px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50",
    ghost: "px-4 py-2 text-blue-600 rounded-md hover:bg-blue-50",

    // サイズ（デフォルト3つ + プロジェクト固有拡張）
    sizes: {
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
      // 拡張例:
      // xs: "px-1 py-0.5 text-xs",
      // xl: "px-8 py-4 text-xl",
      // "2xl": "px-12 py-6 text-2xl"
    },

    // 形状（デフォルト3つ + プロジェクト固有拡張）
    shapes: {
      default: "", // 追加クラスなし
      circle: "rounded-full w-10 h-10 flex items-center justify-center",
      round: "rounded-full",
      // 拡張例:
      // square: "rounded-none",
      // pill: "rounded-full px-6"
    },

    // 状態
    disabled: "opacity-50 cursor-not-allowed",
    loading: "opacity-75 cursor-wait",
  },
};
```

### スタイルカスタマイズ機能

#### 1. 基本的な使用法（設定自動適用）

```typescript
// 設定ファイルのスタイルが自動適用
const basicButton = createButton({ text: "Basic Button" });
// → config.button.basic が適用

const primaryButton = createButton({ text: "Primary", type: "primary" });
// → config.button.primary が適用

const smallPrimary = createButton({
  text: "Small Primary",
  type: "primary",
  size: "sm",
});
// → config.button.primary + config.button.sizes.sm が適用
```

#### 2. 追加クラスによるカスタマイズ

```typescript
// 設定に追加してクラスを適用
const customButton = createButton({
  text: "カスタムボタン",
  type: "primary",
  className: "shadow-lg transform hover:scale-105 min-w-[120px]",
});
// → config.button.primary + 追加クラス が適用

// 設定を無視して完全カスタム
const overrideButton = createButton({
  text: "完全カスタム",
  overrideClasses: true,
  className: "btn btn-custom my-design-system",
});
// → classNameのみが適用（設定は無視）
```

#### 3. 動的スタイリング

```typescript
// 条件付きでタイプを変更
const conditionalButton = createButton({
  text: isDestructive ? "削除" : "保存",
  type: isDestructive ? "danger" : "primary",
  disabled: isLoading,
  className: isLoading ? "animate-pulse" : "",
});
```

#### 2. 設定ベースカスタマイズ

```typescript
// 設定に追加してクラスを適用
const customButton = createButton({
  text: "カスタムボタン",
  type: "primary",
  className: "shadow-lg transform hover:scale-105 min-w-[120px]",
});

// 設定を無視して完全カスタム
const overrideButton = createButton({
  text: "完全カスタム",
  overrideClasses: true,
  className:
    "px-8 py-4 bg-purple-600 text-white rounded-xl font-bold shadow-2xl hover:bg-purple-700 transition-all",
});
```

#### 3. 動的スタイリング

```typescript
// 条件付きスタイリング
const conditionalButton = createButton({
  text: "動的ボタン",
  className: [
    "px-4 py-2 rounded",
    // 条件に応じてクラスを追加
    isActive ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700",
    isLoading ? "cursor-wait opacity-75" : "",
  ]
    .filter(Boolean)
    .join(" "),
});

// 設定ベースでの条件付きスタイリング
const conditionalButton = createButton({
  text: isDeleteAction ? "削除" : "保存",
  type: isDeleteAction ? "danger" : "primary",
  disabled: isLoading,
  className: isLoading ? "animate-pulse" : "",
});
```

#### 4. レスポンシブデザイン対応

```typescript
// Tailwind CSSのレスポンシブクラス
const responsiveButton = createButton({
  text: "レスポンシブボタン",
  className:
    "px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg",
});
```

### 設定ベース使用パターン

#### プロパティ組み合わせ

```typescript
// プライマリ + 大サイズ
const largePrimary = createButton({
  text: "Large Primary Button",
  type: "primary",
  size: "lg",
});

// 基本 + アイコン + ブロック
const iconBlockButton = createButton({
  text: "Full Width Icon Button",
  type: "basic",
  icon: "rocket-line",
  iconPosition: "start",
  block: true,
});
```

#### カスタムボタンタイプの定義

```typescript
// 設定ファイルでカスタムタイプを定義
// nubui.config.js
export const nubuiConfig = {
  button: {
    basic: "px-4 py-2 border border-gray-300...",
    primary: "px-4 py-2 bg-blue-600 text-white...",
    danger: "px-4 py-2 bg-red-600 text-white...",

    // プロジェクト独自のカスタムタイプを追加
    headerButton: "px-2 py-1 text-sm bg-brand-500 text-white rounded",
    navButton: "px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-md",
    ctaButton:
      "px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg",
  },
};

// 使用時
const headerButton = createButton({
  text: "Header Action",
  type: "headerButton", // カスタムタイプを指定
});

const navButton = createButton({
  text: "Navigation",
  type: "navButton",
});

const ctaButton = createButton({
  text: "Get Started!",
  type: "ctaButton",
});
```

### HTML 要素の自動選択

#### 自動判定ロジック

**anchor 要素がデフォルト（推奨）:**

- リンク中心の設計思想（ナビゲーションがより一般的）
- `href` 未指定時も anchor 要素が生成される（デフォルト `href="#"` を付与）
- ナビゲーション用途：`href="/page"` で内部・外部リンク実装

**button 要素が選択される条件:**

- `element: "button"` で明示的に指定
- フォーム操作（`htmlType: "submit"` など）

#### anchor 要素の出力例

```typescript
// デフォルト（href省略）
const defaultButton = createButton({
  text: "Click me",
});
// 出力: <a href="#" class="...">Click me</a>

// 内部リンク
const internalLink = createButton({
  text: "製品ページへ",
  href: "/products",
});
// 出力: <a href="/products" class="...">製品ページへ</a>

// 外部リンク（自動でrel="noopener noreferrer"追加）
const externalLink = createButton({
  text: "外部サイト",
  href: "https://example.com",
  target: "_blank",
});
// 出力: <a href="https://example.com" target="_blank" rel="noopener noreferrer" class="...">外部サイト</a>

// rel属性をカスタマイズ
const customRel = createButton({
  text: "Custom Rel",
  href: "https://example.com",
  target: "_blank",
  rel: "noopener",
});
// 出力: <a href="https://example.com" target="_blank" rel="noopener" class="...">Custom Rel</a>

// セキュリティを無効化（autoSecurity=false）
const noSecurity = createButton({
  text: "No Security",
  href: "https://example.com",
  target: "_blank",
  autoSecurity: false,
});
// 出力: <a href="https://example.com" target="_blank" class="...">No Security</a>
```

#### button 要素の出力例

```typescript
// フォーム送信
const submitButton = createButton({
  text: "送信",
  element: "button",
  htmlType: "submit",
});
// 出力: <button type="submit" class="...">送信</button>

// 一般的なアクション
const actionButton = createButton({
  text: "保存",
  element: "button",
});
// 出力: <button type="button" class="...">保存</button>
```

### アイコン統合

#### アイコン位置制御

```typescript
// 開始位置アイコン
const startIcon = createButton({
  text: "Save",
  icon: "save-line",
  iconPosition: "start",
});

// 終了位置アイコン
const endIcon = createButton({
  text: "Next",
  icon: "arrow-right",
  iconPosition: "end",
});
```

#### アイコンモード統合

```typescript
// アイコンシステムとの連携
const maskedIcon = createButton({
  text: "Download",
  icon: "download-line",
  iconMode: "mask", // CSS mask使用
  iconSize: 18,
});
```

### 無効化状態の処理（アクセシビリティ重視）

#### anchor 要素の無効化

**実装される機能:**

- `aria-disabled="true"` 属性の自動追加
- `tabindex="-1"` でキーボードフォーカス無効化
- `role="button"` でボタンセマンティクス明示
- クリックイベントの自動防止
- 視覚的な disabled スタイル適用

```typescript
const disabledLink = createButton({
  text: "無効なリンク",
  href: "/page",
  disabled: true,
});
// 出力: <a href="/page" aria-disabled="true" tabindex="-1" role="button" class="opacity-50 cursor-not-allowed ...">無効なリンク</a>
```

#### button 要素の無効化

**実装される機能:**

- `disabled` 属性の自動設定
- ブラウザネイティブのキーボード無効化
- 視覚的な disabled スタイル適用
- フォーム送信の自動防止

```typescript
const disabledButton = createButton({
  text: "無効なボタン",
  disabled: true,
  htmlType: "submit",
});
// 出力: <button type="submit" disabled class="opacity-50 cursor-not-allowed ...">無効なボタン</button>
```

#### 条件付き無効化パターン

```typescript
// よくある実用パターン
const conditionalButton = createButton({
  text: isLoading ? "送信中..." : "送信",
  disabled: isLoading || !isFormValid,
  htmlType: "submit",
  icon: isLoading ? "loading" : "send",
});
```

### 実装者教育コスト削減の具体例

#### よくある間違った実装 vs nubui の自動対応

**❌ よくある間違った実装:**

```typescript
// セマンティクス違反：ナビゲーションなのにbutton要素
<button onClick={() => router.push('/page')}>Go to Page</button>

// アクセシビリティ無視：div要素でボタン実装
<div onClick={handleSubmit} className="button-like">Submit</div>

// 不適切なdisabled処理：anchor要素にdisabled属性
<a href="/page" disabled={true}>Disabled Link</a>

// 一貫性のないスタイル：プロジェクト内でバラバラなボタンデザイン
<button className="px-4 py-2 bg-blue-500 text-white rounded">Button A</button>
<button className="px-6 py-3 bg-blue-600 text-white rounded-lg">Button B</button>
```

**✅ nubui による自動対応:**

```typescript
// 自動的に適切なanchor要素が生成される
createButton({ text: "Go to Page", href: "/page" });
// → <a href="/page" class="設定されたスタイル">Go to Page</a>

// フォーム送信では自動的にbutton要素が生成される
createButton({ text: "Submit", htmlType: "submit" });
// → <button type="submit" class="設定されたスタイル">Submit</button>

// disabled状態も要素タイプに応じて適切に処理される
createButton({ text: "Disabled Link", href: "/page", disabled: true });
// → <a href="/page" aria-disabled="true" tabindex="-1" role="button" class="disabled スタイル">Disabled Link</a>

// 設定ファイルベースで一貫したデザインが保たれる
createButton({ text: "Button A", type: "primary" });
createButton({ text: "Button B", type: "primary" });
// → 両方とも同じスタイルが適用される
```

#### 教育不要で得られるベネフィット

1. **アクセシビリティ自動対応**: ARIA 属性、キーボードナビゲーション、フォーカス管理
2. **一貫性自動保証**: 設定ファイルベースで統一されたデザインシステム
3. **セキュリティ自動対応**: 外部リンクの `rel="noopener noreferrer"` 自動付与（制御可能）
4. **disabled 状態の適切な処理**: 要素タイプに応じた ARIA 属性またはブラウザネイティブ属性の自動設定

### 使用パターン

#### フォーム統合

```typescript
// 送信ボタン
const submitBtn = createButton({
  text: "Submit Form",
  type: "primary",
  element: "button",
  htmlType: "submit",
});

// リセットボタン
const resetBtn = createButton({
  text: "Reset",
  type: "basic",
  element: "button",
  htmlType: "reset",
});
```

#### ナビゲーション

```typescript
// 内部リンク
const internalLink = createButton({
  text: "Go to Page",
  href: "/internal-page",
  className: "text-blue-600 hover:text-blue-800 underline",
});

// 外部リンク
const externalLink = createButton({
  text: "External Site",
  href: "https://example.com",
  target: "_blank",
  className: "text-blue-600 hover:text-blue-800 underline",
});
```

#### CTA（Call to Action）

```typescript
// 主要アクション
const ctaButton = createButton({
  text: "Get Started Now",
  type: "primary",
  size: "lg",
  icon: "rocket-line",
  iconPosition: "end",
});
```

## 9. テスト仕様

### テスト環境要件

#### テストフレームワーク選択

- **Vitest**: 高速実行、ESM 対応、TypeScript 標準サポート
- **@testing-library/dom**: DOM 操作テスト用ライブラリ
- **jsdom**: ブラウザ環境シミュレーション
- **@vitest/coverage-v8**: コードカバレッジ測定

#### 実行環境要件

- Node.js 18.x, 20.x, 22.x での動作保証
- TypeScript 直接実行サポート
- ESModule と CommonJS 両対応

### テスト対象機能

#### 1. アイコンシステム

**テスト対象:**

- 基本的なアイコン作成（mask/inline/img モード）
- サイズ指定と Tailwind クラス生成
- カラー指定と CSS クラス適用
- 不正な引数に対するエラーハンドリング
- アクセシビリティ属性の設定

**動作保証要件:**

- 存在しないアイコン名での適切なエラー表示
- 各モードでの正しい HTML 要素生成
- Tailwind サイズクラスの正確な適用

#### 2. ボタンシステム

**テスト対象:**

- 基本的なボタン作成（anchor/button 要素）
- プリセット適用機能
- アイコン統合機能
- 無効化状態の処理
- HTML タイプ設定（submit/reset/button）
- **スタイルカスタマイズ機能**
  - className プロパティによる Tailwind クラス追加
  - baseClassName プロパティによるプリセットスタイル置き換え
  - attributes プロパティによるカスタム HTML 属性設定
  - overrideClasses による完全なクラス上書き
  - variant プロパティによるプリセットバリアント選択
  - プリセットとカスタムスタイルの組み合わせ

**動作保証要件:**

- 適切な要素タイプの生成
- アイコンとテキストの正しい配置
- disabled 状態での適切な属性設定
- **カスタムスタイルの正確な適用**
- **プリセットスタイルとカスタムスタイルの適切な優先順位**
- **レスポンシブクラスの正常な動作**

#### 3. SVG ユーティリティ

**テスト対象:**

- SVG コンテンツのクリーニング
- Base64 エンコーディング
- カラー適用機能
- SVG 次元抽出

**動作保証要件:**

- XML コメントと宣言の適切な除去
- 正確な Base64 エンコーディング
- stroke/fill 属性の正しい色変更

#### 4. アイコンローダー

**テスト対象:**

- ファイルシステムからの SVG 読み込み
- キャッシュ機能
- 引数検証機能
- アイコン存在確認

**動作保証要件:**

- 存在しないディレクトリでの適切なエラー処理
- キャッシュの正常な動作
- 無効な引数での明確なエラーメッセージ

#### 5. アイコンマスク生成（icon-mask-generator）

**テスト対象:**

- SVG アイコンの CSS mask 形式への変換
- SCSS ユーティリティクラス生成
- SVGO による SVG 最適化
- 擬似要素バリアント生成
- ファイル出力機能
- エラーハンドリング

**動作保証要件:**

- 正確な CSS mask 形式での出力
- `.mask-icon-*` クラスの生成
- SVGO 最適化のオン/オフ制御
- カスタム SVGO 設定の適用
- 擬似要素バリアント生成の制御
- 不正なパスでの適切なエラー表示

#### 6. CLI コマンド体系

**テスト対象:**

- `icon:masks` - マスク CSS 生成コマンド
- `icon:preview` - プレビュー HTML 生成コマンド
- `icon:build` - 統合ビルドコマンド
- `icon:clean` - クリーンアップコマンド
- コマンドルーティング機能
- ヘルプメッセージ表示
- エラーハンドリング（未知のコマンド）

**動作保証要件:**

- 各コマンドが正しいスクリプトを実行
- `icon:build` がマスク生成とプレビュー生成を順次実行
- `icon:clean` が生成ファイルを正常に削除
- ファイルが存在しない場合のエラー処理
- 出力ディレクトリの自動作成
- コマンドライン引数の正確な解析と伝達

**テストファイル:** `tests/unit/cli.test.ts` (10 tests)

### 品質要件

#### カバレッジ目標

- **Line Coverage**: 90%以上
- **Branch Coverage**: 85%以上
- **Function Coverage**: 95%以上
- **Statement Coverage**: 90%以上

#### 除外対象

- TypeScript 型定義ファイル（\*.d.ts）
- CLI バイナリファイル（bin/\*）
- 開発用設定ファイル

#### パフォーマンス要件

- 全テスト実行時間: 30 秒以内
- 単体テスト実行時間: 各ファイル 5 秒以内
- カバレッジレポート生成: 10 秒以内

### CI/CD 要件

#### 自動テスト実行

- プルリクエスト作成時
- メインブランチへの push 時
- 複数 Node.js バージョンでのマトリックステスト

#### 品質ゲート

- 全テスト成功
- カバレッジ目標達成
- TypeScript 型チェック成功
- ビルド成功

#### レポート要件

- カバレッジレポートの自動生成
- テスト結果の可視化
- 失敗時の詳細ログ出力

### テストデータ要件

#### フィクスチャー管理

- テスト用 SVG アイコンセット
- 期待される出力データ
- エラーケース用の不正データ

#### モック要件

- ファイルシステム操作のモック
- DOM 環境のシミュレーション
- 外部依存関係の分離

### 実行コマンド仕様

#### 基本コマンド

- `npm test`: 全テスト実行
- `npm run test:watch`: 監視モード
- `npm run test:coverage`: カバレッジ付き実行
- `npm run test:ci`: CI 用実行

#### 高度なオプション

- 特定ファイルのテスト実行
- パターンマッチングによるテスト選択
- 並列実行の制御

## アイコンプレビュー機能

### 概要

生成されたアイコンを視覚的に確認するための開発用 HTML ページ。

### 目的

- 生成されたアイコンの一覧表示と動作確認
- 各モード（mask/inline/img）の表示確認
- カラーバリエーションの確認
- コードサンプルの提供

### 配置場所

デフォルト:

```
docs/
└── icon-preview.html    # アイコンプレビューページ
```

設定で変更可能（package.json または CLI オプション）:

```json
{
  "nubui": {
    "previewPath": "public/preview.html"
  }
}
```

または CLI:

```bash
npx nubui generate-preview --output public/preview.html
```

### 機能要件

#### 1. アイコン一覧表示

- グリッドレイアウトで全アイコンを表示
- アイコン名を各アイコンの下に表示
- クリック可能な要素として実装

#### 2. モード切り替え

- mask / inline / img の 3 モードを切り替えて表示
- デフォルトは mask モード
- 各モードの違いを視覚的に確認可能

#### 3. カラーコントロール

- カラーピッカーでアイコンの色を変更
- プリセットカラー（Tailwind colors）のボタン表示
  - `text-red-500`
  - `text-blue-500`
  - `text-green-500`
  - `text-gray-700`
  - など

#### 4. サイズコントロール

- アイコンサイズを変更可能
  - `w-4 h-4` (16px)
  - `w-6 h-6` (24px) ← デフォルト
  - `w-8 h-8` (32px)
  - `w-12 h-12` (48px)

#### 5. コードサンプル表示

各アイコンをクリックすると、使用方法のコードサンプルを表示:

```html
<!-- Mask mode -->
<span class="mask-icon-heart w-6 h-6 text-red-500"></span>
```

```typescript
// Inline mode
createIcon({ name: "heart", mode: "inline", color: "#ff0000" });
```

```typescript
// IMG mode
createIcon({ name: "heart", mode: "img", size: 24 });
```

### 技術要件

- **依存関係なし**: スタンドアロン HTML ファイル
- **Tailwind CSS**: CDN 経由で読み込み
- **生成された CSS**: `_icon-masks.scss` をコンパイルして読み込み
- **アイコンデータ**: `getAvailableIcons()` を使用してアイコン一覧を取得

### UI 構成

```
┌─────────────────────────────────────────┐
│  Nubui Icon Preview                     │
├─────────────────────────────────────────┤
│  [Mode: Mask ▼] [Color: 🎨] [Size: 24▼] │
├─────────────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│  │ ❤️ │ │ ⭐ │ │ 🏠 │ │ 🔍 │           │
│  │heart│ │star│ │home│ │search         │
│  └────┘ └────┘ └────┘ └────┘           │
│                                         │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│  │ ⚙️ │ │ 📁 │ │ 💾 │ │ 🗑️ │           │
│  │gear│ │folder save│ │trash│          │
│  └────┘ └────┘ └────┘ └────┘           │
└─────────────────────────────────────────┘
```

### 実装優先度

**Phase 1（必須）:**

- アイコン一覧のグリッド表示
- mask モードの表示
- 基本的なカラー変更（Tailwind クラス）

**Phase 2（追加機能）:**

- inline/img モード対応
- カラーピッカー
- コードサンプルのコピー機能

**Phase 3（将来）:**

- 検索・フィルター機能
- ダークモード対応
- アイコンのエクスポート機能

### 使用方法

```bash
# アイコンを生成
npm run icon:masks

# プレビューページを開く
open docs/icon-preview.html
```

## npm パッケージのリリース

### 手動リリース（現在の方法）

#### 1. バージョンアップ

```bash
# パッチバージョンアップ (0.1.0 → 0.1.1)
npm version patch

# マイナーバージョンアップ (0.1.0 → 0.2.0)
npm version minor

# メジャーバージョンアップ (0.1.0 → 1.0.0)
npm version major
```

#### 2. ビルドとテスト

```bash
# テスト実行
npm test

# ビルド
npm run build
```

#### 3. GitHub に push

```bash
git push origin main
git push origin --tags
```

#### 4. npm に publish

```bash
# 初回またはスコープ付きパッケージ
npm publish --access public

# 2回目以降
npm publish
```

## 10. 今後の実装予定

このセクションでは、まだ実装されていないが将来的に追加予定の機能をまとめています。

### Phase 2: Monorepo 化（機能が安定してから）

プロジェクトは将来的に monorepo 化を想定し、個別パッケージとして分離可能な設計を採用。

#### パッケージ分割方針

```
@photosynthesic/nubui          # メインパッケージ（icon + button）
@photosynthesic/nubui-icon     # アイコンのみ（軽量版）
@photosynthesic/nubui-button   # ボタンのみ（軽量版）
```

#### 開発ツール

- **パッケージマネージャー**: yarn
  - yarn workspaces による monorepo 管理
  - 成熟したエコシステムと豊富なドキュメント
- **ビルドツール**: Vite（各パッケージ個別ビルド）
- **バージョン管理**: Changesets（複数パッケージの同期リリース）

#### ユーザーの選択肢

```bash
# 最小構成（アイコンのみ）
npm install @photosynthesic/nubui-icon

# アイコン + ボタン
npm install @photosynthesic/nubui-icon @photosynthesic/nubui-button

# 全部入り（推奨）
npm install @photosynthesic/nubui
```

#### 依存関係

```
@photosynthesic/nubui
├─ @photosynthesic/nubui-icon
└─ @photosynthesic/nubui-button
   └─ @photosynthesic/nubui-icon（アイコン統合機能用）
```

#### Monorepo ディレクトリ構成

```
nubui/
├── packages/
│   ├── icon/                    # @photosynthesic/nubui-icon
│   │   ├── bin/
│   │   │   └── generate-masks.js
│   │   ├── src/
│   │   │   ├── icon.ts
│   │   │   ├── icon-loader.ts
│   │   │   ├── svg-utils.ts
│   │   │   └── icon-mask-generator.ts
│   │   └── package.json
│   │
│   ├── button/                  # @photosynthesic/nubui-button
│   │   ├── src/
│   │   │   ├── button.ts
│   │   │   └── types.ts
│   │   └── package.json
│   │
│   └── nubui/                   # @photosynthesic/nubui（icon + button）
│       ├── src/
│       │   └── index.ts         # icon + button を再エクスポート
│       └── package.json
│
├── package.json                 # ルート（private: true）
└── README.md
```

### Phase 3: コンポーネント拡張（将来）

Input、Modal、Form システムなど、追加 UI コンポーネントの実装。

```
packages/
├── icon/
├── button/
├── input/                       # フォーム入力コンポーネント
├── modal/                       # モーダル・ダイアログ
├── form/                        # フォームシステム
└── nubui/                       # すべてを含むメインパッケージ
```

### プレビュー機能（Storybook 風）

HTML プレビュー生成機能（将来実装予定）

#### 概要

生成されたアイコンとボタンを視覚的に確認するための開発用 HTML ページ。

#### CLI コマンド

```bash
# プレビューHTMLファイル生成
npx @photosynthesic/nubui generate-preview

# カスタム設定
npx @photosynthesic/nubui generate-preview --output ./docs/preview.html --config ./nubui.config.js
```

#### CLI オプション

- `--output, -o <path>`: 出力 HTML ファイルパス (デフォルト: `./nubui-preview.html`)
- `--config, -c <path>`: 設定ファイルパス (デフォルト: `./nubui.config.js`)
- `--icon-dir, -i <path>`: アイコンディレクトリパス (デフォルト: `./src/assets/icon/format`)
- `--theme <theme>`: プレビューテーマ `light` | `dark` | `auto` (デフォルト: `auto`)

#### 生成される HTML ファイル構造

**アイコンセクション:**

- 全アイコンの一覧表示（3 つのモード別）
- 各アイコンの名前とプレビュー
- コードコピー機能
- サイズ・カラー切り替えコントロール
- 検索・フィルタリング機能

**ボタンセクション:**

- 設定ファイルから読み込んだスタイルでボタン一覧表示
- 基本タイプ（basic, primary, danger 等）の表示
- サイズバリエーション（sm, md, lg）の表示
- アイコン付きボタンの表示
- 状態サンプル（normal, disabled, loading）の表示
- 現在の設定内容の表示

#### 実装仕様

```typescript
interface PreviewGeneratorConfig {
  configPath?: string; // nubui.config.js のパス
  iconDir: string; // アイコンディレクトリ
  outputPath: string; // 出力HTMLファイルパス
  theme: "light" | "dark" | "auto"; // プレビューテーマ
  includeCodeSamples: boolean; // コードサンプル表示
}

export function generatePreview(config: PreviewGeneratorConfig): void {
  // 1. 設定ファイル読み込み
  // 2. アイコン一覧取得
  // 3. ボタンサンプル生成
  // 4. HTMLテンプレート生成
  // 5. ファイル出力
}
```

#### インタラクティブ機能

- コードコピー機能（JavaScript API 使用例のコピー）
- サイズ・カラー切り替え（リアルタイムプレビュー更新）
- 検索・フィルタリング（アイコン名検索、モード別フィルタ）
- 設定プレビュー（nubui.config.js の内容を JSON 形式で表示）

#### デザイン要件

- 完全に Tailwind CSS クラスで構築
- ダークモード対応（`dark:` プレフィックス使用）
- レスポンシブデザイン（`sm:`, `md:`, `lg:` ブレークポイント）
- 独自 CSS クラスは使用しない

### 自動リリース（GitHub Actions）

GitHub Actions を使用した自動 publish 設定（将来実装予定）

#### 実装方針

`.github/workflows/publish.yml` を作成し、以下のトリガーで自動 publish:

1. **タグ push 時に自動 publish**

   - `v*.*.*` 形式のタグが push されたら自動実行
   - 例: `git tag v0.2.0 && git push origin v0.2.0`

2. **ワークフロー**

   ```
   1. テスト実行
   2. ビルド実行
   3. npm publish実行
   ```

3. **必要な設定**
   - GitHub Secrets に `NPM_TOKEN` を設定
   - npm access token の取得と登録

#### メリット

- 手動 publish の手間を削減
- リリース時のミスを防止
- テストが通らない場合は publish しない（品質保証）

### Button Component - attributes プロパティ追加

Icon と同様に、Button にもカスタム HTML 属性を指定できるプロパティを追加する予定。

```typescript
interface ButtonProps {
  // ... 既存プロパティ ...

  // カスタムHTML属性（計画中）
  attributes?: Record<string, string>;
}
```

**使用例:**

```typescript
const customButton = createButton({
  text: "Action",
  type: "primary",
  attributes: {
    "data-tracking": "custom-button",
    "data-event": "click-action",
  },
});
```

Icon の attributes と同じ使い方で、Button でもカスタム属性を付与できるようにする。
