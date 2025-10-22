import { describe, it, expect } from "vitest";
import {
  applySvgColor,
  encodeSvgToBase64,
  encodeSvgToBase64String,
  cleanSvgContent,
  extractSvgDimensions,
} from "../../src/icon/svg-utils";

describe("SVG Utils", () => {
  describe("applySvgColor", () => {
    it("should replace fill attribute with color", () => {
      const svg = '<svg><circle fill="black" r="10"/></svg>';
      const result = applySvgColor(svg, "#ff0000");
      expect(result).toContain('fill="#ff0000"');
      expect(result).not.toContain('fill="black"');
    });

    it("should replace stroke attribute with color", () => {
      const svg = '<svg><path stroke="blue" d="M0,0 L10,10"/></svg>';
      const result = applySvgColor(svg, "#00ff00");
      expect(result).toContain('stroke="#00ff00"');
      expect(result).not.toContain('stroke="blue"');
    });

    it("should replace both fill and stroke attributes", () => {
      const svg =
        '<svg><rect fill="red" stroke="blue" width="10" height="10"/></svg>';
      const result = applySvgColor(svg, "#ffffff");
      expect(result).toContain('fill="#ffffff"');
      expect(result).toContain('stroke="#ffffff"');
    });

    it("should replace fill in style attribute", () => {
      const svg = '<svg><circle style="fill: #000000" r="10"/></svg>';
      const result = applySvgColor(svg, "#ff0000");
      expect(result).toContain("fill: #ff0000");
      expect(result).not.toContain("fill: #000000");
    });

    it("should replace stroke in style attribute", () => {
      const svg = '<svg><path style="stroke: blue; fill: red" d="M0,0"/></svg>';
      const result = applySvgColor(svg, "#00ff00");
      expect(result).toContain("stroke: #00ff00");
      expect(result).toContain("fill: #00ff00");
    });

    it("should handle multiple elements with colors", () => {
      const svg =
        '<svg><circle fill="red"/><rect stroke="blue"/><path fill="green" stroke="yellow"/></svg>';
      const result = applySvgColor(svg, "#ffffff");
      expect(result).toContain('fill="#ffffff"');
      expect(result).toContain('stroke="#ffffff"');
      expect(result).not.toContain("red");
      expect(result).not.toContain("blue");
      expect(result).not.toContain("green");
      expect(result).not.toContain("yellow");
    });

    it("should work with rgb colors", () => {
      const svg = '<svg><circle fill="currentColor" r="10"/></svg>';
      const result = applySvgColor(svg, "rgb(255,0,0)");
      expect(result).toContain('fill="rgb(255,0,0)"');
    });

    it("should work with hsl colors", () => {
      const svg = '<svg><circle fill="currentColor" r="10"/></svg>';
      const result = applySvgColor(svg, "hsl(120,100%,50%)");
      expect(result).toContain('fill="hsl(120,100%,50%)"');
    });
  });

  describe("encodeSvgToBase64", () => {
    it("should encode SVG to base64 data URL", () => {
      const svg = "<svg></svg>";
      const result = encodeSvgToBase64(svg);
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    it("should produce valid base64 encoding", () => {
      const svg = '<svg><circle r="10"/></svg>';
      const result = encodeSvgToBase64(svg);
      const base64Part = result.replace("data:image/svg+xml;base64,", "");

      // Decode and verify
      const decoded = Buffer.from(base64Part, "base64").toString("utf-8");
      expect(decoded).toBe(svg);
    });

    it("should handle SVG with special characters", () => {
      const svg = '<svg><text>Test & "quotes" \'apostrophe\'</text></svg>';
      const result = encodeSvgToBase64(svg);
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);

      const base64Part = result.replace("data:image/svg+xml;base64,", "");
      const decoded = Buffer.from(base64Part, "base64").toString("utf-8");
      expect(decoded).toBe(svg);
    });
  });

  describe("encodeSvgToBase64String", () => {
    it("should encode SVG to base64 string without data URL prefix", () => {
      const svg = "<svg></svg>";
      const result = encodeSvgToBase64String(svg);
      expect(result).not.toContain("data:image/svg+xml;base64,");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should produce valid base64 string", () => {
      const svg = '<svg><circle r="10"/></svg>';
      const result = encodeSvgToBase64String(svg);

      // Decode and verify
      const decoded = Buffer.from(result, "base64").toString("utf-8");
      expect(decoded).toBe(svg);
    });
  });

  describe("cleanSvgContent", () => {
    it("should remove XML declaration", () => {
      const svg = '<?xml version="1.0" encoding="UTF-8"?><svg></svg>';
      const result = cleanSvgContent(svg);
      expect(result).not.toContain("<?xml");
      expect(result).toContain("<svg");
    });

    it("should remove comments", () => {
      const svg = "<svg><!-- This is a comment --><circle r=\"10\"/></svg>";
      const result = cleanSvgContent(svg);
      expect(result).not.toContain("<!--");
      expect(result).not.toContain("This is a comment");
      expect(result).toContain("<circle");
    });

    it("should normalize whitespace", () => {
      const svg = "<svg>\n  \n  <circle   r=\"10\"  />\n</svg>";
      const result = cleanSvgContent(svg);
      expect(result).not.toContain("\n");
      // Whitespace is normalized, and viewBox is added by cleanSvgContent
      expect(result).toBe('<svg viewBox="0 0 24 24"> <circle r="10" /> </svg>');
    });

    it("should add viewBox if not present", () => {
      const svg = "<svg><circle r=\"10\"/></svg>";
      const result = cleanSvgContent(svg);
      expect(result).toContain('viewBox="0 0 24 24"');
    });

    it("should not add viewBox if already present", () => {
      const svg = '<svg viewBox="0 0 16 16"><circle r="10"/></svg>';
      const result = cleanSvgContent(svg);
      expect(result).toContain('viewBox="0 0 16 16"');
      expect(result).not.toContain('viewBox="0 0 24 24"');
    });

    it("should trim leading and trailing whitespace", () => {
      const svg = "   <svg></svg>   ";
      const result = cleanSvgContent(svg);
      expect(result).toBe("<svg viewBox=\"0 0 24 24\"></svg>");
    });

    it("should handle multiline comments", () => {
      const svg = `<svg>
        <!--
          Multi-line
          comment
        -->
        <circle r="10"/>
      </svg>`;
      const result = cleanSvgContent(svg);
      expect(result).not.toContain("<!--");
      expect(result).not.toContain("Multi-line");
      expect(result).toContain("<circle");
    });
  });

  describe("extractSvgDimensions", () => {
    it("should extract dimensions from viewBox", () => {
      const svg = '<svg viewBox="0 0 24 24"></svg>';
      const result = extractSvgDimensions(svg);
      expect(result).toEqual({ width: 24, height: 24 });
    });

    it("should extract dimensions from different viewBox values", () => {
      const svg = '<svg viewBox="0 0 100 50"></svg>';
      const result = extractSvgDimensions(svg);
      expect(result).toEqual({ width: 100, height: 50 });
    });

    it("should extract dimensions from width/height attributes when viewBox is missing", () => {
      const svg = '<svg width="32" height="32"></svg>';
      const result = extractSvgDimensions(svg);
      expect(result).toEqual({ width: 32, height: 32 });
    });

    it("should prefer viewBox over width/height attributes", () => {
      const svg = '<svg viewBox="0 0 24 24" width="32" height="32"></svg>';
      const result = extractSvgDimensions(svg);
      expect(result).toEqual({ width: 24, height: 24 });
    });

    it("should return null when no dimensions found", () => {
      const svg = "<svg></svg>";
      const result = extractSvgDimensions(svg);
      expect(result).toBe(null);
    });

    it("should handle viewBox with single quotes", () => {
      const svg = "<svg viewBox='0 0 16 16'></svg>";
      const result = extractSvgDimensions(svg);
      expect(result).toEqual({ width: 16, height: 16 });
    });

    it("should handle decimal values in viewBox", () => {
      const svg = '<svg viewBox="0 0 24.5 12.3"></svg>';
      const result = extractSvgDimensions(svg);
      expect(result).toEqual({ width: 24.5, height: 12.3 });
    });

    it("should return null for invalid width/height", () => {
      const svg = '<svg width="invalid" height="invalid"></svg>';
      const result = extractSvgDimensions(svg);
      expect(result).toBe(null);
    });
  });
});
