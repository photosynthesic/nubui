import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  getAvailableIcons,
  iconExists,
  getRawSvgContent,
  getSvgFilePath,
  validateIconArgs,
  setIconDirectory,
  clearIconCache,
} from "../../src/icon/icon-loader";

describe("Icon Loader", () => {
  let tempDir: string;
  let originalEnv: string | undefined;

  beforeEach(() => {
    // Save original environment variable
    originalEnv = process.env.NUBUI_ICON_DIR;

    // Create temporary directory for test icons
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "nubui-loader-test-"));

    // Clear caches before each test
    clearIconCache();
  });

  afterEach(() => {
    // Restore environment variable
    if (originalEnv !== undefined) {
      process.env.NUBUI_ICON_DIR = originalEnv;
    } else {
      delete process.env.NUBUI_ICON_DIR;
    }

    // Clean up temporary directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    // Clear caches after each test
    clearIconCache();
  });

  describe("getAvailableIcons", () => {
    it("should return empty array when no SVG files exist", () => {
      setIconDirectory(tempDir);
      const icons = getAvailableIcons();
      expect(icons).toEqual([]);
    });

    it("should return list of available icon names", () => {
      // Create test SVG files
      fs.writeFileSync(
        path.join(tempDir, "icon-one.svg"),
        '<svg><circle r="10"/></svg>'
      );
      fs.writeFileSync(
        path.join(tempDir, "icon-two.svg"),
        '<svg><rect width="20" height="20"/></svg>'
      );

      setIconDirectory(tempDir);
      const icons = getAvailableIcons();

      expect(icons).toContain("icon-one");
      expect(icons).toContain("icon-two");
      expect(icons.length).toBe(2);
    });

    it("should ignore non-SVG files", () => {
      fs.writeFileSync(path.join(tempDir, "icon.svg"), "<svg></svg>");
      fs.writeFileSync(path.join(tempDir, "readme.txt"), "Some text");
      fs.writeFileSync(path.join(tempDir, "image.png"), "fake png data");

      setIconDirectory(tempDir);
      const icons = getAvailableIcons();

      expect(icons).toEqual(["icon"]);
    });

    it("should cache results on subsequent calls", () => {
      fs.writeFileSync(path.join(tempDir, "icon.svg"), "<svg></svg>");
      setIconDirectory(tempDir);

      const icons1 = getAvailableIcons();

      // Add new file after first call
      fs.writeFileSync(path.join(tempDir, "new-icon.svg"), "<svg></svg>");

      const icons2 = getAvailableIcons();

      // Should return cached result (not include new-icon)
      expect(icons1).toEqual(icons2);
      expect(icons2).not.toContain("new-icon");
    });
  });

  describe("iconExists", () => {
    it("should return true for existing icon", () => {
      fs.writeFileSync(path.join(tempDir, "test-icon.svg"), "<svg></svg>");
      setIconDirectory(tempDir);

      expect(iconExists("test-icon")).toBe(true);
    });

    it("should return false for non-existing icon", () => {
      setIconDirectory(tempDir);
      expect(iconExists("non-existent")).toBe(false);
    });
  });

  describe("getRawSvgContent", () => {
    it("should return SVG content for existing icon", () => {
      const svgContent = '<svg><circle cx="12" cy="12" r="10"/></svg>';
      fs.writeFileSync(path.join(tempDir, "test-icon.svg"), svgContent);
      setIconDirectory(tempDir);

      const content = getRawSvgContent("test-icon");
      expect(content).toBe(svgContent);
    });

    it("should return null for non-existing icon", () => {
      setIconDirectory(tempDir);
      const content = getRawSvgContent("non-existent");
      expect(content).toBe(null);
    });

    it("should cache SVG content", () => {
      const svgPath = path.join(tempDir, "cached-icon.svg");
      fs.writeFileSync(svgPath, "<svg>original</svg>");
      setIconDirectory(tempDir);

      // First call should read from file
      const content1 = getRawSvgContent("cached-icon");
      expect(content1).toBe("<svg>original</svg>");

      // Modify file after first read
      fs.writeFileSync(svgPath, "<svg>modified</svg>");

      // Second call should return cached content
      const content2 = getRawSvgContent("cached-icon");
      expect(content2).toBe("<svg>original</svg>");
    });
  });

  describe("getSvgFilePath", () => {
    it("should return file path for existing icon", () => {
      fs.writeFileSync(path.join(tempDir, "test-icon.svg"), "<svg></svg>");
      setIconDirectory(tempDir);

      const filePath = getSvgFilePath("test-icon");
      expect(filePath).toBe(path.join(tempDir, "test-icon.svg"));
    });

    it("should return null for non-existing icon", () => {
      setIconDirectory(tempDir);
      const filePath = getSvgFilePath("non-existent");
      expect(filePath).toBe(null);
    });
  });

  describe("validateIconArgs", () => {
    beforeEach(() => {
      fs.writeFileSync(path.join(tempDir, "valid-icon.svg"), "<svg></svg>");
      setIconDirectory(tempDir);
    });

    it("should not throw for valid arguments", () => {
      expect(() => validateIconArgs("valid-icon", "mask")).not.toThrow();
      expect(() => validateIconArgs("valid-icon", "inline")).not.toThrow();
      expect(() => validateIconArgs("valid-icon", "img")).not.toThrow();
    });

    it("should throw error for empty icon name", () => {
      expect(() => validateIconArgs("", "mask")).toThrow(
        "Icon name must be a non-empty string"
      );
    });

    it("should throw error for non-string icon name", () => {
      expect(() => validateIconArgs(null as any, "mask")).toThrow(
        "Icon name must be a non-empty string"
      );
    });

    it("should throw error for non-existing icon", () => {
      expect(() => validateIconArgs("non-existent", "mask")).toThrow(
        'Icon "non-existent" not found'
      );
    });

    it("should throw error for invalid mode", () => {
      expect(() => validateIconArgs("valid-icon", "invalid" as any)).toThrow(
        'Invalid mode "invalid"'
      );
    });
  });

  describe("setIconDirectory", () => {
    it("should set new icon directory", () => {
      const newDir = fs.mkdtempSync(path.join(os.tmpdir(), "nubui-new-"));
      fs.writeFileSync(path.join(newDir, "new-icon.svg"), "<svg></svg>");

      setIconDirectory(newDir);
      const icons = getAvailableIcons();

      expect(icons).toContain("new-icon");

      // Clean up
      fs.rmSync(newDir, { recursive: true, force: true });
    });

    it("should throw error for non-existing directory", () => {
      expect(() => setIconDirectory("/non/existent/directory")).toThrow(
        "Icon directory does not exist"
      );
    });

    it("should clear caches when setting new directory", () => {
      // Set first directory with one icon
      fs.writeFileSync(path.join(tempDir, "old-icon.svg"), "<svg></svg>");
      setIconDirectory(tempDir);
      getAvailableIcons(); // Cache the icons

      // Create second directory with different icon
      const newDir = fs.mkdtempSync(path.join(os.tmpdir(), "nubui-new-"));
      fs.writeFileSync(path.join(newDir, "new-icon.svg"), "<svg></svg>");

      setIconDirectory(newDir);
      const icons = getAvailableIcons();

      expect(icons).toContain("new-icon");
      expect(icons).not.toContain("old-icon");

      // Clean up
      fs.rmSync(newDir, { recursive: true, force: true });
    });
  });

  describe("clearIconCache", () => {
    it("should clear available icons cache", () => {
      fs.writeFileSync(path.join(tempDir, "icon.svg"), "<svg></svg>");
      setIconDirectory(tempDir);

      const icons1 = getAvailableIcons();
      expect(icons1).toContain("icon");

      // Add new icon and clear cache
      fs.writeFileSync(path.join(tempDir, "new-icon.svg"), "<svg></svg>");
      clearIconCache();

      const icons2 = getAvailableIcons();
      expect(icons2).toContain("icon");
      expect(icons2).toContain("new-icon");
    });

    it("should clear SVG content cache", () => {
      const svgPath = path.join(tempDir, "test-icon.svg");
      fs.writeFileSync(svgPath, "<svg>original</svg>");
      setIconDirectory(tempDir);

      const content1 = getRawSvgContent("test-icon");
      expect(content1).toBe("<svg>original</svg>");

      // Modify file and clear cache
      fs.writeFileSync(svgPath, "<svg>modified</svg>");
      clearIconCache();

      const content2 = getRawSvgContent("test-icon");
      expect(content2).toBe("<svg>modified</svg>");
    });
  });
});
