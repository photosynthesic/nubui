# @photosynthesic/nubui NPM パッケージ仕様書

## 概要

カスタム SVG アイコンを、Tailwind CSS で即使えるようにする開発ツール。フレームワーク非依存で、mask/inline/img の 3 モードに対応。

**ライブラリのスコープ**: アイコンセット + Tailwind CSS ユーティリティクラス生成に特化。

---

## 1. ライブラリが解決する課題

### 1. **カスタム SVG アイコンの管理が面倒**

**実際によくあるシチュエーション:**
- デザイナーが色んなところからアイコンを拾ってくる
- プロジェクトで使うアイコンは 10〜30 個程度（大規模アイコンセットは不要）
- SVG ファイルをそのまま読み込むのは設定が面倒
- `<img>` タグではカラー変更ができない

**nubui の解決策:**

```bash
# 1. デザイナーからもらった SVG を配置
/src/assets/icon/
  ├── logo.svg
  ├── menu.svg
  └── close.svg

# 2. 一発で Tailwind で使える CSS クラス生成
npx nubui icon:build

# 3. HTML で即使用（カラーも自由に変更）
<span class="mask-icon-logo w-6 h-6 text-blue-500"></span>
<span class="mask-icon-menu w-5 h-5 text-gray-700 hover:text-blue-600"></span>
```

### 2. **フレームワーク依存からの解放**

- CSS ユーティリティクラスとして生成するため、フレームワーク非依存
- Vue、React、Svelte、ネイティブ HTML 全てで同じように使える
- ビルドツール不要（生成した CSS を読み込むだけ）

### 3. **3 つのモードで柔軟に対応**

**mask モード（90%のケース）:**
- Tailwind の `text-*` クラスで簡単にカラー変更
- 擬似要素（`::before`, `::after`）にも対応
- 軽量・高パフォーマンス

**inline モード（特殊ケース）:**
- SVG 内部の要素を個別操作したい時
- アニメーション・複雑なインタラクション

**img モード（CMS 統合時）:**
- SVG ファイルとして直接参照（アイコンやロゴ等）
- CMS 環境での使いやすさ
- ブラウザキャッシュ活用

---

## 2. パッケージ構成

```
@photosynthesic/nubui/
├── bin/
│   └── nubui.js                 # CLI実行ファイル
├── src/
│   ├── icon/
│   │   ├── index.ts             # アイコン関連のエクスポート
│   │   ├── icon-loader.ts       # アイコン読み込みユーティリティ
│   │   ├── svg-utils.ts         # SVG処理ユーティリティ
│   │   ├── icon-mask-generator.ts # SCSS生成機能
│   │   ├── constants.ts         # アイコンシステム定数
│   │   └── types.ts             # TypeScript型定義
│   ├── config.ts                # グローバル設定
│   └── index.ts                 # メインエクスポート
├── package.json
└── README.md
```

---

## 3. CLI ツール仕様

### コマンド体系

```bash
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

# 3. アイコンをビルドしてブラウザでプレビュー
npx nubui icon:build

# 生成されるファイル:
# - ./src/assets/icon/format/*.svg (最適化されたSVG)
# - ./src/assets/scss/_icon-masks.scss (マスクCSS)
# - ./docs/icon-preview.html (自動的にブラウザで開く)
```

### コマンド詳細

#### `icon:masks` - マスク CSS 生成

```bash
npx nubui icon:masks [options]
```

**オプション:**
- `--icon-dir, -i <path>`: SVG アイコンディレクトリパス (デフォルト: `./src/assets/icon`)
- `--output, -o <path>`: 出力 SCSS ファイルパス (デフォルト: `./src/assets/scss/_icon-masks.scss`)
- `--no-optimize`: SVG 最適化（svgo）をスキップ
- `--help, -h`: ヘルプ表示

#### `icon:preview` - プレビュー HTML 生成

```bash
npx nubui icon:preview [options]
```

**オプション:**
- `--output, -o <path>`: 出力 HTML ファイルパス (デフォルト: `./docs/icon-preview.html`)
- `--help, -h`: ヘルプ表示

#### `icon:build` - 統合ビルド

```bash
npx nubui icon:build
```

1. `icon:masks` を実行
2. `icon:preview` を実行
3. ブラウザで自動的に開く

#### `icon:clean` - クリーンアップ

```bash
npx nubui icon:clean
```

---

## 4. Astro での実装例

### Icon コンポーネント

```astro
---
// src/components/Icon.astro
interface Props {
  name: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

const { name, size = "md", color = "currentColor" } = Astro.props;

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};
---

<span class={`mask-icon-${name} ${sizeMap[size]} ${color}`}></span>
```

### Button コンポーネント

