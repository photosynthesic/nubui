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
export declare function applySvgColor(svgContent: string, color: string): string;
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
export declare function encodeSvgToBase64(svgContent: string): string;
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
export declare function encodeSvgToBase64String(svgContent: string): string;
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
export declare function cleanSvgContent(svgContent: string): string;
/**
 * Extract viewBox dimensions from SVG content
 * @param {string} svgContent - SVG content
 * @returns {{ width: number, height: number } | null} ViewBox dimensions or null if not found
 */
export declare function extractSvgDimensions(svgContent: string): {
    width: number;
    height: number;
} | null;
