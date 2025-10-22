import { describe, it, expect } from "vitest";

describe("テスト環境の動作確認", () => {
  it("基本的なテストが実行できる", () => {
    expect(1 + 1).toBe(2);
  });

  it("DOM環境が利用可能", () => {
    const div = document.createElement("div");
    div.textContent = "テスト";
    expect(div.textContent).toBe("テスト");
  });

  it("TypeScriptが正しく処理される", () => {
    const message: string = "Hello, Vitest with TypeScript!";
    expect(message).toContain("TypeScript");
  });
});
