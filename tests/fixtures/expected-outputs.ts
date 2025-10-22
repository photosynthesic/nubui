/**
 * テスト用の期待される出力データ
 * アイコンシステム、ボタンシステム、SVGユーティリティのテストで使用
 */

export const expectedOutputs = {
  icons: {
    // mask モードでの期待される出力
    maskMode: {
      basic: `<span class="mask-icon-test-icon inline-block w-6 h-6"></span>`,
      withColor: `<span class="mask-icon-test-icon inline-block w-6 h-6 text-blue-500"></span>`,
    },

    // inline モードでの期待される出力
    inlineMode: {
      basic: `<svg class="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
      withColor: `<svg class="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="rgb(59 130 246)" stroke-width="2" stroke-linejoin="round"/></svg>`,
    },

    // img モードでの期待される出力
    imgMode: {
      basic: `<img class="w-6 h-6" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTIgMkwyIDdWMTdMMTIgMjJMMjIgMTdWN0wxMiAyWiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K" alt="test-icon">`,
    },
  },

  buttons: {
    // 基本的なボタン
    basic: `<button type="button" class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Button Text</button>`,

    // アイコン付きボタン
    withIcon: `<button type="button" class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"><span class="mask-icon-test-icon inline-block w-4 h-4 mr-2"></span>Button with Icon</button>`,

    // 無効化されたボタン
    disabled: `<button type="button" disabled class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed">Disabled Button</button>`,
  },

  svgUtils: {
    // クリーニングされたSVGコンテンツ
    cleaned: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,

    // Base64エンコーディング
    base64:
      "PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTIgMkwyIDdWMTdMMTIgMjJMMjIgMTdWN0wxMiAyWiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K",

    // カラー適用後
    withColor: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="rgb(59 130 246)" stroke-width="2" stroke-linejoin="round"/></svg>`,
  },

  cssMasks: {
    // CSS mask形式での出力
    basicMask: `.mask-icon-test-icon { mask: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTIgMkwyIDdWMTdMMTIgMjJMMjIgMTdWN0wxMiAyWiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K') center/contain no-repeat; mask-size: contain; mask-repeat: no-repeat; mask-position: center; display: inline-block; }`,

    // 擬似要素バリアント
    pseudoElement: `.mask-icon-test-icon::before { content: ''; display: block; mask: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTIgMkwyIDdWMTdMMTIgMjJMMjIgMTdWN0wxMiAyWiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K') center/contain no-repeat; }`,
  },
};

// エラーケース用のテストデータ
export const errorTestCases = {
  invalidIconNames: ["", "non-existent", "invalid/path", ".."],
  invalidSizes: [-1, 0, "invalid", null, undefined],
  invalidColors: ["invalid-color", 123, null],
  invalidSvg: "<svg><path></svg>", // 不正なSVG構造
  emptyFile: "",
  nonSvgContent: "<div>Not an SVG</div>",
};

// テスト用のモックデータ
export const mockData = {
  fileSystem: {
    validIconPath: "/path/to/icons/test-icon.svg",
    invalidIconPath: "/path/to/non-existent.svg",
    iconDirectory: "/path/to/icons",
  },

  iconSet: new Map([
    [
      "test-icon",
      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
</svg>`,
    ],
    [
      "check-icon",
      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="8" cy="8" r="6" fill="currentColor"/>
  <path d="M6 8L7 9L10 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    ],
  ]),
};
