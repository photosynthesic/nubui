import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { generateIconMasks } from "../../src/icon/icon-mask-generator";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

describe("Icon Mask Generator", () => {
  let tempDir: string;
  let tempIconDir: string;
  let tempOutputPath: string;

  // Simple test SVG content
  const simpleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
</svg>`;

  const complexSvg = `<?xml version="1.0" encoding="UTF-8"?>
<!-- This is a comment -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2"/>
  <!-- Another comment -->
  <path d="M12 8v8m-4-4h8" stroke="black" stroke-width="2"/>
</svg>`;

  beforeEach(() => {
    // Create temporary directory
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "nubui-test-"));
    tempIconDir = path.join(tempDir, "icons");
    tempOutputPath = path.join(tempDir, "_icon-masks.scss");

    // Create icon directory
    fs.mkdirSync(tempIconDir, { recursive: true });
  });

  afterEach(() => {
    // Clean up temporary directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe("Basic functionality", () => {
    it("should generate SCSS file from SVG files", () => {
      // Create test SVG file
      fs.writeFileSync(path.join(tempIconDir, "test-icon.svg"), simpleSvg);

      // Execute generation
      generateIconMasks({
        iconDir: tempIconDir,
        outputPath: tempOutputPath,
        includePseudoElements: false,
      });

      // Verify SCSS file was created
      expect(fs.existsSync(tempOutputPath)).toBe(true);

      // Verify SCSS contains icon data
      const scssContent = fs.readFileSync(tempOutputPath, "utf8");
      expect(scssContent).toContain("'test-icon':");
      expect(scssContent.length).toBeGreaterThan(0);
    });

    it("should process multiple SVG files", () => {
      // Create multiple SVG files
      fs.writeFileSync(path.join(tempIconDir, "icon-1.svg"), simpleSvg);
      fs.writeFileSync(path.join(tempIconDir, "icon-2.svg"), simpleSvg);
      fs.writeFileSync(path.join(tempIconDir, "icon-3.svg"), simpleSvg);

      generateIconMasks({
        iconDir: tempIconDir,
        outputPath: tempOutputPath,
        includePseudoElements: false,
      });

      const scssContent = fs.readFileSync(tempOutputPath, "utf8");
      expect(scssContent).toContain("icon-1");
      expect(scssContent).toContain("icon-2");
      expect(scssContent).toContain("icon-3");
    });

    it("should generate pseudo-element variants when enabled", () => {
      fs.writeFileSync(path.join(tempIconDir, "test-icon.svg"), simpleSvg);

      generateIconMasks({
        iconDir: tempIconDir,
        outputPath: tempOutputPath,
        includePseudoElements: true,
      });

      const scssContent = fs.readFileSync(tempOutputPath, "utf8");
      expect(scssContent).toContain("::before");
      expect(scssContent).toContain("::after");
    });

    it("should not generate pseudo-element variants when disabled", () => {
      fs.writeFileSync(path.join(tempIconDir, "test-icon.svg"), simpleSvg);

      generateIconMasks({
        iconDir: tempIconDir,
        outputPath: tempOutputPath,
        includePseudoElements: false,
      });

      const scssContent = fs.readFileSync(tempOutputPath, "utf8");
      expect(scssContent).not.toContain("::before");
      expect(scssContent).not.toContain("::after");
    });
  });

  describe("SVG optimization", () => {
    it("should optimize SVG by default", () => {
      fs.writeFileSync(path.join(tempIconDir, "complex-icon.svg"), complexSvg);

      generateIconMasks({
        iconDir: tempIconDir,
        outputPath: tempOutputPath,
        includePseudoElements: false,
        // optimizeSvg is true by default
      });

      const scssContent = fs.readFileSync(tempOutputPath, "utf8");
      expect(scssContent).toContain("complex-icon");

      // Verify XML declarations and comments are removed
      // (svgo optimization removes these)
      const base64Match = scssContent.match(/'complex-icon':\s*'([^']+)'/);
      expect(base64Match).toBeTruthy();
      if (base64Match) {
        const base64Data = base64Match[1];
        const decoded = Buffer.from(base64Data, "base64").toString("utf8");
        expect(decoded).not.toContain("<?xml");
        expect(decoded).not.toContain("<!--");
      }
    });

    it("should skip optimization when disabled", () => {
      fs.writeFileSync(path.join(tempIconDir, "complex-icon.svg"), complexSvg);

      generateIconMasks({
        iconDir: tempIconDir,
        outputPath: tempOutputPath,
        includePseudoElements: false,
        optimizeSvg: false, // Disable optimization
      });

      const scssContent = fs.readFileSync(tempOutputPath, "utf8");
      expect(scssContent).toContain("complex-icon");

      // Even with optimization disabled, XML declarations and comments
      // are removed by manual cleaning in svgToBase64
      const base64Match = scssContent.match(/'complex-icon':\s*'([^']+)'/);
      expect(base64Match).toBeTruthy();
      if (base64Match) {
        const base64Data = base64Match[1];
        const decoded = Buffer.from(base64Data, "base64").toString("utf8");
        expect(decoded).not.toContain("<?xml");
        expect(decoded).not.toContain("<!--");
      }
    });

    it("should use custom svgo configuration", () => {
      fs.writeFileSync(path.join(tempIconDir, "test-icon.svg"), simpleSvg);

      generateIconMasks({
        iconDir: tempIconDir,
        outputPath: tempOutputPath,
        includePseudoElements: false,
        optimizeSvg: true,
        svgoConfig: {
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ],
        },
      });

      const scssContent = fs.readFileSync(tempOutputPath, "utf8");
      expect(scssContent).toContain("test-icon");

      // Verify viewBox is preserved
      const base64Match = scssContent.match(/'test-icon':\s*'([^']+)'/);
      expect(base64Match).toBeTruthy();
      if (base64Match) {
        const base64Data = base64Match[1];
        const decoded = Buffer.from(base64Data, "base64").toString("utf8");
        expect(decoded).toContain("viewBox");
      }
    });
  });

  describe("Error handling", () => {
    it("should throw error when icon directory does not exist", () => {
      expect(() => {
        generateIconMasks({
          iconDir: "/nonexistent/directory",
          outputPath: tempOutputPath,
          includePseudoElements: false,
        });
      }).toThrow();
    });

    it("should warn when no SVG files are found", () => {
      // Execute with empty directory
      generateIconMasks({
        iconDir: tempIconDir,
        outputPath: tempOutputPath,
        includePseudoElements: false,
      });

      // SCSS file should not be generated
      expect(fs.existsSync(tempOutputPath)).toBe(false);
    });
  });

  describe("Output directory creation", () => {
    it("should create output directory if it does not exist", () => {
      fs.writeFileSync(path.join(tempIconDir, "test-icon.svg"), simpleSvg);

      const nestedOutputPath = path.join(tempDir, "nested", "dir", "_icons.scss");

      generateIconMasks({
        iconDir: tempIconDir,
        outputPath: nestedOutputPath,
        includePseudoElements: false,
      });

      expect(fs.existsSync(nestedOutputPath)).toBe(true);
    });
  });
});
