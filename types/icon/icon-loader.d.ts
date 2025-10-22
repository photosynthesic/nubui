/**
 * Icon loading and mapping utilities for Node.js environment
 * @fileoverview Handles SVG file loading from filesystem instead of Vite glob imports
 */
import type { IconOutputMode } from "./types";
/**
 * Get list of all available icon names
 * @returns {string[]} Array of available icon names
 *
 * @example
 * ```typescript
 * const icons = getAvailableIcons();
 * console.log(icons); // ['heart-line', 'rocket-line', 'gift-line', ...]
 * ```
 */
export declare function getAvailableIcons(): string[];
/**
 * Check if an icon exists
 * @param {string} iconName - Name of the icon to check
 * @returns {boolean} True if icon exists, false otherwise
 *
 * @example
 * ```typescript
 * if (iconExists('heart-line')) {
 *   // Icon is available
 * }
 * ```
 */
export declare function iconExists(iconName: string): boolean;
/**
 * Get raw SVG content for an icon
 * @param {string} iconName - Name of the icon
 * @returns {string | null} SVG content or null if not found
 *
 * @example
 * ```typescript
 * const svgContent = getRawSvgContent('heart-line');
 * if (svgContent) {
 *   // Use the SVG content
 * }
 * ```
 */
export declare function getRawSvgContent(iconName: string): string | null;
/**
 * Get SVG file path for an icon (for img src)
 * @param {string} iconName - Name of the icon
 * @returns {string | null} SVG file path or null if not found
 *
 * @example
 * ```typescript
 * const svgPath = getSvgFilePath('heart-line');
 * if (svgPath) {
 *   img.src = svgPath;
 * }
 * ```
 */
export declare function getSvgFilePath(iconName: string): string | null;
/**
 * Validate icon arguments and provide detailed error messages
 * @param {string} iconName - Name of the icon
 * @param {IconOutputMode} mode - Output mode
 * @throws {Error} If arguments are invalid
 *
 * @example
 * ```typescript
 * try {
 *   validateIconArgs('heart-line', 'mask');
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export declare function validateIconArgs(iconName: string, mode: IconOutputMode): void;
/**
 * Set the icon directory (useful for testing or custom configurations)
 * @param {string} directory - Path to the icon directory
 */
export declare function setIconDirectory(directory: string): void;
/**
 * Clear icon caches (useful for testing or when icons are updated)
 */
export declare function clearIconCache(): void;
