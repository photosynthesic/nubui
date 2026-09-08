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

  describe("Browser compatibility", () => {
    // WebKit before Safari 15.4 only implements the prefixed mask properties.
    // Without the twins, `mask-image` is dropped while `background-color:
    // currentColor` survives and the icon paints as a solid box.
    const generate = (format: "css" | "scss", includePseudoElements = true) => {
      fs.writeFileSync(path.join(tempIconDir, "test-icon.svg"), simpleSvg);

      const outputPath = path.join(tempDir, `icon-masks.${format}`);
      generateIconMasks({
        iconDir: tempIconDir,
        outputPath,
        includePseudoElements,
        format,
      });

      return fs.readFileSync(outputPath, "utf8");
    };

    it("should emit -webkit- twins for every mask property in CSS", () => {
      const css = generate("css");

      expect(css).toContain("-webkit-mask-size: contain;");
      expect(css).toContain("-webkit-mask-repeat: no-repeat;");
      expect(css).toContain("-webkit-mask-position: center;");
      expect(css).toContain("-webkit-mask-image: url");

      // The twin is an addition, not a swap — the unprefixed form must stay.
      expect(css).toContain("\n  mask-image: url");
    });

    it("should emit -webkit- twins for every mask property in SCSS", () => {
      const scss = generate("scss");

      expect(scss).toContain("-webkit-mask-size: contain;");
      expect(scss).toContain("-webkit-mask-repeat: no-repeat;");
      expect(scss).toContain("-webkit-mask-position: center;");
      expect(scss).toContain("-webkit-mask-image: url");
      expect(scss).toContain("\n\t\tmask-image: url");
    });

    it("should prefix the pseudo-element variants too", () => {
      const css = generate("css");

      const beforeRule = css.slice(
        css.indexOf(".before\\:mask-icon-test-icon::before"),
        css.indexOf(".after\\:mask-icon-test-icon::after")
      );
      expect(beforeRule).toContain("-webkit-mask-image: url");
    });

    it("should drop the background fill where masks are unsupported", () => {
      const css = generate("css");

      expect(css).toContain(
        "@supports not ((-webkit-mask-image: none) or (mask-image: none))"
      );
      expect(css).toContain("background-color: transparent;");

      // The fallback only wins on source order, so it has to come last.
      expect(css.indexOf("@supports not")).toBeGreaterThan(
        css.lastIndexOf("background-color: currentColor;")
      );
    });

    it("should cover pseudo-element variants in the fallback when enabled", () => {
      const css = generate("css", true);
      const fallback = css.slice(css.indexOf("@supports not"));

      expect(fallback).toContain(".before\\:mask-icon-test-icon::before");
      expect(fallback).toContain(".after\\:mask-icon-test-icon::after");
    });

    it("should keep the fallback free of pseudo-elements when disabled", () => {
      const css = generate("css", false);

      expect(css).toContain("@supports not");
      expect(css).not.toContain("::before");
      expect(css).not.toContain("::after");
    });

    it("should nest the SCSS fallback in the mixin so @include sites are covered", () => {
      const scss = generate("scss");
      const mixin = scss.slice(
        scss.indexOf("@mixin mask-icon-base"),
        scss.indexOf("$icon-masks:")
      );

      // A hand-written `@include mask-icon-base` rule cannot be enumerated in a
      // selector list, so the fallback has to travel with the mixin.
      expect(mixin).toContain(
        "@supports not ((-webkit-mask-image: none) or (mask-image: none))"
      );
      expect(mixin).toContain("background-color: transparent;");
    });
  });
});
