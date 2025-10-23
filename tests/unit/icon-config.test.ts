import { describe, it, expect, afterEach } from "vitest";
import {
  configureIcon,
  resetIconConfig,
  getIconConfig,
} from "../../src/icon/config";

describe("Icon System - Configuration", () => {
  afterEach(() => {
    // Reset to defaults after each test
    resetIconConfig();
  });

  describe("getIconConfig", () => {
    it("should return default configuration", () => {
      const config = getIconConfig();
      expect(config.defaultSize).toBe("24px");
      expect(config.defaultColor).toBe("currentColor");
      expect(config.svgOptimization?.enabled).toBe(true);
    });

    it("should return default sizeMap with common sizes", () => {
      const config = getIconConfig();
      expect(config.sizeMap).toBeDefined();
      expect(config.sizeMap?.["24px"]).toBe("w-6 h-6");
      expect(config.sizeMap?.["32px"]).toBe("w-8 h-8");
      expect(config.sizeMap?.["16px"]).toBe("w-4 h-4");
    });
  });

  describe("configureIcon", () => {
    it("should apply custom defaultSize", () => {
      configureIcon({
        defaultSize: "32px",
      });

      const config = getIconConfig();
      expect(config.defaultSize).toBe("32px");
    });

    it("should apply custom defaultColor", () => {
      configureIcon({
        defaultColor: "blue-500",
      });

      const config = getIconConfig();
      expect(config.defaultColor).toBe("blue-500");
    });

    it("should merge custom sizeMap with defaults", () => {
      configureIcon({
        sizeMap: {
          "12px": "w-3 h-3",
          "48px": "w-12 h-12",
        },
      });

      const config = getIconConfig();
      // Should have new sizes
      expect(config.sizeMap?.["12px"]).toBe("w-3 h-3");
      // Should keep default sizes
      expect(config.sizeMap?.["24px"]).toBe("w-6 h-6");
      expect(config.sizeMap?.["32px"]).toBe("w-8 h-8");
    });

    it("should override existing sizeMap entries", () => {
      configureIcon({
        sizeMap: {
          "24px": "w-7 h-7", // Override default 24px mapping
        },
      });

      const config = getIconConfig();
      expect(config.sizeMap?.["24px"]).toBe("w-7 h-7");
    });

    it("should disable SVG optimization", () => {
      configureIcon({
        svgOptimization: {
          enabled: false,
        },
      });

      const config = getIconConfig();
      expect(config.svgOptimization?.enabled).toBe(false);
    });

    it("should allow number defaultSize", () => {
      configureIcon({
        defaultSize: 32,
      });

      const config = getIconConfig();
      expect(config.defaultSize).toBe(32);
    });

    it("should set custom icon directory", () => {
      configureIcon({
        directory: "./custom/icons",
      });

      const config = getIconConfig();
      expect(config.directory).toBe("./custom/icons");
    });

    it("should merge multiple config properties", () => {
      configureIcon({
        defaultSize: "32px",
        defaultColor: "red-500",
        directory: "./my-icons",
        svgOptimization: { enabled: false },
        sizeMap: {
          "20px": "w-5 h-5",
        },
      });

      const config = getIconConfig();
      expect(config.defaultSize).toBe("32px");
      expect(config.defaultColor).toBe("red-500");
      expect(config.directory).toBe("./my-icons");
      expect(config.svgOptimization?.enabled).toBe(false);
      expect(config.sizeMap?.["20px"]).toBe("w-5 h-5");
      expect(config.sizeMap?.["24px"]).toBe("w-6 h-6"); // Still have default
    });
  });

  describe("resetIconConfig", () => {
    it("should reset to default configuration", () => {
      configureIcon({
        defaultSize: "48px",
        defaultColor: "red-600",
        sizeMap: {
          "18px": "w-4.5 h-4.5", // Custom non-default size
        },
      });

      resetIconConfig();

      const config = getIconConfig();
      expect(config.defaultSize).toBe("24px");
      expect(config.defaultColor).toBe("currentColor");
      expect(config.svgOptimization?.enabled).toBe(true);
      expect(config.sizeMap?.["18px"]).toBeUndefined(); // Custom size should be gone
      expect(config.sizeMap?.["24px"]).toBe("w-6 h-6"); // Default size should be restored
    });

    it("should reset sizeMap to defaults after custom config", () => {
      configureIcon({
        sizeMap: {
          "12px": "w-3 h-3",
        },
      });

      resetIconConfig();

      const config = getIconConfig();
      expect(config.sizeMap?.["12px"]).toBeUndefined();
      expect(config.sizeMap?.["24px"]).toBe("w-6 h-6");
    });
  });
});
