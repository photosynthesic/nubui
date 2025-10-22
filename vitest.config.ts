import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // 環境設定
    environment: "jsdom",

    // テストファイルパターン
    include: ["tests/**/*.{test,spec}.{js,ts}"],
    exclude: ["tests/fixtures/**/*", "node_modules/**/*"],

    // カバレッジ設定
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",

      // カバレッジ目標（spec.mdに従って）
      thresholds: {
        lines: 90,
        branches: 85,
        functions: 95,
        statements: 90,
      },

      // 除外対象
      exclude: [
        "node_modules/**",
        "coverage/**",
        "bin/**",
        "**/*.d.ts",
        "vitest.config.ts",
        "tests/**",
      ],

      // 対象ファイル
      include: ["src/**/*.{js,ts}", "lib/**/*.{js,ts}"],
    },

    // パフォーマンス設定
    testTimeout: 5000, // 単体テスト: 5秒以内
    hookTimeout: 10000,

    // 並列実行設定
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },

    // ログ設定
    silent: false,

    // TypeScript設定
    typecheck: {
      enabled: true,
      include: ["src/**/*.{test,spec}.ts", "tests/**/*.{test,spec}.ts"],
    },
  },
});
