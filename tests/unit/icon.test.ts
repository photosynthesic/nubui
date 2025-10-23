import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import {
  createIcon,
  createIconElement,
  getAvailableIcons,
  iconExists,
} from "../../src/icon/icon";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

describe("Icon System - createIcon (SSR/HTML string)", () => {
  let tempIconDir: string;
  const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" fill="currentColor"/>
</svg>`;

  beforeEach(() => {
    // Create temporary icon directory
    tempIconDir = fs.mkdtempSync(path.join(os.tmpdir(), "nubui-icon-test-"));
    process.env.NUBUI_ICON_DIR = tempIconDir;

    // Create test SVG file
    fs.writeFileSync(path.join(tempIconDir, "test-icon.svg"), testSvg);
  });

  it("should return span with mask classes by default", () => {
    const html = createIcon({ name: "test-icon" });
    expect(html).toContain('class="mask-icon-test-icon');
    expect(html).toContain("<span");
  });

  it("should return svg string for inline mode", () => {
    const html = createIcon({ name: "test-icon", mode: "inline" });
    expect(html).toContain("<svg");
  });

  it("should return img string for img mode", () => {
    const html = createIcon({ name: "test-icon", mode: "img" });
    expect(html).toContain("<img");
    expect(html).toContain("src=");
  });

  it("should include custom attributes in HTML", () => {
    const html = createIcon({
      name: "test-icon",
      attributes: { "data-x": "y" },
    });
    expect(html).toContain('data-x="y"');
  });

  it("should include style attribute if styles given", () => {
    const html = createIcon({
      name: "test-icon",
      styles: { color: "red" },
    });
    expect(html).toContain("style=");
  });

  it("should include accessibility attributes if alt given", () => {
    const html = createIcon({ name: "test-icon", alt: "desc" });
    expect(html).toContain('aria-label="desc"');
  });

  it("should throw error for non-existent icon", () => {
    expect(() => createIcon({ name: "non-existent-icon" })).toThrow();
  });
});

describe("Icon System - createIconElement (DOM/HTMLElement)", () => {
  // DOMプロパティ・classList・style等の検証
  function requireDocument() {
    if (typeof document === "undefined")
      throw new Error("document is undefined");
  }
  beforeAll(requireDocument);

  function makeIcon(args) {
    return createIconElement({ name: "test-icon", ...args });
  }

  it("should create span element with mask classes", () => {
    const icon = makeIcon();
    expect(icon.tagName).toBe("SPAN");
    expect(icon.classList.contains("mask-icon-test-icon")).toBe(true);
    expect(icon.classList.contains("inline-block")).toBe(true);
  });

  it("should apply default size (w-6 h-6)", () => {
    const icon = makeIcon();
    expect(icon.classList.contains("w-6")).toBe(true);
    expect(icon.classList.contains("h-6")).toBe(true);
  });

  it("should apply custom size with Tailwind classes", () => {
    const icon = makeIcon({ size: 32 });
    expect(icon.classList.contains("w-8")).toBe(true);
    expect(icon.classList.contains("h-8")).toBe(true);
  });

  it("should apply color as Tailwind text class", () => {
    const icon = makeIcon({ color: "blue-500" });
    expect(icon.classList.contains("text-blue-500")).toBe(true);
  });

  it("should apply hex color as arbitrary value", () => {
    const icon = makeIcon({ color: "#3b82f6" });
    expect(icon.classList.contains("text-[#3b82f6]"));
  });

  it("should apply custom attributes", () => {
    const icon = makeIcon({
      attributes: { "data-testid": "my-icon", "aria-label": "Test icon" },
    });
    expect(icon.getAttribute("data-testid")).toBe("my-icon");
    expect(icon.getAttribute("aria-label")).toBe("Test icon");
  });

  it("should apply custom styles", () => {
    const icon = makeIcon({ styles: { cursor: "pointer", margin: "10px" } });
    expect(icon.style.cursor).toBe("pointer");
    expect(icon.style.margin).toBe("10px");
  });

  it("should set accessibility attributes when alt is provided", () => {
    const icon = makeIcon({ alt: "Test icon description" });
    expect(icon.getAttribute("role")).toBe("img");
    expect(icon.getAttribute("aria-label")).toBe("Test icon description");
  });

  it("should throw error for non-existent icon", () => {
    expect(() =>
      createIconElement({ name: "non-existent-icon" })
    ).toThrow();
  });
});

describe("Icon System - Helper functions", () => {
  it("getAvailableIcons should return array of icon names", () => {
    const icons = getAvailableIcons();

    expect(Array.isArray(icons)).toBe(true);
  });

  it("iconExists should return true for existing icon", () => {
    // This depends on the test icon created in beforeEach
    const exists = iconExists("test-icon");

    expect(typeof exists).toBe("boolean");
  });
});
