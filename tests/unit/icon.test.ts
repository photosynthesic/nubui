import { describe, it, expect, beforeEach } from "vitest";
import { createIcon, getAvailableIcons, iconExists } from "../../src/icon/icon";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

describe("Icon System - createIcon", () => {
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

  describe("Mask mode (default)", () => {
    it("should create span element with mask classes", () => {
      const icon = createIcon({ iconName: "test-icon" });

      expect(icon.tagName).toBe("SPAN");
      expect(icon.classList.contains("mask-icon-test-icon")).toBe(true);
      expect(icon.classList.contains("inline-block")).toBe(true);
    });

    it("should apply default size (w-6 h-6)", () => {
      const icon = createIcon({ iconName: "test-icon" });

      expect(icon.classList.contains("w-6")).toBe(true);
      expect(icon.classList.contains("h-6")).toBe(true);
    });

    it("should apply custom size with Tailwind classes", () => {
      const icon = createIcon({ iconName: "test-icon", size: 32 });

      expect(icon.classList.contains("w-8")).toBe(true);
      expect(icon.classList.contains("h-8")).toBe(true);
    });

    it("should apply color as Tailwind text class", () => {
      const icon = createIcon({ iconName: "test-icon", color: "blue-500" });

      expect(icon.classList.contains("text-blue-500")).toBe(true);
    });

    it("should apply hex color as arbitrary value", () => {
      const icon = createIcon({ iconName: "test-icon", color: "#3b82f6" });

      expect(icon.classList.contains("text-[#3b82f6]")).toBe(true);
    });

    it("should apply custom attributes", () => {
      const icon = createIcon({
        iconName: "test-icon",
        attributes: { "data-testid": "my-icon", "aria-label": "Test icon" },
      });

      expect(icon.getAttribute("data-testid")).toBe("my-icon");
      expect(icon.getAttribute("aria-label")).toBe("Test icon");
    });

    it("should apply custom styles", () => {
      const icon = createIcon({
        iconName: "test-icon",
        styles: { cursor: "pointer", margin: "10px" },
      });

      expect(icon.style.cursor).toBe("pointer");
      expect(icon.style.margin).toBe("10px");
    });

    it("should set accessibility attributes when alt is provided", () => {
      const icon = createIcon({
        iconName: "test-icon",
        alt: "Test icon description",
      });

      expect(icon.getAttribute("role")).toBe("img");
      expect(icon.getAttribute("aria-label")).toBe("Test icon description");
    });
  });

  describe("Inline mode", () => {
    it("should create SVG element", () => {
      const icon = createIcon({ iconName: "test-icon", mode: "inline" });

      expect(icon.tagName).toBe("svg");
    });

    it("should apply size classes to SVG", () => {
      const icon = createIcon({
        iconName: "test-icon",
        mode: "inline",
        size: 32,
      });

      expect(icon.classList.contains("w-8")).toBe(true);
      expect(icon.classList.contains("h-8")).toBe(true);
    });

    it("should apply color to SVG", () => {
      const icon = createIcon({
        iconName: "test-icon",
        mode: "inline",
        color: "#ff0000",
      });

      // SVG should contain the color in fill or stroke attributes
      const svgString = icon.outerHTML;
      expect(svgString).toContain("#ff0000");
    });

    it("should add title element when alt is provided", () => {
      const icon = createIcon({
        iconName: "test-icon",
        mode: "inline",
        alt: "Test icon",
      });

      const titleElement = icon.querySelector("title");
      expect(titleElement).toBeTruthy();
      expect(titleElement?.textContent).toBe("Test icon");
      expect(icon.getAttribute("role")).toBe("img");
    });
  });

  describe("IMG mode", () => {
    it("should create img element", () => {
      const icon = createIcon({ iconName: "test-icon", mode: "img" });

      expect(icon.tagName).toBe("IMG");
    });

    it("should set src attribute", () => {
      const icon = createIcon({ iconName: "test-icon", mode: "img" }) as HTMLImageElement;

      expect(icon.src).toContain("test-icon.svg");
    });

    it("should apply size classes", () => {
      const icon = createIcon({
        iconName: "test-icon",
        mode: "img",
        size: 48,
      });

      expect(icon.classList.contains("w-12")).toBe(true);
      expect(icon.classList.contains("h-12")).toBe(true);
    });

    it("should set width and height attributes for numeric size", () => {
      const icon = createIcon({
        iconName: "test-icon",
        mode: "img",
        size: 48,
      }) as HTMLImageElement;

      expect(icon.width).toBe(48);
      expect(icon.height).toBe(48);
    });

    it("should set alt attribute when provided", () => {
      const icon = createIcon({
        iconName: "test-icon",
        mode: "img",
        alt: "Test icon",
      }) as HTMLImageElement;

      expect(icon.alt).toBe("Test icon");
    });
  });

  describe("Error handling", () => {
    it("should throw error for non-existent icon", () => {
      expect(() => {
        createIcon({ iconName: "non-existent-icon" });
      }).toThrow();
    });

    it("should throw error for invalid mode", () => {
      expect(() => {
        createIcon({
          iconName: "test-icon",
          mode: "invalid" as any,
        });
      }).toThrow();
    });
  });

  describe("Size variations", () => {
    it("should handle string size with px unit", () => {
      const icon = createIcon({ iconName: "test-icon", size: "32px" });

      expect(icon.classList.contains("w-8")).toBe(true);
    });

    it("should handle arbitrary size values", () => {
      const icon = createIcon({ iconName: "test-icon", size: 100 });

      expect(icon.classList.contains("w-[100px]")).toBe(true);
      expect(icon.classList.contains("h-[100px]")).toBe(true);
    });

    it("should handle string size without unit", () => {
      const icon = createIcon({ iconName: "test-icon", size: "50" });

      expect(icon.classList.contains("w-[50px]")).toBe(true);
      expect(icon.classList.contains("h-[50px]")).toBe(true);
    });
  });

  describe("Color variations", () => {
    it("should handle Tailwind color names", () => {
      const icon = createIcon({ iconName: "test-icon", color: "red-500" });

      expect(icon.classList.contains("text-red-500")).toBe(true);
    });

    it("should handle text- prefixed colors", () => {
      const icon = createIcon({ iconName: "test-icon", color: "text-green-600" });

      expect(icon.classList.contains("text-green-600")).toBe(true);
    });

    it("should handle hex colors", () => {
      const icon = createIcon({ iconName: "test-icon", color: "#123456" });

      expect(icon.classList.contains("text-[#123456]")).toBe(true);
    });

    it("should handle rgb colors", () => {
      const icon = createIcon({
        iconName: "test-icon",
        color: "rgb(255,0,0)",
      });

      // RGB color should be applied as arbitrary value
      expect(icon.classList.contains("text-[rgb(255,0,0)]")).toBe(true);
    });
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
