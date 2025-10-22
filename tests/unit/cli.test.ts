import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { execSync } from "child_process";

describe("Nubui CLI", () => {
  let tempDir: string;
  const binPath = path.join(process.cwd(), "bin/nubui.js");

  beforeEach(() => {
    // Create temporary directory for tests
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "nubui-cli-test-"));

    // Create icon directory structure
    const iconDir = path.join(tempDir, "src/assets/images/format/icon");
    fs.mkdirSync(iconDir, { recursive: true });

    // Create test SVG files
    fs.writeFileSync(
      path.join(iconDir, "test-icon.svg"),
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>'
    );
  });

  afterEach(() => {
    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe("icon:masks", () => {
    it("should generate SCSS file", () => {
      execSync(`node "${binPath}" icon:masks`, { cwd: tempDir });

      const scssPath = path.join(tempDir, "src/assets/css/_icon-masks.scss");
      expect(fs.existsSync(scssPath)).toBe(true);

      const scssContent = fs.readFileSync(scssPath, "utf-8");
      expect(scssContent).toContain("test-icon");
      expect(scssContent).toContain("$icon-masks");
    });

    it("should create output directory if it doesn't exist", () => {
      
      execSync(`node "${binPath}" icon:masks`, { cwd: tempDir });

      const cssDir = path.join(tempDir, "src/assets/css");
      expect(fs.existsSync(cssDir)).toBe(true);
    });
  });

  describe("icon:preview", () => {
    it("should generate HTML file", () => {
      

      // First generate masks
      execSync(`node "${binPath}" icon:masks`, { cwd: tempDir });

      // Then generate preview
      execSync(`node "${binPath}" icon:preview`, { cwd: tempDir });

      const htmlPath = path.join(tempDir, "docs/icon-preview.html");
      expect(fs.existsSync(htmlPath)).toBe(true);

      const htmlContent = fs.readFileSync(htmlPath, "utf-8");
      expect(htmlContent).toContain("Nubui Icon Preview");
      expect(htmlContent).toContain("test-icon");
      expect(htmlContent).toContain("mask-icon-test-icon");
    });

    it("should include icon CSS in HTML", () => {
      

      execSync(`node "${binPath}" icon:masks`, { cwd: tempDir });
      execSync(`node "${binPath}" icon:preview`, { cwd: tempDir });

      const htmlPath = path.join(tempDir, "docs/icon-preview.html");
      const htmlContent = fs.readFileSync(htmlPath, "utf-8");

      expect(htmlContent).toContain("mask-size: contain");
      expect(htmlContent).toContain("mask-image: url");
    });

    it("should create docs directory if it doesn't exist", () => {
      

      execSync(`node "${binPath}" icon:masks`, { cwd: tempDir });
      execSync(`node "${binPath}" icon:preview`, { cwd: tempDir });

      const docsDir = path.join(tempDir, "docs");
      expect(fs.existsSync(docsDir)).toBe(true);
    });
  });

  describe("icon:clean", () => {
    it("should remove generated SCSS file", () => {
      

      // Generate files
      execSync(`node "${binPath}" icon:masks`, { cwd: tempDir });
      execSync(`node "${binPath}" icon:preview`, { cwd: tempDir });

      const scssPath = path.join(tempDir, "src/assets/css/_icon-masks.scss");
      const htmlPath = path.join(tempDir, "docs/icon-preview.html");

      expect(fs.existsSync(scssPath)).toBe(true);
      expect(fs.existsSync(htmlPath)).toBe(true);

      // Clean
      execSync(`node "${binPath}" icon:clean`, { cwd: tempDir });

      expect(fs.existsSync(scssPath)).toBe(false);
      expect(fs.existsSync(htmlPath)).toBe(false);
    });

    it("should not error when files don't exist", () => {
      

      expect(() => {
        execSync(`node "${binPath}" icon:clean`, { cwd: tempDir });
      }).not.toThrow();
    });
  });

  describe("icon:build", () => {
    it("should generate both SCSS and HTML files", () => {
      

      // Run build (but don't actually open browser in test)
      execSync(`node "${binPath}" icon:build`, { cwd: tempDir });

      const scssPath = path.join(tempDir, "src/assets/css/_icon-masks.scss");
      const htmlPath = path.join(tempDir, "docs/icon-preview.html");

      expect(fs.existsSync(scssPath)).toBe(true);
      expect(fs.existsSync(htmlPath)).toBe(true);

      const scssContent = fs.readFileSync(scssPath, "utf-8");
      expect(scssContent).toContain("test-icon");

      const htmlContent = fs.readFileSync(htmlPath, "utf-8");
      expect(htmlContent).toContain("test-icon");
    });
  });

  describe("--help", () => {
    it("should show help message", () => {
      

      const output = execSync(`node "${binPath}" --help`, {
        encoding: "utf-8",
        cwd: tempDir,
      });

      expect(output).toContain("Nubui CLI");
      expect(output).toContain("icon:masks");
      expect(output).toContain("icon:preview");
      expect(output).toContain("icon:build");
      expect(output).toContain("icon:clean");
    });
  });

  describe("unknown command", () => {
    it("should show error and help for unknown command", () => {
      

      try {
        execSync(`node "${binPath}" unknown:command`, {
          encoding: "utf-8",
          cwd: tempDir,
        });
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.stderr.toString()).toContain("Unknown command");
      }
    });
  });
});
