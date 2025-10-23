import { describe, it, expect, afterEach } from "vitest";
import {
  loadNubuiConfig,
  setButtonConfig,
  setIconConfig,
} from "../../src/config";
import { getButtonConfig, resetButtonConfig } from "../../src/button/config";
import { getIconConfig, resetIconConfig } from "../../src/icon/config";

describe("Unified Config System", () => {
  afterEach(() => {
    // Reset both configs after each test
    resetButtonConfig();
    resetIconConfig();
  });

  describe("loadNubuiConfig", () => {
    it("should load button configuration only", () => {
      loadNubuiConfig({
        button: {
          primary: "bg-purple-600",
        },
      });

      const buttonConfig = getButtonConfig();
      const iconConfig = getIconConfig();

      expect(buttonConfig.primary).toBe("bg-purple-600");
      // Icon config should not be affected
      expect(iconConfig.defaultSize).toBe("24px");
    });

    it("should load icon configuration only", () => {
      loadNubuiConfig({
        icon: {
          defaultSize: "32px",
          defaultColor: "blue-500",
        },
      });

      const buttonConfig = getButtonConfig();
      const iconConfig = getIconConfig();

      // Button config should not be affected
      expect(buttonConfig.primary).toContain("bg-blue");
      expect(iconConfig.defaultSize).toBe("32px");
      expect(iconConfig.defaultColor).toBe("blue-500");
    });

    it("should load both button and icon configuration", () => {
      loadNubuiConfig({
        button: {
          primary: "bg-green-600 text-white",
          sizes: {
            SM: "px-2 py-1",
          },
        },
        icon: {
          defaultSize: "28px",
          defaultColor: "green-500",
          directory: "./src/icons",
          sizeMap: {
            "28px": "w-7 h-7",
          },
        },
      });

      const buttonConfig = getButtonConfig();
      const iconConfig = getIconConfig();

      expect(buttonConfig.primary).toBe("bg-green-600 text-white");
      expect(buttonConfig.sizes?.SM).toBe("px-2 py-1");
      expect(iconConfig.defaultSize).toBe("28px");
      expect(iconConfig.defaultColor).toBe("green-500");
      expect(iconConfig.directory).toBe("./src/icons");
      expect(iconConfig.sizeMap?.["28px"]).toBe("w-7 h-7");
    });

    it("should handle empty configuration", () => {
      const buttonConfigBefore = getButtonConfig();
      const iconConfigBefore = getIconConfig();

      loadNubuiConfig({});

      const buttonConfigAfter = getButtonConfig();
      const iconConfigAfter = getIconConfig();

      // Should not change configs
      expect(buttonConfigAfter.primary).toBe(buttonConfigBefore.primary);
      expect(iconConfigAfter.defaultSize).toBe(iconConfigBefore.defaultSize);
    });

    it("should allow partial button configuration", () => {
      loadNubuiConfig({
        button: {
          primary: "custom-primary",
          // danger, sizes, shapes, disabled not provided
        },
      });

      const buttonConfig = getButtonConfig();
      expect(buttonConfig.primary).toBe("custom-primary");
      // Defaults should still be present for other properties
      expect(buttonConfig.danger).toBeDefined();
    });

    it("should allow partial icon configuration", () => {
      loadNubuiConfig({
        icon: {
          defaultSize: "20px",
          // directory, defaultColor, sizeMap, svgOptimization not provided
        },
      });

      const iconConfig = getIconConfig();
      expect(iconConfig.defaultSize).toBe("20px");
      expect(iconConfig.defaultColor).toBe("currentColor"); // Default preserved
      expect(iconConfig.sizeMap).toBeDefined(); // Default sizeMap preserved
    });
  });

  describe("setButtonConfig", () => {
    it("should configure button system independently", () => {
      setButtonConfig({
        primary: "bg-indigo-600",
      });

      const buttonConfig = getButtonConfig();
      expect(buttonConfig.primary).toBe("bg-indigo-600");
    });

    it("should not affect icon configuration", () => {
      const iconConfigBefore = getIconConfig();

      setButtonConfig({
        primary: "bg-indigo-600",
        sizes: { SM: "px-1 py-0.5" },
      });

      const iconConfigAfter = getIconConfig();
      expect(iconConfigAfter).toEqual(iconConfigBefore);
    });
  });

  describe("setIconConfig", () => {
    it("should configure icon system independently", () => {
      setIconConfig({
        defaultSize: "28px",
        defaultColor: "purple-500",
      });

      const iconConfig = getIconConfig();
      expect(iconConfig.defaultSize).toBe("28px");
      expect(iconConfig.defaultColor).toBe("purple-500");
    });

    it("should not affect button configuration", () => {
      const buttonConfigBefore = getButtonConfig();

      setIconConfig({
        defaultSize: "28px",
        sizeMap: { "20px": "w-5 h-5" },
      });

      const buttonConfigAfter = getButtonConfig();
      expect(buttonConfigAfter).toEqual(buttonConfigBefore);
    });
  });

  describe("Config Isolation", () => {
    it("should isolate button config changes from icon config", () => {
      setButtonConfig({
        primary: "bg-cyan-600",
      });
      setIconConfig({
        defaultSize: "36px",
      });

      const buttonConfig = getButtonConfig();
      const iconConfig = getIconConfig();

      expect(buttonConfig.primary).toBe("bg-cyan-600");
      expect(iconConfig.defaultSize).toBe("36px");

      // Resetting button should not affect icon
      resetButtonConfig();
      expect(getIconConfig().defaultSize).toBe("36px");
    });

    it("should allow sequential config updates", () => {
      loadNubuiConfig({
        button: { primary: "bg-red-600" },
      });

      setIconConfig({
        defaultSize: "32px",
      });

      const buttonConfig = getButtonConfig();
      const iconConfig = getIconConfig();

      expect(buttonConfig.primary).toBe("bg-red-600");
      expect(iconConfig.defaultSize).toBe("32px");
    });
  });
});
