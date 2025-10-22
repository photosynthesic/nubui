/**
 * Utility functions for SVG processing and encoding
 * @fileoverview Handles SVG color application and base64 encoding for Node.js environment
 */

/**
 * Apply color to SVG content by modifying stroke and fill attributes
 * @param {string} svgContent - Original SVG content
 * @param {string} color - Color value to apply
 * @returns {string} Modified SVG content with color applied
 *
 * @example
 * ```typescript
 * const coloredSvg = applySvgColor(svgContent, '#ff0000');
 * // Returns SVG with stroke and fill set to red
 * ```
 */
export function applySvgColor(svgContent: string, color: string): string {
  return svgContent
    .replace(/stroke="[^"]*"/g, `stroke="${color}"`)
    .replace(/fill="[^"]*"/g, `fill="${color}"`)
    .replace(/stroke:[\s]*[^;"]*/g, `stroke: ${color}`)
    .replace(/fill:[\s]*[^;"]*/g, `fill: ${color}`);
}

/**
 * Encode SVG content to base64 data URL
 * @param {string} svgContent - SVG content to encode
 * @returns {string} Base64 encoded data URL
 *
 * @example
 * ```typescript
 * const dataUrl = encodeSvgToBase64(svgContent);
 * // Returns: 'data:image/svg+xml;base64,PHN2Zy4uLg=='
 * ```
 */
export function encodeSvgToBase64(svgContent: string): string {
  // In Node.js environment, use Buffer for base64 encoding
  if (typeof Buffer !== "undefined") {
    const base64 = Buffer.from(svgContent, "utf-8").toString("base64");
    return `data:image/svg+xml;base64,${base64}`;
  }

  // Fallback for browser environment
  if (typeof btoa !== "undefined") {
    const base64 = btoa(unescape(encodeURIComponent(svgContent)));
    return `data:image/svg+xml;base64,${base64}`;
  }

  throw new Error("No base64 encoding method available");
}

/**
 * Encode SVG content to just base64 string (without data URL prefix)
 * @param {string} svgContent - SVG content to encode
 * @returns {string} Base64 encoded string
 *
 * @example
 * ```typescript
 * const base64 = encodeSvgToBase64String(svgContent);
 * // Returns: 'PHN2Zy4uLg=='
 * ```
 */
export function encodeSvgToBase64String(svgContent: string): string {
  // In Node.js environment, use Buffer for base64 encoding
  if (typeof Buffer !== "undefined") {
    return Buffer.from(svgContent, "utf-8").toString("base64");
  }

  // Fallback for browser environment
  if (typeof btoa !== "undefined") {
    return btoa(unescape(encodeURIComponent(svgContent)));
  }

  throw new Error("No base64 encoding method available");
}

/**
 * Clean and optimize SVG content for inline usage
 * @param {string} svgContent - Original SVG content
 * @returns {string} Cleaned SVG content
 *
 * @example
 * ```typescript
 * const cleanSvg = cleanSvgContent(rawSvg);
 * // Returns optimized SVG without comments and extra whitespace
 * ```
 */
export function cleanSvgContent(svgContent: string): string {
  let cleaned = svgContent
    // Remove XML declaration and comments
    .replace(/<\?xml[^>]*\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    // Normalize whitespace
    .replace(/\s+/g, " ")
    .trim();

  // Add viewBox if not present for proper scaling
  if (!cleaned.includes("viewBox")) {
    cleaned = cleaned.replace("<svg", '<svg viewBox="0 0 24 24"');
  }

  return cleaned;
}

/**
 * Extract viewBox dimensions from SVG content
 * @param {string} svgContent - SVG content
 * @returns {{ width: number, height: number } | null} ViewBox dimensions or null if not found
 */
export function extractSvgDimensions(
  svgContent: string
): { width: number; height: number } | null {
  const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/);
  if (viewBoxMatch) {
    const values = viewBoxMatch[1].split(/\s+/);
    if (values.length >= 4) {
      return {
        width: parseFloat(values[2]),
        height: parseFloat(values[3]),
      };
    }
  }

  // Try to extract from width/height attributes
  const widthMatch = svgContent.match(/width=["']([^"']+)["']/);
  const heightMatch = svgContent.match(/height=["']([^"']+)["']/);

  if (widthMatch && heightMatch) {
    const width = parseFloat(widthMatch[1]);
    const height = parseFloat(heightMatch[1]);
    if (!isNaN(width) && !isNaN(height)) {
      return { width, height };
    }
  }

  return null;
}