```astro
---
// src/components/Button.astro
import Icon from "./Icon.astro";

interface Props {
  type?: "primary" | "danger" | "default";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  href?: string;
  icon?: string;
  iconPosition?: "before" | "after";
}

const {
  type = "primary",
  size = "md",
  disabled = false,
  href,
  icon,
  iconPosition = "before",
  ...attrs
} = Astro.props;

const typeStyles = {
  primary: "px-4 py-2 bg-blue-600 text-white hover:bg-blue-700",
  danger: "px-4 py-2 bg-red-600 text-white hover:bg-red-700",
  default: "px-4 py-2 border border-gray-300 hover:bg-gray-50",
};

const sizeStyles = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const classes = `inline-flex items-center gap-2 rounded-md transition-colors ${
  typeStyles[type]
} ${sizeStyles[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

const element = href ? "a" : "button";
const Element = element;
---

<Element class={classes} {href} disabled={!href && disabled} {...attrs}>
  {icon && iconPosition === "before" && <Icon name={icon} size="md" />}
  <slot />
  {icon && iconPosition === "after" && <Icon name={icon} size="md" />}
</Element>
```

### 使用例

```astro
---
import Button from "@/components/Button.astro";
import Icon from "@/components/Icon.astro";
---

<!-- アイコンのみ -->
<Icon name="rocket" size="md" color="text-blue-500" />

<!-- ボタン -->
<Button type="primary" size="md">
  クリック
</Button>

<!-- アイコン付きボタン -->
<Button type="primary" size="md" icon="rocket" iconPosition="before">
  始める
</Button>

<Button type="default" size="sm" icon="arrow-right" iconPosition="after">
  次へ
</Button>

<!-- リンク -->
<Button type="primary" href="/order/">
  注文はこちら
</Button>

<!-- 無効状態 -->
<Button type="danger" disabled>
  削除
</Button>
```

---

## 5. React での実装例

### Icon コンポーネント

```typescript
// src/components/Icon.tsx
interface IconProps {
  name: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export function Icon({ name, size = "md", color = "currentColor" }: IconProps) {
  return (
    <span className={`mask-icon-${name} ${sizeMap[size]} ${color}`}></span>
  );
}
```

### Button コンポーネント

```typescript
// src/components/Button.tsx
import { ReactNode } from "react";
import { Icon } from "./Icon";

interface ButtonProps {
  type?: "primary" | "danger" | "default";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  href?: string;
  icon?: string;
  iconPosition?: "before" | "after";
  children: ReactNode;
  onClick?: () => void;
}

const typeStyles = {
  primary: "px-4 py-2 bg-blue-600 text-white hover:bg-blue-700",
  danger: "px-4 py-2 bg-red-600 text-white hover:bg-red-700",
  default: "px-4 py-2 border border-gray-300 hover:bg-gray-50",
};

const sizeStyles = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export function Button({
  type = "primary",
  size = "md",
  disabled = false,
  href,
  icon,
  iconPosition = "before",
  children,
  onClick,
}: ButtonProps) {
  const classes = `inline-flex items-center gap-2 rounded-md transition-colors ${
    typeStyles[type]
  } ${sizeStyles[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  const Element = href ? "a" : "button";

  return (
    <Element
      className={classes}
      href={href}
      disabled={!href && disabled}
      onClick={onClick}
    >
      {icon && iconPosition === "before" && <Icon name={icon} size="md" />}
      {children}
      {icon && iconPosition === "after" && <Icon name={icon} size="md" />}
    </Element>
  );
}
```

### 使用例

```jsx
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";

export function App() {
  return (
    <>
      {/* アイコンのみ */}
      <Icon name="rocket" size="md" color="text-blue-500" />

      {/* ボタン */}
      <Button type="primary" size="md">
        クリック
      </Button>

      {/* アイコン付きボタン */}
      <Button type="primary" size="md" icon="rocket" iconPosition="before">
        始める
      </Button>

      <Button type="default" size="sm" icon="arrow-right" iconPosition="after">
        次へ
      </Button>

      {/* リンク */}
      <Button type="primary" href="/order/">
        注文はこちら
      </Button>

      {/* 無効状態 */}
      <Button type="danger" disabled>
        削除
      </Button>
    </>
  );
}
```

---

## 6. テスト仕様

### テスト対象機能

#### アイコンシステム
- 基本的なアイコン作成（mask/inline/img モード）
- サイズ指定と Tailwind クラス生成
- カラー指定と CSS クラス適用
- エラーハンドリング
- アクセシビリティ属性の設定

#### CLI コマンド体系
- `icon:masks` - マスク CSS 生成
- `icon:preview` - プレビュー HTML 生成
- `icon:build` - 統合ビルド
- `icon:clean` - クリーンアップ

#### SVG ユーティリティ
- SVG コンテンツのクリーニング
- Base64 エンコーディング
- カラー適用機能

### 実行コマンド

```bash
npm test              # 全テスト実行
npm run test:watch    # 監視モード
npm run test:coverage # カバレッジ付き実行
```

---

## 7. 依存関係

### 依存パッケージ
- `svgo`: SVG 最適化

### Peer Dependencies
- `tailwindcss`: ^3.0.0

### Dev Dependencies
- `typescript`: ^5.0.0
- `vitest`: テスト実行

### サポート環境
- Node.js: 18.0.0 以上
- TypeScript: 5.0.0 以上
- Tailwind CSS: 3.0.0 以上

---

## 8. npm パッケージのリリース

### バージョンアップ

```bash
npm version patch   # パッチバージョンアップ
npm version minor   # マイナーバージョンアップ
npm version major   # メジャーバージョンアップ
```

### ビルドとテスト

```bash
npm test    # テスト実行
npm run build # ビルド
```

### GitHub に push

```bash
git push origin main
git push origin --tags
```

### npm に publish

```bash
npm publish --access public
```
